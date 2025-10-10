/**
 * Rutas para géneros
 * Los estudiantes deben implementar todas las rutas relacionadas con géneros
 */

const express = require("express")
const router = express.Router()
const verificarToken = require('../middlewares/verificarToken')

const { crearGenero, getTodosLosGeneros } = require('../controllers/generosController')

/**
 * @swagger
 * tags:
 *   name: Géneros
 *   description: Gestión de géneros musicales
 */

/**
 * @swagger
 * /api/generos:
 *   get:
 *     summary: Obtener todos los géneros musicales
 *     description: Retorna una lista completa de todos los géneros musicales registrados en la plataforma. No requiere autenticación.
 *     tags: [Géneros]
 *     responses:
 *       200:
 *         description: Lista de géneros obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genero'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.get('/generos', getTodosLosGeneros)

/**
 * @swagger
 * /api/generos:
 *   post:
 *     summary: Crear un nuevo género musical
 *     description: Registra un nuevo género musical en la plataforma. Requiere autenticación JWT.
 *     tags: [Géneros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeneroInput'
 *     responses:
 *       201:
 *         description: Género creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneroResponse'
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       500:
 *         description: Error interno del servidor
 */
router.post('/generos', verificarToken, crearGenero)


module.exports = router
