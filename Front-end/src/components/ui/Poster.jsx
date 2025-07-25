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

export default Poster