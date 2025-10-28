/**
 * Controlador de Pagos
 * Los estudiantes deben implementar toda la lógica de negocio para pagos
 */

const { Pago, sequelize } = require("../models")
const { Op } = require("sequelize")
const chalk = require("chalk")

//TO DO: Registrar pago (referenciando suscripcion y método de pago válidos)

/**
 * @swagger
 * components:
 *   schemas:
 *     Pago:
 *       type: object
 *       properties:
 *         id_pago:
 *           type: integer
 *           description: ID único del pago
 *         id_usuario:
 *           type: integer
 *           description: ID del usuario que realiza el pago
 *         id_suscripcion:
 *           type: integer
 *           description: ID de la suscripción asociada al pago
 *         monto:
 *           type: number
 *           format: float
 *           description: Monto del pago
 *         fecha_pago:
 *           type: string
 *           format: date
 *           description: Fecha en que se realizó el pago
 *         metodo_pago:
 *           type: string
 *           description: Método de pago utilizado
 *         estado:
 *           type: string
 *           description: Estado del pago
 *     NuevoPago:
 *       type: object
 *       required:
 *         - id_usuario
 *         - id_suscripcion
 *         - metodo_pago
 *         - monto
 *         - fecha_pago
 *       properties:
 *         id_usuario:
 *           type: integer
 *           example: 14
 *         id_suscripcion:
 *           type: integer
 *           example: 2
 *         metodo_pago:
 *           type: string
 *           example: "Tarjeta Debito"
 *         monto:
 *           type: number
 *           format: float
 *           example: 100
 *         fecha_pago:
 *           type: string
 *           format: date
 *           example: "2025-12-09"
 *         estado:
 *           type: string
 *           example: "Pagado"
 *     PagoResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         pagoNuevo:
 *           $ref: '#/components/schemas/Pago'
 *     ListaPagosResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         total:
 *           type: integer
 *         usuarioId:
 *           type: integer
 *         rango:
 *           type: object
 *           properties:
 *             desde:
 *               type: string
 *               format: date
 *             hasta:
 *               type: string
 *               format: date
 *         datos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Pago'
 *     Error:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *         error:
 *           type: string
 *         detalle:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Gestión de pagos de suscripciones
 */

/**
 * @swagger
 * /api/v1/pagos:
 *   post:
 *     summary: Registrar un nuevo pago
 *     description: |
 *       Registra un nuevo pago asociado a una suscripción y usuario.
 *       **Validaciones:**
 *       - Fecha de pago no puede ser anterior a la fecha actual
 *       - Previene duplicados por usuario, suscripción, método y fecha
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoPago'
 *           examples:
 *             pagoCompleto:
 *               summary: Pago completo con estado
 *               value:
 *                 id_suscripcion: 2
 *                 monto: 100
 *                 fecha_pago: "2025-12-09"
 *                 metodo_pago: "Tarjeta Debito"
 *                 estado: "Pagado"
 *                 id_usuario: 14
 *             pagoMinimo:
 *               summary: Pago mínimo (sin estado)
 *               value:
 *                 id_suscripcion: 2
 *                 monto: 100
 *                 fecha_pago: "2025-12-09"
 *                 metodo_pago: "Tarjeta Credito"
 *                 id_usuario: 14
 *     responses:
 *       201:
 *         description: Pago registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PagoResponse'
 *             examples:
 *               success:
 *                 summary: Pago creado exitosamente
 *                 value:
 *                   message: "Pago Exitoso"
 *                   pagoNuevo:
 *                     id_pago: 1
 *                     id_suscripcion: 2
 *                     monto: 100
 *                     fecha_pago: "2025-12-09"
 *                     metodo_pago: "Tarjeta Debito"
 *                     estado: "Pagado"
 *                     id_usuario: 14
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               parametrosFaltantes:
 *                 summary: Faltan parámetros requeridos
 *                 value:
 *                   mensaje: "Faltan parametros para registrar el pago"
 *               fechaAnterior:
 *                 summary: Fecha de pago anterior a la actual
 *                 value:
 *                   mensaje: "La fecha de pago no puede ser anterior a la fecha actual"
 *               pagoDuplicado:
 *                 summary: Pago duplicado
 *                 value:
 *                   mensaje: "Ya existe un pago para ese usuario con esos parametros"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               mensaje: "Error al registrar el pago, vuelva a intentar más tarde"
 */

