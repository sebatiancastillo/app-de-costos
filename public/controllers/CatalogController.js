/* ============================================
   CotiPro — catalogo.js
   Lógica completa de la vista catálogo
   Archivo: public/components/catalogo.js
   ============================================ */

/* ── Estado ── */
let proyectos       = [];
let filtroCategoria = 'todos';
let busqueda        = '';
let vistaActual     = 'grid';   // 'grid' | 'lista'
let ordenCol        = 'date';
let ordenDir        = 'desc';   // 'asc' | 'desc'
let detalleId       = null;

/* ── Inicializar ── */
document.addEventListener('DOMContentLoaded', () => {
  proyectos = DB.getProyectos();

  if (proyectos.length === 0) {
    _cargarDemo();
    proyectos = DB.getProyectos();
  }

  _construirFiltros();
  _bindBusqueda();
  _bindVista();
  render();
});

/* ── Demo data ── */
function _cargarDemo() {
  const demo = [
    {
      id: 1, projectName: 'Closet Empotrado 3 Puertas', client: 'Familia Martínez',
      category: 'closet', size: 'grande', date: '2025-03-10',
      width: '240', height: '220', depth: '60',
      color: '#b08040', colorName: 'Roble', deliveryDays: '20',
      materials: [
        { name: 'MDF 15mm',        qty: 4, unit: 'lam', unitPrice: 85000 },
        { name: 'Bisagras SC',     qty: 6, unit: 'und', unitPrice: 4500  },
        { name: 'Jaladores 128mm', qty: 3, unit: 'und', unitPrice: 12000 },
      ],
      laborHours: 16, laborRate: 35000, overhead: 15, margin: 35, media: [],
    },
    {
      id: 2, projectName: 'Mesa de Comedor 6 Puestos', client: 'Restaurante El Patio',
      category: 'mesa', size: 'grande', date: '2025-03-18',
      width: '180', height: '75', depth: '90',
      color: '#d4a96a', colorName: 'Pino', deliveryDays: '10',
      materials: [
        { name: 'Madera pino 2x4', qty: 8, unit: 'var', unitPrice: 22000 },
        { name: 'Barniz mate 1L',  qty: 2, unit: 'lit', unitPrice: 45000 },
      ],
      laborHours: 24, laborRate: 38000, overhead: 12, margin: 28, media: [],
    },
    {
      id: 3, projectName: 'Cocina Integral Blanca', client: 'Nuevo Apto Pedraza',
      category: 'cocina', size: 'set', date: '2025-03-21',
      width: '320', height: '90', depth: '60',
      color: '#f0ede8', colorName: 'Blanco', deliveryDays: '30',
      materials: [
        { name: 'MDF enchapado', qty: 6, unit: 'lam', unitPrice: 125000 },
        { name: 'Granito negro', qty: 2, unit: 'm²',  unitPrice: 280000 },
      ],
      laborHours: 40, laborRate: 40000, overhead: 20, margin: 32, media: [],
    },
    {
      id: 4, projectName: 'Escritorio Home Office', client: 'Pedro Suárez',
      category: 'escritorio', size: 'mediano', date: '2025-03-25',
      width: '140', height: '75', depth: '65',
      color: '#3a2410', colorName: 'Wengué', deliveryDays: '7',
      materials: [
        { name: 'MDF 18mm',   qty: 2, unit: 'lam', unitPrice: 95000 },
        { name: 'Patas metal',qty: 4, unit: 'und', unitPrice: 18000 },
      ],
      laborHours: 8, laborRate: 38000, overhead: 10, margin: 30, media: [],
    },
    {
      id: 5, projectName: 'Cama Matrimonial + Cabecero', client: 'Hotel Boutique Laureles',
      category: 'cama', size: 'grande', date: '2025-03-26',
      width: '160', height: '50', depth: '200',
      color: '#7a4f2d', colorName: 'Nogal', deliveryDays: '18',
      materials: [
        { name: 'Madera roble', qty: 6, unit: 'var', unitPrice: 35000 },
        { name: 'Espuma D33',   qty: 1, unit: 'und', unitPrice: 180000 },
        { name: 'Tela tapiz',   qty: 3, unit: 'm²',  unitPrice: 45000  },
      ],
      laborHours: 20, laborRate: 40000, overhead: 18, margin: 33, media: [],
    },
  ];
  DB.saveProyectos(demo);
}

