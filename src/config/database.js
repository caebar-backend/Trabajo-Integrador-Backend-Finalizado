/**
 * Configuración de conexión a la base de datos MySQL
 * Los estudiantes deben completar la configuración de la conexión
 */

const { Sequelize } = require('sequelize')

process.loadEnvFile()

const DBNAME = process.env.DB_NAME
const DBUSER = process.env.DB_USER
const DBPASSWORD = process.env.DB_PASSWORD
const DBHOST = process.env.DB_HOST


const sequelize = new Sequelize(DBNAME,
    DBUSER,
    DBPASSWORD,{
        host: DBHOST,
        dialect: 'mysql',
        logging: false
    }
)

 module.exports = sequelize





