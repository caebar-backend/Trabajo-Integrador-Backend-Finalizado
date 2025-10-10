/**
 * Rutas para playlists
 * Los estudiantes deben implementar todas las rutas relacionadas con playlists
 */

const express = require("express")
const router = express.Router()
const verificarToken = require('../middlewares/verificarToken')

const { crearPlaylist, agregarCancionParaPlaylist, eliminarCancionDePlaylist, modificacionParcialPlaylist } = require('../controllers/playlistsController')

/**
 * @swagger
 * tags:
 *   name: Playlists
 *   description: Gestión de listas de reproducción y sus canciones
 */

/**
 * @swagger
 * /api/playlists:
 *   post:
 *     summary: Crear una nueva playlist
 *     description: Crea una nueva playlist para un usuario específico. Requiere autenticación JWT.
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaylistInput'
 *     responses:
 *       201:
 *         description: Playlist creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistResponse'
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

router.post('/playlists', verificarToken, crearPlaylist)

/**
 * @swagger
 * /api/playlists/{idPlaylist}:
 *   patch:
 *     summary: Actualización parcial de una playlist
 *     description: Actualiza parcialmente los datos de una playlist existente. Requiere fecha_eliminacion y autenticación JWT.
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPlaylist
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la playlist a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaylistUpdateInput'
 *     responses:
 *       200:
 *         description: Playlist actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist actualizada"
 *                 playlistNuevaDatos:
 *                   type: object
 *                   properties:
 *                     id_playlist:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "Mis Favoritas Actualizadas"
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     fecha_eliminacion:
 *                       type: string
 *                       format: date-time
 *                     activa:
 *                       type: boolean
 *       400:
 *         description: Error en los datos de entrada
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       404:
 *         description: Playlist no encontrada
 *       500:
 *         description: Error interno del servidor
 */

router.patch('/playlists/:idPlaylist', verificarToken, modificacionParcialPlaylist)

/**
 * @swagger
 * /api/playlists/{idPlaylist}/canciones:
 *   post:
 *     summary: Agregar canción a una playlist
 *     description: Agrega una canción específica a una playlist existente. Requiere autenticación JWT.
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPlaylist
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la playlist
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaylistCancionInput'
 *     responses:
 *       201:
 *         description: Canción agregada exitosamente a la playlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistCancionResponse'
 *       400:
 *         description: Error en los parámetros
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       404:
 *         description: Recurso no encontrado
 *       500:
 *         description: Error interno del servidor
 */

router.post('/playlists/:idPlaylist/canciones', verificarToken, agregarCancionParaPlaylist)

/**
 * @swagger
 * /api/playlists/{idPlaylist}/cancion/{idCancion}:
 *   delete:
 *     summary: Eliminar canción de una playlist
 *     description: Remueve una canción específica de una playlist existente. Requiere autenticación JWT.
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPlaylist
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la playlist
 *         example: 1
 *       - in: path
 *         name: idCancion
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la canción a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Canción eliminada exitosamente de la playlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Canción eliminada de la playlist!"
 *                 playListDatos:
 *                   type: object
 *                   properties:
 *                     id_playlist:
 *                       type: integer
 *                       example: 1
 *                     id_cancion:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Error en los parámetros
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       404:
 *         description: Recurso no encontrado
 *       500:
 *         description: Error interno del servidor
 */

router.delete('/playlists/:idPlaylist/cancion/:idCancion', verificarToken, eliminarCancionDePlaylist)


module.exports = router
