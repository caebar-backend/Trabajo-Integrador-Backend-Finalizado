/**
 * Modelo Artista
 * Los estudiantes deben implementar todas las operaciones CRUD para artistas
 */

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Artista = sequelize.define('Artista',{
    id_artista: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true
    },
    imagen_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null
    },
    biografia: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    fecha_registro: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    },
    {
        tableName: 'artistas',
        timestamps: false,
    }) 

    module.exports = Artista