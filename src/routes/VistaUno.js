
const express = require('express')
const router = express.Router()

const { busquedaPorPais, todosDatos } = require('../controllers/VistaUnoController')

/**
 * @swagger
 * tags:
 *   name: Vistas Analíticas
 *   description: Vistas de reportes y análisis de datos del sistema
 */

/**
 * @swagger
 * /api/vistas/canciones-populares-todas:
 *   get:
 *     summary: Obtener todas las canciones populares con sus reproducciones
 *     description: Retorna todos los registros de la vista de canciones populares, mostrando información completa de canciones, álbumes, artistas, países y conteo de reproducciones.
 *     tags: [Vistas Analíticas]
 *     responses:
 *       200:
 *         description: Datos de canciones populares obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VistaUnoResponse'
 *       500:
 *         description: Error interno del servidor
 */

router.get('/vistas/canciones-populares-todas', todosDatos)


/**
 * @swagger
 * /api/vistas/canciones-populares-por-pais:
 *   get:
 *     summary: Filtrar canciones populares por país
 *     description: Retorna canciones populares filtradas por país específico, con opciones de límite y ordenamiento. Ideal para análisis de tendencias musicales por región.
 *     tags: [Vistas Analíticas]
 *     parameters:
 *       - in: query
 *         name: pais
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del país para filtrar (soporta búsqueda flexible)
 *         example: "Argentina"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *         description: Límite máximo de registros a retornar
 *         example: 50
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           enum: [id_cancion, titulo_cancion, id_reproduccion, nombre_artista]
 *           default: "id_cancion"
 *         description: Campo para ordenar los resultados (por defecto orden descendente)
 *         example: "id_reproduccion"
 *     responses:
 *       200:
 *         description: Canciones populares por país obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VistaUno'
 *       400:
 *         description: Falta el parámetro pais
 *       404:
 *         description: No se encontraron canciones para el país especificado
 *       500:
 *         description: Error interno del servidor
 */

router.get('/vistas/canciones-populares-por-pais', busquedaPorPais)

module.exports = router