/* ==========================================================
   S&G · Administración del portal — lógica (prototipo)
   Flujo: 1 empresa → 2 usuarios → 3 proyectos → 4 contactos → 5 visibilidad
   Tablas con buscador y paginación; creación en modales.
   ========================================================== */
(function(){
'use strict';
const $ = id => document.getElementById(id);
const PC = window.PortalConfig, PROJECTS = window.PROJECTS, EMPRESAS = window.EMPRESAS,
      USUARIOS = window.USUARIOS, ROLES = window.ROLES, ROLES_PROYECTO = window.ROLES_PROYECTO;

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm = s => String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const emp = id => EMPRESAS.find(e => e.id === id) || null;
const empName = id => (emp(id) || {}).nombre || '—';
const proj = id => PROJECTS.find(p => p.id === id) || null;
const usersOf = eid => USUARIOS.filter(u => u.empresa === eid);
const projectsOf = eid => PROJECTS.filter(p => p.empresa === eid);
const contactsOf = pid => USUARIOS.filter(u => u.proyectos.indexOf(pid) >= 0);

/* ---------- tema ---------- */
$('themeBtn').addEventListener('click', () => {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = dark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('sg-theme', next); } catch(e){}
});

/* ---------- toast ---------- */
let toastT;
function toast(msg){
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('on'), 3200);
}

/* ---------- navegación ---------- */
function setView(v){
  document.querySelectorAll('.view').forEach(s => s.classList.toggle('on', s.id === 'v-' + v));
  document.querySelectorAll('#tabs button,#mtabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.v === v)));
  window.scrollTo({ top:0, behavior:'smooth' });
}
document.querySelectorAll('#tabs button,#mtabs button').forEach(b =>
  b.addEventListener('click', () => setView(b.dataset.v)));

/* ---------- modales ---------- */
let lastFocus = null;
function openModal(id){
  lastFocus = document.activeElement;
  const m = $(id);
  m.classList.add('on');
  document.body.classList.add('modal-open');
  const f = m.querySelector('input:not([type=search]),select,textarea');
  if (f) setTimeout(() => f.focus(), 40);
}
function closeModal(id){
  const m = id ? $(id) : document.querySelector('.mbd.on');
  if (!m) return;
  m.classList.remove('on');
  document.body.classList.remove('modal-open');
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
document.querySelectorAll('.mbd').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); });
  m.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => closeModal(m.id)));
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---------- buscadores ---------- */
function wireSearch(inputId, wrapId, onChange){
  const i = $(inputId), w = $(wrapId);
  const sync = () => w.classList.toggle('has', !!i.value);
  i.addEventListener('input', () => { sync(); onChange(i.value); });
  w.querySelector('.clr').addEventListener('click', () => { i.value = ''; sync(); onChange(''); i.focus(); });
}

/* ---------- paginación reutilizable ---------- */
function renderPager(elId, state, total, onGo){
  const pages = Math.max(1, Math.ceil(total / state.size));
  if (state.page > pages) state.page = pages;
  const from = total ? (state.page - 1) * state.size + 1 : 0;
  const to = Math.min(total, state.page * state.size);
  let btns = '';
  const add = (label, page, cur, dis) =>
    btns += '<button class="pbtn" type="button" data-p="' + page + '"' +
            (cur ? ' aria-current="true"' : '') + (dis ? ' disabled' : '') + '>' + label + '</button>';
  add('‹', state.page - 1, false, state.page === 1);
  const win = [];
  for (let p = 1; p <= pages; p++){
    if (p === 1 || p === pages || Math.abs(p - state.page) <= 1) win.push(p);
    else if (win[win.length-1] !== '…') win.push('…');
  }
  win.forEach(p => p === '…'
    ? btns += '<span class="count" style="padding:0 4px">…</span>'
    : add(p, p, p === state.page, false));
  add('›', state.page + 1, false, state.page === pages);

  $(elId).innerHTML =
    '<span class="pinfo">' + (total ? from + '–' + to + ' de ' + total : '0 resultados') + '</span>' +
    btns +
    '<span class="psize"><span>Por página</span><select aria-label="Filas por página">' +
      [5,10,20].map(n => '<option value="' + n + '"' + (n === state.size ? ' selected' : '') + '>' + n + '</option>').join('') +
    '</select></span>';

  $(elId).querySelectorAll('.pbtn').forEach(b =>
    b.addEventListener('click', () => { state.page = +b.dataset.p; onGo(); }));
  $(elId).querySelector('select').addEventListener('change', e => {
    state.size = +e.target.value; state.page = 1; onGo();
  });
}
function slice(rows, st){ return rows.slice((st.page-1)*st.size, st.page*st.size); }

