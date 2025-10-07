/**
 * Rutas para suscripciones
 * Los estudiantes deben implementar todas las rutas relacionadas con suscripciones
 */

const express = require("express")
const router = express.Router()

const { postParaSuscripciones } = require("../controllers/suscripcionesController")

router.post("/suscripciones", postParaSuscripciones)

module.exports = router
