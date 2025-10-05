/**
 * Rutas para usuarios
 * Los estudiantes deben implementar todas las rutas relacionadas con usuarios
 */

const express = require("express")

const router = express.Router()

const { getTodosLosUsuarios, putModificarPassword} = require('../controllers/usuariosController')




router.get('/usuarios', getTodosLosUsuarios)
router.get('/usuarios/:id', getTodosLosUsuarios)
router.put('/usuarios/:id', putModificarPassword)
 

module.exports = router
