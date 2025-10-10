
const { VistaDos, sequelize } = require('../models')
const chalk = require('chalk')
const { Op } = require('sequelize')



/**
 * @swagger
 * components:
 *   schemas:
 *     VistaDos:
 *       type: object
 *       properties:
 *         id_artista:
 *           type: integer
 *           example: 1
 *         art_ingreso:
 *           type: number
 *           format: float
 *           example: 150000.50
 *         id_discografica:
 *           type: integer
 *           example: 1
 *         discograf_nombre:
 *           type: string
 *           example: "Sony Music"
 *         discograf_ingreso:
 *           type: number
 *           format: float
 *           example: 5000000.75
 *         id_pais:
 *           type: integer
 *           example: 1
 *         pais_nombre:
 *           type: string
 *           example: "Estados Unidos"
 *         ingreso_total:
 *           type: number
 *           format: float
 *           example: 5150001.25
 * 
 *     VistaDosResponse:
 *       type: object
 *       properties:
 *         id_artista:
 *           type: integer
 *           example: 1
 *         art_ingreso:
 *           type: number
 *           format: float
 *           example: 150000.50
 *         id_discografica:
 *           type: integer
 *           example: 1
 *         discograf_nombre:
 *           type: string
 *           example: "Sony Music"
 *         discograf_ingreso:
 *           type: number
 *           format: float
 *           example: 5000000.75
 *         id_pais:
 *           type: integer
 *           example: 1
 *         pais_nombre:
 *           type: string
 *           example: "Estados Unidos"
 *         ingreso_total:
 *           type: number
 *           format: float
 *           example: 5150001.25
 */


function generarRegex(palabra) {
  // Divide la palabra en letras y entre cada letra inserta una expresión que ignore espacios y puntos
  const letras = palabra.split('')
  const regex = letras.map(letra => `${letra}[\\s\\.]*`).join('')
  return regex;
}


/**
 * @swagger
 * /api/vista-dos:
 *   get:
 *     summary: Obtener todos los datos de la Vista Dos
 *     description: Retorna todos los registros de la vista de analítica de ingresos por artista, discográfica y país. Soporta paginación.
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
 *         description: Datos de la vista obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VistaDosResponse'
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

const getTodosDatos = async (req, res) => {
    try {
        const { page, limit } = req.query

        // Si page y limit están definidos, calcular offset
        const pagination = {}
        if (page && limit) {
            const pageNum = parseInt(page)
            const limitNum = parseInt(limit)
            const offset = (pageNum - 1) * limitNum

            pagination.limit = limitNum
            pagination.offset = offset
        }

        const vistaDos = await VistaDos.findAll(pagination)

        const vistaDosDatos = vistaDos.map(vistaDosM => ({
            id_artista: vistaDosM.id_artista,
            art_ingreso: vistaDosM.art_ingreso,
            id_discografica: vistaDosM.id_discografica,
            discograf_nombre: vistaDosM.discograf_nombre,
            discograf_ingreso: vistaDosM.discograf_ingreso,
            id_pais: vistaDosM.id_pais,
            pais_nombre: vistaDosM.pais_nombre,
            ingreso_total: vistaDosM.ingreso_total
        }));

        console.log(chalk.bgGreenBright('<----- Vista Dos -> getTodosDatos ----->'))
        console.table(vistaDosDatos)
        console.log(chalk.bgGreenBright('<------------------------->'))

        res.status(200).json(vistaDosDatos)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener todos los datos -> ' + error })
        console.log(chalk.bgRed('Error al obtener todos los datos -> ' + error))
    }
}


/**
 * @swagger
 * /api/vista-dos/pais:
 *   get:
 *     summary: Filtrar datos de Vista Dos por país
 *     description: Retorna registros de la vista filtrados por nombre de país. Usa búsqueda por regex que ignora espacios y puntos.
 *     tags: [Vistas Analíticas]
 *     parameters:
 *       - in: query
 *         name: pais
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del país para filtrar (soporta búsqueda flexible con espacios/puntos)
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
 *                   example: "No existen datos del país en la Vista Dos para mostrar resultados"
 *       500:
 *         description: Error interno del servidor
 */

