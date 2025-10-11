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
  // Url que se usa para ver la documentación 
  console.log(chalk.bgCyan(`http://localhost:${puerto}/api-docs`))
  // Url que se usa mayormente en el api.http
  console.log(chalk.bgMagentaBright(`http://localhost:${puerto}/api/v1`))
  // Url que se usa para ver el mensaje de bienvenida
  console.log(chalk.bgBlue(`http://localhost:${puerto}/raiz/`))
})