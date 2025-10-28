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
 *           description: ID único del método de pago
 *         id_usuario:
 *           type: integer
 *           description: ID del usuario dueño del método de pago
 *         tipo_forma_pago:
 *           type: string
 *           description: Tipo de método de pago (ej. Tarjeta de crédito, Débito, etc.)
 *         nro_tarjeta:
 *           type: string
 *           description: Número de tarjeta enmascarado (últimos 4 dígitos visibles)
 *         mes_caduca:
 *           type: integer
 *           description: Mes de caducidad de la tarjeta
 *         anio_caduca:
 *           type: integer
 *           description: Año de caducidad de la tarjeta
 *         cvc:
 *           type: string
 *           description: Código CVC enmascarado
 *         fecha_creacion:
 *           type: string
 *           format: date
 *           description: Fecha de creación del método de pago
 *         cbu:
 *           type: string
 *           description: Clave Bancaria Uniforme (para transferencias)
 *         banco_codigo:
 *           type: string
 *           description: Código del banco
 *     NuevoMetodoPago:
 *       type: object
 *       required:
 *         - id_usuario
 *         - tipo_forma_pago
 *         - fecha_creacion
 *       properties:
 *         id_usuario:
 *           type: integer
 *           example: 14
 *         tipo_forma_pago:
 *           type: string
 *           example: "Tarjeta de crédito"
 *         nro_tarjeta:
 *           type: string
 *           description: Número completo de tarjeta (se enmascara automáticamente)
 *           example: "4519000000001234"
 *         mes_caduca:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 12
 *         anio_caduca:
 *           type: integer
 *           example: 2027
 *         cvc:
 *           type: string
 *           description: Código CVC (se enmascara automáticamente)
 *           example: "123"
 *         fecha_creacion:
 *           type: string
 *           format: date
 *           example: "2025-12-09"
 *         cbu:
 *           type: string
 *           example: "1234567890123456789012"
 *         banco_codigo:
 *           type: string
 *           example: "007"
 *     MetodoPagoResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         metodoPagoNuevo:
 *           $ref: '#/components/schemas/MetodoPago'
 *     MetodosPagoListaResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         metodosPago:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MetodoPago'
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
 *   name: Métodos de Pago
 *   description: Gestión de métodos de pago de usuarios (tarjetas, transferencias, etc.)
 */

/**
 * @swagger
 * /api/v1/metodos-pago:
 *   post:
 *     summary: Registrar un nuevo método de pago
 *     description: |
 *       Crea un nuevo método de pago para un usuario. 
 *       **Características de seguridad:**
 *       - El número de tarjeta se enmascara automáticamente (solo últimos 4 dígitos visibles)
 *       - El código CVC se reemplaza por "****"
 *       - Valida duplicados por usuario y fecha
 *     tags: [Métodos de Pago]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoMetodoPago'
 *           examples:
 *             tarjetaCredito:
 *               summary: Tarjeta de crédito
 *               value:
 *                 id_usuario: 14
 *                 tipo_forma_pago: "Tarjeta de crédito"
 *                 nro_tarjeta: "4519000000001234"
 *                 mes_caduca: 12
 *                 anio_caduca: 2027
 *                 cvc: "123"
 *                 fecha_creacion: "2025-12-09"
 *             transferencia:
 *               summary: Transferencia bancaria
 *               value:
 *                 id_usuario: 14
 *                 tipo_forma_pago: "Transferencia bancaria"
 *                 cbu: "1234567890123456789012"
 *                 banco_codigo: "007"
 *                 fecha_creacion: "2025-12-09"
 *     responses:
 *       201:
 *         description: Método de pago registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MetodoPagoResponse'
 *             examples:
 *               success:
 *                 summary: Método de pago creado
 *                 value:
 *                   message: "Método de pago Exitoso"
 *                   metodoPagoNuevo:
 *                     id_metodo_pago: 1
 *                     id_usuario: 14
 *                     tipo_forma_pago: "Tarjeta de crédito"
 *                     nro_tarjeta: "*********1234"
 *                     mes_caduca: 12
 *                     anio_caduca: 2027
 *                     cvc: "****"
 *                     fecha_creacion: "2025-12-09"
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
 *                   mensaje: "Faltan parametros para registrar el método de pago"
 *               numeroTarjetaInvalido:
 *                 summary: Número de tarjeta inválido
 *                 value:
 *                   mensaje: "El nro_tarjeta debe ser un número"
 *               metodoPagoDuplicado:
 *                 summary: Método de pago duplicado
 *                 value:
 *                   mensaje: "Ya existe un método de pago para ese usuario con esos parametros"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               mensaje: "Error al registrar el método de pago, vuelva a intentar más tarde"
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
 * /api/v1/metodos-pago:
 *   get:
 *     summary: Obtener métodos de pago por usuario
 *     description: Retorna todos los métodos de pago registrados por un usuario específico
 *     tags: [Métodos de Pago]
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario para filtrar los métodos de pago
 *         example: 14
 *     responses:
 *       200:
 *         description: Métodos de pago encontrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MetodosPagoListaResponse'
 *             examples:
 *               success:
 *                 summary: Métodos de pago encontrados
 *                 value:
 *                   message: "Métodos de pago encontrados"
 *                   metodosPago:
 *                     - id_metodo_pago: 1
 *                       id_usuario: 14
 *                       tipo_forma_pago: "Tarjeta de crédito"
 *                       nro_tarjeta: "*********1234"
 *                       mes_caduca: 12
 *                       anio_caduca: 2027
 *                       cvc: "****"
 *                       fecha_creacion: "2025-12-09"
 *                     - id_metodo_pago: 2
 *                       id_usuario: 14
 *                       tipo_forma_pago: "Transferencia bancaria"
 *                       cbu: "1234567890123456789012"
 *                       banco_codigo: "007"
 *                       fecha_creacion: "2025-12-10"
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
 *                   mensaje: "Falta el parametro id_usuario para realizar la búsqueda"
 *               usuarioIdInvalido:
 *                 summary: usuarioId no es un número
 *                 value:
 *                   mensaje: "El parametro id_usuario debe ser un número"
 *               noHayMetodos:
 *                 summary: No hay métodos de pago
 *                 value:
 *                   mensaje: "No hay métodos de pago para ese usuario"
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