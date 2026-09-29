// Almacenamiento local (por navegador/dispositivo). Misma forma de API que usaríamos
// con un backend real (list/add/set/update/delete/subscribe), para poder cambiar
// el motor de guardado más adelante (por ejemplo a Supabase) sin tocar app.js.
(function () {
  "use strict";

  var PREFIX = "mf_";
  var listeners = {}; // collection -> Set(callback)

  function key(collection) { return PREFIX + collection; }

  function readAll(collection) {
    try {
      var raw = localStorage.getItem(key(collection));
      var val = raw ? JSON.parse(raw) : {};
      return val && typeof val === "object" ? val : {};
    } catch (e) {
      return {};
    }
  }

  function writeAll(collection, map) {
    try {
      localStorage.setItem(key(collection), JSON.stringify(map));
      return true;
    } catch (e) {
      return false;
    }
  }

  function notify(collection) {
    var subs = listeners[collection];
    if (!subs) return;
    var list = toList(collection);
    subs.forEach(function (fn) {
      try { fn(list); } catch (e) {}
    });
  }

  function toList(collection) {
    var map = readAll(collection);
    return Object.keys(map).map(function (id) {
      var doc = map[id] || {};
      var out = { id: id };
      Object.keys(doc).forEach(function (k) { out[k] = doc[k]; });
      return out;
    });
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }

  var Store = {
    available: (function () {
      try {
        var t = "__mf_test__";
        localStorage.setItem(t, "1");
        localStorage.removeItem(t);
        return true;
      } catch (e) {
        return false;
      }
    })(),

    list: function (collection) {
      return Promise.resolve(toList(collection));
    },

    add: function (collection, data) {
      var map = readAll(collection);
      var id = uuid();
      map[id] = data;
      writeAll(collection, map);
      notify(collection);
      return Promise.resolve(Object.assign({ id: id }, data));
    },

    set: function (collection, id, data) {
      var map = readAll(collection);
      map[id] = data;
      writeAll(collection, map);
      notify(collection);
      return Promise.resolve();
    },

    update: function (collection, id, partial) {
      var map = readAll(collection);
      map[id] = Object.assign({}, map[id] || {}, partial);
      writeAll(collection, map);
      notify(collection);
      return Promise.resolve();
    },

    remove: function (collection, id) {
      var map = readAll(collection);
      delete map[id];
      writeAll(collection, map);
      notify(collection);
      return Promise.resolve();
    },

    // Llama a fn ahora mismo con el estado actual, y de nuevo cada vez que cambie
    // (incluye cambios hechos desde otra pestaña del mismo navegador).
    subscribe: function (collection, fn) {
      if (!listeners[collection]) listeners[collection] = new Set();
      listeners[collection].add(fn);
      fn(toList(collection));
      return function unsubscribe() {
        if (listeners[collection]) listeners[collection].delete(fn);
      };
    }
  };

  window.addEventListener("storage", function (e) {
    if (!e.key || e.key.indexOf(PREFIX) !== 0) return;
    var collection = e.key.slice(PREFIX.length);
    notify(collection);
  });

  window.Store = Store;
})();
