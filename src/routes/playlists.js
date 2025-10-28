/**
 * Rutas para playlists
 * Los estudiantes deben implementar todas las rutas relacionadas con playlists
 */

const express = require("express")
const router = express.Router()
const verificarToken = require('../middlewares/verificarToken')

const { crearPlaylist, agregarCancionParaPlaylist, eliminarCancionDePlaylist, modificacionParcialPlaylist } = require('../controllers/playlistsController')

router.post('/playlists', verificarToken, crearPlaylist)

router.patch('/playlists/:idPlaylist', verificarToken, modificacionParcialPlaylist)

router.post('/playlists/:idPlaylist/canciones', verificarToken, agregarCancionParaPlaylist)

router.delete('/playlists/:idPlaylist/cancion/:idCancion', verificarToken, eliminarCancionDePlaylist)


module.exports = router
