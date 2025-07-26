const app = require('./src/app')
const connectDB = require('./src/config/database')
const PORT = process.env.PORT || 5000

// Connexion à la base de données
connectDB()

// Démarrage du serveur en local seulement
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`)
  })
  module.exports = server
} else {
  // Export pour Vercel (fonctions serverless)
  module.exports = app
}