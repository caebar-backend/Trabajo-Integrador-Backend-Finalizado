/**
 * Controlador de Métodos de Pago
 * Los estudiantes deben implementar toda la lógica de negocio para métodos de pago
 */

const { MetodosPagos, sequelize } = require("../models")
const { Op } = require("sequelize")
const chalk = require("chalk")
// const creditCard = require("creditcard")

const postRegistrarMetodoPago = async (req, res) => {
    try{
        const { id_usuario, tipo_forma_pago, cbu, 
            banco_codigo, nro_tarjeta, mes_caduca, 
            anio_caduca, cvc, fecha_creacion } = req.body

        if(!id_usuario || !tipo_forma_pago || !fecha_creacion){
            console.log(chalk.red("Faltan parametros para registrar el método de pago"))
            res.status(400).json({ mensaje: "Faltan parametros para registrar el método de pago" })
            return
        }

        let numeroTarjetaTapado

        if(nro_tarjeta.length > 8){
         const numeroTarjeta = parseInt(nro_tarjeta)

           if(isNaN(numeroTarjeta)){
             console.log(chalk.red("El nro_tarjeta debe ser un número"))
             res.status(400).json({ mensaje: "El nro_tarjeta debe ser un número" })
             return
            }

         numeroTarjetaTapado = '*********' + numeroTarjeta.toString().slice(-4)
        
        }


    
        const fechaActual = new Date()

        const metodoPagoRealizado = await MetodosPagos.findAll({ where: { id_usuario, fecha_creacion: { [Op.gte]: fechaActual } } })
        if(metodoPagoRealizado.length > 0){
            console.log(chalk.red("Ya existe un método de pago para ese usuario con esos parametros"))
            res.status(400).json({ mensaje: "Ya existe un método de pago para ese usuario con esos parametros" })
            return;
        }

        const metodoPagoNuevo = await MetodosPagos.create({
            id_usuario,
            tipo_forma_pago,
            cbu,
            banco_codigo,
            nro_tarjeta: numeroTarjetaTapado,
            mes_caduca,
            anio_caduca,
            cvc,
            fecha_creacion
        })

        const metodoPagoNuevoConsole = {
            id_usuario: metodoPagoNuevo.id_usuario,
            tipo_forma_pago: metodoPagoNuevo.tipo_forma_pago,
            fecha_creacion: metodoPagoNuevo.fecha_creacion,
        }

        res.status(201).json({message: "Método de pago Exitoso", metodoPagoNuevo})
        console.log(chalk.green(" <-------------- Método de pago Exitoso -----------> "))
        console.table(metodoPagoNuevoConsole)
        console.log(chalk.green(" <-------------- -----------> "))

        
    }
    catch(error){
        console.log(chalk.red("Error al registrar el método de pago, intente más tarde: ", error.message))
        res.status(500).json({mensaje: "Error al registrar el método de pago, vuelva a intentar más tarde"})
    }
}


const getPorUsuarioId = async (req, res) => {
    try{
        const { usuarioId } = req.query

        if(!usuarioId){
            console.log(chalk.red("Falta el parametro id_usuario para realizar la búsqueda"))
            res.status(400).json({ mensaje: "Falta el parametro id_usuario para realizar la búsqueda" })
            return
        }

        const id_usuario = parseInt(usuarioId)

        if(isNaN(id_usuario)){
            console.log(chalk.red("El parametro id_usuario debe ser un número"))
            res.status(400).json({ mensaje: "El parametro id_usuario debe ser un número" })
            return
        }

        const metodosPago = await MetodosPagos.findAll({ where: { id_usuario } })

        if(metodosPago.length === 0){
            console.log(chalk.red("No hay métodos de pago para ese usuario"))
            res.status(400).json({ mensaje: "No hay métodos de pago para ese usuario" })
            return
        }

       
        const metodosPagoEncontrados = metodosPago.map(metodo => {
            return {
                id_metodo_pago: metodo.id_metodo_pago,
                id_usuario: metodo.id_usuario,
                tipo_forma_pago: metodo.tipo_forma_pago,
                fecha_creacion: metodo.fecha_creacion,
            }
        })
        console.log(chalk.green(`✅ Se encontraron ${metodosPago.length} métodos de pago para el usuario ${id_usuario}`))
         console.table(metodosPagoEncontrados)
        res.status(200).json({ message: "Métodos de pago encontrados", metodosPago })
    }
    catch(error){
        console.log(chalk.red(' Error en getPorUsuarioId:'), error.message)
        res.status(500).json({ error: 'Error interno del servidor', detalle: error.message })
    }
}
module.exports = { postRegistrarMetodoPago, getPorUsuarioId }