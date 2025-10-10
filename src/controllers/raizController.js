
const chalk = require('chalk')
const sequelize = require('../config/database')

/**
 * @swagger
 * components:
 *   schemas:
 *     MensajeBienvenida:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *         status:
 *           type: integer
 *         version:
 *           type: string
 *       example:
 *         mensaje: "¡Bienvenido a la API de Spotify!"
 *         timestamp: "2024-01-15T10:30:00.000Z"
 *         status: 200
 *         version: "1.0.0"
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