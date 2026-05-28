// ═══════════════════════════════════════════════════════════════
// MODELO: Cotizacion.js - Estructura y validación de datos
// ═══════════════════════════════════════════════════════════════

const ESTADOS = {
  PENDIENTE:    { id: 'pendiente',    label: 'Pendiente',    color: '#e8a84c', icon: '📋' },
  ENVIADA:      { id: 'enviada',      label: 'Enviada',      color: '#5cb8e5', icon: '📤' },
  APROBADA:     { id: 'aprobada',     label: 'Aprobada',     color: '#5cb88a', icon: '✅' },
  PRODUCCION:   { id: 'produccion',   label: 'Producción',   color: '#9b6de5', icon: '🔧' },
  FINALIZADA:   { id: 'finalizada',   label: 'Finalizada',   color: '#4a7c5a', icon: '🏁' },
  ARCHIVADA:    { id: 'archivada',    label: 'Archivada',    color: '#7a6850', icon: '📦' },
  RECHAZADA:    { id: 'rechazada',    label: 'Rechazada',   color: '#e05c5c', icon: '❌' }
};

const FLUJO_ESTADOS = {
  pendiente:   ['enviada', 'rechazada', 'archivada'],
  enviada:     ['aprobada', 'rechazada', 'pendiente'],
  aprobada:    ['produccion', 'rechazada'],
  produccion:  ['finalizada'],
  finalizada:  ['archivada'],
  archivada:   [],
  rechazada:   ['pendiente']
};

class CotizacionModel {
  static crear(datos) {
    const now = new Date();
    return {
      id: datos.id || Date.now(),
      proyecto: datos.projectName || '',
      cliente: datos.client || '',
      telefono: datos.phone || '',
      direccion: datos.address || '',
      descripcion: datos.description || '',
      categoria: datos.category || 'otro',
      
      tamano: datos.size || '',
      ancho: datos.width || 0,
      alto: datos.height || 0,
      fondo: datos.depth || 0,
      color: datos.color || '#7a4f2d',
      colorNombre: datos.colorName || 'Nogal',
      
      tiempoEntrega: datos.deliveryDays || 15,
      
      materiales: datos.materiales || [],
      manoObra: {
        tarea: datos.laborTask || '',
        horas: datos.laborHours || 0,
        colaborador: datos.laborCollaborator || '',
        tarifa: datos.laborRate || 0
      },
      
      overhead: datos.overhead || 15,
      margen: datos.margin || 30,
      
      costos: {
        materiales: datos.costos?.materiales || 0,
        manoObra: datos.costos?.manoObra || 0,
        subtotal: datos.costos?.subtotal || 0,
        overheadMonto: datos.costos?.overheadMonto || 0,
        margenMonto: datos.costos?.margenMonto || 0,
        total: datos.costos?.total || 0
      },
      
      estado: datos.estado || 'pendiente',
      
      fechaCreacion: datos.fechaCreacion || now.toISOString(),
      fechaActualizacion: datos.fechaActualizacion || now.toISOString(),
      fechaEnvio: datos.fechaEnvio || null,
      fechaAprobacion: datos.fechaAprobacion || null,
      fechaProduccion: datos.fechaProduccion || null,
      fechaFinalizacion: datos.fechaFinalizacion || null,
      fechaArchivado: datos.fechaArchivado || null,
      
      recordatorios: datos.recordatorios || [],
      notas: datos.notas || '',
      versi: 1
    };
  }

  static validar(cotizacion) {
    const errores = [];
    
    if (!cotizacion.proyecto?.trim()) {
      errores.push('El nombre del proyecto es obligatorio');
    }
    if (!cotizacion.cliente?.trim()) {
      errores.push('El nombre del cliente es obligatorio');
    }
    if (cotizacion.costos?.total <= 0) {
      errores.push('El total debe ser mayor a 0');
    }
    
    return errores;
  }

  static puedeTransicionar(estadoActual, nuevoEstado) {
    const permitidos = FLUJO_ESTADOS[estadoActual] || [];
    return permitidos.includes(nuevoEstado);
  }

  static calcularCostos(datos) {
    const matTotal = datos.materiales.reduce((sum, m) => sum + (m.cantidad * m.precio), 0);
    const labTotal = (datos.laborHours || 0) * (datos.laborRate || 0);
    const subtotal = matTotal + labTotal;
    const ovMonto = subtotal * ((datos.overhead || 15) / 100);
    const base = subtotal + ovMonto;
    const mrgMonto = base * ((datos.margin || 30) / 100);
    const total = base + mrgMonto;

    return {
      materiales: matTotal,
      manoObra: labTotal,
      subtotal,
      overheadMonto: ovMonto,
      margenMonto: mrgMonto,
      total
    };
  }

  static puedeEditar(cotizacion) {
    return !['archivada', 'finalizada'].includes(cotizacion.estado);
  }

  static getEstadoLabel(estado) {
    return ESTADOS[estado?.toUpperCase()]?.label || estado;
  }

  static getEstadoConfig(estado) {
    return ESTADOS[estado?.toUpperCase()] || ESTADOS.PENDIENTE;
  }
}

window.CotizacionModel = CotizacionModel;
window.ESTADOS = ESTADOS;
window.FLUJO_ESTADOS = FLUJO_ESTADOS;