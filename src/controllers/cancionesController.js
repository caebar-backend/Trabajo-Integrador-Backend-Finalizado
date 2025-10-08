/**
 * Controlador de Canciones
 * Los estudiantes deben implementar toda la lógica de negocio para canciones
 */

const chalk = require('chalk')

const { Cancion, Album, Genero, CancionesGeneros, sequelize } = require('../models/index.js')


const crearCancion = async(req, res) => {
    try{
        const { titulo, duracion_segundos, id_album, numero_reproducciones, numero_likes, fecha_agregada } = req.body

        const albumExistente = await Album.findByPk(id_album)
        if (!albumExistente) {
        res.status(400).json({ error: 'El álbum no existe. Debe crear el álbum antes de agregar canciones que no pertenecen a un album existente.' })
        console.log(chalk.yellowBright('<----- El álbum no existe. Debe crear el álbum antes de agregar canciones que no pertenecen a un album existente ----->'))
        return;
       }

        //Validacion simple de datos
        if(!titulo|| !id_album){
            res.status(400).json({ error: 'Faltan datos importantes para la creación de la canción'}) 
            console.log(chalk.yellowBright('<----- Faltan datos importantes para la creación de la canción ----->'))
            return;
        }
      
        if(duracion_segundos < 100 || Number.isInteger(duracion_segundos) === false){
            res.status(400).json({ error: 'La duración de la canción debe ser mayor a 100 segundos y número entero'}) 
            console.log(chalk.yellowBright('<----- La duración de la canción debe ser mayor a 100 segundos y número entero ----->'))
            return;
        }

        const cancionExistente = await Cancion.findOne({ where: { titulo, id_album } })
        if(cancionExistente){
            res.status(400).json({ error: 'La canción ya existe, debe elegir otra'}) 
            console.log(chalk.yellowBright('<----- La canción ya existe, debe elegir otra ----->'))
            return;
        }
        
        const cancionNueva = await Cancion.create({
            titulo,
            duracion_segundos,
            id_album,
            numero_reproducciones,
            numero_likes,
            fecha_agregada,
        })
        
        let cancionNuevaDatos = {
            id_cancion: cancionNueva.id_cancion,
            titulo: cancionNueva.titulo,
            duracion_segundos: cancionNueva.duracion_segundos,
            id_album: cancionNueva.id_album,
           }

           res.status(201).json({message: 'Canción Nueva Registrada', cancionNuevaDatos})
           console.log(chalk.greenBright(`<----- Canción Nueva Registrada con ID ${cancionNueva.id_cancion} ----->`))
           console.table(cancionNuevaDatos)
           console.log(chalk.greenBright('<----- ------------------->'))
    }
    catch(error){
        res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
        console.log(chalk.redBright('<----- Error al crear canción, servidor no funciona! -----> ' + error.message))
    }
    
}

const asociarGeneroParaCancion = async (req, res) => {
  
  try {
   const { id_cancion }  = req.params
   const { id_genero } = req.body
   
   const cancion = await Cancion.findByPk(id_cancion)
   if (!cancion) {
    res.status(400).json({ error: 'La canción no existe. Debe crear la canción antes de agregar géneros a ella' })
    console.log(chalk.yellowBright('<----- La canción no existe. Debe crear la canción antes de agregar géneros a ella ----->'))
    return;
   }

   // Buscar la asociación existente
    const asociacionExistente = await CancionesGeneros.findOne({
      where: {
        id_cancion: parseInt(id_cancion),
        id_genero: parseInt(id_genero)
      }
    });

    if (asociacionExistente) {
      res.status(404).json({ error: 'La asociación a crear ya existe' });
      console.log(chalk.yellowBright('<----- La asociación a crear ya existe ----->'));
      return;
    }

   const asociacionNueva = await CancionesGeneros.create({
    id_cancion,
    id_genero,
   })

   let cancionNuevaDatos = {
    id_cancion: asociacionNueva.id_cancion,
    id_genero: asociacionNueva.id_genero,
   }

   res.status(201).json({message: 'Asociación de género creada', cancionNuevaDatos})
   console.log(chalk.greenBright(`<----- Asociación creada ----->`))
   console.table(cancionNuevaDatos)
   console.log(chalk.greenBright('<----- ------------------->'))
   
  } 
  catch(error){
    res.status(500).json({ error: 'El servidor no está funcionando, intente más tarde!', description: error.message })
    console.log(chalk.redBright('<----- Error al crear asociación de género, servidor no funciona! -----> ' + error.message))
  }
}

