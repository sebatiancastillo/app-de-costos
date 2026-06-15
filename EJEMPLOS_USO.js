/**
 * EJEMPLOS DE USO - Módulo de Cotizaciones
 * 
 * Este archivo contiene ejemplos de cómo usar cada módulo
 * y las funciones más comunes. Úsalos como referencia.
 */

// ═══════════════════════════════════════════════════════════════
// EJEMPLOS: COTIZACIÓN CONTROLLER
// ═══════════════════════════════════════════════════════════════

// 1. Obtener todas las cotizaciones
const todasLasCotizaciones = CotizacionController.obtenerTodos();
console.log(`Total de cotizaciones: ${todasLasCotizaciones.length}`);

// 2. Obtener una cotización específica
const miCotizacion = CotizacionController.obtenerPorId(1234567890);
console.log(miCotizacion);

// 3. Crear una nueva cotización
const resultado = CotizacionController.crear({
  client: 'Juan Pérez García',
  projectName: 'Mueble Personalizado',
  description: 'Mueble de madera con diseño moderno',
  category: 'mueble_personalizado',
  width: 2.0,
  height: 1.5,
  depth: 0.6,
  color: '#7a4f2d',
  colorName: 'Nogal',
  deliveryDays: 15,
  materiales: [
    { nombre: 'Madera MDF', cantidad: 10, precio: 15000 },
    { nombre: 'Pintura', cantidad: 2, precio: 25000 }
  ],
  laborHours: 20,
  laborRate: 50000,
  laborCollaborator: 'Carlos',
  overhead: 15,
  margin: 30
});

if (resultado.success) {
  console.log('Cotización creada:', resultado.data);
} else {
  console.log('Errores:', resultado.errores);
}

// 4. Actualizar cotización
const actualizada = CotizacionController.actualizar(1234567890, {
  projectName: 'Mueble Personalizado Mejorado',
  margin: 35
});

// 5. Cambiar estado
const cambioEstado = CotizacionController.cambiarEstado(1234567890, 'enviada');
if (cambioEstado.success) {
  console.log('Estado actualizado a:', cambioEstado.data.estado);
}

// 6. Eliminar cotización
const eliminada = CotizacionController.eliminar(1234567890);
if (eliminada.success) {
  console.log('Cotización eliminada');
}

// 7. Filtrar cotizaciones
const cotizacionesPendientes = CotizacionController.filtrar({
  estado: 'pendiente',
  cliente: 'Juan'
});

const cotizacionesEnRango = CotizacionController.filtrar({
  fechaDesde: '2024-05-01',
  fechaHasta: '2024-05-31',
  minTotal: 100000
});

// 8. Obtener estadísticas
const stats = CotizacionController.obtenerEstadisticas();
console.log('Total:', stats.total);
console.log('Monto total:', stats.totalMonto);
console.log('Por estado:', stats.porEstado);

// ═══════════════════════════════════════════════════════════════
// EJEMPLOS: MATERIALES MODULE
// ═══════════════════════════════════════════════════════════════

// 1. Crear material
const resultadoMaterial = MaterialesModule.crearMaterial({
  nombre: 'Madera Pino',
  descripcion: 'Tabla de madera pino de 2x4',
  cantidad: 5,
  unidad: 'und',
  precio: 45000,
  categoria: 'madera'
});

if (resultadoMaterial.success) {
  // 2. Guardar en biblioteca
  MaterialesModule.guardarEnBiblioteca(resultadoMaterial.data);
}

// 3. Obtener biblioteca completa
const biblioteca = MaterialesModule.obtenerBiblioteca();
console.log(`Materiales en biblioteca: ${biblioteca.length}`);

// 4. Buscar en biblioteca
const materialesEncontrados = MaterialesModule.buscarEnBiblioteca('pino');
console.log('Encontrados:', materialesEncontrados);

// 5. Calcular subtotal de un material
const subtotal = MaterialesModule.calcularSubtotal(5, 45000); // 225000

// 6. Calcular total de materiales
const totalMateriales = MaterialesModule.calcularTotalMateriales([
  { cantidad: 5, precio: 45000 },
  { cantidad: 2, precio: 25000 },
  { cantidad: 10, precio: 15000 }
]); // 365000

// 7. Agrupar por categoría
const materiales = [
  { nombre: 'Pino', categoria: 'madera', cantidad: 5, precio: 45000 },
  { nombre: 'Tornillos', categoria: 'herrajes', cantidad: 100, precio: 500 },
  { nombre: 'Madera MDF', categoria: 'madera', cantidad: 10, precio: 15000 }
];
const agrupados = MaterialesModule.agruparPorCategoria(materiales);
console.log(agrupados);

