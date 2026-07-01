var itemsData = [];
var itemIdCounter = 0;
var selectedItemId = null;

function nextItemId() { return 'item-' + (++itemIdCounter); }

/* ── Item factory ── */
function crearItem(tipo) {
  var base = { id: nextItemId(), tipo: tipo, nombre: '' };
  if (tipo === 'catalogo') {
    base.cantidad = 1;
    base.precioUnitario = 0;
    base.subtotal = 0;
    base.notas = '';
    base.foto = null;
  } else {
    base.categoria = '';
    base.nombre = '';
    base.cantidad = 1;
    base.dimensiones = { alto: '', ancho: '', profundo: '', calibre: '' };
    base.material = '';
    base.especieMadera = '';
    base.acabados = [];
    base.colorReferencia = '';
    base.requiereInstalacion = false;
    base.detalles = '';
    base.foto = null;
  }
  return base;
}

/* ── Tipo selector modal ── */
function mostrarSelectorTipo() {
  if (itemsData.length >= 10) { mostrarToast('Máximo 10 ítems por cotización'); return; }
  var overlay = document.getElementById('modalConfirm') || document.body.appendChild(
    Object.assign(document.createElement('div'), { className: 'modal-overlay', id: 'modalConfirm' })
  );
  overlay.innerHTML = '<div class="modal" style="max-width:420px;"><div class="modal-title">¿Qué vas a cotizar?</div><div class="modal-body"><div class="tipo-selector">' +
    '<div class="tipo-card" onclick="seleccionarTipo(\'catalogo\')"><span class="tipo-icon">📦</span><div class="tipo-title">Del catálogo</div><div class="tipo-desc">Muebles que ya tienes diseñados con precio fijo</div></div>' +
    '<div class="tipo-card" onclick="seleccionarTipo(\'personalizado\')"><span class="tipo-icon">📐</span><div class="tipo-title">Personalizado</div><div class="tipo-desc">Mueble nuevo con medidas y materiales específicos</div></div>' +
    '</div></div><div class="modal-actions"><button class="btn btn-ghost" onclick="CotizacionView.cerrarModal()">Cancelar</button></div></div>';
  overlay.classList.add('show');
}

function seleccionarTipo(tipo) {
  CotizacionView.cerrarModal();
  agregarItem(tipo);
}

function agregarItemTipoSelect() {
  var tipo = document.getElementById('tipoFormularioSelect').value;
  agregarItem(tipo);
}

function onTipoFormularioChange() {
  if (itemsData.length === 0) {
    agregarItemTipoSelect();
  }
}

function agregarItem(tipo) {
  if (itemsData.length >= 10) { mostrarToast('Máximo 10 ítems por cotización'); return; }
  var nuevo = crearItem(tipo);
  itemsData.push(nuevo);
  selectedItemId = nuevo.id;
  renderItems();
  actualizarPreview();
}

/* ── Item CRUD ── */
function eliminarItem(id) {
  var idx = itemsData.findIndex(function(it) { return it.id === id; });
  if (idx === -1) return;
  mostrarConfirm('¿Eliminar este ítem?', function() {
    itemsData.splice(idx, 1);
    if (selectedItemId === id) {
      selectedItemId = itemsData.length > 0 ? itemsData[Math.min(idx, itemsData.length - 1)].id : null;
    }
    renderItems();
    actualizarPreview();
  });
}

function duplicarItem(id) {
  var src = itemsData.find(function(it) { return it.id === id; });
  if (!src) return;
  if (itemsData.length >= 10) { mostrarToast('Máximo 10 ítems por cotización'); return; }
  var dup = JSON.parse(JSON.stringify(src));
  dup.id = nextItemId();
  var idx = itemsData.findIndex(function(it) { return it.id === id; });
  itemsData.splice(idx + 1, 0, dup);
  selectedItemId = dup.id;
  renderItems();
  actualizarPreview();
}

function seleccionarItemPorDropdown(id) {
  selectedItemId = id;
  renderItems();
}

function navegarItem(delta) {
  var idx = itemsData.findIndex(function(it) { return it.id === selectedItemId; });
  if (idx === -1) return;
  var nueva = idx + delta;
  if (nueva < 0 || nueva >= itemsData.length) return;
  selectedItemId = itemsData[nueva].id;
  renderItems();
}

