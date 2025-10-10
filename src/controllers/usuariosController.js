/**
 * Controlador de Usuarios
 * Los estudiantes deben implementar toda la lógica de negocio para usuarios
 */
const chalk = require('chalk')
const bcrypt = require('bcrypt')
const { Usuario, sequelize } = require('../models/index')
const { Op } = require('sequelize')


/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id_usuario:
 *           type: integer
 *           readOnly: true
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           example: "usuario@ejemplo.com"
 *         password_hash:
 *           type: string
 *           example: "$2b$10$hashedPasswordExample"
 *         fecha_nacimiento:
 *           type: string
 *           format: date
 *           example: "1990-01-15"
 *         sexo:
 *           type: string
 *           enum: [M, F, O]
 *           example: "M"
 *         codigo_postal:
 *           type: string
 *           example: "12345"
 *         id_pais:
 *           type: integer
 *           example: 1
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         ultima_modificacion_password:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         id_rol:
 *           type: integer
 *           example: 1
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     UsuarioInput:
 *       type: object
 *       required:
 *         - email
 *         - password_hash
 *         - fecha_nacimiento
 *         - sexo
 *         - id_pais
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "usuario@ejemplo.com"
 *         password_hash:
 *           type: string
 *           format: password
 *           example: "password123"
 *         fecha_nacimiento:
 *           type: string
 *           format: date
 *           example: "1990-01-15"
 *         sexo:
 *           type: string
 *           enum: [M, F, O]
 *           example: "M"
 *         codigo_postal:
 *           type: string
 *           example: "12345"
 *         id_pais:
 *           type: integer
 *           example: 1
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 * 
 *     UsuarioUpdateInput:
 *       type: object
 *       required:
 *         - email
 *         - password_hash
 *         - fecha_nacimiento
 *         - sexo
 *         - codigo_postal
 *         - id_pais
 *         - fecha_registro
 *         - ultima_modificacion_password
 *         - id_rol
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "usuario@ejemplo.com"
 *         password_hash:
 *           type: string
 *           format: password
 *           example: "nuevapassword123"
 *         fecha_nacimiento:
 *           type: string
 *           format: date
 *           example: "1990-01-15"
 *         sexo:
 *           type: string
 *           enum: [M, F, O]
 *           example: "M"
 *         codigo_postal:
 *           type: string
 *           example: "12345"
 *         id_pais:
 *           type: integer
 *           example: 1
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         ultima_modificacion_password:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         id_rol:
 *           type: integer
 *           example: 1
 * 
 *     UsuarioResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Usuario Nuevo Registrado"
 *         UsuarioNuevoDatos:
 *           type: object
 *           properties:
 *             Usuario:
 *               type: integer
 *               example: 1
 *             Email:
 *               type: string
 *               example: "usuario@ejemplo.com"
 *             Password:
 *               type: string
 *               example: "$2b$10$hashedPasswordExample"
 *             Sexo:
 *               type: string
 *               example: "M"
 *             CodigoPostal:
 *               type: string
 *               example: "12345"
 *             Pais:
 *               type: integer
 *               example: 1
 * 
 *     UsuarioDatos:
 *       type: object
 *       properties:
 *         Usuario:
 *           type: integer
 *           example: 1
 *         Email:
 *           type: string
 *           example: "usuario@ejemplo.com"
 *         Sexo:
 *           type: string
 *           example: "M"
 *         Pais:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener usuarios con diferentes criterios
 *     description: Retorna usuarios según el header content-type especificado. Soporta tres modos de consulta diferentes.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: header
 *         name: content-type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [users-todos, users-id, users-p-l]
 *         description: Tipo de consulta a realizar
 *         examples:
 *           todos: 
 *             summary: Todos los usuarios
 *             value: "users-todos"
 *           paginado:
 *             summary: Usuarios paginados
 *             value: "users-p-l"
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID del usuario (solo para users-id)
 *         required: false
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página (solo para users-p-l)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 5
 *         description: Límite de resultados por página (solo para users-p-l)
 *     responses:
 *       200:
 *         description: Usuarios obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Header content-type inválido o faltante
 *       500:
 *         description: Error interno del servidor
 */

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


