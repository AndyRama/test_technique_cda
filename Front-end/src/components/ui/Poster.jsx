import { useState } from 'react'
import { Film } from 'lucide-react'

const Poster = ({ url, title, className = '', size = 'default' }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // URL par défaut si pas d'image
  const defaultPoster = import.meta.env.VITE_DEFAULT_POSTER_URL || 
    'https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Poster'

  // Classes de taille
  const sizeClasses = {
    sm: 'w-20 h-28',
    default: 'w-full h-full',
    lg: 'w-80 h-120'
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  // Si pas d'URL ou URL invalide, utiliser l'image par défaut
  const imageUrl = !url || url === 'N/A' || imageError ? defaultPoster : url

  return (
    <div className={`relative overflow-hidden bg-gray-200 ${sizeClasses[size]} ${className}`}>
      {/* Loading spinner */}
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
        </div>
      )}

      {/* Image ou placeholder */}
      {!imageError && url && url !== 'N/A' ? (
        <img
          src={imageUrl}
          alt={title || 'Movie poster'}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500">
          <Film className="w-12 h-12 mb-2" />
          <span className="text-xs text-center px-2 font-medium">
            {title ? title.substring(0, 20) + (title.length > 20 ? '...' : '') : 'No Image'}
          </span>
        </div>
      )}

      {/* Overlay au hover */}
      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
        <div className="text-white text-center p-2">
          <Film className="w-6 h-6 mx-auto mb-1" />
          <span className="text-xs font-medium">Voir détails</span>
        </div>
      </div>
    </div>
  )
}

export default Poster