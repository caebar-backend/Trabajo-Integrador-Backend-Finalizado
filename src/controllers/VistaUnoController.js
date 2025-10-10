
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