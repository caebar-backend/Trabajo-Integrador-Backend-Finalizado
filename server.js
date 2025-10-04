/**
 * Punto de entrada del servidor
 * Los estudiantes deben completar la configuración del servidor Express
 */

const app = require("./src/app")
process.loadEnvFile()
const puerto = 3000

// TODO: Configurar el servidor para escuchar en el puerto especificado
// TODO: Agregar manejo de errores del servidor
// TODO: Agregar logs de inicio del servidor


// server.js
 // si usás dotenv, esto puede ir acá


app.listen(puerto, () => {
  console.log(`Server is running on port ${puerto}`)
  console.log(`http://localhost:${puerto}/`)
})