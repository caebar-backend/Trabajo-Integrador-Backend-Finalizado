const express = require('express')
const router = express.Router()
const { getRaiz } = require('../controllers/raizController')



/**
 * @swagger
 * tags:
 *   name: Raíz
 *   description: Endpoints básicos de la API
 */

/**
 * @swagger
 * /api/raiz:
 *   get:
 *     summary: Obtener mensaje de bienvenida
 *     description: Retorna un mensaje de bienvenida y estado de la API
 *     tags: [Raíz]
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "¡Bienvenido a la API de Spotify!"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */

router.get('/raiz', getRaiz)

module.exports = router