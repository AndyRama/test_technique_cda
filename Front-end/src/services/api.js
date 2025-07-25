const API_BASE = 'http://localhost:5000/api'

// Base API client
const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      return { data, status: response.status, ok: response.ok }
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString()
    const url = query ? `${endpoint}?${query}` : endpoint
    return this.request(url, { method: 'GET' })
  },

  post(endpoint, data) {
    return this.request(endpoint, { method: 'POST', body: data })
  },

  put(endpoint, data) {
    return this.request(endpoint, { method: 'PUT', body: data })
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  },
}

// Movies API
export const moviesApi = {
  search: (params) => api.get('/movies/search', params),
  getById: (id) => api.get(`/movies/${id}`),
  getPopular: () => api.get('/movies/popular'),
  getCacheStats: () => api.get('/movies/cache/stats'),
  clearCache: () => api.delete('/movies/cache'),
  test: () => api.get('/movies/test'),
}

// Users API
export const usersApi = {
  getAll: (params) => api.get('/users', params),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
}

// System API
export const systemApi = {
  health: () => api.get('/health'),
}

export default api