function moverItem(id, delta) {
  var idx = itemsData.findIndex(function(it) { return it.id === id; });
  if (idx === -1) return;
  var nueva = idx + delta;
  if (nueva < 0 || nueva >= itemsData.length) return;
  var item = itemsData.splice(idx, 1)[0];
  itemsData.splice(nueva, 0, item);
  selectedItemId = item.id;
  renderItems();
}

function actualizarHeaderUI(id) {
  var it = itemsData.find(function(i) { return i.id === id; });
  if (!it) return;
  var headerEl = document.querySelector('.item-name-header');
  if (headerEl) headerEl.textContent = it.nombre || '(sin nombre)';
  var opt = document.querySelector('#itemDropdown option[value="' + id + '"]');
  if (opt) {
    var idx = itemsData.indexOf(it);
    var tipoLabel = it.tipo === 'catalogo' ? 'Catálogo' : 'Personalizado';
    opt.textContent = 'ÍTEM ' + (idx + 1) + ' — ' + (it.nombre || '(sin nombre)') + ' (' + tipoLabel + ')';
  }
  var subtotalEl = document.querySelector('.item-subtotal-display');
  if (subtotalEl && it.tipo === 'catalogo') {
    subtotalEl.value = '$ ' + ((it.subtotal || 0).toLocaleString('es-CO'));
  }
}

function actualizarItem(id, prop, val) {
  var it = itemsData.find(function(i) { return i.id === id; });
  if (!it) return;
  if (prop.indexOf('.') > -1) {
    var parts = prop.split('.');
    if (parts.length === 2) {
      if (!it[parts[0]]) it[parts[0]] = {};
      it[parts[0]][parts[1]] = val;
    }
  } else {
    it[prop] = val;
  }
  if (it.tipo === 'catalogo') {
    it.subtotal = (parseFloat(it.cantidad) || 0) * (parseFloat(it.precioUnitario) || 0);
  }
  actualizarHeaderUI(id);
  actualizarPreview();
}

function actualizarItemCheckbox(id, prop) {
  var it = itemsData.find(function(i) { return i.id === id; });
  if (!it) return;
  it[prop] = !it[prop];
  actualizarPreview();
}

function actualizarItemAcabados(id, val) {
  var it = itemsData.find(function(i) { return i.id === id; });
  if (!it) return;
  if (!it.acabados) it.acabados = [];
  var idx = it.acabados.indexOf(val);
  if (idx > -1) { it.acabados.splice(idx, 1); } else { it.acabados.push(val); }
  actualizarPreview();
}

function actualizarItemArchivos(id, files) {
  var it = itemsData.find(function(i) { return i.id === id; });
  if (!it || !files || !files.length) return;
  var reader = new FileReader();
  reader.onload = function(e) { it.foto = e.target.result; actualizarPreview(); };
  reader.readAsDataURL(files[0]);
}

