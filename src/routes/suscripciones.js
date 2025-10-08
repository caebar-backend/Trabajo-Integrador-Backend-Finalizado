/**
 * Rutas para suscripciones
 * Los estudiantes deben implementar todas las rutas relacionadas con suscripciones
 */

const express = require("express")
const router = express.Router()

const verificarToken = require('../middlewares/verificarToken')

const { postParaSuscripciones } = require("../controllers/suscripcionesController")

router.post("/suscripciones", verificarToken, postParaSuscripciones)

module.exports = router
