/**
 * UTILS.JS — Funciones auxiliares y utilidades
 * Responsabilidad: Formatos, validaciones, transformaciones de datos
 */

class QuotationUtils {
  /**
   * Formatear número como moneda (COP)
   */
  static formatCurrency(value) {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  }

  /**
   * Formatear número con separadores de miles
   */
  static formatNumber(value) {
    const num = parseFloat(value) || 0;
    return num.toLocaleString('es-CO');
  }

  /**
   * Formatear fecha en formato legible
   */
  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Formatear fecha corta (DD/MM/YYYY)
   */
  static formatDateShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  }

  /**
   * Obtener nombre legible del estado
   */
  static getStatusLabel(status) {
    const labels = {
      pending: 'Pendiente',
      sent: 'Enviada',
      approved: 'Aprobada',
      production: 'En Producción',
      completed: 'Finalizada',
      archived: 'Archivada'
    };
    return labels[status] || status;
  }

  /**
   * Obtener color del estado (para UI)
   */
  static getStatusColor(status) {
    const colors = {
      pending: '#f0b960',      // Ámbar
      sent: '#5cb88a',         // Verde
      approved: '#6366f1',     // Índigo
      production: '#f97316',   // Naranja
      completed: '#10b981',    // Verde oscuro
      archived: '#6b7280'      // Gris
    };
    return colors[status] || '#999';
  }

  /**
   * Validar email
   */
  static isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Validar teléfono (formato colombiano)
   */
  static isValidPhone(phone) {
    const regex = /^(\+?57)?[\s]?([0-9]{7,10})$/;
    return regex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Validar número positivo
   */
  static isValidNumber(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
  }

  /**
   * Limpiar string de espacios extra
   */
  static cleanString(str) {
    return str.trim().replace(/\s+/g, ' ');
  }

  /**
   * Generar número único para referencia
   */
  static generateReferenceNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${timestamp}${random}`;
  }

  /**
   * Generar URL de descarga para archivo
   */
  static downloadFile(filename, content, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Copiar texto al portapapeles
   */
  static async copyToClipboard(text) {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback para navegadores antiguos
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      }
    } catch (error) {
      console.error('Error al copiar:', error);
      return false;
    }
  }

  /**
   * Obtener diferencia de días entre dos fechas
   */
  static daysDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Calcular días restantes para vencimiento
   */
  static calculateDaysRemaining(createdDate, validityDays = 30) {
    const created = new Date(createdDate);
    const expiryDate = new Date(created.getTime() + validityDays * 24 * 60 * 60 * 1000);
    const today = new Date();
    const remaining = this.daysDifference(today, expiryDate);
    return remaining;
  }

  /**
   * Generar objeto resumen financiero
   */
  static generateFinancialSummary(financials) {
    return {
      subtotal: this.formatCurrency(financials.subtotal),
      discount: {
        percentage: financials.discountPercentage,
        amount: this.formatCurrency(financials.discountAmount)
      },
      overhead: {
        percentage: financials.overheadPercentage,
        amount: this.formatCurrency(financials.overheadAmount)
      },
      margin: {
        percentage: financials.marginPercentage,
        amount: this.formatCurrency(financials.marginAmount)
      },
      tax: {
        percentage: financials.taxPercentage,
        amount: this.formatCurrency(financials.taxAmount)
      },
      total: this.formatCurrency(financials.total)
    };
  }

  /**
   * Validar estructura de cotización
   */
  static validateQuotationStructure(quotation) {
    const errors = [];

    if (!quotation.client || !quotation.client.name) {
      errors.push('Nombre del cliente requerido');
    }

    if (!quotation.project || !quotation.project.name) {
      errors.push('Nombre del proyecto requerido');
    }

    if (!quotation.items || quotation.items.length === 0) {
      errors.push('Se requiere al menos un item');
    }

    if (quotation.items) {
      quotation.items.forEach((item, index) => {
        if (!item.description) errors.push(`Item ${index + 1}: descripción requerida`);
        if (!this.isValidNumber(item.quantity)) errors.push(`Item ${index + 1}: cantidad inválida`);
        if (!this.isValidNumber(item.unitCost)) errors.push(`Item ${index + 1}: precio unitario inválido`);
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Buscar en array de cotizaciones
   */
  static searchQuotations(quotations, searchTerm) {
    const term = searchTerm.toLowerCase();
    return quotations.filter(q => 
      q.client.name.toLowerCase().includes(term) ||
      q.client.email.toLowerCase().includes(term) ||
      q.project.name.toLowerCase().includes(term) ||
      q.estimateNumber.toLowerCase().includes(term)
    );
  }

  /**
   * Ordenar cotizaciones por criterio
   */
  static sortQuotations(quotations, sortBy = 'createdDate', order = 'desc') {
    const sorted = [...quotations];
    
    sorted.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'total':
          aValue = a.financials.total;
          bValue = b.financials.total;
          break;
        case 'clientName':
          aValue = a.client.name;
          bValue = b.client.name;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'createdDate':
        default:
          aValue = new Date(a.createdDate);
          bValue = new Date(b.createdDate);
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }

  /**
   * Generar HTML tabla de items
   */
  static generateItemsTableHTML(items) {
    let html = '';
    items.forEach((item, index) => {
      html += `
        <tr>
          <td style="text-align: left;">${index + 1}</td>
          <td style="text-align: left;">${item.description}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: center;">${item.unit}</td>
          <td style="text-align: right;">${this.formatCurrency(item.unitCost)}</td>
          <td style="text-align: right;">${this.formatCurrency(item.amount)}</td>
        </tr>
      `;
    });
    return html;
  }
}

// Exportar como módulo global
window.QuotationUtils = QuotationUtils;
