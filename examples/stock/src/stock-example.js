/** Dominio del ejemplo Stock. */

export const stockExample = {
  id: "stock",
  name: "Miga",
  routes: { public: "#stock", manager: "#admin-stock" },
  products: [
    { id: "brownie", name: "Brownie de chocolate", category: "Dulce", price: 4200, stock: 8, unit: "unidades", min: 4 },
    { id: "lemon-pie", name: "Lemon pie individual", category: "Dulce", price: 4800, stock: 3, unit: "unidades", min: 4 },
    { id: "cookies", name: "Cookies artesanales", category: "Dulce", price: 2500, stock: 14, unit: "unidades", min: 5 },
    { id: "box", name: "Box merienda para dos", category: "Combos", price: 12500, stock: 5, unit: "boxes", min: 2 }
  ]
};

export function isLowStock(product) {
  return product.stock <= product.min;
}

export function reserveProduct(product, quantity = 1) {
  if (quantity < 1 || quantity > product.stock) throw new Error("La cantidad solicitada no está disponible");
  return { productId: product.id, quantity, total: product.price * quantity, status: "Pendiente de retiro" };
}
