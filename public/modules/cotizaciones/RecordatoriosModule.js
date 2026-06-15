/**
 * RECORDATORIOS MODULE - Gestión de recordatorios y alertas automáticas
 * Responsabilidad: Crear, gestionar y ejecutar recordatorios automáticos
 */

class RecordatoriosModule {
  
  static STORAGE_KEY = 'vikingos_recordatorios';
  
  /**
   * Tipos de recordatorio disponibles
   */
  static TIPOS = {
    SEGUIMIENTO: 'seguimiento',
    ENTREGA: 'entrega',
    PAGO: 'pago',
    REVISION: 'revision',
    APROBACION: 'aprobacion',
    CUSTOM: 'custom'
  };

  /**
   * Obtener todos los recordatorios
   */
  static obtenerTodos() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Guardar recordatorio
   */
  static guardar(recordatorio) {
    const recordatorios = this.obtenerTodos();
    
    const rec = {
      id: recordatorio.id || Date.now(),
      cotizacionId: recordatorio.cotizacionId,
      tipo: recordatorio.tipo,
      titulo: recordatorio.titulo,
      descripcion: recordatorio.descripcion || '',
      fechaProgramada: recordatorio.fechaProgramada,
      completado: recordatorio.completado || false,
      creado: recordatorio.creado || new Date().toISOString()
    };

    const existe = recordatorios.findIndex(r => r.id === rec.id);
    if (existe >= 0) {
      recordatorios[existe] = rec;
    } else {
      recordatorios.push(rec);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recordatorios));
    return rec;
  }

  /**
   * Obtener recordatorios de una cotización
   */
  static obtenerPorCotizacion(cotizacionId) {
    const todos = this.obtenerTodos();
    return todos.filter(r => r.cotizacionId === cotizacionId && !r.completado);
  }

  /**
   * Marcar recordatorio como completado
   */
  static marcarCompletado(id) {
    const todos = this.obtenerTodos();
    const recordatorio = todos.find(r => r.id === id);
    
    if (recordatorio) {
      recordatorio.completado = true;
      recordatorio.completadoEn = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
      return true;
    }
    
    return false;
  }

  /**
   * Eliminar recordatorio
   */
  static eliminar(id) {
    let todos = this.obtenerTodos();
    todos = todos.filter(r => r.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    return true;
  }

  /**
   * Crear recordatorios automáticos para una cotización
   */
  static crearRecordatoriosAutomaticos(cotizacion) {
    const recordatorios = [];
    const ahora = new Date();

    // Recordatorio 1: Seguimiento si fue enviada
    if (cotizacion.estado === 'enviada' && cotizacion.fechaEnvio) {
      const fecha = new Date(cotizacion.fechaEnvio);
      fecha.setDate(fecha.getDate() + 3); // 3 días después de enviar

      recordatorios.push(this.guardar({
        cotizacionId: cotizacion.id,
        tipo: this.TIPOS.SEGUIMIENTO,
        titulo: 'Hacer seguimiento',
        descripcion: `Seguimiento a la cotización #${cotizacion.numero || cotizacion.id} enviada a ${this.obtenerNombreCliente(cotizacion.cliente)}`,
        fechaProgramada: fecha.toISOString()
      }));
    }

    // Recordatorio 2: Pago si fue aprobada
    if (cotizacion.estado === 'aprobada' && cotizacion.fechaAprobacion) {
      const fecha = new Date(cotizacion.fechaAprobacion);
      fecha.setDate(fecha.getDate() + 14); // 14 días para cobro

      recordatorios.push(this.guardar({
        cotizacionId: cotizacion.id,
        tipo: this.TIPOS.PAGO,
        titulo: 'Recordatorio de pago',
        descripcion: `Gestionar pago de cotización #${cotizacion.numero || cotizacion.id} - ${cotizacion.proyecto}`,
        fechaProgramada: fecha.toISOString()
      }));
    }

    // Recordatorio 3: Entrega si está en producción
    if (cotizacion.estado === 'produccion' && cotizacion.tiempoEntrega) {
      const fecha = new Date(cotizacion.fechaProduccion);
      fecha.setDate(fecha.getDate() + cotizacion.tiempoEntrega);

      recordatorios.push(this.guardar({
        cotizacionId: cotizacion.id,
        tipo: this.TIPOS.ENTREGA,
        titulo: 'Preparar para entrega',
        descripcion: `Cotización #${cotizacion.numero || cotizacion.id} lista para entregar a ${this.obtenerNombreCliente(cotizacion.cliente)}`,
        fechaProgramada: fecha.toISOString()
      }));
    }

    return recordatorios;
  }

  /**
   * Obtener recordatorios próximos (próximos 7 días)
   */
  static obtenerProximos(dias = 7) {
    const todos = this.obtenerTodos();
    const ahora = new Date();
    const futuro = new Date();
    futuro.setDate(futuro.getDate() + dias);

    return todos.filter(r => {
      if (r.completado) return false;
      
      const fecha = new Date(r.fechaProgramada);
      return fecha >= ahora && fecha <= futuro;
    }).sort((a, b) => new Date(a.fechaProgramada) - new Date(b.fechaProgramada));
  }

  /**
   * Obtener recordatorios vencidos
   */
  static obtenerVencidos() {
    const todos = this.obtenerTodos();
    const ahora = new Date();

    return todos.filter(r => {
      if (r.completado) return false;
      
      const fecha = new Date(r.fechaProgramada);
      return fecha < ahora;
    }).sort((a, b) => new Date(a.fechaProgramada) - new Date(b.fechaProgramada));
  }

  /**
   * Obtener nombre del cliente
   */
  static obtenerNombreCliente(cliente) {
    if (typeof cliente === 'object') {
      return cliente.nombre || 'Sin nombre';
    }
    return cliente || 'Sin nombre';
  }

  /**
   * Verificar y mostrar notificaciones
   */
  static verificarNotificaciones() {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission !== 'granted') {
      return;
    }

    const proximos = this.obtenerProximos(1); // Próximas 24 horas

    proximos.forEach(rec => {
      const titulo = '⏰ Recordatorio Vikingos';
      const opciones = {
        body: rec.titulo + ': ' + rec.descripcion,
        icon: '📌'
      };

      new Notification(titulo, opciones);
    });
  }

  /**
   * Solicitar permiso para notificaciones
   */
  static solicitarPermisoNotificaciones() {
    if (!('Notification' in window)) {
      console.log('Este navegador no soporta notificaciones');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          return true;
        }
      });
    }

    return false;
  }

  /**
   * Renderizar recordatorio en lista
   */
  static renderizarRecordatorio(recordatorio) {
    const fecha = new Date(recordatorio.fechaProgramada);
    const ahora = new Date();
    const vencido = fecha < ahora;
    const proximos = fecha.getTime() - ahora.getTime() < 24 * 60 * 60 * 1000; // Próximas 24h

    const claseEstado = vencido ? 'vencido' : proximos ? 'proximo' : '';

    return `
      <div class="recordatorio-item ${claseEstado}">
        <div class="recordatorio-header">
          <h4>${this.obtenerIconoTipo(recordatorio.tipo)} ${recordatorio.titulo}</h4>
          ${vencido ? '<span class="badge badge-danger">VENCIDO</span>' : ''}
          ${proximos && !vencido ? '<span class="badge badge-warning">PRÓXIMO</span>' : ''}
        </div>
        <p class="recordatorio-desc">${recordatorio.descripcion}</p>
        <div class="recordatorio-footer">
          <span class="recordatorio-fecha">📅 ${fecha.toLocaleString('es-CO')}</span>
          <button class="btn-icon" onclick="MarcarRecordatorioCompletado(${recordatorio.id})">✅</button>
          <button class="btn-icon" onclick="EliminarRecordatorio(${recordatorio.id})">🗑️</button>
        </div>
      </div>
    `;
  }

  /**
   * Obtener icono según tipo de recordatorio
   */
  static obtenerIconoTipo(tipo) {
    const iconos = {
      [this.TIPOS.SEGUIMIENTO]: '📞',
      [this.TIPOS.ENTREGA]: '📦',
      [this.TIPOS.PAGO]: '💰',
      [this.TIPOS.REVISION]: '👁️',
      [this.TIPOS.APROBACION]: '✅',
      [this.TIPOS.CUSTOM]: '📌'
    };

    return iconos[tipo] || '📌';
  }

  /**
   * Renderizar tabla de recordatorios próximos
   */
  static renderizarTablaProximos() {
    const proximos = this.obtenerProximos();
    const vencidos = this.obtenerVencidos();

    if (proximos.length === 0 && vencidos.length === 0) {
      return '<p>No hay recordatorios pendientes.</p>';
    }

    let html = '';

    if (vencidos.length > 0) {
      html += `
        <h3>⚠️ Vencidos (${vencidos.length})</h3>
        ${vencidos.map(r => this.renderizarRecordatorio(r)).join('')}
      `;
    }

    if (proximos.length > 0) {
      html += `
        <h3>⏰ Próximos (${proximos.length})</h3>
        ${proximos.map(r => this.renderizarRecordatorio(r)).join('')}
      `;
    }

    return html;
  }
}
