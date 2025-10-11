/**
 * Controlador de Canciones
 * Los estudiantes deben implementar toda la lógica de negocio para canciones
 */

const chalk = require('chalk')

const { Cancion, Album, Genero, CancionesGeneros, sequelize } = require('../models/index.js')


/**
 * @swagger
 * components:
 *   schemas:
 *     Cancion:
 *       type: object
 *       properties:
 *         id_cancion:
 *           type: integer
 *           readOnly: true
 *           example: 1
 *         titulo:
 *           type: string
 *           maxLength: 255
 *           example: "Bohemian Rhapsody"
 *         duracion_segundos:
 *           type: integer
 *           minimum: 100
 *           example: 354
 *         id_album:
 *           type: integer
 *           example: 1
 *         numero_reproducciones:
 *           type: integer
 *           example: 1500000
 *         numero_likes:
 *           type: integer
 *           example: 250000
 *         fecha_agregada:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     CancionInput:
 *       type: object
 *       required:
 *         - titulo
 *         - duracion_segundos
 *         - id_album
 *       properties:
 *         titulo:
 *           type: string
 *           maxLength: 255
 *           example: "Bohemian Rhapsody"
 *         duracion_segundos:
 *           type: integer
 *           minimum: 100
 *           example: 354
 *         id_album:
 *           type: integer
 *           example: 1
 *         numero_reproducciones:
 *           type: integer
 *           example: 0
 *         numero_likes:
 *           type: integer
 *           example: 0
 *         fecha_agregada:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 * 
 *     CancionResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Canción Nueva Registrada"
 *         cancionNuevaDatos:
 *           type: object
 *           properties:
 *             id_cancion:
 *               type: integer
 *               example: 1
 *             titulo:
 *               type: string
 *               example: "Bohemian Rhapsody"
 *             duracion_segundos:
 *               type: integer
 *               example: 354
 *             id_album:
 *               type: integer
 *               example: 1
 * 
 *     AsociacionGeneroInput:
 *       type: object
 *       required:
 *         - id_genero
 *       properties:
 *         id_genero:
 *           type: integer
 *           example: 1
 * 
 *     AsociacionGeneroResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Asociación de género creada"
 *         cancionNuevaDatos:
 *           type: object
 *           properties:
 *             id_cancion:
 *               type: integer
 *               example: 1
 *             id_genero:
 *               type: integer
 *               example: 1
 * 
 *     BusquedaCancionesResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Canciones del álbum 1 O con género 2"
 *         count:
 *           type: integer
 *           example: 10
 *         filters:
 *           type: object
 *           properties:
 *             genero:
 *               type: string
 *               nullable: true
 *               example: "2"
 *             albumid:
 *               type: string
 *               nullable: true
 *               example: "1"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Cancion'
 */

/**
 * @swagger
 * /api/canciones:
 *   post:
 *     summary: Crear una nueva canción
 *     description: Registra una nueva canción en la plataforma asociada a un álbum existente
 *     tags: [Canciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancionInput'
 *           examples:
 *             cancionCompleta:
 *               summary: Canción con todos los campos
 *               value:
 *                 titulo: "Bohemian Rhapsody"
 *                 duracion_segundos: 354
 *                 id_album: 1
 *                 numero_reproducciones: 0
 *                 numero_likes: 0
 *                 fecha_agregada: "2024-01-15T10:30:00.000Z"
 *             cancionMinima:
 *               summary: Canción con campos obligatorios
 *               value:
 *                 titulo: "Nueva Canción"
 *                 duracion_segundos: 180
 *                 id_album: 1
 *     responses:
 *       201:
 *         description: Canción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CancionResponse'
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
 *                   error: "Faltan datos importantes para la creación de la canción"
 *               duracionInvalida:
 *                 summary: Duración inválida
 *                 value:
 *                   error: "La duración de la canción debe ser mayor a 100 segundos y número entero"
 *               albumNoExiste:
 *                 summary: Álbum no existe
 *                 value:
 *                   error: "El álbum no existe. Debe crear el álbum antes de agregar canciones"
 *               cancionExistente:
 *                 summary: Canción ya existe
 *                 value:
 *                   error: "La canción ya existe, debe elegir otra"
 *       500:
 *         description: Error interno del servidor
 */

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


/**
 * @swagger
 * /api/canciones/{id_cancion}/generos:
 *   post:
 *     summary: Asociar un género a una canción
 *     description: Crea una asociación entre una canción existente y un género musical
 *     tags: [Canciones]
 *     parameters:
 *       - in: path
 *         name: id_cancion
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la canción
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AsociacionGeneroInput'
 *           examples:
 *             rock:
 *               summary: Asociar género rock
 *               value:
 *                 id_genero: 1
 *             pop:
 *               summary: Asociar género pop
 *               value:
 *                 id_genero: 2
 *     responses:
 *       201:
 *         description: Asociación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsociacionGeneroResponse'
 *       400:
 *         description: Canción no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Asociación ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 */

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

   const generoExisteOrNo = await Genero.findByPk(id_genero)
   if (!generoExisteOrNo) {
    res.status(400).json({ error: 'El género no existe. Debe crear el género antes de agregar canciones a él' })
    console.log(chalk.yellowBright('<----- El género no existe. Debe crear el género antes de agregar canciones a él ----->'))
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


/**
 * @swagger
 * /api/canciones/{id_cancion}/generos/{id_genero}:
 *   delete:
 *     summary: Eliminar asociación entre canción y género
 *     description: Remueve la asociación existente entre una canción y un género musical
 *     tags: [Canciones]
 *     parameters:
 *       - in: path
 *         name: id_cancion
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la canción
 *         example: 1
 *       - in: path
 *         name: id_genero
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del género
 *         example: 1
 *     responses:
 *       200:
 *         description: Asociación eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Asociación eliminada exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_cancion:
 *                       type: integer
 *                       example: 1
 *                     id_genero:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: Recurso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               cancionNoExiste:
 *                 summary: Canción no existe
 *                 value:
 *                   error: "La canción no existe"
 *               generoNoExiste:
 *                 summary: Género no existe
 *                 value:
 *                   error: "El género no existe"
 *               asociacionNoExiste:
 *                 summary: Asociación no existe
 *                 value:
 *                   error: "La asociación a eliminar no existe"
 *       500:
 *         description: Error interno del servidor
 */

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

/**
 * @swagger
 * /api/canciones/buscar:
 *   get:
 *     summary: Buscar canciones por género y/o álbum
 *     description: Busca canciones filtrando por género musical y/o álbum (búsqueda OR)
 *     tags: [Canciones]
 *     parameters:
 *       - in: query
 *         name: genero
 *         schema:
 *           type: string
 *         description: ID del género musical para filtrar
 *         example: "2"
 *       - in: query
 *         name: albumid
 *         schema:
 *           type: string
 *         description: ID del álbum para filtrar
 *         example: "1"
 *     responses:
 *       200:
 *         description: Búsqueda exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BusquedaCancionesResponse'
 *       400:
 *         description: Faltan parámetros de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Debe proporcionar al menos un filtro (genero o albumid)"
 *       500:
 *         description: Error interno del servidor
 */

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