
const chalk = require('chalk')
const sequelize = require('../config/database')


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