// 8. Obtener categorías disponibles
const categorias = MaterialesModule.obtenerCategorias();
console.log(categorias);

// 9. Obtener unidades disponibles
const unidades = MaterialesModule.obtenerUnidades();
console.log(unidades);

// ═══════════════════════════════════════════════════════════════
// EJEMPLOS: MANO DE OBRA MODULE
// ═══════════════════════════════════════════════════════════════

// 1. Crear colaborador
const colaborador = {
  nombre: 'Carlos Alberto López',
  cargo: 'Carpintero Senior',
  tarifaHora: 50000,
  telefono: '3001234567'
};
ManoObraModule.guardarColaborador(colaborador);

// 2. Obtener todos los colaboradores
const colaboradores = ManoObraModule.obtenerColaboradores();
console.log(`Colaboradores: ${colaboradores.length}`);

// 3. Crear tarea
const resultadoTarea = ManoObraModule.crearTarea({
  nombre: 'Corte de madera',
  descripcion: 'Corte de piezas según plano',
  horas: 8,
  tarifa: 50000,
  colaborador: 'Carlos',
  categoria: 'carpinteria'
});

// 4. Calcular costo de tarea
const costoTarea = ManoObraModule.calcularCostoTarea(8, 50000); // 400000

// 5. Calcular total de mano de obra
const tareas = [
  { horas: 8, tarifa: 50000 },
  { horas: 10, tarifa: 45000 },
  { horas: 5, tarifa: 60000 }
];
const totalManoObra = ManoObraModule.calcularTotalManoObra(tareas); // 1'150000

// 6. Obtener tareas de un colaborador
const tareasDeCarlos = ManoObraModule.obtenerTareasPorColaborador(tareas, 'Carlos');

// 7. Calcular horas totales de colaborador
const horasCarlos = ManoObraModule.calcularHorasColaborador(tareas, 'Carlos'); // 23

// ═══════════════════════════════════════════════════════════════
// EJEMPLOS: GASTOS MODULE
// ═══════════════════════════════════════════════════════════════

// 1. Calcular overhead
const overhead = GastosModule.calcularOverhead(150000, 15); // 22500

// 2. Calcular margen
const margen = GastosModule.calcularMargen(172500, 30); // 51750

// 3. Calcular precio final completo
const precioFinal = GastosModule.calcularPrecioFinal(
  100000,     // materiales
  50000,      // mano de obra
  15,         // overhead %
  30,         // margen %
  10000       // gastos adicionales
);
// Retorna: {
//   materiales: 100000,
//   manoObra: 50000,
//   subtotal: 150000,
//   overhead: 15,
//   overheadMonto: 22500,
//   subtotalConOverhead: 172500,
//   margen: 30,
//   margenMonto: 51750,
//   gastosAdicionales: 10000,
//   total: 234250
// }

// 4. Obtener tipos de gastos
const tiposGastos = GastosModule.obtenerTiposGastos();
console.log(tiposGastos);

// 5. Obtener gamas de margen
const gamas = GastosModule.obtenerGamasMargen();
console.log(gamas);

// 6. Recomendar margen
const margenRecomendado = GastosModule.recomendarMargen('mueble_personalizado'); // 40
const margenReparacion = GastosModule.recomendarMargen('reparacion'); // 35

// 7. Calcular descuento
const conDescuento = GastosModule.calcularDescuento(100000, 10);
// Retorna: {
//   precio: 100000,
//   descuento: 10000,
//   precioFinal: 90000
// }

// 8. Comparar escenarios
const escenarios = GastosModule.compararEscenarios(150000, 15);
// Retorna 3 escenarios: bajo (15%), medio (30%), alto (50%)

// ═══════════════════════════════════════════════════════════════
// EJEMPLOS: RECORDATORIOS MODULE
// ═══════════════════════════════════════════════════════════════

// 1. Crear recordatorio manual
const recordatorio = RecordatoriosModule.guardar({
  cotizacionId: 1234567890,
  tipo: 'seguimiento',
  titulo: 'Hacer seguimiento',
  descripcion: 'Llamar al cliente para saber del estado',
  fechaProgramada: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
});

// 2. Crear recordatorios automáticos
const cotizacion = CotizacionController.obtenerPorId(1234567890);
RecordatoriosModule.crearRecordatoriosAutomaticos(cotizacion);

// 3. Obtener próximos recordatorios (próximos 7 días)
const proximosRecordatorios = RecordatoriosModule.obtenerProximos(7);
console.log(`Recordatorios próximos: ${proximosRecordatorios.length}`);

// 4. Obtener recordatorios vencidos
const vencidos = RecordatoriosModule.obtenerVencidos();
console.log(`Recordatorios vencidos: ${vencidos.length}`);

