import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combine les classes CSS avec Tailwind
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Formater une date
 */
export const formatDate = (date, options = {}) => {
  if (!date) return ''
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  
  return new Date(date).toLocaleDateString('fr-FR', defaultOptions)
}

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Générer un ID aléatoire
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Valider un email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Obtenir les initiales d'un nom
 */
export const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
}

/**
 * Analyser une requête de recherche pour extraire le titre, l'année et le type
 * Ex: "batman 2008 movie" -> { query: "batman", year: 2008, type: "movie" }
 * Ex: "game of thrones series" -> { query: "game of thrones", year: null, type: "series" }
 * Ex: "inception movie 2010" -> { query: "inception", year: 2010, type: "movie" }
 */
export const parseSearchQuery = (searchText) => {
  if (!searchText) return { query: '', year: null, type: null }
  
  let text = searchText.trim().toLowerCase()
  let year = null
  let type = null
  
  // Rechercher le type (movie, series, episode)
  const typePatterns = [
    { pattern: /\b(movie|film|movies|films)\b/g, value: 'movie' },
    { pattern: /\b(series|serie|series|tv|show|shows)\b/g, value: 'series' },
    { pattern: /\b(episode|episodes)\b/g, value: 'episode' }
  ]
  
  for (const { pattern, value } of typePatterns) {
    if (pattern.test(text)) {
      type = value
      text = text.replace(pattern, '').trim()
      break
    }
  }
  
  // Rechercher une année (4 chiffres entre 1900 et 2030)
  const yearMatch = text.match(/\b(19|20)\d{2}\b/)
  if (yearMatch) {
    year = parseInt(yearMatch[0])
    text = text.replace(yearMatch[0], '').trim()
  }
  
  // Nettoyer les espaces multiples
  const query = text.replace(/\s+/g, ' ').trim()
  
  return { query, year, type }
}