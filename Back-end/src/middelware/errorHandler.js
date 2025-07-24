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
  // Erreur de cast Mongoose (mauvais ObjectId)
  // Erreur interne serveur (500)
}