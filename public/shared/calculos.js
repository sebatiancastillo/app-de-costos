// Convierte un número a formato de moneda colombiana (COP)
// Ejemplo: 1500000 -> "$1.500.000"
function formatCOP(numero) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP',
    maximumFractionDigits: 0
  }).format(numero);
}

// Convierte una cadena ISO de fecha en un formato legible en español
// Ejemplo: "2026-06-02T00:00:00Z" -> "2 jun. 2026"
function formatFecha(isoString) {
  return new Date(isoString).toLocaleDateString('es-CO', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

// Extrae el valor de un parámetro de consulta de la URL actual
// Ejemplo: si la URL es ?id=123, getUrlParam('id') devuelve "123"
function getUrlParam(nombre) {
  return new URLSearchParams(window.location.search).get(nombre);
}
