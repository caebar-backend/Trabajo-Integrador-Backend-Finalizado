/**
 * Modelo Usuario
 * Los estudiantes deben implementar todas las operaciones CRUD para usuarios
 */

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    sexo: {
        type: DataTypes.ENUM('M´','F','O'),
        allowNull: false
    },
    codigo_postal: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null
    },
    id_pais: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_registro: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    ultima_modificacion_password: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    id_rol:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
},
    {
        timestamps: false,
        tableName: 'usuarios'
    }
)

module.exports = Usuario