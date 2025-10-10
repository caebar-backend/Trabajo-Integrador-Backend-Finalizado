/**
 * Rutas para canciones
 * Los estudiantes deben implementar todas las rutas relacionadas con canciones
 */

const express = require("express")
const router = express.Router()

const verificarToken = require('../middlewares/verificarToken')

const { crearCancion, buscarCanciones, asociarGeneroParaCancion, eliminarAsociacionGeneroCancion } = require('../controllers/cancionesController')


/**
 * @swagger
 * tags:
 *   name: Canciones
 *   description: Gestión de canciones y sus asociaciones con géneros
 */

/**
 * @swagger
 * /api/canciones:
 *   get:
 *     summary: Buscar canciones por género y/o álbum
 *     description: Busca canciones filtrando por género musical y/o álbum (búsqueda OR). No requiere autenticación.
 *     tags: [Canciones]
 *     parameters:
 *       - in: query
 *         name: genero
 *         schema:
 *           type: string
 *         description: ID del género musical para filtrar
 *         example: "2"
 *       - in: query
 *         name: albumid
 *         schema:
 *           type: string
 *         description: ID del álbum para filtrar
 *         example: "1"
 *     responses:
 *       200:
 *         description: Búsqueda exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BusquedaCancionesResponse'
 *       400:
 *         description: Faltan parámetros de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Debe proporcionar al menos un filtro (genero o albumid)"
 *       500:
 *         description: Error interno del servidor
 */

router.get('/canciones', buscarCanciones)

/**
 * @swagger
 * /api/canciones:
 *   post:
 *     summary: Crear una nueva canción
 *     description: Registra una nueva canción en la plataforma asociada a un álbum existente. Requiere autenticación JWT.
 *     tags: [Canciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancionInput'
 *     responses:
 *       201:
 *         description: Canción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CancionResponse'
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       500:
 *         description: Error interno del servidor
 */

router.post('/canciones', verificarToken, crearCancion)

/**
 * @swagger
 * /api/canciones/{id_cancion}/generos:
 *   post:
 *     summary: Asociar un género a una canción
 *     description: Crea una asociación entre una canción existente y un género musical. Requiere autenticación JWT.
 *     tags: [Canciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cancion
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la canción
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AsociacionGeneroInput'
 *     responses:
 *       201:
 *         description: Asociación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsociacionGeneroResponse'
 *       400:
 *         description: Canción no existe
 *       404:
 *         description: Asociación ya existe
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       500:
 *         description: Error interno del servidor
 */

router.post('/canciones/:id_cancion/generos', verificarToken, asociarGeneroParaCancion)

/**
 * @swagger
 * /api/canciones/{id_cancion}/generos/{id_genero}:
 *   delete:
 *     summary: Eliminar asociación entre canción y género
 *     description: Remueve la asociación existente entre una canción y un género musical. Requiere autenticación JWT.
 *     tags: [Canciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cancion
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la canción
 *         example: 1
 *       - in: path
 *         name: id_genero
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del género
 *         example: 1
 *     responses:
 *       200:
 *         description: Asociación eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Asociación eliminada exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_cancion:
 *                       type: integer
 *                       example: 1
 *                     id_genero:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: Recurso no encontrado
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       500:
 *         description: Error interno del servidor
 */

router.delete('/canciones/:id_cancion/generos/:id_genero', verificarToken, eliminarAsociacionGeneroCancion)





module.exports = router
