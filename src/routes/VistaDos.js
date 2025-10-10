const express = require('express')
const router = express.Router()

const { getTodosDatos, getDatosPorPais, getDatosPorMinimoIngresos } = require('../controllers/VistaDosController')

router.get('/vistas/ingresos-por-artista-discografica-todos', getTodosDatos)
router.get('/vistas/ingresos-por-artista-discografica', getDatosPorPais)
router.get('/vistas/ingresos-por-artista-discografica-ingresos', getDatosPorMinimoIngresos)

module.exports = router