/* ── Render ── */
function renderItems() {
  var c = document.getElementById('itemsContainer');
  if (!c) return;
  if (itemsData.length === 0) {
    c.innerHTML = '<div style="text-align:center;padding:24px;color:var(--muted);font-size:13px;">Selecciona un tipo de formulario arriba para comenzar.</div>';
    actualizarResumen();
    selectedItemId = null;
    return;
  }
  if (!selectedItemId || !itemsData.some(function(it) { return it.id === selectedItemId; })) {
    selectedItemId = itemsData[0].id;
  }
  var html = '';

  /* ── Dropdown selector ── */
  html += '<div class="item-selector" style="margin-bottom:12px;">';
  html += '<label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;">Seleccionar ítem</label>';
  html += '<select id="itemDropdown" class="mueble-input" style="width:100%;padding:10px 12px;font-size:13px;" onchange="seleccionarItemPorDropdown(this.value)">';
  for (var i = 0; i < itemsData.length; i++) {
    var it = itemsData[i];
    var tipoLabel = it.tipo === 'catalogo' ? 'Catálogo' : 'Personalizado';
    var nombreLabel = it.nombre || '(sin nombre)';
    html += '<option value="' + it.id + '"' + (it.id === selectedItemId ? ' selected' : '') + '>ÍTEM ' + (i + 1) + ' — ' + escAttr(nombreLabel) + ' (' + tipoLabel + ')</option>';
  }
  html += '</select></div>';

  /* ── Selected item form ── */
  var it = itemsData.find(function(i) { return i.id === selectedItemId; });
  if (it) {
    var idx = itemsData.indexOf(it);
    var isCat = it.tipo === 'catalogo';
    var badgeClass = isCat ? 'item-badge-catalogo' : 'item-badge-personalizado';
    var badgeLabel = isCat ? 'Catálogo' : 'Personalizado';

    /* ── Navigation bar ── */
    html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">';
    html += '<button type="button" class="btn btn-sm btn-ghost" onclick="moverItem(\'' + it.id + '\',-1)"' + (idx === 0 ? ' disabled' : '') + ' style="font-size:11px;padding:4px 8px;" title="Mover arriba">↑</button>';
    html += '<button type="button" class="btn btn-sm btn-ghost" onclick="moverItem(\'' + it.id + '\',1)"' + (idx === itemsData.length - 1 ? ' disabled' : '') + ' style="font-size:11px;padding:4px 8px;" title="Mover abajo">↓</button>';
    html += '<span style="font-size:12px;color:var(--muted);text-align:center;flex:1;">ÍTEM ' + (idx + 1) + ' de ' + itemsData.length + '</span>';
    html += '<button type="button" class="btn btn-sm btn-outline" onclick="navegarItem(-1)"' + (idx === 0 ? ' disabled' : '') + ' style="font-size:11px;padding:4px 10px;">◀ Anterior</button>';
    html += '<button type="button" class="btn btn-sm btn-outline" onclick="navegarItem(1)"' + (idx === itemsData.length - 1 ? ' disabled' : '') + ' style="font-size:11px;padding:4px 10px;">Siguiente ▶</button>';
    html += '</div>';

    /* ── Item card ── */
    html += '<div class="item-card" data-id="' + it.id + '">';
    html += '<div class="item-card-header">';
    html += '<span class="item-number">ÍTEM ' + (idx + 1) + '</span>';
    html += '<span class="item-badge ' + badgeClass + '">' + badgeLabel + '</span>';
    html += '<span class="item-name-header">' + escAttr(it.nombre || '(sin nombre)') + '</span>';
    html += '</div>';
    html += '<div class="item-card-body">';
    if (isCat) {
      html += renderItemCatalogo(it, idx);
    } else {
      html += renderItemPersonalizado(it, idx);
    }
    html += '<div class="item-actions">';
    html += '<button type="button" class="btn btn-sm btn-outline" onclick="duplicarItem(\'' + it.id + '\')">Duplicar este ítem</button>';
    html += '<button type="button" class="btn btn-sm btn-ghost" style="color:var(--danger);" onclick="eliminarItem(\'' + it.id + '\')">Eliminar este ítem</button>';
    html += '</div></div>';
    html += '</div>';
  }
  c.innerHTML = html;
  actualizarResumen();
}

function renderItemCatalogo(it, i) {
  var h = '';
  h += '<div class="field"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Nombre del producto</label>';
  h += '<input type="text" class="mueble-input" placeholder="Ej: Mesa de noche roble" value="' + escAttr(it.nombre) + '" onchange="actualizarItem(\'' + it.id + '\',\'nombre\',this.value)"/></div>';
  h += '<div class="g2"><div class="field"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Cantidad</label>';
  h += '<input type="number" class="mueble-input" min="1" value="' + (it.cantidad || 1) + '" onchange="actualizarItem(\'' + it.id + '\',\'cantidad\',parseFloat(this.value)||1)"/></div>';
  h += '<div class="field"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Precio unitario</label>';
  h += '<input type="number" class="mueble-input" min="0" value="' + (it.precioUnitario || 0) + '" onchange="actualizarItem(\'' + it.id + '\',\'precioUnitario\',parseFloat(this.value)||0)"/></div></div>';
  h += '<div class="field"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Subtotal</label>';
  h += '<input type="text" class="mueble-input item-subtotal-display" readonly value="$ ' + ((it.subtotal || 0).toLocaleString('es-CO')) + '" style="font-weight:600;color:var(--amber);"/></div>';
  h += '<div class="field"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Notas adicionales</label>';
  h += '<textarea class="mueble-input" rows="2" placeholder="Notas..." onchange="actualizarItem(\'' + it.id + '\',\'notas\',this.value)">' + escAttr(it.notas || '') + '</textarea></div>';
  h += '<div class="field"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Foto de referencia</label>';
  h += '<input type="file" class="mueble-input" accept="*/*" onchange="actualizarItemArchivos(\'' + it.id + '\',this.files)"/>';
  if (it.foto) h += '<div style="width:60px;height:60px;border-radius:6px;overflow:hidden;border:1px solid var(--border);margin-top:6px;background-size:cover;background-position:center;background-image:url(' + escAttr(it.foto) + ');"></div>';
  h += '</div>';
  return h;
}

