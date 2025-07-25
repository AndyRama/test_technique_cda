import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Film, Users } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text mb-4">
            404
          </div>
        </div>

        <Card>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Oups ! Page introuvable
          </h1>
          <p className="text-gray-600 mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="primary" className="w-full sm:w-auto rounded-md">
                  Retour à l'accueil
                </Button>
              </Link>
              <Button 
                variant="secondary" 
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto rounded-md"
              >
                Page précédente
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">Ou explorez nos sections :</p>
              <div className="flex gap-2 justify-center">
                <Link to="/movies">
                  <Button variant="outline" size="sm">
                    <Film className="w-4 h-4 mr-2" />
                    Films
                  </Button>
                </Link>
                <Link to="/users">
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Utilisateurs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default NotFound