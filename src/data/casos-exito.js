// Imports de imágenes para optimización de Astro
import portadaPrincipal from '../assets/projects/casos-exito-assets/HOR/portada-principal.jpg';
import automatizacionPanel1 from '../assets/projects/casos-exito-assets/VER/automatizacion-panel-vertical-1.jpg';
import automatizacionEstandares from '../assets/projects/casos-exito-assets/VER/automatizacion-estandares.jpg';
import automatizacionPanel2 from '../assets/projects/casos-exito-assets/VER/automatizacion-panel-vertical-2.jpg';
import actualizacionTablero1 from '../assets/projects/casos-exito-assets/HOR/actualizacion-tablero-1.jpg';
import actualizacionAsesoria from '../assets/projects/casos-exito-assets/HOR/actualizacion-asesoria.jpg';
import gestionEnergeticaMicrobox from '../assets/projects/casos-exito-assets/VER/gestion-energetica-microbox-vertical.jpg';
import tableroMedicionMiobox1 from '../assets/projects/casos-exito-assets/VER/tablero-medicion-miobox-1.jpg';
import tableroMedicionMiobox2 from '../assets/projects/casos-exito-assets/VER/tablero-medicion-miobox-2.jpg';
import gestionEnergeticaMicrobox2 from '../assets/projects/casos-exito-assets/HOR/gestion-energetica-microbox-2.jpg';
import gestionEnergeticaMicrobox3 from '../assets/projects/casos-exito-assets/HOR/gestion-energetica-microbox-3.jpg';
import bancoCondensadores from '../assets/projects/casos-exito-assets/VER/banco-condensadores-subestacion.jpg';
import tableroMedicionMiobox3 from '../assets/projects/casos-exito-assets/VER/tablero-medicion-miobox-3.jpg';
import tecnologiaAllenBradley1 from '../assets/projects/casos-exito-assets/VER/tecnologia-allen-bradley-1.jpg';
import tableroDistribucionBanco from '../assets/projects/casos-exito-assets/HOR/tablero-distribucion-banco.jpg';
import retieCumplimientoVertical from '../assets/projects/casos-exito-assets/VER/retie-cumplimiento-vertical.jpg';
import retiePlanoUnifilar from '../assets/projects/casos-exito-assets/VER/retie-plano-unifilar.jpg';
import tablerosCertificados from '../assets/projects/casos-exito-assets/VER/tableros-certificados-a-medida.jpg';
import retieCumplimientoHorizontal from '../assets/projects/casos-exito-assets/HOR/retie-cumplimiento-horizontal.jpg';
import implementacionDiseno from '../assets/projects/casos-exito-assets/HOR/implementacion-diseno-marcha-2.jpg';
import protocolosPruebasTableros from '../assets/projects/casos-exito-assets/HOR/protocolos-pruebas-tableros.jpg';
import protocolosPruebas1 from '../assets/projects/casos-exito-assets/HOR/protocolos-pruebas-1.jpg';

export const slides = [
  {
    title: 'Nuestros Proyectos con Impacto Real',
    subtitle: 'Casos de Éxito',
    description: 'Resultados concretos en industrias críticas gracias a ingeniería aplicada, estándares rigurosos y una ejecución orientada al negocio.',
    images: [{ type: 'featured', src: portadaPrincipal }]
  },
  {
    title: 'Automatización',
    description: 'Implementamos soluciones de automatización escalables y seguras, alineadas con estándares internacionales.',
    images: [
      { type: 'vertical', src: automatizacionPanel1 },
      { type: 'vertical', src: automatizacionEstandares },
      { type: 'vertical', src: automatizacionPanel2 },
    ]
  },
  {
    title: 'Actualización y Ejecución',
    description: 'Modernizamos tableros y controladores, extendiendo la vida útil y elevando el rendimiento.',
    images: [
      { type: 'horizontal', src: actualizacionTablero1 },
      { type: 'horizontal', src: actualizacionAsesoria },
    ]
  },
  {
    title: 'Gestión Energética',
    description: 'Integramos medición avanzada para disponer de datos confiables, decisiones oportunas y eficiencia sostenida.',
    images: [
      { type: 'vertical', src: gestionEnergeticaMicrobox },
      { type: 'vertical', src: tableroMedicionMiobox1 },
      { type: 'vertical', src: tableroMedicionMiobox2 },
    ]
  },
  {
    title: 'Monitoreo Energético',
    description: 'Visualización y control de consumos en tiempo real para anticipar picos, balancear cargas y proteger activos.',
    images: [
      { type: 'horizontal', src: gestionEnergeticaMicrobox2 },
      { type: 'horizontal', src: gestionEnergeticaMicrobox3 },
    ]
  },
  {
    title: 'Bancos de Condensadores',
    description: 'Diseñamos e implementamos bancos de condensadores para mejorar el factor de potencia y estabilizar la red.',
    images: [
      { type: 'vertical', src: bancoCondensadores },
      { type: 'vertical', src: tableroMedicionMiobox3 },
      { type: 'vertical', src: tecnologiaAllenBradley1 },
    ]
  },
  {
    title: 'Distribución y Medición',
    description: 'Tableros de distribución con sistemas de medición integrados para auditoría de consumo y trazabilidad.',
    images: [
      { type: 'horizontal', src: tableroDistribucionBanco },
    ]
  },
  {
    title: 'Cumplimiento RETIE',
    description: 'Aseguramos cumplimiento normativo desde el diseño hasta la fabricación, con documentación completa.',
    images: [
      { type: 'vertical', src: retieCumplimientoVertical },
      { type: 'vertical', src: retiePlanoUnifilar },
      { type: 'vertical', src: tablerosCertificados },
    ]
  },
  {
    title: 'Pruebas y Certificación',
    description: 'Aplicamos protocolos FAT y QA/QC para asegurar funcionalidad y seguridad antes de la puesta en marcha.',
    images: [
      { type: 'horizontal', src: retieCumplimientoHorizontal },
      { type: 'horizontal', src: implementacionDiseno },
      { type: 'horizontal', src: protocolosPruebasTableros },
      { type: 'horizontal', src: protocolosPruebas1 },
    ]
  },
  {
    title: '¿Listo para tu Proyecto de Éxito?',
    description: 'Especialistas en automatización y soluciones tecnológicas, transformamos oportunidades en resultados estratégicos.',
    isContact: true,
    images: [],
    footerText: 'Soluciones de Ingeniería Integrales 360°<br>Especialistas en automatización y soluciones tecnológicas, transformamos oportunidades en resultados estratégicos mediante una gestión integral de proyectos.'
  },
];