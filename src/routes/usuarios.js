/**
 * Rutas para usuarios
 * Los estudiantes deben implementar todas las rutas relacionadas con usuarios
 */

const express = require("express")

const router = express.Router()

const { getTodosLosUsuarios, putModificarPassword, getPasswordVencidas, crearUser } = require('../controllers/usuariosController')

router.get('/usuarios', getTodosLosUsuarios)
router.get('/usuarios/:id', getTodosLosUsuarios)
router.get('/usuarios/password-vencidas/:numeroFecha', getPasswordVencidas)
router.put('/usuarios/:id', putModificarPassword)
router.post('/usuarios', crearUser)
 

module.exports = router