/* ── Construir chips de filtro dinámicamente ── */
function _construirFiltros() {
  const cont = document.getElementById('filtrosCategoria');
  if (!cont) return;

  const cats = [...new Set(proyectos.map(p => p.category))];
  cont.innerHTML = `
    <div class="f-chip active" data-cat="todos" onclick="setFiltro(this,'todos')">🗂 Todos</div>
    ${cats.map(c => `
      <div class="f-chip" data-cat="${c}" onclick="setFiltro(this,'${c}')">
        ${CAT_ICON[c] || '📦'} ${c.charAt(0).toUpperCase() + c.slice(1)}
      </div>
    `).join('')}
  `;
}

/* ── Filtrar por categoría ── */
function setFiltro(el, cat) {
  document.querySelectorAll('#filtrosCategoria .f-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  filtroCategoria = cat;
  render();
}

/* ── Búsqueda ── */
function _bindBusqueda() {
  const inp = document.getElementById('busqueda');
  if (!inp) return;
  inp.addEventListener('input', e => {
    busqueda = e.target.value.toLowerCase().trim();
    render();
  });
}

/* ── Toggle vista grid/lista ── */
function _bindVista() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      vistaActual = btn.dataset.vista;
      render();
    });
  });
}

/* ── Ordenar tabla por columna ── */
function ordenar(col) {
  if (ordenCol === col) {
    ordenDir = ordenDir === 'asc' ? 'desc' : 'asc';
  } else {
    ordenCol = col;
    ordenDir = 'asc';
  }
  render();
}

/* ── Filtrar y ordenar lista ── */
function _filtrados() {
  let lista = [...proyectos];

  if (filtroCategoria !== 'todos') {
    lista = lista.filter(p => p.category === filtroCategoria);
  }

  if (busqueda) {
    lista = lista.filter(p =>
      p.projectName.toLowerCase().includes(busqueda) ||
      (p.client || '').toLowerCase().includes(busqueda) ||
      p.category.toLowerCase().includes(busqueda)
    );
  }

  lista.sort((a, b) => {
    let va, vb;
    if (ordenCol === 'total') {
      va = calcCostos(a).total;
      vb = calcCostos(b).total;
    } else if (ordenCol === 'margin') {
      va = a.margin || 0;
      vb = b.margin || 0;
    } else {
      va = (a[ordenCol] || '').toString().toLowerCase();
      vb = (b[ordenCol] || '').toString().toLowerCase();
    }
    if (va < vb) return ordenDir === 'asc' ? -1 : 1;
    if (va > vb) return ordenDir === 'asc' ?  1 : -1;
    return 0;
  });

  return lista;
}

/* ── Render principal ── */
function render() {
  const lista = _filtrados();
  _renderStats(lista);
  _renderSubtitulo(lista.length);

  if (lista.length === 0) {
    document.getElementById('catContenido').innerHTML = _emptyState();
    return;
  }

  if (vistaActual === 'grid') {
    _renderGrid(lista);
  } else {
    _renderLista(lista);
  }

  if (detalleId) {
    const p = proyectos.find(x => x.id === detalleId);
    if (p) _renderDetalle(p);
  }
}

/* ── Stats resumen ── */
function _renderStats(lista) {
  const total   = lista.reduce((s, p) => s + (calcCostos(p).total || 0), 0);
  const avgMrg  = lista.length ? Math.round(lista.reduce((s, p) => s + (p.margin || 0), 0) / lista.length) : 0;
  const cats    = new Set(lista.map(p => p.category)).size;

  _set('catStatNum',    lista.length);
  _set('catStatValor',  fmt(total));
  _set('catStatMargen', avgMrg + '%');
  _set('catStatCats',   cats);
}

function _renderSubtitulo(n) {
  _set('catSubtitulo', `${n} proyecto${n !== 1 ? 's' : ''} encontrado${n !== 1 ? 's' : ''}`);
}

/* ── Vista GRID ── */
function _renderGrid(lista) {
  const html = `<div class="cat-grid">${lista.map(_tarjeta).join('')}</div>`;
  document.getElementById('catContenido').innerHTML = html;
}

