// Lógica exclusiva del Micro Frontend: Client Admin
document.addEventListener('DOMContentLoaded', () => {
  const titleEl = document.querySelector('.client-topbar h2');
  if (!titleEl) return;
  
  // Obtenemos el nombre del tenant (Ej. "La Esquina")
  const title = titleEl.childNodes[0].nodeValue.trim();
  const activeFeatures = window.api.getTenantFeatures(title);
  
  // Ocultar tabs laterales si no están habilitadas
  const navLinks = document.querySelectorAll('.client-nav a');
  navLinks.forEach(link => {
    if (link.textContent.includes('Agenda') && !activeFeatures.agenda) link.style.display = 'none';
    if (link.textContent.includes('Servicios') && !activeFeatures.servicios) link.style.display = 'none';
    if (link.textContent.includes('Menú') && !activeFeatures.menu) link.style.display = 'none';
  });

  // Ocultar tarjetas en el dashboard
  const agendaCard = document.getElementById('client-agenda');
  if (agendaCard && !activeFeatures.agenda) agendaCard.style.display = 'none';

  const serviciosCard = document.getElementById('client-servicios');
  if (serviciosCard && !activeFeatures.servicios && !activeFeatures.menu) serviciosCard.style.display = 'none'; 
});
