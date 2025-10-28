/**
 * Rutas para álbumes
 * Los estudiantes deben implementar todas las rutas relacionadas con álbumes
 */

const express = require("express")
const router = express.Router()
const verificarToken = require('../middlewares/verificarToken')

const { crearAlbum, getTodosLosAlbumesDeArtista, getTodasLasCancionesDeUnAlbum } = require('../controllers/albumesController')


router.get('/albumes', getTodosLosAlbumesDeArtista)

router.get('/albumes/:albumId/canciones', getTodasLasCancionesDeUnAlbum)

router.post('/albumes', verificarToken, crearAlbum)


module.exports = router
