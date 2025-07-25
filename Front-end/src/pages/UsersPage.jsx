import React, { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import { usersApi } from '../services/api'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorMessage from '../components/ui/ErrorMessage'

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await usersApi.getAll()
        if (response.data.success) {
          setUsers(response.data.data || [])
        } else {
          setError(response.data.message || 'Service temporairement indisponible')
        }
      } catch (error) {
        setError('Erreur de connexion à l\'API')
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          👥 Gestion des Utilisateurs
        </h1>
        <p className="text-gray-600">
          Gérez les comptes utilisateurs de l'application
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Card>
          <ErrorMessage
            title="Service indisponible"
            message={error}
          />
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🚀 Fonctionnalités CRUD Utilisateurs
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 text-xl">➕</span>
                </div>
                <h4 className="font-medium">Créer Utilisateur</h4>
                <p className="text-sm text-gray-600 mt-1">POST /api/users</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium">Liste Utilisateurs</h4>
                <p className="text-sm text-gray-600 mt-1">GET /api/users</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 text-xl">✏️</span>
                </div>
                <h4 className="font-medium">Modifier Utilisateur</h4>
                <p className="text-sm text-gray-600 mt-1">PUT /api/users/:id</p>
              </div>
            </div>
          </div>
        </Card>
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucun utilisateur"
          description="Aucun utilisateur trouvé dans la base de données"
        />
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user._id || user.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {user.name?.charAt(0).toUpperCase() || '👤'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {user.age && (
                        <Badge variant="secondary" size="sm">
                          📅 {user.age} ans
                        </Badge>
                      )}
                      <Badge variant={user.role === 'admin' ? 'primary' : 'default'} size="sm">
                        👑 {user.role === 'admin' ? 'Admin' : 'User'}
                      </Badge>
                      <Badge 
                        variant={user.isActive !== false ? 'success' : 'error'} 
                        size="sm"
                      >
                        {user.isActive !== false ? '✅ Actif' : '❌ Inactif'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default UsersPage