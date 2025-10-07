/**
 * Controlador de Géneros
 * Los estudiantes deben implementar toda la lógica de negocio para géneros
 */


//TO DO - Crear género
const { Genero, sequelize } = require('../models/index')
const chalk = require('chalk')

const crearGenero = async (req, res) => {

    try{
        const { nombre, descripcion } = req.body
        if(!nombre){
            res.status(400).json({ error: 'El nombre del género es obligatorio'}) 
            console.log(chalk.yellowBright('<----- El nombre del género es obligatorio ----->'))
            return;
        
        }
        const generoExistente = await Genero.findOne({ where: { nombre } })
        if(generoExistente){
            res.status(400).json({ error: 'El nombre del género ya existe, debe elegir otro'}) 
            console.log(chalk.yellowBright('<----- El nombre del género ya existe, debe elegir otro ----->'))
            return;
        }

        const nuevoGenero = await Genero.create({
            nombre,
            descripcion,
        })

        let generoNuevoDatos = {
            nombre: nuevoGenero.nombre,
            descripcion: nuevoGenero.descripcion,
        }
        console.log(chalk.greenBright(`<----- Género Nuevo Registrado ----->`))
        console.table(generoNuevoDatos)
        console.log(chalk.greenBright('<----- ------------------->'))
        res.status(201).json({message: 'Género Nuevo Registrado', generoNuevoDatos})
        
        }
    catch(error){
        res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
        console.log(chalk.redBright('<----- Error al crear género, servidor no funciona! -----> ' + error.message))
    }

}

const getTodosLosGeneros = async (req, res) => {
    try{
        const losGeneros = await Genero.findAll()
        const losGenerosDatos = losGeneros.map((datos) => {
            return {
                id_genero: datos.id_genero,
                nombre: datos.nombre,
                descripcion: datos.descripcion,
            }
        })
        res.status(200).json(losGeneros)
        console.log(chalk.greenBright(`<----- Géneros encontrados ----->`))
        console.table(losGenerosDatos)
        console.log(chalk.greenBright('<----- ------------------->'))
    }
    catch(error){
        res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
        console.log(chalk.redBright('<----- Error al obtener géneros -----> ' + error.message))
    }
}

module.exports = { crearGenero, getTodosLosGeneros }