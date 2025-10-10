/**
 * Rutas para suscripciones
 * Los estudiantes deben implementar todas las rutas relacionadas con suscripciones
 */

const express = require("express")
const router = express.Router()

const verificarToken = require('../middlewares/verificarToken')

const { postParaSuscripciones } = require("../controllers/suscripcionesController")


/**
 * @swagger
 * /api/suscripciones:
 *   post:
 *     summary: Crear una nueva suscripción
 *     description: Crea una nueva suscripción para un usuario. Valida que no existan suscripciones activas vigentes y que las fechas sean válidas. Requiere autenticación JWT.
 *     tags: [Suscripciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SuscripcionInput'
 *     responses:
 *       201:
 *         description: Suscripción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuscripcionResponse'
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       500:
 *         description: Error interno del servidor
 */

router.post("/suscripciones", verificarToken, postParaSuscripciones)

module.exports = router
