const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Middleware globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES ACTIVES =====
// Phase 1 - Users
app.use('/api/users', require('./routes/users'));

// Phase 2 - Movies
app.use('/api/movies', require('./routes/movies'));

// Route de santé de l'API
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'API is running!', 
    timestamp: new Date().toISOString(),
    version: '1.3.0',
    currentPhase: 'Phase 2',
    status: {
      phase1: 'Users API - ✅ Actif',
      phase3: 'Movies API - ✅ Actif',
      phase4: 'Frontend React - ✅ Actif'
    },
    endpoints: {
      users: '/api/users',
      movies: '/api/movies',
      health: '/api/health'
    },
    features: {
      userManagement: 'CRUD complet avec validation',
      movieSearch: 'Recherche films OMDb avec cache intelligent',
      caching: 'Cache MongoDB + mémoire pour performances',
      rateLimit: 'Protection rate limiting OMDb (1 req/sec)',
      fallback: 'Fallback cache en cas d\'erreur OMDb',
      validation: 'Validation complète des paramètres'
    },
    movieEndpoints: {
      search: 'GET /api/movies/search?q=titre&year=2020&type=movie',
      getById: 'GET /api/movies/:id (format: tt1234567)',
      popular: 'GET /api/movies/popular?limit=10',
      test: 'GET /api/movies/test',
      cacheStats: 'GET /api/movies/cache/stats',
      clearCache: 'DELETE /api/movies/cache'
    }
  });
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Route 404 pour toutes les autres routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    phase: 'Phase 3 active',
    availableEndpoints: [
      'GET /api/health - Santé de l\'API',
      '',
      '=== Users API (Phase 1) ===',
      'GET /api/users - Liste des utilisateurs',
      'POST /api/users - Créer un utilisateur',
      'GET /api/users/:id - Récupérer un utilisateur',
      'PUT /api/users/:id - Modifier un utilisateur', 
      'DELETE /api/users/:id - Supprimer un utilisateur',
      '',
      '=== Movies API (Phase 2) ===',
      'GET /api/movies/search?q=titre - Rechercher des films',
      'GET /api/movies/search?q=titre&year=2020 - Avec filtres',
      'GET /api/movies/:id - Détails film (format: tt1234567)',
      'GET /api/movies/popular - Films les plus recherchés',
      'GET /api/movies/test - Tester connexion OMDb',
      'GET /api/movies/cache/stats - Statistiques du cache',
      'DELETE /api/movies/cache - Vider le cache'
    ],
    comingSoon: [
      'Phase 3: Frontend React avec Vite.js'
    ],
    examples: {
      movieSearch: 'curl "http://localhost:5000/api/movies/search?q=Avenger"',
      movieDetails: 'curl "http://localhost:5000/api/movies/tt1375666"',
      popularMovies: 'curl "http://localhost:5000/api/movies/popular"'
    }
  });
});

module.exports = app;