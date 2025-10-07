/**
 * Rutas para géneros
 * Los estudiantes deben implementar todas las rutas relacionadas con géneros
 */

const express = require("express")
const router = express.Router()

const { crearGenero, getTodosLosGeneros } = require('../controllers/generosController')

router.get('/generos', getTodosLosGeneros)
router.post('/generos', crearGenero)


module.exports = router
