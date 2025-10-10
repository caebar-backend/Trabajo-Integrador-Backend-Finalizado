/**
 * Rutas para métodos de pago
 * Los estudiantes deben implementar todas las rutas relacionadas con métodos de pago
 */

const express = require("express")
const router = express.Router()
const verificarToken = require('../middlewares/verificarToken')

const { postRegistrarMetodoPago, getPorUsuarioId } = require("../controllers/metodosPagoController")



/**
 * @swagger
 * tags:
 *   name: Métodos de Pago
 *   description: Gestión de métodos de pago para usuarios
 */

/**
 * @swagger
 * /api/metodos-pago:
 *   get:
 *     summary: Obtener métodos de pago por usuario
 *     description: Retorna todos los métodos de pago registrados para un usuario específico. No requiere autenticación.
 *     tags: [Métodos de Pago]
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario para consultar sus métodos de pago
 *         example: 1
 *     responses:
 *       200:
 *         description: Métodos de pago encontrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Métodos de pago encontrados"
 *                 metodosPago:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MetodoPago'
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

router.get("/metodos-pago", getPorUsuarioId)

/**
 * @swagger
 * /api/metodos-pago:
 *   post:
 *     summary: Registrar un nuevo método de pago
 *     description: Registra un nuevo método de pago para un usuario. Los datos sensibles como número de tarjeta y CVC son enmascarados automáticamente. Requiere autenticación JWT.
 *     tags: [Métodos de Pago]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MetodoPagoInput'
 *     responses:
 *       201:
 *         description: Método de pago registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MetodoPagoResponse'
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

router.post("/metodos-pago", verificarToken, postRegistrarMetodoPago)

module.exports = router
