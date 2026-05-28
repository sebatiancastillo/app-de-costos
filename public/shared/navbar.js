function renderSidebar(paginaActiva = 'dashboard') {
  const contenedor = document.getElementById('sidebar');
  if (!contenedor) return;

  const items = getNavItems(isPageNested());

  contenedor.innerHTML = `
    <div class="brand">
      <div class="brand-icon">🪵</div>
      <div>
        <div class="brand-name">Vikingos</div>
        <div class="brand-sub">Cotizador</div>
      </div>
    </div>
    ${items.map(item => `
      <a href="${item.href}" class="nav-item${paginaActiva === item.id ? ' active' : ''}">
        <span class="nav-icon">${item.icon}</span>
        ${item.label}
      </a>
    `).join('')}
    <div class="sidebar-footer">CotiPro v2.0</div>
  `;
}
