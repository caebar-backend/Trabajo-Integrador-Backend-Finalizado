
const { VistaDos, sequelize } = require('../models')
const chalk = require('chalk')
const { Op } = require('sequelize')

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
 *     VistaIngresos:
 *       type: object
 *       properties:
 *         id_artista:
 *           type: integer
 *           description: ID único del artista
 *         art_ingreso:
 *           type: number
 *           format: float
 *           description: Ingresos generados por el artista
 *         id_discografica:
 *           type: integer
 *           description: ID único de la discográfica
 *         discograf_nombre:
 *           type: string
 *           description: Nombre de la discográfica
 *         discograf_ingreso:
 *           type: number
 *           format: float
 *           description: Ingresos generados por la discográfica
 *         id_pais:
 *           type: integer
 *           description: ID del país de la discográfica
 *         pais_nombre:
 *           type: string
 *           description: Nombre del país de la discográfica
 *         ingreso_total:
 *           type: number
 *           format: float
 *           description: Ingreso total de la combinación artista-discográfica
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Vistas
 *   description: Vistas analíticas del sistema - Reportes de ingresos
 */

/**
 * @swagger
 * /api/v1/vistas/ingresos-por-artista-discografica-todos:
 *   get:
 *     summary: Obtener todos los ingresos por artista y discográfica
 *     description: |
 *       Vista analítica que muestra los ingresos generados por cada combinación artista-discográfica.
 *       **Incluye:** nombre_artista, nombre_discografica, nombre_pais_discografica, total_ingresos
 *       **Características:**
 *       - Soporta paginación opcional
 *       - Datos completos de ingresos por combinación
 *     tags: [Vistas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para paginación (opcional)
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de resultados por página (opcional)
 *         example: 10
 *     responses:
 *       200:
 *         description: Datos de ingresos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VistaIngresos'
 *             examples:
 *               ingresos:
 *                 summary: Ejemplo de datos de ingresos
 *                 value:
 *                   - id_artista: 1
 *                     art_ingreso: 150000
 *                     id_discografica: 5
 *                     discograf_nombre: "Sony Music"
 *                     discograf_ingreso: 50000
 *                     id_pais: 1
 *                     pais_nombre: "Estados Unidos"
 *                     ingreso_total: 200000
 *                   - id_artista: 2
 *                     art_ingreso: 300000
 *                     id_discografica: 3
 *                     discograf_nombre: "Universal Music"
 *                     discograf_ingreso: 100000
 *                     id_pais: 2
 *                     pais_nombre: "Reino Unido"
 *                     ingreso_total: 400000
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * /api/v1/vistas/ingresos-por-artista-discografica:
 *   get:
 *     summary: Ingresos por artista y discográfica filtrados por país
 *     description: |
 *       Vista analítica filtrada por país de la discográfica.
 *       **Características:**
 *       - Búsqueda flexible por nombre de país (ignora espacios y puntos)
 *       - Ejemplo: "estadosunidos" encuentra "Estados Unidos"
 *     tags: [Vistas]
 *     parameters:
 *       - in: query
 *         name: pais
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           Nombre del país para filtrar (búsqueda flexible que ignora espacios y puntos).
 *           Ejemplo: "estadosunidos" encontrará "Estados Unidos"
 *         example: "estadosunidos"
 *     responses:
 *       200:
 *         description: Datos filtrados por país obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VistaIngresos'
 *             examples:
 *               ingresosPais:
 *                 summary: Ingresos filtrados por país
 *                 value:
 *                   - id_artista: 1
 *                     art_ingreso: 150000
 *                     id_discografica: 5
 *                     discograf_nombre: "Sony Music"
 *                     discograf_ingreso: 50000
 *                     id_pais: 1
 *                     pais_nombre: "Estados Unidos"
 *                     ingreso_total: 200000
 *                   - id_artista: 3
 *                     art_ingreso: 250000
 *                     id_discografica: 7
 *                     discograf_nombre: "Warner Music"
 *                     discograf_ingreso: 75000
 *                     id_pais: 1
 *                     pais_nombre: "Estados Unidos"
 *                     ingreso_total: 325000
 *       400:
 *         description: Falta el parámetro de país
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Falta el parámetro pais o minimo_ingresos"
 *       404:
 *         description: No se encontraron datos para el país especificado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "No existen datos del país en la Vista Dos para mostrar resultados"
 *       500:
 *         description: Error del servidor
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
 * /api/v1/vistas/ingresos-por-artista-discografica-ingresos:
 *   get:
 *     summary: Ingresos por artista y discográfica con filtro por monto mínimo
 *     description: |
 *       Vista analítica filtrada por monto mínimo de ingresos de la discográfica.
 *       **Propósito:** Identificar combinaciones artista-discográfica con ingresos significativos.
 *     tags: [Vistas]
 *     parameters:
 *       - in: query
 *         name: minimo_ingresos
 *         required: true
 *         schema:
 *           type: integer
 *         description: |
 *           Monto mínimo de ingresos para filtrar los resultados.
 *           **Nota:** Usar números como 300000 para filtrar ingresos altos.
 *         example: 300000
 *     responses:
 *       200:
 *         description: Datos filtrados por monto mínimo obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VistaIngresos'
 *             examples:
 *               ingresosAltos:
 *                 summary: Combinaciones con ingresos altos
 *                 value:
 *                   - id_artista: 2
 *                     art_ingreso: 500000
 *                     id_discografica: 3
 *                     discograf_nombre: "Universal Music"
 *                     discograf_ingreso: 350000
 *                     id_pais: 2
 *                     pais_nombre: "Reino Unido"
 *                     ingreso_total: 850000
 *                   - id_artista: 4
 *                     art_ingreso: 450000
 *                     id_discografica: 5
 *                     discograf_nombre: "Sony Music"
 *                     discograf_ingreso: 400000
 *                     id_pais: 1
 *                     pais_nombre: "Estados Unidos"
 *                     ingreso_total: 850000
 *       400:
 *         description: Falta o es inválido el parámetro de ingresos mínimos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Falta el parámetro minimo_ingresos"
 *       500:
 *         description: Error del servidor
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
        
        res.status(200).json(vistaDos) 
            
        }catch(error){
            res.status(500).json({error: 'Error al obtener todos los datos -> ' + error})
            console.log(chalk.bgRed('Error al obtener todos los datos -> ' + error))
        }
    }

module.exports = { getTodosDatos, getDatosPorPais, getDatosPorMinimoIngresos }