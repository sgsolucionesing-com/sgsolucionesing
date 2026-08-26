/* ==========================================================
   S&G · Portal de cliente — DATOS DEMO
   Todos los proyectos llevan EXACTAMENTE el mismo conjunto de
   campos e indicadores. La WBS admite 3 niveles: el código
   ('4.1.2') define el nivel; el nivel 1 es entregable, el 2
   paquete de trabajo y el 3 actividad.
   ========================================================== */
window.MONTHS = ['Feb','Mar','Abr','May','Jun','Jul','Ago','Sep'];

window.CLIENTE = { nombre:'M. Rivera', empresa:'Grupo Alimentar S.A.S.', iniciales:'MR' };

window.PROJECTS = [
{
  id:'SG-2026-014', empresa:'EMP-001', titulo:'Actualización tecnológica de subestación eléctrica',
  sector:'Alimentos', ubicacion:'Barranquilla', servicio:'Industria 4.0 / IoT',
  estado:'En ejecución', estadoTipo:'b-ok', inicio:'02 Feb 2026', fin:'18 Sep 2026',
  faseActual:'4 de 6 · Integración', responsable:'Ing. J. Serrano', corte:'la semana 30',
  real:61, plan:64, now:6.0,
  kpis:[
    {l:'Avance físico',v:'61%',t:'−3 pts vs. plan',tc:'t-dn',d:'Ponderado por peso de cada entregable de la WBS.'},
    {l:'Actividades cerradas',v:'28<small>/46</small>',t:'+5 esta semana',tc:'t-up',d:'Nivel 3 de la WBS, incluye pruebas en sitio.'},
    {l:'Cumplimiento de plazo (SPI)',v:'0.95',t:'Leve retraso',tc:'t-dn',d:'Valor ganado sobre valor planeado.'},
    {l:'Cumplimiento de costo (CPI)',v:'0.92',t:'Sobrecosto 8%',tc:'t-dn',d:'Valor ganado sobre costo real.'}
  ],
  resumen:'La integración del gateway MQTT quedó operativa y los tableros de operación ya reciben datos de los 112 puntos instrumentados. El desfase de 3 puntos frente al plan proviene de la ventana de parada reprogramada por producción; se recupera en la semana 33 sin afectar la fecha de cierre.',
  flags:[
    {t:'Hito próximo',s:'Pruebas de aceptación del sistema de alertamiento',p:'14 Ago',pc:'p-on'},
    {t:'Requiere tu acción',s:'Aprobación del protocolo de pruebas (pendiente de firma)',p:'Pendiente',pc:'p-off'},
    {t:'Riesgo abierto',s:'Ventana de parada de planta para el tablero TB-03',p:'Medio',pc:'p-off'}
  ],
  wbs:[
    {c:'1',    n:'Diagnóstico y línea base',        w:10, s:0,   e:1,   p:100, st:'done'},
    {c:'1.1',  n:'Levantamiento en sitio',          w:5,  s:0,   e:0.6, p:100, st:'done'},
    {c:'1.2',  n:'Línea base de indicadores',       w:5,  s:0.4, e:1,   p:100, st:'done'},
    {c:'2',    n:'Ingeniería de detalle',           w:15, s:0.8, e:2.4, p:100, st:'done'},
    {c:'2.1',  n:'Planos de intervención',          w:6,  s:0.8, e:1.8, p:100, st:'done'},
    {c:'2.2',  n:'Lista de señales',                w:4,  s:1.4, e:2.2, p:100, st:'done'},
    {c:'2.3',  n:'Arquitectura de datos',           w:5,  s:1.8, e:2.4, p:100, st:'done'},
    {c:'3',    n:'Instrumentación',                 w:25, s:2,   e:5.4, p:92,  st:'',     bs:2,   be:5},
    {c:'3.1',  n:'Suministro de instrumentos',      w:9,  s:2,   e:4,   p:100, st:'done'},
    {c:'3.2',  n:'Montaje de sensórica',            w:16, s:3,   e:5.4, p:88,  st:'',     bs:3,   be:5},
    {c:'3.2.1',n:'Zona 1 — molienda',               w:8,  s:3,   e:4.2, p:100, st:'done'},
    {c:'3.2.2',n:'Zona 2 — bombeo',                 w:8,  s:3.8, e:5.4, p:76,  st:'',     bs:3.8, be:5},
    {c:'4',    n:'Integración de datos',            w:25, s:4.4, e:7,   p:45,  st:'',     bs:4.4, be:6.6},
    {c:'4.1',  n:'Gateway MQTT e ingesta',          w:10, s:4.4, e:6.2, p:70,  st:'',     bs:4.4, be:6},
    {c:'4.1.1',n:'Publicación por activo',          w:5,  s:4.4, e:5.4, p:100, st:'done'},
    {c:'4.1.2',n:'Validación de umbrales',          w:5,  s:5.2, e:6.2, p:45,  st:'',     bs:5,   be:6},
    {c:'4.2',  n:'Tableros de operación',           w:9,  s:5,   e:6.8, p:40,  st:'',     bs:5,   be:6.4},
    {c:'4.3',  n:'Tablero TB-03 (requiere parada)', w:6,  s:6,   e:7,   p:10,  st:'risk', bs:5.4, be:6.4},
    {c:'5',    n:'Pruebas y puesta en marcha',      w:15, s:6.4, e:7.4, p:0,   st:''},
    {c:'5.1',  n:'Pruebas de aceptación',           w:9,  s:6.4, e:7.4, p:0,   st:''},
    {c:'5.2',  n:'Ajuste de umbrales en operación', w:6,  s:6.8, e:7.4, p:0,   st:''},
    {c:'6',    n:'Capacitación y cierre',           w:10, s:7.2, e:8,   p:0,   st:''},
    {c:'6.1',  n:'Capacitación operativa',          w:6,  s:7.2, e:7.7, p:0,   st:''},
    {c:'6.2',  n:'Acta de cierre y as-built',       w:4,  s:7.7, e:8,   p:0,   st:''}
  ],
  miles:[{n:'Aprobación de ingeniería',at:2.4},{n:'Datos en línea',at:6.2},{n:'Entrega final',at:8}],
  pv:[3,10,22,36,50,64,82,100], ev:[3,9,20,33,46,61,null,null], fcast:[61,79,97],
  cortes:[{at:2.4,l:'C1 · Abr'},{at:4.4,l:'C2 · Jun'},{at:6.0,l:'C3 · Jul'}],
  acPV:[42,140,308,504,700,896,1148,1400], acEV:[42,126,280,462,644,854,null,null], acAC:[46,140,302,500,700,928,null,null],
  bac:1400, eac:1522,
  acts:[
    {d:'24 Jul 2026',h:'Ingesta en línea de 112 puntos',b:'Se validó la llegada de datos de vibración y temperatura al histórico; latencia media 1.8 s.',w:'Ing. J. Serrano · S&G',wbs:'4.1.2'},
    {d:'18 Jul 2026',h:'Gateway MQTT en producción',b:'Publicación por activo con identificación única y validación de umbrales por nivel.',w:'Ing. C. Muñoz · S&G',wbs:'4.1.1'},
    {d:'09 Jul 2026',h:'Montaje de sensórica — zona 2',b:'34 puntos instalados en equipos críticos de molienda y bombeo.',w:'Cuadrilla de campo',wbs:'3.2.2'},
    {d:'27 Jun 2026',h:'Acta de avance N.º 3 firmada',b:'Revisión conjunta de alcance ejecutado y ajuste de la ventana de parada del TB-03.',w:'Cliente + S&G',wbs:'4.3'},
    {d:'12 Jun 2026',h:'Suministro recibido y verificado',b:'Instrumentos y accesorios de montaje contra lista de despacho; sin novedades.',w:'Almacén planta',wbs:'3.1'},
    {d:'30 May 2026',h:'Ingeniería de detalle aprobada',b:'Planos de intervención, listas de señales y arquitectura de datos.',w:'Cliente',wbs:'2'}
  ],
  nextActs:[
    {t:'Pruebas de alertamiento',s:'Validación de umbrales y notificación multicanal',p:'14 Ago'},
    {t:'Capacitación operativa',s:'2 sesiones · personal de mantenimiento',p:'21 Ago'},
    {t:'Tablero TB-03',s:'Requiere ventana de parada de planta',p:'28 Ago'}
  ],
  docs:[
    {n:'Protocolo de pruebas de aceptación',s:'Requiere tu firma',x:'PDF',t:'Protocolo',v:'v2',d:'22 Jul 2026',st:'Pendiente de firma',p:'p-off'},
    {n:'Acta de avance N.º 3',s:'Firmada por ambas partes',x:'PDF',t:'Acta',v:'v1',d:'27 Jun 2026',st:'Aprobado',p:'p-on'},
    {n:'Arquitectura de datos y flujo MQTT',s:'Diagrama de integración',x:'PDF',t:'Ingeniería',v:'v3',d:'14 Jun 2026',st:'Aprobado',p:'p-on'},
    {n:'Planos de intervención — subestación',s:'Unifilar y disposición física',x:'DWG',t:'Plano',v:'v4',d:'30 May 2026',st:'Aprobado',p:'p-on'},
    {n:'Lista de señales instrumentadas',s:'112 puntos con etiquetado',x:'XLSX',t:'Ingeniería',v:'v2',d:'18 May 2026',st:'Aprobado',p:'p-on'},
    {n:'Informe de línea base',s:'Diagnóstico inicial y KPIs de partida',x:'PDF',t:'Informe',v:'v1',d:'20 Feb 2026',st:'Aprobado',p:'p-on'}
  ],
  fotos:['Avance principal de obra','Detalle de instalación','Tablero / equipo','Instrumentación','Pruebas en sitio']
},
{
  id:'SG-2026-021', empresa:'EMP-001', titulo:'Bancos de condensadores — planta norte',
  sector:'Alimentos', ubicacion:'Soledad, Atlántico', servicio:'Gestión de energía',
  estado:'En ejecución', estadoTipo:'b-warn', inicio:'11 May 2026', fin:'30 Oct 2026',
  faseActual:'2 de 5 · Suministro', responsable:'Ing. C. Muñoz', corte:'la semana 30',
  real:34, plan:31, now:6.0,
  kpis:[
    {l:'Avance físico',v:'34%',t:'+3 pts vs. plan',tc:'t-up',d:'Ponderado por peso de cada entregable de la WBS.'},
    {l:'Actividades cerradas',v:'11<small>/32</small>',t:'+2 esta semana',tc:'t-up',d:'Nivel 3 de la WBS, incluye auditoría de cargas.'},
    {l:'Cumplimiento de plazo (SPI)',v:'1.06',t:'Adelantado',tc:'t-up',d:'Valor ganado sobre valor planeado.'},
    {l:'Cumplimiento de costo (CPI)',v:'1.01',t:'En presupuesto',tc:'t-fl',d:'Valor ganado sobre costo real.'}
  ],
  resumen:'La auditoría de cargas y el análisis de armónicos concluyeron sin hallazgos críticos. El suministro de los bancos automáticos está confirmado para la semana 33 y el montaje inicia sin requerir parada de planta.',
  flags:[
    {t:'Hito próximo',s:'Recepción de bancos automáticos en sitio',p:'12 Ago',pc:'p-on'},
    {t:'Requiere tu acción',s:'Confirmar disponibilidad del cuarto eléctrico para montaje',p:'Pendiente',pc:'p-off'},
    {t:'Riesgo abierto',s:'Ninguno registrado en el periodo',p:'Bajo',pc:'p-on'}
  ],
  wbs:[
    {c:'1',    n:'Auditoría de cargas',            w:20, s:3,   e:5,   p:100, st:'done'},
    {c:'1.1',  n:'Medición por alimentador',       w:12, s:3,   e:4.4, p:100, st:'done'},
    {c:'1.1.1',n:'Registro de 14 días',            w:7,  s:3,   e:3.9, p:100, st:'done'},
    {c:'1.1.2',n:'Procesamiento de datos',         w:5,  s:3.6, e:4.4, p:100, st:'done'},
    {c:'1.2',  n:'Análisis de armónicos',          w:8,  s:3.6, e:5,   p:100, st:'done'},
    {c:'2',    n:'Suministro',                     w:25, s:4.6, e:6.6, p:55,  st:'',     bs:4.6, be:6.2},
    {c:'2.1',  n:'Dimensionamiento de escalones',  w:10, s:4.6, e:5.6, p:100, st:'done'},
    {c:'2.2',  n:'Fabricación y despacho',         w:15, s:5.2, e:6.6, p:30,  st:'',     bs:5.2, be:6.2},
    {c:'3',    n:'Montaje',                        w:30, s:6.4, e:7.4, p:0,   st:''},
    {c:'3.1',  n:'Obra civil y soportería',        w:12, s:6.4, e:6.9, p:0,   st:''},
    {c:'3.2',  n:'Montaje eléctrico',              w:18, s:6.7, e:7.4, p:0,   st:''},
    {c:'4',    n:'Puesta en marcha',               w:15, s:7.2, e:7.8, p:0,   st:''},
    {c:'4.1',  n:'Pruebas de maniobra',            w:15, s:7.2, e:7.8, p:0,   st:''},
    {c:'5',    n:'Cierre y medición de resultados',w:10, s:7.6, e:8,   p:0,   st:''}
  ],
  miles:[{n:'Auditoría aprobada',at:5},{n:'Bancos en sitio',at:6.6},{n:'Entrega final',at:8}],
  pv:[0,0,4,14,24,31,48,68], ev:[0,0,5,15,26,34,null,null], fcast:[34,52,72],
  cortes:[{at:5.0,l:'C1 · Jun'},{at:6.0,l:'C2 · Jul'}],
  acPV:[0,0,32,112,192,248,384,544], acEV:[0,0,40,120,208,272,null,null], acAC:[0,0,38,118,204,269,null,null],
  bac:800, eac:792,
  acts:[
    {d:'22 Jul 2026',h:'Dimensionamiento de escalones aprobado',b:'Se definieron 6 escalones con maniobra automática y protección contra resonancia.',w:'Ing. C. Muñoz · S&G',wbs:'2.1'},
    {d:'08 Jul 2026',h:'Análisis de armónicos concluido',b:'Distorsión dentro de límites; no se requiere filtro adicional.',w:'Ing. C. Muñoz · S&G',wbs:'1.2'},
    {d:'19 Jun 2026',h:'Auditoría de cargas por alimentador',b:'Registro de 14 días con medición trifásica en tablero principal.',w:'Cuadrilla de campo',wbs:'1.1.1'},
    {d:'25 May 2026',h:'Levantamiento en sitio',b:'Inventario de tableros, espacios disponibles y rutas de cableado.',w:'Ing. J. Serrano · S&G',wbs:'1'}
  ],
  nextActs:[
    {t:'Recepción de bancos',s:'Verificación contra lista de despacho',p:'12 Ago'},
    {t:'Montaje mecánico',s:'Cuarto eléctrico planta norte',p:'19 Ago'},
    {t:'Pruebas de maniobra',s:'Validación de escalones y factor de potencia',p:'09 Sep'}
  ],
  docs:[
    {n:'Memoria de dimensionamiento',s:'6 escalones · cálculo de compensación',x:'PDF',t:'Ingeniería',v:'v2',d:'22 Jul 2026',st:'Aprobado',p:'p-on'},
    {n:'Plano de disposición en cuarto eléctrico',s:'Requiere tu confirmación',x:'DWG',t:'Plano',v:'v1',d:'24 Jul 2026',st:'Pendiente de firma',p:'p-off'},
    {n:'Informe de análisis de armónicos',s:'Registro de 14 días',x:'PDF',t:'Informe',v:'v1',d:'08 Jul 2026',st:'Aprobado',p:'p-on'},
    {n:'Orden de compra de bancos',s:'Confirmación de proveedor',x:'PDF',t:'Suministro',v:'v1',d:'02 Jul 2026',st:'Aprobado',p:'p-on'}
  ],
  fotos:['Cuarto eléctrico','Tablero principal','Medición en sitio','Equipos recibidos','Montaje']
},
{
  id:'SG-2025-008', empresa:'EMP-001', titulo:'Tableros inteligentes con medición integrada',
  sector:'Alimentos', ubicacion:'Barranquilla', servicio:'Automatización / medición',
  estado:'Cerrado', estadoTipo:'b-ok', inicio:'15 Ene 2025', fin:'28 Nov 2025',
  faseActual:'Cerrado · publicado como caso', responsable:'Ing. J. Serrano', corte:'cierre del proyecto',
  real:100, plan:100, now:8,
  kpis:[
    {l:'Avance físico',v:'100%',t:'Entregado',tc:'t-up',d:'Ponderado por peso de cada entregable de la WBS.'},
    {l:'Actividades cerradas',v:'38<small>/38</small>',t:'Completo',tc:'t-up',d:'Nivel 3 de la WBS, incluye capacitación.'},
    {l:'Cumplimiento de plazo (SPI)',v:'1.00',t:'En plazo',tc:'t-fl',d:'Valor ganado sobre valor planeado.'},
    {l:'Cumplimiento de costo (CPI)',v:'1.03',t:'Bajo presupuesto',tc:'t-up',d:'Valor ganado sobre costo real.'}
  ],
  resumen:'Proyecto entregado y cerrado. Los tableros de distribución con medición integrada quedaron operativos con reportería mensual por centro de costo. Los resultados alimentan el caso de éxito publicado en el sitio.',
  flags:[
    {t:'Acta de cierre',s:'Firmada por ambas partes',p:'28 Nov 2025',pc:'p-on'},
    {t:'Garantía',s:'Vigente hasta noviembre de 2026',p:'Vigente',pc:'p-on'},
    {t:'Caso de éxito',s:'Publicado en el sitio con tus indicadores',p:'Publicado',pc:'p-on'}
  ],
  wbs:[
    {c:'1',    n:'Diagnóstico y alcance',          w:10, s:0,   e:1,   p:100, st:'done'},
    {c:'1.1',  n:'Levantamiento de tableros',      w:10, s:0,   e:1,   p:100, st:'done'},
    {c:'2',    n:'Ingeniería',                     w:20, s:0.8, e:2.4, p:100, st:'done'},
    {c:'2.1',  n:'Unifilares y disposición',       w:12, s:0.8, e:1.8, p:100, st:'done'},
    {c:'2.2',  n:'Listas de señales',              w:8,  s:1.6, e:2.4, p:100, st:'done'},
    {c:'3',    n:'Construcción de tableros',       w:35, s:2.2, e:4.8, p:100, st:'done'},
    {c:'3.1',  n:'Fabricación de gabinetes',       w:18, s:2.2, e:3.8, p:100, st:'done'},
    {c:'3.2',  n:'Alambrado y medidores',          w:17, s:3.2, e:4.8, p:100, st:'done'},
    {c:'3.2.1',n:'Montaje de medidores Modbus',    w:9,  s:3.2, e:4.2, p:100, st:'done'},
    {c:'3.2.2',n:'Pruebas de continuidad',         w:8,  s:4,   e:4.8, p:100, st:'done'},
    {c:'4',    n:'Integración y pruebas',          w:25, s:4.6, e:7,   p:100, st:'done'},
    {c:'4.1',  n:'Integración Modbus / SCADA',     w:13, s:4.6, e:6.4, p:100, st:'done'},
    {c:'4.2',  n:'Dashboard por centro de costo',  w:12, s:5.6, e:7,   p:100, st:'done'},
    {c:'5',    n:'Capacitación y cierre',          w:10, s:7,   e:8,   p:100, st:'done'},
    {c:'5.1',  n:'Capacitación al personal',       w:6,  s:7,   e:7.6, p:100, st:'done'},
    {c:'5.2',  n:'Acta de cierre y as-built',      w:4,  s:7.5, e:8,   p:100, st:'done'}
  ],
  miles:[{n:'Ingeniería aprobada',at:2.4},{n:'Tableros energizados',at:6.4},{n:'Acta de cierre',at:8}],
  pv:[8,20,36,54,70,84,94,100], ev:[8,21,37,55,72,86,95,100], fcast:null,
  cortes:[{at:2.4,l:'C1'},{at:4.8,l:'C2'},{at:6.4,l:'C3'},{at:8,l:'Cierre'}],
  acPV:[48,120,216,324,420,504,564,600], acEV:[48,126,222,330,432,516,570,600], acAC:[46,122,216,320,418,502,554,583],
  bac:600, eac:583,
  acts:[
    {d:'28 Nov 2025',h:'Acta de cierre firmada',b:'Entrega de manuales, respaldos de configuración y planos as-built.',w:'Cliente + S&G',wbs:'5.2'},
    {d:'14 Nov 2025',h:'Capacitación al personal',b:'2 sesiones sobre operación del dashboard y lectura de alarmas.',w:'Ing. J. Serrano · S&G',wbs:'5.1'},
    {d:'22 Oct 2025',h:'Dashboard por centro de costo en producción',b:'Reportería mensual automática y alarmas de desequilibrio.',w:'Ing. C. Muñoz · S&G',wbs:'4.2'},
    {d:'30 Ago 2025',h:'Tableros energizados',b:'Medición trifásica por alimentador operativa en los 6 tableros.',w:'Cuadrilla de campo',wbs:'3.2'}
  ],
  nextActs:[
    {t:'Visita de garantía',s:'Revisión preventiva semestral',p:'Nov 2026'},
    {t:'Informe anual de consumo',s:'Comparativo contra línea base',p:'Ene 2027'}
  ],
  docs:[
    {n:'Acta de cierre del proyecto',s:'Firmada por ambas partes',x:'PDF',t:'Acta',v:'v1',d:'28 Nov 2025',st:'Aprobado',p:'p-on'},
    {n:'Planos as-built',s:'6 tableros · unifilar y disposición',x:'DWG',t:'Plano',v:'v5',d:'20 Nov 2025',st:'Aprobado',p:'p-on'},
    {n:'Informe final de resultados',s:'KPIs de cierre contra línea base',x:'PDF',t:'Informe',v:'v1',d:'26 Nov 2025',st:'Aprobado',p:'p-on'},
    {n:'Manual de operación del dashboard',s:'Entregable de capacitación',x:'PDF',t:'Manual',v:'v2',d:'14 Nov 2025',st:'Aprobado',p:'p-on'}
  ],
  fotos:['Tableros terminados','Medición integrada','Dashboard en operación','Capacitación','Entrega final']
}
];
