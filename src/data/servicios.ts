// src/data/servicios.ts
// Fuente única de verdad de las líneas de servicio.
//
// Alimenta cuatro consumidores, para que no puedan divergir entre sí:
//   1. la sección "Servicios" del home (tarjetas resumidas),
//   2. el hub /servicios (y /en/servicios),
//   3. cada página de detalle /servicios/<slug>,
//   4. el `hasOfferCatalog` del JSON-LD de la organización.
//
// `casos` referencia slugs de la colección `proyectos`; cada página de servicio
// resuelve esos slugs contra la colección para enlazar trabajo real. Un servicio
// puede quedarse sin casos publicados: en ese escenario la sección simplemente
// no se renderiza, en lugar de mostrar trabajo que no le corresponde.

export interface ServicioBloque {
  title: string;
  desc: string;
}

export interface ServicioFaq {
  q: string;
  a: string;
}

/** Contenido de un servicio en un idioma. */
export interface ServicioLocale {
  /** Nombre corto, usado en tarjetas, navegación y migas. */
  title: string;
  /** Resumen de una o dos frases para la tarjeta del home. */
  desc: string;
  /** Etiquetas técnicas de la tarjeta. */
  tags: string[];
  /** <title> del documento. */
  metaTitle: string;
  /** <meta name="description">, máximo 160 caracteres. */
  metaDescription: string;
  /** Encabezado principal de la página de detalle. */
  h1: string;
  /** Párrafo de entrada bajo el H1. */
  lead: string;
  /** Qué cubre el servicio, desglosado. */
  alcance: ServicioBloque[];
  /** Qué recibe el cliente al cerrar el trabajo. */
  entregables: string[];
  /** Preguntas frecuentes; alimentan también el JSON-LD FAQPage. */
  faq: ServicioFaq[];
}

export interface Servicio {
  /** Segmento de URL, compartido por ambos idiomas. */
  slug: string;
  /** Imagen de cabecera; ruta bajo /public. */
  image: string;
  /** Slugs de la colección `proyectos` que ejemplifican este servicio. */
  casos: string[];
  es: ServicioLocale;
  en: ServicioLocale;
}

