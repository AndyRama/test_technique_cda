const express = require('express');
const { query } = require('express-validator');
const {
  searchMovies,
  getMovieById,
  getTrendingMovies
} = require('../controllers/movieController');

const router = express.Router();

// Middleware de validation pour la recherche
const validateMovieSearch = [
  query('q')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le terme de recherche doit contenir entre 2 et 100 caractères'),
  query('page')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Le numéro de page doit être entre 1 et 100'),
  query('type')
    .optional()
    .isIn(['movie', 'series', 'episode'])
    .withMessage('Le type doit être movie, series ou episode'),
  query('year')
    .optional()
    .matches(/^\d{4}$/)
    .withMessage('L\'année doit être au format YYYY')
];

// Routes Movies

// GET /api/movies/trending - Films populaires
router.get('/trending', getTrendingMovies);

// GET /api/movies/search - Rechercher des films
router.get('/search', validateMovieSearch, searchMovies);

// GET /api/movies/:imdbId - Détails d'un film par ID IMDb
router.get('/:imdbId', getMovieById);

module.exports = router;