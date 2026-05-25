/**
 * VIEW.JS — Gestión de interfaz y eventos
 * Responsabilidad: Renderizar elementos, capturar eventos, actualizar DOM
 */

class QuotationView {
  constructor(controller, utils) {
    this.controller = controller;
    this.utils = utils;
    this.selectedQuotationId = null;
  }

  /**
   * Renderizar lista de cotizaciones
   */
  renderQuotationsList(container, quotations) {
    if (!container) return;

    const html = quotations.map(q => `
      <div class="quotation-card" data-id="${q.id}">
        <div class="card-header">
          <div class="card-left">
            <h3 class="estimate-number">${q.estimateNumber}</h3>
            <p class="client-name">${q.client.name}</p>
          </div>
          <div class="card-right">
            <span class="status-badge status-${q.status}">
              ${this.utils.getStatusLabel(q.status)}
            </span>
            <p class="total-amount">${this.utils.formatCurrency(q.financials.total)}</p>
          </div>
        </div>
        <div class="card-body">
          <p class="project-name">${q.project.name}</p>
          <p class="date-created">${this.utils.formatDateShort(q.createdDate)}</p>
        </div>
        <div class="card-footer">
          <button class="btn-sm btn-edit" data-id="${q.id}">Editar</button>
          <button class="btn-sm btn-view" data-id="${q.id}">Ver</button>
          <button class="btn-sm btn-delete" data-id="${q.id}">Eliminar</button>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
    this.attachListEventHandlers(container);
  }

  /**
   * Renderizar formulario de cotización
   */
  renderQuotationForm(container, quotation = null) {
    if (!container) return;

    const isEditing = !!quotation;
    const data = quotation || {
      id: null,
      client: { name: '', email: '', phone: '', address: '', city: '', company: '' },
      project: { name: '', category: 'closet', description: '', deliveryDays: 15 },
      financials: { 
        taxPercentage: 10, 
        discountPercentage: 0, 
        overheadPercentage: 15, 
        marginPercentage: 30 
      },
      items: [],
      notes: ''
    };

    const html = `
      <form id="quotationForm" class="quotation-form">
        <div class="form-section">
          <h3>Información del Cliente</h3>
          <div class="form-row">
            <div class="form-group">
              <label>Nombre del Cliente *</label>
              <input type="text" name="clientName" value="${data.client.name}" required/>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="clientEmail" value="${data.client.email}"/>
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input type="tel" name="clientPhone" value="${data.client.phone}"/>
            </div>
            <div class="form-group">
              <label>Empresa</label>
              <input type="text" name="clientCompany" value="${data.client.company}"/>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Dirección</label>
              <input type="text" name="clientAddress" value="${data.client.address}"/>
            </div>
            <div class="form-group">
              <label>Ciudad</label>
              <input type="text" name="clientCity" value="${data.client.city}"/>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Información del Proyecto</h3>
          <div class="form-row">
            <div class="form-group">
              <label>Nombre del Proyecto *</label>
              <input type="text" name="projectName" value="${data.project.name}" required/>
            </div>
            <div class="form-group">
              <label>Categoría</label>
              <select name="category">
                <option value="closet" ${data.project.category === 'closet' ? 'selected' : ''}>Closet</option>
                <option value="mesa" ${data.project.category === 'mesa' ? 'selected' : ''}>Mesa</option>
                <option value="cocina" ${data.project.category === 'cocina' ? 'selected' : ''}>Cocina</option>
                <option value="puerta" ${data.project.category === 'puerta' ? 'selected' : ''}>Puerta / Ventana</option>
              </select>
            </div>
            <div class="form-group">
              <label>Días de Entrega</label>
              <input type="number" name="deliveryDays" value="${data.project.deliveryDays}" min="1"/>
            </div>
          </div>
          <div class="form-group">
            <label>Descripción del Proyecto</label>
            <textarea name="description">${data.project.description}</textarea>
          </div>
        </div>

        <div id="itemsContainer" class="form-section">
          <h3>Items de Cotización</h3>
          <div id="itemsList"></div>
          <button type="button" class="btn-add-item" id="addItemBtn">+ Agregar Item</button>
        </div>

        <div class="form-section">
          <h3>Parámetros Financieros</h3>
          <div class="form-row">
            <div class="form-group">
              <label>IVA (%)</label>
              <input type="number" name="taxPercentage" value="${data.financials.taxPercentage}" min="0" max="100" step="0.1"/>
            </div>
            <div class="form-group">
              <label>Descuento (%)</label>
              <input type="number" name="discountPercentage" value="${data.financials.discountPercentage}" min="0" max="100" step="0.1"/>
            </div>
            <div class="form-group">
              <label>Overhead (%)</label>
              <input type="number" name="overheadPercentage" value="${data.financials.overheadPercentage}" min="0" max="100" step="0.1"/>
            </div>
            <div class="form-group">
              <label>Margen de Ganancia (%)</label>
              <input type="number" name="marginPercentage" value="${data.financials.marginPercentage}" min="0" max="100" step="0.1"/>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Notas</h3>
          <textarea name="notes" placeholder="Observaciones, condiciones de pago, etc...">${data.notes}</textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" id="saveBtn">
            ${isEditing ? 'Actualizar Cotización' : 'Crear Cotización'}
          </button>
          <button type="button" class="btn-secondary" id="cancelBtn">Cancelar</button>
        </div>

        ${isEditing ? `<input type="hidden" name="quotationId" value="${data.id}"/>` : ''}
      </form>
    `;

    container.innerHTML = html;
    this.renderItemsList(data.items, data.id);
    this.attachFormEventHandlers(data);
  }

  /**
   * Renderizar items en el formulario
   */
  renderItemsList(items, quotationId) {
    const container = document.getElementById('itemsList');
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = '<p class="no-items">No hay items. Agrega uno para comenzar.</p>';
      return;
    }

    const html = items.map((item, index) => `
      <div class="item-row" data-item-id="${item.id}">
        <div class="item-content">
          <p class="item-desc">${item.description}</p>
          <div class="item-details">
            <span>${item.quantity} ${item.unit} × ${this.utils.formatCurrency(item.unitCost)} = ${this.utils.formatCurrency(item.amount)}</span>
          </div>
        </div>
        <div class="item-actions">
          <button type="button" class="btn-edit-item" data-item-id="${item.id}">✏️</button>
          <button type="button" class="btn-delete-item" data-item-id="${item.id}">🗑️</button>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
  }

  /**
   * Renderizar vista previa de cotización (para PDF)
   */
  renderQuotationPreview(container, quotation) {
    if (!container || !quotation) return;

    // Guardar referencia global para uso en eventos
    window.currentQuotationForPDF = quotation;

    const financial = quotation.financials;
    const itemsHTML = this.utils.generateItemsTableHTML(quotation.items);

    const html = `
      <div class="quotation-preview">
        <div class="preview-header">
          <div class="preview-logo">
            <h1>VIKINGOS</h1>
            <p>Carpintería</p>
          </div>
          <div class="preview-title">
            <h2>COTIZACIÓN</h2>
            <p>${quotation.estimateNumber}</p>
          </div>
        </div>

        <div class="preview-info">
          <div class="info-section">
            <h3>Información del Cliente</h3>
            <p><strong>Nombre:</strong> ${quotation.client.name}</p>
            <p><strong>Empresa:</strong> ${quotation.client.company || '-'}</p>
            <p><strong>Email:</strong> ${quotation.client.email || '-'}</p>
            <p><strong>Teléfono:</strong> ${quotation.client.phone || '-'}</p>
            <p><strong>Dirección:</strong> ${quotation.client.address || '-'}</p>
          </div>
          <div class="info-section">
            <h3>Información de la Cotización</h3>
            <p><strong>Fecha:</strong> ${this.utils.formatDate(quotation.createdDate)}</p>
            <p><strong>Proyecto:</strong> ${quotation.project.name}</p>
            <p><strong>Categoría:</strong> ${quotation.project.category}</p>
            <p><strong>Entrega:</strong> ${quotation.project.deliveryDays} días</p>
            <p><strong>Estado:</strong> <span class="status-badge status-${quotation.status}">${this.utils.getStatusLabel(quotation.status)}</span></p>
          </div>
        </div>

        <div class="preview-items">
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 5%;">No.</th>
                <th style="width: 45%; text-align: left;">Descripción</th>
                <th style="width: 10%; text-align: center;">Cantidad</th>
                <th style="width: 10%; text-align: center;">Unidad</th>
                <th style="width: 15%; text-align: right;">Valor Unitario</th>
                <th style="width: 15%; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </div>

        <div class="preview-financials">
          <div class="financials-summary">
            <div class="financial-line">
              <span>Subtotal:</span>
              <span>${this.utils.formatCurrency(financial.subtotal)}</span>
            </div>
            ${financial.discountAmount > 0 ? `
              <div class="financial-line">
                <span>Descuento (${financial.discountPercentage}%):</span>
                <span>-${this.utils.formatCurrency(financial.discountAmount)}</span>
              </div>
            ` : ''}
            <div class="financial-line">
              <span>Overhead (${financial.overheadPercentage}%):</span>
              <span>${this.utils.formatCurrency(financial.overheadAmount)}</span>
            </div>
            <div class="financial-line">
              <span>Margen de Ganancia (${financial.marginPercentage}%):</span>
              <span>${this.utils.formatCurrency(financial.marginAmount)}</span>
            </div>
            <div class="financial-line">
              <span>IVA (${financial.taxPercentage}%):</span>
              <span>${this.utils.formatCurrency(financial.taxAmount)}</span>
            </div>
            <div class="financial-total">
              <span>TOTAL:</span>
              <span>${this.utils.formatCurrency(financial.total)}</span>
            </div>
          </div>
        </div>

        ${quotation.notes ? `
          <div class="preview-notes">
            <h3>Notas Adicionales</h3>
            <p>${quotation.notes}</p>
          </div>
        ` : ''}

        <div class="preview-footer">
          <p><strong>Vigencia:</strong> 30 días desde la fecha de emisión</p>
          <p><strong>Autorizado por:</strong> ${quotation.authorizedBy}</p>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  /**
   * Mostrar notificación
   */
  showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span class="notification-content">${message}</span>
      <button class="notification-close">×</button>
    `;

    document.body.appendChild(notification);

    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });

