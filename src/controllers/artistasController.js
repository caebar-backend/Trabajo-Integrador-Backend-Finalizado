/**
 * Controlador de Artistas
 * Los estudiantes deben implementar toda la lógica de negocio para artistas
 */

const chalk = require('chalk')
const { Artista, sequelize } = require('../models/index')

/**
 * @swagger
 * components:
 *   schemas:
 *     Artista:
 *       type: object
 *       properties:
 *         id_artista:
 *           type: integer
 *           description: ID único del artista
 *         nombre:
 *           type: string
 *           description: Nombre del artista o banda
 *         imagen_url:
 *           type: string
 *           description: URL de la imagen del artista
 *         biografia:
 *           type: string
 *           description: Biografía del artista
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           description: Fecha de registro del artista
 *     NuevoArtista:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Fito Paez"
 *         imagen_url:
 *           type: string
 *           example: "https://cdn.example.com/fito.jpg"
 *         biografia:
 *           type: string
 *           example: "Cantante, compositor y músico argentino"
 *     ArtistaResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         ArtistaNuevoDatos:
 *           type: object
 *           properties:
 *             id_artista:
 *               type: integer
 *             nombre:
 *               type: string
 *             imagen_url:
 *               type: string
 *             biografia:
 *               type: string
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         description:
 *           type: string
 *         message:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Artistas
 *   description: Gestión de artistas musicales
 */

/**
 * @swagger
 * /api/v1/artistas:
 *   get:
 *     summary: Obtener todos los artistas
 *     tags: [Artistas]
 *     parameters:
 *       - in: header
 *         name: Pedido
 *         required: true
 *         schema:
 *           type: string
 *         description: Header requerido para procesar la solicitud
 *         example: artistas-todos
 *     responses:
 *       200:
 *         description: Lista de artistas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Artista'
 *             examples:
 *               artistas:
 *                 summary: Lista de artistas
 *                 value:
 *                   - id_artista: 1
 *                     nombre: "Fito Paez"
 *                     imagen_url: "https://cdn.example.com/fito.jpg"
 *                     biografia: "Cantante argentino"
 *                     fecha_registro: "2023-01-15T10:30:00.000Z"
 *                   - id_artista: 2
 *                     nombre: "Charly García"
 *                     imagen_url: "https://cdn.example.com/charly.jpg"
 *                     biografia: "Músico y compositor argentino"
 *                     fecha_registro: "2023-01-16T11:00:00.000Z"
 *       400:
 *         description: Header Pedido incorrecto o faltante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Error al obtener artistas"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Error al obtener artistas"
 */


const getTodosLosArtistas = async(req, res) => {
    try{
        if(req.headers['pedido'] === 'artistas-todos'){
            await sequelize.authenticate()
            const artistas = await Artista.findAll()
            const artistasDatos = artistas.map((datos) => {
                return {
                    id_artista: datos.id_artista,
                    nombre: datos.nombre,
                    fecha_registro: datos.fecha_registro,
                }
                })
            res.status(200).json(artistas)
            console.log(chalk.greenBright('<----- Artistas encontrados ----->'))
            console.table(artistasDatos)
            console.log(chalk.greenBright('<----- ------------------->'))
        }else{
            res.status(400).json({message: 'Error al obtener artistas'}, error.message)
            console.log(chalk.redBright('<----- Error al obtener artistas -----> ' + error.message))
        }
        
    }
    catch(error){
        console.log(chalk.redBright('<----- Error al obtener artistas -----> ' + error.message))
        res.status(500).json({message: 'Error al obtener artistas'})
    }
}


/**
 * @swagger
 * /api/v1/artistas:
 *   post:
 *     summary: Crear un nuevo artista
 *     tags: [Artistas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoArtista'
 *           examples:
 *             fitoPaez:
 *               summary: Ejemplo Fito Paez
 *               value:
 *                 nombre: "Fito Paez"
 *                 imagen_url: "https://cdn.example.com/fito.jpg"
 *                 biografia: "Cantante, compositor y músico argentino"
 *             artistaBasico:
 *               summary: Ejemplo mínimo
 *               value:
 *                 nombre: "Artista Nuevo"
 *     responses:
 *       201:
 *         description: Artista creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArtistaResponse'
 *             examples:
 *               success:
 *                 summary: Artista creado
 *                 value:
 *                   message: "Artista Nuevo Registrado"
 *                   ArtistaNuevoDatos:
 *                     id_artista: 1
 *                     nombre: "Fito Paez"
 *                     imagen_url: "https://cdn.example.com/fito.jpg"
 *                     biografia: "Cantante, compositor y músico argentino"
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
 *                   error: "El nombre del artista es obligatorio"
 *               artistaExistente:
 *                 summary: Artista ya existe
 *                 value:
 *                   error: "El nombre del artista ya existe, debe elegir otro"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "El servidor no está funcionando, intente más tarde!"
 *               description: "Error details here"
 */

const crearArtista = async (req, res) => {
    try{
        const { nombre, imagen_url, biografia } = req.body
        // Validacion básica de datos
        if(!nombre){
           res.status(400).json({ error: 'El nombre del artista es obligatorio'}) 
           console.log(chalk.yellowBright('<----- El nombre del artista es obligatorio ----->'))
           return;
        
        }
        
        const ArtistaNombreExistente = await Artista.findOne({ where: { nombre } })
        if(ArtistaNombreExistente){
            res.status(400).json({ error: 'El nombre del artista ya existe, debe elegir otro'}) 
            console.log(chalk.yellowBright('<----- El nombre del artista ya existe, debe elegir otro ----->'))
            return;
        }
        
        const ArtistaNuevo = await Artista.create({
            nombre,
            imagen_url,
            biografia,
            fecha_registro: new Date(),
        })

        let ArtistaNuevoDatos = {
            id_artista: ArtistaNuevo.id_artista,
            nombre: ArtistaNuevo.nombre,
            imagen_url: ArtistaNuevo.imagen_url,
            biografia: ArtistaNuevo.biografia,
        }
        res.status(201).json({message: 'Artista Nuevo Registrado', ArtistaNuevoDatos})
        console.log(chalk.greenBright(`<----- Artista Nuevo Registrado con ID ${ArtistaNuevo.id_artista} ----->`))
        console.table(ArtistaNuevoDatos)
        console.log(chalk.greenBright('<----- ------------------->'))
        
      }
    catch(error){
        res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
        console.log(chalk.redBright('<----- Error al crear artista, servidor no funciona! -----> ' + error.message))
    }
}

module.exports = { getTodosLosArtistas, crearArtista }