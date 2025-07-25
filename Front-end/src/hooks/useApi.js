import { useState, useEffect } from 'react'

/**
 * Hook personnalisé pour gérer les appels API
 * @param {Function} apiCall - Fonction d'appel API
 * @param {Array} dependencies - Dépendances pour relancer l'appel
 * @param {boolean} immediate - Exécuter immédiatement
 */
export const useApi = (apiCall, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const execute = async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall(...args)
      setData(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, dependencies)

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  }
}

/**
 * Hook pour les opérations CRUD
 */
export const useCrud = (api) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchItems = async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getAll(params)
      setItems(response.data.data || response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createItem = async (itemData) => {
    try {
      const response = await api.create(itemData)
      const newItem = response.data.data || response.data
      setItems(prev => [newItem, ...prev])
      return newItem
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      throw err
    }
  }

  const updateItem = async (id, itemData) => {
    try {
      const response = await api.update(id, itemData)
      const updatedItem = response.data.data || response.data
      setItems(prev => prev.map(item => 
        item._id === id || item.id === id ? updatedItem : item
      ))
      return updatedItem
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      throw err
    }
  }

  const deleteItem = async (id) => {
    try {
      await api.delete(id)
      setItems(prev => prev.filter(item => 
        item._id !== id && item.id !== id
      ))
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      throw err
    }
  }

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    setItems,
    setError,
  }
}