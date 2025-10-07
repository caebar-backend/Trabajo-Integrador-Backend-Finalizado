/**
 * Modelo Genero
 * Los estudiantes deben implementar todas las operaciones CRUD para géneros
 */

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Genero = sequelize.define('Genero',{
    id_genero: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
},
{ 
  tableName: 'generos',
  timestamps: false,
}
)

// En las asociaciones del modelo Genero
Genero.associate = function(models) {
  Genero.belongsToMany(models.Cancion, {
    through: 'canciones_generos',
    foreignKey: 'id_genero',
    otherKey: 'id_cancion',
    as: 'Canciones'
  });

Genero.hasMany(models.Album, {
  foreignKey: 'id_genero',
  as: 'Albumes'
});
};

module.exports = Genero