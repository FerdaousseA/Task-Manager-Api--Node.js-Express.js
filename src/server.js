const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const { errorHandler, notFound } = require('./middleware/errorHandler');

// ... vos routes ...

// Gestion des routes non trouvées
app.use(notFound);

// Gestion centralisée des erreurs
app.use(errorHandler);

const morgan = require('morgan');
const logger = require('./config/logger');

// Morgan pour les logs HTTP
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

const app = express();
const { generalLimiter } = require('./middleware/rateLimiter');
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Task Manager API Documentation'
}));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Route de base de l'API
 *     tags: [Général]
 *     security: []
 *     responses:
 *       200:
 *         description: Message de bienvenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bienvenue sur Task Manager API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 documentation:
 *                   type: string
 *                   example: /api-docs
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur Task Manager API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});


app.use(generalLimiter);
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route non trouvée' 
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}`);
  console.log(`📚 Documentation Swagger: http://localhost:${PORT}/api-docs`);
});