/**
 * ═══════════════════════════════════════════════════════════════
 * GUÍA DE USO - SISTEMA DE RUTAS CENTRALIZADO
 * ═══════════════════════════════════════════════════════════════
 * 
 * Este documento explica cómo usar el nuevo sistema de rutas
 * centralizado para la aplicación Vikingos Cotizador.
 * 
 */

// ──────────────────────────────────────────────────────────────
// 1. RUTAS DISPONIBLES
// ──────────────────────────────────────────────────────────────

Las rutas están definidas en public/config/routes.js

Rutas disponibles:
  • ROUTES.DASHBOARD        → Panel Principal
  • ROUTES.COTIZACIONES     → Lista de Cotizaciones
  • ROUTES.COTIZAR          → Crear Nueva Cotización
  • ROUTES.COTIZACION_EN_PROCESO → Ver Cotizaciones en Proceso
  • ROUTES.PROYECTOS        → Galería de Muebles
  • ROUTES.CATALOGO         → Catálogo de Materiales
  • ROUTES.AJUSTES          → Configuración


// ──────────────────────────────────────────────────────────────
// 2. CÓMO USAR LAS RUTAS EN HTML
// ──────────────────────────────────────────────────────────────

En los atributos href de enlaces:

  AUTOMÁTICO (recomendado):
  <a href="getRoute('DASHBOARD')">Ir al Dashboard</a>
  → Detecta automáticamente si está en carpeta anidada
  
  MANUAL (si necesitas ser explícito):
  <a href="getRouteUrl('DASHBOARD', false)">Desde raíz</a>
  <a href="getRouteUrl('DASHBOARD', true)">Desde views/</a>


// ──────────────────────────────────────────────────────────────
// 3. CÓMO USAR LAS RUTAS EN JAVASCRIPT
// ──────────────────────────────────────────────────────────────

  // Obtener URL automáticamente
  const url = getRoute('COTIZAR');
  window.location.href = url;
  
  // Obtener la lista de items de navegación
  const navItems = getNavItems();
  navItems.forEach(item => {
    console.log(item.label, item.href);
  });
  
  // Detectar si la página es anidada
  if (isPageNested()) {
    console.log('Esta página está en una carpeta anidada');
  }


// ──────────────────────────────────────────────────────────────
// 4. ESTRUCTURA DE CARPETAS
// ──────────────────────────────────────────────────────────────

public/
├── config/
│   └── routes.js           ← Definiciones de rutas
├── components/
│   └── navbar.js           ← Usa getNavItems()
├── views/
│   ├── cotizar.html        ← Incluye routes.js
│   ├── proyectos.html      ← Incluye routes.js
│   ├── materiales.html     ← Incluye routes.js
│   └── ...otros.html
└── index.html              ← Incluye routes.js


// ──────────────────────────────────────────────────────────────
// 5. CÓMO AGREGAR NUEVAS RUTAS
// ──────────────────────────────────────────────────────────────

1. Abre public/config/routes.js
2. Agrega una nueva entrada al objeto ROUTES:

   MI_NUEVA_RUTA: {
     id: 'mi_nueva_ruta',
     label: 'Mi Nueva Ruta',
     icon: '🎯',
     root: 'views/mi_archivo.html',
     nested: 'mi_archivo.html'
   }

3. Usa la ruta en HTML:
   <a href="getRoute('MI_NUEVA_RUTA')">Ir a Mi Ruta</a>


// ──────────────────────────────────────────────────────────────
// 6. CAMBIAR UNA RUTA EXISTENTE
// ──────────────────────────────────────────────────────────────

Si necesitas cambiar dónde apunta una ruta (ej: mover un archivo):

1. Abre public/config/routes.js
2. Modifica los valores root y nested:

   PROYECTOS: {
     id: 'proyectos',
     label: 'Galería Muebles',
     icon: '🪑',
     root: 'pages/proyectos.html',      // ← Cambiar aquí
     nested: 'proyectos.html'            // ← Cambiar aquí
   }

3. Todas las referencias se actualizan automáticamente ✨


// ──────────────────────────────────────────────────────────────
// 7. BENEFICIOS
// ──────────────────────────────────────────────────────────────

✅ Una única fuente de verdad para todas las rutas
✅ Cambiar URLs de forma segura y sin errores
✅ Agregar nuevas rutas en un solo lugar
✅ Mantenimiento centralizado
✅ Detección automática de ubicación (raíz vs anidada)
✅ Fácil de usar en HTML y JavaScript


// ──────────────────────────────────────────────────────────────
// 8. MIGRACIÓN DE CÓDIGO ANTIGUO
// ──────────────────────────────────────────────────────────────

ANTES (hardcodeado):
  <a href="views/cotizar.html">Nueva Cotización</a>
  <a href="../../views/cotizar.html">Nueva Cotización</a>

DESPUÉS (sistema centralizado):
  <a href="getRoute('COTIZAR')">Nueva Cotización</a>
  ✨ Funciona desde cualquier ubicación


// ──────────────────────────────────────────────────────────────
// 9. FUNCIONES DISPONIBLES
// ──────────────────────────────────────────────────────────────

getRoute(routeId)
  → Obtiene la URL automáticamente según ubicación
  
getRouteUrl(routeId, isNested)
  → Obtiene la URL especificando ubicación

getNavItems(isNested)
  → Obtiene array de items de navegación

isPageNested()
  → Detecta si la página está en carpeta anidada

