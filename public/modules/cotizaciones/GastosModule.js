/**
 * GASTOS MODULE - Gestión de gastos y margen de ganancia
 * Responsabilidad: Cálculos de overhead, margen, gastos adicionales
 */

class GastosModule {
  
  /**
   * Calcular overhead (gastos indirectos)
   */
  static calcularOverhead(subtotal, porcentajeOverhead = 15) {
    const sub = parseFloat(subtotal) || 0;
    const porc = parseFloat(porcentajeOverhead) || 15;
    return sub * (porc / 100);
  }

  /**
   * Calcular margen de ganancia
   */
  static calcularMargen(subtotalConOverhead, porcentajeMargen = 30) {
    const base = parseFloat(subtotalConOverhead) || 0;
    const porc = parseFloat(porcentajeMargen) || 30;
    return base * (porc / 100);
  }

  /**
   * Calcular precio final
   */
  static calcularPrecioFinal(materiales, manoObra, overhead = 15, margen = 30, gastosAdicionales = 0) {
    const mat = parseFloat(materiales) || 0;
    const lab = parseFloat(manoObra) || 0;
    const subtotal = mat + lab;
    const ovMonto = this.calcularOverhead(subtotal, overhead);
    const base = subtotal + ovMonto;
    const mrgMonto = this.calcularMargen(base, margen);
    const gastos = parseFloat(gastosAdicionales) || 0;
    
    return {
      materiales: mat,
      manoObra: lab,
      subtotal: subtotal,
      overhead: overhead,
      overheadMonto: ovMonto,
      subtotalConOverhead: base,
      margen: margen,
      margenMonto: mrgMonto,
      gastosAdicionales: gastos,
      total: base + mrgMonto + gastos
    };
  }

  /**
   * Obtener tipos de gastos adicionales
   */
  static obtenerTiposGastos() {
    return [
      { id: 'transporte', nombre: 'Transporte', icon: '🚚' },
      { id: 'entrega', nombre: 'Entrega', icon: '📦' },
      { id: 'instalacion', nombre: 'Instalación', icon: '🔧' },
      { id: 'permisos', nombre: 'Permisos/Trámites', icon: '📋' },
      { id: 'seguros', nombre: 'Seguros', icon: '🛡️' },
      { id: 'imprevistos', nombre: 'Imprevistos', icon: '⚠️' },
      { id: 'otro', nombre: 'Otro', icon: '📝' }
    ];
  }

  /**
   * Validar porcentaje
   */
  static validarPorcentaje(valor) {
    const num = parseFloat(valor);
    return !isNaN(num) && num >= 0 && num <= 100;
  }

  /**
   * Obtener gamas de margen por categoría
   */
  static obtenerGamasMargen() {
    return {
      bajo: { min: 15, max: 25, descripcion: 'Bajo (15-25%)' },
      medio: { min: 25, max: 40, descripcion: 'Medio (25-40%)' },
      alto: { min: 40, max: 60, descripcion: 'Alto (40-60%)' },
      premium: { min: 60, max: 100, descripcion: 'Premium (60%+)' }
    };
  }

  /**
   * Recomendar margen según tipo de proyecto
   */
  static recomendarMargen(tipoProyecto) {
    const recomendaciones = {
      mueble_personalizado: 40,
      producto_estandar: 35,
      proyecto_grande: 30,
      servicio_instalacion: 25,
      reparacion: 35,
      otro: 30
    };
    
    return recomendaciones[tipoProyecto] || 30;
  }

  /**
   * Calcular precio por cantidad (descuentos)
   */
  static calcularDescuento(precioBruto, porcentajeDescuento = 0) {
    const precio = parseFloat(precioBruto) || 0;
    const desc = parseFloat(porcentajeDescuento) || 0;
    
    if (desc < 0 || desc > 100) {
      return { precio, descuento: 0, precioFinal: precio };
    }
    
    const montoDesc = precio * (desc / 100);
    return {
      precio: precio,
      descuento: montoDesc,
      precioFinal: precio - montoDesc
    };
  }

