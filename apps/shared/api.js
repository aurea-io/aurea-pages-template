// API Mock para comunicación entre micros (Base de Datos simulada)
const TENANTS_STORAGE_KEY = 'aurea_tenants_features_poc';

const defaultTenants = {
  'De Santas': { features: { agenda: true, servicios: true, menu: false, delivery: false } },
  'La Esquina': { features: { agenda: false, servicios: false, menu: true, delivery: true } },
  'Miga': { features: { agenda: false, servicios: false, menu: true, delivery: true } }
};

window.api = {
  getTenants: function() {
    const stored = localStorage.getItem(TENANTS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(defaultTenants));
    return defaultTenants;
  },
  
  saveTenants: function(tenants) {
    localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
  },
  
  updateTenantFeature: function(tenantName, feature, value) {
    const tenants = this.getTenants();
    if (!tenants[tenantName]) tenants[tenantName] = { features: {} };
    tenants[tenantName].features[feature] = value;
    this.saveTenants(tenants);
  },
  
  getTenantFeatures: function(tenantName) {
    const tenants = this.getTenants();
    return tenants[tenantName]?.features || {};
  }
};
