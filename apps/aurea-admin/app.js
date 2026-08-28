// Lógica exclusiva del Micro Frontend: Aurea Admin
document.addEventListener('DOMContentLoaded', () => {
  const businessCards = document.querySelectorAll('.business-card');
  const tenants = window.api.getTenants();

  businessCards.forEach(card => {
    const titleEl = card.querySelector('h3');
    if (!titleEl) return;
    const name = titleEl.textContent.trim();
    const tenantData = tenants[name];
    if (!tenantData) return;

    // Crear panel de features
    const featuresPanel = document.createElement('div');
    featuresPanel.style.marginTop = '1rem';
    featuresPanel.style.padding = '1rem';
    featuresPanel.style.background = '#f7f8f5';
    featuresPanel.style.borderRadius = '8px';
    featuresPanel.style.fontSize = '13px';
    
    featuresPanel.innerHTML = `
      <p style="font-weight: 600; margin-bottom: 0.5rem; font-size: 11px; text-transform: uppercase; color: #666;">Funcionalidades Habilitadas</p>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
          <input type="checkbox" data-tenant="${name}" data-feature="agenda" ${tenantData.features.agenda ? 'checked' : ''}> Agenda/Turnos
        </label>
        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
          <input type="checkbox" data-tenant="${name}" data-feature="servicios" ${tenantData.features.servicios ? 'checked' : ''}> Servicios
        </label>
        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
          <input type="checkbox" data-tenant="${name}" data-feature="menu" ${tenantData.features.menu ? 'checked' : ''}> Menú/Catálogo
        </label>
        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
          <input type="checkbox" data-tenant="${name}" data-feature="delivery" ${tenantData.features.delivery ? 'checked' : ''}> Delivery/Pedidos
        </label>
      </div>
    `;

    // Escuchar cambios
    featuresPanel.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', (e) => {
        window.api.updateTenantFeature(e.target.dataset.tenant, e.target.dataset.feature, e.target.checked);
        e.target.parentNode.style.color = 'green';
        setTimeout(() => e.target.parentNode.style.color = '', 500);
      });
    });

    const body = card.querySelector('.business-body');
    if (body) {
      body.insertBefore(featuresPanel, body.querySelector('.business-actions'));
    }
  });
});
