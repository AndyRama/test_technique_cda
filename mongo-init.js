// Script d'initialisation pour MongoDB
// Ce script s'exécute au premier démarrage de MongoDB

// Créer la base de données
db = db.getSiblingDB('movieapp');

// Créer un utilisateur pour l'application
db.createUser({
  user: 'movieapp_user',
  pwd: 'movieapp_password',
  roles: [
    {
      role: 'readWrite',
      db: 'movieapp'
    }
  ]
});

// Créer des collections avec des exemples de données
db.users.insertMany([
  {
    name: 'Admin User',
    email: 'admin@movieapp.com',
    password: '$2b$10$hashed_password_here', // Mot de passe hashé
    isAdmin: true,
    createdAt: new Date()
  }
]);

db.movies.insertMany([
  {
    title: 'The Matrix',
    year: '1999',
    imdbID: 'tt0133093',
    poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
    plot: 'A computer hacker learns from mysterious rebels about the true nature of his reality.',
    genre: 'Action, Sci-Fi',
    director: 'Lana Wachowski, Lilly Wachowski',
    actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
    addedAt: new Date()
  }
]);

print('Database initialized successfully!');