function renderItemPersonalizado(it, i) {
  var h = '';
  h += '<div class="field"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Categoría</label>';
  h += '<select class="mueble-input" onchange="actualizarItem(\'' + it.id + '\',\'categoria\',this.value)">';
  var cats = ['','Mueble a medida','Carpintería decorativa','Closets·Cocinas·Puertas','Instalación·Obra','Restauración','Otro'];
  var catVals = ['','mueble_medida','decorativa','closets_cocinas','instalacion_obra','restauracion','otro'];
  for (var ci = 0; ci < cats.length; ci++) {
    h += '<option value="' + catVals[ci] + '"' + (it.categoria === catVals[ci] ? ' selected' : '') + '>' + cats[ci] + '</option>';
  }
  h += '</select></div>';
  h += '<div class="g2"><div class="field"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Nombre del mueble</label>';
  h += '<input type="text" class="mueble-input" placeholder="Ej: Cuadro tipo lienzo 80×70" value="' + escAttr(it.nombre) + '" onchange="actualizarItem(\'' + it.id + '\',\'nombre\',this.value)"/></div>';
  h += '<div class="field"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">¿Cuántos iguales?</label>';
  h += '<input type="number" class="mueble-input" min="1" value="' + (it.cantidad || 1) + '" onchange="actualizarItem(\'' + it.id + '\',\'cantidad\',parseFloat(this.value)||1)"/></div></div>';
  h += '<div class="field"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Dimensiones (cm)</label>';
  h += '<div class="g4" style="gap:6px;"><div><input type="number" class="mueble-input" min="0" step="0.1" placeholder="Alto" value="' + escAttr(it.dimensiones.alto) + '" onchange="actualizarItem(\'' + it.id + '\',\'dimensiones.alto\',this.value)"/></div>';
  h += '<div><input type="number" class="mueble-input" min="0" step="0.1" placeholder="Ancho" value="' + escAttr(it.dimensiones.ancho) + '" onchange="actualizarItem(\'' + it.id + '\',\'dimensiones.ancho\',this.value)"/></div>';
  h += '<div><input type="number" class="mueble-input" min="0" step="0.1" placeholder="Prof." value="' + escAttr(it.dimensiones.profundo) + '" onchange="actualizarItem(\'' + it.id + '\',\'dimensiones.profundo\',this.value)"/></div>';
  h += '<div><input type="number" class="mueble-input" min="0" step="0.1" placeholder="Calibre mm" value="' + escAttr(it.dimensiones.calibre) + '" onchange="actualizarItem(\'' + it.id + '\',\'dimensiones.calibre\',this.value)"/></div></div></div>';
  h += '<div class="field"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Material principal</label>';
  h += '<select class="mueble-input" onchange="actualizarItem(\'' + it.id + '\',\'material\',this.value);renderItems();">';
  var mats = ['','MDF','Melamina','Madera sólida','Mixto','Madera recuperada','Otros'];
  var matVals = ['','mdf','melamina','madera_solida','mixto','madera_recuperada','otros'];
  for (var mi = 0; mi < mats.length; mi++) {
    h += '<option value="' + matVals[mi] + '"' + (it.material === matVals[mi] ? ' selected' : '') + '>' + mats[mi] + '</option>';
  }
  h += '</select></div>';
  var showEspecie = it.material === 'madera_solida' || it.material === 'otros';
  h += '<div class="field" style="' + (showEspecie ? '' : 'display:none;') + '"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Especie de madera</label>';
  h += '<input type="text" class="mueble-input" placeholder="Ej: Cedro, Pino, Nogal..." value="' + escAttr(it.especieMadera || '') + '" onchange="actualizarItem(\'' + it.id + '\',\'especieMadera\',this.value)"/></div>';
  h += '<div class="field"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Acabado</label>';
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
  var acabList = ['Barniz','Mate','Laca','Crudo','Sellado','Pintado','Lacado','Tapizado','Tintado','Natural','Cera','Aceite'];
  var acabVals = ['barniz','mate','laca','crudo','sellado','pintado','lacado','tapizado','tintado','natural','cera','aceite'];
  for (var ai = 0; ai < acabList.length; ai++) {
    var checked = it.acabados && it.acabados.indexOf(acabVals[ai]) > -1;
    h += '<label class="tag-chip" style="display:flex;align-items:center;gap:5px;padding:4px 12px;border-radius:16px;border:1px solid ' + (checked ? 'var(--amber)' : 'var(--border)') + ';cursor:pointer;font-size:11px;color:var(--cream);background:' + (checked ? 'rgba(232,168,76,0.12)' : 'var(--card2)') + ';transition:0.2s;"><input type="checkbox" style="accent-color:var(--amber);"' + (checked ? ' checked' : '') + ' onchange="actualizarItemAcabados(\'' + it.id + '\',\'' + acabVals[ai] + '\')"/>' + acabList[ai] + '</label>';
  }
  h += '</div></div>';
  h += '<div class="field"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Color o referencia</label>';
  h += '<input type="text" class="mueble-input" placeholder="Ej: Blanco hueso, Pintuco #304" value="' + escAttr(it.colorReferencia || '') + '" onchange="actualizarItem(\'' + it.id + '\',\'colorReferencia\',this.value)"/></div>';
  h += '<div class="field"><label style="display:flex;align-items:center;gap:10px;"><span style="font-size:11px;color:var(--muted);">Requiere instalación</span>';
  h += '<label class="toggle-switch" style="position:relative;display:inline-block;width:36px;height:20px;"><input type="checkbox"' + (it.requiereInstalacion ? ' checked' : '') + ' onchange="actualizarItemCheckbox(\'' + it.id + '\',\'requiereInstalacion\')" style="opacity:0;width:0;height:0;"/><span class="toggle-slider" style="position:absolute;cursor:pointer;inset:0;background:var(--card);border:1px solid var(--border);border-radius:999px;transition:0.2s;"></span></label></label></div>';
  h += '<div class="field" style="margin-top:6px;"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Detalles especiales</label>';
  h += '<textarea class="mueble-input" rows="2" placeholder="Ej: Con espejo interior / Flotante / Sin patas" onchange="actualizarItem(\'' + it.id + '\',\'detalles\',this.value)">' + escAttr(it.detalles || '') + '</textarea></div>';
  h += '<div class="field"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Foto de referencia</label>';
  h += '<input type="file" class="mueble-input" accept="*/*" multiple onchange="actualizarItemArchivos(\'' + it.id + '\',this.files)"/>';
  if (it.foto) h += '<div style="width:60px;height:60px;border-radius:6px;overflow:hidden;border:1px solid var(--border);margin-top:6px;background-size:cover;background-position:center;background-image:url(' + escAttr(it.foto) + ');"></div>';
  h += '</div>';
  return h;
}