    setTimeout(() => {
      notification.remove();
    }, duration);
  }

  /**
   * Adjuntar event handlers al formulario
   */
  attachFormEventHandlers(quotation) {
    const form = document.getElementById('quotationForm');
    if (!form) return;

    const addItemBtn = document.getElementById('addItemBtn');
    if (addItemBtn) {
      addItemBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showAddItemModal(quotation.id);
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      try {
        const validationResult = this.utils.validateQuotationStructure({
          client: {
            name: data.clientName
          },
          project: {
            name: data.projectName
          },
          items: quotation.items || []
        });

        if (!validationResult.isValid) {
          this.showNotification(validationResult.errors[0], 'error');
          return;
        }

        const saved = this.controller.saveQuotation(quotation.id, {
          client: {
            name: data.clientName,
            email: data.clientEmail,
            phone: data.clientPhone,
            address: data.clientAddress,
            city: data.clientCity,
            company: data.clientCompany
          },
          project: {
            name: data.projectName,
            category: data.category,
            description: data.description,
            deliveryDays: parseInt(data.deliveryDays)
          },
          notes: data.notes
        });

        this.controller.updateFinancialPercentages(saved.id, {
          taxPercentage: parseFloat(data.taxPercentage),
          discountPercentage: parseFloat(data.discountPercentage),
          overheadPercentage: parseFloat(data.overheadPercentage),
          marginPercentage: parseFloat(data.marginPercentage)
        });

        this.showNotification('Cotización guardada exitosamente', 'success');
      } catch (error) {
        this.showNotification('Error al guardar: ' + error.message, 'error');
      }
    });
  }

  /**
   * Adjuntar event handlers a lista
   */
  attachListEventHandlers(container) {
    container.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        this.selectedQuotationId = id;
        window.dispatchEvent(new CustomEvent('openQuotationEditor', { detail: { id } }));
      });
    });

    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('¿Eliminar esta cotización?')) {
          const id = parseInt(btn.dataset.id);
          this.controller.deleteQuotation(id);
          this.showNotification('Cotización eliminada', 'success');
          window.dispatchEvent(new Event('refreshQuotationsList'));
        }
      });
    });

    container.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        window.dispatchEvent(new CustomEvent('viewQuotation', { detail: { id } }));
      });
    });
  }

  /**
   * Modal para agregar item
   */
  showAddItemModal(quotationId) {
    const modal = `
      <div class="modal-overlay" id="itemModal">
        <div class="modal">
          <div class="modal-header">
            <h2>Agregar Item</h2>
            <button class="modal-close">×</button>
          </div>
          <div class="modal-body">
            <form id="itemForm">
              <div class="form-group">
                <label>Descripción *</label>
                <input type="text" name="description" required/>
              </div>
              <div class="form-group">
                <label>Cantidad *</label>
                <input type="number" name="quantity" min="1" value="1" required/>
              </div>
              <div class="form-group">
                <label>Unidad *</label>
                <select name="unit">
                  <option value="unidad">Unidad</option>
                  <option value="metro">Metro</option>
                  <option value="metro2">Metro Cuadrado</option>
                  <option value="hora">Hora</option>
                </select>
              </div>
              <div class="form-group">
                <label>Valor Unitario *</label>
                <input type="number" name="unitCost" step="0.01" min="0" required/>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" id="modalCancel">Cancelar</button>
            <button class="btn-primary" id="modalSave">Guardar Item</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);
    const modalElement = document.getElementById('itemModal');

    document.getElementById('modalClose').addEventListener('click', () => modalElement.remove());
    document.getElementById('modalCancel').addEventListener('click', () => modalElement.remove());

    document.getElementById('modalSave').addEventListener('click', () => {
      const formData = new FormData(document.getElementById('itemForm'));
      const item = Object.fromEntries(formData);

      try {
        this.controller.addItem(quotationId, item);
        this.showNotification('Item agregado', 'success');
        modalElement.remove();
        window.dispatchEvent(new Event('itemAdded'));
      } catch (error) {
        this.showNotification('Error: ' + error.message, 'error');
      }
    });
  }
}

// Exportar como módulo global
window.QuotationView = QuotationView;
