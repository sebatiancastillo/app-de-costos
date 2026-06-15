/**
 * DASHBOARD VIEW - Módulo de visualización del dashboard
 * Responsabilidad: Renderizar componentes del dashboard, gráficos y actualizaciones
 */

class DashboardView {
  
  constructor() {
    this.chartInstance = null;
    this.initializarGrafico();
  }

  /**
   * Inicializar gráfico de estados (requiere Chart.js)
   */
  initializarGrafico() {
    // Si Chart.js no está disponible, usar alternativa simple
    if (typeof Chart === 'undefined') {
      this.crearGraficoCSS();
    } else {
      this.crearGraficoChart();
    }
  }

  /**
   * Crear gráfico con CSS (fallback)
   */
  crearGraficoCSS() {
    const chartContainer = document.getElementById('chartContainer');
    if (!chartContainer) return;

    const stats = CotizacionController.obtenerEstadisticas();
    const porEstado = stats.porEstado || {};

    const html = `
      <div class="css-chart">
        ${Object.entries(porEstado).map(([estado, cantidad]) => {
          const config = ESTADOS[estado?.toUpperCase()] || {};
          const porcentaje = stats.total > 0 ? Math.round((cantidad / stats.total) * 100) : 0;
          
          return `
            <div class="chart-item">
              <div class="chart-label">
                <span class="chart-icon">${config.icon}</span>
                <span class="chart-name">${config.label}</span>
              </div>
              <div class="chart-bar-container">
                <div class="chart-bar" style="width: ${porcentaje}%; background-color: ${config.color}">
                  <span class="chart-percentage">${porcentaje}%</span>
                </div>
              </div>
              <span class="chart-count">${cantidad}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;

    chartContainer.innerHTML = html;
  }

