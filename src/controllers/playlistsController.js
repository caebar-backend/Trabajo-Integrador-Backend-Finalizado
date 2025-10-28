/**
 * Controlador de Playlists
 * Los estudiantes deben implementar toda la lógica de negocio para playlists
 */

const chalk = require('chalk')
const { Playlist, Cancion, PlaylistsCanciones, sequelize } = require('../models/index')


/**
 * @swagger
 * components:
 *   schemas:
 *     Playlist:
 *       type: object
 *       properties:
 *         id_playlist:
 *           type: integer
 *           description: ID único de la playlist
 *         titulo:
 *           type: string
 *           description: Título de la playlist
 *         id_usuario:
 *           type: integer
 *           description: ID del usuario dueño de la playlist
 *         fecha_creacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la playlist
 *         fecha_eliminacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de eliminación (soft delete)
 *         activa:
 *           type: integer
 *           description: Estado activo/inactivo de la playlist
 *         estado:
 *           type: string
 *           description: Estado descriptivo de la playlist
 *         numero_canciones:
 *           type: integer
 *           description: Número de canciones en la playlist
 *     NuevaPlaylist:
 *       type: object
 *       required:
 *         - titulo
 *         - id_usuario
 *       properties:
 *         titulo:
 *           type: string
 *           example: "Para correr"
 *         id_usuario:
 *           type: integer
 *           example: 2
 *     PlaylistResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         playlistNuevaDatos:
 *           type: object
 *           properties:
 *             id_playlist:
 *               type: integer
 *             titulo:
 *               type: string
 *             id_usuario:
 *               type: integer
 *     AgregarCancionPlaylist:
 *       type: object
 *       required:
 *         - id_cancion
 *       properties:
 *         id_cancion:
 *           type: integer
 *           example: 13
 *         orden:
 *           type: integer
 *           description: Orden de la canción en la playlist
 *           example: 1
 *     CancionPlaylistResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         playlistsCancionesNuevaDatos:
 *           type: object
 *           properties:
 *             id_playlist:
 *               type: integer
 *             id_cancion:
 *               type: integer
 *             fecha_agregada:
 *               type: string
 *               format: date-time
 *             orden:
 *               type: integer
 *     ActualizarPlaylist:
 *       type: object
 *       properties:
 *         titulo:
 *           type: string
 *           example: "Nuevo título"
 *         id_usuario:
 *           type: integer
 *           example: 2
 *         fecha_eliminacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de eliminación (requerida para soft delete)
 *           example: "2025-10-02T10:00:00Z"
 *         activa:
 *           type: integer
 *           enum: [0, 1]
 *           example: 0
 *         estado:
 *           type: string
 *           example: "Eliminada"
 *     PlaylistActualizadaResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         playlistNuevaDatos:
 *           type: object
 *           properties:
 *             id_playlist:
 *               type: integer
 *             titulo:
 *               type: string
 *             id_usuario:
 *               type: integer
 *             fecha_eliminacion:
 *               type: string
 *               format: date-time
 *             activa:
 *               type: integer
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
 *   name: Playlists
 *   description: Gestión de playlists y sus canciones
 */

/**
 * @swagger
 * /api/v1/playlists:
 *   post:
 *     summary: Crear una nueva playlist
 *     description: Crea una nueva playlist para un usuario. La playlist se crea activa por defecto.
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevaPlaylist'
 *           examples:
 *             playlistEjemplo:
 *               summary: Playlist para correr
 *               value:
 *                 titulo: "Para correr"
 *                 id_usuario: 2
 *     responses:
 *       201:
 *         description: Playlist creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistResponse'
 *             examples:
 *               success:
 *                 summary: Playlist creada
 *                 value:
 *                   message: "Playlist Nueva Registrada"
 *                   playlistNuevaDatos:
 *                     id_playlist: 10
 *                     titulo: "Para correr"
 *                     id_usuario: 2
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
 *                   error: "Faltan datos para la creación de la playlist"
 *               playlistExistente:
 *                 summary: Playlist ya existe
 *                 value:
 *                   error: "La playlist ya existe, debe elegir otra"
 *       500:
 *         description: Error del servidor
 */