const postRegistrarPago = async (req, res) => {
    try{
     const { id_usuario, id_suscripcion, metodo_pago, monto, fecha_pago, estado } = req.body
     
     if(!id_usuario || !id_suscripcion || !metodo_pago || !monto || !fecha_pago){
         console.log(chalk.red("Faltan parametros para registrar el pago"))
         res.status(400).json({ mensaje: "Faltan parametros para registrar el pago" })
         return
     }
       
       const fechaActual = new Date()

       const fechaPago = new Date(fecha_pago)
        fechaPago.setHours(0, 0, 0, 0) // Normalizar a medianoche

     if (fechaPago < fechaActual) {
         console.log(chalk.red("La fecha de pago no puede ser anterior a la fecha actual"));
         res.status(400).json({ mensaje: "La fecha de pago no puede ser anterior a la fecha actual" });
         return;
     }

     const pagoExistente = await Pago.findOne({ 
         where: { 
             id_usuario, 
             id_suscripcion,
             metodo_pago,
             fecha_pago: new Date(fecha_pago), // Usar fecha original
         } 
     })

     if(pagoExistente){
         console.log(chalk.red("Ya existe un pago para ese usuario con esos parametros"))
         res.status(400).json({ mensaje: "Ya existe un pago para ese usuario con esos parametros" })
         return;
     }
     
     const pagoNuevo = await Pago.create({
        id_suscripcion,
        monto,
        fecha_pago: new Date(fecha_pago),
        metodo_pago,
        estado,
        id_usuario
    })

     const pagoNuevoConsole = {
         id_pago: pagoNuevo.id_pago,
         id_suscripcion: pagoNuevo.id_suscripcion,
         monto: pagoNuevo.monto,
         fecha_pago: pagoNuevo.fecha_pago,
         metodo_pago: pagoNuevo.metodo_pago,
         estado: pagoNuevo.estado,
         id_usuario: pagoNuevo.id_usuario,
     }

     res.status(201).json({message: "Pago Exitoso", pagoNuevo})
     console.log(chalk.green(" <-------------- Pago Exitoso -----------> "))
     console.table(pagoNuevoConsole)
     console.log(chalk.green(" <-------------- -----------> "))
    
} catch(error){
   console.log(chalk.red("Error al registrar el pago, intente más tarde: ", error.message))
   res.status(500).json({mensaje: "Error al registrar el pago, vuelva a intentar más tarde"})
}

}

