/**
 * Rutas para artistas
 * Los estudiantes deben implementar todas las rutas relacionadas con artistas
 */

const express = require("express")
const router = express.Router()
const { getTodosLosArtistas, crearArtista } = require('../controllers/artistasController')
const verificarToken = require('../middlewares/verificarToken')


/**
 * @swagger
 * tags:
 *   name: Artistas
 *   description: Gestión de artistas musicales
 */

/**
 * @swagger
 * /api/artistas:
 *   get:
 *     summary: Obtener todos los artistas
 *     description: Retorna una lista paginada de todos los artistas registrados en la plataforma
 *     tags: [Artistas]
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
 *           default: 20
 *         description: Cantidad de artistas por página
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Filtrar artistas por nombre (búsqueda parcial)
 *       - in: query
 *         name: genero
 *         schema:
 *           type: string
 *         description: Filtrar por género musical principal
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           enum: [nombre, fecha_registro, popularidad]
 *           default: "nombre"
 *         description: Campo por el cual ordenar los artistas
 *       - in: query
 *         name: direccion
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "asc"
 *         description: Dirección del ordenamiento
 *     responses:
 *       200:
 *         description: Lista de artistas obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Artista'
 *                 paginacion:
 *                   type: object
 *                   properties:
 *                     paginaActual:
 *                       type: integer
 *                       example: 1
 *                     totalPaginas:
 *                       type: integer
 *                       example: 5
 *                     totalArtistas:
 *                       type: integer
 *                       example: 95
 *                     hasNext:
 *                       type: boolean
 *                       example: true
 *                     hasPrev:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Parámetros de consulta inválidos
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

router.get('/artistas', getTodosLosArtistas)


/**
 * @swagger
 * /api/artistas:
 *   post:
 *     summary: Crear un nuevo artista
 *     description: Registra un nuevo artista en la plataforma (requiere autenticación JWT)
 *     tags: [Artistas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArtistaInput'
 *           examples:
 *             artistaRock:
 *               summary: Artista de rock
 *               value:
 *                 nombre: "Los Rolling Stones"
 *                 biografia: "Banda británica de rock formada en 1962"
 *                 genero_principal: "Rock"
 *                 sitio_web: "https://rollingstones.com"
 *                 red_social: "https://instagram.com/rollingstones"
 *             artistaPop:
 *               summary: Artista de pop
 *               value:
 *                 nombre: "Taylor Swift"
 *                 biografia: "Cantante y compositora estadounidense"
 *                 genero_principal: "Pop"
 *                 sitio_web: "https://taylorswift.com"
 *                 red_social: "https://instagram.com/taylorswift"
 *     responses:
 *       201:
 *         description: Artista creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArtistaResponse'
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               datosFaltantes:
 *                 summary: Faltan datos requeridos
 *                 value:
 *                   error: "Faltan datos para la creación del artista"
 *               artistaExistente:
 *                 summary: Artista ya existe
 *                 value:
 *                   error: "El nombre del artista ya existe, debe elegir otro"
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
router.post('/artistas', verificarToken, crearArtista)

module.exports = router