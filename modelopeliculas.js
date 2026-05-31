import {DataTypes} from 'sequelize';
import sequelize from './Peliculasdb.js';


const Peliculas = sequelize.define('peliculas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },  

    genero: {
        type: DataTypes.STRING,
        allowNull: false
    },      

    director: {
        type: DataTypes.STRING,
        allowNull: false
    },

    año: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    idioma: {
        type: DataTypes.STRING,
        allowNull: false
    },      

});

export default Peliculas;