/**
 * Configuración principal de la aplicación Express
 * Los estudiantes deben completar la configuración de middlewares y rutas
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// TODO: Importar las rutas

const app = express();

// TODO: Configurar CORS

// TODO: Configurar parseo de JSON
// Ejemplo: app.use(express.json());

// TODO: Configurar rutas
// Ejemplo: app.use('/api/v1/usuarios', usuariosRoutes);

// TODO: Configurar middleware de manejo de errores (debe ir al final)

// TODO: Configurar ruta 404

module.exports = app;
