import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Film, Users, Search, Zap, Shield, Star, TrendingUp } from 'lucide-react'
import apiService from '../services/apiService'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// Composant Poster pour gérer l'affichage des affiches de films
const Poster = ({ url, title }) => {
  const [hasError, setHasError] = useState(false)

  if (!url || url === 'N/A' || hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
        <Film className="w-12 h-12 text-gray-400 mb-2" />
        <span className="text-xs text-gray-500">Affiche non disponible</span>
      </div>
    )
  }

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

const Home = () => {
  const [apiStatus, setApiStatus] = useState(null)
  const [popularMovies, setPopularMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger le statut de l'API
        const healthData = await apiService.checkHealth()
        setApiStatus(healthData)

        // Charger quelques films populaires pour l'aperçu
        try {
          const moviesData = await apiService.getPopularMovies(3)
          if (moviesData.success) {
            setPopularMovies(moviesData.data?.slice(0, 3) || [])
          }
        } catch (error) {
          console.log('Movies API not available')
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const features = [
    {
      icon: Film,
      title: 'Recherche de Films',
      description: 'Exploration d\'une base de données de films avec OMDb. Recherchez par titre, année ou genre.',
      link: '/movies',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Users,
      title: 'Gestion d\'Utilisateurs',
      description: 'Interface complète pour gérer les utilisateurs avec création, modification et suppression.',
      link: '/users',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ]

  const stats = [
    { label: 'API Endpoints', value: '15+', icon: Zap },
    { label: 'Films Disponibles', value: '1M+', icon: Film },
    { label: 'Tests Unitaires', value: '25+', icon: Shield },
    { label: 'Performance', value: 'A+', icon: TrendingUp },
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-yellow-300 to-orange-500 text-white rounded-2xl">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
          🎬 Bienvenue sur My Movie App
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 px-4">
          Une application complète pour la recherche de films et la gestion d'utilisateurs.
          Développée avec React, Node.js et l'API OMDb.
        </p>

        {/* API Status */}
        {loading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-2">Vérification de l'API...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-4 flex-wrap">
            <Badge variant={apiStatus ? 'success' : 'error'}>
              {apiStatus ? 'API Connectée' : 'API Indisponible'}
            </Badge>
            {apiStatus && (
              <>
                <Badge variant="info">
                  Version {apiStatus.version}
                </Badge>
                <Badge variant="default">
                  {apiStatus.currentPhase}
                </Badge>
              </>
            )}
          </div>
        )}

        {/* Hero Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/movies">
            <Button size="lg" className="bg-white hover:text-orange-600 hover:bg-gray-100 rounded-lg flex-row">
              Découvrir les Films
            </Button>
          </Link>
          <Link to="/users">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-orange-600">
              <span>Gérer les Utilisateurs</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title} hover className="text-center">
              <div className={`w-20 h-20 ${feature.bgColor} rounded-md flex items-center justify-center mx-auto mb-6`}>
                <Icon className={`w-10 h-10 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              <Link to={feature.link}>
                <Button variant="primary" className="w-half rounded-md" size="lg">
                  Explorer
                </Button>
              </Link>
            </Card>
          )
        })}
      </div>

      {/* Films Populaires Preview */}
      {popularMovies.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              Films Populaires
            </h2>
            <Link to="/movies">
              <Button variant="outline" size="sm">
                Voir tous
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {popularMovies.map((movie) => (
              <Link key={movie.imdbID} to={`/movies/${movie.imdbID}`} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border">
                  <div className="aspect-[2/3] relative overflow-hidden">
                    <Poster url={movie.poster} title={movie.title} />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">{movie.year}</span>
                      {movie.searchCount && (
                        <Badge variant="error" size="sm">
                          🔥 {movie.searchCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* API Features */}
      {apiStatus && (
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Fonctionnalités de l'API
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                Endpoints Disponibles
              </h3>
              <div className="space-y-2 text-sm">
                {apiStatus.endpoints && Object.entries(apiStatus.endpoints).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-gray-600 capitalize font-medium">{key}:</span>
                    <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">
                      {value}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 text-green-500 mr-2" />
                Caractéristiques
              </h3>
              <div className="space-y-2 text-sm">
                {apiStatus.features && Object.entries(apiStatus.features).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-gray-600 font-medium">
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span className="text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Statistiques du Projet
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
                <Icon className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

export default Home