/**
 * Configuración principal de la aplicación Express
 * Los estudiantes deben completar la configuración de middlewares y rutas
 * // TODO: Importar las rutas
   // TODO: Configurar CORS
   // TODO: Configurar parseo de JSON
// Ejemplo: app.use(express.json())
// TODO: Configurar rutas
// Ejemplo: app.use('/api/v1/usuarios', usuariosRoutes);
// TODO: Configurar middleware de manejo de errores (debe ir al final)
// TODO: Configurar ruta 404
 */


const generosRoutes = require('./routes/generos')
const artistasRoutes = require('./routes/artistas')
const raizRoutes = require('./routes/raiz')
const usuariosRoutes = require('./routes/usuarios')
const auth = require('./routes/auth')
const albumesRoutes = require('./routes/albumes')
const cancionesRoutes = require('./routes/canciones')

const sequelize = require("./config/database")
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const chalk = require("chalk")


const app = express()

let BD_Funciona = false

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//módulo HELMET para proteger la aplicación
app.use(helmet())

// module rateLimit para limitar el número de peticiones
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 solicitudes por IP
  message: 'Demasiadas solicitudes desde esta IP, intentá más tarde.'
})

app.use(limiter) // aplica el límite a todas las rutas

app.use(async (req, res, next) => {
  try {
    if (!BD_Funciona) {
      await sequelize.authenticate();
      BD_Funciona = true
      console.log(chalk.bgGreenBright('Conexión a la base de datos funcionando'))
    }
    next();
  } catch (error) {
    console.log(chalk.bgRed('Error en la conexión a la base de datos: ', error))
    res.status(500).json({message: 'imposible conectar con la base de datos'})
  }
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/', raizRoutes)
app.use('/jwt',auth)
app.use('/api/v1', usuariosRoutes, artistasRoutes, albumesRoutes, cancionesRoutes, generosRoutes )


app.use((req, res) => {
  console.log(chalk.yellowBright(`Ruta no encontrada: ${req.originalUrl}`))
  res.status(404).json('Error 404: Ruta no existente en el servidor')
})

module.exports = app
