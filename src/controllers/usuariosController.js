/**
 * Controlador de Usuarios
 * Los estudiantes deben implementar toda la lógica de negocio para usuarios
 */
const chalk = require('chalk')
const Usuario = require('../models/Usuario')
const { Op } = require('sequelize')
const sequelize = require('../config/database')

const getTodosLosUsuarios = async (req, res) => {
    try {
        await sequelize.authenticate()
        const usuarios = await Usuario.findAll()
        const usuariosDatos = usuarios.map((datos) => {
        return {
                Usuario: datos.id_usuario,
                Email: datos.email,
                Sexo: datos.sexo,
                Pais: datos.id_pais,
                }
        })
        res.status(200).json(usuarios)
        console.log(chalk.greenBright('<----- Usuarios encontrados ----->'))
        console.table(usuariosDatos)
        console.log(chalk.greenBright('<----- ------------------->'))
    }
    
    catch(error){
        console.log(chalk.redBright('<----- Error al obtener usuarios -----> ' + error))
        res.status(500).json({message: 'Error al obtener usuarios'})
    }
    
}

module.exports = { getTodosLosUsuarios }