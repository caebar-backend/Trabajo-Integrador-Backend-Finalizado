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
 *           description: ID único de la canción
 *         titulo:
 *           type: string
 *           description: Título de la canción
 *         duracion_segundos:
 *           type: integer
 *           description: Duración en segundos (número entero)
 *         id_album:
 *           type: integer
 *           description: ID del álbum al que pertenece
 *         numero_reproducciones:
 *           type: integer
 *           description: Número de reproducciones
 *         numero_likes:
 *           type: integer
 *           description: Número de likes
 *         fecha_agregada:
 *           type: string
 *           format: date-time
 *           description: Fecha en que se agregó la canción
 *     NuevaCancion:
 *       type: object
 *       required:
 *         - titulo
 *         - duracion_segundos
 *         - id_album
 *       properties:
 *         titulo:
 *           type: string
 *           example: "Mariposa Tecknicolor"
 *         duracion_segundos:
 *           type: integer
 *           minimum: 100
 *           description: Duración en segundos (mínimo 100, número entero)
 *           example: 255
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
 *           example: "2023-10-15T10:30:00.000Z"
 *     CancionResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         cancionNuevaDatos:
 *           type: object
 *           properties:
 *             id_cancion:
 *               type: integer
 *             titulo:
 *               type: string
 *             duracion_segundos:
 *               type: integer
 *             id_album:
 *               type: integer
 *     AsociacionGenero:
 *       type: object
 *       required:
 *         - id_genero
 *       properties:
 *         id_genero:
 *           type: integer
 *           example: 5
 *     AsociacionResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         cancionNuevaDatos:
 *           type: object
 *           properties:
 *             id_cancion:
 *               type: integer
 *             id_genero:
 *               type: integer
 *     BusquedaCancionesResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         count:
 *           type: integer
 *         filters:
 *           type: object
 *           properties:
 *             genero:
 *               type: integer
 *               nullable: true
 *             albumid:
 *               type: integer
 *               nullable: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Cancion'
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
 *   name: Canciones
 *   description: Gestión de canciones y asociación con géneros
 */

/**
 * @swagger
 * /api/v1/canciones:
 *   post:
 *     summary: Crear una nueva canción
 *     description: Crea una nueva canción. La duración debe ser en segundos (número entero mayor a 100)
 *     tags: [Canciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevaCancion'
 *           examples:
 *             ejemploCorrecto:
 *               summary: Ejemplo correcto (duración en segundos)
 *               value:
 *                 titulo: "Mariposa Tecknicolor"
 *                 duracion_segundos: 255
 *                 id_album: 1
 *             ejemploError:
 *               summary: Ejemplo incorrecto (duración con decimales)
 *               value:
 *                 titulo: "DuracionMala"
 *                 duracion_segundos: 3.25
 *                 id_album: 1
 *     responses:
 *       201:
 *         description: Canción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CancionResponse'
 *             examples:
 *               success:
 *                 summary: Canción creada
 *                 value:
 *                   message: "Canción Nueva Registrada"
 *                   cancionNuevaDatos:
 *                     id_cancion: 275
 *                     titulo: "Mariposa Tecknicolor"
 *                     duracion_segundos: 255
 *                     id_album: 1
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
 *         description: Error del servidor
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
 * /api/v1/canciones/{id_cancion}/generos:
 *   post:
 *     summary: Asociar un género a una canción
 *     description: Asocia un género existente a una canción existente. Verifica la existencia de ambos antes de crear la asociación.
 *     tags: [Canciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cancion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la canción
 *         example: 275
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AsociacionGenero'
 *           example:
 *             id_genero: 5
 *     responses:
 *       201:
 *         description: Asociación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsociacionResponse'
 *             example:
 *               message: "Asociación de género creada"
 *               cancionNuevaDatos:
 *                 id_cancion: 275
 *                 id_genero: 5
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               cancionNoExiste:
 *                 summary: Canción no existe
 *                 value:
 *                   error: "La canción no existe. Debe crear la canción antes de agregar géneros a ella"
 *               generoNoExiste:
 *                 summary: Género no existe
 *                 value:
 *                   error: "El género no existe. Debe crear el género antes de agregar canciones a él"
 *               asociacionExistente:
 *                 summary: Asociación ya existe
 *                 value:
 *                   error: "La asociación a crear ya existe"
 *       500:
 *         description: Error del servidor
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
 * /api/v1/canciones/{id_cancion}/generos/{id_genero}:
 *   delete:
 *     summary: Eliminar asociación de género de una canción
 *     description: Elimina la asociación entre una canción y un género específico
 *     tags: [Canciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cancion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la canción
 *         example: 275
 *       - in: path
 *         name: id_genero
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del género
 *         example: 5
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_cancion:
 *                       type: integer
 *                     id_genero:
 *                       type: integer
 *             example:
 *               message: "Asociación eliminada exitosamente"
 *               data:
 *                 id_cancion: 275
 *                 id_genero: 5
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
 *         description: Error del servidor
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
 * /api/v1/canciones:
 *   get:
 *     summary: Buscar canciones con filtros
 *     description: Buscar canciones por género y/o álbum (búsqueda OR - género O álbum)
 *     tags: [Canciones]
 *     parameters:
 *       - in: query
 *         name: genero
 *         schema:
 *           type: integer
 *         description: ID del género para filtrar
 *         example: 2
 *       - in: query
 *         name: albumid
 *         schema:
 *           type: integer
 *         description: ID del álbum para filtrar
 *         example: 69
 *     responses:
 *       200:
 *         description: Canciones encontradas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BusquedaCancionesResponse'
 *             examples:
 *               conFiltros:
 *                 summary: Con filtros de género y álbum
 *                 value:
 *                   success: true
 *                   message: "Canciones del álbum 69 O con género 2"
 *                   count: 5
 *                   filters:
 *                     genero: 2
 *                     albumid: 69
 *                   data:
 *                     - id_cancion: 275
 *                       titulo: "Canción 1"
 *                       duracion_segundos: 240
 *                       id_album: 69
 *       400:
 *         description: Faltan filtros de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: false
 *               message: "Debe proporcionar al menos un filtro (genero o albumid)"
 *       500:
 *         description: Error del servidor
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