const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const VistaDos = sequelize.define('VistaDos', {
    id_artista: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    art_nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    art_ingreso: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    album_id_artista: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    album_id_discografica: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_discografica: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    discograf_nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    discograf_ingreso: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_pais: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pais_nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ingreso_total:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
},
{
    timestamps: false,
    tableName: 'vistados',
})

module.exports = VistaDos