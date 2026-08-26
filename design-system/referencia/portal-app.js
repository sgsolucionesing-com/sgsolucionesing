/* ==========================================================
   S&G · Portal de cliente — LÓGICA (prototipo, sin backend)
   ========================================================== */
(function(){
'use strict';
const $ = id => document.getElementById(id);
const MONTHS = window.MONTHS, PROJECTS = window.PROJECTS, CLIENTE = window.CLIENTE;
const PC = window.PortalConfig;
let CUR = PROJECTS[0];
let CFG = PC.get(CUR.id);
let MAXLVL = 3;
let showBase = true, showCuts = true;
const collapsed = new Set();

const lvlOf = c => c.split('.').length;
const parentOf = c => c.split('.').slice(0,-1).join('.');
const hasKids = (rows,c) => rows.some(r => parentOf(r.c) === c);

/* ---------- tema ---------- */
$('themeBtn').addEventListener('click', () => {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = dark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('sg-theme', next); } catch(e){}
  drawCharts();
});

/* ---------- auth ---------- */
const auth = $('auth'), app = $('app');
$('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const u = $('usr').value.trim(), p = $('pwd').value;
  if (!u || !p) { $('loginErr').textContent = 'Ingresa usuario y contraseña.'; return; }
  $('loginErr').textContent = '';
  auth.style.display = 'none';
  app.classList.add('on');
  setView('proyectos');
});
$('magic').addEventListener('click', () => {
  $('loginErr').textContent = '';
  alert('Prototipo: se enviaría un enlace de acceso de un solo uso al correo registrado (expira en 15 minutos).');
});
$('out').addEventListener('click', () => {
  app.classList.remove('on');
  auth.style.display = '';
  window.scrollTo(0,0);
});
function eyeToggle(btnId, inpId){
  const b = $(btnId), i = $(inpId);
  b.addEventListener('click', () => {
    const hidden = i.type === 'password';
    i.type = hidden ? 'text' : 'password';
    b.textContent = hidden ? 'Ocultar' : 'Ver';
  });
}
eyeToggle('eye','pwd'); eyeToggle('eye2','p1');

