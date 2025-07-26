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

// Validation pour la recherche de films
const validateMovieSearch = [
  query('q')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La recherche doit contenir entre 2 et 100 caractères'),
  query('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('L\'année doit être entre 1900 et ' + (new Date().getFullYear() + 5)),
  query('type')
    .optional()
    .isIn(['movie', 'series', 'episode'])
    .withMessage('Le type doit être "movie", "series" ou "episode"'),
  query('page')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La page doit être entre 1 et 100')
];

// Validation pour récupérer un film par ID
const validateMovieId = [
  param('id')
    .matches(/^tt\d{7,8}$/)
    .withMessage('L\'ID OMDb doit être au format "tt" suivi de 7-8 chiffres')
];

// Routes principales
router.get('/search', validateMovieSearch, searchMovies);
router.get('/popular', getPopularMovies);
router.get('/test', testOMDbConnection);
router.get('/cache/stats', getCacheStats);
router.delete('/cache', clearCache);
router.get('/:id', validateMovieId, getMovieById);

module.exports = router;

