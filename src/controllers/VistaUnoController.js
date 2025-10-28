
const { VistaUno} = require('../models')
const { sequelize } = require('../models')
const { Op, INTEGER } = require('sequelize')
const chalk = require('chalk')


function generarRegex(palabra) {
  // Divide la palabra en letras y entre cada letra inserta una expresión que ignore espacios y puntos
  const letras = palabra.split('')
  const regex = letras.map(letra => `${letra}[\\s\\.]*`).join('')
  return regex;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     VistaCancionPopular:
 *       type: object
 *       properties:
 *         id_cancion:
 *           type: integer
 *           description: ID único de la canción
 *         titulo_cancion:
 *           type: string
 *           description: Título de la canción
 *         id_album:
 *           type: integer
 *           description: ID del álbum al que pertenece la canción
 *         titulo_album:
 *           type: string
 *           description: Título del álbum
 *         nombre_artista:
 *           type: string
 *           description: Nombre del artista
 *         id_artista:
 *           type: integer
 *           description: ID del artista
 *         id_reproduccion:
 *           type: integer
 *           description: ID de la reproducción (contador de popularidad)
 *         nombre_pais:
 *           type: string
 *           description: Nombre del país desde donde se reprodujo
 *         id_pais:
 *           type: integer
 *           description: ID del país
 *     CancionPopularResumen:
 *       type: object
 *       properties:
 *         titulo_cancion:
 *           type: string
 *           description: Título de la canción
 *         nombre_artista:
 *           type: string
 *           description: Nombre del artista
 *         id_reproduccion:
 *           type: integer
 *           description: Número de reproducciones (indicador de popularidad)
 *         nombre_pais:
 *           type: string
 *           description: País de origen de las reproducciones
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Vistas - Canciones Populares
 *   description: Vistas analíticas de canciones más reproducidas por país
 */

/**
 * @swagger
 * /api/v1/vistas/canciones-populares-todas:
 *   get:
 *     summary: Obtener todas las canciones populares por país
 *     description: |
 *       Vista analítica que muestra las canciones más reproducidas agrupadas por país de usuarios.
 *       **Incluye:** nombre_cancion, nombre_artista, nombre_album, nombre_pais, total_reproducciones
 *       **Propósito:** Análisis de tendencias musicales por región geográfica.
 *     tags: [Vistas - Canciones Populares]
 *     responses:
 *       200:
 *         description: Datos de canciones populares obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VistaCancionPopular'
 *             examples:
 *               cancionesPopulares:
 *                 summary: Ejemplo de canciones populares
 *                 value:
 *                   - id_cancion: 1
 *                     titulo_cancion: "Bohemian Rhapsody"
 *                     id_album: 5
 *                     titulo_album: "A Night at the Opera"
 *                     nombre_artista: "Queen"
 *                     id_artista: 3
 *                     id_reproduccion: 1500000
 *                     nombre_pais: "Estados Unidos"
 *                     id_pais: 1
 *                   - id_cancion: 2
 *                     titulo_cancion: "Shape of You"
 *                     id_album: 8
 *                     titulo_album: "÷ (Divide)"
 *                     nombre_artista: "Ed Sheeran"
 *                     id_artista: 7
 *                     id_reproduccion: 1200000
 *                     nombre_pais: "Reino Unido"
 *                     id_pais: 2
 *                   - id_cancion: 3
 *                     titulo_cancion: "Despacito"
 *                     id_album: 12
 *                     titulo_album: "Vida"
 *                     nombre_artista: "Luis Fonsi"
 *                     id_artista: 15
 *                     id_reproduccion: 1800000
 *                     nombre_pais: "México"
 *                     id_pais: 3
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const todosDatos = async (req, res) => {
 
 try{
const vistaUno = await VistaUno.findAll({})
    

    const vistaUnoDatos = vistaUno.map(vistaUnoM => {
        return {
            id_cancion: vistaUnoM.id_cancion,
            titulo_cancion: vistaUnoM.titulo_cancion,
            id_album: vistaUnoM.id_album,
            titulo_album: vistaUnoM.titulo_album,
            nombre_artista: vistaUnoM.nombre_artista,
            id_artista: vistaUnoM.id_artista,
            id_reproduccion: vistaUnoM.id_reproduccion,
            nombre_pais: vistaUnoM.nombre_pais,
            id_pais: vistaUnoM.id_pais
        }

    })

    const vistaDosDatos = vistaUnoDatos.map(vistaUnoM => {
        return {
            titulo_cancion: vistaUnoM.titulo_cancion,
            nombre_artista: vistaUnoM.nombre_artista,
            id_reproduccion: vistaUnoM.id_reproduccion,
            nombre_pais: vistaUnoM.nombre_pais
        }
    })

    console.log(chalk.bgGreenBright('<----- Vista Uno -> todosDatos ----->'))
    console.table(vistaDosDatos)
    console.log(chalk.bgGreenBright('<------------------------->'))
    res.status(200).json(vistaUnoDatos)

 }
 catch(error){
     res.status(500).json({error: 'Error al obtener todos los datos -> ' + error})
     console.log(chalk.bgRed('Error al obtener todos los datos -> ' + error))
 }
    

}

/**
 * @swagger
 * /api/v1/vistas/canciones-populares-por-pais:
 *   get:
 *     summary: Canciones populares filtradas por país
 *     description: |
 *       Vista analítica de canciones más reproducidas en un país específico.
 *       **Características:**
 *       - Búsqueda flexible por nombre de país (ignora espacios y puntos)
 *       - Límite opcional de resultados
 *       - Ordenamiento personalizable
 *     tags: [Vistas - Canciones Populares]
 *     parameters:
 *       - in: query
 *         name: pais
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           Nombre del país para filtrar (búsqueda flexible que ignora espacios y puntos).
 *           Ejemplo: "EstadosUnidos" encontrará "Estados Unidos"
 *         example: "EstadosUnidos"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: |
 *           Límite de resultados a retornar (opcional).
 *           Ejemplo: 4 para obtener solo las 4 canciones más populares
 *         example: 4
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *         description: |
 *           Campo para ordenar los resultados (opcional).
 *           Por defecto ordena por id_cancion DESC
 *         example: "id_reproduccion"
 *     responses:
 *       200:
 *         description: Canciones populares por país obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VistaCancionPopular'
 *             examples:
 *               cancionesPaisLimitado:
 *                 summary: Canciones populares en Estados Unidos (limitado)
 *                 value:
 *                   - id_cancion: 1
 *                     titulo_cancion: "Bohemian Rhapsody"
 *                     id_album: 5
 *                     titulo_album: "A Night at the Opera"
 *                     nombre_artista: "Queen"
 *                     id_artista: 3
 *                     id_reproduccion: 1500000
 *                     nombre_pais: "Estados Unidos"
 *                     id_pais: 1
 *                   - id_cancion: 4
 *                     titulo_cancion: "Blinding Lights"
 *                     id_album: 15
 *                     titulo_album: "After Hours"
 *                     nombre_artista: "The Weeknd"
 *                     id_artista: 12
 *                     id_reproduccion: 1300000
 *                     nombre_pais: "Estados Unidos"
 *                     id_pais: 1
 *                   - id_cancion: 7
 *                     titulo_cancion: "Dance Monkey"
 *                     id_album: 22
 *                     titulo_album: "The Kids Are Coming"
 *                     nombre_artista: "Tones and I"
 *                     id_artista: 18
 *                     id_reproduccion: 1100000
 *                     nombre_pais: "Estados Unidos"
 *                     id_pais: 1
 *       400:
 *         description: Falta el parámetro de país
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Falta el parámetro pais"
 *       404:
 *         description: No se encontraron datos para el país especificado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "No existen datos del país en la Vista Uno para mostrar resultados"
 *       500:
 *         description: Error del servidor
 */

const busquedaPorPais = async (req, res) => {
   try{

    const { pais, limit, orden } = req.query

    const limits = parseInt(limit)

    if (!pais) {
        res.status(400).json({ error: 'Falta el parámetro pais' })
        console.log(chalk.bgRed('Falta el parámetro pais'))
        return
    }

   const vistaUnoControlaPais = await VistaUno.findOne({
        where: { nombre_pais: { [Op.regexp]: generarRegex(pais) } }
    })

    if (!vistaUnoControlaPais) {
        console.log(chalk.bgRed('No existen datos del país en la Vista Uno para mostrar resultados'))
        res.status(404).json({ error: 'No existen datos del país en la Vista Uno para mostrar resultados' })
        return
    }

     const vistaUno = await VistaUno.findAll({ 
        where: { nombre_pais: { [Op.regexp]: generarRegex(pais) } },
        limit: limits || INTEGER.MAX_VALUE, 
        order: [[orden || 'id_cancion', 'DESC']],
    })

    const vistaUnoDatos = vistaUno.map(vistaUnoM => {
        return {
            id_cancion: vistaUnoM.id_cancion,
            titulo_cancion: vistaUnoM.titulo_cancion,
            id_album: vistaUnoM.id_album,
            id_artista: vistaUnoM.id_artista,
            id_reproduccion: vistaUnoM.id_reproduccion,
            nombre_pais: vistaUnoM.nombre_pais,
           }
    })
    res.status(200).json(vistaUno)
    console.log(chalk.bgGreenBright('<----- Vista Uno -> busquedaPorPais y filtros ----->'))
    console.table(vistaUnoDatos)
    console.log(chalk.bgGreenBright('<------------------------->'))

}catch(error){
    res.status(500).json({error: 'Error al obtener todos los datos -> ' + error})
    console.log(chalk.bgRed('Error al obtener todos los datos -> ' + error))
}
}

module.exports = { busquedaPorPais, todosDatos }