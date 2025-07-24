// Routes

app.use('/api/users', require('./routes/users'))

// Route de test

app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running!', timestamp: new Date().toISOString() })
})

// Gestion des erreurs

app.use(errorHandler)

// Route error 404

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

module.exports = app
