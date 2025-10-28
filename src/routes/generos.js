/**
 * Rutas para géneros
 * Los estudiantes deben implementar todas las rutas relacionadas con géneros
 */

const express = require("express")
const router = express.Router()
const verificarToken = require('../middlewares/verificarToken')

const { crearGenero, getTodosLosGeneros } = require('../controllers/generosController')


router.get('/generos', getTodosLosGeneros)


router.post('/generos', verificarToken, crearGenero)


module.exports = router
