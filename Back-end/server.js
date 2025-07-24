import app from './src/app';
import connectDB from './src/config/database';

const PORT = process.env.PORT || 5000;

// Connexion à la base de données

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

export default server;