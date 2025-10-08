/**
 * Controlador de Playlists
 * Los estudiantes deben implementar toda la lógica de negocio para playlists
 */

const chalk = require('chalk')
const { Playlist, Cancion, PlaylistsCanciones, sequelize } = require('../models/index')

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
