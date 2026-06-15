/**
 * MANO DE OBRA MODULE - Gestión de tareas y mano de obra
 * Responsabilidad: CRUD de tareas, cálculos de horas/tarifa, asignación de colaboradores
 */

class ManoObraModule {
  
  static STORAGE_KEY = 'vikingos_colaboradores';
  
  /**
   * Obtener todos los colaboradores
   */
  static obtenerColaboradores() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Guardar colaborador
   */
  static guardarColaborador(colaborador) {
    const colaboradores = this.obtenerColaboradores();
    
    const existe = colaboradores.findIndex(c => c.id === colaborador.id);
    if (existe >= 0) {
      colaboradores[existe] = colaborador;
    } else {
      colaboradores.push({
        id: colaborador.id || Date.now(),
        ...colaborador
      });
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(colaboradores));
    return true;
  }

  /**
   * Eliminar colaborador
   */
  static eliminarColaborador(id) {
    let colaboradores = this.obtenerColaboradores();
    colaboradores = colaboradores.filter(c => c.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(colaboradores));
    return true;
  }

  /**
   * Calcular costo de mano de obra por tarea
   */
  static calcularCostoTarea(horas, tarifa) {
    const hrs = parseFloat(horas) || 0;
    const tar = parseFloat(tarifa) || 0;
    return hrs * tar;
  }

  /**
   * Calcular total de mano de obra
   */
  static calcularTotalManoObra(tareas = []) {
    return tareas.reduce((total, tarea) => {
      const horas = parseFloat(tarea.horas) || 0;
      const tarifa = parseFloat(tarea.tarifa) || 0;
      return total + (horas * tarifa);
    }, 0);
  }

  /**
   * Obtener tareas por colaborador
   */
  static obtenerTareasPorColaborador(tareas = [], colaboradorId) {
    return tareas.filter(t => t.colaborador === colaboradorId);
  }

  /**
   * Calcular horas totales de un colaborador
   */
  static calcularHorasColaborador(tareas = [], colaboradorId) {
    return tareas
      .filter(t => t.colaborador === colaboradorId)
      .reduce((total, t) => total + (parseFloat(t.horas) || 0), 0);
  }

  /**
   * Validar tarea
   */
  static validarTarea(tarea) {
    const errores = [];
    
    if (!tarea.nombre || !tarea.nombre.trim()) {
      errores.push('El nombre de la tarea es obligatorio');
    }
    
    if (parseFloat(tarea.horas) <= 0) {
      errores.push('Las horas deben ser mayores a 0');
    }
    
    if (parseFloat(tarea.tarifa) < 0) {
      errores.push('La tarifa no puede ser negativa');
    }
    
    if (!tarea.colaborador || tarea.colaborador === 'sin-asignar') {
      errores.push('Debe asignar un colaborador');
    }
    
    return errores;
  }

  /**
   * Crear tarea
   */
  static crearTarea(datos) {
    const errores = this.validarTarea(datos);
    if (errores.length > 0) {
      return { success: false, errores };
    }

    const tarea = {
      id: datos.id || Date.now(),
      nombre: datos.nombre,
      descripcion: datos.descripcion || '',
      horas: parseFloat(datos.horas) || 0,
      tarifa: parseFloat(datos.tarifa) || 0,
      colaborador: datos.colaborador,
      categoria: datos.categoria || 'general',
      notas: datos.notas || '',
      creado: datos.creado || new Date().toISOString()
    };

    return {
      success: true,
      data: tarea
    };
  }

  /**
   * Obtener categorías de tareas
   */
  static obtenerCategoriasTareas() {
    return [
      { id: 'carpinteria', nombre: 'Carpintería', icon: '🪵' },
      { id: 'acabado', nombre: 'Acabado', icon: '✨' },
      { id: 'tapizado', nombre: 'Tapizado', icon: '🎨' },
      { id: 'ensamble', nombre: 'Ensamble', icon: '🔩' },
      { id: 'instalacion', nombre: 'Instalación', icon: '⚙️' },
      { id: 'general', nombre: 'General', icon: '👷' }
    ];
  }

  /**
   * Renderizar fila de tarea
   */
  static renderizarFilaTarea(tarea, indice, editable = true) {
    const costo = tarea.horas * tarea.tarifa;

    return `
      <tr class="tarea-row" data-id="${tarea.id}">
        <td>${indice}</td>
        <td>
          <strong>${tarea.nombre}</strong>
          ${tarea.descripcion ? `<br><small>${tarea.descripcion}</small>` : ''}
        </td>
        <td>
          ${editable ? `<input type="number" value="${tarea.horas}" class="tarea-horas" min="0" step="0.5">` : tarea.horas}
        </td>
        <td>
          ${editable ? `<input type="number" value="${tarea.tarifa}" class="tarea-tarifa" min="0" step="0.01">` : QuotationUtils.formatCurrency(tarea.tarifa)}
        </td>
        <td><strong>${QuotationUtils.formatCurrency(costo)}</strong></td>
        <td>${tarea.colaborador || '—'}</td>
        ${editable ? `
          <td>
            <button class="btn-icon" onclick="eliminarTareaFila(${tarea.id})">🗑️</button>
          </td>
        ` : ''}
      </tr>
    `;
  }

  /**
   * Renderizar tabla de colaboradores
   */
  static renderizarTablaColaboradores(colaboradores = []) {
    if (colaboradores.length === 0) {
      return '<p>No hay colaboradores registrados.</p>';
    }

    return `
      <table class="colaboradores-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>Tarifa Hora</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${colaboradores.map(col => `
            <tr>
              <td><strong>${col.nombre}</strong></td>
              <td>${col.cargo || '—'}</td>
              <td>${QuotationUtils.formatCurrency(col.tarifaHora)}</td>
              <td>${col.telefono || '—'}</td>
              <td>
                <button class="btn-icon" onclick="editarColaborador(${col.id})">✏️</button>
                <button class="btn-icon" onclick="eliminarColaborador(${col.id})">🗑️</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}
