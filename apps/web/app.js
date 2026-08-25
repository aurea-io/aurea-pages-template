const STORAGE_KEY = "aurea-poc-v1";

const initialState = {
  services: [
    { id: "capping", category: "Manos", name: "Capping · Chrome Queen", duration: 150, price: 35000, deposit: 10000 },
    { id: "soft", category: "Manos", name: "Capping · Soft Queen", duration: 120, price: 32000, deposit: 10000 },
    { id: "lifting", category: "Mirada", name: "Lifting + laminado", duration: 75, price: 22000, deposit: 7000 },
  ],
  bookings: [
    { id: "AU-2481", time: "10:00", date: "2026-08-25", client: "Sofía Méndez", service: "Capping · Chrome Queen", status: "Confirmado" },
    { id: "AU-2482", time: "13:30", date: "2026-08-25", client: "Marina López", service: "Lifting + laminado", status: "Seña pendiente" },
    { id: "AU-2483", time: "16:00", date: "2026-08-25", client: "Clara Bianchi", service: "Capping · Soft Queen", status: "Completado" },
  ],
};

let state = loadState();
let currentView = location.hash === "#admin" ? "admin" : "public";
let publicStep = 1;
let selectedService = state.services[0]?.id;
let selectedDate = "2026-08-27";
let selectedTime = "10:30";
let toastTimer;

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(initialState); }
  catch { return structuredClone(initialState); }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function money(value) { return `$ ${Number(value).toLocaleString("es-AR")}`; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#039;"}[char])); }
function serviceById(id) { return state.services.find((service) => service.id === id); }

function render() {
  document.querySelector("#app").innerHTML = currentView === "admin" ? renderAdmin() : renderPublic();
  bindEvents();
}

function renderAdmin() {
  const todayBookings = state.bookings.filter((booking) => booking.date === "2026-08-25");
  return `<div class="app-shell">
    <aside class="sidebar">
      <div class="brand"><div class="brand-mark">aurea pages</div><div class="brand-name">De Santas</div></div>
      <div class="sidebar-label">Gestor</div>
      <nav class="nav">
        <button class="active" data-action="admin-home"><span class="nav-icon">◈</span>Resumen</button>
        <button data-action="show-toast" data-message="La agenda completa estará disponible en la siguiente iteración."><span class="nav-icon">◷</span>Agenda</button>
        <button data-action="show-toast" data-message="El catálogo se gestiona desde este resumen en la POC."><span class="nav-icon">✦</span>Servicios</button>
        <button data-action="show-toast" data-message="El módulo de clientes está preparado para la fase 2."><span class="nav-icon">◌</span>Clientes</button>
        <button data-action="show-toast" data-message="Los pagos funcionan como estados mockeados en esta POC."><span class="nav-icon">$</span>Pagos</button>
      </nav>
      <div class="sidebar-bottom"><div class="account"><div class="avatar">DS</div><div><strong>De Santas</strong><small>Administrador</small></div></div></div>
    </aside>
    <main class="main">
      <header class="topbar"><div class="crumb">Espacio / <strong>Resumen</strong></div><div class="top-actions"><button class="view-toggle" data-action="go-public">↗ Ver página pública</button><div class="avatar">DS</div></div></header>
      <section class="content">
        <div class="page-heading"><div><div class="eyebrow">Martes, 25 de agosto de 2026</div><h1>Buen día, De Santas</h1><p class="subhead">Acá tenés lo importante de tu agenda.</p></div><div class="actions"><button class="ghost-button" data-action="show-toast" data-message="Compartí este enlace: aurea.local/de-santas">Compartir página</button><button class="primary-button" data-action="open-service-modal">+ Nuevo servicio</button></div></div>
        <div class="stats">
          <div class="stat-card"><div class="stat-label">Turnos este mes</div><div class="stat-number">48</div><div class="stat-trend">↑ 12% vs. mes anterior</div></div>
          <div class="stat-card"><div class="stat-label">Ingresos proyectados</div><div class="stat-number">$ 684k</div><div class="stat-trend">↑ 8% vs. mes anterior</div></div>
          <div class="stat-card"><div class="stat-label">Señas pendientes</div><div class="stat-number">3</div><div class="stat-trend" style="color:#9b642b">Revisar hoy</div></div>
          <div class="stat-card"><div class="stat-label">Clientes recurrentes</div><div class="stat-number">72%</div><div class="stat-trend">↑ 5% vs. mes anterior</div></div>
        </div>
        <div class="dashboard-grid">
          <section class="panel"><div class="panel-heading"><h2>Agenda de hoy</h2><button data-action="show-toast" data-message="Vista calendario completa en roadmap">Ver agenda completa →</button></div>${todayBookings.length ? todayBookings.map(renderBooking).join("") : '<div class="empty-state">No hay turnos para hoy.</div>'}</section>
          <section class="panel"><div class="panel-heading"><h2>Agosto 2026</h2><button data-action="show-toast" data-message="Navegación de meses disponible en la siguiente iteración">‹ &nbsp; ›</button></div>${renderCalendar()}<div class="calendar-note">Hoy tenés <strong>3 turnos</strong> agendados.</div></section>
          <section class="panel"><div class="panel-heading"><h2>Servicios publicados</h2><button data-action="open-service-modal">Editar →</button></div><div class="service-list">${state.services.map(renderService).join("")}</div></section>
          <section class="panel"><div class="panel-heading"><h2>Próximo paso</h2></div><div style="background:#f9eee7;border-radius:10px;padding:18px"><div class="eyebrow">Tu página está lista</div><h3 style="margin:9px 0 6px">Compartila con tus clientas</h3><p style="color:var(--muted);font-size:13px;line-height:1.55">Usá el enlace público en tu bio, WhatsApp o generá un QR para tu espacio.</p><button class="primary-button" data-action="go-public">Abrir entregable →</button></div></section>
        </div>
      </section>
    </main>
  </div>`;
}

function renderBooking(booking) {
  const statusClass = booking.status === "Confirmado" ? "confirmed" : booking.status === "Completado" ? "completed" : "pending";
  return `<div class="booking-row"><div class="time">${booking.time}</div><div><div class="booking-name">${escapeHtml(booking.client)}</div><div class="booking-service">${escapeHtml(booking.service)} · ${booking.id}</div></div><span class="status ${statusClass}">${booking.status}</span></div>`;
}
function renderService(service) { return `<div class="service-item"><div class="service-dot"></div><div class="service-copy"><strong>${escapeHtml(service.name)}</strong><small>${service.duration} min · Seña ${money(service.deposit)}</small></div><div class="service-price">${money(service.price)}</div></div>`; }
function renderCalendar() {
  const days = ["L", "M", "M", "J", "V", "S", "D", "27", "28", "29", "30", "31", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]; return `<div class="mini-calendar"><div class="calendar-head"><button>‹</button><strong>Agosto 2026</strong><button>›</button></div><div class="calendar-grid">${days.map((day, i) => `<span class="${i === 36 ? "selected" : ""} ${i < 7 ? "day-name" : ""}">${day}</span>`).join("")}</div></div>`;
}

function renderPublic() {
  const service = serviceById(selectedService) || state.services[0];
  const steps = ["Servicio", "Fecha", "Datos", "Confirmar"];
  return `<div class="public-shell"><header class="public-header"><a class="public-brand" href="#public">de santas <span>✦</span></a><a href="#admin" class="tiny-link">Acceso gestor ↗</a></header>
    <section class="public-hero"><div class="hero-copy"><div class="eyebrow">Beauty studio · Buenos Aires</div><h1 class="serif">Tu momento,<br><em>a tu manera.</em></h1><p>Diseños pensados para vos, atención personalizada y un espacio donde cada detalle importa.</p><div class="hero-meta"><span>⌖ Palermo, CABA</span><span>◷ Turnos presenciales</span></div><button class="primary-button" data-action="scroll-booking">Reservar mi turno ↓</button></div><div class="hero-portrait"><div class="portrait-label">de santas beauty spa</div></div></section>
    <section class="booking-card" id="booking"><div class="eyebrow">Agenda online</div><h2>Reservá tu próximo turno</h2><p class="card-subtitle">Elegí tu servicio, encontrá el momento ideal y listo.</p><div class="progress">${steps.map((step, index) => `<div class="step ${publicStep >= index + 1 ? "active" : ""}"><span>${index + 1}</span>${step}</div>`).join("")}</div>${renderPublicStep(service)}</section>
    <footer style="color:#9b9187;font-size:11px;text-align:center;padding:0 20px 30px">Hecho con <strong style="color:#9c5b43">Aurea Pages</strong> · POC v1</footer></div>`;
}

function renderPublicStep(service) {
  if (publicStep === 1) return `<div class="choice-grid">${state.services.map((item) => `<button class="choice ${selectedService === item.id ? "selected" : ""}" data-action="select-service" data-id="${item.id}"><strong>${escapeHtml(item.name)}</strong><small>${item.category} · ${item.duration} min</small><div class="choice-price">${money(item.price)}</div></button>`).join("")}</div><div class="booking-footer"><span class="booking-footer-note">⚡ Turnos con seña previa</span><button class="primary-button" data-action="next-step">Continuar →</button></div>`;
  if (publicStep === 2) return `<div class="form-grid"><div class="field"><label>Fecha</label><select id="booking-date"><option value="2026-08-27">Jueves 27 de agosto</option><option value="2026-08-28">Viernes 28 de agosto</option><option value="2026-08-29">Sábado 29 de agosto</option></select></div><div class="field"><label>Horario disponible</label><select id="booking-time"><option>10:30</option><option>13:00</option><option>16:30</option></select></div></div><div class="booking-footer"><button class="ghost-button" data-action="prev-step">← Atrás</button><button class="primary-button" data-action="next-step">Continuar →</button></div>`;
  if (publicStep === 3) return `<div class="form-grid"><div class="field"><label>Nombre y apellido</label><input id="booking-name" placeholder="Ej. Sofía Méndez" /></div><div class="field"><label>WhatsApp</label><input id="booking-phone" placeholder="11 5555 5555" /></div><div class="field full"><label>¿Querés contarnos algo? <span style="color:var(--muted);font-weight:400">(opcional)</span></label><input id="booking-note" placeholder="Una referencia, diseño o consulta" /></div></div><div class="booking-footer"><button class="ghost-button" data-action="prev-step">← Atrás</button><button class="primary-button" data-action="next-step">Revisar reserva →</button></div>`;
  return `<div class="confirmation"><div class="confirmation-mark">✓</div><h2>¡Tu turno está reservado!</h2><p>${escapeHtml(service.name)} · ${formatDate(selectedDate)} a las ${selectedTime}</p><div class="booking-id">CÓDIGO AU-${Math.floor(2500 + Math.random() * 400)}</div><p style="margin:17px 0 0">Te enviamos los detalles por WhatsApp. Recordá que tu turno queda sujeto a la seña previa.</p></div><div class="booking-footer"><button class="ghost-button" data-action="go-admin">Volver al inicio</button><button class="primary-button" data-action="show-toast" data-message="El enlace de reprogramación estará en tu confirmación.">Agregar al calendario</button></div>`;
}

function formatDate(value) { return new Date(`${value}T12:00:00`).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }); }
function bindEvents() {
  document.querySelectorAll("[data-action]").forEach((element) => element.addEventListener("click", () => handleAction(element.dataset.action, element)));
  document.querySelectorAll("#booking-date, #booking-time").forEach((element) => element.addEventListener("change", (event) => { if (event.target.id === "booking-date") selectedDate = event.target.value; else selectedTime = event.target.value; }));
}
function handleAction(action, element) {
  if (action === "go-public") { currentView = "public"; publicStep = 1; location.hash = "public"; window.scrollTo(0, 0); render(); }
  if (action === "go-admin") { currentView = "admin"; location.hash = "admin"; render(); }
  if (action === "scroll-booking") document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" });
  if (action === "select-service") { selectedService = element.dataset.id; render(); document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth", block: "center" }); }
  if (action === "next-step") { if (publicStep === 3 && !document.querySelector("#booking-name")?.value.trim()) return showToast("Completá tu nombre para continuar."); if (publicStep === 3) createBooking(); publicStep = Math.min(4, publicStep + 1); render(); }
  if (action === "prev-step") { publicStep = Math.max(1, publicStep - 1); render(); }
  if (action === "show-toast") showToast(element.dataset.message);
  if (action === "open-service-modal") openServiceModal();
}
function createBooking() { const service = serviceById(selectedService); state.bookings.unshift({ id: `AU-${Math.floor(2500 + Math.random() * 400)}`, time: selectedTime, date: selectedDate, client: document.querySelector("#booking-name").value, service: service.name, status: "Seña pendiente" }); saveState(); }
function showToast(message) { clearTimeout(toastTimer); document.querySelector(".toast")?.remove(); const toast = document.createElement("div"); toast.className = "toast"; toast.textContent = message; document.body.appendChild(toast); toastTimer = setTimeout(() => toast.remove(), 3000); }
function openServiceModal() { const modal = document.createElement("div"); modal.className = "modal-backdrop"; modal.innerHTML = `<div class="modal"><div class="modal-head"><h2>Nuevo servicio</h2><button class="close" data-close>×</button></div><div class="form-grid"><div class="field full"><label>Nombre del servicio</label><input id="new-service-name" placeholder="Ej. Service · Diseño clásico" /></div><div class="field"><label>Duración (min)</label><input id="new-service-duration" type="number" value="90" /></div><div class="field"><label>Precio</label><input id="new-service-price" type="number" value="25000" /></div><div class="field full"><label>Seña</label><input id="new-service-deposit" type="number" value="7000" /></div></div><div class="modal-actions"><button class="ghost-button" data-close>Cancelar</button><button class="primary-button" data-save-service>Guardar servicio</button></div></div>`; document.body.appendChild(modal); modal.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => modal.remove())); modal.querySelector("[data-save-service]").addEventListener("click", () => { const name = modal.querySelector("#new-service-name").value.trim(); if (!name) return showToast("Ingresá un nombre para el servicio."); state.services.push({ id: `service-${Date.now()}`, category: "Nuevos", name, duration: Number(modal.querySelector("#new-service-duration").value), price: Number(modal.querySelector("#new-service-price").value), deposit: Number(modal.querySelector("#new-service-deposit").value) }); saveState(); modal.remove(); render(); showToast("Servicio agregado al catálogo."); }); }
window.addEventListener("hashchange", () => { currentView = location.hash === "#admin" ? "admin" : "public"; publicStep = 1; render(); });
render();
