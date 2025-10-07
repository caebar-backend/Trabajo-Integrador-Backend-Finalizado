/**
 * Rutas para canciones
 * Los estudiantes deben implementar todas las rutas relacionadas con canciones
 */

const express = require("express")
const router = express.Router()

const { crearCancion, buscarCanciones, asociarGeneroParaCancion, eliminarAsociacionGeneroCancion } = require('../controllers/cancionesController')

router.get('/canciones', buscarCanciones)
router.post('/canciones', crearCancion)
router.post('/canciones/:id_cancion/generos', asociarGeneroParaCancion)
router.delete('/canciones/:id_cancion/generos/:id_genero', eliminarAsociacionGeneroCancion)





module.exports = router
