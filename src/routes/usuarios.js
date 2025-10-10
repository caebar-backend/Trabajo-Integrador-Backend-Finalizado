/**
 * Rutas para usuarios
 * Los estudiantes deben implementar todas las rutas relacionadas con usuarios
 */
const verificarToken = require('../middlewares/verificarToken')
const express = require("express")

const router = express.Router()

const { getTodosLosUsuarios, putModificarPassword, getPasswordVencidas, crearUser } = require('../controllers/usuariosController')


/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión completa de usuarios del sistema
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener usuarios con diferentes criterios
 *     description: Retorna usuarios según el header content-type especificado. Soporta tres modos de consulta diferentes. No requiere autenticación.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: header
 *         name: content-type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [users-todos, users-p-l]
 *         description: Tipo de consulta a realizar
 *     responses:
 *       200:
 *         description: Usuarios obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Header content-type inválido o faltante
 *       500:
 *         description: Error interno del servidor
 */

router.get('/usuarios', getTodosLosUsuarios)

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario específico por ID
 *     description: Retorna los datos de un usuario específico usando el header content-type 'users-id'. No requiere autenticación.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: header
 *         name: content-type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [users-id]
 *         description: Debe ser 'users-id' para esta consulta
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario a consultar
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Header content-type incorrecto o ID inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/usuarios/:id', getTodosLosUsuarios)

/**
 * @swagger
 * /api/usuarios/password-vencidas/{numeroFecha}:
 *   get:
 *     summary: Obtener usuarios con contraseñas vencidas
 *     description: Retorna usuarios cuya contraseña no ha sido modificada en los últimos X días. No requiere autenticación.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: numeroFecha
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de días para considerar una contraseña como vencida
 *         example: 90
 *     responses:
 *       200:
 *         description: Usuarios con contraseñas vencidas encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Parámetro inválido
 *       404:
 *         description: No se encontraron usuarios
 *       500:
 *         description: Error interno del servidor
 */

router.get('/usuarios/password-vencidas/:numeroFecha', getPasswordVencidas)

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Modificar contraseña y datos de usuario
 *     description: Actualiza completamente los datos de un usuario, incluyendo la contraseña (que es hasheada automáticamente). Requiere autenticación JWT.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario a modificar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioUpdateInput'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario actualizado"
 *                 usuarioDatos:
 *                   type: object
 *       400:
 *         description: Faltan datos requeridos
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

router.put('/usuarios/:id', verificarToken, putModificarPassword)

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Registra un nuevo usuario en el sistema. La contraseña es hasheada automáticamente y se valida que el email esté en minúsculas. Requiere autenticación JWT.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 *       400:
 *         description: Error en los datos de entrada
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       500:
 *         description: Error interno del servidor
 */

router.post('/usuarios', verificarToken, crearUser)
 

module.exports = router
