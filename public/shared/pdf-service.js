/**
 * PDFGenerator.js — Genera PDF profesional de cotizaciones
 * Responsabilidad: Crear archivo descargable en formato PDF
 */

class QuotationPDFGenerator {
  constructor() {
    this.pageSize = 'A4';
    this.orientation = 'portrait';
    this.margins = { top: 20, right: 20, bottom: 20, left: 20 };
  }

  /**
   * Generar PDF de cotización
   * @param {Object} quotation - Objeto cotización completo
   * @param {String} filename - Nombre del archivo (default: Cotización_XXXXXX.pdf)
   */
  async generatePDF(quotation, filename = null) {
    try {
      if (!filename) {
        filename = `Cotizacion_${quotation.estimateNumber.replace('#', '')}_${new Date().toISOString().split('T')[0]}.pdf`;
      }

      const htmlContent = this.buildHTML(quotation);
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      element.style.display = 'none';
      document.body.appendChild(element);

      // Opción 1: Si html2pdf está disponible
      if (typeof html2pdf !== 'undefined') {
        const options = {
          margin: [this.margins.top, this.margins.right, this.margins.bottom, this.margins.left],
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { orientation: this.orientation, unit: 'mm', format: this.pageSize }
        };
        
        html2pdf().set(options).from(element).save();
      } else {
        // Opción 2: Fallback - Imprimir como PDF
        this.printToPDF(element, filename);
      }

      setTimeout(() => document.body.removeChild(element), 100);
      return true;
    } catch (error) {
      console.error('Error generando PDF:', error);
      return false;
    }
  }