function _tarjeta(p) {
  const c        = calcCostos(p);
  const hasMed   = p.width || p.height || p.depth;
  const hasImg   = p.media && p.media.length > 0 && p.media[0].type === 'image';
  const selected = detalleId === p.id ? 'border-color:var(--amber);' : '';

  return `
    <div class="cat-card" style="${selected}" onclick="abrirDetalle(${p.id})">
      <div class="cat-card-img">
        ${hasImg
          ? `<img src="${p.media[0].url}" alt="${p.projectName}"/>`
          : `<span class="ph">${CAT_ICON[p.category] || '📦'}</span>`}
      </div>
      <div class="cat-card-body">
        <div class="cat-card-name">${p.projectName}</div>
        <div class="cat-card-client">👤 ${p.client || 'Sin cliente'}</div>
        <div class="cat-specs">
          ${p.size ? `<span class="spec-pill">${SIZES[p.size] || p.size}</span>` : ''}
          ${hasMed ? `<span class="spec-pill">📐 ${p.width||'?'}×${p.height||'?'}×${p.depth||'?'}</span>` : ''}
          ${p.color ? `<span class="spec-pill"><span class="color-dot" style="background:${p.color}"></span>${p.colorName || ''}</span>` : ''}
        </div>
        ${p.deliveryDays ? `<div class="cat-delivery">🚚 ${p.deliveryDays} días hábiles</div>` : ''}
        <div class="cat-price-row">
          <span class="cat-price">${fmt(c.total)}</span>
          <span class="cat-margin">+${p.margin}% margen</span>
        </div>
        <div class="cat-actions">
          <a href="cotizar.html?id=${p.id}" class="btn btn-ghost btn-sm" onclick="event.stopPropagation()">✏️ Editar</a>
          <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();eliminar(${p.id})">🗑️</button>
        </div>
      </div>
    </div>
  `;
}