const crearPlaylist = async (req, res) => {
    try{
        const { titulo, id_usuario } = req.body
        if(!titulo || !id_usuario){
            res.status(400).json({ error: 'Faltan datos para la creación de la playlist'}) 
            console.log(chalk.yellowBright('<----- Faltan datos para la creación de la playlist ----->'))
            return;
        }
        const playlistExistente = await Playlist.findOne({ where: { titulo, id_usuario } })
        if(playlistExistente){
            res.status(400).json({ error: 'La playlist ya existe, debe elegir otra'}) 
            console.log(chalk.yellowBright('<----- La playlist ya existe, debe elegir otra ----->'))
            return;
        }
        const playlistNueva = await Playlist.create({
            titulo,
            id_usuario,
        })
        let playlistNuevaDatos = {
            id_playlist: playlistNueva.id_playlist,
            titulo: playlistNueva.titulo,
            id_usuario: playlistNueva.id_usuario,
        }
        res.status(201).json({message: 'Playlist Nueva Registrada', playlistNuevaDatos})
        console.log(chalk.greenBright(`<----- Playlist Nueva Registrada con ID ${playlistNueva.id_playlist} ----->`))
        console.table(playlistNuevaDatos)
        console.log(chalk.greenBright('<----- ------------------->'))
    
    }
    catch(error){
        res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
        console.log(chalk.redBright('<----- Error al crear playlist, servidor no funciona! -----> ' + error.message))
    }
    }


 /**
 * @swagger
 * /api/v1/playlists/{idPlaylist}/canciones:
 *   post:
 *     summary: Agregar una canción a una playlist
 *     description: Agrega una canción existente a una playlist existente. Incrementa automáticamente el contador de canciones.
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPlaylist
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la playlist
 *         example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgregarCancionPlaylist'
 *           examples:
 *             agregarCancion:
 *               summary: Agregar canción con orden
 *               value:
 *                 id_cancion: 13
 *                 orden: 1
 *     responses:
 *       201:
 *         description: Canción agregada exitosamente a la playlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CancionPlaylistResponse'
 *             examples:
 *               success:
 *                 summary: Canción agregada
 *                 value:
 *                   message: "Canción agregada a la playlist"
 *                   playlistsCancionesNuevaDatos:
 *                     id_playlist: 10
 *                     id_cancion: 13
 *                     fecha_agregada: "2025-12-09T10:30:00.000Z"
 *                     orden: 1
 *       400:
 *         description: Error en los parámetros
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               idPlaylistInvalido:
 *                 summary: ID de playlist inválido
 *                 value:
 *                   error: "Falta el ID del playlist o no es un número"
 *               idCancionInvalido:
 *                 summary: ID de canción inválido
 *                 value:
 *                   error: "Falta el ID de la canción o no es un número"
 *       404:
 *         description: Recurso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               playlistNoExiste:
 *                 summary: Playlist no existe
 *                 value:
 *                   error: "La playlist no existe"
 *               cancionNoExiste:
 *                 summary: Canción no existe
 *                 value:
 *                   error: "La canción no existe"
 *               cancionYaAgregada:
 *                 summary: Canción ya existe en playlist
 *                 value:
 *                   error: "La canción ya fué agregada anteriormente a la playlist"
 *       500:
 *         description: Error del servidor
 */   

const agregarCancionParaPlaylist = async (req, res) => {
    try{
       const { idPlaylist } = req.params
       const { id_cancion, orden } = req.body

       if(!idPlaylist || isNaN(idPlaylist)){
           res.status(400).json({ error: 'Falta el ID del playlist o no es un número'}) 
           console.log(chalk.yellowBright('<----- Falta el ID del playlist o no es un número ----->'))
           return;
       }
       if(!id_cancion || isNaN(id_cancion)){
           res.status(400).json({ error: 'Falta el ID de la canción o no es un número'}) 
           console.log(chalk.yellowBright('<----- Falta el ID de la canción o no es un número ----->'))
           return;
       }
       const playlistExistente = await Playlist.findByPk(idPlaylist)
       if(!playlistExistente){
           res.status(404).json({ error: 'La playlist no existe'}) 
           console.log(chalk.yellowBright('<----- La playlist no existe ----->'))
           return;
       }
       const cancionExistente = await Cancion.findByPk(id_cancion)
       if(!cancionExistente){
           res.status(404).json({ error: 'La canción no existe'}) 
           console.log(chalk.yellowBright('<----- La canción no existe ----->'))
           return;
       }
       
       const playlistsCancionesExistente = await PlaylistsCanciones.findOne({
           where: {
               id_playlist: parseInt(idPlaylist),
               id_cancion: parseInt(id_cancion)
           }
       })
       if(playlistsCancionesExistente){
           res.status(404).json({ error: 'La canción ya fué agregada anteriormente a la playlist'}) 
           console.log(chalk.yellowBright('<----- La canción ya fué agregada anteriormente a la playlist ----->'))
           return;
       }


       const playlistsCancionesNueva = await PlaylistsCanciones.create({
           id_playlist: parseInt(idPlaylist),
           id_cancion: parseInt(id_cancion),
           fecha_agregada: new Date(),
           orden,
       })
       
       // Incrementar en 1 la columna 'visitas' del usuario con id 1
       await Playlist.increment('numero_canciones', { by: 1, where: { id_playlist: idPlaylist } })
       

       let playlistsCancionesNuevaDatos = {
           id_playlist: playlistsCancionesNueva.id_playlist,
           id_cancion: playlistsCancionesNueva.id_cancion,
           fecha_agregada: playlistsCancionesNueva.fecha_agregada,
           orden: playlistsCancionesNueva.orden,
       }
       res.status(201).json({message: 'Canción agregada a la playlist', playlistsCancionesNuevaDatos})
       console.log(chalk.greenBright(`<----- Canción agregada a la playlist con ID ${playlistsCancionesNueva.id_playlist} ----->`))
       console.table(playlistsCancionesNuevaDatos)
       console.log(chalk.greenBright('<----- ------------------->'))
      }catch(error){
       res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
       console.log(chalk.redBright('<----- Error al agregar canción a la playlist, servidor no funciona! -----> ' + error.message))
    }
}


