const { login } = require('../services/authLoginService')
const chalk = require('chalk')


/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password_hash
 *         - id_rol
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *           example: "caebar@gmail.com"
 *         password_hash:
 *           type: string
 *           description: Hash de la contraseña del usuario
 *           example: "$2b$10$NRlX6rmL6blXK9vRi8wUHu7Q7jZPWLOGqE8o6uGKokVs/c.pBrf7W"
 *         id_rol:
 *           type: integer
 *           description: ID del rol del usuario
 *           example: 4
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token JWT generado
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           description: Mensaje de error
 *           example: "Credenciales inválidas"
 */

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para login y generación de tokens JWT
 */

/**
 * @swagger
 * /jwt/login:
 *   post:
 *     summary: Obtener token JWT de autenticación
 *     description: Endpoint para autenticar usuario y generar token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             ejemploLogin:
 *               summary: Ejemplo de login
 *               value:
 *                 email: "caebar@gmail.com"
 *                 password_hash: "$2b$10$NRlX6rmL6blXK9vRi8wUHu7Q7jZPWLOGqE8o6uGKokVs/c.pBrf7W"
 *                 id_rol: 4
 *     responses:
 *       200:
 *         description: Login exitoso, token generado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             examples:
 *               success:
 *                 summary: Token generado exitosamente
 *                 value:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *       401:
 *         description: Credenciales inválidas o usuario no autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidCredentials:
 *                 summary: Credenciales incorrectas
 *                 value:
 *                   mensaje: "Credenciales inválidas"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

async function loginController(req, res) {
  try {
    const { email, password_hash, id_rol } = req.body
    const token = await login(email, password_hash, id_rol)
    console.log(chalk.greenBright('Token generado: '), token)
    res.json({ token })
  } catch (error) {
    console.log(chalk.redBright('Error en el login: '), error.message)
    res.status(401).json({ mensaje: error.message })
  }
}

module.exports = { loginController }