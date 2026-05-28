/**
 * CONTROLLER.JS — Lógica de negocio y cálculos
 * Responsabilidad: Orquestar operaciones entre Model, Storage y View
 */

class QuotationController {
  constructor(model, storage) {
    this.model = model;
    this.storage = storage;
  }

  /**
   * Crear nueva cotización desde formulario
   */
  createQuotation(formData) {
    const newQuotation = this.model.createNewQuotation(formData);
    this.model.addQuotation(newQuotation);
    this.storage.saveQuotation(newQuotation);
    return newQuotation;
  }

  /**
   * Guardar cotización (crear o actualizar)
   */
  saveQuotation(quotationId, updatedData) {
    let quotation;
    
    if (quotationId) {
      quotation = this.model.updateQuotation(quotationId, updatedData);
    } else {
      quotation = this.createQuotation(updatedData);
    }
    
    this.storage.saveQuotation(quotation);
    return quotation;
  }

  /**
   * Obtener cotización por ID
   */
  getQuotation(id) {
    return this.model.getQuotation(id);
  }

  /**
   * Obtener todas las cotizaciones
   */
  getAllQuotations() {
    return this.model.getAllQuotations();
  }

  /**
   * Eliminar cotización
   */
  deleteQuotation(id) {
    this.model.deleteQuotation(id);
    this.storage.deleteQuotation(id);
  }

  /**
   * Agregar item a cotización
   */
  addItem(quotationId, itemData) {
    const item = this.model.addItem(quotationId, itemData);
    const quotation = this.model.getQuotation(quotationId);
    this.recalculateFinancials(quotationId);
    this.storage.saveQuotation(quotation);
    return item;
  }

  /**
   * Actualizar item en cotización
   */
  updateItem(quotationId, itemId, itemData) {
    const item = this.model.updateItem(quotationId, itemId, itemData);
    const quotation = this.model.getQuotation(quotationId);
    this.recalculateFinancials(quotationId);
    this.storage.saveQuotation(quotation);
    return item;
  }

  /**
   * Eliminar item de cotización
   */
  deleteItem(quotationId, itemId) {
    this.model.deleteItem(quotationId, itemId);
    const quotation = this.model.getQuotation(quotationId);
    this.recalculateFinancials(quotationId);
    this.storage.saveQuotation(quotation);
  }

  /**
   * Recalcular todos los valores financieros de la cotización
   */
  recalculateFinancials(quotationId) {
    const quotation = this.model.getQuotation(quotationId);
    if (!quotation) throw new Error('Cotización no encontrada');

    const financials = quotation.financials;

    // 1. Subtotal (suma de todos los items)
    financials.subtotal = quotation.items.reduce((sum, item) => sum + item.amount, 0);

    // 2. Descuento
    financials.discountAmount = financials.subtotal * (financials.discountPercentage / 100);
    const subtotalAfterDiscount = financials.subtotal - financials.discountAmount;

    // 3. Overhead (gastos indirectos sobre subtotal)
    financials.overheadAmount = subtotalAfterDiscount * (financials.overheadPercentage / 100);

    // 4. Margen de ganancia (sobre subtotal + overhead)
    const baseForMargin = subtotalAfterDiscount + financials.overheadAmount;
    financials.marginAmount = baseForMargin * (financials.marginPercentage / 100);

    // 5. Subtotal con margen
    const subtotalWithMargin = subtotalAfterDiscount + financials.overheadAmount + financials.marginAmount;

    // 6. Impuesto (sobre el subtotal con margen)
    financials.taxAmount = subtotalWithMargin * (financials.taxPercentage / 100);

    // 7. Total
    financials.total = subtotalWithMargin + financials.taxAmount;

    return financials;
  }

  /**
   * Actualizar porcentajes y recalcular
   */
  updateFinancialPercentages(quotationId, percentages) {
    const quotation = this.model.getQuotation(quotationId);
    if (!quotation) throw new Error('Cotización no encontrada');

    if (typeof percentages.taxPercentage !== 'undefined') {
      quotation.financials.taxPercentage = parseFloat(percentages.taxPercentage);
    }
    if (typeof percentages.discountPercentage !== 'undefined') {
      quotation.financials.discountPercentage = parseFloat(percentages.discountPercentage);
    }
    if (typeof percentages.overheadPercentage !== 'undefined') {
      quotation.financials.overheadPercentage = parseFloat(percentages.overheadPercentage);
    }
    if (typeof percentages.marginPercentage !== 'undefined') {
      quotation.financials.marginPercentage = parseFloat(percentages.marginPercentage);
    }

    this.recalculateFinancials(quotationId);
    this.storage.saveQuotation(quotation);
    return quotation.financials;
  }

  /**
   * Cambiar estado de cotización
   */
  changeStatus(quotationId, newStatus) {
    const quotation = this.model.changeStatus(quotationId, newStatus);
    this.storage.saveQuotation(quotation);
    return quotation;
  }

  /**
   * Obtener cotizaciones con filtros
   */
  getFilteredQuotations(criteria) {
    return this.model.filterQuotations(criteria);
  }

  /**
   * Generar PDF de cotización (estructura data para renderizar)
   */
  generatePDFData(quotationId) {
    const quotation = this.model.getQuotation(quotationId);
    if (!quotation) throw new Error('Cotización no encontrada');

    return {
      estimateNumber: quotation.estimateNumber,
      createdDate: quotation.createdDate,
      client: quotation.client,
      project: quotation.project,
      items: quotation.items,
      financials: quotation.financials,
      notes: quotation.notes,
      terms: quotation.terms,
      authorizedBy: quotation.authorizedBy
    };
  }

  /**
   * Duplicar una cotización
   */
  duplicateQuotation(quotationId) {
    const original = this.model.getQuotation(quotationId);
    if (!original) throw new Error('Cotización no encontrada');

    const duplicate = JSON.parse(JSON.stringify(original));
    duplicate.id = this.model.currentId++;
    duplicate.estimateNumber = `#${String(this.model.currentId - 1).padStart(3, '0')}`;
    duplicate.createdDate = new Date().toISOString();
    duplicate.updatedDate = new Date().toISOString();
    duplicate.status = 'pending';

    this.model.addQuotation(duplicate);
    this.storage.saveQuotation(duplicate);
    return duplicate;
  }

  /**
   * Cargar todas las cotizaciones desde storage
   */
  loadAllFromStorage() {
    const quotations = this.storage.getAllQuotations();
    this.model.quotations = quotations;
    if (quotations.length > 0) {
      this.model.currentId = Math.max(...quotations.map(q => q.id)) + 1;
    }
    return quotations;
  }

  /**
   * Exportar cotización como JSON
   */
  exportAsJSON(quotationId) {
    const quotation = this.model.getQuotation(quotationId);
    if (!quotation) throw new Error('Cotización no encontrada');
    
    return JSON.stringify(quotation, null, 2);
  }

  /**
   * Importar cotización desde JSON
   */
  importFromJSON(jsonString) {
    try {
      const quotation = JSON.parse(jsonString);
      quotation.id = this.model.currentId++;
      this.model.addQuotation(quotation);
      this.storage.saveQuotation(quotation);
      return quotation;
    } catch (error) {
      throw new Error('JSON inválido: ' + error.message);
    }
  }
}

// Exportar como módulo global
window.QuotationController = QuotationController;
