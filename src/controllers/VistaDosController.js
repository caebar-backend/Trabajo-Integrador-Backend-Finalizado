
const { VistaDos, sequelize } = require('../models')
const chalk = require('chalk')
const { Op } = require('sequelize')


function generarRegex(palabra) {
  // Divide la palabra en letras y entre cada letra inserta una expresión que ignore espacios y puntos
  const letras = palabra.split('')
  const regex = letras.map(letra => `${letra}[\\s\\.]*`).join('')
  return regex;
}


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

/*
const getTodosDatos = async (req, res) => {
    try{
        const vistaDos = await VistaDos.findAll({})
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
        console.log(chalk.bgGreenBright('<----- Vista Dos -> getTodosDatos ----->'))
        console.table(vistaDosDatos)
        console.log(chalk.bgGreenBright('<------------------------->'))
        res.status(200).json(vistaDosDatos)
    }
    catch(error){
        res.status(500).json({error: 'Error al obtener todos los datos -> ' + error})
        console.log(chalk.bgRed('Error al obtener todos los datos -> ' + error))
    }
    }
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