function actualizarResumen() {
  var el = document.getElementById('itemsResumen');
  if (!el) return;
  var total = itemsData.length;
  var catCount = 0, catTotal = 0, persCount = 0;
  for (var i = 0; i < itemsData.length; i++) {
    var it = itemsData[i];
    if (it.tipo === 'catalogo') { catCount++; catTotal += (it.subtotal || 0); }
    else { persCount++; }
  }
  el.innerHTML = '<div class="ir-line"><span class="ir-lbl">' + total + ' ítem' + (total !== 1 ? 's' : '') + ' en esta cotización</span><span class="ir-val"></span></div>' +
    '<div class="ir-line"><span class="ir-lbl">' + catCount + ' del catálogo</span><span class="ir-val">$ ' + catTotal.toLocaleString('es-CO') + '</span></div>' +
    '<div class="ir-line"><span class="ir-lbl">' + persCount + ' personalizado' + (persCount !== 1 ? 's' : '') + '</span><span class="ir-val">' + (persCount > 0 ? 'pendiente' : '—') + '</span></div>';
}

function escAttr(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── old helpers kept for backward compat ── */
function seleccionarNivel(nivel) {
  document.querySelectorAll('.nivel-card').forEach(function(c) { c.classList.remove('activo'); });
  var map = { basico: 'nivelCardBasico', medio: 'nivelCardMedio', alto: 'nivelCardAlto' };
  var idMap = { basico: 'nivelBasico', medio: 'nivelMedio', alto: 'nivelAlto' };
  try { document.getElementById(map[nivel]).classList.add('activo'); } catch(e) {}
  try { document.getElementById(idMap[nivel]).checked = true; } catch(e) {}
  actualizarPreview();
}

function actualizarMargenLabel() {
  var val = document.getElementById('margenGanancia').value;
  document.getElementById('margenGananciaLabel').textContent = val + '%';
  document.getElementById('previewMargen').textContent = val + '%';
}

function actualizarMaterialTotal() {
  var cantidad = parseFloat(document.getElementById('materialCantidad').value) || 0;
  var precioUnitario = parseFloat(document.getElementById('materialPrecioUnitario').value) || 0;
  var total = cantidad * precioUnitario;
  var totalEl = document.getElementById('materialTotal');
  if (totalEl) totalEl.value = formatCOP(total);
  var descripcion = document.getElementById('materialDescripcion')?.value.trim();
  if (descripcion) {
    document.getElementById('previewMaterial').textContent = descripcion + (cantidad ? ' (' + cantidad + ' ' + document.getElementById('materialUnidad').value + ')' : '');
  }
}

function calcularPrecioSugerido() {
  var costosObj = {
    materiales: parseFloat(document.getElementById('costoMateriales').value) || 0,
    herrajes: parseFloat(document.getElementById('costoHerrajes').value) || 0,
    manoObra: parseFloat(document.getElementById('costoManoObra').value) || 0,
    herramientas: parseFloat(document.getElementById('costoHerramientas').value) || 0,
    transporte: parseFloat(document.getElementById('costoTransporte').value) || 0,
    subcontratos: parseFloat(document.getElementById('costoSubcontratos').value) || 0
  };
  var margen = parseInt(document.getElementById('margenGanancia').value) || 0;
  var mats = costosObj.materiales, herrajes = costosObj.herrajes, mo = costosObj.manoObra;
  var herr = costosObj.herramientas, transp = costosObj.transporte, sub = costosObj.subcontratos;
  var suma = mats + herrajes + mo + herr + transp + sub;
  var precioFinal = CotizacionModel.calcularPrecioFinal(costosObj, margen);
  document.getElementById('precioSugerido').value = formatCOP(precioFinal);
  document.getElementById('previewPrecioFinal').textContent = formatCOP(precioFinal);
  document.getElementById('previewSumaCostos').textContent = formatCOP(suma);
  document.getElementById('previewCostoMateriales').textContent = formatCOP(mats);
  var herrajesEl = document.getElementById('previewCostoHerrajes');
  if (herrajesEl) herrajesEl.textContent = formatCOP(herrajes);
  document.getElementById('previewCostoManoObra').textContent = formatCOP(mo);
  document.getElementById('previewCostoHerramientas').textContent = formatCOP(herr);
  document.getElementById('previewCostoTransporte').textContent = formatCOP(transp);
  document.getElementById('previewCostoSubcontratos').textContent = formatCOP(sub);
  var costoRow = document.getElementById('costoTransporteRow');
  if (costoRow) costoRow.style.display = transp > 0 ? 'flex' : 'none';
}

function actualizarPreview() {
  if (typeof CotizacionView !== 'undefined' && CotizacionView.recolectarDatosFormulario) {
    var flat = CotizacionView.recolectarDatosFormulario();
    var datos = {
      cliente: { nombre: flat.nombreCliente || '', whatsapp: flat.whatsapp || '', ciudad: flat.barrio || '' },
      proyecto: { nombre: flat.nombreProyecto || '', tipo: '', validez: flat.validezCotizacion || '', dimensionesGenerales: { alto: 0, ancho: 0, profundo: 0 } },
      especificaciones: { medidas: { largo: 0, ancho: 0, alto: 0, grosor: 0 } },
      items: itemsData || [],
      costos: { materiales: flat.costoMateriales || 0, manoObra: flat.costoManoObra || 0, herrajes: flat.costoHerrajes || 0, herramientas: flat.costoHerramientas || 0, transporte: flat.costoTransporte || 0, subcontratos: flat.costoSubcontratos || 0, margenGanancia: flat.margenGanancia || 0 }
    };
    CotizacionView.renderPreview(datos);
  }
  calcularPrecioSugerido();
}

function guardarCotizacion(estado) {
  if (typeof CotizacionController === 'undefined') { mostrarToast('Error: Controlador no disponible'); return; }
  if (typeof CotizacionView === 'undefined' || !CotizacionView.recolectarDatosFormulario) { mostrarToast('Error: Vista no disponible'); return; }
  var datos = CotizacionView.recolectarDatosFormulario();
  if (!datos.nombreCliente) { mostrarToast('Completa el nombre del cliente'); return; }
  var tieneItem = datos.items && datos.items.some(function(it) { return it.nombre; });
  if (!tieneItem) { mostrarToast('Agrega al menos un ítem con nombre'); return; }
  if (estado === 'borrador' || !estado) datos.estado = 'borrador';
  var resultado = CotizacionController.guardar(datos, estado || 'borrador');
  if (resultado.success) {
    mostrarToast('Cotizaci&oacute;n guardada como ' + (estado || 'borrador'));
    setTimeout(function() { window.location.href = 'dashboard.html'; }, 1500);
  } else {
    var msgs = resultado.errores ? resultado.errores.join(', ') : (resultado.error || 'Error al guardar');
    mostrarToast('Error: ' + msgs);
  }
}

function enviarAlCliente() {
  if (typeof CotizacionView !== 'undefined' && CotizacionView.mostrarModalChecklist) {
    CotizacionView.mostrarModalChecklist(function() { guardarCotizacion('enviada'); });
  } else { guardarCotizacion('enviada'); }
}

function limpiarFormulario() {
  mostrarConfirm('¿Limpiar el formulario? Se perderán los datos ingresados.', function() {
    var inputs = document.querySelectorAll('.field input, .field select, .field textarea');
    inputs.forEach(function(el) {
      if (el.type === 'radio' || el.type === 'checkbox') {
        if (el.id === 'ubicacionInterior') el.checked = true;
        else if (el.id === 'nivelBasico') el.checked = true;
        else el.checked = false;
      } else if (el.type === 'range') {
        if (el.id === 'margenGanancia') el.value = 40;
      } else { el.value = ''; }
    });
    document.querySelectorAll('.nivel-card').forEach(function(c) { c.classList.remove('activo'); });
    try { document.getElementById('nivelCardBasico').classList.add('activo'); } catch(e) {}
    try { document.getElementById('validezCotizacion').value = '15'; } catch(e) {}
    try { document.getElementById('tipoTrabajoOtroField').style.display = 'none'; } catch(e) {}
    var numDisplay = document.getElementById('numeroCotizacionDisplay');
    if (numDisplay) numDisplay.value = '';
    try { document.getElementById('fechaCotizacion').value = new Date().toISOString().split('T')[0]; } catch(e) {}
    try { document.getElementById('precioSugerido').value = ''; } catch(e) {}
    itemsData = [];
    cambiarTab('cliente');
    actualizarMargenLabel();
    renderItems();
    actualizarPreview();
    mostrarToast('Formulario limpiado');
  });
}

function cambiarTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(function(el) { el.classList.remove('active'); });
  document.querySelectorAll('.tab-btn').forEach(function(el) { el.classList.remove('active'); });
  var tabContent = document.getElementById('tab-' + tabId);
  if (tabContent) tabContent.classList.add('active');
  var tabBtn = document.querySelector('.tab-btn[data-tab="' + tabId + '"]');
  if (tabBtn) tabBtn.classList.add('active');
}

