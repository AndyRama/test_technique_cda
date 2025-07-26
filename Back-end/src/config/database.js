const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'test' 
      ? process.env.MONGODB_TEST_URI 
      : process.env.MONGODB_URI;

    if (!mongoURI) {
      console.log('⚠️  MongoDB URI manquante - serveur continue sans DB');
      return false;
    }

    console.log('🔄 Tentative de connexion MongoDB...');

    // Configuration MongoDB modifié car ne fonctionne pas correctement
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // 5 secondes timeout
      socketTimeoutMS: 45000,
      family: 4, // IPv4
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
    });

    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    return true;

  } catch (error) {
    console.error('❌ MongoDB non disponible:', error.message);
    console.log('⚠️  SERVEUR CONTINUE SANS BASE DE DONNÉES');
    return false;
  }
};

module.exports = connectDB;