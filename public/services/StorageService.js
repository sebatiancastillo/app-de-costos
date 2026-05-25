/**
 * STORAGE.JS — Gestión de persistencia en localStorage
 * Responsabilidad: Guardar y recuperar cotizaciones de localStorage
 */

class QuotationStorage {
  constructor(storageKey = 'vikingos_quotations') {
    this.storageKey = storageKey;
    this.versionKey = 'vikingos_quotations_version';
    this.currentVersion = '1.0';
  }

  /**
   * Guardar una cotización individual
   */
  saveQuotation(quotation) {
    try {
      const quotations = this.getAllQuotations();
      const index = quotations.findIndex(q => q.id === quotation.id);
      
      if (index >= 0) {
        quotations[index] = quotation;
      } else {
        quotations.push(quotation);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(quotations));
      localStorage.setItem(this.versionKey, this.currentVersion);
      return true;
    } catch (error) {
      console.error('Error al guardar cotización:', error);
      return false;
    }
  }

  /**
   * Obtener una cotización por ID
   */
  getQuotation(id) {
    const quotations = this.getAllQuotations();
    return quotations.find(q => q.id === id) || null;
  }

  /**
   * Obtener todas las cotizaciones
   */
  getAllQuotations() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al recuperar cotizaciones:', error);
      return [];
    }
  }

  /**
   * Eliminar una cotización
   */
  deleteQuotation(id) {
    try {
      const quotations = this.getAllQuotations();
      const filtered = quotations.filter(q => q.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error al eliminar cotización:', error);
      return false;
    }
  }

  /**
   * Limpiar todas las cotizaciones
   */
  clearAll() {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.versionKey);
      return true;
    } catch (error) {
      console.error('Error al limpiar storage:', error);
      return false;
    }
  }

  /**
   * Exportar todas las cotizaciones como JSON
   */
  exportAsJSON() {
    const quotations = this.getAllQuotations();
    return JSON.stringify(quotations, null, 2);
  }

  /**
   * Importar cotizaciones desde JSON
   */
  importFromJSON(jsonString) {
    try {
      const quotations = JSON.parse(jsonString);
      
      if (!Array.isArray(quotations)) {
        throw new Error('Formato JSON inválido: debe ser un array');
      }

      localStorage.setItem(this.storageKey, JSON.stringify(quotations));
      localStorage.setItem(this.versionKey, this.currentVersion);
      return true;
    } catch (error) {
      console.error('Error al importar JSON:', error);
      return false;
    }
  }

  /**
   * Obtener estadísticas generales
   */
  getStatistics() {
    const quotations = this.getAllQuotations();
    
    const stats = {
      total: quotations.length,
      byStatus: {
        pending: 0,
        sent: 0,
        approved: 0,
        production: 0,
        completed: 0,
        archived: 0
      },
      totalRevenue: 0,
      averageValue: 0
    };

    quotations.forEach(q => {
      stats.byStatus[q.status]++;
      stats.totalRevenue += q.financials.total || 0;
    });

    stats.averageValue = stats.total > 0 ? stats.totalRevenue / stats.total : 0;

    return stats;
  }

  /**
   * Crear backup de cotizaciones
   */
  createBackup() {
    const backup = {
      timestamp: new Date().toISOString(),
      version: this.currentVersion,
      data: this.getAllQuotations()
    };
    
    return JSON.stringify(backup, null, 2);
  }

  /**
   * Restaurar desde backup
   */
  restoreFromBackup(backupString) {
    try {
      const backup = JSON.parse(backupString);
      
      if (!backup.data || !Array.isArray(backup.data)) {
        throw new Error('Formato de backup inválido');
      }

      localStorage.setItem(this.storageKey, JSON.stringify(backup.data));
      localStorage.setItem(this.versionKey, backup.version);
      return true;
    } catch (error) {
      console.error('Error al restaurar backup:', error);
      return false;
    }
  }

  /**
   * Obtener tamaño utilizado en localStorage
   */
  getStorageSize() {
    const data = localStorage.getItem(this.storageKey);
    return data ? new Blob([data]).size : 0;
  }
}

// Exportar como módulo global
window.QuotationStorage = QuotationStorage;
