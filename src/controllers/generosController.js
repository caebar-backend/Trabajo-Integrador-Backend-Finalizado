/**
 * Controlador de Géneros
 * Los estudiantes deben implementar toda la lógica de negocio para géneros
 */


//TO DO - Crear género
const { Genero, sequelize } = require('../models/index')
const chalk = require('chalk')

/**
 * @swagger
 * components:
 *   schemas:
 *     Genero:
 *       type: object
 *       properties:
 *         id_genero:
 *           type: integer
 *           readOnly: true
 *           example: 1
 *         nombre:
 *           type: string
 *           maxLength: 255
 *           example: "Rock"
 *         descripcion:
 *           type: string
 *           nullable: true
 *           example: "Género musical que combina ritmos fuertes con guitarras eléctricas"
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     GeneroInput:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           maxLength: 255
 *           example: "Rock"
 *         descripcion:
 *           type: string
 *           nullable: true
 *           example: "Género musical que combina ritmos fuertes con guitarras eléctricas"
 * 
 *     GeneroResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Género Nuevo Registrado"
 *         generoNuevoDatos:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               example: "Rock"
 *             descripcion:
 *               type: string
 *               example: "Género musical que combina ritmos fuertes con guitarras eléctricas"
 * 
 *     GeneroDatos:
 *       type: object
 *       properties:
 *         id_genero:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Rock"
 *         descripcion:
 *           type: string
 *           example: "Género musical que combina ritmos fuertes con guitarras eléctricas"
 */

/**
 * @swagger
 * /api/generos:
 *   post:
 *     summary: Crear un nuevo género musical
 *     description: Registra un nuevo género musical en la plataforma
 *     tags: [Géneros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeneroInput'
 *           examples:
 *             rock:
 *               summary: Género Rock
 *               value:
 *                 nombre: "Rock"
 *                 descripcion: "Género musical que combina ritmos fuertes con guitarras eléctricas"
 *             pop:
 *               summary: Género Pop
 *               value:
 *                 nombre: "Pop"
 *                 descripcion: "Música popular comercial orientada al gran público"
 *             jazz:
 *               summary: Género Jazz
 *               value:
 *                 nombre: "Jazz"
 *                 descripcion: "Género musical originario de Estados Unidos con improvisación"
 *     responses:
 *       201:
 *         description: Género creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneroResponse'
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               nombreFaltante:
 *                 summary: Falta el nombre del género
 *                 value:
 *                   error: "El nombre del género es obligatorio"
 *               generoExistente:
 *                 summary: Género ya existe
 *                 value:
 *                   error: "El nombre del género ya existe, debe elegir otro"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

const crearGenero = async (req, res) => {

    try{
        const { nombre, descripcion } = req.body
        if(!nombre){
            res.status(400).json({ error: 'El nombre del género es obligatorio'}) 
            console.log(chalk.yellowBright('<----- El nombre del género es obligatorio ----->'))
            return;
        
        }
        const generoExistente = await Genero.findOne({ where: { nombre } })
        if(generoExistente){
            res.status(400).json({ error: 'El nombre del género ya existe, debe elegir otro'}) 
            console.log(chalk.yellowBright('<----- El nombre del género ya existe, debe elegir otro ----->'))
            return;
        }

        const nuevoGenero = await Genero.create({
            nombre,
            descripcion,
        })

        let generoNuevoDatos = {
            nombre: nuevoGenero.nombre,
            descripcion: nuevoGenero.descripcion,
        }
        console.log(chalk.greenBright(`<----- Género Nuevo Registrado ----->`))
        console.table(generoNuevoDatos)
        console.log(chalk.greenBright('<----- ------------------->'))
        res.status(201).json({message: 'Género Nuevo Registrado', generoNuevoDatos})
        
        }
    catch(error){
        res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
        console.log(chalk.redBright('<----- Error al crear género, servidor no funciona! -----> ' + error.message))
    }

}

/**
 * @swagger
 * /api/generos:
 *   get:
 *     summary: Obtener todos los géneros musicales
 *     description: Retorna una lista completa de todos los géneros musicales registrados en la plataforma
 *     tags: [Géneros]
 *     responses:
 *       200:
 *         description: Lista de géneros obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genero'
 *             examples:
 *               listaGeneros:
 *                 summary: Lista de géneros musicales
 *                 value:
 *                   - id_genero: 1
 *                     nombre: "Rock"
 *                     descripcion: "Género musical que combina ritmos fuertes con guitarras eléctricas"
 *                     created_at: "2024-01-15T10:30:00.000Z"
 *                     updated_at: "2024-01-15T10:30:00.000Z"
 *                   - id_genero: 2
 *                     nombre: "Pop"
 *                     descripcion: "Música popular comercial orientada al gran público"
 *                     created_at: "2024-01-15T10:30:00.000Z"
 *                     updated_at: "2024-01-15T10:30:00.000Z"
 *                   - id_genero: 3
 *                     nombre: "Jazz"
 *                     descripcion: "Género musical originario de Estados Unidos con improvisación"
 *                     created_at: "2024-01-15T10:30:00.000Z"
 *                     updated_at: "2024-01-15T10:30:00.000Z"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

const getTodosLosGeneros = async (req, res) => {
    try{
        const losGeneros = await Genero.findAll()
        const losGenerosDatos = losGeneros.map((datos) => {
            return {
                id_genero: datos.id_genero,
                nombre: datos.nombre,
                descripcion: datos.descripcion,
            }
        })
        res.status(200).json(losGeneros)
        console.log(chalk.greenBright(`<----- Géneros encontrados ----->`))
        console.table(losGenerosDatos)
        console.log(chalk.greenBright('<----- ------------------->'))
    }
    catch(error){
        res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
        console.log(chalk.redBright('<----- Error al obtener géneros -----> ' + error.message))
    }
}

module.exports = { crearGenero, getTodosLosGeneros }