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
 *           readOnly: true
 *           example: 1
 *         id_usuario:
 *           type: integer
 *           example: 1
 *         id_suscripcion:
 *           type: integer
 *           example: 1
 *         metodo_pago:
 *           type: string
 *           enum: [tarjeta_credito, tarjeta_debito, transferencia_bancaria, mercadopago]
 *           example: "tarjeta_credito"
 *         monto:
 *           type: number
 *           format: float
 *           minimum: 0.01
 *           example: 9.99
 *         fecha_pago:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         estado:
 *           type: string
 *           enum: [pendiente, completado, fallido, rechazado]
 *           example: "completado"
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     PagoInput:
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
 *           example: 1
 *         id_suscripcion:
 *           type: integer
 *           example: 1
 *         metodo_pago:
 *           type: string
 *           enum: [tarjeta_credito, tarjeta_debito, transferencia_bancaria, mercadopago]
 *           example: "tarjeta_credito"
 *         monto:
 *           type: number
 *           format: float
 *           minimum: 0.01
 *           example: 9.99
 *         fecha_pago:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 *         estado:
 *           type: string
 *           enum: [pendiente, completado, fallido, rechazado]
 *           default: "completado"
 *           example: "completado"
 * 
 *     PagoResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Pago Exitoso"
 *         pagoNuevo:
 *           $ref: '#/components/schemas/Pago'
 * 
 *     PagoConsulta:
 *       type: object
 *       properties:
 *         id_pago:
 *           type: integer
 *           example: 1
 *         monto:
 *           type: number
 *           example: 9.99
 *         fecha_pago:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         metodo_pago:
 *           type: string
 *           example: "tarjeta_credito"
 *         id_usuario:
 *           type: integer
 *           example: 1
 * 
 *     PagosRangoResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         total:
 *           type: integer
 *           example: 5
 *         usuarioId:
 *           type: integer
 *           example: 1
 *         rango:
 *           type: object
 *           properties:
 *             desde:
 *               type: string
 *               example: "2024-01-01"
 *             hasta:
 *               type: string
 *               example: "2024-12-31"
 *         datos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Pago'
 */

/**
 * @swagger
 * /api/pagos:
 *   post:
 *     summary: Registrar un nuevo pago
 *     description: Registra un nuevo pago asociado a una suscripción y método de pago válidos. Valida que la fecha de pago no sea anterior a la fecha actual.
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PagoInput'
 *           examples:
 *             pagoCompletado:
 *               summary: Pago exitoso
 *               value:
 *                 id_usuario: 1
 *                 id_suscripcion: 1
 *                 metodo_pago: "tarjeta_credito"
 *                 monto: 9.99
 *                 fecha_pago: "2024-01-15"
 *                 estado: "completado"
 *             pagoPendiente:
 *               summary: Pago pendiente
 *               value:
 *                 id_usuario: 2
 *                 id_suscripcion: 2
 *                 metodo_pago: "mercadopago"
 *                 monto: 4.99
 *                 fecha_pago: "2024-01-15"
 *                 estado: "pendiente"
 *     responses:
 *       201:
 *         description: Pago registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PagoResponse'
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   examples:
 *                     parametrosFaltantes: "Faltan parametros para registrar el pago"
 *                     fechaAnterior: "La fecha de pago no puede ser anterior a la fecha actual"
 *                     pagoExistente: "Ya existe un pago para ese usuario con esos parametros"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error al registrar el pago, vuelva a intentar más tarde"
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
 * /api/pagos:
 *   get:
 *     summary: Listar pagos por usuario y rango de fechas
 *     description: Retorna todos los pagos de un usuario específico dentro de un rango de fechas determinado
 *     tags: [Pagos]
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario para consultar sus pagos
 *         example: 1
 *       - in: query
 *         name: desde
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del rango (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: query
 *         name: hasta
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del rango (YYYY-MM-DD)
 *         example: "2024-12-31"
 *     responses:
 *       200:
 *         description: Pagos encontrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PagosRangoResponse'
 *       400:
 *         description: Error en los parámetros de consulta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   examples:
 *                     usuarioFaltante: "Falta el parametro usuarioId para realizar la búsqueda"
 *                     fechasFaltantes: "Faltan parámetros desde y hasta para realizar la búsqueda"
 *                     idInvalido: "El parámetro usuarioId debe ser un número"
 *                     fechaInvalida: "Formato de fecha inválido"
 *                     rangoInvalido: "La fecha de inicio no puede ser posterior a la fecha de fin"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 *                 detalle:
 *                   type: string
 *                   example: "Detalle técnico del error"
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