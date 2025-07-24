const app = require('./src/app')

const connectDB = require('./src/config/database')

const PORT = process.env.PORT || 5000

// Connexion à la base de données

connectDB()

const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})

module.exports = server
