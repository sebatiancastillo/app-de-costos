/**
 * ═══════════════════════════════════════════════════════════════
 * RUTAS CENTRALIZADAS - Config de navegación de toda la aplicación
 * ═══════════════════════════════════════════════════════════════
 */

const ROUTES = {
  // ── Rutas principales (desde raíz)
  DASHBOARD: {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '⬛',
    root: 'index.html',
    nested: '../../index.html'
  },

  // ── Cotizaciones
  COTIZACIONES: {
    id: 'cotizaciones',
    label: 'Cotizaciones',
    icon: '📋',
    root: 'views/CotizacionList.html',
    nested: '../../views/CotizacionList.html'
  },

  COTIZAR: {
    id: 'cotizar',
    label: 'Nueva Cotización',
    icon: '✏️',
    root: 'views/cotizar.html',
    nested: 'cotizar.html'
  },

  COTIZACION_EN_PROCESO: {
    id: 'cotizacion_en_proceso',
    label: 'En Proceso',
    icon: '📝',
    root: 'views/cotizacion_en_proceso.html',
    nested: 'cotizacion_en_proceso.html'
  },

  // ── Proyectos y Galería
  PROYECTOS: {
    id: 'proyectos',
    label: 'Galería Muebles',
    icon: '🪑',
    root: 'views/proyectos.html',
    nested: 'proyectos.html'
  },

  // ── Catálogo
  CATALOGO: {
    id: 'catalogo',
    label: 'Catálogo Materiales',
    icon: '📦',
    root: 'views/materiales.html',
    nested: 'materiales.html'
  },

  // ── Configuración
  AJUSTES: {
    id: 'ajustes',
    label: 'Configuración',
    icon: '⚙️',
    root: 'views/ajustes.html',
    nested: 'ajustes.html'
  }
};

/**
 * Obtiene la URL de una ruta dependiendo de la ubicación actual
 * @param {string} routeId - ID de la ruta (ej: 'DASHBOARD')
 * @param {boolean} isNested - true si se accede desde carpeta anidada, false si es desde raíz
 * @returns {string} URL relativa
 */
function getRouteUrl(routeId, isNested = false) {
  const route = ROUTES[routeId];
  if (!route) {
    console.error(`Ruta no encontrada: ${routeId}`);
    return '#';
  }
  return isNested ? route.nested : route.root;
}

/**
 * Obtiene todos los items de navegación (con URLs correctas según ubicación)
 * @param {boolean} isNested - true si se accede desde carpeta anidada
 * @returns {array} Array de items de navegación
 */
function getNavItems(isNested = false) {
  return Object.keys(ROUTES).map(key => {
    const route = ROUTES[key];
    return {
      id: route.id,
      icon: route.icon,
      label: route.label,
      href: isNested ? route.nested : route.root
    };
  });
}

/**
 * Detecta si la página actual se accede desde una carpeta anidada
 * @returns {boolean}
 */
function isPageNested() {
  const currentPath = window.location.pathname;
  // Si la ruta contiene /views/ o /components/ o /etc, está anidada
  return currentPath.includes('/views/') || currentPath.includes('/controllers/');
}

/**
 * Obtiene la ruta correcta automáticamente según la ubicación actual
 * @param {string} routeId - ID de la ruta
 * @returns {string} URL relativa
 */
function getRoute(routeId) {
  return getRouteUrl(routeId, isPageNested());
}