/* ---------- selects de empresa ---------- */
function fillEmpSelects(){
  const opts = EMPRESAS.map(e => '<option value="' + e.id + '">' + esc(e.nombre) + '</option>').join('');
  const all = '<option value="">Todas las empresas</option>' + opts;
  ['fUsrEmp','fProEmp','fAsgEmp'].forEach(id => {
    const cur = $(id).value;
    $(id).innerHTML = all;
    $(id).value = cur;
  });
  ['u-emp','p-emp'].forEach(id => { const cur = $(id).value; $(id).innerHTML = opts; if (cur) $(id).value = cur; });
}

/* ================= 1 · EMPRESAS ================= */
const stEmp = { page:1, size:5, q:'' };
function empRows(){
  const q = norm(stEmp.q);
  return EMPRESAS.filter(e => !q || [e.nombre,e.nit,e.sector,e.ciudad,e.contacto,e.correo].some(v => norm(v).includes(q)));
}
function renderEmp(){
  const rows = empRows();
  $('cEmp').textContent = rows.length + ' de ' + EMPRESAS.length;
  const body = slice(rows, stEmp);
  $('tbEmp').innerHTML = body.length ? body.map(e => {
    const nu = usersOf(e.id).length, np = projectsOf(e.id).length;
    return '<tr>' +
      '<td><span class="uname">' + esc(e.nombre) + '</span><span class="umail">' + esc(e.correo) + '</span></td>' +
      '<td class="mono">' + esc(e.nit) + '</td><td>' + esc(e.sector) + '</td><td>' + esc(e.ciudad) + '</td>' +
      '<td>' + esc(e.contacto) + '</td>' +
      '<td><span class="tag ' + (nu ? '' : 'tag-n') + '">' + nu + '</span></td>' +
      '<td><span class="tag ' + (np ? '' : 'tag-n') + '">' + np + '</span></td>' +
      '<td><span class="pill ' + (e.estado === 'Activa' ? 'p-on' : 'p-warn') + '">' + esc(e.estado) + '</span></td>' +
      '<td style="text-align:right;white-space:nowrap">' +
        '<button class="btn btn-g btn-sm" type="button" data-act="usr" data-e="' + e.id + '">+ Usuario</button> ' +
        '<button class="btn btn-g btn-sm" type="button" data-act="pro" data-e="' + e.id + '">+ Proyecto</button>' +
      '</td></tr>';
  }).join('') : '<tr><td colspan="9"><div class="empty"><b>Sin resultados</b>Ajusta la búsqueda o crea una nueva empresa.</div></td></tr>';

  $('tbEmp').querySelectorAll('[data-act]').forEach(b =>
    b.addEventListener('click', () => {
      if (b.dataset.act === 'usr'){ $('u-emp').value = b.dataset.e; openModal('mUsr'); }
      else { $('p-emp').value = b.dataset.e; openModal('mPro'); }
    }));
  renderPager('pgEmp', stEmp, rows.length, renderEmp);
}
wireSearch('qEmp','srchEmp', v => { stEmp.q = v; stEmp.page = 1; renderEmp(); });
$('newEmp').addEventListener('click', () => openModal('mEmp'));
$('fEmp').addEventListener('submit', e => {
  e.preventDefault();
  const nom = $('e-nom').value.trim(), nit = $('e-nit').value.trim();
  if (!nom || !nit){ $('eEmp').textContent = 'Razón social y NIT son obligatorios.'; return; }
  if (EMPRESAS.some(x => norm(x.nit) === norm(nit))){ $('eEmp').textContent = 'Ya existe una empresa con ese NIT.'; return; }
  $('eEmp').textContent = '';
  EMPRESAS.unshift({
    id:'EMP-' + String(EMPRESAS.length + 1).padStart(3,'0'), nombre:nom, nit:nit,
    sector:$('e-sec').value.trim() || '—', ciudad:$('e-ciu').value.trim() || '—',
    contacto:$('e-con').value.trim() || '—', correo:$('e-cor').value.trim() || '—',
    tel:$('e-tel').value.trim() || '—', estado:'Pendiente', proyectos:[]
  });
  e.target.reset(); closeModal('mEmp');
  fillEmpSelects(); renderEmp(); renderUsr(); renderPro(); renderAsg();
  toast('Empresa creada. Ahora crea sus usuarios (paso 2) y sus proyectos (paso 3).');
});

