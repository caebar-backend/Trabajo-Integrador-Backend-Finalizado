/**
 * Modelo Suscripcion
 * Los estudiantes deben implementar todas las operaciones CRUD para suscripciones
 */

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Suscripcion = sequelize.define('Suscripcion', {
    id_suscripcion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_tipo_suscripcion: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fecha_renovacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    activa: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
    },
    {
        timestamps: false,
        tableName: 'suscripciones',
    })

    module.exports = Suscripcion