  /**
   * Construir HTML de cotización profesional
   */
  buildHTML(quotation) {
    const financials = quotation.financials;
    const itemsRows = quotation.items.map((item, idx) => `
      <tr>
        <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">${idx + 1}</td>
        <td style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">${item.description}</td>
        <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">${item.unit}</td>
        <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">$${this.formatNumber(item.unitCost)}</td>
        <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd; font-weight: 600;">$${this.formatNumber(item.amount)}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8"/>
        <title>${quotation.estimateNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { width: 100%; max-width: 210mm; margin: 0 auto; padding: 20mm; }
          
          .header { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; border-bottom: 3px solid #e8a84c; padding-bottom: 20px; }
          .logo { }
          .logo h1 { font-size: 28px; font-weight: 700; color: #e8a84c; }
          .logo p { font-size: 12px; color: #999; }
          
          .estimate-info { text-align: right; }
          .estimate-title { font-size: 24px; font-weight: 700; color: #333; margin-bottom: 5px; }
          .estimate-number { font-size: 18px; color: #e8a84c; font-weight: 600; }
          
          .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
          .info-box h3 { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #e8a84c; margin-bottom: 8px; letter-spacing: 1px; }
          .info-box p { font-size: 12px; margin-bottom: 4px; }
          
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items-table th { background: #f5f5f5; padding: 12px 8px; text-align: left; font-weight: 600; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #e8a84c; }
          .items-table td { padding: 10px 8px; }
          
          .financials { display: flex; justify-content: flex-end; margin-bottom: 30px; }
          .financial-summary { width: 100%; max-width: 350px; }
          .financial-line { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; border-bottom: 1px solid #eee; }
          .financial-line.total { font-weight: 700; font-size: 16px; border-bottom: 3px solid #e8a84c; border-top: 2px solid #e8a84c; padding: 12px 0; }
          
          .notes { background: #f9f9f9; padding: 12px; border-left: 4px solid #e8a84c; margin-bottom: 20px; }
          .notes h4 { font-size: 12px; font-weight: 700; color: #e8a84c; margin-bottom: 6px; }
          .notes p { font-size: 12px; color: #666; }
          
          .footer { text-align: center; font-size: 11px; color: #999; border-top: 1px solid #ddd; padding-top: 15px; }
          .footer p { margin-bottom: 3px; }
          
          @media print {
            body { margin: 0; padding: 0; }
            .container { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- HEADER -->
          <div class="header">
            <div class="logo">
              <h1>🔨 VIKINGOS</h1>
              <p>Carpintería Profesional</p>
            </div>
            <div class="estimate-info">
              <div class="estimate-title">COTIZACIÓN</div>
              <div class="estimate-number">${quotation.estimateNumber}</div>
              <div style="font-size: 11px; color: #999; margin-top: 4px;">${this.formatDate(quotation.createdDate)}</div>
            </div>
          </div>

          <!-- INFO SECTIONS -->
          <div class="info-section">
            <div class="info-box">
              <h3>Información del Cliente</h3>
              <p><strong>${quotation.client.name}</strong></p>
              ${quotation.client.company ? `<p>Empresa: ${quotation.client.company}</p>` : ''}
              ${quotation.client.email ? `<p>Email: ${quotation.client.email}</p>` : ''}
              ${quotation.client.phone ? `<p>Teléfono: ${quotation.client.phone}</p>` : ''}
              ${quotation.client.address ? `<p>Dirección: ${quotation.client.address}</p>` : ''}
            </div>
            <div class="info-box">
              <h3>Información del Proyecto</h3>
              <p><strong>${quotation.project.name}</strong></p>
              <p>Categoría: ${quotation.project.category}</p>
              <p>Entrega: ${quotation.project.deliveryDays} días</p>
              <p>Vigencia: 30 días desde emisión</p>
              ${quotation.project.description ? `<p style="font-size: 11px; margin-top: 6px;">${quotation.project.description}</p>` : ''}
            </div>
          </div>

          <!-- ITEMS TABLE -->
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 5%;">No.</th>
                <th style="width: 45%;">Descripción</th>
                <th style="width: 10%;">Cantidad</th>
                <th style="width: 10%;">Unidad</th>
                <th style="width: 15%;">Valor Unitario</th>
                <th style="width: 15%;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <!-- FINANCIALS -->
          <div class="financials">
            <div class="financial-summary">
              <div class="financial-line">
                <span>Subtotal:</span>
                <span>$${this.formatNumber(financials.subtotal)}</span>
              </div>
              ${financials.discountAmount > 0 ? `
                <div class="financial-line">
                  <span>Descuento (${financials.discountPercentage}%):</span>
                  <span>-$${this.formatNumber(financials.discountAmount)}</span>
                </div>
              ` : ''}
              <div class="financial-line">
                <span>Overhead (${financials.overheadPercentage}%):</span>
                <span>$${this.formatNumber(financials.overheadAmount)}</span>
              </div>
              <div class="financial-line">
                <span>Margen (${financials.marginPercentage}%):</span>
                <span>$${this.formatNumber(financials.marginAmount)}</span>
              </div>
              <div class="financial-line">
                <span>IVA (${financials.taxPercentage}%):</span>
                <span>$${this.formatNumber(financials.taxAmount)}</span>
              </div>
              <div class="financial-line total">
                <span>TOTAL A PAGAR:</span>
                <span>$${this.formatNumber(financials.total)}</span>
              </div>
            </div>
          </div>

          <!-- NOTES -->
          ${quotation.notes ? `
            <div class="notes">
              <h4>Notas Especiales</h4>
              <p>${quotation.notes}</p>
            </div>
          ` : ''}

          <!-- FOOTER -->
          <div class="footer">
            <p><strong>Vikingos Carpintería</strong> | Bogotá, Colombia</p>
            <p>Cotización profesional - ${quotation.authorizedBy}</p>
            <p>Correo: info@vikingos.com | Teléfono: +57 (1) 2345-6789</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return html;
  }

  /**
   * Fallback: Imprimir como PDF usando navegador
   */
  printToPDF(element, filename) {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>' + filename + '</title>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(element.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }

  /**
   * Formatear número como moneda
   */
  formatNumber(value) {
    const num = parseFloat(value) || 0;
    return num.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  /**
   * Formatear fecha
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// Exportar
window.QuotationPDFGenerator = QuotationPDFGenerator;
