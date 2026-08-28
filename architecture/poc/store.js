// Mock Database implementation using localStorage
const STORAGE_KEY = 'aurea_poc_data';

const defaultData = {
  establishments: [
    {
      id: "1",
      name: "La Parrilla de Juan",
      sector: "Restaurante",
      plan: "premium",
      features: {
        menu: true,
        reservations: true,
        delivery: true,
        social: false
      },
      clientData: {
        menuItems: ["Asado", "Empanadas", "Vino Malbec"],
        deliveryActive: true,
        socialLinks: ""
      }
    },
    {
      id: "2",
      name: "Estética Belleza Spa",
      sector: "Estética",
      plan: "basic",
      features: {
        menu: false, // They use 'services' but structurally we could reuse it, let's call it services in UI
        reservations: true,
        delivery: false,
        social: true
      },
      clientData: {
        menuItems: ["Masaje Relajante", "Limpieza Facial"],
        deliveryActive: false,
        socialLinks: "@bellezaspa"
      }
    }
  ],
  currentTenantId: "1" // Para simular el login del cliente y del end-user
};

class Store {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    }
  }

  getData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  }

  saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // AUREA Backoffice methods
  getEstablishments() {
    return this.getData().establishments;
  }

  updateEstablishmentFeatures(id, features, plan) {
    const data = this.getData();
    const index = data.establishments.findIndex(e => e.id === id);
    if (index !== -1) {
      data.establishments[index].features = features;
      data.establishments[index].plan = plan;
      this.saveData(data);
    }
  }

  // Client Backoffice methods
  getCurrentTenant() {
    const data = this.getData();
    return data.establishments.find(e => e.id === data.currentTenantId);
  }

  setCurrentTenant(id) {
    const data = this.getData();
    data.currentTenantId = id;
    this.saveData(data);
  }

  updateClientData(clientData) {
    const data = this.getData();
    const index = data.establishments.findIndex(e => e.id === data.currentTenantId);
    if (index !== -1) {
      data.establishments[index].clientData = clientData;
      this.saveData(data);
    }
  }
}

window.aureaStore = new Store();
