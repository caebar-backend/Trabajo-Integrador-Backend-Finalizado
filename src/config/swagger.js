const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Spotify API Documentation',
      version: '1.0.0',
      description: 'API completa para sistema estilo Spotify - Gestión de música, artistas, álbumes y canciones',
      contact: {
        name: 'Tu Nombre',
        email: 'tu.email@ejemplo.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',  // ← QUITADO /api/v1 de aquí
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://tu-api.com',  // ← QUITADO /api/v1 de aquí
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT en el formato: Bearer {token}'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error'
            },
            description: {
              type: 'string',
              description: 'Descripción detallada del error'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de acceso faltante o inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Álbumes',
        description: 'Operaciones relacionadas con álbumes musicales'
      },
      {
        name: 'Artistas',
        description: 'Gestión de artistas musicales'
      },
      {
        name: 'Canciones',
        description: 'Operaciones con canciones'
      },
      {
        name: 'Autenticación',
        description: 'Endpoints de login y registro'
      }
    ],
    externalDocs: {
      description: 'Documentación completa del proyecto',
      url: 'https://github.com/tu-usuario/tu-repositorio'
    }
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js'),
    path.join(__dirname, '../models/*.js')
  ],
};

const specs = swaggerJsdoc(options);

// Log más informativo
console.log('🔄 Swagger - Configuración cargada:');
console.log(`   📍 Endpoints encontrados: ${Object.keys(specs.paths || {}).length}`);
console.log(`   📍 Tags definidos: ${(specs.tags || []).length}`);
console.log(`   📍 Servidores: ${(specs.servers || []).length}`);
console.log(`   📍 URL Base: http://localhost:3000`);

// Verificación de rutas críticas - ACTUALIZAR las rutas
const criticalPaths = ['/albumes', '/albumes/{albumId}/canciones'];  // ← QUITADO /api/v1 de aquí
const missingPaths = criticalPaths.filter(path => !specs.paths?.[path]);

if (missingPaths.length > 0) {
  console.log('⚠️  Rutas críticas no documentadas:', missingPaths);
} else {
  console.log('✅ Todas las rutas críticas están documentadas');
}

module.exports = {
  specs,
  swaggerUi
};