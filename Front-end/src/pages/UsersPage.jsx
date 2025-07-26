import React, { useState, useEffect } from 'react'
import { Users, Plus } from 'lucide-react'
import apiService from '../services/apiService'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorMessage from '../components/ui/ErrorMessage'
import Modal from '../components/ui/Modal'

const UsersPage = () => {
  // États pour la liste des utilisateurs
  const [users, setUsers] = useState([]) // Liste des utilisateurs
  const [loading, setLoading] = useState(true) // État de chargement
  const [error, setError] = useState(null) // Erreurs de chargement
  
  // États pour le modal et formulaire
  const [showModal, setShowModal] = useState(false) // Affichage du modal
  const [formLoading, setFormLoading] = useState(false) // État de soumission du formulaire
  const [formError, setFormError] = useState(null) // Erreurs du formulaire
  const [formSuccess, setFormSuccess] = useState(false) // Succès de la création
  
  // Données du formulaire de création
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    role: 'user'
  })

  // Chargement initial des utilisateurs
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await apiService.getUsers()
        if (data.success) {
          setUsers(data.data || [])
        } else {
          setError(data.message || 'Service temporairement indisponible')
        }
      } catch (error) {
        setError('Erreur de connexion à l\'API')
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  // Gestion des changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Réinitialisation du formulaire
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      age: '',
      role: 'user'
    })
    setFormError(null)
    setFormSuccess(false)
  }

  // Soumission du formulaire de création
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError(null)

    try {
      // Préparation des données utilisateur
      const userData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined
      }
      
      // Appel API pour créer l'utilisateur
      const data = await apiService.createUser(userData)
      
      if (data.success) {
        setFormSuccess(true)
        // Ajout du nouvel utilisateur à la liste
        setUsers(prev => [...prev, data.data])
        
        // Fermeture automatique du modal après 1.5 secondes
        setTimeout(() => {
          setShowModal(false)
          resetForm()
        }, 1500)
      } else {
        setFormError(data.message || 'Erreur lors de la création')
      }
    } catch (error) {
      // Gestion des erreurs de validation
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ')
        setFormError(errorMessages)
      } else if (error.response?.data?.message) {
        setFormError(error.response.data.message)
      } else {
        setFormError('Erreur de connexion à l\'API')
      }
    } finally {
      setFormLoading(false)
    }
  }

  // Fermeture du modal
  const handleCloseModal = () => {
    setShowModal(false)
    resetForm()
  }

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👥 Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600">
            Gérez les comptes utilisateurs de l'application
          </p>
        </div>
        {/* Bouton d'ouverture du modal de création */}
        <Button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-md"
        >
          Nouvel Utilisateur
        </Button>
      </div>

      {/* Contenu principal */}
      {loading ? (
        // État de chargement
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        // État d'erreur avec documentation des endpoints
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
              {/* Carte Créer */}
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 text-xl">➕</span>
                </div>
                <h4 className="font-medium">Créer Utilisateur</h4>
                <p className="text-sm text-gray-600 mt-1">POST /api/users</p>
              </div>
              {/* Carte Lister */}
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium">Liste Utilisateurs</h4>
                <p className="text-sm text-gray-600 mt-1">GET /api/users</p>
              </div>
              {/* Carte Modifier */}
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
        // État vide - aucun utilisateur
        <EmptyState
          icon={Users}
          title="Aucun utilisateur"
          description="Aucun utilisateur trouvé dans la base de données"
        />
      ) : (
        // Grille des utilisateurs
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <Card key={user._id || user.id} className="h-full bg-gray-50 border border-gray-200">
              <div className="text-center">
                {/* Avatar avec initiale */}
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">
                    {user.name?.charAt(0).toUpperCase() || '👤'}
                  </span>
                </div>
                
                {/* Informations utilisateur */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                  <p className="text-gray-600 text-sm break-words">{user.email}</p>
                  
                  {/* Badges informatifs */}
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {/* Badge âge */}
                    {user.age && (
                      <Badge variant="secondary" size="sm">
                        📅 {user.age} ans
                      </Badge>
                    )}
                    {/* Badge rôle */}
                    <Badge variant={user.role === 'admin' ? 'primary' : 'default'} size="sm">
                      👑 {user.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                    {/* Badge statut actif */}
                    <Badge 
                      variant={user.isActive !== false ? 'success' : 'error'} 
                      size="sm"
                    >
                      {user.isActive !== false ? '✅ Actif' : '❌ Inactif'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de création d'utilisateur */}
      <Modal 
        isOpen={showModal} 
        onClose={handleCloseModal}
        title="➕ Créer un Utilisateur"
        size="md"
      >
        {formSuccess ? (
          // Écran de succès
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">✅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Utilisateur créé avec succès !
            </h3>
            <p className="text-gray-600">
              L'utilisateur a été ajouté à la liste.
            </p>
          </div>
        ) : (
          // Formulaire de création
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Affichage des erreurs */}
            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{formError}</p>
              </div>
            )}

            {/* Champ Nom */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Jean Dupont"
              />
            </div>

            {/* Champ Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="jean.dupont@example.com"
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Minimum 6 caractères"
              />
            </div>

            {/* Grille Âge et Rôle */}
            <div className="grid grid-cols-2 gap-4">
              {/* Champ Âge */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Âge
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="0"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>

              {/* Champ Rôle */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-4">
              {/* Bouton Annuler */}
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseModal}
                className="flex-1"
              >
                Annuler
              </Button>
              {/* Bouton Créer */}
              <Button
                type="submit"
                disabled={formLoading}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {formLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Création...
                  </>
                ) : (
                  <>
                    Créer
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

export default UsersPage