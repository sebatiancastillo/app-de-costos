// ═══════════════════════════════════════════════════════════════
// CONTROLADOR: CotizacionController.js - Lógica de negocio
// ═══════════════════════════════════════════════════════════════

class CotizacionController {
  static STORAGE_KEY = 'vikingos_cotizaciones';

  static obtenerTodos() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static guardarTodos(cotizaciones) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cotizaciones));
  }

  static obtenerPorId(id) {
    const todas = this.obtenerTodos();
    return todas.find(c => c.id == id) || null;
  }

  static crear(datosFormulario) {
    const costos = CotizacionModel.calcularCostos(datosFormulario);
    const cotizacion = CotizacionModel.crear({
      ...datosFormulario,
      costos
    });

    const errores = CotizacionModel.validar(cotizacion);
    if (errores.length > 0) {
      return { success: false, errores };
    }

    const todas = this.obtenerTodos();
    todas.unshift(cotizacion);
    this.guardarTodos(todas);

    return { success: true, data: cotizacion };
  }

  static actualizar(id, nuevosDatos) {
    const todas = this.obtenerTodos();
    const idx = todas.findIndex(c => c.id == id);
    
    if (idx === -1) {
      return { success: false, error: 'Cotización no encontrada' };
    }

    const original = todas[idx];
    if (!CotizacionModel.puedeEditar(original)) {
      return { success: false, error: 'No se puede editar esta cotización en su estado actual' };
    }

    const costos = CotizacionModel.calcularCostos(nuevosDatos);
    const actualizada = {
      ...original,
      ...nuevosDatos,
      costos,
      versi: original.versi + 1,
      fechaActualizacion: new Date().toISOString()
    };

    const errores = CotizacionModel.validar(actualizada);
    if (errores.length > 0) {
      return { success: false, errores };
    }

    todas[idx] = actualizada;
    this.guardarTodos(todas);

    return { success: true, data: actualizada };
  }

  static cambiarEstado(id, nuevoEstado) {
    const todas = this.obtenerTodos();
    const idx = todas.findIndex(c => c.id == id);
    
    if (idx === -1) {
      return { success: false, error: 'Cotización no encontrada' };
    }

    const cotizacion = todas[idx];
    if (!CotizacionModel.puedeTransicionar(cotizacion.estado, nuevoEstado)) {
      return { success: false, error: `No se puede cambiar de ${cotizacion.estado} a ${nuevoEstado}` };
    }

    const now = new Date().toISOString();
    cotizacion.estado = nuevoEstado;
    cotizacion.fechaActualizacion = now;

    switch (nuevoEstado) {
      case 'enviada': cotizacion.fechaEnvio = now; break;
      case 'aprobada': cotizacion.fechaAprobacion = now; break;
      case 'produccion': cotizacion.fechaProduccion = now; break;
      case 'finalizada': cotizacion.fechaFinalizacion = now; break;
      case 'archivada': cotizacion.fechaArchivado = now; break;
    }

    this.guardarTodos(todas);
    return { success: true, data: cotizacion };
  }

  static eliminar(id) {
    const todas = this.obtenerTodos();
    const filtradas = todas.filter(c => c.id != id);
    
    if (filtradas.length === todas.length) {
      return { success: false, error: 'Cotización no encontrada' };
    }

    this.guardarTodos(filtradas);
    return { success: true };
  }

  static filtrar(criterios = {}) {
    const todas = this.obtenerTodos();
    
    return todas.filter(c => {
      if (criterios.estado && c.estado !== criterios.estado) return false;
      if (criterios.cliente) {
        const search = criterios.cliente.toLowerCase();
        if (!c.cliente.toLowerCase().includes(search)) return false;
      }
      if (criterios.categoria && c.categoria !== criterios.categoria) return false;
      
      if (criterios.fechaDesde) {
        const fechaCotiz = new Date(c.fechaCreacion);
        const desde = new Date(criterios.fechaDesde);
        if (fechaCotiz < desde) return false;
      }
      if (criterios.fechaHasta) {
        const fechaCotiz = new Date(c.fechaCreacion);
        const hasta = new Date(criterios.fechaHasta);
        if (fechaCotiz > hasta) return false;
      }
      
      if (criterios.minTotal && c.costos?.total < criterios.minTotal) return false;
      if (criterios.maxTotal && c.costos?.total > criterios.maxTotal) return false;
      
      return true;
    });
  }

  static obtenerEstadisticas() {
    const todas = this.obtenerTodos();
    
    const porEstado = {};
    Object.keys(ESTADOS).forEach(key => {
      porEstado[ESTADOS[key].id] = 0;
    });
    
    let totalMonto = 0;
    let count = 0;

    todas.forEach(c => {
      porEstado[c.estado] = (porEstado[c.estado] || 0) + 1;
      totalMonto += c.costos?.total || 0;
      count++;
    });

    return {
      total: todas.length,
      porEstado,
      promedioMonto: count > 0 ? totalMonto / count : 0,
      totalMonto
    };
  }

  static agregarRecordatorio(id, recordatorio) {
    const todas = this.obtenerTodos();
    const idx = todas.findIndex(c => c.id == id);
    
    if (idx === -1) return { success: false, error: 'No encontrada' };

    const rec = {
      id: Date.now(),
      ...recordatorio,
      creado: new Date().toISOString()
    };

    todas[idx].recordatorios = todas[idx].recordatorios || [];
    todas[idx].recordatorios.push(rec);
    todas[idx].fechaActualizacion = new Date().toISOString();

    this.guardarTodos(todas);
    return { success: true, data: rec };
  }

  static obtenerAlertas() {
    const todas = this.obtenerTodos();
    const ahora = new Date();
    const alertas = [];

    todas.forEach(c => {
      if (c.estado === 'enviada') {
        const diasSinRespuesta = Math.floor((ahora - new Date(c.fechaEnvio)) / (1000 * 60 * 60 * 24));
        if (diasSinRespuesta >= 3) {
          alertas.push({
            tipo: 'warning',
            titulo: 'Cotización sin respuesta',
            mensaje: `${c.proyecto} enviada hace ${diasSinRespuesta} días`,
            cotizacionId: c.id
          });
        }
      }

      if (c.estado === 'aprobada' && !c.fechaProduccion) {
        const diasAprobada = Math.floor((ahora - new Date(c.fechaAprobacion)) / (1000 * 60 * 60 * 24));
        if (diasAprobada >= 2) {
          alertas.push({
            tipo: 'info',
            titulo: 'Pendiente iniciar producción',
            mensaje: `${c.proyecto} aprobada hace ${diasAprobada} días`,
            cotizacionId: c.id
          });
        }
      }

      (c.recordatorios || []).forEach(r => {
        if (!r.completado && new Date(r.fecha) <= ahora) {
          alertas.push({
            tipo: 'recordatorio',
            titulo: r.titulo || 'Recordatorio',
            mensaje: `${c.proyecto}: ${r.nota}`,
            cotizacionId: c.id
          });
        }
      });
    });

    return alertas.sort((a, b) => {
      const prio = { warning: 0, info: 1, recordatorio: 2 };
      return prio[a.tipo] - prio[b.tipo];
    });
  }

  static duplicar(id) {
    const original = this.obtenerPorId(id);
    if (!original) return { success: false, error: 'No encontrada' };

    const copia = CotizacionModel.crear({
      ...original,
      id: Date.now(),
      proyecto: `${original.proyecto} (Copia)`,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    });
    copia.recordatorios = [];

    const todas = this.obtenerTodos();
    todas.unshift(copia);
    this.guardarTodos(todas);

    return { success: true, data: copia };
  }

  static migrarDesdeLegacy() {
    const legacy = localStorage.getItem('cotipro_proyectos');
    if (!legacy) return { success: true, migradas: 0 };

    const proyectos = JSON.parse(legacy);
    const existentes = this.obtenerTodos();

    const nuevas = proyectos.map(p => CotizacionModel.crear({
      id: p.id,
      projectName: p.projectName,
      client: p.client,
      description: p.description,
      category: p.category,
      size: p.size,
      width: p.width,
      height: p.height,
      depth: p.depth,
      color: p.color,
      colorName: p.colorName,
      deliveryDays: p.deliveryDays,
      laborHours: p.laborHours,
      laborRate: p.laborRate,
      overhead: p.overhead,
      margin: p.margin,
      estado: 'pendiente'
    }));

    const combinadas = [...nuevas, ...existentes];
    this.guardarTodos(combinadas);
    localStorage.removeItem('cotipro_proyectos');

    return { success: true, migradas: nuevas.length };
  }
}

window.CotizacionController = CotizacionController;