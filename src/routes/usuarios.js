/**
 * Rutas para usuarios
 * Los estudiantes deben implementar todas las rutas relacionadas con usuarios
 */

const express = require("express")
const router = express.Router()

const { getTodosLosUsuarios } = require('../controllers/usuariosController')

router.get('/usuarios', getTodosLosUsuarios)

module.exports = router