function cargarCotizacionExistente(id) {
  if (typeof CotizacionController === 'undefined') return;
  var cot = CotizacionController.obtenerPorId(id);
  if (!cot) { mostrarToast('Cotizaci&oacute;n no encontrada'); return; }
  editandoId = cot.id;
  document.getElementById('pageTitle').textContent = 'Editar Cotizaci&oacute;n';
  var c = cot.cliente || {};
  var p = cot.proyecto || {};
  var e = cot.especificaciones || {};
  var cs = cot.costos || {};

  if (e.items && e.items.length > 0) { itemsData = JSON.parse(JSON.stringify(e.items)); }
  else if (e.muebles && e.muebles.length > 0) {
    itemsData = e.muebles.map(function(m) {
      var it = crearItem('personalizado');
      it.nombre = m.tipo || '';
      it.dimensiones = { alto: m.alto || '', ancho: m.ancho || '', profundo: m.profundidad || '', calibre: '' };
      it.material = m.material || '';
      it.colorReferencia = m.color || '';
      it.detalles = m.detalles || '';
      return it;
    });
  }
  renderItems();

  try { if (c.desmonte) { var dmEl = document.getElementById('requiereDesmonte'); if (dmEl) dmEl.value = c.desmonte; } } catch(e) {}
  try { if (c.nombre) { var ncEl = document.getElementById('nombreCliente'); if (ncEl) ncEl.value = c.nombre; } } catch(e) {}
  try { if (c.whatsapp) { var waEl = document.getElementById('whatsapp'); if (waEl) waEl.value = c.whatsapp; } } catch(e) {}
  try { if (c.direccion) { var diEl = document.getElementById('direccionEntrega'); if (diEl) diEl.value = c.direccion; } } catch(e) {}
  try { if (c.barrio) { var baEl = document.getElementById('barrio'); if (baEl) baEl.value = c.barrio; } } catch(e) {}
  try { if (p.validez) { var vcEl = document.getElementById('validezCotizacion'); if (vcEl) vcEl.value = p.validez; } } catch(e) {}
  try { if (p.observaciones) { var obEl = document.getElementById('observaciones'); if (obEl) obEl.value = p.observaciones; } } catch(e) {}
  try { if (cs.materiales) document.getElementById('costoMateriales').value = cs.materiales; } catch(e) {}
  try { if (cs.manoObra) document.getElementById('costoManoObra').value = cs.manoObra; } catch(e) {}
  try { if (cs.herrajes) document.getElementById('costoHerrajes').value = cs.herrajes; } catch(e) {}
  try { if (cs.herramientas) document.getElementById('costoHerramientas').value = cs.herramientas; } catch(e) {}
  try { if (cs.transporte) document.getElementById('costoTransporte').value = cs.transporte; } catch(e) {}
  try { if (cs.subcontratos) document.getElementById('costoSubcontratos').value = cs.subcontratos; } catch(e) {}
  try { if (cs.tiempoEstimadoDias) document.getElementById('tiempoEstimadoDias').value = cs.tiempoEstimadoDias; } catch(e) {}
  try { if (cs.margenGanancia != null) document.getElementById('margenGanancia').value = cs.margenGanancia; } catch(e) {}
  actualizarMargenLabel();
  actualizarPreview();
  mostrarToast('Editando cotizaci&oacute;n');
}

(function init() {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  try { if (!document.getElementById('fechaCotizacion').value) { document.getElementById('fechaCotizacion').value = new Date().toISOString().split('T')[0]; } } catch(e) {}
  if (id) {
    cargarCotizacionExistente(id);
  } else {
    if (typeof CotizacionController !== 'undefined') {
      try {
        var num = CotizacionController.generarNumero();
        var numDisplay = document.getElementById('numeroCotizacionDisplay');
        if (numDisplay) numDisplay.value = num;
        var badge = document.getElementById('cotizacionNumeroBadge');
        if (badge) { badge.textContent = num; badge.style.display = 'inline-block'; }
      } catch(e) {}
    }
    if (itemsData.length === 0) {
      onTipoFormularioChange();
    }
    renderItems();
  }
})();