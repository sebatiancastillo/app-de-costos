/**
 * MODEL.JS — Gestión de datos y entidades de Cotizaciones
 * Responsabilidad: Definir la estructura de datos, validaciones y operaciones CRUD básicas
 */

class QuotationModel {
  constructor() {
    this.quotations = [];
    this.currentId = 1;
  }

  /**
   * Estructura de una cotización
   */
  createNewQuotation(data = {}) {
    return {
      id: this.currentId++,
      estimateNumber: `#${String(this.currentId).padStart(3, '0')}`,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      
      // Información del cliente
      client: {
        name: data.clientName || '',
        email: data.clientEmail || '',
        phone: data.clientPhone || '',
        address: data.clientAddress || '',
        city: data.clientCity || '',
        company: data.clientCompany || ''
      },

      // Proyecto
      project: {
        name: data.projectName || '',
        category: data.category || 'closet',
        description: data.description || '',
        deliveryDays: data.deliveryDays || 15
      },

      // Items de cotización
      items: [
        // { description, quantity, unit, unitCost, amount }
      ],

      // Cálculos financieros
      financials: {
        subtotal: 0,
        taxPercentage: 10, // IVA
        taxAmount: 0,
        discountPercentage: 0,
        discountAmount: 0,
        overheadPercentage: 15, // Gastos indirectos
        overheadAmount: 0,
        marginPercentage: 30, // Margen de ganancia
        marginAmount: 0,
        total: 0
      },

      // Estado
      status: 'pending', // pending, sent, approved, production, completed, archived
      
      // Notas
      notes: '',
      terms: data.terms || 'Válido por 30 días desde la fecha de emisión.',
      
      // Firma y validación
      authorizedBy: data.authorizedBy || 'Vikingos Carpintería',
      clientSignature: '',
      
      // Metadata
      media: [], // Referencias de fotos/videos
      attachments: []
    };
  }

  /**
   * Agregar una nueva cotización
   */
  addQuotation(quotation) {
    if (!this.validateQuotation(quotation)) {
      throw new Error('Cotización inválida');
    }
    this.quotations.push(quotation);
    return quotation;
  }

  /**
   * Obtener cotización por ID
   */
  getQuotation(id) {
    return this.quotations.find(q => q.id === id);
  }

  /**
   * Obtener todas las cotizaciones
   */
  getAllQuotations() {
    return this.quotations;
  }

  /**
   * Actualizar cotización
   */
  updateQuotation(id, updatedData) {
    const index = this.quotations.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Cotización no encontrada');
    
    this.quotations[index] = {
      ...this.quotations[index],
      ...updatedData,
      updatedDate: new Date().toISOString()
    };
    
    return this.quotations[index];
  }

  /**
   * Eliminar cotización
   */
  deleteQuotation(id) {
    this.quotations = this.quotations.filter(q => q.id !== id);
  }

  /**
   * Agregar item a cotización
   */
  addItem(quotationId, item) {
    const quotation = this.getQuotation(quotationId);
    if (!quotation) throw new Error('Cotización no encontrada');
    
    const validItem = {
      id: Date.now(),
      description: item.description || '',
      quantity: item.quantity || 1,
      unit: item.unit || 'unidad',
      unitCost: parseFloat(item.unitCost) || 0,
      amount: 0
    };
    
    validItem.amount = validItem.quantity * validItem.unitCost;
    quotation.items.push(validItem);
    return validItem;
  }

  /**
   * Actualizar item
   */
  updateItem(quotationId, itemId, updatedData) {
    const quotation = this.getQuotation(quotationId);
    if (!quotation) throw new Error('Cotización no encontrada');
    
    const itemIndex = quotation.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) throw new Error('Item no encontrado');
    
    quotation.items[itemIndex] = {
      ...quotation.items[itemIndex],
      ...updatedData
    };
    
    quotation.items[itemIndex].amount = 
      quotation.items[itemIndex].quantity * quotation.items[itemIndex].unitCost;
    
    return quotation.items[itemIndex];
  }

  /**
   * Eliminar item
   */
  deleteItem(quotationId, itemId) {
    const quotation = this.getQuotation(quotationId);
    if (!quotation) throw new Error('Cotización no encontrada');
    
    quotation.items = quotation.items.filter(i => i.id !== itemId);
  }

  /**
   * Cambiar estado de cotización
   */
  changeStatus(quotationId, newStatus) {
    const validStatuses = ['pending', 'sent', 'approved', 'production', 'completed', 'archived'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Estado inválido');
    }
    
    return this.updateQuotation(quotationId, { status: newStatus });
  }

  /**
   * Validar estructura de cotización
   */
  validateQuotation(quotation) {
    return (
      quotation.client &&
      quotation.client.name &&
      quotation.project &&
      quotation.project.name &&
      quotation.items &&
      Array.isArray(quotation.items)
    );
  }

  /**
   * Filtrar cotizaciones por criterios
   */
  filterQuotations(criteria = {}) {
    return this.quotations.filter(q => {
      if (criteria.status && q.status !== criteria.status) return false;
      if (criteria.clientName && !q.client.name.toLowerCase().includes(criteria.clientName.toLowerCase())) return false;
      if (criteria.projectName && !q.project.name.toLowerCase().includes(criteria.projectName.toLowerCase())) return false;
      if (criteria.category && q.project.category !== criteria.category) return false;
      if (criteria.dateFrom && new Date(q.createdDate) < new Date(criteria.dateFrom)) return false;
      if (criteria.dateTo && new Date(q.createdDate) > new Date(criteria.dateTo)) return false;
      return true;
    });
  }
}

// Exportar como módulo global
window.QuotationModel = QuotationModel;
