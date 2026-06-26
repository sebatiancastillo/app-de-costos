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
    const nomProy = typeof cotizacion.proyecto === 'object' ? cotizacion.proyecto?.nombre : cotizacion.proyecto;
    const nomCli = typeof cotizacion.cliente === 'object' ? cotizacion.cliente?.nombre : cotizacion.cliente;
    
    if (!nomProy?.trim()) {
      errores.push('El nombre del proyecto es obligatorio');
    }
    if (!nomCli?.trim()) {
      errores.push('El nombre del cliente es obligatorio');
    }
    const total = cotizacion.costos?.total || cotizacion.costos?.precioFinal || 0;
    if (total <= 0) {
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

  static crearDesdeFormulario(datos) {
    const now = new Date();
    const sumCostos = (datos.costoMateriales || 0) + (datos.costoManoObra || 0)
      + (datos.costoHerrajes || 0) + (datos.costoHerramientas || 0) + (datos.costoTransporte || 0)
      + (datos.costoSubcontratos || 0);
    const margen = datos.margenGanancia != null ? datos.margenGanancia : 40;
    const precioFinal = sumCostos * (1 + margen / 100);

    return {
      id: datos.id || Date.now(),
      numero: datos.numero || '',
      estado: datos.estado || 'borrador',
      fechaCreacion: datos.fechaCreacion || now.toISOString(),
      fechaActualizacion: now.toISOString(),
      fechaEnvio: datos.fechaEnvio || null,
      fechaAprobacion: datos.fechaAprobacion || null,
      fechaProduccion: datos.fechaProduccion || null,
      fechaFinalizacion: datos.fechaFinalizacion || null,
      fechaArchivado: datos.fechaArchivado || null,

      cliente: {
        tipo: datos.tipoCliente || 'cliente_final',
        nombre: datos.nombreCliente || '',
        contacto: datos.contactoPrincipal || '',
        telefono: datos.telefono || '',
        whatsapp: datos.whatsapp || '',
        email: datos.email || '',
        direccion: datos.direccionEntrega || datos.direccionProyecto || '',
        ciudad: datos.ciudad || '',
        barrio: datos.barrio || '',
        comoNosConocio: datos.comoNosConocio || ''
      },

      proyecto: {
        tipo: datos.tipoTrabajo || '',
        tipoOtro: datos.tipoTrabajoOtro || '',
        nombre: datos.nombreProyecto || '',
        descripcion: datos.descripcionProyecto || '',
        dimensionesGenerales: {
          alto: datos.altoGeneral || 0,
          ancho: datos.anchoGeneral || 0,
          profundo: datos.profundoGeneral || 0
        },
        observaciones: datos.observaciones || '',
        validez: datos.validezCotizacion || '15',
        ubicacion: datos.ubicacionInstalacion || 'interior',
        fechaEntregaDeseada: datos.fechaEntregaDeseada || ''
      },

      especificaciones: {
        medidas: {
          largo: datos.largo || 0,
          ancho: datos.ancho || 0,
          alto: datos.alto || 0,
          grosor: datos.grosor || 0
        },
        cortesEspeciales: datos.cortesEspeciales || [],
        cantidadPiezas: datos.cantidadPiezas || 1,
        nivelDificultad: datos.nivelDificultad || 'basico',
        items: datos.items || []
      },

      costos: {
        materiales: {
          items: datos.materialesItems || [],
          total: datos.materialesTotal || datos.costoMateriales || 0
        },
        manoObra: datos.costoManoObra || 0,
        herrajes: datos.costoHerrajes || 0,
        herramientas: datos.costoHerramientas || 0,
        transporte: datos.costoTransporte || 0,
        subcontratos: datos.costoSubcontratos || 0,
        tiempoEstimadoDias: datos.tiempoEstimadoDias || 0,
        margenGanancia: margen,
        precioFinal: precioFinal
      },

      crm: {
        probabilidadCierre: datos.probabilidadCierre != null ? datos.probabilidadCierre : 50,
        notas: datos.notasAsesor || [],
        fechaUltimoContacto: datos.fechaUltimoContacto || null,
        fechaProximoSeguimiento: datos.fechaProximoSeguimiento || null,
        metodoComunicacion: datos.metodoComunicacion || 'whatsapp'
      },

      pagos: {
        montoTotal: datos.montoTotal || precioFinal,
        tipoAnticipo: datos.tipoAnticipo || '50',
        montoAnticipo: datos.montoAnticipo || 0,
        metodoPago: datos.metodoPago || 'transferencia',
        estadoPago: datos.estadoPago || 'pendiente',
        notas: datos.notasPago || ''
      },

      adjuntos: datos.adjuntos || [],
      recordatorios: datos.recordatorios || [],
      notas: datos.notas || '',
      versi: 1
    };
  }

  static calcularPrecioFinal(costosObj, margen) {
    if (!costosObj) return 0;
    const mates = typeof costosObj.materiales === 'object' ? (costosObj.materiales.total || 0) : (costosObj.materiales || 0);
    const suma = mates + (costosObj.manoObra || 0)
      + (costosObj.herramientas || 0) + (costosObj.transporte || 0)
      + (costosObj.subcontratos || 0);
    const m = margen != null ? margen : 40;
    return suma * (1 + m / 100);
  }

  static migrarPlanaANidada(c) {
    if (c.cliente && typeof c.cliente === 'object' && c.cliente.nombre !== undefined) {
      return c;
    }
    return this.crearDesdeFormulario({
      id: c.id,
      estado: c.estado,
      fechaCreacion: c.fechaCreacion,
      fechaEnvio: c.fechaEnvio,
      fechaAprobacion: c.fechaAprobacion,
      fechaProduccion: c.fechaProduccion,
      fechaFinalizacion: c.fechaFinalizacion,
      fechaArchivado: c.fechaArchivado,
      nombreCliente: c.cliente || '',
      telefono: c.telefono || '',
      direccionProyecto: c.direccion || '',
      nombreProyecto: c.proyecto || '',
      descripcionProyecto: c.descripcion || '',
      ancho: c.ancho || 0,
      alto: c.alto || 0,
      costoMateriales: typeof c.costos?.materiales === 'object' ? (c.costos.materiales.total || 0) : (c.costos?.materiales || 0),
      costoManoObra: c.costos?.manoObra || 0,
      margenGanancia: c.margen || 40,
      tiempoEstimadoDias: c.tiempoEntrega || 0,
      recordatorios: c.recordatorios || [],
      notas: c.notas || ''
    });
  }
}

window.CotizacionModel = CotizacionModel;
window.ESTADOS = ESTADOS;
window.FLUJO_ESTADOS = FLUJO_ESTADOS;