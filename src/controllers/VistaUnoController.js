
const { VistaUno} = require('../models')
const { sequelize } = require('../models')
const { Op, INTEGER } = require('sequelize')
const chalk = require('chalk')


/**
 * @swagger
 * components:
 *   schemas:
 *     VistaUno:
 *       type: object
 *       properties:
 *         id_cancion:
 *           type: integer
 *           example: 1
 *         titulo_cancion:
 *           type: string
 *           example: "Bohemian Rhapsody"
 *         id_album:
 *           type: integer
 *           example: 1
 *         titulo_album:
 *           type: string
 *           example: "A Night at the Opera"
 *         nombre_artista:
 *           type: string
 *           example: "Queen"
 *         id_artista:
 *           type: integer
 *           example: 1
 *         id_reproduccion:
 *           type: integer
 *           example: 1500000
 *         nombre_pais:
 *           type: string
 *           example: "Estados Unidos"
 *         id_pais:
 *           type: integer
 *           example: 1
 * 
 *     VistaUnoResponse:
 *       type: object
 *       properties:
 *         id_cancion:
 *           type: integer
 *           example: 1
 *         titulo_cancion:
 *           type: string
 *           example: "Bohemian Rhapsody"
 *         id_album:
 *           type: integer
 *           example: 1
 *         titulo_album:
 *           type: string
 *           example: "A Night at the Opera"
 *         nombre_artista:
 *           type: string
 *           example: "Queen"
 *         id_artista:
 *           type: integer
 *           example: 1
 *         id_reproduccion:
 *           type: integer
 *           example: 1500000
 *         nombre_pais:
 *           type: string
 *           example: "Estados Unidos"
 *         id_pais:
 *           type: integer
 *           example: 1
 * 
 *     VistaUnoSimplified:
 *       type: object
 *       properties:
 *         titulo_cancion:
 *           type: string
 *           example: "Bohemian Rhapsody"
 *         nombre_artista:
 *           type: string
 *           example: "Queen"
 *         id_reproduccion:
 *           type: integer
 *           example: 1500000
 *         nombre_pais:
 *           type: string
 *           example: "Estados Unidos"
 */

function generarRegex(palabra) {
  // Divide la palabra en letras y entre cada letra inserta una expresión que ignore espacios y puntos
  const letras = palabra.split('')
  const regex = letras.map(letra => `${letra}[\\s\\.]*`).join('')
  return regex;
}


/**
 * @swagger
 * /api/vistas/reproducciones-completas:
 *   get:
 *     summary: Obtener todos los datos de reproducciones
 *     description: Retorna todos los registros de la vista de reproducciones, mostrando canciones, álbumes, artistas y países con sus reproducciones.
 *     tags: [Vistas Analíticas]
 *     responses:
 *       200:
 *         description: Datos de reproducciones obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VistaUnoResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al obtener todos los datos -> [detalle del error]"
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
 * /api/vistas/reproducciones-por-pais:
 *   get:
 *     summary: Filtrar reproducciones por país con opciones avanzadas
 *     description: Retorna registros de reproducciones filtrados por país, con opciones de límite y ordenamiento. Usa búsqueda flexible por nombre de país.
 *     tags: [Vistas Analíticas]
 *     parameters:
 *       - in: query
 *         name: pais
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del país para filtrar (soporta búsqueda flexible con espacios/puntos)
 *         example: "Estados Unidos"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *         description: Límite de registros a retornar (opcional)
 *         example: 100
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           enum: [id_cancion, titulo_cancion, id_reproduccion, nombre_artista]
 *           default: "id_cancion"
 *         description: Campo por el cual ordenar los resultados
 *         example: "id_reproduccion"
 *     responses:
 *       200:
 *         description: Reproducciones filtradas por país obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VistaUno'
 *       400:
 *         description: Falta el parámetro pais
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Falta el parámetro pais"
 *       404:
 *         description: No se encontraron datos para el país especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No existen datos del país en la Vista Uno para mostrar resultados"
 *       500:
 *         description: Error interno del servidor
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