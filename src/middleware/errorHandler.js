// Middleware de gestion des erreurs
exports.errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur:', err);

  // Erreur de validation Joi
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: err.details[0].message
    });
  }

  // Erreur PostgreSQL
  if (err.code) {
    switch (err.code) {
      case '23505': // Violation de contrainte unique
        return res.status(409).json({
          success: false,
          message: 'Cette valeur existe déjà'
        });
      case '23503': // Violation de clé étrangère
        return res.status(400).json({
          success: false,
          message: 'Référence invalide'
        });
      case '22P02': // Type de données invalide
        return res.status(400).json({
          success: false,
          message: 'Format de données invalide'
        });
    }
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expiré'
    });
  }

  // Erreur par défaut
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware pour les routes non trouvées
exports.notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée`
  });
};