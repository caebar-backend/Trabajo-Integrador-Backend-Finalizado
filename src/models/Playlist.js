/**
 * Modelo Playlist
 * Los estudiantes deben implementar todas las operaciones CRUD para playlists
 */

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Playlist = sequelize.define('Playlist',{
    id_playlist: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    numero_canciones: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    fecha_eliminacion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    activa: {
        type: DataTypes.INTEGER,
        validate:{
            min: 0,
            max: 1
        },
        allowNull: true,
    },
    estado:{
        type: DataTypes.STRING(45),
        allowNull: false
    }
    },
    {
        tableName: 'playlists',
        timestamps: false,
    }
    )

    module.exports = Playlist
