/**
 * Rutas para pagos
 * Los estudiantes deben implementar todas las rutas relacionadas con pagos
 */

const express = require("express")
const router = express.Router()
const verificarToken = require('../middlewares/verificarToken')

const { postRegistrarPago, getListarPagosSolicitados } = require("../controllers/pagosController")


/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Gestión de transacciones de pago para suscripciones
 */

/**
 * @swagger
 * /api/pagos:
 *   get:
 *     summary: Listar pagos por usuario y rango de fechas
 *     description: Retorna todos los pagos de un usuario específico dentro de un rango de fechas determinado. No requiere autenticación.
 *     tags: [Pagos]
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario para consultar sus pagos
 *         example: 1
 *       - in: query
 *         name: desde
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del rango (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: query
 *         name: hasta
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del rango (YYYY-MM-DD)
 *         example: "2024-12-31"
 *     responses:
 *       200:
 *         description: Pagos encontrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PagosRangoResponse'
 *       400:
 *         description: Error en los parámetros de consulta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *       500:
 *         description: Error interno del servidor
 */

router.get("/pagos", getListarPagosSolicitados)


/**
 * @swagger
 * /api/pagos:
 *   post:
 *     summary: Registrar un nuevo pago
 *     description: Registra un nuevo pago asociado a una suscripción y método de pago válidos. Valida que la fecha de pago no sea anterior a la fecha actual. Requiere autenticación JWT.
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PagoInput'
 *     responses:
 *       201:
 *         description: Pago registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PagoResponse'
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

router.post("/pagos", verificarToken, postRegistrarPago)

module.exports = router
