# 🎬 My Movie App - Frontend

Application React complète pour la recherche de films et la gestion d'utilisateurs, développée avec React, Vite et l'API OMDb.

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-4.5.14-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?logo=tailwind-css)
![Axios](https://img.shields.io/badge/Axios-1.11.0-5A29E4)

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Technologies](#technologies)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Scripts disponibles](#scripts-disponibles)
- [Fonctionnalités](#fonctionnalités)
- [API](#api)
- [Composants](#composants)
- [Contribution](#contribution)

## 🎯 Aperçu

My Movie App est une application web moderne permettant de :
- 🔍 Rechercher des films via l'API OMDb
- 👥 Gérer les utilisateurs (CRUD complet)
- 📱 Interface responsive avec Tailwind CSS
- ⚡ Performance optimisée avec Vite
- 🧪 Tests avec Vitest

## 🚀 Technologies

### Core
- **React 18.3.1** - Bibliothèque UI moderne
- **Vite 4.5.14** - Bundler ultra-rapide
- **React Router 6.30.1** - Routing côté client

### Styling & UI
- **Tailwind CSS 3.4.17** - Framework CSS utility-first
- **Lucide React 0.263.1** - Icônes modernes
- **clsx & tailwind-merge** - Gestion conditionnelle des classes

### HTTP & State
- **Axios 1.11.0** - Client HTTP
- **React Hooks** - Gestion d'état locale

### Development & Testing
- **ESLint 8.57.1** - Linting JavaScript/React
- **Vitest 0.34.6** - Framework de test unitaire
- **PostCSS 8.5.6 & Autoprefixer 10.4.21** - Post-processing CSS

## 📁 Structure du projet

```
src/
├── components/                # Composants réutilisables
│   ├── layout/                # Composants de mise en page
│   │   └── Navbar.jsx         # Navigation principale
│   └── ui/                    # Composants UI de base
│       ├── Avatar.jsx
│       ├── Badge.jsx
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── EmptyState.jsx
│       ├── ErrorMessage.jsx
│       ├── LoadingSpinner.jsx
│       ├── Modal.jsx
│       ├── Pagination.jsx
│       ├── Poster.jsx
│       ├── SearchInput.jsx
│       └── Toaster.jsx
├── hooks/                      # Hooks personnalisés
│   └── useApi.js               # Hook pour les appels API
├── pages/                      # Pages de l'application
│   ├── Home.jsx                # Page d'accueil
│   ├── MovieDetailPage.jsx     # Page détails films 
│   ├── MoviesPage.jsx          # Liste des films
│   ├── NotFound.jsx            # Page 404
│   └── UsersPage.jsx           # Gestion utilisateurs
├── services/                   # Services API
│   └── api.js                  # Configuration Axios
├── utils/                      # Utilitaires
│   └── helpers.js              # Fonctions helper
├── App.jsx                     # Composant racine
├── main.jsx                    # Point d'entrée
└── index.css                   # Styles globaux
```

## ⚙️ Installation

### Prérequis
- **Node.js** 20.x ou supérieur
- **npm** ou **yarn**

### Installation des dépendances

```bash
# Cloner le repository
git clone [url-du-repo]
cd Front-end

# Installer les dépendances
npm install
# ou
yarn install
```

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev           # Lance le serveur de développement (port 3000)

# Production
npm run build         # Build de production
npm run preview       # Prévisualisation du build

# Qualité de code
npm run lint          # Vérification ESLint

# Tests
npm run test          # Lance les tests unitaires
npm run test:ui       # Interface graphique pour les tests
```

## ✨ Fonctionnalités

### 🎬 Gestion des Films
- **Recherche avancée** - Par titre, année, genre
- **Détails complets** - Affichage détaillé avec poster, synopsis, casting
- **Pagination** - Navigation fluide dans les résultats
- **États de chargement** - Spinners et messages d'erreur

### 👥 Gestion des Utilisateurs
- **CRUD complet** - Création, lecture, modification, suppression
- **Validation** - Formulaires avec validation côté client
- **Interface intuitive** - Modals et composants réactifs

### 🎨 Interface Utilisateur
- **Design moderne** - Interface clean avec Tailwind CSS
- **Responsive** - Adaptation mobile, tablette, desktop
- **Accessibilité** - Navigation clavier, contrastes optimisés
- **Loading states** - Gestion des états de chargement

### 🔧 Architecture Technique
- **Composants réutilisables** - Architecture modulaire
- **Hooks personnalisés** - Logic métier encapsulée
- **Services centralisés** - Gestion API structurée
- **Gestion d'erreurs** - Handling robuste des erreurs

## 🌐 API

### Backend Local
```javascript
// Endpoints utilisateurs
GET    /api/users           # Liste des utilisateurs
POST   /api/users           # Créer un utilisateur
PUT    /api/users/:id       # Modifier un utilisateur
DELETE /api/users/:id       # Supprimer un utilisateur
```
```javascript
// Endpoints movies
GET /api/movies/search?q=title              # Recherche des films
GET /api/movies/search?q=title&year=2020    # Avec fILTRES
GET /api/movies/:id                         # Détails film (format: tt1234567)
GET /api/movies/popular                     # Films les plus recherchés
GET /api/movies/test                        # Tester connexion OMDB
GET /api/movies/cache/stats                 # Statistique du cache 
DELETE /api/movies/cache                    # Vider le cache
```

### API Externe (OMDb)
```javascript
// Recherche de films
GET https://www.omdbapi.com/?s=[titre]&apikey=[key]

// Détails d'un film
GET https://www.omdbapi.com/?i=[imdbID]&apikey=[key]
```

## 🧩 Composants Principaux

### Layout
- **Navbar** - Navigation principale avec liens actifs

### UI Components
- **Button** - Boutons avec variants (primary, secondary, danger)
- **Card** - Conteneurs avec shadow et border-radius
- **Modal** - Overlays pour formulaires et confirmations
- **LoadingSpinner** - Indicateurs de chargement
- **ErrorMessage** - Affichage d'erreurs avec retry
- **Pagination** - Navigation entre pages de résultats

### Pages
- **Home** - Dashboard avec statistiques
- **MoviesPage** - Recherche et liste des films
- **MovieDetailPage** - Détails complets d'un film
- **UsersPage** - Interface CRUD pour utilisateurs

## 🧪 Tests

```bash
# Lancer tous les tests
npm run test

# Mode watch
npm run test -- --watch

# Coverage
npm run test -- --coverage

# Interface graphique
npm run test:ui
```

## 📦 Build & Déploiement

```bash
# Build de production
npm run build

# Les fichiers sont générés dans le dossier 'dist/'
# Servir avec n'importe quel serveur statique
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📝 Convention de code

- **ESLint** - Configuration React recommandée
- **Prettier** - Formatage automatique
- **Naming** - PascalCase pour composants, camelCase pour variables
- **Structure** - Un composant par fichier

## 🐛 Problèmes connus

- L'API OMDb nécessite une clé valide
- Limite de 1000 requêtes/jour avec la clé gratuite
- Pas de cache côté client (amélioration future)

## 🔄 Upcomming

- [ ] Cache des requêtes API
- [ ] Authentification JWT
- [ ] Mode sombre
- [ ] PWA support
- [ ] Tests E2E avec Cypress

---

**Développé avec ❤️ par Andy Rama**