/**
 * @swagger
 * /api/v1/playlists/{idPlaylist}/cancion/{idCancion}:
 *   delete:
 *     summary: Quitar una canción de una playlist
 *     description: Elimina una canción específica de una playlist. Decrementa automáticamente el contador de canciones.
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPlaylist
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la playlist
 *         example: 10
 *       - in: path
 *         name: idCancion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la canción a eliminar
 *         example: 13
 *     responses:
 *       200:
 *         description: Canción eliminada exitosamente de la playlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 playListDatos:
 *                   type: object
 *                   properties:
 *                     id_playlist:
 *                       type: integer
 *                     id_cancion:
 *                       type: integer
 *             examples:
 *               success:
 *                 summary: Canción eliminada
 *                 value:
 *                   message: "Canción eliminada de la playlist!"
 *                   playListDatos:
 *                     id_playlist: 10
 *                     id_cancion: 13
 *       400:
 *         description: Error en los parámetros
 *       404:
 *         description: Recurso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               playlistNoExiste:
 *                 summary: Playlist no existe
 *                 value:
 *                   error: "La playlist no existe, no se puede eliminar la canción"
 *               cancionNoExiste:
 *                 summary: Canción no existe
 *                 value:
 *                   error: "La canción no existe, no se puede eliminar de la playlist"
 *               cancionNoEnPlaylist:
 *                 summary: Canción no está en playlist
 *                 value:
 *                   error: "La canción no fue agregada a la playlist"
 *       500:
 *         description: Error del servidor
 */

const eliminarCancionDePlaylist = async (req, res) => {
    try{
        const { idPlaylist, idCancion } = req.params
        if(!idPlaylist || isNaN(idPlaylist)){
            res.status(400).json({ error: 'Falta el ID del playlist o no es un número'}) 
            console.log(chalk.yellowBright('<----- Falta el ID del playlist o no es un número ----->'))
            return;
        }
        if(!idCancion || isNaN(idCancion)){
            res.status(400).json({ error: 'Falta el ID de la canción o no es un número'}) 
            console.log(chalk.yellowBright('<----- Falta el ID de la canción o no es un número ----->'))
            return;
        }
        const playlistExistente = await Playlist.findByPk(idPlaylist)
        if(!playlistExistente){
            res.status(404).json({ error: 'La playlist no existe, no se puede eliminar la canción'}) 
            console.log(chalk.yellowBright('<----- La playlist no existe, no se puede eliminar la canción ----->'))
            return;
        }
        const cancionExistente = await Cancion.findByPk(idCancion)
        if(!cancionExistente){
            res.status(404).json({ error: 'La canción no existe, no se puede eliminar de la playlist'}) 
            console.log(chalk.yellowBright('<----- La canción no existe, no se puede eliminar de la playlist ----->'))
            return;
        }
        const playlistsCancionesExistente = await PlaylistsCanciones.findOne({
            where: {
                id_playlist: parseInt(idPlaylist),
                id_cancion: parseInt(idCancion)
            }
        })
        if(!playlistsCancionesExistente){
            res.status(404).json({ error: 'La canción no fue agregada a la playlist'}) 
            console.log(chalk.yellowBright('<----- La canción no fue agregada a la playlist ----->'))
            return;
        }
        await PlaylistsCanciones.destroy({
            where: {
                id_playlist: parseInt(idPlaylist),
                id_cancion: parseInt(idCancion)
            }
        })

          // Decrementar en 1 la columna 'visitas' del usuario
       await Playlist.decrement('numero_canciones', { by: 1, where: { id_playlist: idPlaylist } });

        const playListDatos = {
            id_playlist: playlistExistente.id_playlist,
            id_cancion: cancionExistente.id_cancion,
        }

        res.status(200).json({ message: 'Canción eliminada de la playlist!', playListDatos })
        console.log(chalk.greenBright(`<----- Canción eliminada de la playlist con ID ${idPlaylist} ----->`))
        console.table(playListDatos)
        console.log(chalk.greenBright('<----- ------------------->'))
    }
    catch(error){
        res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
        console.log(chalk.redBright('<----- Error al eliminar canción de la playlist, servidor no funciona! -----> ' + error.message))
    }
}