  /**
   * Crear gráfico con Chart.js
   */
  crearGraficoChart() {
    const stats = CotizacionController.obtenerEstadisticas();
    const porEstado = stats.porEstado || {};

    const labels = [];
    const data = [];
    const colors = [];

    Object.entries(porEstado).forEach(([estado, cantidad]) => {
      const config = ESTADOS[estado?.toUpperCase()] || {};
      labels.push(`${config.icon} ${config.label}`);
      data.push(cantidad);
      colors.push(config.color);
    });

    const canvas = document.getElementById('estadosChart');
    if (!canvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    this.chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: 'white',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 12,
                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
              },
              color: '#2c3e50',
              padding: 15
            }
          }
        }
      }
    });
  }

  /**
   * Actualizar dashboard completo
   */
  actualizarDashboard(cotizaciones) {
    this.actualizarEstadisticas(cotizaciones);
    this.actualizarGrafico();
    this.actualizarAlertas(cotizaciones);
  }

  /**
   * Actualizar estadísticas
   */
  actualizarEstadisticas(cotizaciones) {
    const total = cotizaciones.length;
    const monto = cotizaciones.reduce((sum, q) => sum + (q.costos?.total || 0), 0);
    const aprobadas = cotizaciones.filter(q => q.estado === 'aprobada').length;
    const pendientes = cotizaciones.filter(q => q.estado === 'pendiente').length;
    const produccion = cotizaciones.filter(q => q.estado === 'produccion').length;
    const margenProm = cotizaciones.length > 0
      ? Math.round(cotizaciones.reduce((sum, q) => sum + (q.margen || 30), 0) / total)
      : 0;

    this.actualizarElemento('stat-total', total);
    this.actualizarElemento('stat-monto', QuotationUtils.formatCurrency(monto));
    this.actualizarElemento('stat-aprobadas', aprobadas);
    this.actualizarElemento('stat-pendientes', pendientes);
    this.actualizarElemento('stat-produccion', produccion);
    this.actualizarElemento('stat-margen', margenProm + '%');
  }

  /**
   * Actualizar elemento del DOM
   */
  actualizarElemento(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = valor;
    }
  }

  /**
   * Actualizar gráfico
   */
  actualizarGrafico() {
    if (typeof Chart !== 'undefined') {
      this.crearGraficoChart();
    } else {
      this.crearGraficoCSS();
    }
  }

  /**
   * Actualizar alertas y recordatorios
   */
  actualizarAlertas(cotizaciones) {
    const alertas = this.generarAlertas(cotizaciones);
    const alertsSection = document.getElementById('alertsSection');
    const alertsContainer = document.getElementById('alertsContainer');

    if (alertas.length > 0) {
      alertsSection.style.display = 'block';
      alertsContainer.innerHTML = alertas.map(a => `
        <div class="alert alert-${a.tipo}">
          <strong>${a.titulo}:</strong> ${a.mensaje}
        </div>
      `).join('');
    } else {
      alertsSection.style.display = 'none';
    }
  }

  /**
   * Generar alertas según reglas de negocio
   */
  generarAlertas(cotizaciones) {
    const alertas = [];
    const ahora = new Date();

    cotizaciones.forEach(q => {
      // Alerta: Cotización enviada hace más de 3 días
      if (q.estado === 'enviada' && q.fechaEnvio) {
        const diasEnviada = Math.floor((ahora - new Date(q.fechaEnvio)) / (1000 * 60 * 60 * 24));
        if (diasEnviada > 3) {
          alertas.push({
            tipo: 'info',
            titulo: 'Seguimiento',
            mensaje: `Cotización #${q.numero || q.id} a ${this.obtenerNombreCliente(q.cliente)} hace ${diasEnviada} días. Considera hacer seguimiento.`
          });
        }
      }

      // Alerta: Cotización pendiente antigua
      if (q.estado === 'pendiente') {
        const diasPendiente = Math.floor((ahora - new Date(q.fechaCreacion)) / (1000 * 60 * 60 * 24));
        if (diasPendiente > 7) {
          alertas.push({
            tipo: 'warning',
            titulo: 'Acción requerida',
            mensaje: `Cotización #${q.numero || q.id} pendiente desde hace ${diasPendiente} días. Considera completarla o cancelarla.`
          });
        }
      }

      // Alerta: Cotización aprobada lista para producción
      if (q.estado === 'aprobada') {
        const diasAprobada = Math.floor((ahora - new Date(q.fechaAprobacion)) / (1000 * 60 * 60 * 24));
        if (diasAprobada > 1) {
          alertas.push({
            tipo: 'success',
            titulo: 'Lista para producción',
            mensaje: `Cotización #${q.numero || q.id} aprobada. ¿Listo para mover a producción?`
          });
        }
      }

      // Alerta: Cotización sin cliente
      if (!this.obtenerNombreCliente(q.cliente) || this.obtenerNombreCliente(q.cliente) === 'Sin nombre') {
        alertas.push({
          tipo: 'warning',
          titulo: 'Datos incompletos',
          mensaje: `Cotización #${q.numero || q.id} sin cliente asignado.`
        });
      }

      // Alerta: Cotización sin monto
      if (!q.costos?.total || q.costos.total === 0) {
        alertas.push({
          tipo: 'danger',
          titulo: 'Cálculo incompleto',
          mensaje: `Cotización #${q.numero || q.id} sin monto total calculado.`
        });
      }
    });

    // Limitar a las 5 primeras alertas
    return alertas.slice(0, 5);
  }

  /**
   * Obtener nombre del cliente
   */
  obtenerNombreCliente(cliente) {
    if (typeof cliente === 'object') {
      return cliente.nombre || 'Sin nombre';
    }
    return cliente || 'Sin nombre';
  }

  /**
   * Renderizar fila de tabla
   */
  renderizarFilaCotizacion(cotizacion) {
    const estadoConfig = ESTADOS[cotizacion.estado?.toUpperCase()] || ESTADOS.PENDIENTE;
    const fecha = QuotationUtils.formatDateShort(cotizacion.fechaCreacion);
    const monto = QuotationUtils.formatCurrency(cotizacion.costos?.total || 0);
    const cliente = this.obtenerNombreCliente(cotizacion.cliente);
    const numero = cotizacion.numero || `#${cotizacion.id}`;

    return `
      <tr class="cotizacion-row" data-id="${cotizacion.id}">
        <td><strong>${numero}</strong></td>
        <td>${cliente}</td>
        <td>${cotizacion.proyecto || '—'}</td>
        <td>${monto}</td>
        <td>
          <span class="badge badge-${estadoConfig.id}">
            ${estadoConfig.icon} ${estadoConfig.label}
          </span>
        </td>
        <td>${fecha}</td>
        <td>
          <div class="actions">
            <button class="btn-icon" onclick="verDetalles(${cotizacion.id})" title="Ver">👁️</button>
            <button class="btn-icon" onclick="editarCotizacion(${cotizacion.id})" title="Editar">✏️</button>
            <button class="btn-icon" onclick="cambiarEstado(${cotizacion.id})" title="Estado">↔️</button>
            <button class="btn-icon" onclick="eliminarCotizacion(${cotizacion.id})" title="Eliminar">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }

  /**
   * Mostrar modal de detalles
   */
  mostrarDetalles(cotizacion) {
    if (!cotizacion) return;

    const cliente = this.obtenerNombreCliente(cotizacion.cliente);
    const estadoConfig = ESTADOS[cotizacion.estado?.toUpperCase()] || ESTADOS.PENDIENTE;
    const materiales = cotizacion.materiales?.map(m => `
      <tr>
        <td>${m.nombre}</td>
        <td>${m.cantidad}</td>
        <td>${QuotationUtils.formatCurrency(m.precio)}</td>
        <td>${QuotationUtils.formatCurrency(m.cantidad * m.precio)}</td>
      </tr>
    `).join('') || '<tr><td colspan="4">Sin materiales</td></tr>';

    const html = `
      <div class="detalles-cotizacion">
        <div class="detalles-row">
          <div class="detalles-col">
            <h3>Información General</h3>
            <p><strong>Número:</strong> ${cotizacion.numero || `#${cotizacion.id}`}</p>
            <p><strong>Cliente:</strong> ${cliente}</p>
            <p><strong>Proyecto:</strong> ${cotizacion.proyecto || '—'}</p>
            <p><strong>Estado:</strong> <span class="badge badge-${estadoConfig.id}">${estadoConfig.icon} ${estadoConfig.label}</span></p>
          </div>
          <div class="detalles-col">
            <h3>Fechas</h3>
            <p><strong>Creada:</strong> ${QuotationUtils.formatDate(cotizacion.fechaCreacion)}</p>
            <p><strong>Actualizada:</strong> ${QuotationUtils.formatDate(cotizacion.fechaActualizacion)}</p>
            <p><strong>Enviada:</strong> ${cotizacion.fechaEnvio ? QuotationUtils.formatDate(cotizacion.fechaEnvio) : '—'}</p>
          </div>
        </div>

        <h3>Materiales</h3>
        <table class="detalles-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${materiales}
          </tbody>
        </table>

        <h3>Cálculo de Costos</h3>
        <div class="costos-detalle">
          <div class="costo-row">
            <span>Materiales:</span>
            <strong>${QuotationUtils.formatCurrency(cotizacion.costos?.materiales || 0)}</strong>
          </div>
          <div class="costo-row">
            <span>Mano de Obra:</span>
            <strong>${QuotationUtils.formatCurrency(cotizacion.costos?.manoObra || 0)}</strong>
          </div>
          <div class="costo-row">
            <span>Overhead (${cotizacion.overhead || 15}%):</span>
            <strong>${QuotationUtils.formatCurrency(cotizacion.costos?.overheadMonto || 0)}</strong>
          </div>
          <div class="costo-row border-top">
            <span>Subtotal:</span>
            <strong>${QuotationUtils.formatCurrency(cotizacion.costos?.subtotal + (cotizacion.costos?.overheadMonto || 0) || 0)}</strong>
          </div>
          <div class="costo-row">
            <span>Margen (${cotizacion.margen || 30}%):</span>
            <strong>${QuotationUtils.formatCurrency(cotizacion.costos?.margenMonto || 0)}</strong>
          </div>
          <div class="costo-row border-top total">
            <span>TOTAL:</span>
            <strong>${QuotationUtils.formatCurrency(cotizacion.costos?.total || 0)}</strong>
          </div>
        </div>

        ${cotizacion.notas ? `<div class="notas-section"><h3>Notas</h3><p>${cotizacion.notas}</p></div>` : ''}
      </div>
    `;

    return html;
  }

  /**
   * Mostrar opciones de cambio de estado
   */
  mostrarCambioEstado(cotizacion) {
    if (!cotizacion) return '';

    const estadosPermitidos = FLUJO_ESTADOS[cotizacion.estado] || [];

    if (estadosPermitidos.length === 0) {
      return '<p>Esta cotización no puede cambiar de estado.</p>';
    }

    const opcionesHTML = estadosPermitidos.map(estado => {
      const config = ESTADOS[estado?.toUpperCase()] || {};
      return `
        <button class="btn btn-block" onclick="confirmarCambioEstado(${cotizacion.id}, '${estado}')">
          ${config.icon} Cambiar a ${config.label}
        </button>
      `;
    }).join('');

    return opcionesHTML;
  }
}

// Instancia global
const dashboardView = new DashboardView();
