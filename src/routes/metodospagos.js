/**
 * Rutas para métodos de pago
 * Los estudiantes deben implementar todas las rutas relacionadas con métodos de pago
 */

const express = require("express")
const router = express.Router()
const verificarToken = require('../middlewares/verificarToken')

const { postRegistrarMetodoPago, getPorUsuarioId } = require("../controllers/metodosPagoController")


router.get("/metodos-pago", getPorUsuarioId)

router.post("/metodos-pago", verificarToken, postRegistrarMetodoPago)

module.exports = router
