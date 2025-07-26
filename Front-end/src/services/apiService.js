import axios from 'axios'
import { API_ENDPOINTS, apiConfig } from '../config/api'

// Configuration globale d'Axios
const api = axios.create(apiConfig)

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// ===== SERVICES API =====

export const apiService = {
  // ===== HEALTH =====
  async checkHealth() {
    const response = await api.get(API_ENDPOINTS.HEALTH)
    return response.data
  },

  // ===== USERS =====
	
  async getUsers() {
    const response = await api.get(API_ENDPOINTS.USERS)
    return response.data
  },

  async getUserById(id) {
    const response = await api.get(API_ENDPOINTS.USER_BY_ID(id))
    return response.data
  },

  async createUser(userData) {
    const response = await api.post(API_ENDPOINTS.USERS, userData)
    return response.data
  },

  async updateUser(id, userData) {
    const response = await api.put(API_ENDPOINTS.USER_BY_ID(id), userData)
    return response.data
  },

  async deleteUser(id) {
    const response = await api.delete(API_ENDPOINTS.USER_BY_ID(id))
    return response.data
  },

  // ===== MOVIES =====

  async searchMovies(query, filters = {}) {
    const { year, type } = filters
    const params = { q: query }
    if (year) params.year = year
    if (type) params.type = type
    
    const response = await api.get(API_ENDPOINTS.MOVIES_SEARCH, { params })
    return response.data
  },

  async getMovieById(id) {
    const response = await api.get(API_ENDPOINTS.MOVIE_BY_ID(id))
    return response.data
  },

  async getPopularMovies(limit = 10) {
    const response = await api.get(API_ENDPOINTS.MOVIES_POPULAR_WITH_LIMIT(limit))
    return response.data
  },

  async testMovieAPI() {
    const response = await api.get(API_ENDPOINTS.MOVIES_TEST)
    return response.data
  },

  async getCacheStats() {
    const response = await api.get(API_ENDPOINTS.MOVIES_CACHE_STATS)
    return response.data
  },

  async clearCache() {
    const response = await api.delete(API_ENDPOINTS.MOVIES_CACHE_CLEAR)
    return response.data
  }
}

export default apiService