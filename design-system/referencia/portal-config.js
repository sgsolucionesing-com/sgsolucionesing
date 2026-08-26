/* ==========================================================
   S&G · Portal — CONFIGURACIÓN POR PROYECTO (compartida)
   Define qué ve el cliente en CADA proyecto. La consume el
   portal del cliente y la edita el área de administración.
   Prototipo: persiste en localStorage. En producción es una
   tabla `project_visibility` por proyecto, leída en servidor.
   ========================================================== */
(function(){
'use strict';
const KEY = 'sg-portal-config';

/* valores por defecto: todo visible salvo costos */
const DEFAULTS = {
  secciones: { avance:true, wbs:true, cronograma:true, actividades:true, documentos:true, fotos:true },
  cronograma: { gantt:true, curvaS:true, valorGanado:false, lineaBase:true, seguimiento:true, hitos:true },
  kpis: { avanceFisico:true, actividades:true, spi:true, cpi:false },
  extras: { montos:false, resumen:true, riesgos:true }
};

const KPI_KEYS = [
  { k:'avanceFisico', l:'Avance físico (%)' },
  { k:'actividades',  l:'Actividades cerradas' },
  { k:'spi',          l:'Cumplimiento de plazo (SPI)' },
  { k:'cpi',          l:'Cumplimiento de costo (CPI)' }
];
const SEC_KEYS = [
  { k:'avance',       l:'Avance e indicadores' },
  { k:'wbs',          l:'WBS / EDT' },
  { k:'cronograma',   l:'Cronograma' },
  { k:'actividades',  l:'Bitácora de actividades' },
  { k:'documentos',   l:'Documentos' },
  { k:'fotos',        l:'Registro fotográfico' }
];
const CRO_KEYS = [
  { k:'gantt',        l:'Diagrama de Gantt' },
  { k:'hitos',        l:'Fila de hitos' },
  { k:'lineaBase',    l:'Línea base (plan original)' },
  { k:'seguimiento',  l:'Líneas de seguimiento (cortes)' },
  { k:'curvaS',       l:'Curva S de avance' },
  { k:'valorGanado',  l:'Valor ganado (EVM) y costos' }
];
const EXT_KEYS = [
  { k:'resumen',      l:'Resumen de estado del periodo' },
  { k:'riesgos',      l:'Riesgos y acciones requeridas' },
  { k:'montos',       l:'Montos en pesos (BAC / EAC)' }
];

function clone(o){ return JSON.parse(JSON.stringify(o)); }
function merge(base, over){
  const out = clone(base);
  Object.keys(over || {}).forEach(g => {
    if (out[g]) Object.keys(over[g]).forEach(k => { if (k in out[g]) out[g][k] = !!over[g][k]; });
  });
  return out;
}
function readAll(){
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e){ return {}; }
}
function get(projectId){
  return merge(DEFAULTS, readAll()[projectId]);
}
function set(projectId, cfg){
  const all = readAll();
  all[projectId] = cfg;
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch(e){}
}
function reset(projectId){
  const all = readAll();
  delete all[projectId];
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch(e){}
}

window.PortalConfig = { DEFAULTS, KPI_KEYS, SEC_KEYS, CRO_KEYS, EXT_KEYS, get, set, reset, clone };
})();