/**
 * @swagger
 * /api/v1/playlists/{idPlaylist}:
 *   patch:
 *     summary: Actualizar parcialmente una playlist (soft delete)
 *     description: |
 *       Actualiza parcialmente una playlist. Para realizar soft delete es obligatorio enviar fecha_eliminacion.
 *       **Nota:** El soft delete requiere fecha_eliminacion, activa=0 y estado="Eliminada"
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPlaylist
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la playlist a actualizar
 *         example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarPlaylist'
 *           examples:
 *             softDeleteCorrecto:
 *               summary: Soft delete correcto (con fecha)
 *               value:
 *                 fecha_eliminacion: "2025-10-02T10:00:00Z"
 *                 activa: 0
 *                 estado: "Eliminada"
 *             softDeleteError:
 *               summary: Soft delete incorrecto (sin fecha)
 *               value:
 *                 activa: 0
 *                 estado: "Eliminada"
 *             actualizarTitulo:
 *               summary: Actualizar solo título
 *               value:
 *                 titulo: "Nuevo título para correr"
 *     responses:
 *       200:
 *         description: Playlist actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistActualizadaResponse'
 *             examples:
 *               success:
 *                 summary: Playlist actualizada
 *                 value:
 *                   message: "Playlist actualizada"
 *                   playlistNuevaDatos:
 *                     id_playlist: 10
 *                     titulo: "Para correr"
 *                     id_usuario: 2
 *                     fecha_eliminacion: "2025-10-02T10:00:00Z"
 *                     activa: 0
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               idPlaylistInvalido:
 *                 summary: ID de playlist inválido
 *                 value:
 *                   error: "Falta el ID del playlist o no es un número"
 *               fechaEliminacionFaltante:
 *                 summary: Falta fecha de eliminación
 *                 value:
 *                   error: "Falta la fecha de eliminación para realizar la operación"
 *       404:
 *         description: Playlist no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "La playlist no existe"
 *       500:
 *         description: Error del servidor
 */

const modificacionParcialPlaylist = async (req, res) => {
    try{
        const { idPlaylist } = req.params
        const { titulo, id_usuario, fecha_eliminacion, activa, estado } = req.body
        if(!idPlaylist || isNaN(idPlaylist)){
            res.status(400).json({ error: 'Falta el ID del playlist o no es un número'}) 
            console.log(chalk.yellowBright('<----- Falta el ID del playlist o no es un número ----->'))
            return;
        }

        if(!fecha_eliminacion){
            res.status(400).json({ error: 'Falta la fecha de eliminación para realizar la operación'}) 
            console.log(chalk.yellowBright('<----- Falta la fecha de eliminación para realizar la operación ----->'))
            return;
        }

        const playlistExistente = await Playlist.findByPk(idPlaylist)
        if(!playlistExistente){
            res.status(404).json({ error: 'La playlist no existe'}) 
            console.log(chalk.yellowBright('<----- La playlist no existe ----->'))
            return;
        }
        if(titulo){
            playlistExistente.titulo = titulo
        }
        if(id_usuario){
            playlistExistente.id_usuario = id_usuario
        }
        if(fecha_eliminacion){
            playlistExistente.fecha_eliminacion = fecha_eliminacion
        }
        if(activa){
            playlistExistente.activa = activa
        }
        if(estado){
            playlistExistente.estado = estado
        }

        await playlistExistente.save()
        
        let playlistNuevaDatos = {
            id_playlist: playlistExistente.id_playlist,
            titulo: playlistExistente.titulo,
            id_usuario: playlistExistente.id_usuario,
            fecha_eliminacion: playlistExistente.fecha_eliminacion,
            activa: playlistExistente.activa,
        }
        res.status(200).json({message: 'Playlist actualizada', playlistNuevaDatos})
        console.log(chalk.greenBright(`<----- Playlist actualizada con ID ${playlistExistente.id_playlist} ----->`))
        console.table(playlistNuevaDatos)
        console.log(chalk.greenBright('<----- ------------------->'))
    }
    catch(error){
        res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
        console.log(chalk.redBright('<----- Error al actualizar playlist, servidor no funciona! -----> ' + error.message))
    }
}


module.exports = { crearPlaylist, agregarCancionParaPlaylist, eliminarCancionDePlaylist, modificacionParcialPlaylist }