/* ---------- navegación ---------- */
function setView(v){
  document.querySelectorAll('.view').forEach(s => s.classList.toggle('on', s.id === 'v-' + v));
  document.querySelectorAll('#tabs button,#mtabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.v === v)));
  $('phead').style.display = (v === 'proyectos') ? 'none' : '';
  window.scrollTo({ top:0, behavior:'smooth' });
  if (v === 'cronograma') drawCharts();
}
document.querySelectorAll('#tabs button,#mtabs button').forEach(b =>
  b.addEventListener('click', () => setView(b.dataset.v)));
$('backProj').addEventListener('click', e => { e.preventDefault(); setView('proyectos'); });

/* ---------- cartera ---------- */
function renderPortfolio(){
  $('pgrid').innerHTML = PROJECTS.map(p =>
    '<article class="bp pcard" data-id="' + p.id + '" tabindex="0" role="button">' +
      '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>' +
      '<div class="pc-top"><span class="pc-code">' + p.id + '</span>' +
        '<span class="badge ' + p.estadoTipo + '">' + p.estado + '</span></div>' +
      '<h3>' + p.titulo + '</h3>' +
      '<div class="pc-meta">' + p.servicio + ' · ' + p.ubicacion + '</div>' +
      '<div class="pc-prog"><div class="pc-pt">' +
        '<span class="pc-pn">' + p.real + '%</span>' +
        '<span class="pc-pl">' + (p.estado === 'Cerrado' ? 'Entregado' : 'Avance') + '</span></div>' +
        '<div class="bar" style="height:8px"><i style="width:' + p.real + '%;transition:none"></i>' +
        '<span class="plan" style="left:' + p.plan + '%"></span></div></div>' +
      '<div class="pc-foot"><span>' + p.inicio + ' → ' + p.fin + '</span>' +
        '<span class="pc-go">Ver proyecto <span class="arrow"></span></span></div>' +
    '</article>').join('');
  document.querySelectorAll('.pcard').forEach(c => {
    const open = () => { CUR = PROJECTS.find(p => p.id === c.dataset.id) || PROJECTS[0]; collapsed.clear(); renderProject(); setView('avance'); };
    c.addEventListener('click', open);
    c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

/* ---------- visibilidad segun configuracion del proyecto ---------- */
const SEC_VIEW = { avance:'avance', wbs:'wbs', cronograma:'cronograma', actividades:'actividades', documentos:'documentos' };
const KPI_MAP = ['avanceFisico','actividades','spi','cpi'];
function show(el, on){ if (el) el.style.display = on ? '' : 'none'; }
function applyConfig(){
  CFG = PC.get(CUR.id);
  document.querySelectorAll('#tabs button,#mtabs button').forEach(b => {
    const secKey = Object.keys(SEC_VIEW).find(k => SEC_VIEW[k] === b.dataset.v);
    show(b, !(secKey && !CFG.secciones[secKey]));
  });
  const anyKpi = KPI_MAP.some(k => CFG.kpis[k]);
  show($('kpiHd'), anyKpi);
  show($('kgrid'), anyKpi);
  show($('mos'), CFG.secciones.fotos);  show($('fotosHd'), CFG.secciones.fotos);
  show($('resumenHd'), CFG.extras.resumen);
  show($('resumenCols'), CFG.extras.resumen);
  show($('av-flags'), CFG.extras.riesgos);
  show($('ganttWrap'), CFG.cronograma.gantt);
  show($('scurveCard'), CFG.cronograma.curvaS);
  show($('evmCard'), CFG.cronograma.valorGanado);
  const anyChart = CFG.cronograma.curvaS || CFG.cronograma.valorGanado;
  show($('ctrlHd'), anyChart);
  show($('ctrlCols'), anyChart);
  if ($('ctrlCols')) $('ctrlCols').style.gridTemplateColumns = (CFG.cronograma.curvaS && CFG.cronograma.valorGanado) ? '' : '1fr';
  show($('baseWrap'), CFG.cronograma.lineaBase);
  show($('cutWrap'), CFG.cronograma.seguimiento);
  const active = document.querySelector('.view.on');
  if (active && active.id !== 'v-proyectos' && active.id !== 'v-cuenta'){
    const secKey = Object.keys(SEC_VIEW).find(k => SEC_VIEW[k] === active.id.replace('v-',''));
    if (secKey && !CFG.secciones[secKey]) setView('proyectos');
  }
}

/* ---------- gantt jerárquico ---------- */
function visibleRows(){
  return CUR.wbs.filter(r => {
    if (lvlOf(r.c) > MAXLVL) return false;
    const parts = r.c.split('.');
    for (let i = 1; i < parts.length; i++){
      if (collapsed.has(parts.slice(0,i).join('.'))) return false;
    }
    return true;
  });
}
function renderGantt(){
  const p = CUR, rows = CUR.wbs, n = MONTHS.length, pcx = v => (v / 8 * 100), NOW = pcx(p.now);
  const cells = MONTHS.map(() => '<span class="cell"></span>').join('');
  let g = '<div class="grow ghead"><div class="gname">WBS · Actividad</div><div class="gmonths">' +
          MONTHS.map(m => '<span>' + m + '</span>').join('') + '</div></div>';

  visibleRows().forEach((t, ix) => {
    const lv = lvlOf(t.c), kids = hasKids(rows, t.c) && lv < MAXLVL;
    const isCol = collapsed.has(t.c);
    const tw = kids
      ? '<button class="tw" type="button" data-c="' + t.c + '" aria-label="Expandir o colapsar">' + (isCol ? '+' : '–') + '</button>'
      : '<span class="tw ph"></span>';
    const bs = (t.bs != null ? t.bs : t.s), be = (t.be != null ? t.be : t.e);
    const baseBar = (showBase && CFG.cronograma.lineaBase)
      ? '<div class="gbase" style="left:' + pcx(bs) + '%;width:' + pcx(be - bs) + '%" title="Línea base"></div>' : '';
    const cuts = (showCuts && CFG.cronograma.seguimiento && p.cortes)
      ? p.cortes.map(c => '<div class="gcut' + (ix === 0 ? ' lbl' : '') + '" data-l="' + c.l + '" style="left:' + pcx(c.at) + '%"></div>').join('') : '';
    g += '<div class="grow lv' + lv + '">' +
      '<div class="gname">' + tw +
        '<span class="wbs">' + t.c + '</span>' +
        '<span class="txt"><span class="t">' + t.n + '</span>' +
        (lv === 1 ? '<span class="m">Peso ' + t.w + '% · avance ' + t.p + '%</span>' : '') +
        '</span></div>' +
      '<div class="gtrack">' + cells + cuts +
        '<div class="gbar b' + lv + ' ' + t.st + '" style="left:' + pcx(t.s) + '%;width:' + pcx(t.e - t.s) + '%">' +
          '<i style="width:' + t.p + '%"></i><b>' + t.p + '%</b></div>' + baseBar +
        '<div class="gnow' + (ix === 0 ? ' lbl' : '') + '" style="left:' + NOW + '%"></div>' +
      '</div></div>';
  });

  if (CFG.cronograma.hitos){
  g += '<div class="grow"><div class="gname"><span class="tw ph"></span><span class="wbs">◆</span>' +
       '<span class="txt"><span class="t">Hitos</span><span class="m">Entregas contractuales</span></span></div>' +
       '<div class="gtrack">' + cells +
       p.miles.map(m => '<div class="gmile" style="left:' + pcx(m.at) + '%" title="' + m.n + '"></div>').join('') +
       '<div class="gnow" style="left:' + NOW + '%"></div></div></div>';
  }

  $('gtable').innerHTML = g;
  $('gtable').querySelectorAll('.tw:not(.ph)').forEach(b =>
    b.addEventListener('click', () => {
      const c = b.dataset.c;
      if (collapsed.has(c)) collapsed.delete(c); else collapsed.add(c);
      renderGantt();
    }));
}
$('lvlSeg').querySelectorAll('button').forEach(b =>
  b.addEventListener('click', () => {
    MAXLVL = +b.dataset.l;
    $('lvlSeg').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    renderGantt();
  }));
$('expAll').addEventListener('click', () => { collapsed.clear(); renderGantt(); });
$('colAll').addEventListener('click', () => {
  CUR.wbs.forEach(r => { if (hasKids(CUR.wbs, r.c)) collapsed.add(r.c); });
  renderGantt();
});
$('baseTgl').addEventListener('change', e => { showBase = e.target.checked; renderGantt(); });
$('cutTgl').addEventListener('change', e => { showCuts = e.target.checked; renderGantt(); });
$('pdfBtn').addEventListener('click', () => {
  const v = $('v-cronograma');
  v.classList.add('printing');
  const done = () => { v.classList.remove('printing'); window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  setTimeout(() => { window.print(); setTimeout(done, 1200); }, 60);
});

/* ---------- WBS / EDT ---------- */
function renderWBS(){
  const rows = CUR.wbs;
  const l1 = rows.filter(r => lvlOf(r.c) === 1);
  $('wbsTree').innerHTML = l1.map(a => {
    const kids = rows.filter(r => parentOf(r.c) === a.c);
    const kidRows = kids.map(k => {
      const gk = rows.filter(r => parentOf(r.c) === k.c);
      let out = wkRow(k, 2);
      gk.forEach(x => { out += wkRow(x, 3); });
      return out;
    }).join('');
    return '<div class="bp wnode"><i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>' +
      '<div class="wtop"><div><span class="wc">' + a.c + '</span><h4>' + a.n + '</h4></div>' +
      '<span class="wmeta">Peso ' + a.w + '% · avance ' + a.p + '%</span></div>' +
      '<div class="bar" style="height:7px;margin-top:12px"><i style="width:' + a.p + '%;transition:none"></i></div>' +
      (kidRows ? '<div class="wkids">' + kidRows + '</div>' : '') +
    '</div>';
  }).join('');
}
function wkRow(r, lv){
  return '<div class="wk' + (lv === 3 ? ' l3' : '') + '">' +
    '<span class="kc">' + r.c + '</span>' +
    '<span class="kt">' + r.n + '</span>' +
    '<span class="kbar"><span class="bar" style="display:block;height:6px;margin:0"><i style="width:' + r.p + '%;transition:none"></i></span></span>' +
    '<span class="kp">' + r.p + '%</span>' +
  '</div>';
}

/* ---------- gráficas ---------- */
const W = 560, H = 260, M = { t:14, r:14, b:30, l:46 };
function scalePts(series, max){
  const n = MONTHS.length, iw = W - M.l - M.r, ih = H - M.t - M.b;
  return series.map((v,i) => v == null ? null : [M.l + iw * (i/(n-1)), M.t + ih * (1 - v/max)]);
}
function toPath(pts){
  return pts.filter(Boolean).map((p,i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
}
function frame(max, unit){
  const iw = W - M.l - M.r, ih = H - M.t - M.b;
  let o = '';
  for (let k = 0; k <= 4; k++){
    const y = M.t + ih * (1 - k/4), v = Math.round(max * k / 4);
    o += '<line class="gl" x1="' + M.l + '" y1="' + y.toFixed(1) + '" x2="' + (W-M.r) + '" y2="' + y.toFixed(1) + '"/>';
    o += '<text class="lbl" x="' + (M.l-8) + '" y="' + (y+3.5).toFixed(1) + '" text-anchor="end">' + v + unit + '</text>';
  }
  MONTHS.forEach((m,i) => {
    const x = M.l + iw * (i/(MONTHS.length-1));
    o += '<text class="lbl" x="' + x.toFixed(1) + '" y="' + (H-M.b+18) + '" text-anchor="middle">' + m + '</text>';
  });
  o += '<line class="ax" x1="' + M.l + '" y1="' + M.t + '" x2="' + M.l + '" y2="' + (H-M.b) + '"/>';
  o += '<line class="ax" x1="' + M.l + '" y1="' + (H-M.b) + '" x2="' + (W-M.r) + '" y2="' + (H-M.b) + '"/>';
  return o;
}
function nowLine(p){
  if (p.now >= MONTHS.length - 1) return '';
  const iw = W - M.l - M.r, x = M.l + iw * (p.now/(MONTHS.length-1));
  return '<line class="nowl" x1="' + x.toFixed(1) + '" y1="' + M.t + '" x2="' + x.toFixed(1) + '" y2="' + (H-M.b) + '"/>' +
         '<text class="lbl" x="' + (x+5).toFixed(1) + '" y="' + (M.t+10) + '" style="fill:var(--teal)">HOY</text>';
}
function drawCharts(){
  const p = CUR; if (!p) return;

  /* curva S */
  const pv = scalePts(p.pv, 100), ev = scalePts(p.ev, 100).filter(Boolean);
  const last = ev[ev.length - 1];
  let fc = '';
  if (p.fcast){
    const iw = W - M.l - M.r, ih = H - M.t - M.b, i0 = ev.length - 1;
    const fpts = p.fcast.map((v,k) => [M.l + iw * ((i0+k)/(MONTHS.length-1)), M.t + ih * (1 - v/100)]);
    fc = '<path class="ln ln-ev fc" d="' + toPath(fpts) + '"/>';
  }
  const area = '<path class="ar" d="' + toPath(ev) + ' L ' + last[0].toFixed(1) + ' ' + (H-M.b) + ' L ' + M.l + ' ' + (H-M.b) + ' Z"/>';
  $('scurve').innerHTML =
    '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Curva S de avance acumulado">' +
      frame(100,'%') + area +
      '<path class="ln ln-pv" d="' + toPath(pv) + '"/>' +
      '<path class="ln ln-ev" d="' + toPath(ev) + '"/>' + fc +
      '<circle class="dot" cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="4.5"/>' +
      nowLine(p) +
    '</svg>';

  /* valor ganado */
  const max = Math.ceil(Math.max(p.bac, p.eac) / 100) * 100;
  const aPV = scalePts(p.acPV, max), aEV = scalePts(p.acEV, max).filter(Boolean), aAC = scalePts(p.acAC, max).filter(Boolean);
  $('evmchart').innerHTML =
    '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Valor planeado, valor ganado y costo real">' +
      frame(max,'') +
      '<path class="ln ln-pv" d="' + toPath(aPV) + '"/>' +
      '<path class="ln ln-ac" d="' + toPath(aAC) + '"/>' +
      '<path class="ln ln-ev" d="' + toPath(aEV) + '"/>' +
      nowLine(p) +
    '</svg>';

  const evVals = p.acEV.filter(v => v != null), acVals = p.acAC.filter(v => v != null);
  const EV = evVals[evVals.length-1], AC = acVals[acVals.length-1], PV = p.acPV[evVals.length-1];
  const spi = EV/PV, cpi = EV/AC, sv = EV-PV, cv = EV-AC;
  const col = v => v >= 1 ? 'var(--ok)' : (v >= 0.95 ? 'var(--tx)' : 'var(--risk)');
  $('evmkpi').style.gridTemplateColumns = CFG.extras.montos ? '' : 'repeat(2,1fr)';
  $('evmkpi').innerHTML =
    '<div class="e"><div class="el">SPI · plazo</div><div class="ev" style="color:' + col(spi) + '">' + spi.toFixed(2) + '</div><div class="es">SV ' + (sv>=0?'+':'') + sv + ' M</div></div>' +
    '<div class="e"><div class="el">CPI · costo</div><div class="ev" style="color:' + col(cpi) + '">' + cpi.toFixed(2) + '</div><div class="es">CV ' + (cv>=0?'+':'') + cv + ' M</div></div>' +
    (CFG.extras.montos
      ? '<div class="e"><div class="el">BAC · presupuesto</div><div class="ev">' + p.bac + '</div><div class="es">Millones COP</div></div>' +
        '<div class="e"><div class="el">EAC · proyección</div><div class="ev" style="color:' + (p.eac > p.bac ? 'var(--risk)' : 'var(--ok)') + '">' + p.eac + '</div><div class="es">' + (p.eac > p.bac ? 'Sobre' : 'Bajo') + ' presupuesto</div></div>'
      : '');
}

/* ---------- proyecto ---------- */
function renderProject(){
  const p = CUR;
  applyConfig();
  $('p-meta').textContent = 'Proyecto ' + p.id + ' · ' + p.sector + ' · ' + p.ubicacion;
  $('p-title').textContent = p.titulo;
  $('p-facts').innerHTML =
    '<div class="fct"><div class="fl">Estado</div><div class="fv"><span class="badge ' + p.estadoTipo + '">' + p.estado + '</span></div></div>' +
    '<div class="fct"><div class="fl">Inicio</div><div class="fv">' + p.inicio + '</div></div>' +
    '<div class="fct"><div class="fl">Fin estimado</div><div class="fv">' + p.fin + '</div></div>' +
    '<div class="fct"><div class="fl">Fase actual</div><div class="fv">' + p.faseActual + '</div></div>' +
    '<div class="fct"><div class="fl">Responsable S&amp;G</div><div class="fv">' + p.responsable + '</div></div>';
  $('pn').textContent = p.real + '%';
  $('pplan').style.left = p.plan + '%';
  $('pcmp').innerHTML = '<span>Real ' + p.real + '%</span><span>Planeado ' + p.plan + '%</span>';
  const bar = $('pbar');
  bar.style.width = '0%';
  setTimeout(() => { bar.style.width = p.real + '%'; }, 80);

  $('av-note').textContent = 'Cifras actualizadas al cierre de ' + p.corte + '. Alimentan el informe mensual y, al cierre, el caso de éxito.';
  const kpis = p.kpis.filter((k,i) => CFG.kpis[KPI_MAP[i]]);
  const kg = $('kgrid');
  kg.style.gridTemplateColumns = 'repeat(' + Math.max(1, Math.min(4, kpis.length)) + ',1fr)';
  kg.innerHTML = kpis.map(k =>
    '<div class="bp kcard"><i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>' +
    '<div class="kl">' + k.l + '</div><div class="kn">' + k.v + '</div>' +
    '<div class="trend ' + k.tc + '">' + k.t + '</div><div class="kd">' + k.d + '</div></div>').join('');
  $('av-res').textContent = p.resumen;
  $('av-flags').innerHTML = p.flags.map(f =>
    '<li><div><div class="t">' + f.t + '</div><div class="s">' + f.s + '</div></div>' +
    '<span class="pill ' + f.pc + '">' + f.p + '</span></li>').join('');
  $('phases').innerHTML = p.wbs.filter(r => lvlOf(r.c) === 1).map(f =>
    '<div style="margin-bottom:14px">' +
      '<div style="display:flex;justify-content:space-between;gap:10px;align-items:baseline">' +
        '<span style="font-family:var(--cond);font-weight:600;font-size:14.5px;text-transform:uppercase;letter-spacing:.02em">' + f.c + ' · ' + f.n + '</span>' +
        '<span style="font-family:var(--mono);font-size:12px;color:var(--tx-mut)">peso ' + f.w + '% · ' + f.p + '%</span>' +
      '</div>' +
      '<div class="bar" style="height:7px;margin-top:7px"><i style="width:' + f.p + '%;transition:none"></i></div>' +
    '</div>').join('');

  const slug = p.id.toLowerCase();
  $('mos').innerHTML = p.fotos.map((f,i) =>
    '<image-slot ' + (i === 0 ? 'class="m-big" ' : '') + 'id="' + slug + '-g' + (i+1) + '" shape="rect" placeholder="' + f + '"></image-slot>').join('');

  $('acts').innerHTML = p.acts.map(a =>
    '<li><div class="d">' + a.d + ' · WBS ' + a.wbs + '</div><div class="h">' + a.h + '</div>' +
    '<div class="b">' + a.b + '</div><div class="who2">' + a.w + '</div></li>').join('');
  $('next-acts').innerHTML = p.nextActs.map(a =>
    '<li><div><div class="t">' + a.t + '</div><div class="s">' + a.s + '</div></div>' +
    '<span class="pill p-off">' + a.p + '</span></li>').join('');

  $('docs').innerHTML = p.docs.map(d =>
    '<tr><td><div class="dname"><span class="dext">' + d.x + '</span>' +
      '<span><span class="t">' + d.n + '</span><span class="s">' + d.s + '</span></span></div></td>' +
    '<td><span class="tag">' + d.t + '</span></td>' +
    '<td style="font-family:var(--mono);color:var(--tx-mut)">' + d.v + '</td>' +
    '<td style="white-space:nowrap">' + d.d + '</td>' +
    '<td><span class="pill ' + d.p + '">' + d.st + '</span></td>' +
    '<td style="text-align:right"><a class="dl" href="#descargar">Descargar <span class="arrow"></span></a></td></tr>').join('');

  renderGantt();
  renderWBS();
  drawCharts();
}

/* ---------- contraseña ---------- */
const p0 = $('p0'), p1 = $('p1'), p2 = $('p2'), meter = $('meter'), reqs = $('reqs'), pwBtn = $('pwBtn');
function checkPw(){
  const v = p1.value, u = ($('usr').value || '').split('@')[0].toLowerCase();
  const r = {
    len: v.length >= 12,
    mix: /[a-z]/.test(v) && /[A-Z]/.test(v),
    num: /[0-9\W]/.test(v),
    nou: v.length > 0 && (!u || !v.toLowerCase().includes(u))
  };
  [].forEach.call(reqs.children, li => li.classList.toggle('ok', !!r[li.dataset.r]));
  const score = Object.keys(r).filter(k => r[k]).length;
  meter.className = 'meter' + (v ? ' s' + score : '');
  pwBtn.disabled = !(score === 4 && p2.value === v && p0.value.length > 0);
}
[p0,p1,p2].forEach(i => i.addEventListener('input', checkPw));
$('pwForm').addEventListener('submit', e => {
  e.preventDefault();
  if (p1.value !== p2.value) { $('pwErr').textContent = 'Las contraseñas no coinciden.'; return; }
  $('pwErr').textContent = '';
  $('pwOk').classList.add('on');
  p0.value = p1.value = p2.value = '';
  checkPw();
});

/* ---------- arranque ---------- */
renderPortfolio();
renderProject();
})();
