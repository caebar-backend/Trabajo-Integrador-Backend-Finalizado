/**
 * Modelo Pago
 * Los estudiantes deben implementar todas las operaciones CRUD para pagos
 */

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Pago = sequelize.define('Pago', {
    id_pago: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_suscripcion: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    fecha_pago: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    metodo_pago: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    },
    {
        timestamps: false,
        tableName: 'pagos',
    })

    module.exports = Pago