  /**
   * Renderizar resumen de costos
   */
  static renderizarResumenCostos(cotizacion) {
    const costos = cotizacion.costos || {};
    
    return `
      <div class="costos-resumen">
        <div class="costo-item">
          <span class="costo-label">Materiales:</span>
          <span class="costo-valor">${QuotationUtils.formatCurrency(costos.materiales || 0)}</span>
        </div>
        <div class="costo-item">
          <span class="costo-label">Mano de Obra:</span>
          <span class="costo-valor">${QuotationUtils.formatCurrency(costos.manoObra || 0)}</span>
        </div>
        <div class="costo-item">
          <span class="costo-label">Subtotal:</span>
          <span class="costo-valor">${QuotationUtils.formatCurrency(costos.subtotal || 0)}</span>
        </div>
        <div class="costo-item border">
          <span class="costo-label">Overhead (${cotizacion.overhead || 15}%):</span>
          <span class="costo-valor">${QuotationUtils.formatCurrency(costos.overheadMonto || 0)}</span>
        </div>
        <div class="costo-item">
          <span class="costo-label">Margen (${cotizacion.margen || 30}%):</span>
          <span class="costo-valor">${QuotationUtils.formatCurrency(costos.margenMonto || 0)}</span>
        </div>
        ${cotizacion.gastosAdicionales > 0 ? `
          <div class="costo-item">
            <span class="costo-label">Gastos Adicionales:</span>
            <span class="costo-valor">${QuotationUtils.formatCurrency(cotizacion.gastosAdicionales)}</span>
          </div>
        ` : ''}
        <div class="costo-item total">
          <span class="costo-label">TOTAL:</span>
          <span class="costo-valor">${QuotationUtils.formatCurrency(costos.total || 0)}</span>
        </div>
      </div>
    `;
  }

  /**
   * Comparar diferentes escenarios de margen
   */
  static compararEscenarios(subtotal, overhead = 15) {
    const base = subtotal + this.calcularOverhead(subtotal, overhead);
    
    return {
      bajo: {
        margen: 15,
        margenMonto: this.calcularMargen(base, 15),
        total: base + this.calcularMargen(base, 15)
      },
      medio: {
        margen: 30,
        margenMonto: this.calcularMargen(base, 30),
        total: base + this.calcularMargen(base, 30)
      },
      alto: {
        margen: 50,
        margenMonto: this.calcularMargen(base, 50),
        total: base + this.calcularMargen(base, 50)
      }
    };
  }

  /**
   * Renderizar tabla de escenarios
   */
  static renderizarTablasEscenarios(subtotal, overhead = 15) {
    const escenarios = this.compararEscenarios(subtotal, overhead);
    
    return `
      <table class="escenarios-table">
        <thead>
          <tr>
            <th>Escenario</th>
            <th>Margen %</th>
            <th>Monto Margen</th>
            <th>Precio Final</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bajo</td>
            <td>${escenarios.bajo.margen}%</td>
            <td>${QuotationUtils.formatCurrency(escenarios.bajo.margenMonto)}</td>
            <td><strong>${QuotationUtils.formatCurrency(escenarios.bajo.total)}</strong></td>
          </tr>
          <tr class="highlight">
            <td>Medio (Recomendado)</td>
            <td>${escenarios.medio.margen}%</td>
            <td>${QuotationUtils.formatCurrency(escenarios.medio.margenMonto)}</td>
            <td><strong>${QuotationUtils.formatCurrency(escenarios.medio.total)}</strong></td>
          </tr>
          <tr>
            <td>Alto</td>
            <td>${escenarios.alto.margen}%</td>
            <td>${QuotationUtils.formatCurrency(escenarios.alto.margenMonto)}</td>
            <td><strong>${QuotationUtils.formatCurrency(escenarios.alto.total)}</strong></td>
          </tr>
        </tbody>
      </table>
    `;
  }
}
