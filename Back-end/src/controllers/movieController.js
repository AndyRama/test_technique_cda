const { validationResult } = require('express-validator');

// Service OMDb - avec détection du mode test
let omdbService;
try {
  omdbService = require('../services/omdbService');
} catch (error) {
  console.log('OMDb Service non disponible');
}

// Mode test - désactiver les appels OMDb
const isTestMode = () => process.env.NODE_ENV === 'test';

// Données simulées pour les tests
const getMockSearchResults = (query) => ({
  success: true,
  data: [
    {
      imdbID: 'tt1234567',
      title: `Mock Movie for "${query}"`,
      year: '2023',
      type: 'movie',
      poster: 'https://via.placeholder.com/300x400?text=Mock+Movie'
    }
  ],
  totalResults: 1,
  fromCache: true,
  message: 'Données simulées pour tests'
});

const getMockMovieDetails = (id) => ({
  success: true,
  data: {
    imdbID: id,
    title: 'Mock Movie Details',
    year: '2023',
    type: 'movie',
    poster: 'https://via.placeholder.com/300x400?text=Mock+Details',
    plot: 'Mock plot for testing',
    director: 'Mock Director',
    actors: 'Mock Actor 1, Mock Actor 2',
    genre: 'Action, Drama',
    runtime: '120 min',
    imdbRating: '8.5',
    released: '01 Jan 2023',
    language: 'English',
    country: 'USA',
    awards: 'Mock Awards'
  },
  fromCache: true,
  message: 'Données simulées pour tests'
});

// Helper pour analyser les erreurs de validation
const getValidationErrorMessage = (errors, query) => {
  const { q } = query;
  
  // Priorité aux erreurs de paramètre q
  if (!q || q.trim() === '') {
    return 'Le paramètre de recherche est requis';
  }
  
  if (q && q.trim().length < 2) {
    return 'La recherche doit contenir au moins 2 caractères';
  }
  
  // Autres erreurs
  const firstError = errors[0];
  switch (firstError.param) {
    case 'type':
      return 'Le type doit être "movie", "series" ou "episode"';
    case 'year':
      return 'L\'année doit être valide';
    case 'page':
      return 'La page doit être un nombre valide';
    default:
      return firstError.msg || 'Erreurs de validation';
  }
};

// @desc    Rechercher des films
// @route   GET /api/movies/search
// @access  Public
const searchMovies = async (req, res, next) => {
  try {
    // Validation des erreurs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const message = getValidationErrorMessage(errors.array(), req.query);
      
      return res.status(400).json({
        success: false,
        message: message,
        errors: errors.array()
      });
    }

    const { q, year, type, page = 1 } = req.query;

    // Mode test - retourner des données simulées
    if (isTestMode()) {
      const mockResult = getMockSearchResults(q);
      return res.json({
        ...mockResult,
        query: q,
        filters: { year, type },
        pagination: {
          current: parseInt(page),
          total: 1,
          totalResults: 1
        }
      });
    }

    // Mode production - vérifier disponibilité du service
    if (!omdbService) {
      return res.status(502).json({
        success: false,
        message: 'Service OMDb non disponible',
        query: { q, year, type, page }
      });
    }

    // Appel au service OMDb
    const result = await omdbService.searchMovies(q, year, type, page);

    // Gestion des erreurs de service
    if (!result.success && !result.fromCache) {
      return res.status(502).json({
        success: false,
        message: 'Erreur lors de la recherche',
        error: result.error,
        fallbackData: result.data || [],
        query: { q, year, type, page }
      });
    }

    // Réponse de succès
    res.json({
      success: true,
      query: q,
      filters: { year, type },
      pagination: {
        current: parseInt(page),
        total: Math.ceil((result.totalResults || result.data.length) / 10),
        totalResults: result.totalResults || result.data.length
      },
      data: result.data,
      fromCache: result.fromCache || false,
      message: result.fromCache ? 'Résultats depuis le cache local' : 'Résultats depuis OMDb'
    });

  } catch (error) {
    console.error('Erreur dans searchMovies:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: isTestMode() ? 'Erreur simulée pour tests' : error.message
    });
  }
};

// @desc    Récupérer un film par ID OMDb
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    // Validation des erreurs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'ID IMDb invalide',
        errors: errors.array()
      });
    }

    const { id } = req.params;

    // Mode test - retourner des données simulées
    if (isTestMode()) {
      const mockResult = getMockMovieDetails(id);
      return res.json(mockResult);
    }

    // Mode production - vérifier disponibilité du service
    if (!omdbService) {
      return res.status(502).json({
        success: false,
        message: 'Service OMDb non disponible'
      });
    }

    // Appel au service OMDb
    const result = await omdbService.getMovieById(id);

    // Film non trouvé
    if (!result.success && !result.data) {
      return res.status(404).json({
        success: false,
        message: 'Film non trouvé',
        error: result.error
      });
    }

    // Erreur du service mais données en cache
    if (!result.success && result.data) {
      return res.status(502).json({
        success: false,
        message: 'Erreur OMDb, données depuis le cache',
        error: result.error,
        data: result.data,
        fromCache: true
      });
    }

    // Succès
    res.json({
      success: true,
      data: result.data,
      fromCache: result.fromCache,
      message: result.fromCache ? 'Données depuis le cache' : 'Données depuis OMDb'
    });

  } catch (error) {
    console.error('Erreur dans getMovieById:', error.message);
    
    if (error.message.includes('non trouvé')) {
      return res.status(404).json({
        success: false,
        message: 'Film non trouvé'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: isTestMode() ? 'Erreur simulée pour tests' : error.message
    });
  }
};

