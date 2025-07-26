import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Calendar, Clock, User, Users, Film } from 'lucide-react'
import { moviesApi } from '../services/api'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'

const MovieDetailPage = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [movie, setMovie] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const loadMovie = async () => {
			try {
				const response = await moviesApi.getById(id)
				if (response.data.success) {
					setMovie(response.data.data)
				} else {
					setError(response.data.message || 'Film non trouvé')
				}
			} catch (error) {
				setError('Erreur lors du chargement du film')
			} finally {
				setLoading(false)
			}
		}
		loadMovie()
	}, [id])

	if (loading) {
		return (
			<div className="space-y-6">
				<Button onClick={() => navigate('/movies')} variant="secondary">
					Retour aux films
				</Button>
				<div className="flex justify-center py-12">
					<LoadingSpinner size="lg" />
				</div>
			</div>
		)
	}

	if (error || !movie) {
		return (
			<div className="space-y-6">
				<Button onClick={() => navigate('/movies')} variant="secondary">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Retour aux films
				</Button>
				<ErrorMessage
					title="Film non trouvé"
					message={error || 'Le film demandé n\'existe pas'}
				/>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<Button onClick={() => navigate('/movies')} variant="secondary">
				Retour aux films
			</Button>

			<Card>
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Poster */}
					<div className="lg:col-span-1">
						<div className="aspect-[2/3] relative overflow-hidden rounded-xl bg-gray-100 shadow-lg">
							{movie.poster && movie.poster !== 'N/A' ? (
								<img
									src={movie.poster}
									alt={movie.title}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<Film className="w-16 h-16 text-gray-400" />
								</div>
							)}
						</div>
					</div>

					{/* Info */}
					<div className="lg:col-span-2 space-y-6">
						<div>
							<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
								{movie.title}
							</h1>

							<div className="flex flex-wrap gap-2 mb-4">
								{movie.year && (
									<Badge variant="secondary">
										<Calendar className="w-4 h-4 mr-1" />
										{movie.year}
									</Badge>
								)}
								{movie.runtime && movie.runtime !== 'N/A' && (
									<Badge variant="secondary">
										<Clock className="w-4 h-4 mr-1" />
										{movie.runtime}
									</Badge>
								)}
								{movie.imdbRating && movie.imdbRating !== 'N/A' && (
									<Badge variant="warning">
										<Star className="w-4 h-4 mr-1" />
										{movie.imdbRating}/10
									</Badge>
								)}
							</div>

							{movie.genre && movie.genre !== 'N/A' && (
								<div className="flex flex-wrap gap-2 mb-4">
									{movie.genre.split(', ').map((genre, index) => (
										<Badge key={index} variant="outline">
											{genre}
										</Badge>
									))}
								</div>
							)}
						</div>

						{movie.plot && movie.plot !== 'N/A' && (
							<div>
								<h2 className="text-xl font-semibold text-gray-900 mb-3">
									📖 Synopsis
								</h2>
								<p className="text-gray-700 leading-relaxed">
									{movie.plot}
								</p>
							</div>
						)}

						<div className="grid sm:grid-cols-2 gap-4">
							{movie.director && movie.director !== 'N/A' && (
								<div className="flex items-start space-x-3">
									<User className="w-5 h-5 text-gray-400 mt-0.5" />
									<div>
										<p className="font-medium text-gray-900">Réalisateur</p>
										<p className="text-gray-600">{movie.director}</p>
									</div>
								</div>
							)}

							{movie.actors && movie.actors !== 'N/A' && (
								<div className="flex items-start space-x-3">
									<Users className="w-5 h-5 text-gray-400 mt-0.5" />
									<div>
										<p className="font-medium text-gray-900">Acteurs</p>
										<p className="text-gray-600">{movie.actors}</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}

export default MovieDetailPage