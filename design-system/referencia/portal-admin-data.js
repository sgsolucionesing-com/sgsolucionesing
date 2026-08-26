/* ==========================================================
   S&G · Portal — DATOS DE ADMINISTRACIÓN (demo)
   Empresas, usuarios y asignación usuario ↔ proyecto.
   ========================================================== */
window.EMPRESAS = [
  { id:'EMP-001', nombre:'Grupo Alimentar S.A.S.', nit:'900.412.883-1', sector:'Alimentos',
    ciudad:'Barranquilla', contacto:'M. Rivera', correo:'compras@alimentar.co', tel:'+57 300 111 2233',
    estado:'Activa', proyectos:['SG-2026-014','SG-2026-021','SG-2025-008'] },
  { id:'EMP-002', nombre:'Cementos del Caribe S.A.', nit:'800.199.457-4', sector:'Cementero',
    ciudad:'Barranquilla', contacto:'L. Pardo', correo:'mantenimiento@cemcaribe.co', tel:'+57 301 555 8890',
    estado:'Activa', proyectos:[] },
  { id:'EMP-003', nombre:'Portuaria Magdalena Ltda.', nit:'901.774.220-6', sector:'Portuario',
    ciudad:'Santa Marta', contacto:'R. Ávila', correo:'proyectos@portmag.co', tel:'+57 315 402 7711',
    estado:'Pendiente', proyectos:[] }
];

window.USUARIOS = [
  { id:'U-001', nombre:'Mariana Rivera', correo:'cliente@empresa.com', cargo:'Jefe de Mantenimiento', empresa:'EMP-001',
    rol:'Cliente · Lectura', estado:'Activo', ultimo:'27 Jul 2026 · 16:08', dosPasos:true,
    proyectos:['SG-2026-014','SG-2026-021','SG-2025-008'] },
  { id:'U-002', nombre:'Julián Castro', correo:'jcastro@alimentar.co', cargo:'Gerente de Planta', empresa:'EMP-001',
    rol:'Cliente · Aprobador', estado:'Activo', ultimo:'26 Jul 2026 · 08:22', dosPasos:true,
    proyectos:['SG-2026-014'] },
  { id:'U-003', nombre:'Diana Salas', correo:'dsalas@alimentar.co', cargo:'Coordinadora de Energía', empresa:'EMP-001',
    rol:'Cliente · Lectura', estado:'Invitado', ultimo:'—', dosPasos:false,
    proyectos:[] },
  { id:'U-004', nombre:'Luis Pardo', correo:'lpardo@cemcaribe.co', cargo:'Jefe de Mantenimiento', empresa:'EMP-002',
    rol:'Cliente · Lectura', estado:'Activo', ultimo:'21 Jul 2026 · 11:40', dosPasos:true,
    proyectos:[] },
  { id:'U-005', nombre:'Rosa Ávila', correo:'ravila@portmag.co', cargo:'Directora de Proyectos', empresa:'EMP-003',
    rol:'Cliente · Administrador', estado:'Invitado', ultimo:'—', dosPasos:false,
    proyectos:[] },
  { id:'U-006', nombre:'Andrés Beltrán', correo:'abeltran@alimentar.co', cargo:'Supervisor Eléctrico', empresa:'EMP-001',
    rol:'Cliente · Lectura', estado:'Activo', ultimo:'24 Jul 2026 · 07:55', dosPasos:true,
    proyectos:['SG-2026-021'] },
  { id:'U-007', nombre:'Carolina Mejía', correo:'cmejia@cemcaribe.co', cargo:'Compras', empresa:'EMP-002',
    rol:'Cliente · Lectura', estado:'Activo', ultimo:'18 Jul 2026 · 14:12', dosPasos:false,
    proyectos:[] }
];

window.ROLES = ['Cliente · Lectura','Cliente · Aprobador','Cliente · Administrador'];
window.ROLES_PROYECTO = ['Contacto principal','Contacto técnico','Aprobador de entregables','Solo lectura'];