/* ================= 2 · USUARIOS ================= */
const stUsr = { page:1, size:5, q:'', empresa:'' };
function usrRows(){
  const q = norm(stUsr.q);
  return USUARIOS.filter(u =>
    (!stUsr.empresa || u.empresa === stUsr.empresa) &&
    (!q || [u.nombre,u.correo,u.cargo,u.rol,empName(u.empresa)].some(v => norm(v).includes(q))));
}
function renderUsr(){
  const rows = usrRows();
  $('cUsr').textContent = rows.length + ' de ' + USUARIOS.length;
  const body = slice(rows, stUsr);
  $('tbUsr').innerHTML = body.length ? body.map(u =>
    '<tr>' +
      '<td><span class="uname">' + esc(u.nombre) + '</span><span class="umail">' + esc(u.correo) + '</span></td>' +
      '<td>' + esc(u.cargo || '—') + '</td><td>' + esc(empName(u.empresa)) + '</td>' +
      '<td><span class="tag">' + esc(u.rol) + '</span></td>' +
      '<td>' + (u.proyectos.length
        ? u.proyectos.map(p => '<span class="tag">' + esc(p) + '</span>').join('')
        : '<span class="hint">Sin proyectos</span>') + '</td>' +
      '<td><span class="pill ' + (u.dosPasos ? 'p-on' : 'p-off') + '">' + (u.dosPasos ? 'Sí' : 'No') + '</span></td>' +
      '<td><span class="pill ' + (u.estado === 'Activo' ? 'p-on' : 'p-warn') + '">' + esc(u.estado) + '</span></td>' +
      '<td style="text-align:right;white-space:nowrap"><button class="btn btn-g btn-sm" type="button" data-re="' + u.id + '">Reenviar acceso</button></td>' +
    '</tr>').join('') : '<tr><td colspan="8"><div class="empty"><b>Sin usuarios</b>Crea el primer usuario de la empresa.</div></td></tr>';
  $('tbUsr').querySelectorAll('[data-re]').forEach(b =>
    b.addEventListener('click', () => toast('Invitación reenviada. El enlace expira en 72 horas.')));
  renderPager('pgUsr', stUsr, rows.length, renderUsr);
}
wireSearch('qUsr','srchUsr', v => { stUsr.q = v; stUsr.page = 1; renderUsr(); });
$('fUsrEmp').addEventListener('change', e => { stUsr.empresa = e.target.value; stUsr.page = 1; renderUsr(); });
$('newUsr').addEventListener('click', () => {
  if (!EMPRESAS.length){ toast('Primero crea una empresa (paso 1).'); setView('empresas'); return; }
  if (stUsr.empresa) $('u-emp').value = stUsr.empresa;
  openModal('mUsr');
});
$('u-rol').innerHTML = ROLES.map(r => '<option>' + esc(r) + '</option>').join('');
$('fUsr').addEventListener('submit', e => {
  e.preventDefault();
  const nom = $('u-nom').value.trim(), cor = $('u-cor').value.trim();
  if (!nom || !cor){ $('eUsr').textContent = 'Nombre y correo son obligatorios.'; return; }
  if (USUARIOS.some(x => norm(x.correo) === norm(cor))){ $('eUsr').textContent = 'Ya existe un usuario con ese correo.'; return; }
  $('eUsr').textContent = '';
  const rol = $('u-rol').value;
  USUARIOS.unshift({
    id:'U-' + String(USUARIOS.length + 1).padStart(3,'0'), nombre:nom, correo:cor,
    cargo:$('u-car').value.trim() || '—', empresa:$('u-emp').value, rol:rol,
    estado:'Invitado', ultimo:'—', dosPasos:rol.indexOf('Aprobador') >= 0, proyectos:[]
  });
  const eid = $('u-emp').value;
  e.target.reset();
  $('u-emp').value = eid; $('u-rol').selectedIndex = 0;
  closeModal('mUsr');
  renderUsr(); renderEmp(); renderAsg();
  toast('Invitación enviada. Asígnale proyectos en el paso 4.');
});

