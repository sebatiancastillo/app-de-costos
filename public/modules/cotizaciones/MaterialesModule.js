/**
 * MATERIALES MODULE - Gestión de materiales en cotizaciones
 * Responsabilidad: CRUD de materiales, cálculos de subtotales
 */

class MaterialesModule {
  
  static STORAGE_KEY = 'vikingos_materiales';
  
  /**
   * Obtener todos los materiales globales (biblioteca)
   */
  static obtenerBiblioteca() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Guardar material en biblioteca
   */
  static guardarEnBiblioteca(material) {
    const biblioteca = this.obtenerBiblioteca();
    
    const existe = biblioteca.findIndex(m => m.id === material.id);
    if (existe >= 0) {
      biblioteca[existe] = material;
    } else {
      biblioteca.push({
        id: material.id || Date.now(),
        ...material
      });
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(biblioteca));
    return true;
  }

  /**
   * Eliminar material de biblioteca
   */
  static eliminarDeBiblioteca(id) {
    let biblioteca = this.obtenerBiblioteca();
    biblioteca = biblioteca.filter(m => m.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(biblioteca));
    return true;
  }

  /**
   * Buscar material en biblioteca
   */
  static buscarEnBiblioteca(termino) {
    const biblioteca = this.obtenerBiblioteca();
    const t = termino.toLowerCase();
    return biblioteca.filter(m => 
      m.nombre.toLowerCase().includes(t) ||
      (m.descripcion && m.descripcion.toLowerCase().includes(t))
    );
  }

  /**
   * Calcular subtotal de material
   */
  static calcularSubtotal(cantidad, precio) {
    const cant = parseFloat(cantidad) || 0;
    const prec = parseFloat(precio) || 0;
    return cant * prec;
  }

  /**
   * Calcular total de materiales
   */
  static calcularTotalMateriales(materiales = []) {
    return materiales.reduce((total, mat) => {
      const cantidad = parseFloat(mat.cantidad) || 0;
      const precio = parseFloat(mat.precio) || 0;
      return total + (cantidad * precio);
    }, 0);
  }

  /**
   * Agrupar materiales por categoría
   */
  static agruparPorCategoria(materiales = []) {
    const agrupados = {};
    
    materiales.forEach(mat => {
      const categoria = mat.categoria || 'Otros';
      if (!agrupados[categoria]) {
        agrupados[categoria] = [];
      }
      agrupados[categoria].push(mat);
    });
    
    return agrupados;
  }

  /**
   * Obtener categorías disponibles
   */
  static obtenerCategorias() {
    return [
      { id: 'madera', nombre: 'Madera', icon: '🪵' },
      { id: 'herrajes', nombre: 'Herrajes', icon: '🔧' },
      { id: 'insumos', nombre: 'Insumos', icon: '🧴' },
      { id: 'tapiceria', nombre: 'Tapicería', icon: '🎨' },
      { id: 'acabados', nombre: 'Acabados', icon: '✨' },
      { id: 'otros', nombre: 'Otros', icon: '📦' }
    ];
  }

  /**
   * Obtener unidades disponibles
   */
  static obtenerUnidades() {
    return [
      { id: 'und', nombre: 'Unidad', abrev: 'und' },
      { id: 'm2', nombre: 'Metro cuadrado', abrev: 'm²' },
      { id: 'ml', nombre: 'Metro lineal', abrev: 'ml' },
      { id: 'lam', nombre: 'Lámina', abrev: 'lam' },
      { id: 'var', nombre: 'Varilla', abrev: 'var' },
      { id: 'lit', nombre: 'Litro', abrev: 'lt' },
      { id: 'kg', nombre: 'Kilogramo', abrev: 'kg' },
      { id: 'cja', nombre: 'Caja', abrev: 'cja' },
      { id: 'pli', nombre: 'Pliego', abrev: 'pli' },
      { id: 'mt', nombre: 'Metro', abrev: 'mt' }
    ];
  }

  /**
   * Validar material
   */
  static validarMaterial(material) {
    const errores = [];
    
    if (!material.nombre || !material.nombre.trim()) {
      errores.push('El nombre del material es obligatorio');
    }
    
    if (parseFloat(material.cantidad) <= 0) {
      errores.push('La cantidad debe ser mayor a 0');
    }
    
    if (parseFloat(material.precio) < 0) {
      errores.push('El precio no puede ser negativo');
    }
    
    return errores;
  }

  /**
   * Crear material para cotización
   */
  static crearMaterial(datos) {
    const errores = this.validarMaterial(datos);
    if (errores.length > 0) {
      return { success: false, errores };
    }

    const material = {
      id: datos.id || Date.now(),
      nombre: datos.nombre,
      descripcion: datos.descripcion || '',
      cantidad: parseFloat(datos.cantidad) || 0,
      unidad: datos.unidad || 'und',
      precio: parseFloat(datos.precio) || 0,
      categoria: datos.categoria || 'otros',
      notas: datos.notas || '',
      creado: datos.creado || new Date().toISOString()
    };

    return {
      success: true,
      data: material
    };
  }

  /**
   * Exportar materiales de cotización a CSV
   */
  static exportarACSV(materiales, nombreCotizacion = 'cotizacion') {
    if (!Array.isArray(materiales) || materiales.length === 0) {
      alert('No hay materiales para exportar');
      return;
    }

    const headers = ['Nombre', 'Descripción', 'Cantidad', 'Unidad', 'Precio Unitario', 'Subtotal', 'Categoría'];
    const rows = materiales.map(m => [
      m.nombre,
      m.descripcion || '',
      m.cantidad,
      m.unidad,
      m.precio,
      m.cantidad * m.precio,
      m.categoria || 'Otros'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${nombreCotizacion}-materiales.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Renderizar fila de material en tabla
   */
  static renderizarFilaMaterial(material, indice, editable = true) {
    const subtotal = material.cantidad * material.precio;

    return `
      <tr class="material-row" data-id="${material.id}">
        <td>${indice}</td>
        <td>
          <strong>${material.nombre}</strong>
          ${material.descripcion ? `<br><small>${material.descripcion}</small>` : ''}
        </td>
        <td>
          ${editable ? `<input type="number" value="${material.cantidad}" class="mat-cantidad" min="0" step="0.1">` : material.cantidad}
        </td>
        <td>${material.unidad}</td>
        <td>
          ${editable ? `<input type="number" value="${material.precio}" class="mat-precio" min="0" step="0.01">` : QuotationUtils.formatCurrency(material.precio)}
        </td>
        <td>
          <strong>${QuotationUtils.formatCurrency(subtotal)}</strong>
        </td>
        ${editable ? `
          <td>
            <button class="btn-icon" onclick="eliminarMaterialFila(${material.id})">🗑️</button>
          </td>
        ` : ''}
      </tr>
    `;
  }
}
