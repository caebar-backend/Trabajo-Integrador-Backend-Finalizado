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
 *           description: ID único del género
 *         nombre:
 *           type: string
 *           description: Nombre del género musical
 *         descripcion:
 *           type: string
 *           description: Descripción del género musical
 *     NuevoGenero:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Folklore del Artico"
 *         descripcion:
 *           type: string
 *           example: "Género musical inspirado en las regiones árticas"
 *     GeneroResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         generoNuevoDatos:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             descripcion:
 *               type: string
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Géneros
 *   description: Gestión de géneros musicales
 */

/**
 * @swagger
 * /api/v1/generos:
 *   post:
 *     summary: Crear un nuevo género musical
 *     description: Crea un nuevo género musical. El nombre debe ser único.
 *     tags: [Géneros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoGenero'
 *           examples:
 *             ejemploFolklore:
 *               summary: Ejemplo de creación de género
 *               value:
 *                 nombre: "Folklore del Artico"
 *                 descripcion: "Género musical inspirado en las regiones árticas"
 *             ejemploMinimo:
 *               summary: Ejemplo mínimo (solo nombre)
 *               value:
 *                 nombre: "Rock Progresivo"
 *     responses:
 *       201:
 *         description: Género creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneroResponse'
 *             examples:
 *               success:
 *                 summary: Género creado exitosamente
 *                 value:
 *                   message: "Género Nuevo Registrado"
 *                   generoNuevoDatos:
 *                     nombre: "Folklore del Artico"
 *                     descripcion: "Género musical inspirado en las regiones árticas"
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               nombreObligatorio:
 *                 summary: Nombre obligatorio
 *                 value:
 *                   error: "El nombre del género es obligatorio"
 *               generoExistente:
 *                 summary: Género ya existe
 *                 value:
 *                   error: "El nombre del género ya existe, debe elegir otro"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "El servidor no está funcionando, intente más tarde!"
 *               description: "Detalles del error aquí"
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
 * /api/v1/generos:
 *   get:
 *     summary: Obtener todos los géneros musicales
 *     description: Retorna la lista completa de géneros musicales registrados en el sistema
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
 *               generos:
 *                 summary: Lista de géneros
 *                 value:
 *                   - id_genero: 1
 *                     nombre: "Rock"
 *                     descripcion: "Género musical tradicional del rock"
 *                   - id_genero: 2
 *                     nombre: "Pop"
 *                     descripcion: "Música popular"
 *                   - id_genero: 3
 *                     nombre: "Folklore del Artico"
 *                     descripcion: "Género musical inspirado en las regiones árticas"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "El servidor no está funcionando, intente más tarde!"
 *               description: "Detalles del error aquí"
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