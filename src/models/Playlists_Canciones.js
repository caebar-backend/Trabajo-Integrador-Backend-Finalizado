
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const PlaylistsCanciones = sequelize.define('Playlists_Canciones',{
    id_playlist: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        foreignKey: true
    },
    id_cancion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        foreignKey: true
    },
    fecha_agregada: { 
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    orden: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
    },
    {
        tableName: 'playlists_canciones',
        timestamps: false,
    }
)

module.exports = PlaylistsCanciones