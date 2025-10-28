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
 * /api/v1/usuarios:
 *   get:
 *     summary: Listar usuarios
 *     description: |
 *       Retorna lista de usuarios con diferentes opciones según el header Content-Type.
 *       **Opciones disponibles:**
 *       - `users-todos` → Todos los usuarios
 *       - `users-p-l` → Paginación (query params page y limit)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [users-todos, users-p-l]
 *         description: Tipo de consulta a realizar
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página (solo para users-p-l)
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de resultados por página (solo para users-p-l)
 *         example: 5
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Error del servidor
 */
/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     description: Retorna un usuario específico por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [users-id]
 *         description: Debe ser 'users-id'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
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
 * /api/v1/usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario completo
 *     description: |
 *       Actualiza todos los campos de un usuario. Requiere enviar todos los campos.
 *       **Nota:** No se puede actualizar solo la contraseña, debe enviarse el usuario completo.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *         example: 47
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCompleto'
 *           examples:
 *             actualizacionCompleta:
 *               summary: Actualización completa exitosa
 *               value:
 *                 id_usuario: 47
 *                 email: "caebar202647@gmail.com"
 *                 password_hash: "caebarXsiempre2026"
 *                 fecha_nacimiento: "1983-09-15"
 *                 sexo: "M"
 *                 codigo_postal: "BHY2800K"
 *                 id_pais: 16
 *                 fecha_registro: "2025-10-04T00:00:00.000Z"
 *                 ultima_modificacion_password: "2025-10-04T00:00:00.000Z"
 *                 id_rol: 4
 *             actualizacionError:
 *               summary: Actualización parcial (error)
 *               value:
 *                 password_hash: "Nuev4Clave!"
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
 *                 usuarioDatos:
 *                   type: object
 *                   properties:
 *                     Usuario:
 *                       type: integer
 *                     Email:
 *                       type: string
 *                     Password:
 *                       type: string
 *                     Sexo:
 *                       type: string
 *                     CodigoPostal:
 *                       type: string
 *                     Pais:
 *                       type: integer
 *                     IdRol:
 *                       type: integer
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Faltan datos del usuario a modificar para completar la solicitud"
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
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
 * /api/v1/usuarios/password-vencidas/{dias}:
 *   get:
 *     summary: Listar usuarios con contraseñas vencidas
 *     description: |
 *       Retorna usuarios cuya contraseña no ha sido modificada en más de X días.
 *       **Nota:** Usar números menores a 90 para obtener resultados.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: dias
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de días para considerar la contraseña como vencida
 *         example: 10
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
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "El número de días debe ser un número entero"
 *       404:
 *         description: No se encontraron usuarios con contraseñas vencidas
 *       500:
 *         description: Error del servidor
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
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id_usuario:
 *           type: integer
 *           description: ID único del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario (en minúsculas)
 *         password_hash:
 *           type: string
 *           description: Hash de la contraseña
 *         fecha_nacimiento:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento del usuario
 *         sexo:
 *           type: string
 *           enum: [M, F, O]
 *           description: Sexo del usuario (M=Masculino, F=Femenino, O=Otro)
 *         codigo_postal:
 *           type: string
 *           description: Código postal del usuario
 *         id_pais:
 *           type: integer
 *           description: ID del país del usuario
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           description: Fecha de registro del usuario
 *         ultima_modificacion_password:
 *           type: string
 *           format: date-time
 *           description: Fecha de última modificación de la contraseña
 *         id_rol:
 *           type: integer
 *           description: ID del rol del usuario
 *     NuevoUsuario:
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
 *           example: "usuariodeprueba@yahoo.com.ar"
 *         password_hash:
 *           type: string
 *           example: "Secr3t0!"
 *         fecha_nacimiento:
 *           type: string
 *           format: date
 *           example: "1995-05-20"
 *         sexo:
 *           type: string
 *           enum: [M, F, O]
 *           example: "F"
 *         codigo_postal:
 *           type: string
 *           example: "4600"
 *         id_pais:
 *           type: integer
 *           example: 10
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           example: "2025-12-09T10:00:00.000Z"
 *     UsuarioCompleto:
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
 *         id_usuario:
 *           type: integer
 *           example: 47
 *         email:
 *           type: string
 *           format: email
 *           example: "caebar202647@gmail.com"
 *         password_hash:
 *           type: string
 *           example: "caebarXsiempre2026"
 *         fecha_nacimiento:
 *           type: string
 *           format: date
 *           example: "1983-09-15"
 *         sexo:
 *           type: string
 *           enum: [M, F, O]
 *           example: "M"
 *         codigo_postal:
 *           type: string
 *           example: "BHY2800K"
 *         id_pais:
 *           type: integer
 *           example: 16
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           example: "2025-10-04T00:00:00.000Z"
 *         ultima_modificacion_password:
 *           type: string
 *           format: date-time
 *           example: "2025-10-04T00:00:00.000Z"
 *         id_rol:
 *           type: integer
 *           example: 4
 *     UsuarioResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         UsuarioNuevoDatos:
 *           type: object
 *           properties:
 *             Usuario:
 *               type: integer
 *             Email:
 *               type: string
 *             Password:
 *               type: string
 *             Sexo:
 *               type: string
 *             CodigoPostal:
 *               type: string
 *             Pais:
 *               type: integer
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         message:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios del sistema
 */

/**
 * @swagger
 * /api/v1/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: |
 *       Crea un nuevo usuario en el sistema con validaciones de email único y formato.
 *       **Características de seguridad:**
 *       - La contraseña se hashea automáticamente con bcrypt
 *       - El email se valida que esté en minúsculas
 *       - Validación de email único en el sistema
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoUsuario'
 *           examples:
 *             usuarioCorrecto:
 *               summary: Usuario válido
 *               value:
 *                 email: "usuariodeprueba@yahoo.com.ar"
 *                 password_hash: "Secr3t0!"
 *                 fecha_nacimiento: "1995-05-20"
 *                 sexo: "F"
 *                 codigo_postal: "4600"
 *                 id_pais: 10
 *             usuarioError:
 *               summary: Usuario con datos faltantes
 *               value:
 *                 password_hash: "Secr3t0!"
 *                 fecha_nacimiento: "1995-05-20"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 *             examples:
 *               success:
 *                 summary: Usuario creado
 *                 value:
 *                   message: "Usuario Nuevo Registrado"
 *                   UsuarioNuevoDatos:
 *                     Usuario: 1
 *                     Email: "usuariodeprueba@yahoo.com.ar"
 *                     Password: "$2b$10$hashedpassword..."
 *                     Sexo: "F"
 *                     CodigoPostal: "4600"
 *                     Pais: 10
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               datosFaltantes:
 *                 summary: Faltan datos requeridos
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
 *         description: Error del servidor
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