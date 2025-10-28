/**
 * Rutas para canciones
 * Los estudiantes deben implementar todas las rutas relacionadas con canciones
 */

const express = require("express")
const router = express.Router()

const verificarToken = require('../middlewares/verificarToken')

const { crearCancion, buscarCanciones, asociarGeneroParaCancion, eliminarAsociacionGeneroCancion } = require('../controllers/cancionesController')


router.get('/canciones', buscarCanciones)

router.post('/canciones', verificarToken, crearCancion)

router.post('/canciones/:id_cancion/generos', verificarToken, asociarGeneroParaCancion)

router.delete('/canciones/:id_cancion/generos/:id_genero', verificarToken, eliminarAsociacionGeneroCancion)


module.exports = router
