const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Spotify API Documentation',
      version: '1.0.0',
      description: 'API completa para sistema estilo Spotify',
      contact: {
        name: 'Tu Nombre'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  // RUTAS CORRECTAS para tu estructura
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js')
  ],
};

const specs = swaggerJsdoc(options);

// Log para verificar
console.log('🔄 Swagger - Endpoints encontrados:', Object.keys(specs.paths || {}).length);

module.exports = {
  specs,
  swaggerUi
};