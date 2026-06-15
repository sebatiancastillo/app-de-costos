# 📋 Módulo de Cotizaciones - Documentación Completa

## 🎯 Descripción General

Sistema profesional de gestión de cotizaciones para Vikingos Carpintería. Permite crear, gestionar y seguir cotizaciones personalizadas con cálculos automáticos de costos, márgenes de ganancia y estados dinámicos.

---

## 📁 Estructura de Archivos

```
/public
├── /views
│   └── dashboard.html              ← Dashboard principal
├── /styles
│   ├── dashboard.css               ← Estilos dashboard
│   └── cotizacion.css              ← Estilos cotizaciones
├── /modules/cotizaciones/
│   ├── Cotizacion.model.js         ← Estructura y validación (MVC-M)
│   ├── Cotizacion.controller.js    ← Lógica de negocio (MVC-C)
│   ├── Cotizacion.view.js          ← Visualización (MVC-V)
│   ├── DashboardView.js            ← Componentes dashboard
│   ├── MaterialesModule.js         ← Gestión de materiales
│   ├── ManoObraModule.js           ← Gestión de tareas/colaboradores
│   ├── GastosModule.js             ← Cálculos de gastos y margen
│   └── RecordatoriosModule.js      ← Recordatorios automáticos
└── /shared
    ├── storage.js                  ← Persistencia en localStorage
    └── utils.js                    ← Utilidades compartidas
```

---

## 🚀 Funcionalidades Principales

### 1. **Dashboard Principal** 📊

**Archivo:** `dashboard.html`

Pantalla central con:
- ✅ Estadísticas en tiempo real (total cotizaciones, monto, aprobadas, etc.)
- ✅ Filtros por estado, cliente, fecha
- ✅ Tabla de cotizaciones con acciones rápidas
- ✅ Gráfico de distribución de estados
- ✅ Alertas y recordatorios
- ✅ Búsqueda integrada

**Funciones principales:**
```javascript
cargarDatos()              // Cargar todas las cotizaciones
aplicarFiltros()           // Filtrar por criterios
renderizarTabla()          // Mostrar tabla de cotizaciones
actualizarEstadisticas()   // Actualizar tarjetas de stats
verDetalles(id)            // Mostrar modal con detalles
cambiarEstado(id)          // Cambiar estado de cotización
eliminarCotizacion(id)     // Eliminar cotización
descargarBackup()          // Descargar JSON de respaldo
```

---

### 2. **Modelo de Cotización** 📦

**Archivo:** `Cotizacion.model.js`

Estructura de datos y validaciones:

```javascript
// Estados disponibles
ESTADOS = {
  PENDIENTE:    { id: 'pendiente',    label: 'Pendiente' },
  ENVIADA:      { id: 'enviada',      label: 'Enviada' },
  APROBADA:     { id: 'aprobada',     label: 'Aprobada' },
  PRODUCCION:   { id: 'produccion',   label: 'Producción' },
  FINALIZADA:   { id: 'finalizada',   label: 'Finalizada' },
  ARCHIVADA:    { id: 'archivada',    label: 'Archivada' },
  RECHAZADA:    { id: 'rechazada',    label: 'Rechazada' }
};

// Flujo de estados permitido
FLUJO_ESTADOS = {
  pendiente:   ['enviada', 'rechazada', 'archivada'],
  enviada:     ['aprobada', 'rechazada', 'pendiente'],
  aprobada:    ['produccion', 'rechazada'],
  // ... más flujos
};
```

**Métodos:**
- `CotizacionModel.crear(datos)` → Crear nueva cotización
- `CotizacionModel.validar(cotizacion)` → Validar datos
- `CotizacionModel.calcularCostos(datos)` → Cálculos automáticos
- `CotizacionModel.puedeTransicionar(estadoActual, nuevoEstado)` → Validar transición

---

### 3. **Controlador de Cotización** 🎮

**Archivo:** `Cotizacion.controller.js`

Gestión de lógica de negocio:

```javascript
CotizacionController.obtenerTodos()            // Obtener todas las cotizaciones
CotizacionController.obtenerPorId(id)          // Obtener una específica
CotizacionController.crear(datos)              // Crear nueva
CotizacionController.actualizar(id, datos)     // Actualizar
CotizacionController.cambiarEstado(id, estado) // Cambiar estado
CotizacionController.eliminar(id)              // Eliminar
CotizacionController.filtrar(criterios)        // Filtros avanzados
CotizacionController.obtenerEstadisticas()     // Estadísticas
```

---

### 4. **Módulo de Materiales** 🪵

**Archivo:** `MaterialesModule.js`

Gestión completa de materiales:

```javascript
MaterialesModule.guardarEnBiblioteca(material)    // Agregar a biblioteca
MaterialesModule.obtenerBiblioteca()              // Obtener todos
MaterialesModule.buscarEnBiblioteca(termino)      // Buscar
MaterialesModule.calcularSubtotal(cantidad, precio)
MaterialesModule.calcularTotalMateriales(materiales)
MaterialesModule.agruparPorCategoria(materiales)
```

**Categorías disponibles:**
- 🪵 Madera
- 🔧 Herrajes
- 🧴 Insumos
- 🎨 Tapicería
- ✨ Acabados
- 📦 Otros

---

### 5. **Módulo de Mano de Obra** 👷

**Archivo:** `ManoObraModule.js`

Gestión de tareas y colaboradores:

```javascript
ManoObraModule.obtenerColaboradores()           // Lista de colaboradores
ManoObraModule.guardarColaborador(colaborador)  // Agregar/Editar
ManoObraModule.eliminarColaborador(id)          // Eliminar
ManoObraModule.calcularCostoTarea(horas, tarifa)
ManoObraModule.calcularTotalManoObra(tareas)
ManoObraModule.calcularHorasColaborador(tareas, id)
```

