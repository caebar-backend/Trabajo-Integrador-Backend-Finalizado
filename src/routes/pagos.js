/**
 * Rutas para pagos
 * Los estudiantes deben implementar todas las rutas relacionadas con pagos
 */

const express = require("express")
const router = express.Router()
const verificarToken = require('../middlewares/verificarToken')

const { postRegistrarPago, getListarPagosSolicitados } = require("../controllers/pagosController")

router.get("/pagos", getListarPagosSolicitados)

router.post("/pagos", verificarToken, postRegistrarPago)

module.exports = router
