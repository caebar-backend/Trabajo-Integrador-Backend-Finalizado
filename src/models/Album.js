/**
 * Modelo Album
 * Los estudiantes deben implementar todas las operaciones CRUD para álbumes
 */
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Album = sequelize.define('Album',{
    id_album: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    titulo: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    anio_publicacion: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1930,
            max: 2030
        },
        allowNull: true,
        defaultValue: null
    },
    id_discografica: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    id_artista: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    portada_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null
    },
    duracion_total: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    },
    {
        tableName: 'albumes',
        timestamps: false,
    }
)

module.exports = Album