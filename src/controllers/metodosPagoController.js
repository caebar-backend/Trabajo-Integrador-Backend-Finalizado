/**
 * Controlador de Métodos de Pago
 * Los estudiantes deben implementar toda la lógica de negocio para métodos de pago
 */

const { MetodosPagos, sequelize } = require("../models")
const { Op } = require("sequelize")
const chalk = require("chalk")

/**
 * @swagger
 * components:
 *   schemas:
 *     MetodoPago:
 *       type: object
 *       properties:
 *         id_metodo_pago:
 *           type: integer
 *           readOnly: true
 *           example: 1
 *         id_usuario:
 *           type: integer
 *           example: 1
 *         tipo_forma_pago:
 *           type: string
 *           enum: [tarjeta_credito, tarjeta_debito, transferencia_bancaria, mercadopago]
 *           example: "tarjeta_credito"
 *         cbu:
 *           type: string
 *           nullable: true
 *           example: "0123456789012345678901"
 *         banco_codigo:
 *           type: string
 *           nullable: true
 *           example: "007"
 *         nro_tarjeta:
 *           type: string
 *           nullable: true
 *           example: "*********1234"
 *         mes_caduca:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           nullable: true
 *           example: 12
 *         anio_caduca:
 *           type: integer
 *           minimum: 2024
 *           nullable: true
 *           example: 2026
 *         cvc:
 *           type: string
 *           nullable: true
 *           example: "****"
 *         fecha_creacion:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     MetodoPagoInput:
 *       type: object
 *       required:
 *         - id_usuario
 *         - tipo_forma_pago
 *         - fecha_creacion
 *       properties:
 *         id_usuario:
 *           type: integer
 *           example: 1
 *         tipo_forma_pago:
 *           type: string
 *           enum: [tarjeta_credito, tarjeta_debito, transferencia_bancaria, mercadopago]
 *           example: "tarjeta_credito"
 *         cbu:
 *           type: string
 *           nullable: true
 *           example: "0123456789012345678901"
 *         banco_codigo:
 *           type: string
 *           nullable: true
 *           example: "007"
 *         nro_tarjeta:
 *           type: string
 *           nullable: true
 *           example: "4111111111111111"
 *         mes_caduca:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           nullable: true
 *           example: 12
 *         anio_caduca:
 *           type: integer
 *           minimum: 2024
 *           nullable: true
 *           example: 2026
 *         cvc:
 *           type: string
 *           nullable: true
 *           example: "123"
 *         fecha_creacion:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 * 
 *     MetodoPagoResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Método de pago Exitoso"
 *         metodoPagoNuevo:
 *           $ref: '#/components/schemas/MetodoPago'
 * 
 *     MetodoPagoConsulta:
 *       type: object
 *       properties:
 *         id_metodo_pago:
 *           type: integer
 *           example: 1
 *         id_usuario:
 *           type: integer
 *           example: 1
 *         tipo_forma_pago:
 *           type: string
 *           example: "tarjeta_credito"
 *         fecha_creacion:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 */

/**
 * @swagger
 * /api/metodos-pago:
 *   post:
 *     summary: Registrar un nuevo método de pago
 *     description: Registra un nuevo método de pago para un usuario. Los datos sensibles como número de tarjeta y CVC son enmascarados automáticamente.
 *     tags: [Métodos de Pago]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MetodoPagoInput'
 *           examples:
 *             tarjetaCredito:
 *               summary: Tarjeta de crédito
 *               value:
 *                 id_usuario: 1
 *                 tipo_forma_pago: "tarjeta_credito"
 *                 nro_tarjeta: "4111111111111111"
 *                 mes_caduca: 12
 *                 anio_caduca: 2026
 *                 cvc: "123"
 *                 fecha_creacion: "2024-01-15T10:30:00.000Z"
 *             transferenciaBancaria:
 *               summary: Transferencia bancaria
 *               value:
 *                 id_usuario: 1
 *                 tipo_forma_pago: "transferencia_bancaria"
 *                 cbu: "0123456789012345678901"
 *                 banco_codigo: "007"
 *                 fecha_creacion: "2024-01-15T10:30:00.000Z"
 *     responses:
 *       201:
 *         description: Método de pago registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MetodoPagoResponse'
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
 *                     parametrosFaltantes: "Faltan parametros para registrar el método de pago"
 *                     tarjetaInvalida: "El nro_tarjeta debe ser un número"
 *                     metodoExistente: "Ya existe un método de pago para ese usuario con esos parametros"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error al registrar el método de pago, vuelva a intentar más tarde"
 */


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
            cvc: '****',
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


/**
 * @swagger
 * /api/metodos-pago:
 *   get:
 *     summary: Obtener métodos de pago por usuario
 *     description: Retorna todos los métodos de pago registrados para un usuario específico
 *     tags: [Métodos de Pago]
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario para consultar sus métodos de pago
 *         example: 1
 *     responses:
 *       200:
 *         description: Métodos de pago encontrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Métodos de pago encontrados"
 *                 metodosPago:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MetodoPago'
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
 *                     parametroFaltante: "Falta el parametro id_usuario para realizar la búsqueda"
 *                     idInvalido: "El parametro id_usuario debe ser un número"
 *                     sinResultados: "No hay métodos de pago para ese usuario"
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