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
        if(req.headers['content-type'] === 'users-todos'){
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

    else if(req.headers['content-type'] === 'users-id'){
        const id = req.params.id
        const idp = parseInt(id)
        const usuario = await Usuario.findByPk(idp)
        let usuarioDatos = {
            Usuario: usuario.id_usuario,
            Email: usuario.email,
            Sexo: usuario.sexo,
            Pais: usuario.id_pais,
        }
        res.status(200).json(usuario)
        console.log(chalk.greenBright(`<----- Usuario encontrado con ID ${id} ----->`))
        console.table(usuarioDatos)
        console.log(chalk.greenBright('<----- ------------------->'))
        
    }

    else if(req.headers['content-type'] === 'users-p-l'){
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        // Consulta con paginación
        const usuarios = await Usuario.findAll({
          limit,
          offset
        });

        const usuariosDatos = usuarios.map((datos) => {
          return {
            Usuario: datos.id_usuario,
            Email: datos.email,
            Sexo: datos.sexo,
            Pais: datos.id_pais,
          };
        });

        res.status(200).json(usuarios);
        console.log(chalk.greenBright(`<----- Usuarios encontrados (página ${page}, límite ${limit}) ----->`));
        console.table(usuariosDatos);
        console.log(chalk.greenBright('<----- ------------------->'));
    }

    
}
    
    catch(error){
        console.log(chalk.redBright('<----- Error al obtener usuarios -----> ' + error))
        res.status(500).json({message: 'Error al obtener usuarios'})
    }
    
}


module.exports = { getTodosLosUsuarios }