const getDatosPorPais = async (req, res) => {
        try{
  
           const { pais } = req.query

            if (!pais) {
                res.status(400).json({ error: 'Falta el parámetro pais o minimo_ingresos' })
                console.log(chalk.bgRed('Falta el parámetro pais o minimo_ingresos'))
                return
            }

            const vistaDosPais = await VistaDos.findOne({ 
                where: { pais_nombre: { [Op.regexp]: generarRegex(pais) } }
            })

            if(!vistaDosPais){
                console.log(chalk.bgRed('No existen datos del país en la Vista Dos para mostrar resultados'))
                res.status(404).json({ error: 'No existen datos del país en la Vista Dos para mostrar resultados' })
                return
            }


            const vistaDos = await VistaDos.findAll({ 
                where: { pais_nombre: { [Op.regexp]: generarRegex(pais)} }
            })


            const vistaDosDatos = vistaDos.map(vistaDosM => {
                return {
                    id_artista: vistaDosM.id_artista,
                    art_ingreso: vistaDosM.art_ingreso,
                    id_discografica: vistaDosM.id_discografica,
                    discograf_nombre: vistaDosM.discograf_nombre,
                    discograf_ingreso: vistaDosM.discograf_ingreso,
                    id_pais: vistaDosM.id_pais,
                    pais_nombre: vistaDosM.pais_nombre,
                    ingreso_total: vistaDosM.ingreso_total
                }
            })
            res.status(200).json(vistaDosDatos)
            console.log(chalk.bgGreenBright('<----- Vista Dos -> getDatosPorPais ----->'))
            console.table(vistaDosDatos)
            console.log(chalk.bgGreenBright('<------------------------->'))
        
        }
        catch(error){
            res.status(500).json({error: 'Error al obtener todos los datos -> ' + error})
            console.log(chalk.bgRed('Error al obtener todos los datos -> ' + error))
        }
    }   
   

    /**
 * @swagger
 * /api/vista-dos/ingresos:
 *   get:
 *     summary: Filtrar datos de Vista Dos por mínimo de ingresos
 *     description: Retorna registros de la vista donde los ingresos de la discográfica son mayores o iguales al valor especificado
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Falta el parámetro minimo_ingresos"
 *       500:
 *         description: Error interno del servidor
 */

    const getDatosPorMinimoIngresos = async (req, res) => {
        try{
            const { minimo_ingresos } = req.query
            const minimoIngresosOk = parseInt(minimo_ingresos)

            if (!minimoIngresosOk) {
                res.status(400).json({ error: 'Falta el parámetro minimo_ingresos' })
                console.log(chalk.bgRed('Falta el parámetro minimo_ingresos'))
                return
            }
          

        const vistaDos = await VistaDos.findAll({
                       where: {
                          discograf_ingreso: {
                          [Op.gte]: minimoIngresosOk // mayor o igual
                              }
                              }
        })

            const vistaDosDatos = vistaDos.map(vistaDosM => {
                return {
                    id_artista: vistaDosM.id_artista,
                    art_ingreso: vistaDosM.art_ingreso,
                    id_discografica: vistaDosM.id_discografica,
                    discograf_nombre: vistaDosM.discograf_nombre,
                    discograf_ingreso: vistaDosM.discograf_ingreso,
                    id_pais: vistaDosM.id_pais,
                    pais_nombre: vistaDosM.pais_nombre,
                    ingreso_total: vistaDosM.ingreso_total
                }
            })

            res.status(200).json(vistaDos) 
        }catch(error){
            res.status(500).json({error: 'Error al obtener todos los datos -> ' + error})
            console.log(chalk.bgRed('Error al obtener todos los datos -> ' + error))
        }
    }

module.exports = { getTodosDatos, getDatosPorPais, getDatosPorMinimoIngresos }