// 5. Marcar recordatorio como completado
RecordatoriosModule.marcarCompletado(recordatorio.id);

// 6. Obtener recordatorios de una cotización
const recordatoriosDelCotizacion = RecordatoriosModule.obtenerPorCotizacion(1234567890);
console.log(`Recordatorios de esta cotización: ${recordatoriosDelCotizacion.length}`);

// 7. Solicitar permiso para notificaciones
RecordatoriosModule.solicitarPermisoNotificaciones();

// 8. Verificar notificaciones
RecordatoriosModule.verificarNotificaciones();

// ═══════════════════════════════════════════════════════════════
// EJEMPLOS: FLUJO COMPLETO (CASO REALISTA)
// ═══════════════════════════════════════════════════════════════

console.log('\n=== FLUJO COMPLETO ===\n');

// 1. Cliente nuevo: Juan Pérez quiere una mesa personalizada
const nuevaCot = CotizacionController.crear({
  client: 'Juan Pérez',
  projectName: 'Mesa Personalizada para Oficina',
  description: 'Mesa de trabajo en L, madera nogal',
  laborHours: 20,
  laborRate: 50000,
  margin: 35,
  overhead: 15
});

const cotizacionId = nuevaCot.data.id;
console.log(`✅ Cotización creada: #${nuevaCot.data.numero}`);

// 2. Agregar materiales
// (En la interfaz gráfica se hace a través de tabla)
console.log('✅ Materiales agregados');

// 3. Calcular precio final automáticamente
const costos = nuevaCot.data.costos;
console.log(`Total: $${costos.total.toLocaleString('es-CO')}`);

// 4. Enviar al cliente
const cambio1 = CotizacionController.cambiarEstado(cotizacionId, 'enviada');
console.log(`✅ Estado: ${cambio1.data.estado}`);

// 5. Crear recordatorio automático
RecordatoriosModule.crearRecordatoriosAutomaticos(cambio1.data);
console.log('✅ Recordatorios creados automáticamente');

// 6. (3 días después) Cliente aprueba
const cambio2 = CotizacionController.cambiarEstado(cotizacionId, 'aprobada');
console.log(`✅ Estado: ${cambio2.data.estado}`);

// 7. Pasar a producción
const cambio3 = CotizacionController.cambiarEstado(cotizacionId, 'produccion');
console.log(`✅ Estado: ${cambio3.data.estado}`);

// 8. (15 días después) Finalizar
const cambio4 = CotizacionController.cambiarEstado(cotizacionId, 'finalizada');
console.log(`✅ Estado: ${cambio4.data.estado}`);

// 9. Archivar
const cambio5 = CotizacionController.cambiarEstado(cotizacionId, 'archivada');
console.log(`✅ Estado: ${cambio5.data.estado}`);

// 10. Ver estadísticas
const estadisticas = CotizacionController.obtenerEstadisticas();
console.log(`\n📊 Estadísticas finales:`);
console.log(`   Total de cotizaciones: ${estadisticas.total}`);
console.log(`   Monto total: $${estadisticas.totalMonto.toLocaleString('es-CO')}`);
console.log(`   Promedio: $${Math.round(estadisticas.promedioMonto).toLocaleString('es-CO')}`);

// ═══════════════════════════════════════════════════════════════
// EJEMPLOS: MANEJO DE ERRORES
// ═══════════════════════════════════════════════════════════════

console.log('\n=== MANEJO DE ERRORES ===\n');

// Intentar crear cotización sin cliente
const cotInvalida = CotizacionController.crear({
  projectName: 'Proyecto sin cliente'
  // Falta: client
});

if (!cotInvalida.success) {
  console.log('❌ Errores encontrados:');
  cotInvalida.errores.forEach(err => console.log(`   - ${err}`));
}

// Intentar cambiar a estado no permitido
try {
  const cambioInvalido = CotizacionController.cambiarEstado(
    cotizacionId,
    'enviada' // No puede ir de archivada a enviada
  );
  if (!cambioInvalido.success) {
    console.log(`❌ ${cambioInvalido.error}`);
  }
} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}

// ═══════════════════════════════════════════════════════════════
// NOTAS IMPORTANTES
// ═══════════════════════════════════════════════════════════════

/*
1. Todos los datos se guardan en localStorage automáticamente
2. Los cálculos son instantáneos (en el navegador)
3. Las validaciones previenen datos inconsistentes
4. Los recordatorios se crean automáticamente
5. El dashboard se actualiza en tiempo real

DEBUGGING:
- Abre la consola (F12)
- Usa console.log() para ver valores
- Los errores aparecen en la consola del navegador
- Revisa localStorage en DevTools > Application > LocalStorage
*/