**Categorías de tareas:**
- 🪵 Carpintería
- ✨ Acabado
- 🎨 Tapizado
- 🔩 Ensamble
- ⚙️ Instalación

---

### 6. **Módulo de Gastos** 💰

**Archivo:** `GastosModule.js`

Cálculos de costos totales:

```javascript
GastosModule.calcularPrecioFinal(
  materiales,
  manoObra,
  overhead = 15,        // %
  margen = 30,          // %
  gastosAdicionales = 0
)
// Retorna objeto con desglose completo

GastosModule.recomendarMargen(tipoProyecto)    // Margen sugerido
GastosModule.compararEscenarios(subtotal)      // Comparar precios
GastosModule.calcularDescuento(precio, descuento%)
```

---

### 7. **Módulo de Recordatorios** ⏰

**Archivo:** `RecordatoriosModule.js`

Sistema de alertas automáticas:

```javascript
RecordatoriosModule.crearRecordatoriosAutomaticos(cotizacion)
RecordatoriosModule.obtenerProximos(dias = 7)  // Próximos X días
RecordatoriosModule.obtenerVencidos()          // Recordatorios atrasados
RecordatoriosModule.marcarCompletado(id)       // Marcar como hecho
RecordatoriosModule.solicitarPermisoNotificaciones()
RecordatoriosModule.verificarNotificaciones()
```

**Tipos de recordatorio:**
- 📞 SEGUIMIENTO (3 días después de enviar)
- 📦 ENTREGA (en la fecha programada)
- 💰 PAGO (14 días después de aprobar)
- 👁️ REVISION
- ✅ APROBACION
- 📌 CUSTOM

---

## 💾 Persistencia de Datos

Todos los datos se guardan en **localStorage** del navegador:

```javascript
// Claves de almacenamiento
'vikingos_cotizaciones'        // Cotizaciones principales
'vikingos_materiales'          // Biblioteca de materiales
'vikingos_colaboradores'       // Lista de colaboradores
'vikingos_recordatorios'       // Recordatorios programados
```

---

## 🔄 Flujo de Estados

```
PENDIENTE (inicio)
    ↓
    ├→ ENVIADA (al cliente)
    │   ├→ APROBADA (cliente acepta)
    │   │   ├→ PRODUCCION
    │   │   │   ├→ FINALIZADA
    │   │   │   │   └→ ARCHIVADA
    │   │   └→ RECHAZADA
    │   └→ PENDIENTE (vuelve atrás)
    ├→ RECHAZADA
    └→ ARCHIVADA (descarta)
```

---

## 📊 Cálculo de Costos

```
Costo Total = (Materiales + Mano de Obra) × (1 + Overhead%) × (1 + Margen%) + Gastos Adicionales

Ejemplo:
Materiales: $100,000
Mano de Obra: $50,000
Subtotal: $150,000
Overhead (15%): +$22,500 = $172,500
Margen (30%): +$51,750 = $224,250
Gastos: +$10,000
TOTAL: $234,250
```

---

## 📱 Responsive Design

- ✅ Desktop (1400px+)
- ✅ Tablet (768px - 1399px)
- ✅ Móvil (< 768px)

---

## 🔧 Cómo Usar

### Crear nueva cotización
```javascript
const resultado = CotizacionController.crear({
  client: 'Juan Pérez',
  projectName: 'Mesa Personalizada',
  materiales: [...],
  laborHours: 10,
  laborRate: 50000,
  margin: 30,
  overhead: 15
});
```

### Cambiar estado
```javascript
const resultado = CotizacionController.cambiarEstado(cotizacionId, 'enviada');
if (resultado.success) {
  console.log('Estado actualizado');
}
```

### Filtrar cotizaciones
```javascript
const filtradas = CotizacionController.filtrar({
  estado: 'pendiente',
  cliente: 'Juan',
  fechaDesde: '2024-01-01',
  minTotal: 100000
});
```

---

## 📈 Estadísticas Disponibles

```javascript
const stats = CotizacionController.obtenerEstadisticas();
// {
//   total: 15,
//   porEstado: { pendiente: 3, enviada: 5, aprobada: 7, ... },
//   promedioMonto: 245600,
//   totalMonto: 3684000
// }
```

---

## 🔐 Validaciones

Todas las entradas se validan antes de guardarse:

- ✅ Nombre de cliente obligatorio
- ✅ Nombre de proyecto obligatorio
- ✅ Monto total > 0
- ✅ Cantidades y precios válidos
- ✅ Transiciones de estado permitidas
- ✅ Emails válidos (si aplica)

---

## 🎨 Personalización

### Colores por estado
```css
--badge-pendiente: #e8a84c    /* Naranja */
--badge-enviada: #5cb8e5      /* Azul */
--badge-aprobada: #5cb88a     /* Verde */
--badge-produccion: #9b6de5   /* Púrpura */
--badge-finalizada: #4a7c5a   /* Verde oscuro */
--badge-archivada: #7a6850    /* Marrón */
--badge-rechazada: #e05c5c    /* Rojo */
```

---

## 🚀 Próximas Funcionalidades

- [ ] Exportación a PDF
- [ ] Envío por WhatsApp
- [ ] Envío por Email
- [ ] Integración con proveedores
- [ ] Migración a React
- [ ] API Node.js
- [ ] Base de datos PostgreSQL
- [ ] Historial de cambios detallado

---

## 📞 Soporte

Si encuentras errores o tienes sugerencias, por favor documenta:
1. Pasos para reproducir
2. Comportamiento esperado
3. Comportamiento actual
4. Navegador y versión

---

## 📄 Licencia

Proyecto interno - Vikingos Carpintería
