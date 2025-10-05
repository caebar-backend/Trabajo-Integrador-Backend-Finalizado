/**
 * Controlador de Usuarios
 * Los estudiantes deben implementar toda la lógica de negocio para usuarios
 */
const chalk = require('chalk')
const Usuario = require('../models/Usuario')
const { Op } = require('sequelize')
const sequelize = require('../config/database')
const bcrypt = require('bcrypt')


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
        })

        const usuariosDatos = usuarios.map((datos) => {
          return {
            Usuario: datos.id_usuario,
            Email: datos.email,
            Sexo: datos.sexo,
            Pais: datos.id_pais,
          }
        })

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

const putModificarPassword = async (req, res) => {
    try {
        const id = req.params.id
        const idp = parseInt(id)

        const { email, password_hash, fecha_nacimiento, 
        sexo, codigo_postal, id_pais, 
        fecha_registro, ultima_modificacion_password, 
        id_rol} = req.body

       const usuario = await Usuario.findByPk(idp)

       if(!usuario){
           console.log(chalk.yellowBright('<----- Usuario no encontrado ----->'))
           res.status(404).json({message: 'Usuario no encontrado'})
           return;
       }

       if(!email || !password_hash || !fecha_nacimiento || !sexo || !codigo_postal || !id_pais || !fecha_registro || !ultima_modificacion_password || !id_rol){
           console.log(chalk.yellowBright('<----- Faltan datos del usuario a modificar para completar la solicitud----->'))
           res.status(400).json({message: 'Faltan datos del usuario a modificiar para completar la solicitud'})
           return;
       }
        
        const passwordHasheada = await bcrypt.hash(password_hash, 10) // hasheo de password
        await usuario.update({
            id_usuario: idp,
            email,
            password_hash: passwordHasheada,
            fecha_nacimiento,
            sexo,
            codigo_postal,
            id_pais,
            fecha_registro,
            ultima_modificacion_password,
            id_rol
        })
        
        let usuarioDatos = {
            Usuario: usuario.id_usuario,
            Email: usuario.email,
            Password: usuario.password_hash,
            Sexo: usuario.sexo,
            CodigoPostal: usuario.codigo_postal,
            Pais: usuario.id_pais,
            IdRol: usuario.id_rol,
        }
        res.status(200).json({message: 'Usuario actualizado', usuarioDatos})
        console.log(chalk.greenBright(`<----- Usuario actualizado con ID ${id} ----->`))
        console.table(usuarioDatos)
        console.log(chalk.greenBright('<----- ------------------->'))


    } 
    catch(error){
        console.log(chalk.redBright('<----- Error en el servidor al actualizar usuario -----> ' + error))
        res.status(500).json({message: 'El servidor no pudo actualizar el usuario porque no está funcionando'})
    }
}

const getPasswordVencidas = async (req, res) => {
 try {
    const numeroFecha = parseInt(req.params.numeroFecha)
     if(isNaN(numeroFecha)){
        console.log(chalk.yellowBright('<----- El número de días debe ser un número entero ----->'))
        res.status(400).json({message: 'El número de días debe ser un número entero'})
        return;
    }

    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() - numeroFecha)// Cambiar el dato de la const numeroFecha por un número mucho menor, y obtendrás resultados

    const usuarios = await Usuario.findAll({
      attributes: ['id_usuario', 'email', 'password_hash'],
      where: {
        ultima_modificacion_password: {
          [Op.lt]: fechaLimite
        }
      },
      order: [['ultima_modificacion_password', 'ASC']] // Orden por antigüedad
    })

    if(usuarios.length === 0){
      console.log(chalk.blueBright('<----- No se encontraron usuarios con contraseñas antiguas ----->'))
      res.status(404).json({message: 'No se encontraron usuarios con contraseñas antiguas'})
      return;
    }
    const mapeoUsuarios = usuarios.map((user) => {
        return {
            Usuario: user.id_usuario,
            Email: user.email,
            Password: user.password_hash,
        }
    })
    res.status(200).json(usuarios)
    console.log(chalk.greenBright(`<----- Usuarios encontrados con contraseñas antiguas ----->`))
    console.table(mapeoUsuarios)
    console.log(chalk.greenBright('<----- ------------------->'))
  } catch (error) {
    console.error('Error al obtener contraseñas antiguas:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

const crearUser = async (req, res) => {
    try {
     const { email, password_hash, fecha_nacimiento, 
        sexo, codigo_postal, id_pais } = req.body
     
       //Validacion simple de datos
        if(!email || !password_hash || !fecha_nacimiento || !sexo || !id_pais){
           res.status(400).json({ error: 'Faltan datos para la alta del nuevo usuario'}) 
           console.log(chalk.yellowBright('<----- Faltan datos para la alta del nuevo usuario ----->'))
           return;
        }
        
        const passwordHasheada = await bcrypt.hash(password_hash, 10) // hasheo de password

        const UsuarioNuevo = await Usuario.create({ 
        email,
        password_hash: passwordHasheada,
        fecha_nacimiento,
        sexo,
        codigo_postal,
        id_pais,
        })

        let UsuarioNuevoDatos = {
            Usuario: UsuarioNuevo.id_usuario,
            Email: UsuarioNuevo.email,
            Password: UsuarioNuevo.password_hash,
            Sexo: UsuarioNuevo.sexo,
            CodigoPostal: UsuarioNuevo.codigo_postal,
            Pais: UsuarioNuevo.id_pais,
        }

        res.status(201).json({message: 'Usuario Nuevo Registrado', UsuarioNuevoDatos})
        console.log(chalk.greenBright(`<----- Usuario Nuevo Registrado con ID ${UsuarioNuevo.id_usuario} ----->`))
        console.table(UsuarioNuevoDatos)
        console.log(chalk.greenBright('<----- ------------------->'))
    }catch(error){
        res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
        console.log(chalk.redBright('<----- Error al crear usuario, servidor no funciona! -----> ' + error))
    }
}

module.exports = { getTodosLosUsuarios, putModificarPassword, getPasswordVencidas, crearUser }