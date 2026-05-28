// ═══════════════════════════════════════════════════════════════
// GENERADOR DE PDF - Cotizaciones
// ═══════════════════════════════════════════════════════════════

class PDFGenerator {
  static fmt(n) {
    return '$ ' + Math.round(n).toLocaleString('es-CO');
  }

  static generarCotizacion(cotizacion) {
    if (typeof jspdf === 'undefined') {
      console.error('jsPDF no está cargado');
      alert('Cargando librería PDF...');
      this.cargarjsPDF(() => this.generarCotizacion(cotizacion));
      return;
    }

    const doc = new jspdf.jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // ═══ CABECERA ═══
    doc.setFillColor(30, 23, 16);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(245, 234, 216);
    doc.text('V I K I N G O S', margin, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(122, 104, 80);
    doc.text('Muebles Personalizados', margin, 33);

    doc.setFontSize(12);
    doc.setTextColor(245, 234, 216);
    doc.text('COTIZACIÓN', pageWidth - margin, 25, { align: 'right' });
    doc.setFontSize(10);
    doc.setTextColor(232, 168, 76);
    doc.text(`#${cotizacion.id}`, pageWidth - margin, 33, { align: 'right' });

    y = 55;

    // ═══ INFO CLIENTE ═══
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('CLIENTE', margin, y);
    
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text(cotizacion.cliente || 'No especificado', margin, y + 8);
    
    if (cotizacion.telefono) {
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Tel: ${cotizacion.telefono}`, margin, y + 16);
    }
    if (cotizacion.direccion) {
      doc.text(`Dirección: ${cotizacion.direccion}`, margin, y + 22);
    }

    // Fecha
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Fecha:', pageWidth - margin - 40, y);
    doc.setTextColor(30, 30, 30);
    doc.text(new Date(cotizacion.fechaCreacion).toLocaleDateString('es-CO'), pageWidth - margin, y);

    y += 35;

    // ═══ PROYECTO ═══
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, y, pageWidth - 2 * margin, 25, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(30, 23, 16);
    doc.text(cotizacion.proyecto, margin + 5, y + 10);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const categoriaLabel = { closet: 'Closet', mesa: 'Mesa', cocina: 'Cocina', puerta: 'Puerta/Ventana', cama: 'Cama', escritorio: 'Escritorio', otro: 'Otro' };
    doc.text(`Categoría: ${categoriaLabel[cotizacion.categoria] || cotizacion.categoria}`, margin + 5, y + 18);
    
    if (cotizacion.tiempoEntrega) {
      doc.text(`Entrega: ${cotizacion.tiempoEntrega} días`, pageWidth - margin - 30, y + 18);
    }

    y += 35;

    // ═══ ESPECIFICACIONES ═══
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text('ESPECIFICACIONES', margin, y);
    
    y += 8;
    doc.setDrawColor(232, 168, 76);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    const specs = [];
    if (cotizacion.ancho && cotizacion.alto && cotizacion.fondo) {
      specs.push(`Medidas: ${cotizacion.ancho} × ${cotizacion.alto} × ${cotizacion.fondo} cm`);
    }
    if (cotizacion.colorNombre) {
      specs.push(`Color/Acabado: ${cotizacion.colorNombre}`);
    }
    if (cotizacion.tamano) {
      const tamanoLabels = { pequeño: 'Pequeño', mediano: 'Mediano', grande: 'Grande', set: 'Set/Conjunto' };
      specs.push(`Tamaño: ${tamanoLabels[cotizacion.tamano] || cotizacion.tamano}`);
    }

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    specs.forEach(s => {
      doc.text('• ' + s, margin, y);
      y += 6;
    });

    if (cotizacion.descripcion) {
      y += 5;
      doc.text('Descripción:', margin, y);
      y += 6;
      const descLines = doc.splitTextToSize(cotizacion.descripcion, pageWidth - 2 * margin);
      doc.setTextColor(60, 60, 60);
      descLines.forEach(line => {
        doc.text(line, margin, y);
        y += 5;
      });
    }

    y += 10;

    // ═══ MATERIALES ═══
    if (cotizacion.materiales && cotizacion.materiales.length > 0) {
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.text('MATERIALES', margin, y);
      y += 8;
      doc.setDrawColor(232, 168, 76);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      // Encabezado tabla
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('Descripción', margin, y);
      doc.text('Cant.', margin + 80, y);
      doc.text('Und', margin + 100, y);
      doc.text('P. Unit', margin + 120, y);
      doc.text('Total', pageWidth - margin - 20, y, { align: 'right' });
      y += 6;

      doc.setTextColor(60, 60, 60);
      cotizacion.materiales.forEach(m => {
        const total = m.cantidad * m.precio;
        doc.text(m.nombre || '-', margin, y);
        doc.text(String(m.cantidad), margin + 80, y);
        doc.text(m.unidad || '-', margin + 100, y);
        doc.text(this.fmt(m.precio), margin + 120, y);
        doc.text(this.fmt(total), pageWidth - margin - 20, y, { align: 'right' });
        y += 6;
      });

      y += 5;
    }

    // ═══ MANO DE OBRA ═══
    if (cotizacion.manoObra && cotizacion.manoObra.horas > 0) {
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.text('MANO DE OBRA', margin, y);
      y += 8;
      doc.setDrawColor(232, 168, 76);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const mo = cotizacion.manoObra;
      if (mo.tarea) doc.text(`Tarea: ${mo.tarea}`, margin, y), y += 6;
      if (mo.colaborador) doc.text(`Colaborador: ${mo.colaborador}`, margin, y), y += 6;
      doc.text(`Horas: ${mo.horas} × ${this.fmt(mo.tarifa)} = ${this.fmt(mo.horas * mo.tarifa)}`, margin, y);
      y += 10;
    }

    // ═══ RESUMEN COSTOS ═══
    const cx = cotizacion.costos || {};
    const boxX = pageWidth - margin - 70;
    
    doc.setFillColor(245, 245, 245);
    doc.rect(boxX, y, 70, 50, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('Subtotal:', boxX + 5, y + 10);
    doc.text(this.fmt(cx.subtotal || 0), boxX + 65, y + 10, { align: 'right' });
    
    doc.text(`Overhead (${cotizacion.overhead || 15}%):`, boxX + 5, y + 20);
    doc.text(this.fmt(cx.overheadMonto || 0), boxX + 65, y + 20, { align: 'right' });
    
    doc.text(`Margen (${cotizacion.margen || 30}%):`, boxX + 5, y + 30);
    doc.text(this.fmt(cx.margenMonto || 0), boxX + 65, y + 30, { align: 'right' });
    
    doc.setDrawColor(232, 168, 76);
    doc.line(boxX + 5, y + 35, boxX + 65, y + 35);
    
    doc.setFontSize(12);
    doc.setTextColor(232, 168, 76);
    doc.text('TOTAL:', boxX + 5, y + 45);
    doc.text(this.fmt(cx.total || 0), boxX + 65, y + 45, { align: 'right' });

    y += 60;

    // ═══ NOTAS PIE ═══
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Esta cotización tiene validez de 30 días. El inicio de obra requiere', margin, y);
    doc.text('confirmación del cliente y abono del 50% del valor total.', margin, y + 5);
    
    y += 15;
    doc.setTextColor(232, 168, 76);
    doc.text('Gracias por confiar en Vikingos — Muebles Personalizados', margin, y);

    // Guardar
    const filename = `Cotizacion_${cotizacion.proyecto.replace(/[^a-zA-Z0-9]/g, '_')}_${cotizacion.id}.pdf`;
    doc.save(filename);
  }

  static cargarjsPDF(callback) {
    if (typeof jspdf !== 'undefined') {
      callback();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = callback;
    document.head.appendChild(script);
  }
}

window.PDFGenerator = PDFGenerator;