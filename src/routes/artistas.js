/**
 * Rutas para artistas
 * Los estudiantes deben implementar todas las rutas relacionadas con artistas
 */

const express = require("express")
const router = express.Router()
const { getTodosLosArtistas, crearArtista } = require('../controllers/artistasController')
const verificarToken = require('../middlewares/verificarToken')

router.get('/artistas', getTodosLosArtistas)
router.post('/artistas', verificarToken, crearArtista)

module.exports = router