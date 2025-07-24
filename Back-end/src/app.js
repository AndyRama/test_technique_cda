const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const errorHandler = require('./middleware/errorHandler')

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/users', require('./routes/users'))

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running!', timestamp: new Date().toISOString() })
})

// Route pour de l'API en fonctionnement
app.get('/api/health', (req, res) => {
  res.json({
    message: 'API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    currentPhase: 'Phase 1',
    status: {
      phase1: 'Users API - Complet',
      phase2: 'Movies API - À venir',
      phase3: 'Frontend React - À venir',
    },
    endpoints: {
      users: '/api/users',
      movies: '/api/movies', 
      health: '/api/health', 
    },
    features: {
      userManagement: 'CRUD complet avec validation',
      security: 'Hachage bcrypt + validation express-validator',
      database: 'MongoDB Atlas cloud',
      pagination: 'Pagination et recherche intégrées',
    },
  })
})

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
    ],
    comingSoon: [
			'Phase 2: /api/movies - Recherche de films OMDb',
      'Phase 3: Frontend React avec Vite.js'
    ],
  });
});

module.exports = app;