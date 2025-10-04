/**
 * Rutas para vistas con JOINs - EJERCICIOS ADICIONALES
 * Los estudiantes deben implementar estas rutas que utilizan vistas complejas con JOINs
 */

const express = require("express");
const router = express.Router();

// TODO: Importar controlador de vistas
// const vistasController = require('../controllers/vistasController');

// TODO: EJERCICIO 1 - Vista de canciones populares por país
// GET /api/v1/vistas/canciones-populares-por-pais
// Debe mostrar las canciones más reproducidas agrupadas por país del usuario
// Incluir: nombre_cancion, nombre_artista, nombre_album, nombre_pais, total_reproducciones
// router.get('/canciones-populares-por-pais', vistasController.cancionesPopularesPorPais);

// TODO: EJERCICIO 2 - Vista de ingresos por artista y discográfica
// GET /api/v1/vistas/ingresos-por-artista-discografica
// Debe mostrar los ingresos generados por cada artista y discográfica
// Incluir: nombre_artista, nombre_discografica, nombre_pais_discografica, total_ingresos, cantidad_suscripciones_activas
// router.get('/ingresos-por-artista-discografica', vistasController.ingresosPorArtistaDiscografica);

module.exports = router;