/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Modificar contraseña y datos de usuario
 *     description: Actualiza completamente los datos de un usuario, incluyendo la contraseña (que es hasheada automáticamente)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario a modificar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioUpdateInput'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario actualizado"
 *                 usuarioDatos:
 *                   type: object
 *                   properties:
 *                     Usuario:
 *                       type: integer
 *                       example: 1
 *                     Email:
 *                       type: string
 *                       example: "usuario@ejemplo.com"
 *                     Password:
 *                       type: string
 *                       example: "$2b$10$hashedPasswordExample"
 *                     Sexo:
 *                       type: string
 *                       example: "M"
 *                     CodigoPostal:
 *                       type: string
 *                       example: "12345"
 *                     Pais:
 *                       type: integer
 *                       example: 1
 *                     IdRol:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Faltan datos requeridos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Faltan datos del usuario a modificar para completar la solicitud"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 */

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


/**
 * @swagger
 * /api/usuarios/password-vencidas/{numeroFecha}:
 *   get:
 *     summary: Obtener usuarios con contraseñas vencidas
 *     description: Retorna usuarios cuya contraseña no ha sido modificada en los últimos X días
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: numeroFecha
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de días para considerar una contraseña como vencida
 *         example: 90
 *     responses:
 *       200:
 *         description: Usuarios con contraseñas vencidas encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Parámetro inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El número de días debe ser un número entero"
 *       404:
 *         description: No se encontraron usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No se encontraron usuarios con contraseñas antiguas"
 *       500:
 *         description: Error interno del servidor
 */

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


/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Registra un nuevo usuario en el sistema. La contraseña es hasheada automáticamente y se valida que el email esté en minúsculas.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *           examples:
 *             usuarioCompleto:
 *               summary: Usuario con todos los campos
 *               value:
 *                 email: "nuevo@ejemplo.com"
 *                 password_hash: "password123"
 *                 fecha_nacimiento: "1990-01-15"
 *                 sexo: "M"
 *                 codigo_postal: "12345"
 *                 id_pais: 1
 *                 fecha_registro: "2024-01-15T10:30:00.000Z"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               datosFaltantes:
 *                 summary: Faltan datos obligatorios
 *                 value:
 *                   error: "Faltan datos para la alta del nuevo usuario"
 *               emailExistente:
 *                 summary: Email ya existe
 *                 value:
 *                   error: "El email ya existe, debe elegir otro"
 *               emailMayusculas:
 *                 summary: Email en mayúsculas
 *                 value:
 *                   error: "El email debe ser en letras minúscula"
 *       500:
 *         description: Error interno del servidor
 */

const crearUser = async (req, res) => {
    try {
     const { email, password_hash, fecha_nacimiento, 
        sexo, codigo_postal, id_pais, fecha_registro } = req.body
     
       //Validacion simple de datos
        if(!email || !password_hash || !fecha_nacimiento || !sexo || !id_pais){
           res.status(400).json({ error: 'Faltan datos para la alta del nuevo usuario'}) 
           console.log(chalk.yellowBright('<----- Faltan datos para la alta del nuevo usuario ----->'))
           return;
        }

        const emailExistente = await Usuario.findOne({ where: { email } })
        if(emailExistente){
            res.status(400).json({ error: 'El email ya existe, debe elegir otro'}) 
            console.log(chalk.yellowBright('<----- El email ya existe, debe elegir otro ----->'))
            return;
        }

        if(email !== email.toLowerCase()){
            res.status(400).json({ error: 'El email debe ser en letras minúscula'}) 
            console.log(chalk.yellowBright('<----- El email debe ser en letras minúscula ----->'))
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
        fecha_registro,
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