const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const CancionesGeneros = sequelize.define('CancionesGeneros',{
    id_cancion: {
        type: DataTypes.INTEGER,
        validate:{
            min: 1,
            max: 1000
        },
        primaryKey: true,
        allowNull: false,
        foreignKey: true
    },
    id_genero: {
        type: DataTypes.INTEGER,
        validate:{
            min: 1,
            max: 50
        },
        primaryKey: true,
        allowNull: false,
        foreignKey: true
    },
},
{
    tableName: 'canciones_generos',
    timestamps: false,
}
)

module.exports = CancionesGeneros