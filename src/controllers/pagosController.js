/**
 * Controlador de Pagos
 * Los estudiantes deben implementar toda la lógica de negocio para pagos
 */

const { Pago, sequelize } = require("../models")
const { Op } = require("sequelize")
const chalk = require("chalk")

//TO DO: Registrar pago (referenciando suscripcion y método de pago válidos)

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

const getListarPagosSolicitados = async (req, res) => {
    try{

// TO DO Listar pagos por usuario y rango
//GET {{baseUrl}}/pagos?usuarioId=1&desde=2025-09-01&hasta=2025-12-31

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