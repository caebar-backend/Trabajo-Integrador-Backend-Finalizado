const express = require('express')
const router = express.Router()
const { getRaiz } = require('../controllers/raizController')


router.get('/raiz', getRaiz)

module.exports = router