export const servicios: Servicio[] = [
  {
    slug: 'automatizacion-y-control-industrial',
    image: '/assets/images/proyectos/litoplas-extrusora-27/cover.jpg',
    casos: [
      'litoplas-extrusora-27',
      'litoplas-migracion-scada',
      'litoplas-cortadora',
      'gelco-filtros-arena',
      'farmacapsulab-encapsuladora',
      'ultracem-e300-scada',
      'sonepar-tablero-despacho',
    ],
    es: {
      title: 'Automatización y Control Industrial',
      desc: 'Arquitectura de control, programación de PLC, HMI/SCADA, control batch, MES/MOM y networking industrial. Migración de controladores, puesta en marcha (FAT/SAT) y tableros CCM y consolas de operación.',
      tags: ['Allen Bradley', 'Siemens', 'SCADA', 'MIOBOX'],
      metaTitle: 'Automatización y Control Industrial en Barranquilla',
      metaDescription:
        'Programación de PLC, HMI/SCADA, migración de controladores y puesta en marcha FAT/SAT sobre Allen Bradley y Siemens. Integradores en Barranquilla, Colombia.',
      h1: 'Automatización y control industrial',
      lead: 'Diseñamos e integramos la capa de control de la planta: desde la arquitectura y la programación del PLC hasta el SCADA que el operador usa cada turno. Trabajamos sobre plataformas Allen Bradley y Siemens, y conectamos el proceso a MIOBOX cuando la operación necesita ver sus indicadores en tiempo real.',
      alcance: [
        {
          title: 'Arquitectura de control',
          desc: 'Definimos la topología del sistema —controladores, E/S remotas, redes y niveles de red— antes de escribir una línea de código, para que la solución acompañe el crecimiento de la planta en lugar de limitarlo.',
        },
        {
          title: 'Programación de PLC y HMI/SCADA',
          desc: 'Programamos controladores Allen Bradley (ControlLogix, CompactLogix) y Siemens (S7-1500, TIA Portal), con interfaces de operación en FactoryTalk View, WinCC e InTouch.',
        },
        {
          title: 'Migración de controladores obsoletos',
          desc: 'Reemplazamos plataformas fuera de soporte conservando la lógica de proceso probada, con estrategias de corte que reducen la ventana de parada.',
        },
        {
          title: 'Control batch y MES/MOM',
          desc: 'Estructuramos recetas, fases y trazabilidad de lote para procesos por cargas, e integramos la capa de control con los sistemas de gestión de manufactura.',
        },
        {
          title: 'Networking industrial',
          desc: 'Segmentación y puesta a punto de redes EtherNet/IP, Profinet y Modbus, con switches administrables de grado industrial.',
        },
        {
          title: 'Puesta en marcha FAT/SAT',
          desc: 'Pruebas en fábrica y en sitio con protocolos documentados, acompañamiento en el arranque y transferencia de conocimiento al equipo de mantenimiento.',
        },
      ],
      entregables: [
        'Programa del controlador comentado y con respaldo entregado al cliente',
        'Aplicación HMI/SCADA con sus pantallas de operación y alarmas',
        'Planos eléctricos y de red actualizados según lo construido',
        'Protocolos FAT y SAT firmados',
        'Capacitación al personal de operación y mantenimiento',
      ],
      faq: [
        {
          q: '¿Pueden migrar un control obsoleto sin parar la producción por completo?',
          a: 'En la mayoría de los casos sí. Preparamos y probamos el tablero y el programa nuevos por fuera de la línea, y dejamos la conmutación para una ventana de parada acordada —normalmente un mantenimiento programado o un fin de semana—. La lógica de proceso que ya funciona se conserva; lo que cambia es la plataforma que la ejecuta.',
        },
        {
          q: '¿Trabajan con Allen Bradley y con Siemens?',
          a: 'Con ambas. Somos Bronze System Integrator de Rockwell Automation y también desarrollamos sobre Siemens S7-1500 y TIA Portal. La plataforma se elige por lo que ya existe en la planta y por el soporte disponible, no por preferencia del integrador.',
        },
        {
          q: '¿El código del PLC queda en manos del cliente?',
          a: 'Sí. Entregamos el programa comentado y su respaldo, junto con los planos actualizados. La planta debe poder mantener su propio sistema sin depender de quien lo instaló.',
        },
      ],
    },
    en: {
      title: 'Industrial Automation & Control',
      desc: 'Control architecture, PLC programming, HMI/SCADA, batch control, MES/MOM and industrial networking. Controller migration, commissioning (FAT/SAT), MCC panels and operator consoles.',
      tags: ['Allen Bradley', 'Siemens', 'SCADA', 'MIOBOX'],
      metaTitle: 'Industrial Automation & Control in Colombia',
      metaDescription:
        'PLC programming, HMI/SCADA, controller migration and FAT/SAT commissioning on Allen Bradley and Siemens. System integrators based in Barranquilla, Colombia.',
      h1: 'Industrial automation and control',
      lead: "We design and integrate the plant's control layer: from system architecture and PLC programming to the SCADA your operators use every shift. We work on Allen Bradley and Siemens platforms, and connect the process to MIOBOX when the operation needs its indicators in real time.",
      alcance: [
        {
          title: 'Control architecture',
          desc: 'We define system topology —controllers, remote I/O, networks and network levels— before writing a single line of code, so the solution supports the plant as it grows instead of constraining it.',
        },
        {
          title: 'PLC and HMI/SCADA programming',
          desc: 'We program Allen Bradley (ControlLogix, CompactLogix) and Siemens (S7-1500, TIA Portal) controllers, with operator interfaces in FactoryTalk View, WinCC and InTouch.',
        },
        {
          title: 'Legacy controller migration',
          desc: 'We replace out-of-support platforms while preserving proven process logic, using cutover strategies that shorten the shutdown window.',
        },
        {
          title: 'Batch control and MES/MOM',
          desc: 'We structure recipes, phases and batch traceability for batch processes, and integrate the control layer with manufacturing management systems.',
        },
        {
          title: 'Industrial networking',
          desc: 'Segmentation and tuning of EtherNet/IP, Profinet and Modbus networks, with industrial-grade managed switches.',
        },
        {
          title: 'FAT/SAT commissioning',
          desc: 'Factory and site acceptance testing against documented protocols, start-up support and knowledge transfer to your maintenance team.',
        },
      ],
      entregables: [
        'Commented controller program, with a backup handed over to the client',
        'HMI/SCADA application with its operating screens and alarms',
        'Electrical and network drawings updated as-built',
        'Signed FAT and SAT protocols',
        'Training for operations and maintenance personnel',
      ],
      faq: [
        {
          q: 'Can you migrate a legacy control system without a full production stop?',
          a: 'In most cases, yes. We build and test the new panel and program off-line, and reserve the cutover for an agreed shutdown window —typically scheduled maintenance or a weekend. The process logic that already works is preserved; what changes is the platform running it.',
        },
        {
          q: 'Do you work with both Allen Bradley and Siemens?',
          a: 'Both. We are a Rockwell Automation Bronze System Integrator and we also develop on Siemens S7-1500 and TIA Portal. The platform is chosen based on what the plant already runs and the support available, not on the integrator’s preference.',
        },
        {
          q: 'Does the client keep the PLC code?',
          a: 'Yes. We hand over the commented program and its backup, along with updated drawings. A plant must be able to maintain its own system without depending on whoever installed it.',
        },
      ],
    },
  },
  {
    slug: 'instrumentacion-industrial',
    image: '/assets/images/proyectos/gelco-control-secado/cover.jpg',
    casos: ['gelco-control-secado', 'sonepar-tablero-despacho', 'cabot-gestor-energia'],
    es: {
      title: 'Instrumentación Industrial',
      desc: 'Selección e implementación de instrumentos, diseño de lazos de control y ajuste de transmisores de temperatura, presión, caudal y humedad, con aseguramiento metrológico.',
      tags: ['Lazos de control', 'Transmisores', 'Metrología'],
      metaTitle: 'Instrumentación Industrial y Lazos de Control',
      metaDescription:
        'Selección, montaje y ajuste de transmisores de temperatura, presión, caudal y humedad. Diseño de lazos de control y aseguramiento metrológico en planta.',
      h1: 'Instrumentación industrial',
      lead: 'Un sistema de control no puede ser mejor que la medición que lo alimenta. Seleccionamos, instalamos y ajustamos la instrumentación de campo, y diseñamos los lazos de control que convierten esa medición en una acción estable sobre el proceso.',
      alcance: [
        {
          title: 'Selección de instrumentos',
          desc: 'Elegimos el principio de medición, el rango y los materiales según las condiciones reales del proceso —temperatura, presión, agresividad del fluido y clasificación del área— y no según el catálogo más a mano.',
        },
        {
          title: 'Diseño de lazos de control',
          desc: 'Definimos la estrategia de control, la sintonía de los lazos y las protecciones, para que el proceso responda sin oscilar ni saturar el elemento final.',
        },
        {
          title: 'Transmisores de proceso',
          desc: 'Montaje y ajuste de transmisores de temperatura, presión, caudal, nivel y humedad, con su cableado, condicionamiento de señal y verificación punto a punto.',
        },
        {
          title: 'Aseguramiento metrológico',
          desc: 'Verificación y trazabilidad de las mediciones críticas, para que los datos que sostienen las decisiones de proceso sean defendibles.',
        },
        {
          title: 'Integración con el control',
          desc: 'Llevamos la señal de campo hasta el PLC y el SCADA, con escalamiento, filtrado y alarmas coherentes con la operación.',
        },
      ],
      entregables: [
        'Hojas de datos de los instrumentos seleccionados',
        'Diagramas de lazo y planos de instrumentación actualizados',
        'Registro de verificación y ajuste de cada punto de medición',
        'Parámetros de sintonía documentados',
        'Capacitación al personal de mantenimiento sobre la instrumentación instalada',
      ],
      faq: [
        {
          q: '¿Cómo saben qué instrumento corresponde a mi proceso?',
          a: 'Partimos de las condiciones reales de operación: fluido, rango, temperatura, presión, exigencia de exactitud y clasificación del área. Ese conjunto descarta la mayoría de las opciones antes de mirar marca o precio. Como somos distribuidores multimarca, la recomendación no está atada a un solo fabricante.',
        },
        {
          q: '¿Pueden intervenir solo la instrumentación, sin tocar el control?',
          a: 'Sí. Podemos limitarnos al campo —selección, montaje, cableado y ajuste— e integrarnos a la lógica de control que ya tenga la planta. Cuando el lazo requiere cambios en el programa, lo indicamos antes de empezar.',
        },
        {
          q: '¿Qué incluye el aseguramiento metrológico?',
          a: 'La verificación de que cada medición crítica es trazable y está dentro de tolerancia, con su registro correspondiente. Es lo que permite sostener una decisión de proceso —o una auditoría— con evidencia y no con una lectura suelta.',
        },
      ],
    },
    en: {
      title: 'Industrial Instrumentation',
      desc: 'Instrument selection and implementation, control loop design and tuning of temperature, pressure, flow and humidity transmitters, with metrological assurance.',
      tags: ['Control loops', 'Transmitters', 'Metrology'],
      metaTitle: 'Industrial Instrumentation & Control Loops',
      metaDescription:
        'Selection, installation and tuning of temperature, pressure, flow and humidity transmitters. Control loop design and metrological assurance on the plant floor.',
      h1: 'Industrial instrumentation',
      lead: 'A control system can never be better than the measurement feeding it. We select, install and tune field instrumentation, and design the control loops that turn that measurement into stable action on the process.',
      alcance: [
        {
          title: 'Instrument selection',
          desc: 'We choose the measuring principle, range and materials based on actual process conditions —temperature, pressure, fluid aggressiveness and area classification— rather than on whichever catalogue is closest to hand.',
        },
        {
          title: 'Control loop design',
          desc: 'We define the control strategy, loop tuning and protections, so the process responds without oscillating or saturating the final element.',
        },
        {
          title: 'Process transmitters',
          desc: 'Installation and tuning of temperature, pressure, flow, level and humidity transmitters, including wiring, signal conditioning and point-to-point verification.',
        },
        {
          title: 'Metrological assurance',
          desc: 'Verification and traceability of critical measurements, so the data behind process decisions can be defended.',
        },
        {
          title: 'Integration with the control layer',
          desc: 'We bring the field signal into the PLC and SCADA, with scaling, filtering and alarms consistent with how the plant actually operates.',
        },
      ],
      entregables: [
        'Datasheets for every selected instrument',
        'Loop diagrams and updated instrumentation drawings',
        'Verification and adjustment record for each measuring point',
        'Documented tuning parameters',
        'Training for maintenance personnel on the installed instrumentation',
      ],
      faq: [
        {
          q: 'How do you determine the right instrument for my process?',
          a: 'We start from actual operating conditions: fluid, range, temperature, pressure, accuracy requirements and area classification. That set rules out most options before brand or price enters the conversation. Because we are a multi-brand distributor, our recommendation is not tied to a single manufacturer.',
        },
        {
          q: 'Can you work on instrumentation only, without touching the control system?',
          a: 'Yes. We can stay in the field —selection, installation, wiring and tuning— and integrate with the control logic the plant already runs. When a loop does require program changes, we flag it before starting.',
        },
        {
          q: 'What does metrological assurance cover?',
          a: 'Verification that each critical measurement is traceable and within tolerance, with its corresponding record. That is what lets you defend a process decision —or an audit— with evidence rather than an isolated reading.',
        },
      ],
    },
  },
  {
    slug: 'eficiencia-energetica',
    image: '/assets/images/proyectos/cabot-gestor-energia/cover.jpg',
    casos: [
      'cabot-gestor-energia',
      'gelco-subestacion-1-miobox',
      'gelco-subestacion-2-miobox',
      'gelco-medida-media-tension',
    ],
    es: {
      title: 'Eficiencia Energética',
      desc: 'Análisis de calidad de energía, monitoreo y telemedida, y proyectos de ahorro energético con incorporación de energías renovables.',
      tags: ['Calidad de energía', 'Telemedida', 'Renovables'],
      metaTitle: 'Eficiencia Energética y Calidad de Energía Industrial',
      metaDescription:
        'Análisis de calidad de energía, telemedida y monitoreo en tiempo real con MIOBOX. Proyectos de ahorro energético y energías renovables para la industria.',
      h1: 'Eficiencia energética',
      lead: 'La energía suele ser el segundo costo de una planta industrial y el peor medido. Instrumentamos la subestación y los circuitos críticos, llevamos esa medición a MIOBOX y convertimos el consumo en un indicador que la gerencia puede seguir y sobre el que puede decidir.',
      alcance: [
        {
          title: 'Análisis de calidad de energía',
          desc: 'Medición y diagnóstico de armónicos, factor de potencia, desbalance y perturbaciones, para identificar qué está degradando los equipos y encareciendo la factura.',
        },
        {
          title: 'Monitoreo y telemedida',
          desc: 'Instalación de medidores en subestación y circuitos críticos, con transmisión continua hacia MIOBOX para ver el consumo por área, línea o turno.',
        },
        {
          title: 'Corrección del factor de potencia',
          desc: 'Dimensionamiento e instalación de bancos de condensadores, de 1 a 1520 kvar, con la protección y maniobra que corresponde a cada instalación.',
        },
        {
          title: 'Proyectos de ahorro energético',
          desc: 'Identificación de oportunidades a partir de la medición real, con la estimación de ahorro asociada a cada intervención antes de ejecutarla.',
        },
        {
          title: 'Incorporación de energías renovables',
          desc: 'Evaluación e integración de generación renovable en la instalación existente, considerando su efecto sobre la operación y sobre la infraestructura eléctrica actual.',
        },
      ],
      entregables: [
        'Informe de calidad de energía con las mediciones de base',
        'Tablero de indicadores de consumo en MIOBOX',
        'Memoria de cálculo del banco de condensadores, cuando aplica',
        'Plan de intervenciones priorizado por ahorro estimado',
        'Planos eléctricos actualizados según lo construido',
      ],
      faq: [
        {
          q: '¿Por dónde se empieza un proyecto de eficiencia energética?',
          a: 'Por medir. Sin una línea base real no hay forma de saber si una intervención ahorró algo ni cuánto. El primer paso es instrumentar la subestación y los circuitos que más pesan, dejar correr la medición y recién entonces priorizar dónde intervenir.',
        },
        {
          q: '¿Qué es MIOBOX y por qué aparece en estos proyectos?',
          a: 'Es nuestra plataforma propia de microservicios IIoT. Recoge la medición de campo y la presenta como indicadores de gestión, para que el consumo se pueda seguir por área, línea o turno en lugar de aparecer una vez al mes en la factura.',
        },
        {
          q: '¿Corregir el factor de potencia siempre conviene?',
          a: 'Conviene cuando la penalización existe y la instalación lo permite. Antes de proponer un banco medimos: si hay armónicos importantes, un banco mal dimensionado puede entrar en resonancia y empeorar las cosas. Por eso el dimensionamiento sale de la medición, no de un estimado.',
        },
      ],
    },
    en: {
      title: 'Energy Efficiency',
      desc: 'Power quality analysis, monitoring and telemetering, and energy-saving projects including renewable energy integration.',
      tags: ['Power quality', 'Telemetering', 'Renewables'],
      metaTitle: 'Industrial Energy Efficiency & Power Quality',
      metaDescription:
        'Power quality analysis, telemetering and real-time monitoring with MIOBOX. Energy-saving and renewable energy projects for industry in Colombia.',
      h1: 'Energy efficiency',
      lead: 'Energy is usually the second largest cost in an industrial plant, and the worst measured. We instrument the substation and the critical feeders, bring that measurement into MIOBOX, and turn consumption into an indicator leadership can track and act on.',
      alcance: [
        {
          title: 'Power quality analysis',
          desc: 'Measurement and diagnosis of harmonics, power factor, imbalance and disturbances, to identify what is degrading equipment and inflating the bill.',
        },
        {
          title: 'Monitoring and telemetering',
          desc: 'Meter installation at the substation and on critical feeders, streaming continuously into MIOBOX so consumption can be seen by area, line or shift.',
        },
        {
          title: 'Power factor correction',
          desc: 'Sizing and installation of capacitor banks, from 1 to 1520 kvar, with the protection and switchgear each installation calls for.',
        },
        {
          title: 'Energy-saving projects',
          desc: 'Opportunities identified from actual measurement, each with its estimated saving established before the work is carried out.',
        },
        {
          title: 'Renewable energy integration',
          desc: 'Assessment and integration of renewable generation into the existing installation, accounting for its effect on operations and on current electrical infrastructure.',
        },
      ],
      entregables: [
        'Power quality report with baseline measurements',
        'Consumption dashboard in MIOBOX',
        'Capacitor bank sizing calculations, where applicable',
        'Intervention plan prioritised by estimated saving',
        'Electrical drawings updated as-built',
      ],
      faq: [
        {
          q: 'Where does an energy efficiency project start?',
          a: 'With measurement. Without a real baseline there is no way to know whether an intervention saved anything, or how much. The first step is to instrument the substation and the heaviest feeders, let the measurement run, and only then prioritise where to act.',
        },
        {
          q: 'What is MIOBOX, and why does it appear in these projects?',
          a: 'It is our own IIoT microservices platform. It collects field measurement and presents it as management indicators, so consumption can be tracked by area, line or shift instead of showing up once a month on the utility bill.',
        },
        {
          q: 'Is power factor correction always worth it?',
          a: 'It is worth it when the penalty exists and the installation allows for it. Before proposing a bank we measure: if significant harmonics are present, an incorrectly sized bank can resonate and make things worse. That is why sizing comes from measurement, not from an estimate.',
        },
      ],
    },
  },
  {
    slug: 'montaje-electrico',
    image: '/assets/images/proyectos/gelco-medida-media-tension/cover.jpg',
    casos: [
      'gelco-medida-media-tension',
      'gelco-factibilidad-carga',
      'gelco-transferencia-automatica',
      'polyrec-seccionador-sf6',
      'gelco-subestacion-1-miobox',
    ],
    es: {
      title: 'Montaje Eléctrico',
      desc: 'Diseño de instalaciones eléctricas, estudios de factibilidad y montaje industrial y comercial, con mantenimiento y cumplimiento normativo RETIE.',
      tags: ['RETIE', 'Montaje industrial', 'Mantenimiento'],
      metaTitle: 'Montaje Eléctrico Industrial y RETIE en Barranquilla',
      metaDescription:
        'Diseño y montaje de instalaciones eléctricas industriales y comerciales, subestaciones y media tensión, con cumplimiento RETIE. Barranquilla y toda Colombia.',
      h1: 'Montaje eléctrico',
      lead: 'Diseñamos y ejecutamos instalaciones eléctricas industriales y comerciales, desde el estudio de factibilidad hasta la entrega con cumplimiento RETIE. Intervenimos baja y media tensión: subestaciones, sistemas de medida, transferencias automáticas y protecciones.',
      alcance: [
        {
          title: 'Estudios de factibilidad',
          desc: 'Evaluación de la capacidad instalada frente a la carga proyectada, para saber qué admite la instalación actual antes de comprometer una ampliación.',
        },
        {
          title: 'Diseño de instalaciones eléctricas',
          desc: 'Cálculo y diseño de acometidas, tableros, canalizaciones y puestas a tierra, con la memoria de cálculo que exige la normativa.',
        },
        {
          title: 'Subestaciones y media tensión',
          desc: 'Montaje y renovación de subestaciones, sistemas de medida en media tensión, seccionadores y equipos de protección y maniobra.',
        },
        {
          title: 'Transferencias automáticas',
          desc: 'Instalación de sistemas de transferencia con planta de respaldo, para que los procesos críticos no dependan de la continuidad de la red.',
        },
        {
          title: 'Cumplimiento RETIE',
          desc: 'Ejecutamos conforme al Reglamento Técnico de Instalaciones Eléctricas y acompañamos el proceso de certificación con la documentación correspondiente.',
        },
        {
          title: 'Mantenimiento eléctrico',
          desc: 'Mantenimiento preventivo y correctivo de la instalación, con inspección termográfica y revisión de protecciones.',
        },
      ],
      entregables: [
        'Memorias de cálculo y planos eléctricos según lo construido',
        'Documentación para el proceso de certificación RETIE',
        'Protocolos de prueba de protecciones y puesta a tierra',
        'Registro fotográfico del montaje',
        'Recomendaciones de mantenimiento para la instalación entregada',
      ],
      faq: [
        {
          q: '¿Qué exige RETIE en un montaje eléctrico industrial?',
          a: 'RETIE es el reglamento técnico obligatorio en Colombia para instalaciones eléctricas. Exige que el diseño tenga memorias de cálculo, que los productos usados estén certificados, que la ejecución la haga personal competente y que la instalación se someta a inspección por un organismo acreditado. Nosotros ejecutamos bajo ese marco y entregamos la documentación que el inspector va a pedir.',
        },
        {
          q: '¿Hacen el estudio de factibilidad antes de la ampliación?',
          a: 'Sí, y recomendamos hacerlo. Sumar carga sin verificar qué admite la subestación, la acometida y las protecciones es la vía más rápida a una falla o a un rechazo en la inspección. El estudio dice qué se puede conectar hoy y qué requiere obra previa.',
        },
        {
          q: '¿Intervienen media tensión?',
          a: 'Sí. Hemos ejecutado sistemas de medida en media tensión, seccionadores SF6, reconexión automática y renovación de subestaciones, siempre con la coordinación de protecciones que corresponde.',
        },
      ],
    },
    en: {
      title: 'Electrical Installation',
      desc: 'Electrical installation design, feasibility studies and industrial and commercial installation work, with maintenance and RETIE regulatory compliance.',
      tags: ['RETIE', 'Industrial installation', 'Maintenance'],
      metaTitle: 'Industrial Electrical Installation & RETIE Compliance',
      metaDescription:
        'Design and installation of industrial and commercial electrical systems, substations and medium voltage, with RETIE compliance. Barranquilla, Colombia.',
      h1: 'Electrical installation',
      lead: 'We design and execute industrial and commercial electrical installations, from the feasibility study through to handover with RETIE compliance. We work in both low and medium voltage: substations, metering systems, automatic transfer schemes and protection.',
      alcance: [
        {
          title: 'Feasibility studies',
          desc: 'Assessment of installed capacity against projected load, so you know what the current installation can take before committing to an expansion.',
        },
        {
          title: 'Electrical installation design',
          desc: 'Calculation and design of service entrances, panels, raceways and earthing systems, with the calculation records the regulation requires.',
        },
        {
          title: 'Substations and medium voltage',
          desc: 'Installation and renovation of substations, medium-voltage metering systems, disconnectors and protection and switching equipment.',
        },
        {
          title: 'Automatic transfer schemes',
          desc: 'Installation of transfer systems with standby generation, so critical processes do not depend on grid continuity.',
        },
        {
          title: 'RETIE compliance',
          desc: 'We execute in line with Colombia’s technical regulation for electrical installations and support the certification process with the corresponding documentation.',
        },
        {
          title: 'Electrical maintenance',
          desc: 'Preventive and corrective maintenance of the installation, including thermographic inspection and protection review.',
        },
      ],
      entregables: [
        'Calculation records and as-built electrical drawings',
        'Documentation for the RETIE certification process',
        'Test protocols for protection systems and earthing',
        'Photographic record of the installation work',
        'Maintenance recommendations for the delivered installation',
      ],
      faq: [
        {
          q: 'What does RETIE require on an industrial electrical installation?',
          a: 'RETIE is Colombia’s mandatory technical regulation for electrical installations. It requires calculation records behind the design, certified products, execution by competent personnel, and inspection by an accredited body. We execute within that framework and hand over the documentation the inspector will ask for.',
        },
        {
          q: 'Do you run a feasibility study before an expansion?',
          a: 'Yes, and we recommend it. Adding load without verifying what the substation, service entrance and protection can take is the fastest route to a failure or to a rejected inspection. The study establishes what can be connected today and what requires prior work.',
        },
        {
          q: 'Do you work on medium voltage?',
          a: 'Yes. We have delivered medium-voltage metering systems, SF6 disconnectors, automatic reclosing and substation renovations, always with the corresponding protection coordination.',
        },
      ],
    },
  },
  {
    slug: 'mantenimiento-mecanico',
    image: '/assets/img/pruebas-1.jpg',
    casos: ['litoplas-shelter-vfd'],
    es: {
      title: 'Mantenimiento Mecánico',
      desc: 'Mantenimiento preventivo y correctivo, montaje y diagnóstico de equipos, soldadura y fabricación de piezas para mantener la planta en operación.',
      tags: ['Preventivo', 'Correctivo', 'Soldadura'],
      metaTitle: 'Mantenimiento Mecánico Industrial',
      metaDescription:
        'Mantenimiento preventivo y correctivo, montaje y diagnóstico de equipos, soldadura y fabricación de piezas para plantas industriales en Colombia.',
      h1: 'Mantenimiento mecánico',
      lead: 'Un proyecto de automatización sirve de poco si el equipo que controla se detiene por una falla mecánica. Cubrimos el mantenimiento preventivo y correctivo, el montaje y el diagnóstico de equipos, y fabricamos las piezas que hacen falta cuando el repuesto no llega a tiempo.',
      alcance: [
        {
          title: 'Mantenimiento preventivo',
          desc: 'Planes de intervención por equipo y frecuencia, para reemplazar la reparación de urgencia por una parada programada.',
        },
        {
          title: 'Mantenimiento correctivo',
          desc: 'Atención de fallas con diagnóstico de causa, no solo reposición de la pieza rota, para que el mismo problema no vuelva en el próximo turno.',
        },
        {
          title: 'Montaje y alineación de equipos',
          desc: 'Instalación, nivelación y alineación de equipos rotativos y de transmisión, con la verificación posterior al montaje.',
        },
        {
          title: 'Soldadura y fabricación de piezas',
          desc: 'Fabricación de componentes y estructuras a medida cuando el repuesto original está descontinuado o su tiempo de entrega compromete la producción.',
        },
        {
          title: 'Diagnóstico de equipos',
          desc: 'Evaluación del estado del equipo para decidir con criterio entre reparar, reconstruir o reemplazar.',
        },
      ],
      entregables: [
        'Informe de diagnóstico con la causa identificada',
        'Registro de las intervenciones realizadas',
        'Plan de mantenimiento preventivo por equipo',
        'Planos de las piezas fabricadas a medida',
        'Recomendaciones de repuestos críticos a mantener en stock',
      ],
      faq: [
        {
          q: '¿Atienden fallas puntuales o solo contratos de mantenimiento?',
          a: 'Ambos. Atendemos la falla puntual con diagnóstico de causa, y también armamos planes preventivos por equipo cuando la planta quiere dejar de operar en modo reactivo.',
        },
        {
          q: '¿Fabrican piezas que ya no consigo?',
          a: 'Sí. Cuando el repuesto original está descontinuado o su tiempo de entrega no acompaña a la producción, fabricamos el componente a medida a partir de la pieza existente o del plano.',
        },
        {
          q: '¿Este servicio se combina con la parte eléctrica y de control?',
          a: 'Suele convenir. Muchas fallas que se leen como eléctricas son mecánicas, y al revés. Poder intervenir las tres capas evita el ida y vuelta entre proveedores mientras el equipo sigue detenido.',
        },
      ],
    },
    en: {
      title: 'Mechanical Maintenance',
      desc: 'Preventive and corrective maintenance, equipment installation and diagnostics, welding and custom part manufacturing to keep the plant running.',
      tags: ['Preventive', 'Corrective', 'Welding'],
      metaTitle: 'Industrial Mechanical Maintenance',
      metaDescription:
        'Preventive and corrective maintenance, equipment installation and diagnostics, welding and custom part manufacturing for industrial plants in Colombia.',
      h1: 'Mechanical maintenance',
      lead: 'An automation project counts for little if the equipment it controls stops on a mechanical failure. We cover preventive and corrective maintenance, equipment installation and diagnostics, and we manufacture the parts you need when the spare will not arrive in time.',
      alcance: [
        {
          title: 'Preventive maintenance',
          desc: 'Intervention plans by equipment and frequency, replacing emergency repair with scheduled downtime.',
        },
        {
          title: 'Corrective maintenance',
          desc: 'Failure response with root cause diagnosis, not just replacement of the broken part, so the same problem does not return next shift.',
        },
        {
          title: 'Equipment installation and alignment',
          desc: 'Installation, levelling and alignment of rotating and transmission equipment, with post-installation verification.',
        },
        {
          title: 'Welding and part manufacturing',
          desc: 'Custom components and structures manufactured when the original spare is discontinued or its lead time puts production at risk.',
        },
        {
          title: 'Equipment diagnostics',
          desc: 'Assessment of equipment condition to decide, on evidence, between repair, rebuild or replacement.',
        },
      ],
      entregables: [
        'Diagnostic report with the identified root cause',
        'Record of the interventions carried out',
        'Preventive maintenance plan by equipment',
        'Drawings for any custom-manufactured parts',
        'Recommendations on critical spares to keep in stock',
      ],
      faq: [
        {
          q: 'Do you handle one-off failures, or only maintenance contracts?',
          a: 'Both. We respond to one-off failures with root cause diagnosis, and we also build preventive plans by equipment when a plant wants to stop operating reactively.',
        },
        {
          q: 'Can you manufacture parts I can no longer source?',
          a: 'Yes. When the original spare is discontinued or its lead time does not match production needs, we manufacture the component to measure from the existing part or from the drawing.',
        },
        {
          q: 'Does this combine with the electrical and control work?',
          a: 'It usually pays to. Many failures that read as electrical are mechanical, and the other way round. Being able to work across all three layers avoids bouncing between suppliers while the equipment stays down.',
        },
      ],
    },
  },
  {
    slug: 'tableros-electricos',
    image: '/assets/img/tablero-1.jpg',
    casos: [
      'bb-tableros-baja-tension',
      'gelco-subestacion-2-miobox',
      'sonepar-tablero-despacho',
      'litoplas-shelter-vfd',
    ],
    es: {
      title: 'Diseño de Tableros Eléctricos',
      desc: 'Tableros de distribución y transferencia automática, bancos de condensadores (1 a 1520 kvar), integración de PLC/IO y arranque de variadores de ½ a 900 HP.',
      tags: ['Bancos de condensadores', 'Variadores ½–900 HP', 'PLC/IO'],
      metaTitle: 'Diseño y Fabricación de Tableros Eléctricos',
      metaDescription:
        'Tableros de distribución, transferencia automática, bancos de condensadores de 1 a 1520 kvar y arranque de variadores de ½ a 900 HP. Fabricación bajo RETIE.',
      h1: 'Diseño de tableros eléctricos',
      lead: 'Diseñamos y fabricamos tableros de distribución, control, transferencia automática y corrección de factor de potencia. Cada tablero sale con su memoria de cálculo, sus planos y sus pruebas, porque un tablero mal dimensionado no falla el día que se instala: falla el día de más carga.',
      alcance: [
        {
          title: 'Tableros de distribución y CCM',
          desc: 'Tableros de distribución y centros de control de motores, con la coordinación de protecciones y la selectividad que exige la instalación.',
        },
        {
          title: 'Transferencia automática',
          desc: 'Tableros de transferencia entre red y planta de respaldo, con la lógica de conmutación y los enclavamientos de seguridad correspondientes.',
        },
        {
          title: 'Bancos de condensadores',
          desc: 'Corrección de factor de potencia de 1 a 1520 kvar, dimensionada a partir de la medición real y no de un estimado de placa.',
        },
        {
          title: 'Arranque de motores y variadores',
          desc: 'Arranque directo, suave y por variador de velocidad, de ½ a 900 HP, con la disipación y ventilación que el equipo necesita.',
        },
        {
          title: 'Integración de PLC y E/S',
          desc: 'Montaje del controlador, las E/S y la red dentro del mismo tablero, con el cableado identificado y accesible para mantenimiento.',
        },
        {
          title: 'Consolas de operación',
          desc: 'Consolas y pupitres de operación con su HMI, dispuestos según cómo trabaja realmente el operador en planta.',
        },
      ],
      entregables: [
        'Memoria de cálculo y selección de protecciones',
        'Planos unifilares, de fuerza y de control',
        'Listado de bornes y de cableado identificado',
        'Protocolo de pruebas en fábrica (FAT) firmado',
        'Manual del tablero y recomendaciones de mantenimiento',
      ],
      faq: [
        {
          q: '¿Fabrican el tablero o solo lo diseñan?',
          a: 'Las dos cosas. Hacemos el diseño con su memoria de cálculo y la fabricación, y entregamos el tablero probado en fábrica antes de que salga hacia el sitio.',
        },
        {
          q: '¿Qué rango de variadores manejan?',
          a: 'De ½ a 900 HP. El dimensionamiento no termina en el variador: hay que resolver la disipación de calor dentro del tablero, y en algunos casos la solución correcta es un shelter climatizado en lugar de un gabinete convencional.',
        },
        {
          q: '¿Los tableros cumplen RETIE?',
          a: 'Sí. Fabricamos bajo el reglamento, con producto certificado y la documentación que requiere el proceso de inspección.',
        },
      ],
    },
    en: {
      title: 'Electrical Panel Design',
      desc: 'Distribution and automatic transfer panels, capacitor banks (1 to 1520 kvar), PLC/IO integration and motor drive starting from ½ to 900 HP.',
      tags: ['Capacitor banks', 'Drives ½–900 HP', 'PLC/IO'],
      metaTitle: 'Electrical Panel Design & Manufacturing',
      metaDescription:
        'Distribution panels, automatic transfer, capacitor banks from 1 to 1520 kvar and drive starting from ½ to 900 HP. Manufactured under RETIE regulation.',
      h1: 'Electrical panel design',
      lead: 'We design and manufacture distribution, control, automatic transfer and power factor correction panels. Every panel ships with its calculation records, drawings and test results, because an undersized panel does not fail the day it is installed: it fails on the heaviest load day.',
      alcance: [
        {
          title: 'Distribution panels and MCCs',
          desc: 'Distribution boards and motor control centres, with the protection coordination and selectivity the installation requires.',
        },
        {
          title: 'Automatic transfer',
          desc: 'Transfer panels between grid and standby generation, with the corresponding switching logic and safety interlocks.',
        },
        {
          title: 'Capacitor banks',
          desc: 'Power factor correction from 1 to 1520 kvar, sized from actual measurement rather than a nameplate estimate.',
        },
        {
          title: 'Motor starting and drives',
          desc: 'Direct, soft and variable frequency starting, from ½ to 900 HP, with the heat dissipation and ventilation the equipment needs.',
        },
        {
          title: 'PLC and I/O integration',
          desc: 'Controller, I/O and network mounted inside the same panel, with wiring labelled and accessible for maintenance.',
        },
        {
          title: 'Operator consoles',
          desc: 'Operator consoles and desks with their HMI, laid out around how the operator actually works on the plant floor.',
        },
      ],
      entregables: [
        'Calculation records and protection selection',
        'Single-line, power and control drawings',
        'Terminal schedule and labelled wiring list',
        'Signed factory acceptance test (FAT) protocol',
        'Panel manual and maintenance recommendations',
      ],
      faq: [
        {
          q: 'Do you manufacture the panel, or only design it?',
          a: 'Both. We produce the design with its calculation records and the manufacturing, and hand over the panel factory-tested before it ships to site.',
        },
        {
          q: 'What drive range do you handle?',
          a: 'From ½ to 900 HP. Sizing does not stop at the drive: heat dissipation inside the panel has to be resolved, and in some cases the correct answer is a climate-controlled shelter rather than a conventional enclosure.',
        },
        {
          q: 'Do the panels comply with RETIE?',
          a: 'Yes. We manufacture under the regulation, with certified product and the documentation the inspection process requires.',
        },
      ],
    },
  },
  {
    slug: 'suministro-de-componentes',
    image: '/assets/images/proyectos/bb-tableros-baja-tension/cover.jpg',
    casos: ['bb-tableros-baja-tension', 'polyrec-seccionador-sf6', 'ultracem-e300-scada'],
    es: {
      title: 'Suministro y Asesoría de Componentes',
      desc: 'Como distribuidores multimarca, suministramos partes y componentes eléctricos, electrónicos, de automatización y especializados. Sumamos valor asesorando su selección técnica —sensores, medidores, instrumentos y más— para que cada componente calce con la solución.',
      tags: ['Distribuidor multimarca', 'Sensores y medidores', 'Asesoría técnica'],
      metaTitle: 'Suministro de Componentes Eléctricos y de Automatización',
      metaDescription:
        'Distribuidor multimarca de componentes eléctricos, electrónicos y de automatización: sensores, medidores, instrumentos y repuestos, con asesoría técnica.',
      h1: 'Suministro y asesoría de componentes',
      lead: 'Suministramos partes y componentes eléctricos, electrónicos, de automatización y especializados. Como somos distribuidores multimarca y además integramos, la recomendación no está atada a un fabricante: proponemos el componente que resuelve el problema, no el que toca vender.',
      alcance: [
        {
          title: 'Distribución multimarca',
          desc: 'Acceso a componentes de distintos fabricantes, con la comparación técnica que permite decidir entre alternativas equivalentes.',
        },
        {
          title: 'Asesoría técnica de selección',
          desc: 'Verificamos que el componente sea compatible con la instalación existente —tensión, señal, protocolo, condiciones ambientales— antes de la compra y no después.',
        },
        {
          title: 'Sensores, medidores e instrumentos',
          desc: 'Instrumentación de proceso y medición eléctrica, seleccionada según el rango y la exactitud que el punto de medición realmente exige.',
        },
        {
          title: 'Componentes de automatización',
          desc: 'Controladores, E/S, variadores, relés inteligentes, equipos de red industrial y accesorios de tablero.',
        },
        {
          title: 'Repuestos y obsolescencia',
          desc: 'Búsqueda de repuestos para equipos en operación y propuesta de reemplazo equivalente cuando la referencia original quedó descontinuada.',
        },
      ],
      entregables: [
        'Cotización con la justificación técnica de cada referencia',
        'Hojas de datos de los componentes propuestos',
        'Verificación de compatibilidad con la instalación existente',
        'Alternativas equivalentes cuando el plazo de entrega lo exige',
        'Acompañamiento en la puesta en servicio del componente suministrado',
      ],
      faq: [
        {
          q: '¿Venden solo el componente o también lo instalan?',
          a: 'Las dos opciones. Podemos limitarnos al suministro, o hacernos cargo del montaje y la puesta en servicio. La ventaja de que integremos es que la asesoría de selección viene de quien después tiene que hacer funcionar el equipo.',
        },
        {
          q: 'Mi equipo usa una referencia descontinuada. ¿Tienen salida?',
          a: 'Normalmente sí. Buscamos el repuesto en el mercado y, cuando ya no existe, proponemos un reemplazo equivalente verificando compatibilidad de tensión, señal, protocolo y montaje. Ese análisis es justamente donde se cometen los errores caros.',
        },
        {
          q: '¿Por qué comprar acá y no directo al fabricante?',
          a: 'Por la asesoría. Un fabricante recomienda su propio catálogo; nosotros comparamos entre marcas y verificamos que el componente calce con lo que la planta ya tiene instalado. Si la mejor opción es comprar directo, también lo decimos.',
        },
      ],
    },
    en: {
      title: 'Component Supply & Advisory',
      desc: 'As a multi-brand distributor, we supply electrical, electronic, automation and specialised parts and components. We add value by advising on technical selection —sensors, meters, instruments and more— so each component fits the solution.',
      tags: ['Multi-brand distributor', 'Sensors and meters', 'Technical advisory'],
      metaTitle: 'Electrical & Automation Component Supply',
      metaDescription:
        'Multi-brand distributor of electrical, electronic and automation components: sensors, meters, instruments and spares, with technical selection advisory.',
      h1: 'Component supply and advisory',
      lead: 'We supply electrical, electronic, automation and specialised parts and components. Because we are a multi-brand distributor and we also integrate, our recommendation is not tied to a manufacturer: we propose the component that solves the problem, not the one we happen to sell.',
      alcance: [
        {
          title: 'Multi-brand distribution',
          desc: 'Access to components from different manufacturers, with the technical comparison needed to decide between equivalent alternatives.',
        },
        {
          title: 'Technical selection advisory',
          desc: 'We verify the component is compatible with the existing installation —voltage, signal, protocol, environmental conditions— before purchase rather than after.',
        },
        {
          title: 'Sensors, meters and instruments',
          desc: 'Process instrumentation and electrical metering, selected for the range and accuracy the measuring point genuinely requires.',
        },
        {
          title: 'Automation components',
          desc: 'Controllers, I/O, drives, intelligent relays, industrial networking equipment and panel accessories.',
        },
        {
          title: 'Spares and obsolescence',
          desc: 'Sourcing of spares for equipment in service, and equivalent replacement proposals when the original reference has been discontinued.',
        },
      ],
      entregables: [
        'Quotation with technical justification for each reference',
        'Datasheets for the proposed components',
        'Compatibility verification against the existing installation',
        'Equivalent alternatives when lead time demands it',
        'Support during commissioning of the supplied component',
      ],
      faq: [
        {
          q: 'Do you only sell the component, or install it too?',
          a: 'Either. We can limit ourselves to supply, or take on installation and commissioning. The advantage of us being integrators is that the selection advice comes from whoever then has to make the equipment work.',
        },
        {
          q: 'My equipment uses a discontinued reference. Can you help?',
          a: 'Usually yes. We source the spare on the market and, when it no longer exists, we propose an equivalent replacement after verifying voltage, signal, protocol and mounting compatibility. That analysis is exactly where the expensive mistakes get made.',
        },
        {
          q: 'Why buy here instead of directly from the manufacturer?',
          a: 'For the advisory. A manufacturer recommends its own catalogue; we compare across brands and verify the component fits what the plant already runs. If buying direct is genuinely the better option, we say so.',
        },
      ],
    },
  },
  {
    slug: 'vigilancia-electronica',
    image: '/assets/img/portada-principal.jpg',
    casos: [],
    es: {
      title: 'Vigilancia Electrónica',
      desc: 'Suministro, instalación y montaje de sistemas de vigilancia y seguridad electrónica —CCTV, control de acceso y monitoreo— integrados a la infraestructura de la planta o la instalación.',
      tags: ['CCTV', 'Control de acceso', 'Monitoreo'],
      metaTitle: 'Vigilancia Electrónica, CCTV y Control de Acceso',
      metaDescription:
        'Suministro, instalación y montaje de CCTV, control de acceso y sistemas de monitoreo, integrados a la infraestructura de red de la planta o instalación.',
      h1: 'Vigilancia electrónica',
      lead: 'Suministramos, instalamos y montamos sistemas de vigilancia y seguridad electrónica. Al venir del mundo industrial, los integramos a la infraestructura de red que la planta ya tiene, en vez de montar una red paralela que después nadie mantiene.',
      alcance: [
        {
          title: 'CCTV',
          desc: 'Selección y montaje de cámaras según lo que hay que ver realmente —distancia, iluminación y condiciones ambientales— con su grabación y retención.',
        },
        {
          title: 'Control de acceso',
          desc: 'Sistemas de control de acceso a áreas restringidas, con la trazabilidad de entradas y salidas correspondiente.',
        },
        {
          title: 'Monitoreo',
          desc: 'Centralización de la vigilancia en un punto de monitoreo, con las alarmas y notificaciones que la operación necesita.',
        },
        {
          title: 'Integración a la red existente',
          desc: 'Montaje sobre la infraestructura de red de planta, con la segmentación adecuada para que el tráfico de video no interfiera con el de control.',
        },
      ],
      entregables: [
        'Plano de ubicación de cámaras y equipos con sus zonas de cobertura',
        'Configuración de grabación, retención y accesos entregada al cliente',
        'Documentación de la segmentación de red utilizada',
        'Capacitación al personal responsable del monitoreo',
        'Recomendaciones de mantenimiento del sistema',
      ],
      faq: [
        {
          q: '¿Puedo usar la red que ya tiene la planta?',
          a: 'En general sí, y suele ser lo indicado. Lo importante es segmentar: el video consume ancho de banda y no debe compartir dominio con el tráfico de control. Esa separación la resolvemos en el diseño, no después.',
        },
        {
          q: '¿Cuántas cámaras necesito?',
          a: 'Depende de qué hay que ver, no del tamaño del predio. Partimos de las zonas y los eventos que se quieren cubrir, y de ahí sale la cantidad, el tipo de cámara y su ubicación. Más cámaras mal ubicadas no equivalen a más seguridad.',
        },
        {
          q: '¿El sistema queda administrado por el cliente?',
          a: 'Sí. Entregamos la configuración, los accesos y la capacitación al personal responsable, para que la planta administre su propio sistema.',
        },
      ],
    },
    en: {
      title: 'Electronic Surveillance',
      desc: 'Supply, installation and commissioning of surveillance and electronic security systems —CCTV, access control and monitoring— integrated into the plant or facility infrastructure.',
      tags: ['CCTV', 'Access control', 'Monitoring'],
      metaTitle: 'Electronic Surveillance, CCTV & Access Control',
      metaDescription:
        'Supply, installation and commissioning of CCTV, access control and monitoring systems, integrated into the existing plant or facility network infrastructure.',
      h1: 'Electronic surveillance',
      lead: 'We supply, install and commission surveillance and electronic security systems. Coming from the industrial world, we integrate them into the network infrastructure the plant already runs, instead of building a parallel network nobody ends up maintaining.',
      alcance: [
        {
          title: 'CCTV',
          desc: 'Camera selection and installation based on what actually needs to be seen —distance, lighting and environmental conditions— with its recording and retention.',
        },
        {
          title: 'Access control',
          desc: 'Access control systems for restricted areas, with the corresponding traceability of entries and exits.',
        },
        {
          title: 'Monitoring',
          desc: 'Surveillance centralised at a monitoring point, with the alarms and notifications the operation requires.',
        },
        {
          title: 'Integration with the existing network',
          desc: 'Deployment over the plant network infrastructure, with proper segmentation so video traffic does not interfere with control traffic.',
        },
      ],
      entregables: [
        'Layout of cameras and equipment with their coverage zones',
        'Recording, retention and access configuration handed over to the client',
        'Documentation of the network segmentation used',
        'Training for the personnel responsible for monitoring',
        'System maintenance recommendations',
      ],
      faq: [
        {
          q: 'Can I use the network the plant already has?',
          a: 'Generally yes, and it is usually the right call. What matters is segmentation: video consumes bandwidth and should not share a domain with control traffic. We resolve that separation at design time, not afterwards.',
        },
        {
          q: 'How many cameras do I need?',
          a: 'It depends on what needs to be seen, not on the size of the site. We start from the zones and events you want covered, and the count, camera type and placement follow from that. More badly placed cameras do not add up to more security.',
        },
        {
          q: 'Does the client administer the system?',
          a: 'Yes. We hand over the configuration, the credentials and training for the responsible personnel, so the plant administers its own system.',
        },
      ],
    },
  },
];

/** Devuelve un servicio por su slug, o `undefined` si no existe. */
export function getServicio(slug: string): Servicio | undefined {
  return servicios.find((s) => s.slug === slug);
}
