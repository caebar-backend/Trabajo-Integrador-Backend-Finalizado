/**
 * Archivo principal de rutas
 * Los estudiantes deben importar y configurar todas las rutas aquí
 */

const express = require("express");
const router = express.Router();

// TODO: Importar todas las rutas
// const usuariosRoutes = require('./usuarios');
// const artistasRoutes = require('./artistas');
// const albumesRoutes = require('./albumes');
// const cancionesRoutes = require('./canciones');
// const generosRoutes = require('./generos');
// const playlistsRoutes = require('./playlists');
// const suscripcionesRoutes = require('./suscripciones');
// const metodosPagoRoutes = require('./metodos-pago');
// const pagosRoutes = require('./pagos');
// const vistasRoutes = require('./vistas');

// TODO: Configurar las rutas con sus prefijos
// router.use('/usuarios', usuariosRoutes);
// router.use('/artistas', artistasRoutes);
// router.use('/albumes', albumesRoutes);
// router.use('/canciones', cancionesRoutes);
// router.use('/generos', generosRoutes);
// router.use('/playlists', playlistsRoutes);
// router.use('/suscripciones', suscripcionesRoutes);
// router.use('/metodos-pago', metodosPagoRoutes);
// router.use('/pagos', pagosRoutes);
// router.use('/vistas', vistasRoutes);

// Ruta de prueba
router.get("/", (req, res) => {
  res.json({
    message: "API Spotify - Backend funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      usuarios: "/api/v1/usuarios",
      artistas: "/api/v1/artistas",
      albumes: "/api/v1/albumes",
      canciones: "/api/v1/canciones",
      generos: "/api/v1/generos",
      playlists: "/api/v1/playlists",
      suscripciones: "/api/v1/suscripciones",
      metodosPago: "/api/v1/metodos-pago",
      pagos: "/api/v1/pagos",
      vistas: "/api/v1/vistas",
    },
  });
});

module.exports = router;
