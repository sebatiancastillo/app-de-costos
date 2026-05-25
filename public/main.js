
  // ── Estado global del formulario ──
  let colorActual = { hex: '#7a4f2d', name: 'Nogal' };
  let sizeActual  = 'pequeño';
  let matId       = 1;
  let mediaFiles  = [];

  // ── Formato de moneda COP ──
  const fmt = n => '$ ' + Math.round(n).toLocaleString('es-CO');

  // ── Inicializar primer material ──
  window.addEventListener('DOMContentLoaded', () => {
    agregarMaterial();
    actualizarPreview();
  });

  // ── Seleccionar tamaño ──
  function selSize(el) {
    document.querySelectorAll('.size-opt').forEach(o => o.classList.remove('sel'));
    el.classList.add('sel');
    sizeActual = el.dataset.size;
    actualizarPreview();
  }

  // ── Seleccionar color ──
  function selColor(el) {
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('sel'));
    el.classList.add('sel');
    colorActual = { hex: el.dataset.color, name: el.dataset.name };
    document.getElementById('customColor').value = el.dataset.color;
    actualizarColorNote();
    actualizarPreview();
  }

  function selColorCustom(input) {
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('sel'));
    colorActual = { hex: input.value, name: 'Personalizado' };
    actualizarColorNote();
    actualizarPreview();
  }

  function actualizarColorNote() {
    document.getElementById('colorNote').innerHTML =
      `<span class="dot" style="background:${colorActual.hex};"></span> ${colorActual.name} — <span style="color:var(--muted)">${colorActual.hex}</span>`;
  }

  // ── Agregar fila de material ──
  function agregarMaterial() {
    const id = matId++;
    const tbody = document.getElementById('matBody');
    const tr = document.createElement('tr');
    tr.id = `mat-${id}`;
    tr.innerHTML = `
      <td><input type="text" placeholder="MDF, madera pino..." oninput="calcMatRow(${id})"/></td>
      <td><input type="number" id="qty-${id}" placeholder="0" min="0" oninput="calcMatRow(${id})"/></td>
      <td>
        <select id="unit-${id}">
          <option>und</option><option>m²</option><option>ml</option><option>lam</option>
          <option>var</option><option>lit</option><option>kg</option><option>cja</option>
          <option>pli</option><option>mt</option>
        </select>
      </td>
      <td><input type="number" id="price-${id}" placeholder="0" min="0" oninput="calcMatRow(${id})"/></td>
      <td><span class="mat-sub" id="sub-${id}">—</span></td>
      <td><button class="mat-del-btn" onclick="eliminarMaterial(${id})">✕</button></td>
    `;
    tbody.appendChild(tr);
  }

  function calcMatRow(id) {
    const q = parseFloat(document.getElementById(`qty-${id}`)?.value) || 0;
    const p = parseFloat(document.getElementById(`price-${id}`)?.value) || 0;
    const sub = q * p;
    const el = document.getElementById(`sub-${id}`);
    if (el) el.textContent = sub > 0 ? fmt(sub) : '—';
    actualizarPreview();
  }

  function eliminarMaterial(id) {
    const row = document.getElementById(`mat-${id}`);
    if (row) row.remove();
    actualizarPreview();
  }

  // ── Calcular total de materiales ──
  function calcMateriales() {
    let total = 0;
    document.querySelectorAll('#matBody tr').forEach(tr => {
      const id = tr.id.replace('mat-', '');
      const q = parseFloat(document.getElementById(`qty-${id}`)?.value) || 0;
      const p = parseFloat(document.getElementById(`price-${id}`)?.value) || 0;
      total += q * p;
    });
    return total;
  }

  // ── Actualizar preview de costos ──
  function actualizarPreview() {
    const mat    = calcMateriales();
    const hours  = parseFloat(document.getElementById('laborHours').value) || 0;
    const rate   = parseFloat(document.getElementById('laborRate').value) || 0;
    const lab    = hours * rate;
    const ov     = parseInt(document.getElementById('overhead').value) || 0;
    const mrg    = parseInt(document.getElementById('margin').value) || 0;
    const sub    = mat + lab;
    const ovAmt  = sub * (ov / 100);
    const base   = sub + ovAmt;
    const mrgAmt = base * (mrg / 100);
    const total  = base + mrgAmt;

    document.getElementById('prevMat').textContent   = fmt(mat);
    document.getElementById('prevLab').textContent   = fmt(lab);
    document.getElementById('prevSub').textContent   = fmt(sub);
    document.getElementById('prevOv').textContent    = fmt(ovAmt);
    document.getElementById('prevMrg').textContent   = '+ ' + fmt(mrgAmt);
    document.getElementById('prevTotal').textContent = fmt(total);
    document.getElementById('overheadVal').textContent = ov + '%';
    document.getElementById('marginVal').textContent   = mrg + '%';
    document.getElementById('ovPct').textContent   = ov;
    document.getElementById('mrgPct').textContent  = mrg;

    const name = document.getElementById('projectName').value;
    document.getElementById('prevName').textContent = name || '';

    // Tags
    if (total > 0) {
      document.getElementById('tagsRow').style.display = 'flex';
      document.getElementById('tagGanancia').textContent = '✅ ' + fmt(mrgAmt);
      const roi = base > 0 ? ((mrgAmt / base) * 100).toFixed(1) : 0;
      document.getElementById('tagRoi').textContent = 'ROI ' + roi + '%';
    } else {
      document.getElementById('tagsRow').style.display = 'none';
    }

    // Spec summary
    actualizarSpecSummary();
  }

  function actualizarSpecSummary() {
    const w = document.getElementById('width').value;
    const h = document.getElementById('height').value;
    const d = document.getElementById('depth').value;
    const delivery = document.getElementById('deliveryDays').value;
    const hasMedidas = w || h || d;

    if (!sizeActual && !hasMedidas && !colorActual.hex && !delivery) {
      document.getElementById('specSummary').style.display = 'none';
      return;
    }

    document.getElementById('specSummary').style.display = 'block';
    const sizeLabels = {pequeño:'Pequeño',mediano:'Mediano',grande:'Grande',set:'Set / Conjunto'};
    let html = '';
    if (sizeActual) html += `<span class="spec-tag spec-tag-a">${sizeLabels[sizeActual]||sizeActual}</span>`;
    if (hasMedidas) html += `<span class="spec-tag spec-tag-t">📐 ${w||'?'}×${h||'?'}×${d||'?'} cm</span>`;
    if (colorActual.hex) html += `<span class="spec-tag spec-tag-t" style="display:flex;align-items:center;gap:4px;"><span class="dot" style="background:${colorActual.hex}"></span>${colorActual.name}</span>`;
    if (delivery) html += `<span class="spec-tag spec-tag-t">🚚 ${delivery} días</span>`;
    document.getElementById('specTags').innerHTML = html;
  }

  // ── Manejo de archivos multimedia ──
  function handleFiles(files) {
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video') ? 'video' : 'image';
      mediaFiles.push({ url, type, name: file.name });
      renderMediaThumb(mediaFiles.length - 1, url, type);
    });
  }

  function handleDrop(e) {
    e.preventDefault();
    document.getElementById('mediaZone').classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
  }

  function renderMediaThumb(i, url, type) {
    const grid = document.getElementById('mediaGrid');
    const div = document.createElement('div');
    div.className = 'media-thumb';
    div.id = `thumb-${i}`;
    if (type === 'image') {
      div.innerHTML = `<img src="${url}" alt="ref"/><button class="media-del" onclick="eliminarMedia(${i})">✕</button>`;
    } else {
      div.innerHTML = `<div class="vid-icon">🎬</div><button class="media-del" onclick="eliminarMedia(${i})">✕</button>`;
    }
    grid.appendChild(div);
  }

  function eliminarMedia(i) {
    mediaFiles[i] = null;
    const el = document.getElementById(`thumb-${i}`);
    if (el) el.remove();
  }

  // ── Guardar cotización ──
  function guardarCotizacion() {
    const name = document.getElementById('projectName').value.trim();
    if (!name) { mostrarToast('⚠️ Ingresa el nombre del proyecto'); return; }

    const mat    = calcMateriales();
    const hours  = parseFloat(document.getElementById('laborHours').value) || 0;
    const rate   = parseFloat(document.getElementById('laborRate').value) || 0;
    const ov     = parseInt(document.getElementById('overhead').value) || 0;
    const mrg    = parseInt(document.getElementById('margin').value) || 0;
    const sub    = mat + (hours * rate);
    const base   = sub + sub * (ov/100);
    const total  = base + base * (mrg/100);

    const proyecto = {
      id: Date.now(),
      projectName: name,
      client:       document.getElementById('client').value,
      description:  document.getElementById('description').value,
      category:     document.getElementById('category').value,
      size:         sizeActual,
      width:        document.getElementById('width').value,
      height:       document.getElementById('height').value,
      depth:        document.getElementById('depth').value,
      color:        colorActual.hex,
      colorName:    colorActual.name,
      deliveryDays: document.getElementById('deliveryDays').value,
      laborHours:   hours,
      laborRate:    rate,
      overhead:     ov,
      margin:       mrg,
      total:        total,
      date:         new Date().toISOString().split('T')[0],
    };

    // Guardar en localStorage
    const proyectos = JSON.parse(localStorage.getItem('cotipro_proyectos') || '[]');
    proyectos.unshift(proyecto);
    localStorage.setItem('cotipro_proyectos', JSON.stringify(proyectos));

    mostrarToast('✅ Cotización guardada correctamente');
    setTimeout(() => { window.location.href = 'proyectos.html'; }, 1500);
  }

  // ── Limpiar formulario ──
  function limpiarForm() {
    document.getElementById('projectName').value = '';
    document.getElementById('client').value = '';
    document.getElementById('description').value = '';
    document.getElementById('deliveryDays').value = '15';
    document.getElementById('width').value = '';
    document.getElementById('height').value = '';
    document.getElementById('depth').value = '';
    document.getElementById('laborHours').value = '';
    document.getElementById('laborRate').value = '';
    document.getElementById('overhead').value = 15;
    document.getElementById('margin').value = 30;
    document.getElementById('matBody').innerHTML = '';
    document.getElementById('mediaGrid').innerHTML = '';
    mediaFiles = [];
    matId = 1;
    agregarMaterial();
    actualizarPreview();
    mostrarToast('🗑️ Formulario limpiado');
  }

  // ── Toast ──
  function mostrarToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }

  // ═══════════════════════════════════════════════════════════════
  // FUNCIONES DE EDICIÓN (V2)
  // ═══════════════════════════════════════════════════════════════

  async function cargarModeloYControlador() {
    if (!window.CotizacionModel) {
      await new Promise(resolve => {
        const script = document.createElement('script');
        script.src = 'models/Cotizacion.js';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }
    if (!window.CotizacionController) {
      await new Promise(resolve => {
        const script = document.createElement('script');
        script.src = 'controllers/CotizacionController.js';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }
  }

  async function initEdicion() {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    
    if (editId) {
      await cargarModeloYControlador();
      const cotizacion = CotizacionController.obtenerPorId(editId);
      
      if (!cotizacion) {
        mostrarToast('❌ Cotización no encontrada');
        return;
      }
      
      if (!CotizacionModel.puedeEditar(cotizacion)) {
        mostrarToast('⚠️ Esta cotización no se puede editar en su estado actual');
        return;
      }

      editandoId = cotizacion.id;
      cargarDatosEnFormulario(cotizacion);
      mostrarToast('✏️ Editando cotización #' + editId);
    }
  }

  function cargarDatosEnFormulario(c) {
    document.getElementById('projectName').value = c.proyecto || '';
    document.getElementById('client').value = c.cliente || '';
    document.getElementById('phone').value = c.telefono || '';
    document.getElementById('address').value = c.direccion || '';
    document.getElementById('description').value = c.descripcion || '';
    document.getElementById('category').value = c.categoria || 'otro';
    
    if (c.tamano) {
      const sizeEl = document.querySelector(`.size-opt[data-size="${c.tamano}"]`);
      if (sizeEl) selSize(sizeEl);
    }
    
    if (c.ancho) document.getElementById('width').value = c.ancho;
    if (c.alto) document.getElementById('height').value = c.alto;
    if (c.fondo) document.getElementById('depth').value = c.fondo;
    
    if (c.color) {
      const swatch = document.querySelector(`.swatch[data-color="${c.color}"]`);
      if (swatch) selColor(swatch);
      else { colorActual = { hex: c.color, name: c.colorNombre || 'Personalizado' }; actualizarColorNote(); }
    }
    
    if (c.tiempoEntrega) document.getElementById('deliveryDays').value = c.tiempoEntrega;
    
    if (c.manoObra) {
      document.getElementById('laborTask').value = c.manoObra.tarea || '';
      document.getElementById('laborHours').value = c.manoObra.horas || '';
      document.getElementById('laborCollaborator').value = c.manoObra.colaborador || '';
      document.getElementById('laborRate').value = c.manoObra.tarifa || '';
    }
    
    if (c.overhead) {
      document.getElementById('overhead').value = c.overhead;
      document.getElementById('overheadVal').textContent = c.overhead + '%';
    }
    if (c.margen) {
      document.getElementById('margin').value = c.margen;
      document.getElementById('marginVal').textContent = c.margen + '%';
    }

    // Cargar materiales
    document.getElementById('matBody').innerHTML = '';
    matId = 1;
    if (c.materiales && c.materiales.length > 0) {
      c.materiales.forEach(m => {
        agregarMaterial();
        const tr = document.getElementById(`mat-${matId-1}`);
        if (tr) {
          tr.querySelector('input[type="text"]').value = m.nombre || '';
          tr.querySelector('input[type="number"]').value = m.cantidad || '';
          const unitSel = tr.querySelector('select');
          if (unitSel && m.unidad) unitSel.value = m.unidad;
          const priceInput = tr.querySelectorAll('input[type="number"]')[1];
          if (priceInput) priceInput.value = m.precio || '';
          calcMatRow(matId - 1);
        }
      });
    } else {
      agregarMaterial();
    }
    
    actualizarPreview();
  }

  // ═══════════════════════════════════════════════════════════════
  // GUARDAR (crear o actualizar)
  // ═══════════════════════════════════════════════════════════════
  const guardarOriginal = guardarCotizacion;
  guardarCotizacion = function() {
    const name = document.getElementById('projectName').value.trim();
    if (!name) { mostrarToast('⚠️ Ingresa el nombre del proyecto'); return; }

    const datos = obtenerDatosFormulario();
    
    if (editandoId) {
      const result = CotizacionController.actualizar(editandoId, datos);
      if (result.success) {
        mostrarToast('✅ Cotización actualizada');
        setTimeout(() => { window.location.href = '../views/CotizacionList.html'; }, 1500);
      } else {
        mostrarToast('❌ ' + (result.errores?.join(', ') || result.error));
      }
    } else {
      guardarOriginal();
    }
  };

  function obtenerDatosFormulario() {
    const materiales = [];
    document.querySelectorAll('#matBody tr').forEach(tr => {
      const inputs = tr.querySelectorAll('input, select');
      if (inputs[0].value) {
        materiales.push({
          nombre: inputs[0].value,
          cantidad: parseFloat(inputs[1].value) || 0,
          unidad: inputs[2].value,
          precio: parseFloat(inputs[3].value) || 0
        });
      }
    });

    return {
      projectName: document.getElementById('projectName').value,
      client: document.getElementById('client').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      description: document.getElementById('description').value,
      category: document.getElementById('category').value,
      size: sizeActual,
      width: document.getElementById('width').value,
      height: document.getElementById('height').value,
      depth: document.getElementById('depth').value,
      color: colorActual.hex,
      colorName: colorActual.name,
      deliveryDays: document.getElementById('deliveryDays').value,
      laborTask: document.getElementById('laborTask').value,
      laborHours: document.getElementById('laborHours').value,
      laborCollaborator: document.getElementById('laborCollaborator').value,
      laborRate: document.getElementById('laborRate').value,
      overhead: document.getElementById('overhead').value,
      margin: document.getElementById('margin').value,
      materiales
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // INICIALIZAR CON EDICIÓN SI APLICA
  // ═══════════════════════════════════════════════════════════════
  window.addEventListener('DOMContentLoaded', () => {
    agregarMaterial();
    actualizarPreview();
    initEdicion();
  });
