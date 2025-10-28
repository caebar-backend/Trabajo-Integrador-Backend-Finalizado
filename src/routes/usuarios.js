/**
 * Rutas para usuarios
 * Los estudiantes deben implementar todas las rutas relacionadas con usuarios
 */
const verificarToken = require('../middlewares/verificarToken')
const express = require("express")

const router = express.Router()

const { getTodosLosUsuarios, putModificarPassword, getPasswordVencidas, crearUser } = require('../controllers/usuariosController')


router.get('/usuarios', getTodosLosUsuarios)

router.get('/usuarios/:id', getTodosLosUsuarios)

router.get('/usuarios/password-vencidas/:numeroFecha', getPasswordVencidas)

router.put('/usuarios/:id', verificarToken, putModificarPassword)

router.post('/usuarios', verificarToken, crearUser)
 

module.exports = router
