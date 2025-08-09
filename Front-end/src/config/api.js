// Configuration des URLs API
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://test-technique-cda-gesb.vercel.app/api'  // Production
    : '/api'  // Développement avec proxy Vite
  )

export const API_ENDPOINTS = {
  // ===== HEALTH & STATUS =====
  HEALTH: `${API_BASE_URL}/health`,
  
  // ===== USERS API (Phase 1) =====
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  
  // ===== MOVIES API (Phase 2) =====
  // Recherche de films
  MOVIES_SEARCH: `${API_BASE_URL}/movies/search`,
  MOVIES_SEARCH_WITH_PARAMS: (query, year = null, type = null) => {
    let url = `${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}`
    if (year) url += `&year=${year}`
    if (type) url += `&type=${type}`
    return url
  },
  
  // Films par ID (format: tt1234567)
  MOVIE_BY_ID: (id) => `${API_BASE_URL}/movies/${id}`,
  
  // Films populaires
  MOVIES_POPULAR: `${API_BASE_URL}/movies/popular`,
  MOVIES_POPULAR_WITH_LIMIT: (limit = 10) => `${API_BASE_URL}/movies/popular?limit=${limit}`,
  
  // Outils et cache
  MOVIES_TEST: `${API_BASE_URL}/movies/test`,
  MOVIES_CACHE_STATS: `${API_BASE_URL}/movies/cache/stats`,
  MOVIES_CACHE_CLEAR: `${API_BASE_URL}/movies/cache`,
}

// Helpers pour construire les URLs avec paramètres
export const buildMovieSearchUrl = (query, filters = {}) => {
  const { year, type } = filters
  return API_ENDPOINTS.MOVIES_SEARCH_WITH_PARAMS(query, year, type)
}

// Configuration Axios par défaut
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
}

export default API_BASE_URL