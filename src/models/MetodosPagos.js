/**
 * Modelo MetodoPago
 * Los estudiantes deben implementar todas las operaciones CRUD para métodos de pago
 */

const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const MetodosPagos = sequelize.define("MetodosPagos", {
    id_metodo_pago: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo_forma_pago: {
        type: DataTypes.ENUM('Efectivo', 'Tarjeta Debito', 'Tarjeta de Credito', 'Debito Automatico x Banco', 'Transferencia'),
        allowNull: false
    },
    cbu: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    banco_codigo: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    nro_tarjeta: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    mes_caduca: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    anio_caduca: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cvc: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    activo: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1
    },
    },
    {
        timestamps: false,
        tableName: 'metodos_pago'
    })

    module.exports = MetodosPagos