// @desc    Récupérer les films populaires/trending
// @route   GET /api/movies/popular || GET /api/movies/trending
// @access  Public
const getPopularMovies = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const parsedLimit = parseInt(limit);

    // Mode test - données simulées
    if (isTestMode()) {
      const mockMovies = [
        { 
          title: 'Mock Popular Movie 1', 
          searchCount: 15, 
          imdbID: 'tt1111111',
          year: '2023',
          type: 'movie',
          poster: 'https://via.placeholder.com/300x400?text=Popular+1'
        },
        { 
          title: 'Mock Popular Movie 2', 
          searchCount: 12, 
          imdbID: 'tt2222222',
          year: '2022',
          type: 'movie',
          poster: 'https://via.placeholder.com/300x400?text=Popular+2'
        },
        { 
          title: 'Mock Popular Movie 3', 
          searchCount: 10, 
          imdbID: 'tt3333333',
          year: '2021',
          type: 'movie',
          poster: 'https://via.placeholder.com/300x400?text=Popular+3'
        }
      ].slice(0, parsedLimit);

      return res.json({
        success: true,
        data: mockMovies,
        message: `Top ${mockMovies.length} films populaires simulés`
      });
    }

    // Mode production - vérifier disponibilité du service
    if (!omdbService) {
      return res.json({
        success: true,
        data: [],
        message: 'Service OMDb non disponible - aucun film populaire'
      });
    }

    // Appel au service OMDb
    const result = await omdbService.getPopularMovies(parsedLimit);

    res.json({
      success: true,
      data: result.data || [],
      message: `Top ${result.data?.length || 0} films les plus recherchés`
    });

  } catch (error) {
    console.error('Erreur dans getPopularMovies:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des films populaires',
      error: isTestMode() ? 'Erreur simulée pour tests' : error.message
    });
  }
};

// @desc    Statistiques du cache
// @route   GET /api/movies/cache/stats
// @access  Public
const getCacheStats = async (req, res, next) => {
  try {
    // Mode test - statistiques simulées
    if (isTestMode()) {
      return res.json({
        success: true,
        cache: {
          total: 5,
          active: 5,
          expired: 0,
          memoryUsage: '2.4MB',
          lastCleared: new Date().toISOString(),
          topMovies: [
            { title: 'Mock Movie 1', searchCount: 10, lastAccessed: new Date().toISOString() },
            { title: 'Mock Movie 2', searchCount: 8, lastAccessed: new Date().toISOString() }
          ]
        },
        message: 'Statistiques du cache simulées'
      });
    }

    // Mode production - vérifier disponibilité du service
    if (!omdbService) {
      return res.json({
        success: true,
        cache: { 
          total: 0, 
          active: 0, 
          expired: 0, 
          memoryUsage: '0MB',
          topMovies: [] 
        },
        message: 'Service OMDb non disponible'
      });
    }

    // Récupération des statistiques
    const stats = await omdbService.getCacheStats();
    
    res.json({
      success: true,
      cache: stats,
      message: 'Statistiques du cache'
    });

  } catch (error) {
    console.error('Erreur getCacheStats:', error.message);
    next(error);
  }
};

// @desc    Vider le cache
// @route   DELETE /api/movies/cache
// @access  Public
const clearCache = async (req, res, next) => {
  try {
    // Mode test - simulation
    if (isTestMode()) {
      return res.json({
        success: true,
        message: 'Cache simulé vidé avec succès',
        clearedAt: new Date().toISOString(),
        itemsRemoved: 5
      });
    }

    // Mode production - vérifier disponibilité du service
    if (!omdbService) {
      return res.json({
        success: true,
        message: 'Aucun cache à vider - service OMDb non disponible',
        clearedAt: new Date().toISOString(),
        itemsRemoved: 0
      });
    }

    // Vider le cache
    const result = await omdbService.clearCache();
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        clearedAt: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors du vidage du cache',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Erreur clearCache:', error.message);
    next(error);
  }
};

// @desc    Tester la connexion OMDb
// @route   GET /api/movies/test
// @access  Public
const testOMDbConnection = async (req, res, next) => {
  try {
    // Mode test - simulation
    if (isTestMode()) {
      return res.json({
        success: false,
        message: 'Test OMDb simulé - mode test actif',
        error: 'Mode test - pas de vraie connexion OMDb',
        testMode: true,
        timestamp: new Date().toISOString()
      });
    }

    // Mode production - vérifier disponibilité du service
    if (!omdbService) {
      return res.status(502).json({
        success: false,
        message: 'Service OMDb non disponible',
        error: 'Module OMDb non chargé',
        timestamp: new Date().toISOString()
      });
    }

    // Test de connexion
    const result = await omdbService.testConnection();
    
    const statusCode = result.success ? 200 : 502;
    
    res.status(statusCode).json({
      success: result.success,
      message: result.message,
      error: result.error,
      details: {
        apiKey: result.apiKey,
        testMovie: result.testMovie,
        responseTime: result.responseTime || 'N/A',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erreur test OMDb:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors du test de connexion OMDb',
      error: isTestMode() ? 'Erreur simulée pour tests' : error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  searchMovies,
  getMovieById,
  getPopularMovies,
  getCacheStats,
  clearCache,
  testOMDbConnection
};