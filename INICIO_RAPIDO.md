# 🚀 Guía de Inicio Rápido - Módulo de Cotizaciones

## ⚡ 30 segundos para comenzar

### Paso 1: Abre el dashboard
```html
<!-- Navega a: public/views/dashboard.html -->
```

### Paso 2: Crea una cotización
```javascript
// Haz clic en "➕ Nueva Cotización"
// Se abre un formulario completo
```

### Paso 3: Agrega materiales y mano de obra
```javascript
// Tabla interactiva para materiales
// Tabla interactiva para tareas
// Los costos se calculan automáticamente
```

### Paso 4: Envía al cliente
```javascript
// Estado: Pendiente → Enviada
// Se crea recordatorio automático de seguimiento
```

---

## 📋 Casos de Uso Comunes

### 1️⃣ **Crear cotización desde cero**

```javascript
// En el dashboard, haz clic: "➕ Nueva Cotización"
// Completa el formulario con:
// - Cliente
// - Proyecto
// - Descripción
// - Materiales (tabla interactiva)
// - Mano de obra (tabla interactiva)
// - Margen de ganancia
// - Guardar
```

### 2️⃣ **Ver todas las cotizaciones**

```javascript
// dashboard.html muestra:
// - Tabla con todas las cotizaciones
// - Filtros por estado, cliente, fecha
// - Búsqueda por nombre
// - Ordenamiento personalizado
```

### 3️⃣ **Cambiar estado de cotización**

```javascript
// En la tabla, haz clic en el icono ↔️
// Se abre modal con estados permitidos
// Selecciona nuevo estado
// Se crea recordatorio automático si aplica
```

### 4️⃣ **Ver detalles de cotización**

```javascript
// En la tabla, haz clic en el icono 👁️
// Se abre modal con:
// - Información del cliente
// - Detalles técnicos
// - Desglose de costos
// - Materiales utilizados
// - Tareas asignadas
```

### 5️⃣ **Editar cotización**

```javascript
// En la tabla, haz clic en el icono ✏️
// Se abre formulario de edición
// Modifica lo que necesites
// Los cálculos se actualizan automáticamente
// Guarda cambios
```

### 6️⃣ **Filtrar cotizaciones**

```javascript
// Búsqueda: Escribe nombre de cliente o proyecto
// Estado: Selecciona un estado específico
// Fechas: Rango de creación
// Orden: Por fecha, monto, etc.
```

### 7️⃣ **Ver estadísticas**

```javascript
// En la parte superior del dashboard:
// - Total de cotizaciones
// - Monto total en cotizaciones
// - Cuántas aprobadas
// - Cuántas pendientes
// - Cuántas en producción
// - Margen promedio
```

### 8️⃣ **Hacer respaldo**

```javascript
// En el navbar: Haz clic en "💾 Respaldar"
// Se descarga un JSON con todas las cotizaciones
// Puedes guardar como copia de seguridad
```

---

## 🎯 Accesos Rápidos

| Acción | Atajo | Ubicación |
|--------|-------|-----------|
| Nueva cotización | ➕ | Navbar arriba derecha |
| Descargar backup | 💾 | Navbar arriba derecha |
| Ver detalles | 👁️ | Última columna tabla |
| Editar | ✏️ | Última columna tabla |
| Cambiar estado | ↔️ | Última columna tabla |
| Eliminar | 🗑️ | Última columna tabla |
| Filtrar | 🔍 | Debajo de navbar |

---

## 💡 Tips Profesionales

### 📊 Usa los filtros a tu favor
```javascript
// Filtra por "Pendiente" para ver qué falta hacer
// Filtra por "Enviada" para hacer seguimiento
// Filtra por fechas para reportes
```

### 💰 Márgenes recomendados
```javascript
- Mueble personalizado: 40%
- Producto estándar: 35%
- Proyecto grande: 30%
- Servicio instalación: 25%
- Reparación: 35%
```

### ⏰ Recordatorios automáticos
```javascript
- Enviada → Seguimiento a 3 días
- Aprobada → Pago a 14 días
- En producción → Entrega en fecha programada
```

### 📱 Desde móvil
```javascript
// El dashboard es responsive
// Funciona perfectamente en móviles
// Todos los botones son táctiles
```

---

## ❌ Errores Comunes

### ❌ "No se puede cambiar de estado"
**Solución:** Solo ciertos estados pueden transicionar a otros. Verifica el flujo.

### ❌ "El total debe ser mayor a 0"
**Solución:** Agrega al menos un material o tarea con precio > 0

### ❌ "El cliente es obligatorio"
**Solución:** Completa el campo de cliente antes de guardar

### ❌ "Cotización no encontrada"
**Solución:** Recarga la página, los datos están en localStorage

---

## 🔧 Opciones Avanzadas

### Exportar a CSV
```javascript
// (Próximamente)
// Haz clic en el ícono de descarga
// Se descargará archivo con detalles
```

### Enviar por WhatsApp
```javascript
// (Próximamente)
// Compartir cotización directamente al cliente
```

### Crear plantilla
```javascript
// (Próximamente)
// Guardar cotización como plantilla
// Duplicar para nuevos clientes similares
```

---

## 📚 Estructura de Datos

### Cotización completa
```javascript
{
  id: 1234567890,
  numero: "COT-001",
  proyecto: "Mesa Personalizada",
  cliente: { nombre: "Juan Pérez", ...},
  estado: "enviada",
  
  // Cálculos
  costos: {
    materiales: 100000,
    manoObra: 50000,
    subtotal: 150000,
    overhead: 22500,
    margen: 51750,
    total: 224250
  },
  
  // Fechas de seguimiento
  fechaCreacion: "2024-05-28T10:00:00Z",
  fechaEnvio: "2024-05-28T11:30:00Z",
  fechaAprobacion: null,
  
  // Configuración
  margen: 30,
  overhead: 15,
  tiempoEntrega: 15
}
```

---

## 🎓 Aprende más

- Documentación completa: `README.md`
- Código fuente: `Cotizacion.model.js`, `Cotizacion.controller.js`
- API de módulos: `MaterialesModule.js`, `ManoObraModule.js`, `GastosModule.js`

---

## ✨ Funcionalidades Destacadas

- ✅ **Cálculos automáticos** - No hay que hacer cuentas
- ✅ **Estados dinámicos** - Flujo lógico de procesos
- ✅ **Recordatorios** - Nunca olvides seguimientos
- ✅ **Filtros potentes** - Encuentra lo que buscas rápido
- ✅ **Respaldo automático** - Los datos se guardan en el navegador
- ✅ **Diseño profesional** - Se ve bien en cualquier dispositivo

---

## 🆘 ¿Necesitas ayuda?

1. Verifica los datos ingresados sean correctos
2. Recarga la página
3. Revisa la consola (F12) para mensajes de error
4. Consulta la documentación completa en `README.md`

---

**¡Listo! Ahora estás preparado para gestionar cotizaciones profesionales** 🎉
