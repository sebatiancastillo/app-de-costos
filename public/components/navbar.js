// Renderiza el menú lateral (sidebar) de la aplicación.
// paginaActiva se usa para marcar el enlace activo en el menú.
function renderSidebar(paginaActiva = 'dashboard') {
  // Busca el contenedor HTML donde se insertará la barra lateral.
  const contenedor = document.getElementById('sidebar');
  if (!contenedor) return; // Si no existe, no hace nada.

  // Obtiene los elementos de navegación según si la página está anidada o no.
  const items = getNavItems(isPageNested());

  // Construye el HTML del sidebar con logo, enlaces y pie de página.
  contenedor.innerHTML = `
    <div class="brand">
      <div class="brand-icon">🪚</div>
      <div>
        <div class="brand-name">VikingosCQ</div>
        <div class="brand-sub">Cotizaciones</div>
      </div>
    </div>
    ${items.map(item => `
      <a href="${item.href}" class="nav-item${paginaActiva === item.id ? ' active' : ''}">
        <span class="nav-icon">${item.icon}</span>
        ${item.label}
      </a>
    `).join('')}
    <div class="sidebar-footer">VikingosCQ</div>
  `;
}
