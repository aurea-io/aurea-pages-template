/**
 * Dominio del ejemplo Restaurante.
 * La UI de la POC consume el mismo concepto desde apps/web/app.js.
 */

export const restaurantExample = {
  id: "restaurante",
  name: "La Esquina",
  routes: { public: "#restaurant", manager: "#admin-restaurant", waiter: "#waiter" },
  demoTable: { number: 3, partySize: 4, people: ["Yo", "Lucía", "Martín", "Santi"] },
  menu: [
    { id: "provoleta", category: "Para compartir", name: "Provoleta de la casa", price: 7600 },
    { id: "papas", category: "Para compartir", name: "Papas La Esquina", price: 6900 },
    { id: "burger", category: "Principales", name: "La Esquina Burger", price: 11800 },
    { id: "ravioles", category: "Principales", name: "Ravioles de calabaza", price: 10500 },
    { id: "limonada", category: "Para tomar", name: "Limonada de jengibre", price: 4800 },
    { id: "vino", category: "Para tomar", name: "Copa de la casa", price: 4200 }
  ]
};

export function createRestaurantOrder(item, person, mode = "individual", sharedWith = [person]) {
  return { ...item, quantity: 1, person, splitMode: mode, sharedWith: [...new Set(sharedWith.filter(Boolean))] };
}

export function orderTotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function participantsFor(item, table) {
  if (item.splitMode === "all") return table.people;
  return [...new Set([item.person, ...(item.sharedWith || [])].filter(Boolean))];
}

export function ticketFor(items, table) {
  return items.flatMap((item) => {
    const recipients = participantsFor(item, table);
    const total = item.price * item.quantity;
    return recipients.map((person) => ({ person, total, pays: total / recipients.length, item: item.name }));
  });
}
