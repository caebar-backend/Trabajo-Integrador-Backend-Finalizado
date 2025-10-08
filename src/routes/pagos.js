/**
 * Rutas para pagos
 * Los estudiantes deben implementar todas las rutas relacionadas con pagos
 */

const express = require("express")
const router = express.Router()

const { postRegistrarPago, getListarPagosSolicitados } = require("../controllers/pagosController")

router.get("/pagos", getListarPagosSolicitados)
router.post("/pagos", postRegistrarPago)

module.exports = router
