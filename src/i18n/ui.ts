// src/i18n/ui.ts
// Diccionario de traducciones ES/EN y helpers de idioma para el sitio bilingüe.
// Español es el idioma por defecto (sin prefijo); inglés vive en /en/.

export const languages = { es: 'Español', en: 'English' } as const;
export const defaultLang = 'es';
export type Lang = keyof typeof languages;

// Resuelve el idioma a partir de Astro.currentLocale (fallback a español).
export function getLang(currentLocale: string | undefined): Lang {
  return currentLocale === 'en' ? 'en' : 'es';
}

// Prefija un path con /en cuando el idioma es inglés. Sirve para anchors (/#x)
// y rutas (/proyectos). En español devuelve el path tal cual.
export function localePath(path: string, lang: Lang): string {
  if (lang !== 'en') return path;
  if (path === '/') return '/en/';
  return '/en' + path;
}

// Traduce el valor de `sector` (enum en español) al idioma de display.
export function sectorLabel(sector: string, lang: Lang): string {
  const map = ui[lang].sectorMap as Record<string, string>;
  return map[sector] ?? sector;
}

export const ui = {
  es: {
    nav: {
      services: 'Servicios',
      cases: 'Casos',
      about: 'Nosotros',
      contact: 'Contacto',
      cta: 'Cotiza tu proyecto',
      tagline: 'Soluciones de Ingeniería',
      openMenu: 'Abrir menú',
      switchLang: 'English',
      switchLangAria: 'Ver el sitio en inglés',
    },
    footer: {
      copyright: '© 2026 · Barranquilla, Colombia · Automatización · Energía · Software',
    },
    meta: {
      homeTitle: 'S&G Soluciones de Ingeniería | Automatización industrial, IoT y software',
      homeDescription:
        'Automatización industrial, Industria 4.0/IoT, eficiencia energética, suministro de componentes y desarrollo de software para la industria. Con base en la costa Caribe (Barranquilla), atendemos Colombia y Latinoamérica.',
      jsonldDescription:
        'Empresa de ingeniería especializada en automatización industrial, Industria 4.0/IoT, gestión y calidad de energía, suministro de componentes (distribuidor multimarca), vigilancia electrónica y desarrollo de software a la medida. Con base en Barranquilla, costa Caribe, atendemos a la industria de Colombia y Latinoamérica.',
      defaultDescription:
        'Ingeniería en automatización industrial, Industria 4.0 / IoT, gestión de energía y desarrollo de software a la medida.',
      imageAlt: 'S&G Soluciones de Ingeniería — automatización industrial, energía y software.',
    },
    hero: {
      kick: 'Automatización · Instrumentación · Eficiencia Energética',
      h1Html: 'Ingeniería que <em>ve</em> tu planta en tiempo real.',
      sub: 'Diseñamos, integramos y ponemos en marcha sistemas de automatización, instrumentación y eficiencia energética, conectados a MIOBOX, nuestra plataforma propia de microservicios IIoT, para que tu operación deje de reaccionar y empiece a anticiparse.',
      ctaQuote: 'Cotiza tu proyecto',
      ctaCases: 'Ver casos de éxito',
      stats: [
        { n: '17', l: 'Casos de éxito entregados' },
        { n: '+14', l: 'Clientes industriales' },
        { n: '8', l: 'Líneas de servicio' },
        { n: 'RA Bronze', l: 'Partner Rockwell' },
      ],
    },
    clientes: {
      kick: 'Confían en nosotros',
    },
    casos: {
      kick: 'Casos de éxito',
      h2: 'Proyectos entregados en planta.',
      lead: 'Cada intervención parte de un diagnóstico y termina en cifras: más disponibilidad, energía bajo control y procesos visibles.',
      viewCase: 'Ver caso',
      viewAll: 'Ver todos los casos',
    },
    proyectos: {
      metaTitle: 'Casos de Éxito | S&G Soluciones de Ingeniería',
      metaDesc: 'Casos reales de automatización industrial, IoT e Industria 4.0: monitoreo predictivo, bancos de condensadores, tableros inteligentes y más resultados medibles.',
      kick: 'Casos de éxito',
      h1Html: 'Proyectos que se miden <em>en indicadores.</em>',
      lead: 'Cada intervención parte de un diagnóstico y termina en cifras: menos paradas, energía bajo control y procesos visibles en tiempo real. Estos son algunos de los proyectos que hemos entregado para la industria en Colombia y la región.',
      statCases: 'Casos entregados',
      statClients: 'Clientes industriales',
      statLines: 'Líneas de servicio',
      statPartner: 'Partner Rockwell',
      viewFull: 'Ver caso completo',
      crumb: 'Casos de éxito',
      home: 'Inicio',
      factSector: 'Sector',
      factLocation: 'Ubicación',
      factYear: 'Año',
      factClient: 'Cliente',
      galleryKick: 'Galería',
      galleryH2: 'En planta',
      imageWord: 'Imagen',
      galleryOf: 'de la galería',
      modalClose: 'Cerrar',
      modalPrev: 'Anterior',
      modalNext: 'Siguiente',
      techKick: 'Tecnologías',
      nextKick: 'Tu proyecto sigue',
      nextH2Html: '¿Tienes un proceso que <em>medir o automatizar?</em>',
      nextSub: 'Evaluamos tu planta y proponemos una ruta clara. Respuesta en menos de 24 horas hábiles.',
      ctaQuote: 'Cotiza tu proyecto',
      viewAll: 'Ver todos los casos',
      backHome: 'Volver al inicio',
    },
    sectorMap: {
      'Minería': 'Minería',
      'Cementero': 'Cementero',
      'Industrial': 'Industrial',
      'Energía': 'Energía',
      'Alimentos': 'Alimentos',
      'Oil & Gas': 'Oil & Gas',
      'Petroquímica': 'Petroquímica',
      'Farmacéutico': 'Farmacéutico',
      'Otros': 'Otros',
    },
    servicios: {
      kick: 'Qué hacemos',
      h2Html: 'Del sensor <em>al indicador de gestión.</em>',
      lead: 'Automatización, instrumentación, eficiencia energética, suministro de componentes y vigilancia electrónica: cubrimos toda la cadena, desde el componente y el tablero eléctrico hasta el indicador de gestión que ve la gerencia.',
      items: [
        {
          title: 'Automatización y Control Industrial',
          desc: 'Arquitectura de control, programación de PLC, HMI/SCADA, control batch, MES/MOM y networking industrial. Migración de controladores, puesta en marcha (FAT/SAT) y tableros CCM y consolas de operación.',
          tags: ['Allen Bradley', 'Siemens', 'SCADA', 'MIOBOX'],
        },
        {
          title: 'Instrumentación Industrial',
          desc: 'Selección e implementación de instrumentos, diseño de lazos de control y ajuste de transmisores de temperatura, presión, caudal y humedad, con aseguramiento metrológico.',
          tags: ['Lazos de control', 'Transmisores', 'Metrología'],
        },
        {
          title: 'Eficiencia Energética',
          desc: 'Análisis de calidad de energía, monitoreo y telemedida, y proyectos de ahorro energético con incorporación de energías renovables.',
          tags: ['Calidad de energía', 'Telemedida', 'Renovables'],
        },
        {
          title: 'Montaje Eléctrico',
          desc: 'Diseño de instalaciones eléctricas, estudios de factibilidad y montaje industrial y comercial, con mantenimiento y cumplimiento normativo RETIE.',
          tags: ['RETIE', 'Montaje industrial', 'Mantenimiento'],
        },
        {
          title: 'Mantenimiento Mecánico',
          desc: 'Mantenimiento preventivo y correctivo, montaje y diagnóstico de equipos, soldadura y fabricación de piezas para mantener la planta en operación.',
          tags: ['Preventivo', 'Correctivo', 'Soldadura'],
        },
        {
          title: 'Diseño de Tableros Eléctricos',
          desc: 'Tableros de distribución y transferencia automática, bancos de condensadores (1 a 1520 kvar), integración de PLC/IO y arranque de variadores de ½ a 900 HP.',
          tags: ['Bancos de condensadores', 'Variadores ½–900 HP', 'PLC/IO'],
        },
        {
          title: 'Suministro y Asesoría de Componentes',
          desc: 'Como distribuidores multimarca, suministramos partes y componentes eléctricos, electrónicos, de automatización y especializados. Sumamos valor asesorando su selección técnica —sensores, medidores, instrumentos y más— para que cada componente calce con la solución.',
          tags: ['Distribuidor multimarca', 'Sensores y medidores', 'Asesoría técnica'],
        },
        {
          title: 'Vigilancia Electrónica',
          desc: 'Suministro, instalación y montaje de sistemas de vigilancia y seguridad electrónica —CCTV, control de acceso y monitoreo— integrados a la infraestructura de la planta o la instalación.',
          tags: ['CCTV', 'Control de acceso', 'Monitoreo'],
        },
      ],
    },
    nosotros: {
      kick: 'Quiénes somos',
      h2Html: 'Ingeniería ágil, <em>altamente calificada.</em>',
      body: 'Con base en Barranquilla, sobre la costa Caribe, prestamos servicios de ingeniería en automatización, instrumentación y eficiencia energética a empresas del sector industrial y comercial en toda Colombia y en Latinoamérica. Además, como distribuidores multimarca, suministramos partes y componentes eléctricos, electrónicos y de automatización, y asesoramos su selección técnica. Focalizamos el esfuerzo en la optimización de procesos, trabajando cerca de la planta y desarrollando conocimiento en nuevas tecnologías según la necesidad de cada cliente. MIOBOX, nuestra plataforma propia de microservicios IIoT, conecta los dispositivos de planta con los sistemas de información del negocio para llevar la operación a indicadores de clase mundial.',
      imgAlt: 'Equipo de S&G Soluciones de Ingeniería',
      kpis: [
        { n: '8', l: 'Líneas de servicio' },
        { n: 'RA Bronze', l: 'Partner Rockwell Automation' },
        { n: 'MIOBOX', l: 'Plataforma IIoT propia' },
      ],
    },
    certificaciones: {
      kick: 'Certificaciones',
      title: 'Respaldo que da confianza.',
      lead: 'Nuestra capacidad técnica y nuestros procesos están respaldados por certificaciones de terceros.',
      items: [
        { title: 'Tableristas certificados', issuer: 'Servimeters', desc: 'Diseño y fabricación de tableros eléctricos bajo certificación.' },
        { title: 'ISO 9001', issuer: 'Bureau Veritas', desc: 'Sistema de gestión de calidad de nuestros procesos, certificado en 2026.' },
      ],
    },
    testimonios: {
      ariaLabel: 'Testimonios',
      dotLabel: 'Testimonio',
      items: [
        {
          name: 'Jefe de Mantenimiento',
          org: 'Planta de alimentos · Barranquilla',
          quote: 'Pasamos de perseguir fallas a operar con datos. Hoy vemos cada consumo y anticipamos las paradas antes de que ocurran.',
        },
        {
          name: 'Coordinador de Energía',
          org: 'Cementera · Barranquilla',
          quote: 'El factor de potencia se estabilizó y las penalizaciones desaparecieron. La inversión se pagó sola en meses.',
        },
        {
          name: 'Gerente de Planta',
          org: 'Industria · Costa Caribe',
          quote: 'Por fin tenemos trazabilidad del consumo por área. Las decisiones ahora se toman con datos, no con supuestos.',
        },
      ],
    },
    contacto: {
      kick: 'Contacto',
      h2: 'Cuéntanos tu proceso.',
      sub: 'Evaluamos tu planta y proponemos una ruta clara: qué medir, qué automatizar y qué integrar. Respuesta en menos de 24 horas hábiles.',
      locLabel: 'Ubicación',
      locValue: 'Carrera 44 #69-80, Barranquilla, Atlántico, Colombia',
      phoneLabel: 'Teléfono / WhatsApp',
      emailLabel: 'Correo',
      formName: 'Nombre y empresa',
      formEmail: 'Correo',
      formMsg: '¿Qué necesitas resolver?',
      formHoneypot: 'No completar',
      formSubmit: 'Enviar solicitud',
      formSending: 'Enviando…',
      formOk: 'Gracias, te respondemos en menos de 24 h hábiles.',
      formErr: 'No pudimos enviar tu mensaje, escríbenos por WhatsApp mientras tanto: https://wa.me/573243025107',
    },
    chat: {
      headName: 'Sofía · S&G',
      headStatus: 'Agente comercial · En línea',
      dialogAria: 'Chat con S&G Soluciones de Ingeniería',
      greeting: '¡Hola! Soy Sofía, del equipo de S&G. Contame qué proceso querés automatizar, medir o mejorar y te oriento con gusto. 😊',
      placeholder: 'Escribí tu consulta…',
      inputLabel: 'Escribí tu mensaje',
      waButton: 'Hablar por WhatsApp',
      privacy: 'Al chatear aceptás el tratamiento de tus datos según la Ley 1581. No compartimos tu información.',
      typing: 'Escribiendo…',
      typingAria: 'Sofía está escribiendo',
      openAria: 'Abrir chat con S&G',
      closeAria: 'Cerrar chat',
      sendAria: 'Enviar mensaje',
      inactivity: 'Veo que quedamos en pausa. ¿Seguimos por acá o preferís que Sandra, nuestro contacto comercial, retome por WhatsApp con el resumen de la charla? Escribime cuando gustes, o contactala directo al +57 324 3025107. 😊',
      waDefaultText: 'Hola S&G, vengo del chat del sitio web.',
      waIntro: 'Hola, vengo del chat de la web de S&G. Este es el resumen de mi consulta para que puedan retomarla:',
      waData: 'Mis datos',
      waName: 'Nombre',
      waEmail: 'Correo',
      waPhone: 'Tel',
      fallbackEmpty: 'No pude generar una respuesta. Escribinos por WhatsApp y te ayudamos enseguida: ',
      fallbackError: 'Ahora mismo no puedo responder por acá. Escribinos por WhatsApp: ',
      fallbackErrorTail: ' y te atendemos enseguida.',
    },
  },

  en: {
    nav: {
      services: 'Services',
      cases: 'Case Studies',
      about: 'About',
      contact: 'Contact',
      cta: 'Get a quote',
      tagline: 'Engineering Solutions',
      openMenu: 'Open menu',
      switchLang: 'Español',
      switchLangAria: 'View the site in Spanish',
    },
    footer: {
      copyright: '© 2026 · Barranquilla, Colombia · Automation · Energy · Software',
    },
    meta: {
      homeTitle: 'S&G Soluciones de Ingeniería | Industrial automation, IoT & software',
      homeDescription:
        "Industrial automation, Industry 4.0/IoT, energy efficiency, component supply and custom software for industry. Based on Colombia's Caribbean coast (Barranquilla), we serve Colombia and Latin America.",
      jsonldDescription:
        'Engineering company specialized in industrial automation, Industry 4.0/IoT, energy management and power quality, component supply (multi-brand distributor), electronic surveillance and custom software development. Based in Barranquilla, on the Caribbean coast, we serve industry across Colombia and Latin America.',
      defaultDescription:
        'Engineering in industrial automation, Industry 4.0 / IoT, energy management and custom software development.',
      imageAlt: 'S&G Soluciones de Ingeniería — industrial automation, energy and software.',
    },
    hero: {
      kick: 'Automation · Instrumentation · Energy Efficiency',
      h1Html: 'Engineering that <em>sees</em> your plant in real time.',
      sub: 'We design, integrate and commission automation, instrumentation and energy-efficiency systems, connected to MIOBOX, our own IIoT microservices platform, so your operation stops reacting and starts anticipating.',
      ctaQuote: 'Get a quote',
      ctaCases: 'See case studies',
      stats: [
        { n: '17', l: 'Case studies delivered' },
        { n: '+14', l: 'Industrial clients' },
        { n: '8', l: 'Service lines' },
        { n: 'RA Bronze', l: 'Rockwell partner' },
      ],
    },
    clientes: {
      kick: 'Trusted by industry',
    },
    casos: {
      kick: 'Case studies',
      h2: 'Projects delivered on the plant floor.',
      lead: 'Every intervention starts with a diagnosis and ends in numbers: more uptime, energy under control and visible processes.',
      viewCase: 'View case',
      viewAll: 'View all case studies',
    },
    proyectos: {
      metaTitle: 'Case Studies | S&G Soluciones de Ingeniería',
      metaDesc: 'Real cases of industrial automation, IoT and Industry 4.0: predictive monitoring, capacitor banks, smart panels and more measurable results.',
      kick: 'Case studies',
      h1Html: 'Projects measured <em>in indicators.</em>',
      lead: 'Every intervention starts with a diagnosis and ends in numbers: less downtime, energy under control and processes visible in real time. These are some of the projects we have delivered for industry in Colombia and the region.',
      statCases: 'Cases delivered',
      statClients: 'Industrial clients',
      statLines: 'Service lines',
      statPartner: 'Rockwell partner',
      viewFull: 'View full case',
      crumb: 'Case studies',
      home: 'Home',
      factSector: 'Sector',
      factLocation: 'Location',
      factYear: 'Year',
      factClient: 'Client',
      galleryKick: 'Gallery',
      galleryH2: 'On site',
      imageWord: 'Image',
      galleryOf: 'from the gallery',
      modalClose: 'Close',
      modalPrev: 'Previous',
      modalNext: 'Next',
      techKick: 'Technologies',
      nextKick: 'Your project is next',
      nextH2Html: 'Have a process to <em>measure or automate?</em>',
      nextSub: 'We assess your plant and propose a clear roadmap. Reply within 24 business hours.',
      ctaQuote: 'Get a quote',
      viewAll: 'View all cases',
      backHome: 'Back to home',
    },
    sectorMap: {
      'Minería': 'Mining',
      'Cementero': 'Cement',
      'Industrial': 'Industrial',
      'Energía': 'Energy',
      'Alimentos': 'Food',
      'Oil & Gas': 'Oil & Gas',
      'Petroquímica': 'Petrochemical',
      'Farmacéutico': 'Pharmaceutical',
      'Otros': 'Other',
    },
    servicios: {
      kick: 'What we do',
      h2Html: 'From the sensor <em>to the management KPI.</em>',
      lead: 'Automation, instrumentation, energy efficiency, component supply and electronic surveillance: we cover the whole chain, from the component and the electrical panel to the management KPI leadership sees.',
      items: [
        {
          title: 'Industrial Automation & Control',
          desc: 'Control architecture, PLC programming, HMI/SCADA, batch control, MES/MOM and industrial networking. Controller migration, commissioning (FAT/SAT), MCC panels and operator consoles.',
          tags: ['Allen Bradley', 'Siemens', 'SCADA', 'MIOBOX'],
        },
        {
          title: 'Industrial Instrumentation',
          desc: 'Instrument selection and implementation, control-loop design and calibration of temperature, pressure, flow and humidity transmitters, with metrological assurance.',
          tags: ['Control loops', 'Transmitters', 'Metrology'],
        },
        {
          title: 'Energy Efficiency',
          desc: 'Power-quality analysis, monitoring and telemetering, and energy-saving projects incorporating renewable energy.',
          tags: ['Power quality', 'Telemetering', 'Renewables'],
        },
        {
          title: 'Electrical Installation',
          desc: 'Electrical installation design, feasibility studies and industrial and commercial assembly, with maintenance and RETIE code compliance.',
          tags: ['RETIE', 'Industrial assembly', 'Maintenance'],
        },
        {
          title: 'Mechanical Maintenance',
          desc: 'Preventive and corrective maintenance, equipment assembly and diagnosis, welding and part fabrication to keep the plant running.',
          tags: ['Preventive', 'Corrective', 'Welding'],
        },
        {
          title: 'Electrical Panel Design',
          desc: 'Distribution and automatic transfer panels, capacitor banks (1 to 1520 kvar), PLC/IO integration and variable-speed drives from ½ to 900 HP.',
          tags: ['Capacitor banks', 'Drives ½–900 HP', 'PLC/IO'],
        },
        {
          title: 'Component Supply & Advisory',
          desc: 'As a multi-brand distributor, we supply electrical, electronic, automation and specialized parts and components. We add value by advising on their technical selection —sensors, meters, instruments and more— so every component fits the solution.',
          tags: ['Multi-brand distributor', 'Sensors & meters', 'Technical advisory'],
        },
        {
          title: 'Electronic Surveillance',
          desc: 'Supply, installation and assembly of electronic surveillance and security systems —CCTV, access control and monitoring— integrated with the plant or facility infrastructure.',
          tags: ['CCTV', 'Access control', 'Monitoring'],
        },
      ],
    },
    nosotros: {
      kick: 'About us',
      h2Html: 'Agile engineering, <em>highly qualified.</em>',
      body: "Based in Barranquilla, on the Caribbean coast, we provide engineering services in automation, instrumentation and energy efficiency to industrial and commercial companies across Colombia and Latin America. As a multi-brand distributor, we also supply electrical, electronic and automation parts and components, and advise on their technical selection. We focus on optimizing processes, working close to the plant and building knowledge in new technologies according to each client's needs. MIOBOX, our own IIoT microservices platform, connects plant devices with business information systems to take operations to world-class indicators.",
      imgAlt: 'S&G Soluciones de Ingeniería team',
      kpis: [
        { n: '8', l: 'Service lines' },
        { n: 'RA Bronze', l: 'Rockwell Automation partner' },
        { n: 'MIOBOX', l: 'Our own IIoT platform' },
      ],
    },
    certificaciones: {
      kick: 'Certifications',
      title: 'Backing you can trust.',
      lead: 'Our technical capability and processes are backed by third-party certifications.',
      items: [
        { title: 'Certified panel builders', issuer: 'Servimeters', desc: 'Design and manufacturing of electrical panels under certification.' },
        { title: 'ISO 9001', issuer: 'Bureau Veritas', desc: 'Quality management system certified in 2026 across our processes.' },
      ],
    },
    testimonios: {
      ariaLabel: 'Testimonials',
      dotLabel: 'Testimonial',
      items: [
        {
          name: 'Maintenance Manager',
          org: 'Food plant · Barranquilla',
          quote: 'We went from chasing failures to operating with data. Today we see every consumption point and anticipate downtime before it happens.',
        },
        {
          name: 'Energy Coordinator',
          org: 'Cement plant · Barranquilla',
          quote: 'Our power factor stabilized and the penalties disappeared. The investment paid for itself in months.',
        },
        {
          name: 'Plant Manager',
          org: 'Industry · Caribbean coast',
          quote: 'We finally have consumption traceability by area. Decisions are now made with data, not assumptions.',
        },
      ],
    },
    contacto: {
      kick: 'Contact',
      h2: 'Tell us about your process.',
      sub: 'We assess your plant and propose a clear roadmap: what to measure, what to automate and what to integrate. Reply within 24 business hours.',
      locLabel: 'Location',
      locValue: 'Carrera 44 #69-80, Barranquilla, Atlántico, Colombia',
      phoneLabel: 'Phone / WhatsApp',
      emailLabel: 'Email',
      formName: 'Name and company',
      formEmail: 'Email',
      formMsg: 'What do you need to solve?',
      formHoneypot: 'Do not fill',
      formSubmit: 'Send request',
      formSending: 'Sending…',
      formOk: "Thanks, we'll reply within 24 business hours.",
      formErr: "We couldn't send your message. Write to us on WhatsApp meanwhile: https://wa.me/573243025107",
    },
    chat: {
      headName: 'Sofía · S&G',
      headStatus: 'Sales agent · Online',
      dialogAria: 'Chat with S&G Soluciones de Ingeniería',
      greeting: "Hi! I'm Sofía, from the S&G team. Tell me which process you'd like to automate, measure or improve and I'll gladly help. 😊",
      placeholder: 'Type your question…',
      inputLabel: 'Type your message',
      waButton: 'Chat on WhatsApp',
      privacy: 'By chatting you accept the processing of your data under Law 1581. We do not share your information.',
      typing: 'Typing…',
      typingAria: 'Sofía is typing',
      openAria: 'Open chat with S&G',
      closeAria: 'Close chat',
      sendAria: 'Send message',
      inactivity: 'Looks like we paused. Shall we continue here, or would you prefer Sandra, our commercial contact, to pick it up on WhatsApp with a summary of our chat? Message me whenever you like, or reach her directly at +57 324 3025107. 😊',
      waDefaultText: "Hi S&G, I'm coming from the website chat.",
      waIntro: "Hi, I'm coming from the S&G website chat. Here's a summary of my query so you can pick it up:",
      waData: 'My details',
      waName: 'Name',
      waEmail: 'Email',
      waPhone: 'Phone',
      fallbackEmpty: "I couldn't generate a reply. Message us on WhatsApp and we'll help right away: ",
      fallbackError: "I can't reply here right now. Message us on WhatsApp: ",
      fallbackErrorTail: ' and we\'ll help you right away.',
    },
  },
} as const;
