const API_BASE = "/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem("token") || localStorage.getItem("yash_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || json.message || `HTTP Error ${res.status}`);
    }
    return json.data !== undefined ? json.data : json;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Dashboard
  getDashboard: () => request("/engineering/dashboard"),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products?${query}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (data) => request("/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  cloneProduct: (id) => request(`/products/${id}/clone`, { method: "POST" }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  // Specifications
  getSpecifications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/specifications?${query}`);
  },
  createSpecification: (data) => request("/specifications", { method: "POST", body: JSON.stringify(data) }),
  updateSpecification: (id, data) => request(`/specifications/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // BOMs
  getBOMs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/boms?${query}`);
  },
  getBOM: (id) => request(`/boms/${id}`),
  createBOM: (data) => request("/boms", { method: "POST", body: JSON.stringify(data) }),
  updateBOM: (id, data) => request(`/boms/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  explodeBOM: (id, batchQuantity = 1) => request(`/boms/${id}/explosion?batchQuantity=${batchQuantity}`),
  simulateBOMCost: (id, simData) => request(`/boms/${id}/simulate`, { method: "POST", body: JSON.stringify(simData) }),
  getBOMShortages: (id, orderQuantity = 100) => request(`/boms/${id}/shortages?orderQuantity=${orderQuantity}`),

  // Documents
  getDocuments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/engineering/documents?${query}`);
  },
  createDocument: (data) => request("/engineering/documents", { method: "POST", body: JSON.stringify(data) }),
  updateDocument: (id, data) => request(`/engineering/documents/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteDocument: (id) => request(`/engineering/documents/${id}`, { method: "DELETE" }),

  // Tasks
  getTasks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/engineering/tasks?${query}`);
  },
  createTask: (data) => request("/engineering/tasks", { method: "POST", body: JSON.stringify(data) }),
  updateTask: (id, data) => request(`/engineering/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  // Traceability
  getTraceability: (skuOrId) => request(`/engineering/traceability/${encodeURIComponent(skuOrId)}`),

  // Reports
  getProductSummaryReport: () => request("/engineering/reports/products-summary"),
  getBOMCostingReport: () => request("/engineering/reports/bom-costing"),
};

export default api;
