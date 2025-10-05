/**
 * Controlador de Artistas
 * Los estudiantes deben implementar toda la lógica de negocio para artistas
 */

const chalk = require('chalk')
const Artista = require('../models/Artista')
const { Op } = require('sequelize')
const sequelize = require('../config/database')

const getTodosLosArtistas = async(req, res) => {
    try{
        if(req.headers['pedido'] === 'artistas-todos'){
            await sequelize.authenticate()
            const artistas = await Artista.findAll()
            const artistasDatos = artistas.map((datos) => {
                return {
                    id_artista: datos.id_artista,
                    nombre: datos.nombre,
                    fecha_registro: datos.fecha_registro,
                }
                })
            res.status(200).json(artistas)
            console.log(chalk.greenBright('<----- Artistas encontrados ----->'))
            console.table(artistasDatos)
            console.log(chalk.greenBright('<----- ------------------->'))
        }else{
            res.status(400).json({message: 'Error al obtener artistas'}, error.message)
            console.log(chalk.redBright('<----- Error al obtener artistas -----> ' + error.message))
        }
        
    }
    catch(error){
        console.log(chalk.redBright('<----- Error al obtener artistas -----> ' + error.message))
        res.status(500).json({message: 'Error al obtener artistas'})
    }
}

const crearArtista = async (req, res) => {
    try{
        const { nombre, imagen_url, biografia } = req.body
        // Validacion básica de datos
        if(!nombre){
           res.status(400).json({ error: 'El nombre del artista es obligatorio'}) 
           console.log(chalk.yellowBright('<----- El nombre del artista es obligatorio ----->'))
           return;
        
        }
        
        const ArtistaNombreExistente = await Artista.findOne({ where: { nombre } })
        if(ArtistaNombreExistente){
            res.status(400).json({ error: 'El nombre del artista ya existe, debe elegir otro'}) 
            console.log(chalk.yellowBright('<----- El nombre del artista ya existe, debe elegir otro ----->'))
            return;
        }
        
        const ArtistaNuevo = await Artista.create({
            nombre,
            imagen_url,
            biografia,
            fecha_registro: new Date(),
        })

        let ArtistaNuevoDatos = {
            id_artista: ArtistaNuevo.id_artista,
            nombre: ArtistaNuevo.nombre,
            imagen_url: ArtistaNuevo.imagen_url,
            biografia: ArtistaNuevo.biografia,
        }
        res.status(201).json({message: 'Artista Nuevo Registrado', ArtistaNuevoDatos})
        console.log(chalk.greenBright(`<----- Artista Nuevo Registrado con ID ${ArtistaNuevo.id_artista} ----->`))
        console.table(ArtistaNuevoDatos)
        console.log(chalk.greenBright('<----- ------------------->'))
        
      }
    catch(error){
        res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
        console.log(chalk.redBright('<----- Error al crear artista, servidor no funciona! -----> ' + error))
    }
}

module.exports = { getTodosLosArtistas, crearArtista }