const eliminarAsociacionGeneroCancion = async (req, res) => {
  try {
    const { id_cancion, id_genero } = req.params;

    // Verificar que la canción existe
    const cancion = await Cancion.findByPk(id_cancion);
    if (!cancion) {
      res.status(404).json({ error: 'La canción no existe' });
      console.log(chalk.yellowBright('<----- La canción no existe ----->'));
      return;
    }

    // Verificar que el género existe
    const genero = await Genero.findByPk(id_genero);
    if (!genero) {
      res.status(404).json({ error: 'El género no existe' });
      console.log(chalk.yellowBright('<----- El género no existe ----->'));
      return;
    }

    // Buscar la asociación existente
    const asociacionExistente = await CancionesGeneros.findOne({
      where: {
        id_cancion: parseInt(id_cancion),
        id_genero: parseInt(id_genero)
      }
    });

    if (!asociacionExistente) {
      res.status(404).json({ error: 'La asociación a eliminar no existe' });
      console.log(chalk.yellowBright('<----- La asociación a eliminar no existe ----->'));
      return;
    }

    // Eliminar la asociación
    await CancionesGeneros.destroy({
      where: {
        id_cancion: parseInt(id_cancion),
        id_genero: parseInt(id_genero)
      }
    });

    const datosEliminados = {
      id_cancion: parseInt(id_cancion),
      id_genero: parseInt(id_genero),
    };

    res.status(200).json({ 
      message: 'Asociación eliminada exitosamente', 
      data: datosEliminados 
    });
    
    console.log(chalk.greenBright('<----- Asociación eliminada ----->'));
    console.table(datosEliminados);
    console.log(chalk.greenBright('<----- -------------------->'));
   
  } catch(error) {
    console.error(chalk.redBright('<----- Error al eliminar asociación ----->'), error);
    
    // Manejar errores específicos
    if (error.name === 'SequelizeDatabaseError') {
      res.status(500).json({ 
        error: 'Error de base de datos' 
      });
    } else {
      res.status(500).json({ 
        error: 'Error interno del servidor, intente más tarde', 
        description: error.message 
      });
    }
  }
};

const buscarCanciones = async (req, res) => {
  try {
    const { genero, albumid } = req.query;

    if (!genero && !albumid) {
      console.log(chalk.yellowBright('<----- Debe proporcionar al menos un filtro (genero o albumid) ----->'))
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un filtro (genero o albumid)'
      });
    }

    let query = `
      SELECT DISTINCT
        c.*,
        a.titulo as album_titulo,
        a.portada_url as album_portada
      FROM canciones c
      INNER JOIN albumes a ON c.id_album = a.id_album
      WHERE 1=1
    `;

    const params = [];

    // BÚSQUEDA OR: género O álbum
    if (albumid && genero) {
      query += ` AND (c.id_album = ? OR EXISTS (
        SELECT 1 FROM canciones_generos cg 
        WHERE cg.id_cancion = c.id_cancion 
        AND cg.id_genero = ?
      ))`;
      console.log(chalk.cyanBright('<----- Búsqueda por género y álbum ----->'))
      params.push(albumid, genero);
    } else if (albumid) {
      query += ` AND c.id_album = ?`;
      params.push(albumid);
      console.log(chalk.cyanBright('<----- Búsqueda por álbum ----->'))
    } else if (genero) {
      query += ` AND EXISTS (
        SELECT 1 FROM canciones_generos cg 
        WHERE cg.id_cancion = c.id_cancion 
        AND cg.id_genero = ?
      )`;
      params.push(genero);
      console.log(chalk.cyanBright('<----- Búsqueda por género ----->'))
    }

    query += ` ORDER BY c.titulo ASC`;

    const [canciones] = await sequelize.query(query, {
      replacements: params
    });
    
    const resultadosCanciones = canciones.map(cancion => {
      return {
        id: cancion.id_cancion,
        titulo: cancion.titulo,
        duracion_segundos: cancion.duracion_segundos,
        id_album: cancion.id_album,
       }
      })
    res.status(200).json({
      success: true,
      message: albumid && genero 
        ? `Canciones del álbum ${albumid} O con género ${genero}` 
        : albumid 
          ? `Canciones del álbum ${albumid}` 
          : `Canciones con género ${genero}`,
      count: canciones.length,
      filters: {
        genero: genero || null,
        albumid: albumid || null
      },
      data: canciones
    });
    console.log(chalk.greenBright(`<----- Resultados de la búsqueda ----->`))
    console.table(resultadosCanciones)
    console.log(chalk.greenBright('<----- ------------------->'))

  } catch (error) {
    console.error(chalk.red('Error en buscarCanciones:'), error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = { crearCancion,  buscarCanciones, asociarGeneroParaCancion, eliminarAsociacionGeneroCancion }