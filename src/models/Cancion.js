/**
 * Modelo Cancion
 * Los estudiantes deben implementar todas las operaciones CRUD para canciones
 */

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Cancion = sequelize.define('Cancion',{
    id_cancion: {
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
    duracion_segundos: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_album: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numero_reproducciones: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    numero_likes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    fecha_agregada: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
},
{
    tableName: 'canciones',
    timestamps: false,
}
)

module.exports = Cancion