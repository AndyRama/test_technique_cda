const axios = require('axios');

const OMDB_API_URL = 'http://www.omdbapi.com/';
const API_KEY = process.env.OMDB_API_KEY;

// @desc    Rechercher des films
// @route   GET /api/movies/search?q=titre&page=1
// @access  Public
const searchMovies = async (req, res, next) => {
  try {
    const { q: query, page = 1, type = '', year = '' } = req.query;

    // Validation de la requête
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Le terme de recherche doit contenir au moins 2 caractères'
      });
    }

    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Clé API OMDb non configurée'
      });
    }

    // Paramètres pour l'API OMDb
    const params = {
      apikey: API_KEY,
      s: query.trim(),
      page: parseInt(page) || 1
    };

    // Filtres optionnels
    if (type && ['movie', 'series', 'episode'].includes(type)) {
      params.type = type;
    }
    if (year && /^\d{4}$/.test(year)) {
      params.y = year;
    }

    // Appel à l'API OMDb
    const response = await axios.get(OMDB_API_URL, { params });
    const data = response.data;

    // Vérifier si l'API OMDb a retourné une erreur
    if (data.Response === 'False') {
      return res.status(404).json({
        success: false,
        message: data.Error || 'Aucun film trouvé',
        query: query
      });
    }

    // Formater la réponse
    const formattedMovies = data.Search.map(movie => ({
      imdbID: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      type: movie.Type,
      poster: movie.Poster !== 'N/A' ? movie.Poster : null
    }));

    res.json({
      success: true,
      data: formattedMovies,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(parseInt(data.totalResults) / 10),
        totalResults: parseInt(data.totalResults)
      },
      query: {
        search: query,
        type: type || 'all',
        year: year || 'all'
      }
    });

  } catch (error) {
    // Gestion des erreurs de l'API externe
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: 'Erreur de l\'API OMDb',
        error: error.response.data
      });
    }

    next(error);
  }
};

// @desc    Récupérer les détails d'un film par ID IMDb
// @route   GET /api/movies/:imdbId
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    const { imdbId } = req.params;

    // Validation de l'ID IMDb
    if (!imdbId || !imdbId.match(/^tt\d{7,}$/)) {
      return res.status(400).json({
        success: false,
        message: 'ID IMDb invalide (format: tt1234567)'
      });
    }

    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Clé API OMDb non configurée'
      });
    }

    // Appel à l'API OMDb pour les détails
    const response = await axios.get(OMDB_API_URL, {
      params: {
        apikey: API_KEY,
        i: imdbId,
        plot: 'full'
      }
    });

    const data = response.data;

    if (data.Response === 'False') {
      return res.status(404).json({
        success: false,
        message: data.Error || 'Film non trouvé'
      });
    }

    // Formater les détails du film
    const movieDetails = {
      imdbID: data.imdbID,
      title: data.Title,
      year: data.Year,
      rated: data.Rated !== 'N/A' ? data.Rated : null,
      released: data.Released !== 'N/A' ? data.Released : null,
      runtime: data.Runtime !== 'N/A' ? data.Runtime : null,
      genre: data.Genre !== 'N/A' ? data.Genre.split(', ') : [],
      director: data.Director !== 'N/A' ? data.Director : null,
      writer: data.Writer !== 'N/A' ? data.Writer : null,
      actors: data.Actors !== 'N/A' ? data.Actors.split(', ') : [],
      plot: data.Plot !== 'N/A' ? data.Plot : null,
      language: data.Language !== 'N/A' ? data.Language : null,
      country: data.Country !== 'N/A' ? data.Country : null,
      awards: data.Awards !== 'N/A' ? data.Awards : null,
      poster: data.Poster !== 'N/A' ? data.Poster : null,
      ratings: data.Ratings || [],
      metascore: data.Metascore !== 'N/A' ? parseInt(data.Metascore) : null,
      imdbRating: data.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : null,
      imdbVotes: data.imdbVotes !== 'N/A' ? data.imdbVotes : null,
      type: data.Type,
      dvd: data.DVD !== 'N/A' ? data.DVD : null,
      boxOffice: data.BoxOffice !== 'N/A' ? data.BoxOffice : null,
      production: data.Production !== 'N/A' ? data.Production : null,
      website: data.Website !== 'N/A' ? data.Website : null
    };

    res.json({
      success: true,
      data: movieDetails
    });

  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: 'Erreur de l\'API OMDb',
        error: error.response.data
      });
    }

    next(error);
  }
};

// @desc    Récupérer les tendances (films populaires)
// @route   GET /api/movies/trending
// @access  Public
const getTrendingMovies = async (req, res, next) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Clé API OMDb non configurée'
      });
    }

    // Liste de films populaires récents (à adapter selon vos besoins)
    const popularSearches = [
      'Avengers', 'Batman', 'Spider-Man', 'Star Wars', 'Marvel',
      'Mission Impossible', 'Fast Furious', 'John Wick'
    ];

    // Prendre un terme aléatoire pour simuler des tendances
    const randomSearch = popularSearches[Math.floor(Math.random() * popularSearches.length)];
    
    const response = await axios.get(OMDB_API_URL, {
      params: {
        apikey: API_KEY,
        s: randomSearch,
        page: 1
      }
    });

    const data = response.data;

    if (data.Response === 'False') {
      return res.status(404).json({
        success: false,
        message: 'Erreur lors de la récupération des tendances'
      });
    }

    const trendingMovies = data.Search.slice(0, 6).map(movie => ({
      imdbID: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      type: movie.Type,
      poster: movie.Poster !== 'N/A' ? movie.Poster : null
    }));

    res.json({
      success: true,
      data: trendingMovies,
      message: `Films populaires - ${randomSearch}`
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchMovies,
  getMovieById,
  getTrendingMovies
};