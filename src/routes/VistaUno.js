
const express = require('express')
const router = express.Router()

const { busquedaPorPais, todosDatos } = require('../controllers/VistaUnoController')

router.get('/vistas/canciones-populares-todas', todosDatos)
router.get('/vistas/canciones-populares-por-pais', busquedaPorPais)

module.exports = router