/* ================= 3 · PROYECTOS ================= */
const stPro = { page:1, size:5, q:'', empresa:'' };
function proRows(){
  const q = norm(stPro.q);
  return PROJECTS.filter(p =>
    (!stPro.empresa || p.empresa === stPro.empresa) &&
    (!q || [p.id,p.titulo,p.servicio,p.ubicacion,p.responsable,empName(p.empresa)].some(v => norm(v).includes(q))));
}
function renderPro(){
  const rows = proRows();
  $('cPro').textContent = rows.length + ' de ' + PROJECTS.length;
  const body = slice(rows, stPro);
  $('tbPro').innerHTML = body.length ? body.map(p => {
    const nc = contactsOf(p.id).length;
    return '<tr>' +
      '<td><span class="uname">' + esc(p.titulo) + '</span><span class="umail">' + esc(p.id) + '</span></td>' +
      '<td>' + esc(empName(p.empresa)) + '</td><td>' + esc(p.servicio) + '</td>' +
      '<td class="mono">' + esc(p.inicio) + ' → ' + esc(p.fin) + '</td>' +
      '<td><b style="font-family:var(--cond);font-size:17px;color:var(--accent-tx)">' + p.real + '%</b></td>' +
      '<td><span class="tag ' + (nc ? '' : 'tag-n') + '">' + nc + '</span></td>' +
      '<td><span class="pill ' + (p.estado === 'Cerrado' ? 'p-off' : (p.estado === 'Planeado' ? 'p-warn' : 'p-on')) + '">' + esc(p.estado) + '</span></td>' +
      '<td style="text-align:right;white-space:nowrap">' +
        '<button class="btn btn-g btn-sm" type="button" data-asg="' + p.id + '">Contactos</button> ' +
        '<button class="btn btn-g btn-sm" type="button" data-cfg="' + p.id + '">Visibilidad</button>' +
      '</td></tr>';
  }).join('') : '<tr><td colspan="8"><div class="empty"><b>Sin proyectos</b>Crea el primer proyecto de la empresa.</div></td></tr>';

  $('tbPro').querySelectorAll('[data-asg]').forEach(b =>
    b.addEventListener('click', () => openAsg(b.dataset.asg)));
  $('tbPro').querySelectorAll('[data-cfg]').forEach(b =>
    b.addEventListener('click', () => { curId = b.dataset.cfg; setView('config'); renderList(); renderConfig(); }));
  renderPager('pgPro', stPro, rows.length, renderPro);
}
wireSearch('qPro','srchPro', v => { stPro.q = v; stPro.page = 1; renderPro(); });
$('fProEmp').addEventListener('change', e => { stPro.empresa = e.target.value; stPro.page = 1; renderPro(); });
$('newPro').addEventListener('click', () => {
  if (!EMPRESAS.length){ toast('Primero crea una empresa (paso 1).'); setView('empresas'); return; }
  if (stPro.empresa) $('p-emp').value = stPro.empresa;
  openModal('mPro');
});
function blankProject(o){
  const zeros = [0,0,0,0,0,0,0,0];
  return Object.assign({
    estado:'Planeado', estadoTipo:'b-warn', faseActual:'Sin iniciar', corte:'la apertura del proyecto',
    real:0, plan:0, now:0, sector:'—',
    kpis:[
      {l:'Avance físico',v:'0%',t:'Sin avance',tc:'t-fl',d:'Ponderado por peso de cada entregable de la WBS.'},
      {l:'Actividades cerradas',v:'0<small>/0</small>',t:'Sin actividades',tc:'t-fl',d:'Nivel 3 de la WBS.'},
      {l:'Cumplimiento de plazo (SPI)',v:'—',t:'Sin datos',tc:'t-fl',d:'Valor ganado sobre valor planeado.'},
      {l:'Cumplimiento de costo (CPI)',v:'—',t:'Sin datos',tc:'t-fl',d:'Valor ganado sobre costo real.'}
    ],
    resumen:'Proyecto registrado. Aún no se ha cargado la WBS ni el cronograma de ejecución.',
    flags:[{t:'Siguiente paso',s:'Cargar WBS y cronograma de ejecución',p:'Pendiente',pc:'p-off'}],
    wbs:[], miles:[], cortes:[],
    pv:zeros.slice(), ev:zeros.slice(), fcast:null,
    acPV:zeros.slice(), acEV:zeros.slice(), acAC:zeros.slice(), bac:0, eac:0,
    acts:[], nextActs:[], docs:[],
    fotos:['Avance principal de obra','Detalle','Detalle','Detalle','Detalle']
  }, o);
}
$('fPro').addEventListener('submit', e => {
  e.preventDefault();
  const cod = $('p-cod').value.trim(), tit = $('p-tit').value.trim(), eid = $('p-emp').value;
  if (!cod || !tit){ $('ePro').textContent = 'Código y título son obligatorios.'; return; }
  if (PROJECTS.some(x => norm(x.id) === norm(cod))){ $('ePro').textContent = 'Ya existe un proyecto con ese código.'; return; }
  $('ePro').textContent = '';
  PROJECTS.unshift(blankProject({
    id:cod, empresa:eid, titulo:tit, servicio:$('p-ser').value,
    ubicacion:$('p-ciu').value.trim() || '—', responsable:$('p-res').value.trim() || '—',
    inicio:$('p-ini').value.trim() || '—', fin:$('p-fin').value.trim() || '—'
  }));
  const em = emp(eid);
  if (em){ em.proyectos.push(cod); if (em.estado !== 'Activa' && usersOf(eid).length) em.estado = 'Activa'; }
  e.target.reset(); $('p-emp').value = eid;
  closeModal('mPro');
  renderPro(); renderEmp(); renderAsg(); renderList();
  toast('Proyecto creado. Asígnale contactos en el paso 4.');
});

