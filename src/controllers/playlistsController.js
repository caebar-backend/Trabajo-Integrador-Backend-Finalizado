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
 *           readOnly: true
 *           example: 1
 *         titulo:
 *           type: string
 *           maxLength: 255
 *           example: "Mis Favoritas"
 *         id_usuario:
 *           type: integer
 *           example: 1
 *         fecha_eliminacion:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2024-01-15T10:30:00.000Z"
 *         activa:
 *           type: boolean
 *           default: true
 *           example: true
 *         estado:
 *           type: string
 *           enum: [activa, inactiva, eliminada]
 *           example: "activa"
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     PlaylistInput:
 *       type: object
 *       required:
 *         - titulo
 *         - id_usuario
 *       properties:
 *         titulo:
 *           type: string
 *           maxLength: 255
 *           example: "Mis Favoritas"
 *         id_usuario:
 *           type: integer
 *           example: 1
 * 
 *     PlaylistResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Playlist Nueva Registrada"
 *         playlistNuevaDatos:
 *           type: object
 *           properties:
 *             id_playlist:
 *               type: integer
 *               example: 1
 *             titulo:
 *               type: string
 *               example: "Mis Favoritas"
 *             id_usuario:
 *               type: integer
 *               example: 1
 * 
 *     PlaylistCancionInput:
 *       type: object
 *       required:
 *         - id_cancion
 *       properties:
 *         id_cancion:
 *           type: integer
 *           example: 1
 *         orden:
 *           type: integer
 *           minimum: 1
 *           example: 1
 * 
 *     PlaylistCancionResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Canción agregada a la playlist"
 *         playlistsCancionesNuevaDatos:
 *           type: object
 *           properties:
 *             id_playlist:
 *               type: integer
 *               example: 1
 *             id_cancion:
 *               type: integer
 *               example: 1
 *             fecha_agregada:
 *               type: string
 *               format: date-time
 *               example: "2024-01-15T10:30:00.000Z"
 *             orden:
 *               type: integer
 *               example: 1
 * 
 *     PlaylistUpdateInput:
 *       type: object
 *       required:
 *         - fecha_eliminacion
 *       properties:
 *         titulo:
 *           type: string
 *           maxLength: 255
 *           example: "Mis Favoritas Actualizada"
 *         id_usuario:
 *           type: integer
 *           example: 1
 *         fecha_eliminacion:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         activa:
 *           type: boolean
 *           example: true
 *         estado:
 *           type: string
 *           enum: [activa, inactiva, eliminada]
 *           example: "activa"
 */

/**
 * @swagger
 * /api/playlists:
 *   post:
 *     summary: Crear una nueva playlist
 *     description: Crea una nueva playlist para un usuario específico
 *     tags: [Playlists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaylistInput'
 *           examples:
 *             playlistFavoritas:
 *               summary: Playlist de favoritas
 *               value:
 *                 titulo: "Mis Favoritas"
 *                 id_usuario: 1
 *             playlistViaje:
 *               summary: Playlist para viajes
 *               value:
 *                 titulo: "Música para Viajar"
 *                 id_usuario: 2
 *     responses:
 *       201:
 *         description: Playlist creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistResponse'
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               datosFaltantes:
 *                 summary: Faltan datos obligatorios
 *                 value:
 *                   error: "Faltan datos para la creación de la playlist"
 *               playlistExistente:
 *                 summary: Playlist ya existe
 *                 value:
 *                   error: "La playlist ya existe, debe elegir otra"
 *       500:
 *         description: Error interno del servidor
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
 * /api/playlists/{idPlaylist}/canciones:
 *   post:
 *     summary: Agregar canción a una playlist
 *     description: Agrega una canción específica a una playlist existente
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: idPlaylist
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la playlist
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaylistCancionInput'
 *           examples:
 *             cancionConOrden:
 *               summary: Canción con orden específico
 *               value:
 *                 id_cancion: 1
 *                 orden: 1
 *             cancionSinOrden:
 *               summary: Canción sin orden específico
 *               value:
 *                 id_cancion: 2
 *     responses:
 *       201:
 *         description: Canción agregada exitosamente a la playlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistCancionResponse'
 *       400:
 *         description: Error en los parámetros
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *                 summary: Canción ya en playlist
 *                 value:
 *                   error: "La canción ya fué agregada anteriormente a la playlist"
 *       500:
 *         description: Error interno del servidor
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
 * /api/playlists/{idPlaylist}/canciones/{idCancion}:
 *   delete:
 *     summary: Eliminar canción de una playlist
 *     description: Remueve una canción específica de una playlist existente
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: idPlaylist
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la playlist
 *         example: 1
 *       - in: path
 *         name: idCancion
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la canción a eliminar
 *         example: 1
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
 *                   example: "Canción eliminada de la playlist!"
 *                 playListDatos:
 *                   type: object
 *                   properties:
 *                     id_playlist:
 *                       type: integer
 *                       example: 1
 *                     id_cancion:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Error en los parámetros
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *         description: Error interno del servidor
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
 * /api/playlists/{idPlaylist}:
 *   patch:
 *     summary: Actualización parcial de una playlist
 *     description: Actualiza parcialmente los datos de una playlist existente. Requiere fecha_eliminacion para realizar la operación.
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: idPlaylist
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la playlist a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaylistUpdateInput'
 *           examples:
 *             actualizarTitulo:
 *               summary: Actualizar título y estado
 *               value:
 *                 titulo: "Mis Favoritas Actualizadas"
 *                 fecha_eliminacion: "2024-01-15T10:30:00.000Z"
 *                 estado: "activa"
 *             desactivarPlaylist:
 *               summary: Desactivar playlist
 *               value:
 *                 activa: false
 *                 fecha_eliminacion: "2024-01-15T10:30:00.000Z"
 *                 estado: "inactiva"
 *     responses:
 *       200:
 *         description: Playlist actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist actualizada"
 *                 playlistNuevaDatos:
 *                   type: object
 *                   properties:
 *                     id_playlist:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "Mis Favoritas Actualizadas"
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     fecha_eliminacion:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00.000Z"
 *                     activa:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               idInvalido:
 *                 summary: ID inválido
 *                 value:
 *                   error: "Falta el ID del playlist o no es un número"
 *               fechaFaltante:
 *                 summary: Fecha de eliminación faltante
 *                 value:
 *                   error: "Falta la fecha de eliminación para realizar la operación"
 *       404:
 *         description: Playlist no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
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
