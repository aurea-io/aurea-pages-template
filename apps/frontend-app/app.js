// Lógica exclusiva del Micro Frontend: App Frontend (Public)
document.addEventListener('DOMContentLoaded', () => {
  // Simulamos que el frontend sabe en qué negocio está (ej. por subdominio o URL)
  const brandEl = document.querySelector('.booking-brand strong, h1');
  if (!brandEl) return;
  
  const title = brandEl.textContent.trim();
  const activeFeatures = window.api.getTenantFeatures(title);
  
  // Si la empresa no tiene la funcionalidad de turnos habilitada, podríamos mostrar un mensaje.
  // En turnos.html, todo el módulo trata sobre reservas
  if (!activeFeatures.agenda) {
    const layout = document.querySelector('.booking-layout');
    if (layout) {
      layout.innerHTML = `
        <div style="padding: 3rem; text-align: center; background: #fff; border-radius: 12px; width: 100%;">
          <h2>Reservas no disponibles</h2>
          <p>Este establecimiento actualmente no tiene habilitada la funcionalidad de reservas online.</p>
        </div>
      `;
    }
  }
});
