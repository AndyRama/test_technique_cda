import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Film } from 'lucide-react'
import apiService from '../services/apiService'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import SearchInput from '../components/ui/SearchInput'
import EmptyState from '../components/ui/EmptyState'
import ErrorMessage from '../components/ui/ErrorMessage'

// Nouveau composant Poster pour gérer les différents états
const Poster = ({ url, title }) => {
  const [hasError, setHasError] = useState(false)
  
  // Cas où l'URL est invalide ou le chargement a échoué
  if (!url || url === 'N/A' || hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
        <Film className="w-12 h-12 text-gray-400 mb-2" />
        <span className="text-xs text-gray-500">Affiche non disponible</span>
      </div>
    )
  }

  // Cas normal - affichage du poster
  return (
    <img
      src={url}
      alt={title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      loading="lazy"
      onError={() => setHasError(true)}
    />
  )
}

const MoviesPage = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPopularMovies()
  }, [])

  const loadPopularMovies = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getPopularMovies()
      if (data.success) {
        setMovies(data.data || [])
      } else {
        setError(data.message || 'Erreur lors du chargement')
      }
    } catch (error) {
      setError('Erreur de connexion à l\'API')
    } finally {
      setLoading(false)
    }
  }

  const searchMovies = async (query) => {
    if (!query.trim()) {
      loadPopularMovies()
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await apiService.searchMovies(query)
      if (data.success) {
        setMovies(data.data || [])
      } else {
        setError(data.message || 'Aucun résultat trouvé')
        setMovies([])
      }
    } catch (error) {
      setError('Erreur lors de la recherche')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎬 Découvrir les Films
        </h1>
        <p className="text-gray-600">
          Recherchez parmi des milliers de films et séries
        </p>
      </div>

      {/* Search */}
      <Card>
        <SearchInput
          placeholder="Rechercher un film... (ex: Inception, Batman)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={searchMovies}
        />
      </Card>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage
          title="Erreur de chargement"
          message={error}
          onRetry={searchQuery ? () => searchMovies(searchQuery) : loadPopularMovies}
        />
      ) : movies.length === 0 ? (
        <EmptyState
          icon={Film}
          title="Aucun film trouvé"
          description="Essayez une autre recherche ou explorez nos films populaires"
          action={
            <Button onClick={loadPopularMovies}>
              🔥 Voir les Films Populaires
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Link key={movie.imdbID} to={`/movies/${movie.imdbID}`} className="group">
              <Card hover className="overflow-hidden">
                <div className="aspect-[2/3] relative overflow-hidden">
                  {/* Utilisation du nouveau composant Poster */}
                  <Poster url={movie.poster} title={movie.title} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="secondary" size="sm">
                      {movie.year}
                    </Badge>
                    {movie.searchCount && (
                      <Badge variant="error" size="sm">
                        🔥 {movie.searchCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default MoviesPage