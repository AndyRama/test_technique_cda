const express = require('express');
const router = express.Router();

// Route par défaut du router principal
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Router principal actif',
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET /api/health - Santé de l\'API',
      'GET /api/users - Gestion des utilisateurs',
      'GET /api/movies - Gestion des films'
    ]
  });
});

// Route de test du router
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Router de test fonctionnel',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;