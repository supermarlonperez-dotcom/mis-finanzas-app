(function(){
  "use strict";

  // ---------- icon system: one consistent line-icon style, 20x20 viewBox ----------
  var ICON_PATHS = {
    wallet: '<path d="M3 6.5A1.5 1.5 0 014.5 5h10A1.5 1.5 0 0116 6.5V15a1.5 1.5 0 01-1.5 1.5h-10A1.5 1.5 0 013 15V6.5z"/><path d="M3 8h13.5a1 1 0 011 1v2.4a1 1 0 01-1 1H14a1.7 1.7 0 010-3.4h2.5"/>',
    chart: '<path d="M4 15.5V9.5M9.5 15.5V4.5M15 15.5v-5"/><path d="M2.5 17.5h15"/>',
    exchange: '<path d="M3.5 6.5h11M11.5 3l3 3.5-3 3.5M16.5 13.5h-11M8.5 10l-3 3.5 3 3.5"/>',
    target: '<circle cx="10" cy="10" r="6.8"/><circle cx="10" cy="10" r="2.6"/>',
    flag: '<path d="M5.5 2.5v15"/><path d="M5.5 3.5h9l-2.3 3.3 2.3 3.3h-9"/>',
    trendUp: '<path d="M3 14l4.7-4.7 3 3L16.5 4.8"/><path d="M12 4.5h4.5V9"/>',
    trendDown: '<path d="M3 6l4.7 4.7 3-3L16.5 15.2"/><path d="M12 15.5h4.5V11"/>',
    scale: '<path d="M10 3v14M6.5 5.5h7"/><path d="M4 6l-2.3 5a2.3 2.3 0 004.6 0z"/><path d="M16 6l-2.3 5a2.3 2.3 0 004.6 0z"/><path d="M6.5 17h7"/>',
    fork: '<path d="M6.3 2.5v5.4M8 2.5v5.4M9.7 2.5v5.4M6.3 7.9c0 1.8 1.7 1.8 1.7 1.8s1.7 0 1.7-1.8M8 9.7v7.8"/><path d="M13.5 2.5c-1.3 0-2 1.3-2 3.5s.7 3.9 2 3.9M13.5 2.5c1.3 0 2 1.3 2 3.5s-.7 3.9-2 3.9M13.5 9.9v7.6"/>',
    car: '<path d="M3.2 12.2l1.2-4.1A2 2 0 016.3 6.7h7.4a2 2 0 011.9 1.4l1.2 4.1"/><rect x="2.2" y="12.2" width="15.6" height="3.6" rx="1"/><circle cx="6" cy="15.8" r="1.1"/><circle cx="14" cy="15.8" r="1.1"/>',
    home: '<path d="M3 9.3L10 3.5l7 5.8"/><path d="M5 8.2V16h10V8.2"/><path d="M8.3 16v-4.3h3.4V16"/>',
    bolt: '<path d="M11 2.3L4.3 11.5h4.8l-1 6.2 6.6-9.6H9.9l1.1-5.8z"/>',
    heart: '<path d="M10 17s-6.3-4-6.3-8.5a3.5 3.5 0 016.3-2.2 3.5 3.5 0 016.3 2.2C16.3 13 10 17 10 17z"/>',
    star: '<path d="M10 2.6l2.2 4.6 5 .6-3.7 3.5 1 5-4.5-2.5-4.5 2.5 1-5-3.7-3.5 5-.6z"/>',
    book: '<path d="M2.3 5.5L10 2.3l7.7 3.2L10 8.7z"/><path d="M5.4 6.9v5.7c0 1.1 1.9 2.1 4.6 2.1s4.6-1 4.6-2.1V6.9"/>',
    shirt: '<path d="M7 3.2L3.3 5.9l1.8 2.6 1.9-1V17h6V7.5l1.9 1 1.8-2.6L13 3.2l-1.8 1.7h-2.4z"/>',
    dots: '<circle cx="5.5" cy="10" r="1.3"/><circle cx="10" cy="10" r="1.3"/><circle cx="14.5" cy="10" r="1.3"/>',
    briefcase: '<rect x="3" y="7" width="14" height="9.2" rx="1.4"/><path d="M7 7V5.6A1.6 1.6 0 018.6 4h2.8A1.6 1.6 0 0113 5.6V7"/><path d="M3 11.2h14"/>',
    laptop: '<rect x="3.3" y="4.5" width="13.4" height="8.6" rx="1"/><path d="M1.3 16h17.4"/>',
    invest: '<path d="M3 14.5l4.4-4.4 3 3L16.5 6.9"/><path d="M12.6 6.9h3.9v3.9"/>',
    gift: '<rect x="3" y="8.2" width="14" height="8.6" rx="1"/><path d="M3 11.3h14"/><path d="M10 8.2v8.6"/><path d="M10 8.2c-1.6-3.1-5.2-2.9-5.2-.9S7.2 8.2 10 8.2zM10 8.2c1.6-3.1 5.2-2.9 5.2-.9S12.8 8.2 10 8.2z"/>'
  };
  function icon(name, size){
    size = size || 18;
    return '<svg class="icon" width="'+size+'" height="'+size+'" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+(ICON_PATHS[name]||'')+'</svg>';
  }

  var EXPENSE_CATS = [
    {id:'comida', label:'Comida', icon:'fork'},
    {id:'transporte', label:'Transporte', icon:'car'},
    {id:'vivienda', label:'Vivienda', icon:'home'},
    {id:'servicios', label:'Servicios', icon:'bolt'},
    {id:'salud', label:'Salud', icon:'heart'},
    {id:'entretenimiento', label:'Entretenimiento', icon:'star'},
    {id:'educacion', label:'Educación', icon:'book'},
    {id:'ropa', label:'Ropa', icon:'shirt'},
    {id:'otros', label:'Otros', icon:'dots'}
  ];
  var INCOME_CATS = [
    {id:'sueldo', label:'Sueldo', icon:'briefcase'},
    {id:'freelance', label:'Freelance', icon:'laptop'},
    {id:'inversiones', label:'Inversiones', icon:'invest'},
    {id:'regalo', label:'Regalo', icon:'gift'},
    {id:'otros', label:'Otros', icon:'dots'}
  ];
  var TABS = [
    {id:'resumen', label:'Resumen', icon:'chart'},
    {id:'movimientos', label:'Movimientos', icon:'exchange'},
    {id:'presupuestos', label:'Presupuestos', icon:'target'},
    {id:'metas', label:'Metas', icon:'flag'}
  ];
  var CHART_VARS = ['--chart-1','--chart-2','--chart-3','--chart-4','--chart-5','--chart-6','--chart-7','--chart-8','--chart-9'];

  function findCat(type, id){
    var list = type === 'income' ? INCOME_CATS : EXPENSE_CATS;
    for (var i=0;i<list.length;i++){ if(list[i].id===id) return list[i]; }
    return {id:id, label:id, icon:'dots'};
  }
  function catLabel(type, id){ return findCat(type, id).label; }
  function catColorVar(id){
    var idx = 0;
    for (var i=0;i<EXPENSE_CATS.length;i++){ if(EXPENSE_CATS[i].id===id){ idx=i; break; } }
    return CHART_VARS[idx % CHART_VARS.length];
  }
  function fmt(n){
    var v = Math.round(n || 0);
    var sign = v < 0 ? '-' : '';
    return sign + '$' + new Intl.NumberFormat('es-AR',{maximumFractionDigits:0}).format(Math.abs(v));
  }
  function todayISO(){ return new Date().toISOString().slice(0,10); }
  function monthKey(dateStr){ return (dateStr||'').slice(0,7); }
  function monthLabel(key){
    var parts = key.split('-'); var y = +parts[0], m = +parts[1]-1;
    var d = new Date(y, m, 1);
    var s = d.toLocaleDateString('es-AR', {month:'short'});
    return s.charAt(0).toUpperCase() + s.slice(1).replace('.','');
  }
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; });
  }

  var state = { transactions: [], budgets: {}, goals: [], txType: 'expense', goalType: 'saving' };

  // ---------- brand marks + nav labels ----------
  document.getElementById('railMark').innerHTML = icon('wallet', 19);
  document.getElementById('topMark').innerHTML = icon('wallet', 19);
  document.getElementById('iconIncome').innerHTML = icon('trendUp', 15);
  document.getElementById('iconExpense').innerHTML = icon('trendDown', 15);
  document.getElementById('iconNet').innerHTML = icon('scale', 15);
  document.getElementById('savingsTitle').innerHTML = icon('star', 14) + '<span>Ahorros</span>';
  document.getElementById('debtsTitle').innerHTML = icon('flag', 14) + '<span>Deudas</span>';

  document.querySelectorAll('#tabs .navlink').forEach(function(btn){
    var t = TABS.filter(function(x){ return x.id === btn.dataset.tab; })[0];
    btn.innerHTML = icon(t.icon, 17) + '<span>' + t.label + '</span>';
  });

  document.getElementById('tabs').addEventListener('click', function(e){
    var btn = e.target.closest('.navlink');
    if(!btn) return;
    document.querySelectorAll('.navlink').forEach(function(t){ t.classList.toggle('active', t===btn); });
    document.querySelectorAll('.view').forEach(function(v){ v.classList.remove('active'); });
    document.getElementById('view-' + btn.dataset.tab).classList.add('active');
  });

  // ---------- transaction form ----------
  var txCategorySel = document.getElementById('txCategory');
  function refreshTxCategories(){
    var list = state.txType === 'income' ? INCOME_CATS : EXPENSE_CATS;
    txCategorySel.innerHTML = list.map(function(c){ return '<option value="'+c.id+'">'+c.label+'</option>'; }).join('');
  }
  document.querySelectorAll('#txForm .type-toggle button').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('#txForm .type-toggle button').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      state.txType = btn.dataset.t;
      refreshTxCategories();
    });
  });
  refreshTxCategories();
  document.getElementById('txDate').value = todayISO();

  document.getElementById('txForm').addEventListener('submit', function(e){
    e.preventDefault();
    if (!Store.available) return;
    var amount = parseFloat(document.getElementById('txAmount').value);
    if (!isFinite(amount) || amount <= 0) return;
    var payload = {
      type: state.txType,
      amount: amount,
      category: txCategorySel.value,
      note: document.getElementById('txNote').value.slice(0,80),
      date: document.getElementById('txDate').value || todayISO(),
      createdAt: Date.now()
    };
    Store.add('transactions', payload).then(function(){
      document.getElementById('txAmount').value = '';
      document.getElementById('txNote').value = '';
      document.getElementById('txDate').value = todayISO();
    });
  });

  // ---------- goal form ----------
  document.querySelectorAll('#goalForm .type-toggle button').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('#goalForm .type-toggle button').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      state.goalType = btn.dataset.g;
    });
  });
  document.getElementById('goalForm').addEventListener('submit', function(e){
    e.preventDefault();
    if (!Store.available) return;
    var name = document.getElementById('goalName').value.trim();
    var target = parseFloat(document.getElementById('goalTarget').value);
    var current = parseFloat(document.getElementById('goalCurrent').value) || 0;
    if (!name || !isFinite(target) || target <= 0) return;
    Store.add('goals', { name: name, kind: state.goalType, target: target, current: Math.max(0,current), createdAt: Date.now() }).then(function(){
      document.getElementById('goalName').value = '';
      document.getElementById('goalTarget').value = '';
      document.getElementById('goalCurrent').value = '';
    });
  });

  // ---------- render: summary ----------
  function computeTotals(){
    var total = 0, monthIncome = 0, monthExpense = 0;
    var curMonth = monthKey(todayISO());
    state.transactions.forEach(function(t){
      var signed = t.type === 'income' ? t.amount : -t.amount;
      total += signed;
      if (monthKey(t.date) === curMonth){
        if (t.type === 'income') monthIncome += t.amount; else monthExpense += t.amount;
      }
    });
    return {total:total, monthIncome:monthIncome, monthExpense:monthExpense};
  }

  function renderSummary(){
    var totals = computeTotals();
    var balEl = document.getElementById('totalBalance');
    balEl.textContent = fmt(totals.total);
    balEl.classList.toggle('neg', totals.total < 0);
    document.getElementById('statIncome').textContent = fmt(totals.monthIncome);
    document.getElementById('statExpense').textContent = fmt(totals.monthExpense);
    var netEl = document.getElementById('statNet');
    var net = totals.monthIncome - totals.monthExpense;
    netEl.textContent = fmt(net);
    netEl.style.color = net >= 0 ? 'var(--positive)' : 'var(--negative)';

    renderDonut();
    renderBars();
    renderRecent();
  }

  function emptyState(iconName, title, sub){
    return '<div class="empty">'+icon(iconName,28)+'<strong>'+title+'</strong><span>'+sub+'</span></div>';
  }

  function renderDonut(){
    var curMonth = monthKey(todayISO());
    var byCat = {};
    state.transactions.forEach(function(t){
      if (t.type !== 'expense' || monthKey(t.date) !== curMonth) return;
      byCat[t.category] = (byCat[t.category]||0) + t.amount;
    });
    var entries = Object.keys(byCat).map(function(k){ return {cat:k, val:byCat[k]}; }).sort(function(a,b){ return b.val-a.val; });
    var wrap = document.getElementById('donutWrap');
    if (!entries.length){
      wrap.innerHTML = emptyState('chart', 'Sin gastos este mes', 'Cuando cargues un gasto, acá vas a ver de qué se compone.');
      return;
    }
    var total = entries.reduce(function(s,e){ return s+e.val; }, 0);
    var size = 172, r = 63, cx = size/2, cy = size/2, sw = 27;
    var circumference = 2 * Math.PI * r;
    var offset = 0;
    var paths = entries.map(function(e){
      var frac = e.val/total;
      var dash = frac * circumference;
      var gapPx = entries.length > 1 ? 2 : 0;
      var seg = '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="var('+catColorVar(e.cat)+')" stroke-width="'+sw+'" ' +
        'stroke-dasharray="'+Math.max(dash-gapPx,0).toFixed(2)+' '+(circumference-dash+gapPx).toFixed(2)+'" stroke-dashoffset="'+(-offset).toFixed(2)+'" transform="rotate(-90 '+cx+' '+cy+')"></circle>';
      offset += dash;
      return seg;
    }).join('');
    var svg = '<svg viewBox="0 0 '+size+' '+size+'" width="'+size+'" height="'+size+'" role="img" aria-label="Gastos por categoría">' +
      '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="var(--surface-2)" stroke-width="'+sw+'"></circle>' +
      paths +
      '<text x="'+cx+'" y="'+(cy-4)+'" text-anchor="middle" font-family="Work Sans" font-size="10.5" font-weight="600" letter-spacing=".03em" fill="var(--ink-soft)">TOTAL</text>' +
      '<text x="'+cx+'" y="'+(cy+15)+'" text-anchor="middle" font-family="IBM Plex Mono" font-size="14" font-weight="600" fill="var(--ink)">'+fmt(total)+'</text>' +
      '</svg>';
    var legend = '<div class="legend">' + entries.map(function(e){
      var pct = Math.round(e.val/total*100);
      return '<div class="legend-row"><span class="legend-dot" style="background:var('+catColorVar(e.cat)+')"></span>' +
        '<span class="lg-label">'+catLabel('expense', e.cat)+'</span>' +
        '<span class="lg-val num">'+fmt(e.val)+' · '+pct+'%</span></div>';
    }).join('') + '</div>';
    wrap.innerHTML = '<div class="chart-wrap">' + svg + '<div style="flex:1; min-width:180px;">' + legend + '</div></div>';
  }

  function last6Months(){
    var out = [];
    var d = new Date();
    d.setDate(1);
    for (var i=5;i>=0;i--){
      var dd = new Date(d.getFullYear(), d.getMonth()-i, 1);
      var key = dd.getFullYear() + '-' + String(dd.getMonth()+1).padStart(2,'0');
      out.push(key);
    }
    return out;
  }

  function renderBars(){
    var months = last6Months();
    var data = months.map(function(k){
      var inc=0, exp=0;
      state.transactions.forEach(function(t){
        if (monthKey(t.date) !== k) return;
        if (t.type==='income') inc += t.amount; else exp += t.amount;
      });
      return {key:k, label: monthLabel(k), inc:inc, exp:exp};
    });
    var wrap = document.getElementById('barWrap');
    var hasAny = data.some(function(d){ return d.inc>0 || d.exp>0; });
    if (!hasAny){
      wrap.innerHTML = emptyState('exchange', 'Todavía no hay movimientos', 'El comparativo mensual aparece apenas cargues el primero.');
      return;
    }
    var maxVal = Math.max.apply(null, data.map(function(d){ return Math.max(d.inc, d.exp); })) || 1;
    var w = 620, h = 190, padL = 6, padB = 22, padT = 8;
    var groupW = (w - padL*2) / data.length;
    var barW = Math.min(20, groupW*0.32);
    var chartH = h - padB - padT;
    var bars = data.map(function(d, i){
      var gx = padL + i*groupW + groupW/2;
      var incH = (d.inc/maxVal) * chartH;
      var expH = (d.exp/maxVal) * chartH;
      var incX = gx - barW - 2, expX = gx + 2;
      var incY = padT + (chartH - incH), expY = padT + (chartH - expH);
      return (
        '<rect x="'+incX.toFixed(1)+'" y="'+incY.toFixed(1)+'" width="'+barW+'" height="'+Math.max(incH,1).toFixed(1)+'" rx="3" fill="var(--positive)"></rect>' +
        '<rect x="'+expX.toFixed(1)+'" y="'+expY.toFixed(1)+'" width="'+barW+'" height="'+Math.max(expH,1).toFixed(1)+'" rx="3" fill="var(--negative)"></rect>' +
        '<text x="'+gx.toFixed(1)+'" y="'+(h-6)+'" text-anchor="middle" font-family="Work Sans" font-size="10.5" fill="var(--ink-soft)">'+d.label+'</text>'
      );
    }).join('');
    var svg = '<svg viewBox="0 0 '+w+' '+h+'" width="100%" height="'+h+'" role="img" aria-label="Ingresos y gastos por mes" preserveAspectRatio="xMidYMid meet">' +
      '<line x1="0" y1="'+(padT+chartH)+'" x2="'+w+'" y2="'+(padT+chartH)+'" stroke="var(--border)" stroke-width="1"></line>' +
      bars + '</svg>';
    var legend = '<div style="display:flex; gap:16px; margin-top:8px; font-size:12.5px; color:var(--ink-soft);">' +
      '<span><span class="legend-dot" style="background:var(--positive); display:inline-block; margin-right:5px;"></span>Ingresos</span>' +
      '<span><span class="legend-dot" style="background:var(--negative); display:inline-block; margin-right:5px;"></span>Gastos</span></div>';
    wrap.innerHTML = svg + legend;
  }

  function renderRecent(){
    var sorted = state.transactions.slice().sort(function(a,b){ return (b.date+String(b.createdAt||0)).localeCompare(a.date+String(a.createdAt||0)); });
    var top = sorted.slice(0,5);
    var el = document.getElementById('recentList');
    if (!top.length){ el.innerHTML = emptyState('wallet', 'Sin movimientos todavía', 'Andá a la pestaña Movimientos para sumar el primero.'); return; }
    el.innerHTML = top.map(function(t){ return txRowHTML(t, false); }).join('');
  }

  // ---------- render: transactions list ----------
  function txRowHTML(t, withDelete){
    var cat = findCat(t.type, t.category);
    var colorVar = catColorVar(t.category);
    var sign = t.type === 'income' ? '+' : '-';
    var delBtn = withDelete ? '<button class="tx-del" data-id="'+t.id+'">Eliminar</button>' : '';
    return '<div class="tx-row">' +
      '<div class="tx-cat" style="background:var('+colorVar+'); color:#fff;">'+icon(cat.icon,17)+'</div>' +
      '<div class="tx-info"><div class="cat">'+cat.label+'</div>' +
      '<div class="note">'+(t.note ? escapeHtml(t.note) : t.date)+'</div></div>' +
      '<div class="tx-amount num '+t.type+'">'+sign+fmt(t.amount)+'</div>' + delBtn + '</div>';
  }

  function renderTxList(){
    var el = document.getElementById('txList');
    if (!state.transactions.length){ el.innerHTML = emptyState('exchange', 'Sin movimientos todavía', 'Usá el formulario de arriba para cargar el primero.'); return; }
    var byMonth = {};
    state.transactions.forEach(function(t){ var k = monthKey(t.date); (byMonth[k] = byMonth[k]||[]).push(t); });
    var keys = Object.keys(byMonth).sort().reverse();
    el.innerHTML = keys.map(function(k){
      var rows = byMonth[k].slice().sort(function(a,b){ return (b.date+String(b.createdAt||0)).localeCompare(a.date+String(a.createdAt||0)); });
      return '<div class="tx-group"><h3>'+monthLabel(k)+' '+k.split('-')[0]+'</h3>' +
        rows.map(function(t){ return txRowHTML(t, true); }).join('') + '</div>';
    }).join('');
  }

  var armedDelete = null;
  document.getElementById('txList').addEventListener('click', function(e){
    var btn = e.target.closest('.tx-del');
    if (!btn) return;
    var id = btn.dataset.id;
    if (armedDelete === id){
      Store.remove('transactions', id);
      armedDelete = null;
    } else {
      armedDelete = id;
      btn.textContent = '¿Seguro? Sí';
      btn.classList.add('arm');
      setTimeout(function(){
        if (armedDelete === id){ armedDelete = null; renderTxList(); }
      }, 3000);
    }
  });

  // ---------- render: budgets ----------
  function renderBudgets(){
    var curMonth = monthKey(todayISO());
    var spentByCat = {};
    state.transactions.forEach(function(t){
      if (t.type !== 'expense' || monthKey(t.date) !== curMonth) return;
      spentByCat[t.category] = (spentByCat[t.category]||0) + t.amount;
    });
    var el = document.getElementById('budgetList');
    el.innerHTML = EXPENSE_CATS.map(function(c){
      var limit = (state.budgets[c.id] && state.budgets[c.id].limit) || 0;
      var spent = spentByCat[c.id] || 0;
      var pct = limit > 0 ? Math.min(100, spent/limit*100) : 0;
      var barColor = 'var(--ink-faint)';
      if (limit > 0){
        barColor = pct >= 100 ? 'var(--negative)' : (pct >= 70 ? 'var(--accent)' : 'var(--positive)');
      }
      var numsText = limit > 0
        ? fmt(spent) + ' de ' + fmt(limit) + (spent > limit ? ' · superado' : '')
        : fmt(spent) + ' · sin límite';
      return '<div class="budget-row">' +
        '<div class="budget-head"><span class="budget-icon" style="background:var('+catColorVar(c.id)+')">'+icon(c.icon,14)+'</span>' +
        '<span class="cat">'+c.label+'</span><span class="nums num">'+numsText+'</span></div>' +
        '<div class="budget-bar"><div style="width:'+pct+'%; background:'+barColor+'"></div></div>' +
        '<div class="budget-edit">' +
          '<input type="number" min="0" step="1" placeholder="Límite mensual" data-cat="'+c.id+'" value="'+(limit||'')+'">' +
          '<button type="button" class="btn ghost" data-save="'+c.id+'">Guardar</button>' +
        '</div></div>';
    }).join('');
  }
  document.getElementById('budgetList').addEventListener('click', function(e){
    var btn = e.target.closest('[data-save]');
    if (!btn) return;
    var catId = btn.dataset.save;
    var input = document.querySelector('#budgetList input[data-cat="'+catId+'"]');
    var val = parseFloat(input.value) || 0;
    Store.set('budgets', catId, {categoryId: catId, limit: val, updatedAt: Date.now()});
  });

  // ---------- render: goals ----------
  function goalCardHTML(g){
    var pct = g.target > 0 ? Math.min(100, (g.current/g.target)*100) : 0;
    var verb = g.kind === 'debt' ? 'Pagado' : 'Ahorrado';
    return '<div class="goal-card '+g.kind+'">' +
      '<div class="goal-top"><div class="goal-name-wrap"><span class="goal-icon '+g.kind+'">'+icon(g.kind==='debt'?'flag':'star',16)+'</span>' +
      '<span class="name">'+escapeHtml(g.name)+'</span></div><span class="tag">'+(g.kind==='debt'?'Deuda':'Ahorro')+'</span></div>' +
      '<div class="goal-nums num">'+verb+' '+fmt(g.current)+' de '+fmt(g.target)+' · '+Math.round(pct)+'%</div>' +
      '<div class="goal-bar"><div style="width:'+pct+'%"></div></div>' +
      '<div class="goal-actions">' +
        '<input type="number" min="0" step="0.01" placeholder="Monto" data-add="'+g.id+'">' +
        '<button type="button" class="btn ghost" data-contrib="'+g.id+'">Agregar</button>' +
        '<button type="button" class="btn ghost" data-delgoal="'+g.id+'">Eliminar</button>' +
      '</div></div>';
  }
  function renderGoals(){
    var savings = state.goals.filter(function(g){ return g.kind === 'saving'; });
    var debts = state.goals.filter(function(g){ return g.kind === 'debt'; });
    document.getElementById('savingsList').innerHTML = savings.length
      ? savings.map(goalCardHTML).join('')
      : emptyState('star', 'Sin metas de ahorro', 'Creá una arriba para empezar a seguirla.');
    document.getElementById('debtsList').innerHTML = debts.length
      ? debts.map(goalCardHTML).join('')
      : emptyState('flag', 'Sin deudas cargadas', 'Sumá una arriba si querés hacerles seguimiento.');
  }
  var armedGoalDelete = null;
  document.getElementById('view-metas').addEventListener('click', function(e){
    var addBtn = e.target.closest('[data-contrib]');
    if (addBtn){
      var id = addBtn.dataset.contrib;
      var input = document.querySelector('input[data-add="'+id+'"]');
      var amt = parseFloat(input.value);
      if (!isFinite(amt) || amt <= 0) return;
      var g = state.goals.find(function(x){ return x.id === id; });
      if (!g) return;
      var next = Math.max(0, g.current + amt);
      Store.update('goals', id, {current: next});
      input.value = '';
      return;
    }
    var delBtn = e.target.closest('[data-delgoal]');
    if (delBtn){
      var gid = delBtn.dataset.delgoal;
      if (armedGoalDelete === gid){
        Store.remove('goals', gid);
        armedGoalDelete = null;
      } else {
        armedGoalDelete = gid;
        delBtn.textContent = '¿Seguro?';
        setTimeout(function(){ if (armedGoalDelete === gid){ armedGoalDelete = null; renderGoals(); } }, 3000);
      }
    }
  });

  // ---------- storage wiring ----------
  if (!Store.available){
    document.getElementById('txSubmit').disabled = true;
    var notice = document.getElementById('storageNotice');
    notice.style.display = 'block';
    notice.textContent = 'El navegador está bloqueando el guardado local (modo privado o almacenamiento deshabilitado). Los datos no se van a guardar en esta sesión.';
  }

  Store.subscribe('transactions', function(list){
    state.transactions = list;
    renderSummary();
    renderTxList();
    renderBudgets();
  });
  Store.subscribe('budgets', function(list){
    var map = {};
    list.forEach(function(d){ map[d.id] = d; });
    state.budgets = map;
    renderBudgets();
  });
  Store.subscribe('goals', function(list){
    state.goals = list;
    renderGoals();
  });
})();