/* ================= 4 · CONTACTOS ================= */
const stAsg = { page:1, size:5, q:'', empresa:'' };
let asgPid = null, asgQ = '';
function asgRows(){
  const q = norm(stAsg.q);
  return PROJECTS.filter(p =>
    (!stAsg.empresa || p.empresa === stAsg.empresa) &&
    (!q || [p.id,p.titulo,empName(p.empresa)].some(v => norm(v).includes(q))));
}
function renderAsg(){
  const rows = asgRows();
  $('cAsg').textContent = rows.length + ' de ' + PROJECTS.length;
  const body = slice(rows, stAsg);
  $('tbAsg').innerHTML = body.length ? body.map(p => {
    const cs = contactsOf(p.id);
    return '<tr>' +
      '<td><span class="uname">' + esc(p.titulo) + '</span><span class="umail">' + esc(p.id) + '</span></td>' +
      '<td>' + esc(empName(p.empresa)) + '</td>' +
      '<td>' + (cs.length
        ? cs.map(u => '<span class="tag">' + esc(u.nombre) + '</span>').join('')
        : '<span class="hint">Sin contactos asignados</span>') + '</td>' +
      '<td><span class="pill ' + (cs.length ? 'p-on' : 'p-warn') + '">' + (cs.length ? cs.length + ' con acceso' : 'Sin acceso') + '</span></td>' +
      '<td style="text-align:right"><button class="btn btn-o btn-sm" type="button" data-asg="' + p.id + '">Asignar contactos</button></td>' +
    '</tr>';
  }).join('') : '<tr><td colspan="5"><div class="empty"><b>Sin proyectos</b>Crea un proyecto en el paso 3.</div></td></tr>';
  $('tbAsg').querySelectorAll('[data-asg]').forEach(b =>
    b.addEventListener('click', () => openAsg(b.dataset.asg)));
  renderPager('pgAsg', stAsg, rows.length, renderAsg);
}
wireSearch('qAsg','srchAsg', v => { stAsg.q = v; stAsg.page = 1; renderAsg(); });
$('fAsgEmp').addEventListener('change', e => { stAsg.empresa = e.target.value; stAsg.page = 1; renderAsg(); });

