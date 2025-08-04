Guide Docker - Movie App
Structure des fichiers

project-root/
├── backend/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── .dockerignore
│   ├── package.json
│   └── ... (code backend)
├── frontend/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── .dockerignore
│   ├── nginx.conf
│   ├── package.json
│   └── ... (code frontend)
├── docker-compose.yml
├── docker-compose.dev.yml
└── mongo-init.js

Commandes Docker
🚀 Production
bash

# Démarrer toute la stack
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter la stack
docker-compose down

# Rebuild les images et redémarrer
docker-compose up --build -d

🛠️ Développement
bash

# Démarrer en mode développement (avec hot reload)
docker-compose -f docker-compose.dev.yml up -d

# Voir les logs en temps réel
docker-compose -f docker-compose.dev.yml logs -f

# Arrêter le mode développement
docker-compose -f docker-compose.dev.yml down

🗄️ Base de données
bash

# La base de données est sur MongoDB Atlas (cloud)
# Pas besoin de commandes locales pour MongoDB
# connecter directement à Atlas 

🧹 Nettoyage
bash

# Supprimer les containers arrêtés
docker container prune

# Supprimer les images non utilisées
docker image prune

# Nettoyage complet
docker system prune -a

URLs d'accès

    Frontend : http://localhost:3000
    Backend API : http://localhost:5000
    MongoDB : MongoDB Atlas (cloud) - pas d'accès local

Variables d'environnement

Créez un fichier .env dans le dossier backend :
env

NODE_ENV=production
PORT=5000
MONGODB_URI=url-mongo-db-atlas
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OMDB_API_KEY=your-omdb-api-key-here

Troubleshooting
Problèmes courants

    Port déjà utilisé :
    bash

    docker-compose down
    sudo lsof -i :3000  # ou :5000, :27017

    Problème de permissions :
    bash

    sudo chown -R $USER:$USER .

    Cache Docker :
    bash

    docker-compose build --no-cache

    Logs détaillés :
    bash

    docker-compose logs backend
    docker-compose logs frontend
    docker-compose logs mongodb

Rebuild complet

Si vous avez des problèmes persistants :
bash

# Arrêter tout
docker-compose down

# Supprimer les images
docker rmi $(docker images -q movie-app*)

# Rebuild et redémarrer
docker-compose up --build -d

Monitoring
bash

# Voir l'utilisation des ressources
docker stats

# Inspecter un container
docker inspect movie-app-backend

# Accéder au shell d'un container
docker exec -it movie-app-backend sh

