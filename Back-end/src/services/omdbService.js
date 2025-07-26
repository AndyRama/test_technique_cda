const axios = require("axios");

class OMDbService {
  constructor() {
    this.apiKey = process.env.OMDB_API_KEY;
    this.baseURL = "http://www.omdbapi.com/";
    this.cache = new Map(); // Cache en mémoire
    this.rateLimitDelay = 1000; // 1 seconde entre les requêtes
    this.lastRequestTime = 0;
  }

  // Gestion du rate limiting
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }

  // Recherche de films
  async searchMovies(query, year = null, type = null, page = 1) {
    try {
      if (!this.apiKey || this.apiKey === "your_omdb_api_key_here") {
        console.log("🔍 Recherche OMDb:", query, "(page", page, ")");
        return {
          success: false,
          error: "Clé API OMDb manquante",
          data: this.getOfflineResults(query),
          fromCache: true,
        };
      }

      console.log("🔍 Recherche OMDb:", query, "(page", page, ")");
      await this.waitForRateLimit();

      const params = {
        apikey: this.apiKey,
        s: query,
        page: page,
      };

      if (year) params.y = year;
      if (type) params.type = type;

      const response = await axios.get(this.baseURL, {
        params,
        timeout: 5000, // 5 secondes seulement
      });

      if (response.data.Response === "False") {
        return {
          success: false,
          error: response.data.Error,
          data: this.getOfflineResults(query),
          fromCache: true,
        };
      }

      const movies = response.data.Search.map((movie) => ({
        imdbID: movie.imdbID,
        title: movie.Title,
        year: movie.Year,
        type: movie.Type,
        poster: movie.Poster,
      }));

      // Sauvegarder en cache mémoire
      this.cache.set(`search_${query}_${page}`, movies);

      return {
        success: true,
        data: movies,
        totalResults: parseInt(response.data.totalResults) || 0,
        page: page,
        fromCache: false,
      };
    } catch (error) {
      console.error("Erreur OMDb Service:", error.message);

      // Fallback vers cache mémoire ou données exemple
      const fallbackData =
        this.cache.get(`search_${query}_${page}`) ||
        this.getOfflineResults(query);

      return {
        success: false,
        error: `Service OMDb indisponible: ${error.message}`,
        data: fallbackData,
        fromCache: true,
      };
    }
  }

  // Récupérer un film par ID
  async getMovieById(imdbID) {
    try {
      if (!this.apiKey || this.apiKey === "your_omdb_api_key_here") {
        console.log("🎬 Récupération détails OMDb:", imdbID);
        return {
          success: false,
          error: "Clé API OMDb manquante",
          data: this.getOfflineMovieDetails(imdbID),
        };
      }

      console.log("🎬 Récupération détails OMDb:", imdbID);

      // Vérifier cache mémoire d'abord
      if (this.cache.has(imdbID)) {
        return {
          success: true,
          data: this.cache.get(imdbID),
          fromCache: true,
        };
      }

      await this.waitForRateLimit();

      const response = await axios.get(this.baseURL, {
        params: {
          apikey: this.apiKey,
          i: imdbID,
          plot: "full",
        },
        timeout: 5000, // 5 secondes seulement
      });

      if (response.data.Response === "False") {
        return {
          success: false,
          error: response.data.Error,
          data: this.getOfflineMovieDetails(imdbID),
        };
      }

      const movieData = this.formatOMDbResponse(response.data);

      // Sauvegarder en cache mémoire
      this.cache.set(imdbID, movieData);

      return {
        success: true,
        data: movieData,
        fromCache: false,
      };
    } catch (error) {
      console.error("Erreur OMDb Service (détails):", error.message);

      return {
        success: false,
        error: `Service OMDb indisponible: ${error.message}`,
        data: this.getOfflineMovieDetails(imdbID),
      };
    }
  }

  async getPopularMovies(limit = 10) {
    try {
      console.log("🔥 Films populaires demandés (limit:", limit, ")");

      // Mode simulation - toujours retourner des données
      const popularMovies = [
        {
          imdbID: "tt1375666",
          title: "Inception",
          year: "2010",
          type: "movie",
          poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
          searchCount: 25,
        },
        {
          imdbID: "tt0111161",
          title: "The Shawshank Redemption",
          year: "1994",
          type: "movie",
          poster: "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_SX300.jpg",
          searchCount: 20,
        },
        {
          imdbID: "tt0468569",
          title: "The Dark Knight",
          year: "2008",
          type: "movie",
          poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
          searchCount: 18,
        },
        {
          imdbID: "tt0848228",
          title: "The Avengers",
          year: "2012",
          type: "movie",
          poster: "https://m.media-amazon.com/images/M/MV5BNGE0YTVjNzUtNzJjOS00NGNlLTgxMzctZTY4YTE1Y2Y1ZTU4XkEyXkFqcGc@._V1_SX300.jpg",
          searchCount: 15,
        },
        {
          imdbID: "tt0137523",
          title: "Fight Club",
          year: "1999",
          type: "movie",
          poster: "https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_SX300.jpg",
          searchCount: 12,
        },
        {
          imdbID: "tt0109830",
          title: "Forrest Gump",
          year: "1994",
          type: "movie",
          poster: "https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_SX300.jpg",
          searchCount: 22,
        },
        {
          imdbID: "tt0120737",
          title: "The Lord of the Rings: The Fellowship of the Ring",
          year: "2001",
          type: "movie",
          poster: "https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00ZTRhLTk4ODQtMTVlOWY4NTdiYmMwXkEyXkFqcGc@._V1_SX300.jpg",
          searchCount: 19,
        },
        {
          imdbID: "tt0080684",
          title: "Star Wars: Episode V - The Empire Strikes Back",
          year: "1980",
          type: "movie",
          poster: "https://m.media-amazon.com/images/M/MV5BMTkxNGFlNDktZmJkNC00MDdhLTg0MTEtZjZiYWI3MGE5NWIwXkEyXkFqcGc@._V1_SX300.jpg",
          searchCount: 14,
        },
      ].slice(0, limit);

      return {
        success: true,
        data: popularMovies,
      };
    } catch (error) {
      console.error("Erreur getPopularMovies:", error.message);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Statistiques du cache (version mémoire)
  async getCacheStats() {
    return {
      total: this.cache.size,
      active: this.cache.size,
      expired: 0,
      topMovies: Array.from(this.cache.keys())
        .slice(0, 5)
        .map((key) => ({
          title: key,
          searchCount: 1,
        })),
    };
  }

  // Vider le cache
  async clearCache() {
    this.cache.clear();
    return { success: true, message: "Cache mémoire vidé" };
  }

  // Tester la connexion
  async testConnection() {
    try {
      if (!this.apiKey || this.apiKey === "your_omdb_api_key_here") {
        return {
          success: false,
          error: "Clé API OMDb manquante dans .env",
        };
      }

      await this.waitForRateLimit();

      const response = await axios.get(this.baseURL, {
        params: {
          apikey: this.apiKey,
          t: "Inception",
        },
        timeout: 3000, // 3 secondes
      });

      if (response.data.Response === "True") {
        return {
          success: true,
          message: "Connexion OMDb réussie",
          apiKey: `${this.apiKey.substring(0, 4)}****`,
        };
      } else {
        return {
          success: false,
          error: response.data.Error,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Connexion OMDb échouée: ${error.message}`,
      };
    }
  }

  // Données hors ligne de secours
  getOfflineResults(query) {
    const offlineMovies = [
      {
        imdbID: "tt1375666",
        title: "Inception",
        year: "2010",
        type: "movie",
        poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
      },
      {
        imdbID: "tt0111161",
        title: "The Shawshank Redemption",
        year: "1994",
        type: "movie",
        poster: "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_SX300.jpg",
      },
      {
        imdbID: "tt0468569",
        title: "The Dark Knight",
        year: "2008",
        type: "movie",
        poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
      },
      {
        imdbID: "tt0109830",
        title: "Forrest Gump",
        year: "1994",
        type: "movie",
        poster: "https://m.media-amazon.com/images/M/MV5BMjAwMzQzNTc5OV5BMl5BanBnXkFtZTgwNDgyMTU2NzE@._V1_SX300.jpg",
      },
      {
        imdbID: "tt0120737",
        title: "The Lord of the Rings: The Fellowship of the Ring",
        year: "2001",
        type: "movie",
        poster: "https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00ZTRhLTk4ODQtMTVlOWY4NTdiYmMwXkEyXkFqcGc@._V1_SX300.jpg",
      },
      {
        imdbID: "tt0080684",
        title: "Star Wars: Episode V - The Empire Strikes Back",
        year: "1980",
        type: "movie",
        poster: "https://m.media-amazon.com/images/M/MV5BMTkxNGFlNDktZmJkNC00MDdhLTg0MTEtZjZiYWI3MGE5NWIwXkEyXkFqcGc@._V1_SX300.jpg",
      },
      {
        imdbID: "tt1375666",
        title: "Inception",
        year: "2010",
        type: "movie",
        poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
      },
      {
        imdbID: "tt0111161",
        title: "The Shawshank Redemption",
        year: "1994",
        type: "movie",
        poster: "https://via.placeholder.com/300x400?text=Shawshank",
      },
      {
        imdbID: "tt1853728",
        title: "Django Unchained",
        year: "2012",
        type: "movie",
        poster: "https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_SX300.jpg",
        searchCount: 17,
      },
      {
        imdbID: "tt0816692",
        title: "Interstellar",
        year: "2014",
        type: "movie",
        poster: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg",
        searchCount: 23,
      },
    ];

    return offlineMovies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Détails film hors ligne
  getOfflineMovieDetails(imdbID) {
    const offlineDetails = {
      tt1375666: {
        imdbID: "tt1375666",
        title: "Inception",
        year: "2010",
        type: "movie",
        poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
        plot: "A thief who steals corporate secrets... (données hors ligne)",
        director: "Christopher Nolan",
        actors: "Leonardo DiCaprio, Marion Cotillard",
        genre: "Action, Sci-Fi, Thriller",
        runtime: "148 min",
        imdbRating: "8.8",
        released: "16 Jul 2010",
        language: "English",
        country: "USA",
        awards: "Won 4 Oscars",
      },
    };

    return (
      offlineDetails[imdbID] || {
        imdbID: imdbID,
        title: "Film Non Disponible",
        year: "N/A",
        type: "movie",
        poster: "https://via.placeholder.com/300x400?text=No+Data",
        plot: "Données non disponibles en mode hors ligne",
        director: "N/A",
        actors: "N/A",
        genre: "N/A",
        runtime: "N/A",
        imdbRating: "N/A",
        released: "N/A",
        language: "N/A",
        country: "N/A",
        awards: "N/A",
      }
    );
  }

  // Formater la réponse OMDb
  formatOMDbResponse(data) {
    return {
      imdbID: data.imdbID,
      title: data.Title,
      year: data.Year,
      type: data.Type,
      poster: data.Poster,
      plot: data.Plot,
      director: data.Director,
      actors: data.Actors,
      genre: data.Genre,
      runtime: data.Runtime,
      imdbRating: data.imdbRating,
      released: data.Released,
      language: data.Language,
      country: data.Country,
      awards: data.Awards,
      writer: data.Writer,
    };
  }
}

module.exports = new OMDbService();