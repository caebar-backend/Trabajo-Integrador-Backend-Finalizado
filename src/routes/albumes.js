/**
 * Rutas para álbumes
 * Los estudiantes deben implementar todas las rutas relacionadas con álbumes
 */

const express = require("express")
const router = express.Router()
const verificarToken = require('../middlewares/verificarToken')

const { crearAlbum, getTodosLosAlbumesDeArtista, getTodasLasCancionesDeUnAlbum } = require('../controllers/albumesController')

/**
 * @swagger
 * tags:
 *   name: Álbumes
 *   description: Gestión de álbumes musicales
 */

/**
 * @swagger
 * /api/albumes:
 *   get:
 *     summary: Obtener todos los álbumes de artistas
 *     description: Retorna una lista de todos los álbumes disponibles en la plataforma
 *     tags: [Álbumes]
 *     parameters:
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de álbumes por página
 *       - in: query
 *         name: artista
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de artista
 *       - in: query
 *         name: genero
 *         schema:
 *           type: string
 *         description: Filtrar por género musical
 *     responses:
 *       200:
 *         description: Lista de álbumes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Album'
 *                 paginacion:
 *                   type: object
 *                   properties:
 *                     pagina:
 *                       type: integer
 *                     limite:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPaginas:
 *                       type: integer
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/albumes', getTodosLosAlbumesDeArtista)

/**
 * @swagger
 * /api/albumes/{albumId}/canciones:
 *   get:
 *     summary: Obtener todas las canciones de un álbum
 *     description: Retorna la lista completa de canciones pertenecientes a un álbum específico
 *     tags: [Álbumes]
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del álbum
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           enum: [titulo, duracion, numero_pista]
 *           default: "numero_pista"
 *         description: Campo por el cual ordenar las canciones
 *       - in: query
 *         name: direccion
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "asc"
 *         description: Dirección del ordenamiento
 *     responses:
 *       200:
 *         description: Lista de canciones del álbum obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 album:
 *                   $ref: '#/components/schemas/Album'
 *                 canciones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cancion'
 *                 totalCanciones:
 *                   type: integer
 *       404:
 *         description: Álbum no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: ID de álbum inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/albumes/:albumId/canciones', getTodasLasCancionesDeUnAlbum)

/**
 * @swagger
 * /api/albumes:
 *   post:
 *     summary: Crear un nuevo álbum
 *     description: Crea un nuevo álbum musical (requiere autenticación)
 *     tags: [Álbumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - artista_id
 *               - fecha_lanzamiento
 *             properties:
 *               titulo:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 example: "Thriller"
 *               artista_id:
 *                 type: integer
 *                 example: 1
 *               fecha_lanzamiento:
 *                 type: string
 *                 format: date
 *                 example: "1982-11-30"
 *               genero_id:
 *                 type: integer
 *                 example: 1
 *               portada_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://ejemplo.com/portada.jpg"
 *               descripcion:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Uno de los álbumes más vendidos de la historia"
 *     responses:
 *       201:
 *         description: Álbum creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Álbum creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Album'
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/albumes', verificarToken, crearAlbum)


module.exports = router
