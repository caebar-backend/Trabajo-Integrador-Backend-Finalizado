const express = require('express')
const router = express.Router()

const { getTodosDatos, getDatosPorPais, getDatosPorMinimoIngresos } = require('../controllers/VistaDosController')


/**
 * @swagger
 * tags:
 *   name: Vistas Analíticas
 *   description: Vistas de reportes y análisis de datos del sistema
 */

/**
 * @swagger
 * /api/vistas/ingresos-por-artista-discografica-todos:
 *   get:
 *     summary: Obtener todos los datos de ingresos por artista y discográfica
 *     description: Retorna todos los registros de la vista analítica de ingresos, mostrando ingresos por artista, discográfica y país. Soporta paginación.
 *     tags: [Vistas Analíticas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 50
 *         description: Límite de registros por página
 *     responses:
 *       200:
 *         description: Datos de ingresos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VistaDosResponse'
 *       500:
 *         description: Error interno del servidor
 */

router.get('/vistas/ingresos-por-artista-discografica-todos', getTodosDatos)

/**
 * @swagger
 * /api/vistas/ingresos-por-artista-discografica:
 *   get:
 *     summary: Filtrar ingresos por artista y discográfica por país
 *     description: Retorna registros de ingresos filtrados por nombre de país. Usa búsqueda flexible que ignora espacios y puntos en el nombre del país.
 *     tags: [Vistas Analíticas]
 *     parameters:
 *       - in: query
 *         name: pais
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del país para filtrar (ej. "Estados Unidos", "Reino Unido")
 *         example: "Estados Unidos"
 *     responses:
 *       200:
 *         description: Datos filtrados por país obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VistaDosResponse'
 *       400:
 *         description: Falta el parámetro pais
 *       404:
 *         description: No se encontraron datos para el país especificado
 *       500:
 *         description: Error interno del servidor
 */

router.get('/vistas/ingresos-por-artista-discografica', getDatosPorPais)

/**
 * @swagger
 * /api/vistas/ingresos-por-artista-discografica-ingresos:
 *   get:
 *     summary: Filtrar ingresos por mínimo de ingresos de discográfica
 *     description: Retorna registros donde los ingresos de la discográfica son mayores o iguales al valor especificado. Útil para análisis de discográficas con alto rendimiento.
 *     tags: [Vistas Analíticas]
 *     parameters:
 *       - in: query
 *         name: minimo_ingresos
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *           minimum: 0
 *         description: Valor mínimo de ingresos de discográfica para filtrar
 *         example: 1000000
 *     responses:
 *       200:
 *         description: Datos filtrados por ingresos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VistaDos'
 *       400:
 *         description: Falta el parámetro minimo_ingresos o es inválido
 *       500:
 *         description: Error interno del servidor
 */

router.get('/vistas/ingresos-por-artista-discografica-ingresos', getDatosPorMinimoIngresos)

module.exports = router