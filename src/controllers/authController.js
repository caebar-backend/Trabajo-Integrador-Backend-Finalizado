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
 *           description: Email del usuario registrado
 *           example: "usuario@ejemplo.com"
 *         password_hash:
 *           type: string
 *           format: password
 *           description: Hash de la contraseña del usuario
 *           example: "$2b$10$hashedPasswordExample123456789"
 *         id_rol:
 *           type: integer
 *           description: ID del rol del usuario
 *           example: 1
 * 
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token JWT para autenticar requests
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * 
 *     LoginError:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           example: "Credenciales inválidas"
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión en la aplicación
 *     description: Autentica un usuario con email, password_hash y id_rol, retorna un token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             usuarioAdmin:
 *               summary: Usuario administrador
 *               value:
 *                 email: "admin@spotify.com"
 *                 password_hash: "$2b$10$hashedPasswordExample123456789"
 *                 id_rol: 1
 *             usuarioRegular:
 *               summary: Usuario regular
 *               value:
 *                 email: "usuario@spotify.com"
 *                 password_hash: "$2b$10$hashedPasswordExample123456789"
 *                 id_rol: 2
 *     responses:
 *       200:
 *         description: Login exitoso, token JWT generado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             examples:
 *               success:
 *                 summary: Token generado exitosamente
 *                 value:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciales inválidas o usuario no autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginError'
 *             examples:
 *               credencialesInvalidas:
 *                 summary: Credenciales incorrectas
 *                 value:
 *                   mensaje: "Credenciales inválidas"
 *               usuarioNoEncontrado:
 *                 summary: Usuario no existe
 *                 value:
 *                   mensaje: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error en el servidor"
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