function openAsg(pid){
  asgPid = pid; asgQ = ''; $('qAsgU').value = ''; $('srchAsgU').classList.remove('has');
  const p = proj(pid);
  $('mAsgS').innerHTML = esc(p.titulo) + ' · <b>' + esc(p.id) + '</b> · ' + esc(empName(p.empresa));
  renderAsgList();
  openModal('mAsg');
}
function renderAsgList(){
  const p = proj(asgPid);
  const q = norm(asgQ);
  const list = usersOf(p.empresa).filter(u => !q || [u.nombre,u.correo,u.cargo].some(v => norm(v).includes(q)));
  $('asgList').innerHTML = list.length ? list.map(u => {
    const on = u.proyectos.indexOf(p.id) >= 0;
    const rp = (u.rolProyecto && u.rolProyecto[p.id]) || ROLES_PROYECTO[3];
    return '<div class="arow">' +
      '<input type="checkbox" data-u="' + u.id + '"' + (on ? ' checked' : '') + ' aria-label="Asignar ' + esc(u.nombre) + '" />' +
      '<div><div class="an">' + esc(u.nombre) + '</div><div class="ac">' + esc(u.cargo || '—') + ' · ' + esc(u.correo) + '</div></div>' +
      '<select class="input" data-r="' + u.id + '"' + (on ? '' : ' disabled') + ' aria-label="Rol en el proyecto">' +
        ROLES_PROYECTO.map(r => '<option' + (r === rp ? ' selected' : '') + '>' + esc(r) + '</option>').join('') +
      '</select>' +
      '<span class="apill"><span class="pill ' + (u.estado === 'Activo' ? 'p-on' : 'p-warn') + '">' + esc(u.estado) + '</span></span>' +
    '</div>';
  }).join('') : '<div class="empty"><b>Sin usuarios</b>Esta empresa aún no tiene usuarios. Créalos en el paso 2.</div>';

  $('asgList').querySelectorAll('input[type=checkbox]').forEach(c =>
    c.addEventListener('change', () => {
      const sel = $('asgList').querySelector('select[data-r="' + c.dataset.u + '"]');
      if (sel) sel.disabled = !c.checked;
    }));
}
wireSearch('qAsgU','srchAsgU', v => { asgQ = v; renderAsgList(); });
$('asgSave').addEventListener('click', () => {
  const p = proj(asgPid);
  $('asgList').querySelectorAll('input[type=checkbox]').forEach(c => {
    const u = USUARIOS.find(x => x.id === c.dataset.u);
    if (!u) return;
    const i = u.proyectos.indexOf(p.id);
    if (c.checked){
      if (i < 0) u.proyectos.push(p.id);
      u.rolProyecto = u.rolProyecto || {};
      const sel = $('asgList').querySelector('select[data-r="' + u.id + '"]');
      if (sel) u.rolProyecto[p.id] = sel.value;
    } else if (i >= 0){
      u.proyectos.splice(i,1);
      if (u.rolProyecto) delete u.rolProyecto[p.id];
    }
  });
  const em = emp(p.empresa);
  if (em && em.estado !== 'Activa' && contactsOf(p.id).length) em.estado = 'Activa';
  closeModal('mAsg');
  renderAsg(); renderUsr(); renderPro(); renderEmp();
  toast('Contactos actualizados para ' + p.id + '.');
});

