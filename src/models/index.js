// models/index.js
const sequelize = require('../config/database')

// Importar modelos
const Usuario = require('./Usuario')
const Cancion = require('./Cancion')
const Album = require('./Album')
const Genero = require('./Genero')
const CancionesGeneros = require('./Canciones_Generos')
const Artista = require('./Artista')
const Playlist = require('./Playlist')
const PlaylistsCanciones = require('./Playlists_Canciones')
const Suscripcion = require('./Suscripcion')
const Pago = require('./Pago')
const MetodosPagos = require('./MetodosPagos')
const VistaUno = require('./VistaUno')

const models = {
  Usuario,
  Cancion,
  Album,
  Genero,
  CancionesGeneros,
  Artista,
  Playlist,
  PlaylistsCanciones,
  Suscripcion,
  Pago,
  MetodosPagos,
  VistaUno,
}

// 🔥 EJECUTAR ASOCIACIONES - ESTO ES ESENCIAL 🔥
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models)
  }
})

module.exports = {
  sequelize,
  ...models
}