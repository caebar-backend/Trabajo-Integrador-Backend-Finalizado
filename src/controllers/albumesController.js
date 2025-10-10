/**
 * Controlador de Álbumes
 * Los estudiantes deben implementar toda la lógica de negocio para álbumes
 */

const chalk = require('chalk')
const { Album, Cancion } = require('../models/index')

/**
 * @swagger
 * components:
 *   schemas:
 *     Album:
 *       type: object
 *       required:
 *         - titulo
 *         - id_artista
 *       properties:
 *         id_album:
 *           type: integer
 *           readOnly: true
 *           example: 1
 *         titulo:
 *           type: string
 *           maxLength: 255
 *           example: "Thriller"
 *         anio_publicacion:
 *           type: integer
 *           minimum: 1900
 *           maximum: 2030
 *           example: 1982
 *         id_discografica:
 *           type: integer
 *           example: 1
 *         id_artista:
 *           type: integer
 *           example: 1
 *         portada_url:
 *           type: string
 *           format: uri
 *           example: "https://ejemplo.com/portada.jpg"
 *         duracion_total:
 *           type: integer
 *           description: Duración total en segundos
 *           example: 3600
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     AlbumInput:
 *       type: object
 *       required:
 *         - titulo
 *         - id_artista
 *       properties:
 *         titulo:
 *           type: string
 *           maxLength: 255
 *           example: "Thriller"
 *         anio_publicacion:
 *           type: integer
 *           minimum: 1900
 *           maximum: 2030
 *           example: 1982
 *         id_discografica:
 *           type: integer
 *           example: 1
 *         id_artista:
 *           type: integer
 *           example: 1
 *         portada_url:
 *           type: string
 *           format: uri
 *           example: "https://ejemplo.com/portada.jpg"
 *         duracion_total:
 *           type: integer
 *           description: Duración total en segundos
 *           example: 3600
 * 
 *     AlbumResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Álbum Nuevo Registrado"
 *         albumNuevoDatos:
 *           type: object
 *           properties:
 *             id_album:
 *               type: integer
 *               example: 1
 *             titulo:
 *               type: string
 *               example: "Thriller"
 *             anio_publicacion:
 *               type: integer
 *               example: 1982
 *             id_discografica:
 *               type: integer
 *               example: 1
 *             id_artista:
 *               type: integer
 *               example: 1
 * 
 *     Cancion:
 *       type: object
 *       properties:
 *         id_cancion:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: "Beat It"
 *         duracion_segundos:
 *           type: integer
 *           example: 258
 *         id_album:
 *           type: integer
 *           example: 1
 *         id_artista:
 *           type: integer
 *           example: 1
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     CancionResponse:
 *       type: object
 *       properties:
 *         id_cancion:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: "Beat It"
 *         duracion_seg:
 *           type: integer
 *           example: 258
 *         id_album:
 *           type: integer
 *           example: 1
 * 
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Mensaje de error descriptivo"
 *         description:
 *           type: string
 *           example: "Detalle técnico del error"
 *         timestamp:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/albumes:
 *   post:
 *     summary: Crear un nuevo álbum
 *     description: Crea un nuevo álbum musical (requiere autenticación JWT)
 *     tags: [Álbumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlbumInput'
 *           examples:
 *             ejemploAlbum:
 *               summary: Ejemplo de creación de álbum
 *               value:
 *                 titulo: "Thriller"
 *                 anio_publicacion: 1982
 *                 id_discografica: 1
 *                 id_artista: 1
 *                 portada_url: "https://ejemplo.com/portada.jpg"
 *                 duracion_total: 3600
 *     responses:
 *       201:
 *         description: Álbum creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlbumResponse'
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
 *                   error: "Faltan datos para la creación del álbum"
 *               albumExistente:
 *                 summary: Álbum ya existe
 *                 value:
 *                   error: "El título del álbum ya existe, debe elegir otro"
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

const crearAlbum = async (req, res) => {
    try{
        const { titulo, anio_publicacion, id_discografica, id_artista,portada_url, duracion_total } = req.body

       //Validacion simple de datos
        if(!titulo || !id_artista){
            res.status(400).json({ error: 'Faltan datos para la creación del álbum'}) 
            console.log(chalk.yellowBright('<----- Faltan datos para la creación del álbum ----->'))
            return;
        }

        const albumExistente = await Album.findOne({ where: { titulo, id_artista } })
        if(albumExistente){
            res.status(400).json({ error: 'El titulo del álbum ya existe, debe elegir otro'}) 
            console.log(chalk.yellowBright('<----- El titulo del álbum ya existe, debe elegir otro ----->'))
            return;
        }

        const albumNuevo = await Album.create({
            titulo,
            anio_publicacion,
            id_discografica,
            id_artista,
            portada_url,
            duracion_total,
        })

        let albumNuevoDatos = {
            id_album: albumNuevo.id_album,
            titulo: albumNuevo.titulo,
            anio_publicacion: albumNuevo.anio_publicacion,
            id_discografica: albumNuevo.id_discografica,
            id_artista: albumNuevo.id_artista,
        }
        
        res.status(201).json({message: 'Álbum Nuevo Registrado', albumNuevoDatos})
        console.log(chalk.greenBright(`<----- Álbum Nuevo Registrado con ID ${albumNuevo.id_album} ----->`))
        console.table(albumNuevoDatos)
        console.log(chalk.greenBright('<----- ------------------->'))
    }

    catch(error){
      res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
             console.log(chalk.redBright('<----- Error al crear artista, servidor no funciona! -----> ' + error.message))
    }
}


/**
 * @swagger
 * /api/albumes:
 *   get:
 *     summary: Obtener todos los álbumes de un artista
 *     description: Retorna una lista de todos los álbumes de un artista específico por su ID
 *     tags: [Álbumes]
 *     parameters:
 *       - in: query
 *         name: artistaId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del artista para filtrar los álbumes
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de álbumes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Album'
 *       400:
 *         description: Falta el ID del artista
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No se encontraron álbumes del artista
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Obtener álbumes de un artista por ID del artista
const getTodosLosAlbumesDeArtista = async (req, res) => {
    try{
        const { artistaId } = req.query
        if(!artistaId){
            res.status(400).json({ error: 'Falta el ID del artista'}) 
            console.log(chalk.yellowBright('<----- Falta el ID del artista ----->'))
            return;
        }
        const albumes = await Album.findAll({ where: { id_artista: artistaId } })

        if(albumes.length === 0){
            res.status(404).json({ error: 'No se encontraron álbumes del artista, controle el ID igresado'}) 
            console.log(chalk.yellowBright('<----- No se encontraron álbumes del artista, controle el ID igresado ----->'))
            return;
        }

        const albumesDatos = albumes.map((datos) => {
            return {
                id_album: datos.id_album,
                titulo: datos.titulo,
                anio_publicacion: datos.anio_publicacion,
                id_discografica: datos.id_discografica,
                id_artista: datos.id_artista,
            }
        })
        res.status(200).json(albumes)
        console.log(chalk.greenBright(`<----- Álbumes encontrados del artista con ID ${artistaId} ----->`))
        console.table(albumesDatos)
        console.log(chalk.greenBright('<----- ------------------->'))
    }
    catch(error){
        res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
        console.log(chalk.redBright('<----- Error al obtener álbumes del artista -----> ' + error.message))
    }
}


/**
 * @swagger
 * /api/albumes/{albumId}/canciones:
 *   get:
 *     summary: Obtener todas las canciones de un álbum
 *     description: Retorna la lista completa de canciones pertenecientes a un álbum específico
 *     tags: [Álbumes]
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del álbum
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de canciones del álbum obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cancion'
 *       400:
 *         description: Falta el ID del álbum
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No se encontraron canciones del álbum
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// TO DO GET {{baseUrl}}/albumes/1/canciones

const getTodasLasCancionesDeUnAlbum = async (req, res) => {
    try{
        const { albumId } = req.params
        if(!albumId){
            res.status(400).json({ error: 'Falta el ID del álbum'}) 
            console.log(chalk.yellowBright('<----- Falta el ID del álbum ----->'))
            return;
        }
        const canciones = await Cancion.findAll({ where: { id_album: albumId } })

        if(canciones.length === 0){
            res.status(404).json({ error: 'No se encontraron canciones del álbum, controle el ID igresado'}) 
            console.log(chalk.yellowBright('<----- No se encontraron canciones del álbum, controle el ID igresado ----->'))
            return;
        }

        const cancionesDatos = canciones.map((datos) => {
            return {
                id_cancion: datos.id_cancion,
                titulo: datos.titulo,
                duracion_seg: datos.duracion_segundos,
                id_album: datos.id_album,
            }
        })
        res.status(200).json(canciones)
        console.log(chalk.greenBright(`<----- Canciones encontrados del álbum con ID ${albumId} ----->`))
        console.table(cancionesDatos)        
        console.log(chalk.greenBright('<----- ------------------->'))
    }
    catch(error){
        res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
        console.log(chalk.redBright('<----- Error al obtener canciones del álbum -----> ' + error.message))
    }
}


module.exports = { crearAlbum, getTodosLosAlbumesDeArtista, getTodasLasCancionesDeUnAlbum }