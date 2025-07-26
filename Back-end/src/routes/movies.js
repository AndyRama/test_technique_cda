const express = require('express');
const { query, param } = require('express-validator');
const {
  searchMovies,
  getMovieById,
  getPopularMovies,
  getCacheStats,
  clearCache,
  testOMDbConnection
} = require('../controllers/movieController');

const router = express.Router();

// MIDDLEWARES DE VALIDATION 
// Validation robuste pour la recherche de films
const validateMovieSearch = [
  // Validation du paramètre q (requis)
  query('q')
    .notEmpty()
    .withMessage('Le paramètre de recherche est requis')
    .bail() // Arrête la validation si vide
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La recherche doit contenir au moins 2 caractères')
    .matches(/^[a-zA-Z0-9\s\-_.:!?'"]+$/)
    .withMessage('La recherche contient des caractères non autorisés'),

  // Validation de l'année (optionnelle)
  query('year')
    .optional()
    .isInt({ min: 1888, max: new Date().getFullYear() + 10 })
    .withMessage(`L'année doit être entre 1888 et ${new Date().getFullYear() + 10}`)
    .toInt(),

  // Validation du type (optionnelle)
  query('type')
    .optional()
    .isIn(['movie', 'series', 'episode'])
    .withMessage('Le type doit être "movie", "series" ou "episode"')
    .toLowerCase(),

  // Validation de la page (optionnelle)
  query('page')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La page doit être entre 1 et 100')
    .toInt(),

  // Validation de la limite (optionnelle)
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('La limite doit être entre 1 et 50')
    .toInt()
];

// Validation stricte pour l'ID IMDb
const validateMovieId = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID IMDb est requis')
    .matches(/^tt\d{7,8}$/)
    .withMessage('L\'ID IMDb doit être au format "tt" suivi de 7-8 chiffres (ex: tt1234567)')
    .isLength({ min: 9, max: 10 })
    .withMessage('L\'ID IMDb doit contenir 9 ou 10 caractères')
];

// Validation pour les paramètres de limite
const validateLimit = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('La limite doit être entre 1 et 50')
    .toInt()
];

// Validation pour les paramètres de cache
const validateCacheOperation = [
  query('force')
    .optional()
    .isBoolean()
    .withMessage('Le paramètre force doit être un booléen')
    .toBoolean()
];

// MIDDLEWARES CUSTOM
// Middleware pour logger les requêtes en mode développement
const logRequest = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎬 ${req.method} ${req.originalUrl}`, {
      query: req.query,
      params: req.params,
      ip: req.ip,
      userAgent: req.get('User-Agent')?.substring(0, 50)
    });
  }
  next();
};

// Middleware pour ajouter des headers de cache
const setCacheHeaders = (req, res, next) => {
  // Cache pour 5 minutes pour les données de films
  res.set({
    'Cache-Control': 'public, max-age=300',
    'X-API-Version': '1.0',
    'X-Rate-Limit': '100/hour'
  });
  next();
};

// Middleware pour les réponses CORS spécifiques aux films
const setCorsHeaders = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
};

// ROUTES PRINCIPALES
// Application des middlewares globaux pour toutes les routes
router.use(logRequest);
router.use(setCorsHeaders);

// Route de recherche de films avec validation complète
router.get('/search', 
  setCacheHeaders,
  validateMovieSearch, 
  searchMovies
);

// Route pour les films populaires avec validation optionnelle
router.get('/popular', 
  setCacheHeaders,
  validateLimit, 
  getPopularMovies
);

// Route alias pour les films trending (même logique que popular)
router.get('/trending', 
  setCacheHeaders,
  validateLimit, 
  getPopularMovies
);

// Route pour récupérer un film par ID avec validation stricte
router.get('/:id', 
  setCacheHeaders,
  validateMovieId, 
  getMovieById
);

// ROUTES UTILITAIRES
// Route de test de connexion OMDb
router.get('/test', testOMDbConnection);

// Routes de gestion du cache
router.get('/cache/stats', getCacheStats);
router.delete('/cache', validateCacheOperation, clearCache);

// Route d'informations sur l'API Movies
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Movies - Documentation des endpoints',
    version: '1.0.0',
    endpoints: {
      search: {
        method: 'GET',
        path: '/api/movies/search',
        description: 'Rechercher des films par titre',
        parameters: {
          q: 'string (requis, 2-100 caractères)',
          year: 'number (optionnel, 1888-2035)',
          type: 'string (optionnel: movie, series, episode)',
          page: 'number (optionnel, 1-100)',
          limit: 'number (optionnel, 1-50)'
        },
        example: '/api/movies/search?q=Batman&year=2008&type=movie'
      },
      details: {
        method: 'GET',
        path: '/api/movies/:id',
        description: 'Récupérer les détails d\'un film par ID IMDb',
        parameters: {
          id: 'string (requis, format: ttXXXXXXX)'
        },
        example: '/api/movies/tt1375666'
      },
      popular: {
        method: 'GET',
        path: '/api/movies/popular',
        description: 'Récupérer les films populaires',
        parameters: {
          limit: 'number (optionnel, 1-50, défaut: 10)'
        },
        example: '/api/movies/popular?limit=20'
      },
      trending: {
        method: 'GET',
        path: '/api/movies/trending',
        description: 'Alias pour /popular - films tendances',
        parameters: {
          limit: 'number (optionnel, 1-50, défaut: 10)'
        },
        example: '/api/movies/trending'
      },
      test: {
        method: 'GET',
        path: '/api/movies/test',
        description: 'Tester la connexion au service OMDb',
        example: '/api/movies/test'
      },
      cache: {
        stats: {
          method: 'GET',
          path: '/api/movies/cache/stats',
          description: 'Statistiques du cache'
        },
        clear: {
          method: 'DELETE',
          path: '/api/movies/cache',
          description: 'Vider le cache',
          parameters: {
            force: 'boolean (optionnel)'
          }
        }
      }
    },
    rateLimit: '100 requêtes par heure',
    cachePolicy: '5 minutes pour les données de films',
    supportedFormats: ['JSON'],
    status: {
      omdb: process.env.OMDB_API_KEY ? 'Configuré' : 'Non configuré',
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// GESTION D'ERREURS
// Middleware de gestion des erreurs 404 pour les routes non trouvées
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint non trouvé',
    availableEndpoints: [
      'GET /api/movies/search?q=query',
      'GET /api/movies/popular',
      'GET /api/movies/trending', 
      'GET /api/movies/:id',
      'GET /api/movies/test',
      'GET /api/movies/cache/stats',
      'DELETE /api/movies/cache',
      'GET /api/movies/ (documentation)'
    ],
    requestedPath: req.originalUrl,
    method: req.method,
    suggestion: 'Consultez GET /api/movies/ pour la documentation complète'
  });
});

module.exports = router;