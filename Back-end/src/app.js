import { json, urlencoded } from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import errorHandler from './middelware/errorHandler'

config()

// Middleware

app.use(cors())

app.use(json())

app.use(urlencoded({ extended: true }))

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

export default app