/* ================= 5 · VISIBILIDAD ================= */
let curId = PROJECTS.length ? PROJECTS[0].id : null;
let draft = curId ? PC.get(curId) : null;
let cfgQ = '';
function renderList(){
  const q = norm(cfgQ);
  const rows = PROJECTS.filter(p => !q || [p.id,p.titulo,empName(p.empresa)].some(v => norm(v).includes(q)));
  $('plist').innerHTML = rows.length ? rows.map(p =>
    '<button class="pitem" type="button" data-id="' + p.id + '" aria-current="' + (p.id === curId) + '">' +
      '<span class="pc">' + esc(p.id) + ' · ' + esc(empName(p.empresa)) + '</span>' +
      '<span class="pt">' + esc(p.titulo) + '</span>' +
      '<span class="pe">' + esc(p.estado) + ' · ' + p.real + '% · ' + esc(p.ubicacion) + '</span>' +
    '</button>').join('') : '<div class="empty"><b>Sin resultados</b>Ajusta la búsqueda.</div>';
  $('plist').querySelectorAll('.pitem').forEach(b =>
    b.addEventListener('click', () => { curId = b.dataset.id; draft = PC.get(curId); renderList(); renderConfig(); }));
}
wireSearch('qCfg','srchCfg', v => { cfgQ = v; renderList(); });

const GROUPS = [
  { g:'secciones',  t:'Secciones visibles',    d:'Pestañas y bloques que aparecen en el portal del cliente.', keys:PC.SEC_KEYS },
  { g:'kpis',       t:'Indicadores',           d:'Cuáles de los cuatro indicadores estándar se muestran.',    keys:PC.KPI_KEYS },
  { g:'cronograma', t:'Cronograma y gráficas', d:'Elementos del Gantt y las curvas de control.',              keys:PC.CRO_KEYS },
  { g:'extras',     t:'Detalle e información', d:'Bloques de texto y cifras sensibles.',                      keys:PC.EXT_KEYS }
];
function renderConfig(){
  const p = proj(curId);
  if (!p){ $('cfgBody').innerHTML = '<div class="empty"><b>Sin proyectos</b>Crea un proyecto en el paso 3.</div>'; return; }
  $('cfgTitle').textContent = p.titulo;
  $('cfgMeta').textContent = p.id + ' · ' + empName(p.empresa) + ' · ' + p.ubicacion + ' · resp. ' + p.responsable;
  const st = $('cfgState');
  st.textContent = p.estado;
  st.className = 'pill ' + (p.estado === 'Cerrado' ? 'p-off' : (p.estado === 'Planeado' ? 'p-warn' : 'p-on'));

  $('cfgBody').innerHTML = GROUPS.map(gr =>
    '<div class="grp"><h4>' + gr.t + '</h4><p class="gd">' + gr.d + '</p><div class="tgls">' +
    gr.keys.map(k =>
      '<div class="tg"><span class="tl2">' + k.l + '</span>' +
      '<button class="sw" type="button" role="switch" data-g="' + gr.g + '" data-k="' + k.k + '" ' +
      'aria-checked="' + !!draft[gr.g][k.k] + '" aria-label="' + k.l + '"></button></div>').join('') +
    '</div></div>').join('');

  $('cfgBody').querySelectorAll('.sw').forEach(b =>
    b.addEventListener('click', () => {
      const on = b.getAttribute('aria-checked') === 'true';
      b.setAttribute('aria-checked', String(!on));
      draft[b.dataset.g][b.dataset.k] = !on;
      $('cfgSaved').classList.remove('on');
    }));
}
$('cfgSave').addEventListener('click', () => {
  if (!curId) return;
  PC.set(curId, draft);
  $('cfgSaved').classList.add('on');
  setTimeout(() => $('cfgSaved').classList.remove('on'), 2600);
  toast('Visibilidad guardada para ' + curId + '.');
});
$('cfgReset').addEventListener('click', () => {
  if (!curId) return;
  PC.reset(curId); draft = PC.get(curId); renderConfig();
  toast('Configuración restaurada por defecto.');
});

/* ---------- arranque ---------- */
fillEmpSelects();
renderEmp(); renderUsr(); renderPro(); renderAsg(); renderList(); renderConfig();
})();
