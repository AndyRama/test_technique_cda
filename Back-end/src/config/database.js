const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.NODE_ENV === 'test'
        ? process.env.MONGODB_TEST_URI
        : process.env.MONGODB_URI

    const conn = await mongoose.connect(mongoURI)

    console.log(`MongoDB connecté: ${conn.connection.host}`)
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error.message)

    process.exit(1)
  }
}

module.exports = connectDB
