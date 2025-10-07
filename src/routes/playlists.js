/**
 * Rutas para playlists
 * Los estudiantes deben implementar todas las rutas relacionadas con playlists
 */

const express = require("express")
const router = express.Router()

const { crearPlaylist, agregarCancionParaPlaylist, eliminarCancionDePlaylist, modificacionParcialPlaylist } = require('../controllers/playlistsController')

 
router.post('/playlists', crearPlaylist)
router.patch('/playlists/:idPlaylist', modificacionParcialPlaylist)
router.post('/playlists/:idPlaylist/canciones', agregarCancionParaPlaylist)
router.delete('/playlists/:idPlaylist/cancion/:idCancion', eliminarCancionDePlaylist)


module.exports = router