/**
 * @swagger
 * /api/v1/pagos:
 *   get:
 *     summary: Listar pagos por usuario y rango de fechas
 *     description: Retorna todos los pagos de un usuario dentro de un rango de fechas específico
 *     tags: [Pagos]
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario para filtrar los pagos
 *         example: 1
 *       - in: query
 *         name: desde
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del rango (YYYY-MM-DD)
 *         example: "2020-01-01"
 *       - in: query
 *         name: hasta
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del rango (YYYY-MM-DD)
 *         example: "2025-12-31"
 *     responses:
 *       200:
 *         description: Pagos encontrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListaPagosResponse'
 *             examples:
 *               success:
 *                 summary: Pagos encontrados
 *                 value:
 *                   success: true
 *                   total: 3
 *                   usuarioId: 1
 *                   rango:
 *                     desde: "2020-01-01"
 *                     hasta: "2025-12-31"
 *                   datos:
 *                     - id_pago: 1
 *                       id_suscripcion: 2
 *                       monto: 100
 *                       fecha_pago: "2023-05-15"
 *                       metodo_pago: "Tarjeta Debito"
 *                       estado: "Pagado"
 *                       id_usuario: 1
 *                     - id_pago: 2
 *                       id_suscripcion: 2
 *                       monto: 100
 *                       fecha_pago: "2023-06-15"
 *                       metodo_pago: "Tarjeta Credito"
 *                       estado: "Pagado"
 *                       id_usuario: 1
 *       400:
 *         description: Error en los parámetros de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               usuarioIdFaltante:
 *                 summary: Falta el parámetro usuarioId
 *                 value:
 *                   mensaje: "Falta el parametro usuarioId para realizar la búsqueda"
 *               fechasFaltantes:
 *                 summary: Faltan parámetros de fecha
 *                 value:
 *                   mensaje: "Faltan parámetros desde y hasta para realizar la búsqueda"
 *               usuarioIdInvalido:
 *                 summary: usuarioId no es un número
 *                 value:
 *                   mensaje: "El parámetro usuarioId debe ser un número"
 *               fechaInvalida:
 *                 summary: Formato de fecha inválido
 *                 value:
 *                   mensaje: "Formato de fecha inválido"
 *               rangoInvalido:
 *                 summary: Rango de fechas inválido
 *                 value:
 *                   mensaje: "La fecha de inicio no puede ser posterior a la fecha de fin"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Error interno del servidor"
 *               detalle: "Detalles del error aquí"
 */

const getListarPagosSolicitados = async (req, res) => {
    try{

const { usuarioId, desde, hasta } = req.query

if(!usuarioId){
    console.log(chalk.red("Falta el parametro usuarioId para realizar la búsqueda"))
    res.status(400).json({ mensaje: "Falta el parametro usuarioId para realizar la búsqueda" })
    return
}

if(!desde || !hasta){
    console.log(chalk.red("Faltan parámetros desde y hasta para realizar la búsqueda"))
    res.status(400).json({ mensaje: "Faltan parámetros desde y hasta para realizar la búsqueda" })
    return
}



const userId = parseInt(usuarioId)

if(isNaN(userId)){
    console.log(chalk.red("El parámetro usuarioId debe ser un número"))
    res.status(400).json({ mensaje: "El parámetro usuarioId debe ser un número" })
    return
}

const fechaDesde = desde ? new Date(desde) : null
const fechaHasta = hasta ? new Date(hasta) : null

if(isNaN(fechaDesde.getTime()) || isNaN(fechaHasta.getTime())){
    console.log(chalk.red("Formato de fecha inválido"))
    res.status(400).json({ mensaje: "Formato de fecha inválido" })
    return
}

if(fechaDesde.getTime() > fechaHasta.getTime()){
    console.log(chalk.red("La fecha de inicio no puede ser posterior a la fecha de fin"))
    res.status(400).json({ mensaje: "La fecha de inicio no puede ser posterior a la fecha de fin" })
    return;
}

 // Consulta a la base de datos
        const pagos = await Pago.findAll({
            where: {
                id_usuario: userId,
                fecha_pago: {
                    [Op.between]: [fechaDesde, fechaHasta]
                }
            },
            order: [['fecha_pago', 'ASC']]
        })

        const pagosEncontrados = pagos.map(pago => {
            return {
                id_pago: pago.id_pago,
                monto: pago.monto,
                fecha_pago: pago.fecha_pago,
                metodo_pago: pago.metodo_pago,
                id_usuario: pago.id_usuario
            }
        })
       
       console.log(chalk.green('<--------------- Pagos encontrados --------------->'))
       console.log(chalk.green(` Se encontraron ${pagos.length} pagos para el usuario ${userId}`))
       console.table(pagosEncontrados)
       console.log(chalk.green('<--------------- --------------->'))
       res.status(200).json({ success: true, total: pagos.length, usuarioId: userId, rango: { desde: desde, hasta: hasta }, datos: pagos })


    }
    catch(error){
        console.log(chalk.red(' Error en listarPagosPorUsuarioYRango:'), error.message)
        res.status(500).json({ error: 'Error interno del servidor', detalle: error.message })
    }
}



module.exports = { postRegistrarPago, getListarPagosSolicitados }