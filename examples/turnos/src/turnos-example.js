/** Dominio del ejemplo Turnos. */

export const turnosExample = {
  id: "turnos",
  name: "De Santas Beauty Spa",
  routes: { public: "#public", manager: "#admin" },
  services: [
    { id: "chrome-queen", name: "Capping · Chrome Queen", duration: 150, price: 35000 },
    { id: "soft-queen", name: "Capping · Soft Queen", duration: 120, price: 32000 },
    { id: "lifting", name: "Lifting + laminado", duration: 75, price: 22000 },
    { id: "clasico", name: "Service · Diseño clásico", duration: 90, price: 25000 }
  ]
};

export function createBooking({ service, date, time, client, phone }) {
  return { id: `AU-${Date.now()}`, service, date, time, client, phone, status: "Seña pendiente" };
}

export function bookingLabel(booking) {
  return `${booking.service.name} · ${booking.date} · ${booking.time}`;
}
