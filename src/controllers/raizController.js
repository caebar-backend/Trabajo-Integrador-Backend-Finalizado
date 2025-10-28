
const chalk = require('chalk')
const sequelize = require('../config/database')

/**
 * @swagger
 * components:
 *   schemas:
 *     RaizResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Bienvenido a la API de Spotify"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Error al conectarse al servidor"
 */

/**
 * @swagger
 * tags:
 *   name: Raíz
 *   description: Endpoint principal para verificar el estado de la API
 */

/**
 * @swagger
 * /raiz:
 *   get:
 *     summary: Endpoint raíz de la API
 *     description: |
 *       Verifica la conexión con la base de datos y devuelve un mensaje de bienvenida.
 *       **Propósito:** Comprobar que la API está funcionando correctamente.
 *     tags: [Raíz]
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RaizResponse'
 *             examples:
 *               success:
 *                 summary: Bienvenida exitosa
 *                 value:
 *                   message: "Bienvenido a la API de Spotify"
 *       500:
 *         description: Error de conexión con la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               error:
 *                 summary: Error de servidor
 *                 value:
 *                   message: "Error al conectarse al servidor"
 */

const getRaiz = async (req, res) => {
    try {
        await sequelize.authenticate()
        res.status(200).json({ message: 'Bienvenido a la API de Spotify' })
        console.log(chalk.greenBright('<----- Bienvenido a la API de Spotify ----->'))

    }catch (error) {
        console.log(chalk.redBright('<----- Error al conectarse al servidor ----->'))
        res.status(500).json({ message: 'Error al conectarse al servidor' })
    }
}

 module.exports = { getRaiz }