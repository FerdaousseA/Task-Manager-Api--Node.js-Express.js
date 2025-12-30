const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'API REST sécurisée pour la gestion de tâches avec authentification JWT',
      contact: {
        name: 'Votre Nom',
        email: 'votre.email@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre token JWT (obtenu après connexion)'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID auto-généré de l\'utilisateur'
            },
            username: {
              type: 'string',
              description: 'Nom d\'utilisateur unique',
              example: 'john_doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email unique de l\'utilisateur',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Mot de passe (sera hashé)',
              example: 'Password123'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création du compte'
            }
          }
        },
        Task: {
          type: 'object',
          required: ['title'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID auto-généré de la tâche'
            },
            title: {
              type: 'string',
              description: 'Titre de la tâche',
              example: 'Terminer le projet'
            },
            description: {
              type: 'string',
              description: 'Description détaillée de la tâche',
              example: 'Finaliser la documentation et les tests'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed'],
              description: 'Statut de la tâche',
              example: 'pending'
            },
            user_id: {
              type: 'integer',
              description: 'ID de l\'utilisateur propriétaire'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière modification'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Message d\'erreur'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/server.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

