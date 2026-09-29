// Almacenamiento en Supabase, con la misma API que usaba la versión local
// (add/set/update/remove/subscribe), para que app.js no necesite cambios.
// Queda "no disponible" hasta que auth.js llama a Store.connect() tras el login.
(function () {
  "use strict";

  var TABLES = {
    transactions: {
      table: "transactions",
      idCol: "id",
      order: { column: "date", ascending: false },
      toRow: function (data) {
        return { type: data.type, category: data.category, amount: data.amount, note: data.note || "", date: data.date };
      },
      toDoc: function (row) {
        return {
          type: row.type, category: row.category, amount: Number(row.amount), note: row.note || "", date: row.date,
          createdAt: row.created_at ? new Date(row.created_at).getTime() : 0
        };
      }
    },
    goals: {
      table: "goals",
      idCol: "id",
      order: { column: "created_at", ascending: false },
      toRow: function (data) {
        return { name: data.name, kind: data.kind, target: data.target, current: data.current };
      },
      toDoc: function (row) {
        return {
          name: row.name, kind: row.kind, target: Number(row.target), current: Number(row.current),
          createdAt: row.created_at ? new Date(row.created_at).getTime() : 0
        };
      }
    },
    budgets: {
      table: "budgets",
      idCol: "category_id",
      order: null,
      toRow: function (data) {
        return { limit_amount: data.limit, updated_at: new Date().toISOString() };
      },
      toDoc: function (row) {
        return { categoryId: row.category_id, limit: Number(row.limit_amount), updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : 0 };
      }
    }
  };

  var client = null, userId = null, ready = false;
  var listeners = {};  // collection -> Set(fn)
  var cache = {};      // collection -> last known list
  var channels = {};   // collection -> realtime channel

  function docFromRow(collection, row) {
    var doc = TABLES[collection].toDoc(row);
    doc.id = row[TABLES[collection].idCol];
    return doc;
  }

  function refetch(collection) {
    var cfg = TABLES[collection];
    var q = client.from(cfg.table).select("*").eq("user_id", userId);
    if (cfg.order) q = q.order(cfg.order.column, { ascending: cfg.order.ascending });
    return q.then(function (res) {
      if (res.error) { return; }
      cache[collection] = (res.data || []).map(function (row) { return docFromRow(collection, row); });
      notify(collection);
    });
  }

  function notify(collection) {
    var subs = listeners[collection];
    if (!subs) return;
    var list = cache[collection] || [];
    subs.forEach(function (fn) { try { fn(list); } catch (e) {} });
  }

  function ensureChannel(collection) {
    if (channels[collection] || !client) return;
    var cfg = TABLES[collection];
    channels[collection] = client
      .channel("mf-" + collection + "-" + userId)
      .on("postgres_changes", { event: "*", schema: "public", table: cfg.table, filter: "user_id=eq." + userId }, function () {
        refetch(collection);
      })
      .subscribe();
  }

  var Store = {
    available: false,

    // Llamado por auth.js apenas hay sesión activa.
    connect: function (supabaseClient, uid) {
      client = supabaseClient; userId = uid; ready = true; Store.available = true;
      Object.keys(listeners).forEach(function (collection) {
        ensureChannel(collection);
        refetch(collection);
      });
    },

    // Llamado por auth.js al cerrar sesión.
    disconnect: function () {
      Object.keys(channels).forEach(function (c) {
        try { client && client.removeChannel(channels[c]); } catch (e) {}
      });
      channels = {}; cache = {}; client = null; userId = null; ready = false; Store.available = false;
    },

    // Cada escritura vuelve a leer y avisa a los que escuchan ella misma
    // (no depende de que llegue el evento de Realtime, que puede tardar o no
    // estar habilitado): así el propio dispositivo se actualiza al instante.

    add: function (collection, data) {
      if (!ready) return Promise.reject(new Error("not_ready"));
      var cfg = TABLES[collection];
      var row = cfg.toRow(data);
      row.user_id = userId;
      return client.from(cfg.table).insert(row).select().single().then(function (res) {
        if (res.error) throw res.error;
        var doc = docFromRow(collection, res.data);
        return refetch(collection).then(function () { return doc; });
      });
    },

    set: function (collection, id, data) {
      if (!ready) return Promise.reject(new Error("not_ready"));
      var cfg = TABLES[collection];
      var row = cfg.toRow(data);
      row.user_id = userId;
      row[cfg.idCol] = id;
      return client.from(cfg.table).upsert(row, { onConflict: "user_id," + cfg.idCol }).then(function (res) {
        if (res.error) throw res.error;
        return refetch(collection);
      });
    },

    update: function (collection, id, partial) {
      if (!ready) return Promise.reject(new Error("not_ready"));
      var cfg = TABLES[collection];
      return client.from(cfg.table).update(partial).eq(cfg.idCol, id).eq("user_id", userId).then(function (res) {
        if (res.error) throw res.error;
        return refetch(collection);
      });
    },

    remove: function (collection, id) {
      if (!ready) return Promise.reject(new Error("not_ready"));
      var cfg = TABLES[collection];
      return client.from(cfg.table).delete().eq(cfg.idCol, id).eq("user_id", userId).then(function (res) {
        if (res.error) throw res.error;
        return refetch(collection);
      });
    },

    // Entrega el estado actual ahora, y de nuevo cada vez que cambie (incluye
    // cambios hechos desde otro dispositivo, vía Supabase Realtime).
    subscribe: function (collection, fn) {
      if (!listeners[collection]) listeners[collection] = new Set();
      listeners[collection].add(fn);
      if (ready) {
        ensureChannel(collection);
        fn(cache[collection] || []);
        refetch(collection);
      } else {
        fn([]);
      }
      return function unsubscribe() {
        if (listeners[collection]) listeners[collection].delete(fn);
      };
    }
  };

  window.Store = Store;
})();
