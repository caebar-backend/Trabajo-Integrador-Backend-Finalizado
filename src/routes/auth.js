const express = require('express')
const { loginController } = require('../controllers/authController')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para login y gestión de tokens JWT
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión en la aplicación
 *     description: Autentica un usuario con email y password, retorna un token JWT válido por 24 horas
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario registrado
 *                 example: "usuario@ejemplo.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *                 example: "miPassword123"
 *           examples:
 *             usuarioEjemplo:
 *               summary: Credenciales de ejemplo
 *               value:
 *                 email: "usuario@ejemplo.com"
 *                 password: "miPassword123"
 *     responses:
 *       200:
 *         description: Login exitoso, token JWT generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login exitoso"
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticar requests
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "usuario@ejemplo.com"
 *                     nombre:
 *                       type: string
 *                       example: "Juan Pérez"
 *                 expiresIn:
 *                   type: string
 *                   example: "24h"
 *       400:
 *         description: Credenciales faltantes o inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Email y password son requeridos"
 *       401:
 *         description: Credenciales incorrectas o usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   examples:
 *                     credencialesInvalidas: "Credenciales inválidas"
 *                     usuarioNoEncontrado: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Error en el servidor, intente más tarde"
 *                 description:
 *                   type: string
 *                   example: "Detalle técnico del error"
 */

router.post('/login/', loginController)

module.exports = router

