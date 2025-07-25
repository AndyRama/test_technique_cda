import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Film, Users, Package, Home, Menu, X } from 'lucide-react'
import { cn } from '../../utils/helpers'

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false)
	const location = useLocation()

	const navigation = [
		{ name: 'Accueil', href: '/', icon: Home },
		{ name: 'Films', href: '/movies', icon: Film },
		{ name: 'Utilisateurs', href: '/users', icon: Users },
	]

	const isActive = (path) => {
		if (path === '/') {
			return location.pathname === '/'
		}
		return location.pathname.startsWith(path)
	}

	return (
		<nav className="bg-white shadow-sm border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					{/* Logo et titre */}
					<div className="flex items-center">
						<Link to="/" className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-gradient-to-br from-yellow-300 to-orange-600 rounded-lg flex items-center justify-center">
								<Film className="w-5 h-5 text-white" />
							</div>
							<span className="text-xl font-bold text-gray-900">
								My Movie App
							</span>
						</Link>
					</div>

					{/* Navigation desktop */}
					<div className="hidden md:flex items-center space-x-8">
						{navigation.map((item) => {
							const Icon = item.icon
							return (
								<Link
									key={item.name}
									to={item.href}
									className={cn(
										'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
										isActive(item.href)
											? 'text-orange-600 bg-primary-50'
											: 'text-gray-700 hover:text-orange-600 hover:bg-gray-100'
									)}
								>
									<Icon className="w-4 h-4" />
									<span>{item.name}</span>
								</Link>
							)
						})}
					</div>

					{/* Bouton menu mobile */}
					<div className="md:hidden flex items-center">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="text-gray-700 hover:text-orange-600 p-2"
						>
							{isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
						</button>
					</div>
				</div>

				{/* Navigation mobile */}
				{isOpen && (
					<div className="md:hidden border-t border-gray-200 py-4">
						<div className="space-y-2">
							{navigation.map((item) => {
								const Icon = item.icon
								return (
									<Link
										key={item.name}
										to={item.href}
										onClick={() => setIsOpen(false)}
										className={cn(
											'flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors',
											isActive(item.href)
												? 'text-orange-600 bg-primary-50'
												: 'text-gray-700 hover:text-orange-600 hover:bg-gray-100'
										)}
									>
										<Icon className="w-5 h-5" />
										<span>{item.name}</span>
									</Link>
								)
							})}
						</div>
					</div>
				)}
			</div>
		</nav>
	)
}

export default Navbar