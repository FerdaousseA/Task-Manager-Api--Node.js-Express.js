const rateLimit = require('express-rate-limit');

// Rate limiter général
exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max
  message: {
    success: false,
    message: 'Trop de requêtes, réessayez plus tard'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter strict pour l'authentification
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, réessayez dans 15 minutes'
  },
  skipSuccessfulRequests: true, // Ne compte que les échecs
});

// Rate limiter pour la création de tâches
exports.createTaskLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 tâches max par minute
  message: {
    success: false,
    message: 'Trop de tâches créées, ralentissez'
  }
});