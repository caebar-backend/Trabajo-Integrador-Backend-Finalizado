/**
 * Configuración de conexión a la base de datos MySQL
 * Los estudiantes deben completar la configuración de la conexión
 */

const { Sequelize } = require('sequelize')

process.loadEnvFile()

const dbHost = process.env.DB_HOST
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dataBase = process.env.DB_NAME
const dbPort = process.env.DB_PORT

const sequelizeConfig = new Sequelize(
    dataBase,
    dbUser,
    dbPassword,
    {
        host: dbHost,
        port: dbPort,
        dialect: 'mysql',
    })

 module.exports = sequelizeConfig

 



