const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const errorHandler = require('./middelware/errorHandler')

dotenv.config()

// Middleware

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

// Routes

app.use('/api/users', require('./routes/users'))

// Route de test

app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running!', timestamp: new Date().toISOString() })
})

// Gestion des erreurs

app.use(errorHandler)

// Route erreur 404

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

module.exports = app