/* ── Vista LISTA ── */
function _renderLista(lista) {
  const sortIcon = col => {
    if (ordenCol !== col) return '<span class="sort-icon">↕</span>';
    return `<span class="sort-icon">${ordenDir === 'asc' ? '↑' : '↓'}</span>`;
  };

  const rows = lista.map(p => {
    const c      = calcCostos(p);
    const hasMed = p.width || p.height || p.depth;
    return `
      <tr onclick="abrirDetalle(${p.id})" style="cursor:pointer;">
        <td>
          <div class="list-name">${p.projectName}</div>
          <div class="list-client">${p.client || 'Sin cliente'}</div>
        </td>
        <td><span class="list-cat">${CAT_ICON[p.category] || '📦'} ${p.category}</span></td>
        <td><span class="size-badge">${SIZES[p.size] || p.size || '—'}</span></td>
        <td>
          ${p.color ? `<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--tan);">
            <span class="color-dot" style="background:${p.color}"></span>${p.colorName || ''}
          </div>` : '<span style="color:var(--muted);font-size:12px;">—</span>'}
        </td>
        <td class="list-medidas">${hasMed ? `${p.width||'?'}×${p.height||'?'}×${p.depth||'?'} cm` : '—'}</td>
        <td class="list-price">${fmt(c.total)}</td>
        <td class="list-margin">+${p.margin}%</td>
        <td class="list-date">${p.date || '—'}</td>
        <td>
          <div style="display:flex;gap:6px;">
            <a href="cotizar.html?id=${p.id}" class="btn btn-ghost btn-sm" onclick="event.stopPropagation()">✏️</a>
            <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();eliminar(${p.id})">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  document.getElementById('catContenido').innerHTML = `
    <div class="cat-list">
      <table class="cat-list-table">
        <thead>
          <tr>
            <th onclick="ordenar('projectName')" class="${ordenCol==='projectName'?'sorted':''}">Proyecto ${sortIcon('projectName')}</th>
            <th onclick="ordenar('category')"    class="${ordenCol==='category'?'sorted':''}">Categoría ${sortIcon('category')}</th>
            <th>Tamaño</th>
            <th>Color</th>
            <th>Medidas</th>
            <th onclick="ordenar('total')"  class="${ordenCol==='total'?'sorted':''}">Precio ${sortIcon('total')}</th>
            <th onclick="ordenar('margin')" class="${ordenCol==='margin'?'sorted':''}">Margen ${sortIcon('margin')}</th>
            <th onclick="ordenar('date')"   class="${ordenCol==='date'?'sorted':''}">Fecha ${sortIcon('date')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

/* ── Panel de detalle ── */
function abrirDetalle(id) {
  detalleId = detalleId === id ? null : id;
  render();

  if (detalleId) {
    const p = proyectos.find(x => x.id === id);
    if (p) _renderDetalle(p);
  } else {
    document.getElementById('detallePanel').innerHTML = '';
  }
}

function _renderDetalle(p) {
  const c      = calcCostos(p);
  const hasImg = p.media && p.media.length > 0 && p.media[0].type === 'image';
  const hasMed = p.width || p.height || p.depth;

  document.getElementById('detallePanel').innerHTML = `
    <div class="detalle-panel">
      <div class="detalle-panel-header">
        <div>
          <div class="detalle-nombre">${p.projectName}</div>
          <div class="detalle-cliente">👤 ${p.client || 'Sin cliente'}</div>
        </div>
        <button class="detalle-close" onclick="abrirDetalle(${p.id})">✕</button>
      </div>

      <div class="detalle-img">
        ${hasImg
          ? `<img src="${p.media[0].url}" alt="${p.projectName}"/>`
          : `<span style="opacity:0.2;font-size:40px;">${CAT_ICON[p.category] || '📦'}</span>`}
      </div>

      <div class="detalle-specs-grid">
        <div class="detalle-spec">
          <div class="detalle-spec-key">Categoría</div>
          <div class="detalle-spec-val">${CAT_ICON[p.category]} ${p.category}</div>
        </div>
        <div class="detalle-spec">
          <div class="detalle-spec-key">Tamaño</div>
          <div class="detalle-spec-val">${SIZES[p.size] || p.size || '—'}</div>
        </div>
        ${hasMed ? `
        <div class="detalle-spec">
          <div class="detalle-spec-key">Medidas</div>
          <div class="detalle-spec-val">${p.width||'?'}×${p.height||'?'}×${p.depth||'?'} cm</div>
        </div>` : ''}
        ${p.color ? `
        <div class="detalle-spec">
          <div class="detalle-spec-key">Color</div>
          <div class="detalle-spec-val" style="display:flex;align-items:center;gap:6px;">
            <span class="color-dot" style="background:${p.color}"></span>${p.colorName}
          </div>
        </div>` : ''}
        ${p.deliveryDays ? `
        <div class="detalle-spec">
          <div class="detalle-spec-key">Entrega</div>
          <div class="detalle-spec-val">${p.deliveryDays} días</div>
        </div>` : ''}
        <div class="detalle-spec">
          <div class="detalle-spec-key">Fecha</div>
          <div class="detalle-spec-val">${p.date || '—'}</div>
        </div>
      </div>

      <div class="detalle-desglose">
        <div class="detalle-line">
          <span class="detalle-line-lbl">🪵 Materiales</span>
          <span class="detalle-line-val">${fmt(c.mat)}</span>
        </div>
        <div class="detalle-line">
          <span class="detalle-line-lbl">👷 Mano de obra</span>
          <span class="detalle-line-val">${fmt(c.lab)}</span>
        </div>
        <div class="detalle-line">
          <span class="detalle-line-lbl">⚙️ Overhead (${p.overhead}%)</span>
          <span class="detalle-line-val">${fmt(c.ovAmt)}</span>
        </div>
        <div class="detalle-line">
          <span class="detalle-line-lbl" style="color:var(--success);">📈 Ganancia (${p.margin}%)</span>
          <span class="detalle-line-val" style="color:var(--success);">+${fmt(c.mrgAmt)}</span>
        </div>
      </div>

      <div class="detalle-total">
        <div class="detalle-total-lbl">PRECIO FINAL</div>
        <div class="detalle-total-val">${fmt(c.total)}</div>
      </div>

      <div class="detalle-acciones">
        <a href="cotizar.html?id=${p.id}" class="btn btn-primary btn-sm" style="flex:1;justify-content:center;">✏️ Editar</a>
        <button class="btn btn-danger btn-sm" onclick="eliminar(${p.id})">🗑️</button>
      </div>
    </div>
  `;
}

/* ── Empty state ── */
function _emptyState() {
  return `
    <div class="empty-state">
      <div class="empty-icon">📂</div>
      <div class="empty-title">Sin resultados</div>
      <div class="empty-sub">${busqueda ? `No hay proyectos que coincidan con "${busqueda}"` : 'Crea tu primera cotización'}</div>
      <br/>
      <a href="cotizar.html" class="btn btn-primary" style="margin-top:16px;">+ Nueva Cotización</a>
    </div>
  `;
}

/* ── Eliminar proyecto ── */
function eliminar(id) {
  if (!confirm('¿Eliminar esta cotización?')) return;
  DB.deleteProyecto(id);
  proyectos = DB.getProyectos();
  if (detalleId === id) {
    detalleId = null;
    document.getElementById('detallePanel').innerHTML = '';
  }
  _construirFiltros();
  render();
  mostrarToast('🗑️ Cotización eliminada');
}

/* ── Helper ── */
function _set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}