
const { DataTypes } = require('sequelize')
const sequelize  = require('../config/database')

const VistaUno = sequelize.define('VistaUno', {
    titulo_cancion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_cancion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    titulo_album: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_album: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre_artista: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_artista: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_reproduccion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre_pais: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_pais: {
        type: DataTypes.INTEGER
    }
    },
    {
        timestamps: false,
        tableName: 'vistauno',
    })


    module.exports = VistaUno