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
 *           description: ID único del álbum
 *         titulo:
 *           type: string
 *           description: Título del álbum
 *         anio_publicacion:
 *           type: integer
 *           description: Año de publicación del álbum
 *         id_discografica:
 *           type: integer
 *           description: ID de la discográfica
 *         id_artista:
 *           type: integer
 *           description: ID del artista
 *         portada_url:
 *           type: string
 *           description: URL de la portada del álbum
 *         duracion_total:
 *           type: integer
 *           description: Duración total en segundos
 *     Cancion:
 *       type: object
 *       properties:
 *         id_cancion:
 *           type: integer
 *           description: ID único de la canción
 *         titulo:
 *           type: string
 *           description: Título de la canción
 *         duracion_segundos:
 *           type: integer
 *           description: Duración en segundos
 *         id_album:
 *           type: integer
 *           description: ID del álbum al que pertenece
 *     NuevoAlbum:
 *       type: object
 *       required:
 *         - titulo
 *         - id_artista
 *       properties:
 *         titulo:
 *           type: string
 *           example: "El Amor Después Del Amor"
 *         id_artista:
 *           type: integer
 *           example: 8
 *         id_discografica:
 *           type: integer
 *           example: 4
 *         anio_publicacion:
 *           type: integer
 *           example: 1992
 *         portada_url:
 *           type: string
 *           example: "https://ejemplo.com/portada.jpg"
 *         duracion_total:
 *           type: integer
 *           example: 3600
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje de error
 *         description:
 *           type: string
 *           description: Descripción detallada del error
 *     AlbumResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         albumNuevoDatos:
 *           type: object
 *           properties:
 *             id_album:
 *               type: integer
 *             titulo:
 *               type: string
 *             anio_publicacion:
 *               type: integer
 *             id_discografica:
 *               type: integer
 *             id_artista:
 *               type: integer
 */

/**
 * @swagger
 * tags:
 *   name: Álbumes
 *   description: Gestión de álbumes musicales
 */

/**
 * @swagger
 * /api/v1/albumes:
 *   post:
 *     summary: Crear un nuevo álbum
 *     tags: [Álbumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoAlbum'
 *           examples:
 *             ejemploAlbum:
 *               summary: Ejemplo de creación de álbum
 *               value:
 *                 titulo: "El Amor Después Del Amor"
 *                 id_artista: 8
 *                 id_discografica: 4
 *                 anio_publicacion: 1992
 *                 portada_url: "https://ejemplo.com/portada.jpg"
 *                 duracion_total: 3600
 *     responses:
 *       201:
 *         description: Álbum creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlbumResponse'
 *             examples:
 *               success:
 *                 summary: Álbum creado
 *                 value:
 *                   message: "Álbum Nuevo Registrado"
 *                   albumNuevoDatos:
 *                     id_album: 1
 *                     titulo: "El Amor Después Del Amor"
 *                     anio_publicacion: 1992
 *                     id_discografica: 4
 *                     id_artista: 8
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               faltanDatos:
 *                 summary: Faltan datos requeridos
 *                 value:
 *                   error: "Faltan datos para la creación del álbum"
 *               albumExistente:
 *                 summary: Álbum ya existe
 *                 value:
 *                   error: "El titulo del álbum ya existe, debe elegir otro"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Crear Album 
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
 * /api/v1/albumes:
 *   get:
 *     summary: Obtener todos los álbumes de un artista
 *     tags: [Álbumes]
 *     parameters:
 *       - in: query
 *         name: artistaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del artista para filtrar los álbumes
 *         example: 5
 *     responses:
 *       200:
 *         description: Lista de álbumes del artista obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Album'
 *             examples:
 *               albumes:
 *                 summary: Lista de álbumes
 *                 value:
 *                   - id_album: 1
 *                     titulo: "Álbum 1"
 *                     anio_publicacion: 1992
 *                     id_discografica: 4
 *                     id_artista: 5
 *                   - id_album: 2
 *                     titulo: "Álbum 2"
 *                     anio_publicacion: 1995
 *                     id_discografica: 4
 *                     id_artista: 5
 *       400:
 *         description: Falta el ID del artista
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Falta el ID del artista"
 *       404:
 *         description: No se encontraron álbumes del artista
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "No se encontraron álbumes del artista, controle el ID ingresado"
 *       500:
 *         description: Error del servidor
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
 * /api/v1/albumes/{albumId}/canciones:
 *   get:
 *     summary: Obtener todas las canciones de un álbum
 *     tags: [Álbumes]
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: integer
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
 *             examples:
 *               canciones:
 *                 summary: Lista de canciones
 *                 value:
 *                   - id_cancion: 1
 *                     titulo: "Canción 1"
 *                     duracion_segundos: 240
 *                     id_album: 1
 *                   - id_cancion: 2
 *                     titulo: "Canción 2"
 *                     duracion_segundos: 210
 *                     id_album: 1
 *       400:
 *         description: Falta el ID del álbum
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Falta el ID del álbum"
 *       404:
 *         description: No se encontraron canciones del álbum
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "No se encontraron canciones del álbum, controle el ID ingresado"
 *       500:
 *         description: Error del servidor
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