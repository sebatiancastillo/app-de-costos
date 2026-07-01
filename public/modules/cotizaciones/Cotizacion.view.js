  let colorActual = { hex: '#7a4f2d', name: 'Nogal' };
  let sizeActual  = 'pequeño';
  let matId       = 1;
  let mediaFiles  = [];
  let editandoId  = null;

  const fmt = n => '$ ' + Math.round(n).toLocaleString('es-CO');

  window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('matBody')) {
      agregarMaterial();
      actualizarPreview();
    }
  });

  function selSize(el) {
    document.querySelectorAll('.size-opt').forEach(o => o.classList.remove('sel'));
    el.classList.add('sel');
    sizeActual = el.dataset.size;
    actualizarPreview();
  }

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

  function agregarMaterial() {
    const id = matId++;
    const tbody = document.getElementById('matBody');
    if (!tbody) return;
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

    if (total > 0) {
      document.getElementById('tagsRow').style.display = 'flex';
      document.getElementById('tagGanancia').textContent = '✅ ' + fmt(mrgAmt);
      const roi = base > 0 ? ((mrgAmt / base) * 100).toFixed(1) : 0;
      document.getElementById('tagRoi').textContent = 'ROI ' + roi + '%';
    } else {
      document.getElementById('tagsRow').style.display = 'none';
    }

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

    const proyectos = JSON.parse(localStorage.getItem('cotipro_proyectos') || '[]');
    proyectos.unshift(proyecto);
    localStorage.setItem('cotipro_proyectos', JSON.stringify(proyectos));

    mostrarToast('✅ Cotización guardada correctamente');
    setTimeout(() => { window.location.href = 'proyectos.html'; }, 1500);
  }

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

  function mostrarToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }

  async function cargarModeloYControlador() {
    if (!window.CotizacionModel) {
      await new Promise(resolve => {
        const script = document.createElement('script');
        script.src = '../modules/cotizaciones/Cotizacion.model.js';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }
    if (!window.CotizacionController) {
      await new Promise(resolve => {
        const script = document.createElement('script');
        script.src = '../modules/cotizaciones/Cotizacion.controller.js';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }
  }

  async function initEdicion() {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit') || params.get('id');

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

  const guardarOriginal = guardarCotizacion;
  guardarCotizacion = function() {
    const name = document.getElementById('projectName').value.trim();
    if (!name) { mostrarToast('⚠️ Ingresa el nombre del proyecto'); return; }

    const datos = obtenerDatosFormulario();

    if (editandoId) {
      const result = CotizacionController.actualizar(editandoId, datos);
      if (result.success) {
        mostrarToast('✅ Cotización actualizada');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
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

  window.addEventListener('DOMContentLoaded', () => {
    agregarMaterial();
    actualizarPreview();
    initEdicion();
  });

  class CotizacionView {
    static renderListaCotizaciones(cotizaciones) {
      if (!cotizaciones || cotizaciones.length === 0) {
        return `<div class="empty-state">
          <div class="empty-icon">📋</div>
          <div class="empty-title">Sin cotizaciones</div>
          <div class="empty-sub">Crea una nueva cotización para empezar</div>
        </div>`;
      }

      return cotizaciones.map(c => {
        const cfg = CotizacionModel.getEstadoConfig(c.estado);
        const fecha = new Date(c.fechaCreacion).toLocaleDateString('es-CO');
        const total = c.costos?.total || 0;

        return `<div class="cotiz-card">
          <div class="cotiz-card-header">
            <div>
              <div class="cotiz-titulo">${c.proyecto}</div>
              <div class="cotiz-id">#${c.id} · ${fecha}</div>
            </div>
            ${CotizacionView.renderEstadoBadge(c.estado)}
          </div>
          <div class="cotiz-info">
            <div class="cotiz-info-item"><span>Cliente</span>${c.cliente || '—'}</div>
            <div class="cotiz-info-item"><span>Categoría</span>${c.categoria || '—'}</div>
            <div class="cotiz-info-item"><span>Entrega</span>${c.tiempoEntrega || '—'} días</div>
          </div>
          <div class="cotiz-total">${formatCOP(total)}</div>
          <div class="cotiz-actions">
            <button class="btn btn-sm" style="background:var(--card2);color:var(--cream);border:1px solid var(--border);" onclick="CotizacionView.verDetalle(${c.id})">👁️ Ver</button>
            ${CotizacionModel.puedeEditar(c) ? `<button class="btn btn-sm btn-edit" onclick="CotizacionView.editar(${c.id})">✏️ Editar</button>` : ''}
            <button class="btn btn-sm btn-duplicar" onclick="CotizacionView.duplicar(${c.id})">📋 Duplicar</button>
            <button class="btn btn-sm btn-eliminar" onclick="CotizacionView.confirmarEliminar(${c.id})">🗑️</button>
          </div>
        </div>`;
      }).join('');
    }

    static renderEstadoBadge(estado) {
      const cfg = CotizacionModel.getEstadoConfig(estado);
      return `<span class="cotiz-estado" style="background:${cfg.color}22;color:${cfg.color};border:1px solid ${cfg.color}44;">
        ${cfg.icon} ${cfg.label}
      </span>`;
    }

    static renderBotonesEstado(estadoActual) {
      const permitidos = FLUJO_ESTADOS[estadoActual] || [];
      if (permitidos.length === 0) return '';

      return permitidos.map(est => {
        const cfg = CotizacionModel.getEstadoConfig(est);
        return `<button class="btn btn-sm btn-primary" onclick="CotizacionView.cambiarEstado(${estadoActual.id}, '${est}')">
          ${cfg.icon} ${cfg.label}
        </button>`;
      }).join('');
    }

    static mostrarAlerta(mensaje, tipo) {
      const toast = document.getElementById('toast');
      if (!toast) return;
      const iconos = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
      toast.innerHTML = `${iconos[tipo] || 'ℹ️'} ${mensaje}`;
      toast.className = 'toast show';
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => { toast.className = 'toast'; }, 3000);
    }

    static mostrarModal(titulo, contenido, acciones) {
      const overlay = document.getElementById('modalConfirm') || (() => {
        const d = document.createElement('div');
        d.className = 'modal-overlay';
        d.id = 'modalConfirm';
        d.innerHTML = `<div class="modal">
          <div class="modal-title" id="modalTitle"></div>
          <div class="modal-body" id="modalBody"></div>
          <div class="modal-actions" id="modalActions"></div>
        </div>`;
        document.body.appendChild(d);
        return d;
      })();

      document.getElementById('modalTitle').textContent = titulo;
      document.getElementById('modalBody').innerHTML = contenido;
      const actionsDiv = document.getElementById('modalActions');
      actionsDiv.innerHTML = (acciones || []).map(a =>
        `<button class="btn ${a.clase || 'btn-ghost'}" onclick="${a.onclick}">${a.texto}</button>`
      ).join('');

      overlay.classList.add('show');
    }

    static verDetalle(id) { window.location.href = `cotizacion_en_proceso.html?id=${id}`; }
    static editar(id) { window.location.href = `cotizar.html?id=${id}`; }

    static duplicar(id) {
      const r = CotizacionController.duplicar(id);
      CotizacionView.mostrarAlerta(r.success ? '✅ Cotización duplicada' : ('❌ ' + r.error), r.success ? 'success' : 'error');
      if (r.success && typeof aplicarFiltros === 'function') aplicarFiltros();
    }

    static confirmarEliminar(id) {
      CotizacionView.mostrarModal('¿Eliminar cotización?', 'Esta acción no se puede deshacer.', [
        { texto: 'Cancelar', clase: 'btn-ghost', onclick: 'CotizacionView.cerrarModal()' },
        { texto: 'Eliminar', clase: 'btn-primary', onclick: `CotizacionView.eliminar(${id})` }
      ]);
    }

    static eliminar(id) {
      const r = CotizacionController.eliminar(id);
      CotizacionView.mostrarAlerta(r.success ? '🗑️ Eliminada' : '❌ Error', r.success ? 'success' : 'error');
      CotizacionView.cerrarModal();
      if (r.success && typeof aplicarFiltros === 'function') aplicarFiltros();
    }

    static cambiarEstado(id, nuevoEstado) {
      const r = CotizacionController.cambiarEstado(id, nuevoEstado);
      CotizacionView.mostrarAlerta(
        r.success ? `✅ Cambió a ${CotizacionModel.getEstadoLabel(nuevoEstado)}` : ('❌ ' + r.error),
        r.success ? 'success' : 'error'
      );
      if (r.success) setTimeout(() => location.reload(), 1200);
    }

    static cerrarModal() {
      const overlay = document.getElementById('modalConfirm');
      if (overlay) overlay.classList.remove('show');
    }

    static renderPreview(d) {
      if (!d) return;
      const fmt = formatCOP;
      const showDetails = document.getElementById('toggleDesgloseCostos')?.checked;
      document.getElementById('previewCliente').textContent = d.cliente?.nombre || '—';
      const waEl = document.getElementById('previewWhatsappCliente');
      if (waEl) waEl.textContent = d.cliente?.whatsapp ? '📱 ' + d.cliente.whatsapp : '';
      const ciEl = document.getElementById('previewCiudadCliente');
      if (ciEl) ciEl.textContent = d.cliente?.ciudad ? '📍 ' + d.cliente.ciudad : '';
      document.getElementById('previewProyecto').textContent = d.proyecto?.nombre || '—';
      const dimEl = document.getElementById('previewDimensionesGenerales');
      if (dimEl) {
        const dg = d.proyecto?.dimensionesGenerales || {};
        const parts = [];
        if (dg.alto) parts.push(dg.alto + ' cm alto');
        if (dg.ancho) parts.push(dg.ancho + ' cm ancho');
        if (dg.profundo) parts.push(dg.profundo + ' cm prof');
        dimEl.textContent = parts.length ? '📐 ' + parts.join(' × ') : '';
      }
      document.getElementById('previewTipoTrabajo').textContent = d.proyecto?.tipo || '—';
      const valEl = document.getElementById('previewValidez');
      if (valEl) valEl.textContent = d.proyecto?.validez ? '⏱ Válido por ' + d.proyecto.validez + ' días' : '';

      document.getElementById('previewMaterial').textContent = '—';

      const medidas = d.especificaciones?.medidas || {};
      document.getElementById('previewMedidas').textContent =
        [medidas.largo, medidas.ancho, medidas.alto].filter(Boolean).join(' × ') + (medidas.grosor ? ` (grosor ${medidas.grosor}mm)` : '') || '—';

      const items = d.items || [];
      const itemsSummaryEl = document.getElementById('previewItemsSummary');
      if (itemsSummaryEl) {
        if (items.length > 0) {
          var catCount = 0, persCount = 0, catTotal = 0;
          items.forEach(function(it) {
            if (it.tipo === 'catalogo') { catCount++; catTotal += (it.subtotal || 0); }
            else { persCount++; }
          });
          itemsSummaryEl.innerHTML = items.length + ' ítem' + (items.length !== 1 ? 's' : '') + ' (' + catCount + ' catálogo, ' + persCount + ' personalizado' + (persCount !== 1 ? 's' : '') + ')';
        } else { itemsSummaryEl.textContent = ''; }
      }

      const cs = d.costos || {};
      var matTotal = typeof cs.materiales === 'object' ? (cs.materiales.total || 0) : (cs.materiales || 0);
      var moTotal = typeof cs.manoObra === 'object' ? (cs.manoObra.total || 0) : (cs.manoObra || 0);
      const suma = matTotal + moTotal + (cs.herrajes || 0) + (cs.herramientas || 0) + (cs.transporte || 0) + (cs.subcontratos || 0);

      document.getElementById('previewCostoMateriales').textContent = fmt(matTotal);
      const herrajesEl = document.getElementById('previewCostoHerrajes');
      if (herrajesEl) herrajesEl.textContent = fmt(cs.herrajes || 0);
      document.getElementById('previewCostoManoObra').textContent = fmt(moTotal);
      document.getElementById('previewCostoHerramientas').textContent = fmt(cs.herramientas || 0);
      document.getElementById('previewCostoTransporte').textContent = fmt(cs.transporte || 0);
      document.getElementById('previewCostoSubcontratos').textContent = fmt(cs.subcontratos || 0);
      document.getElementById('previewSumaCostos').textContent = fmt(suma);
      document.getElementById('previewMargen').textContent = (cs.margenGanancia || 0) + '%';

      const pf = cs.precioFinal || CotizacionModel.calcularPrecioFinal(cs, cs.margenGanancia);
      document.getElementById('previewPrecioFinal').textContent = fmt(pf);

      const costoRow = document.getElementById('costoTransporteRow');
      if (costoRow) costoRow.style.display = cs.transporte > 0 ? 'flex' : 'none';
      const details = document.getElementById('previewDetails');
      if (details) details.style.display = showDetails ? 'block' : 'none';
    }

    static mostrarModalChecklist(onConfirm) {
      const items = [
        'Información del cliente completa',
        'Medidas verificadas',
        'Material confirmado con disponibilidad',
        'Fotos o referencias adjuntas',
        'Costos revisados',
        'Margen aplicado',
        'Fecha de entrega realista'
      ];

      const overlay = document.getElementById('modalConfirm') || document.body.appendChild(
        Object.assign(document.createElement('div'), { className: 'modal-overlay', id: 'modalConfirm' })
      );
      overlay.innerHTML = `
        <div class="modal" style="max-width:480px;">
          <div class="modal-title">Checklist antes de enviar</div>
          <div class="modal-body">
            ${items.map((txt, i) => `
              <label class="checklist-item" data-idx="${i}">
                <input type="checkbox" class="checklist-check" onchange="CotizacionView._onChecklistToggle()"/>
                <span class="checklist-label">${txt}</span>
              </label>
            `).join('')}
          </div>
          <div class="modal-actions">
            <button class="btn btn-ghost" onclick="CotizacionView.cerrarModal()">Cancelar</button>
            <button class="btn btn-primary" id="checklistConfirmBtn" disabled onclick="CotizacionView._onChecklistConfirm()">Confirmar envío</button>
          </div>
        </div>`;
      overlay.classList.add('show');
      window._checklistOnConfirm = onConfirm;
    }

    static _onChecklistToggle() {
      const checks = document.querySelectorAll('.checklist-check');
      const allChecked = Array.from(checks).every(c => c.checked);
      const btn = document.getElementById('checklistConfirmBtn');
      if (btn) btn.disabled = !allChecked;
      checks.forEach(c => {
        c.closest('.checklist-item').classList.toggle('checked', c.checked);
      });
    }

    static _onChecklistConfirm() {
      if (typeof window._checklistOnConfirm === 'function') {
        window._checklistOnConfirm();
      }
      CotizacionView.cerrarModal();
    }

    static recolectarDatosFormulario() {
      const g = id => document.getElementById(id);
      const v = id => g(id)?.value || '';
      const n = id => parseFloat(g(id)?.value) || 0;

      const cortes = Array.from(document.querySelectorAll('input[name="corteEspecial"]:checked')).map(c => c.value);

      return {
        id: parseInt(g('editandoId')?.value) || null,
        tipoCliente: v('tipoCliente'),
        nombreCliente: v('nombreCliente'),
        contactoPrincipal: v('contactoPrincipal'),
        whatsapp: v('whatsapp'),
        telefono: v('telefono'),
        email: v('email'),
        direccionEntrega: v('direccionEntrega'),
        ciudad: v('ciudad'),
        barrio: v('barrio'),
        comoNosConocio: v('comoNosConocio'),
        tipoTrabajo: v('tipoTrabajo'),
        tipoTrabajoOtro: v('tipoTrabajoOtro'),
        nombreProyecto: v('nombreProyecto'),
        descripcionProyecto: v('descripcionProyecto'),
        altoGeneral: n('altoGeneral'),
        anchoGeneral: n('anchoGeneral'),
        profundoGeneral: n('profundoGeneral'),
        observaciones: v('observaciones'),
        validezCotizacion: v('validezCotizacion'),
        ubicacionInstalacion: g('ubicacionInterior')?.checked ? 'interior' : g('ubicacionExterior')?.checked ? 'exterior' : g('ubicacionHumeda')?.checked ? 'area_humeda' : 'otro',
        fechaEntregaDeseada: v('fechaEntregaDeseada'),
        largo: n('largo'),
        ancho: n('ancho'),
        alto: n('alto'),
        grosor: n('grosor'),
        cortesEspeciales: cortes,
        cantidadPiezas: n('cantidadPiezas') || 1,
        nivelDificultad: g('nivelBasico')?.checked ? 'basico' : g('nivelMedio')?.checked ? 'medio' : 'alto',
        items: typeof itemsData !== 'undefined' ? itemsData : [],
        materialesItems: typeof listaMateriales !== 'undefined' ? listaMateriales.map(function(m) { return { articulo: m.articulo, color: m.color, proveedor: m.proveedor, cantidad: m.cantidad, unidad: m.unidad, precioUnitario: m.precioUnitario, precioFinal: m.precioFinal, observaciones: m.observaciones }; }) : [],
        materialesTotal: typeof calcularTotalMateriales === 'function' ? calcularTotalMateriales() : 0,
        manoObraItems: typeof listaTareas !== 'undefined' ? listaTareas.map(function(t) { return { nombre: t.nombre, colaborador: t.colaborador, horas: t.horas, tarifa: t.tarifa, subtotal: t.subtotal, descripcion: t.descripcion, dificultad: t.dificultad, maquina: t.maquina }; }) : [],
        manoObraTotal: typeof calcularTotalManoObra === 'function' ? calcularTotalManoObra() : 0,
        costoHerrajes: n('costoHerrajes'),
        costoHerramientas: n('costoHerramientas'),
        costoTransporte: n('costoTransporte'),
        costoSubcontratos: n('costoSubcontratos'),
        tiempoEstimadoDias: n('tiempoEstimadoDias'),
        margenGanancia: n('margenGanancia')
      };
    }
  }

  window.CotizacionView = CotizacionView;
