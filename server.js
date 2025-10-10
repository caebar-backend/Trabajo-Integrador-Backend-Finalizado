/**
 * Punto de entrada del servidor
 * Los estudiantes deben completar la configuración del servidor Express
 */

const app = require("./src/app")
process.loadEnvFile()
const puerto = 3000
const chalk = require("chalk")

// TODO: Configurar el servidor para escuchar en el puerto especificado
// TODO: Agregar manejo de errores del servidor
// TODO: Agregar logs de inicio del servidor


// server.js
 // si usás dotenv, esto puede ir acá


app.listen(puerto, () => {
  console.log(chalk.yellow(`Server is running on port ${puerto}`))
  console.log(chalk.bgCyan(`http://localhost:${puerto}/api-docs`))
  console.log(chalk.bgMagentaBright(`http://localhost:${puerto}/`))
  console.log(chalk.bgBlue(`http://localhost:${puerto}/raiz/`))
})