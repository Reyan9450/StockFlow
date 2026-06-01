import axios from 'axios'

const API_BASE = (() => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:8001'
  // Force https in production to avoid mixed content errors
  if (window.location.protocol === 'https:' && url.startsWith('http:')) {
    return url.replace('http:', 'https:')
  }
  return url
})()
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('API_BASE:', API_BASE)

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

/** Ensure the response is always an array */
function ensureArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === 'object' && 'items' in data) return (data as any).items as T[]
  return []
}

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsApi = {
  getAll: (params?: { search?: string; category?: string }) =>
    api.get('/products', { params }).then((r) => ensureArray(r.data)),
  getById: (id: number) => api.get(`/products/${id}`).then((r) => r.data),
  create: (data: unknown) => api.post('/products', data).then((r) => r.data),
  update: (id: number, data: unknown) => api.put(`/products/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/products/${id}`).then((r) => r.data),
}

// ─── Customers ────────────────────────────────────────────────────────────────
export const customersApi = {
  getAll: (params?: { search?: string }) =>
    api.get('/customers', { params }).then((r) => ensureArray(r.data)),
  getById: (id: number) => api.get(`/customers/${id}`).then((r) => r.data),
  create: (data: unknown) => api.post('/customers', data).then((r) => r.data),
  delete: (id: number) => api.delete(`/customers/${id}`).then((r) => r.data),
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export const ordersApi = {
  getAll: (params?: { status?: string }) =>
    api.get('/orders', { params }).then((r) => ensureArray(r.data)),
  getById: (id: number) => api.get(`/orders/${id}`).then((r) => r.data),
  create: (data: unknown) => api.post('/orders', data).then((r) => r.data),
  delete: (id: number) => api.delete(`/orders/${id}`).then((r) => r.data),
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats').then((r) => r.data),
}
