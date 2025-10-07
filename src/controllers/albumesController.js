/**
 * Controlador de Álbumes
 * Los estudiantes deben implementar toda la lógica de negocio para álbumes
 */

const chalk = require('chalk')
const { Album, Cancion } = require('../models/index')

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