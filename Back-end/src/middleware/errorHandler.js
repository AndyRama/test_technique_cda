
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = {
      statusCode: 400,
      message: 'Erreur de validation',
      errors: message
    };
  }

  // Erreur de duplication Mongoose
  if (err.code === 11000) {
    const message = 'Ressource déjà existante';
    error = {
      statusCode: 409,
      message
    };
  }

  // Erreur de cast Mongoose (mauvais ObjectId)
  if (err.name === 'CastError') {
    const message = 'Ressource non trouvée';
    error = {
      statusCode: 404,
      message
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erreur serveur',
    errors: error.errors || undefined
  });
};

module.exports = errorHandler;