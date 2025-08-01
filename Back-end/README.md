# My Movie App - Backend API

## 🎬 Vue d'ensemble

My Movie App est une application complète de gestion et recherche de films développée en 3 phases progressives. Le backend fournit une API RESTful robuste avec gestion des utilisateurs et intégration à l'API OMDb pour la recherche de films.

**Version actuelle**: 1.3.0  
**Phase active**: phase 1 et Phase 2 (Users and Movies API)

## 📋 Table des matières

- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Architecture des phases](#architecture-des-phases)
- [Phase 1 - Server Express + API Users](#phase-1---server-express--api-users)
- [Phase 2 - API Movies](#phase-2---api-movies)
- [Phase 3 - Frontend React](#phase-3---frontend-react)
- [Endpoints disponibles](#endpoints-disponibles)
- [Tests](#tests)

## 🛠️ Technologies utilisées

- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de données**: MongoDB
- **API externe**: OMDb API
- **Cache**: MongoDB + Cache mémoire
- **Validation**: Express-validator
- **CORS**: Activé pour le développement
- **Frontend**: React + Vite.js (Phase 3)

## ⚙️ Prérequis

- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB >= 5.0
- Clé API OMDb (gratuite sur [omdbapi.com](http://omdbapi.com))

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <repository-url>
cd my-movie-app-backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

Créer un fichier `.env` à la racine :

```env
# Serveur
PORT=5000
NODE_ENV=development

# Base de données MongoDB
MONGODB_URI=mongodb://[username:password@]host[:port][,...hostN[:port]][/[database][?parameter_list]]

# OMDb API
OMDB_API_KEY=your-omdb-api-key-here
OMDB_BASE_URL=http://www.omdbapi.com/

# Cache
CACHE_TTL=3600
MAX_CACHE_SIZE=1000
```

### 4. Démarrer l'application

```bash
# Développement avec nodemon
npm run dev

# Production
npm start
```

L'API sera accessible sur `http://localhost:5000`

## 🏗️ Architecture des phases

```
📁 my-movie-app/
├── 📁 backend/                 # Phase 1 & 2
│   ├── 📁 routes/
│   │   ├── users.js           # API Users (Phase 1)
│   │   └── movies.js          # API Movies (Phase 2)
│   ├── 📁 middleware/
│   ├── 📁 models/
│   ├── 📁 controllers/
│   ├── 📁 services/
│   └── app.js                 # Serveur Express principal
└── 📁 frontend/               # Phase 3 (à venir)
    └── react-app/             # Application React + Vite
```

## 🔧 Phase 1 - Server Express + API Users

### ✅ Fonctionnalités implémentées

- Serveur Express configuré
- Middleware CORS et parsing JSON
- API CRUD complète pour les utilisateurs
- Validation des données
- Gestion d'erreurs centralisée
- Endpoints de santé et monitoring

### 👥 API Users - Endpoints

```
GET    /api/users              # Liste tous les utilisateurs
POST   /api/users              # Créer un nouvel utilisateur
GET    /api/users/:id          # Récupérer un utilisateur par ID
PUT    /api/users/:id          # Modifier un utilisateur
DELETE /api/users/:id          # Supprimer un utilisateur
```

### Exemple d'utilisation

```bash

# Récupérer tous les utilisateurs
curl http://localhost:5000/api/users

# Supprimer User andy avec Id : 688395e30f054a453dd97e4c
curl -X DELETE http://localhost:5000/api/users/688395e30f054a453dd97e4c

# Créer un utilisateur Andy
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Andy Rama",
    "email": "andy@example.com",
    "password":"pbxk106789",
    "age": 40
  }'

```

## 🎬 Phase 2 - API Movies

### ✅ Fonctionnalités implémentées

- Intégration avec l'API OMDb
- Recherche de films avec filtres avancés
- Cache intelligent (MongoDB + mémoire)
- Rate limiting (1 req/sec vers OMDb)
- Système de fallback en cas d'erreur
- Statistiques de cache
- Films populaires (les plus recherchés)

### 🎭 API Movies - Endpoints

```
GET /api/movies/search?q=titre                    # Recherche simple
GET /api/movies/search?q=titre&year=2020         # Avec filtre année
GET /api/movies/search?q=titre&type=movie        # Avec filtre type
GET /api/movies/:id                               # Détails (format: tt1234567)
GET /api/movies/popular?limit=10                 # Films populaires
GET /api/movies/test                              # Test connexion OMDb
GET /api/movies/cache/stats                      # Statistiques cache
DELETE /api/movies/cache                         # Vider le cache
```

### Paramètres de recherche disponibles

| Paramètre | Description            | Exemple                       |
|-----------|------------------------|-------------------------------|
| `q`       | Titre du film (requis) | `q=Avengers`                  |
| `year`    | Année de sortie        | `year=2019`                   |
| `type`    | Type de contenu        | `type=movie` ou `type=series` |
| `page`    | Page de résultats      | `page=2`                      |

### Exemples d'utilisation

```bash
# Recherche simple
curl "http://localhost:5000/api/movies/search?q=Avengers"

# Recherche avec filtres
curl "http://localhost:5000/api/movies/search?q=Batman&year=2008&type=movie"

# Détails d'un film spécifique
curl "http://localhost:5000/api/movies/tt1375666"

# Films les plus populaires
curl "http://localhost:5000/api/movies/popular?limit=5"

# Statistiques du cache
curl "http://localhost:5000/api/movies/cache/stats"
```

### 💾 Système de cache

Le cache fonctionne sur 2 niveaux :

1. **Cache mémoire** : Réponses récentes (TTL: 1 heure)
2. **Cache MongoDB** : Stockage persistant des films
3. **Fallback** : En cas d'erreur OMDb, utilise le cache

## 🌐 Phase 3 - Frontend React

### 🚧 À venir

- Interface utilisateur React avec Vite.js
- Recherche de films en temps réel
- Affichage des détails de films
- Gestion des favoris
- Interface responsive

## 📡 Endpoints disponibles

### 🏥 Health Check

```
GET /api/health
```

Retourne le statut complet de l'API :

```json
{
  "message": "API is running!",
  "version": "1.3.0",
  "currentPhase": "Phase 2",
  "status": {
    "phase1": "Users API - ✅ Actif",
    "phase3": "Movies API - ✅ Actif",
    "phase4": "Frontend React - ✅ Actif"
  },
  "features": {
    "userManagement": "CRUD complet avec validation",
    "movieSearch": "Recherche films OMDb avec cache intelligent",
    "caching": "Cache MongoDB + mémoire pour performances",
    "rateLimit": "Protection rate limiting OMDb (1 req/sec)",
    "fallback": "Fallback cache en cas d'erreur OMDb"
  }
}
```

## 🧪 Tests

### Tester l'API Users

```bash
# Santé de l'API
curl http://localhost:5000/api/health

# Créer un utilisateur de test
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'
```

### Tester l'API Movies

```bash
# Test de connexion OMDb
curl http://localhost:5000/api/movies/test

# Recherche de test
curl "http://localhost:5000/api/movies/search?q=Inception"

# Vérifier le cache
curl http://localhost:5000/api/movies/cache/stats
```

## 📊 Monitoring

### Métriques disponibles

- **Cache hit rate** : Taux de succès du cache
- **API response times** : Temps de réponse
- **OMDb API usage** : Utilisation de l'API externe
- **Popular searches** : Recherches les plus fréquentes

### Logs

Les logs sont affichés dans la console en mode développement :

```bash
npm run dev
```

## 🔧 Configuration avancée

### Variables d'environnement 

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://[username:password@]host[:port][,...hostN[:port]][/[database][?parameter_list]]
OMDB_API_KEY=[apiKey]
```

## 🐛 Troubleshooting

### Problèmes courants

#### ❌ Erreur de connexion MongoDB

```bash
# Vérifier que MongoDB est démarré
sudo systemctl status mongod

# Ou avec Homebrew sur macOS
brew services list | grep mongodb
```

#### ❌ Erreur API OMDb

```bash
# Tester votre clé API
curl "http://www.omdbapi.com/?t=inception&apikey=YOUR_API_KEY"

# Vérifier les statistiques
curl http://localhost:5000/api/movies/cache/stats
```

#### ❌ Cache plein

```bash
# Vider le cache
curl -X DELETE http://localhost:5000/api/movies/cache
```

### Messages d'erreur courants

| Erreur | Cause | Solution |
|--------|-------|----------|
| `OMDb API key required` | Clé API manquante | Ajouter `OMDB_API_KEY` dans `.env` |
| `MongoDB connection failed` | Base non accessible | Vérifier `MONGODB_URI` |
| `Rate limit exceeded` | Trop de requêtes | Attendre ou vider le cache |

## 📚 Documentation API complète

Une fois l'API démarrée, consultez :

- **Health check** : `http://localhost:5000/api/health`
- **Test endpoints** : `http://localhost:5000/api/movies/test`
- **Route 404** : Toute route inexistante affiche la documentation complète

## 🔜 Roadmap

### Phase 3 - Frontend React
- [ ] Interface de recherche de films
- [ ] Affichage des résultats avec pagination
- [ ] Page de détails de film
- [ ] Système de favoris
- [ ] Interface responsive

### Améliorations futures
- [ ] Authentification utilisateurs 
- [ ] Listes personnalisées de films
- [ ] Recommandations basées sur l'historique
- [ ] API de critiques et notes

---