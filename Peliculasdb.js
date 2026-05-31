import { Sequelize, DataTypes} from 'sequelize';

const Peliculasdb = new Sequelize( {
    dialect: 'sqlite',
    storage: 'peliculasdb.sqlite'
});

//paso 2 definir el modelo de datos 

const Peliculas = Peliculasdb.define ( 'Pelicula', {


    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true,
    },

    TituloPelicula: {
        type: DataTypes.STRING,
        allowNull: false, 
    },

    Genero: {
        type: DataTypes.STRING,
        allowNull: false, 

    },

    Director: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    Año: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    Idioma: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

async function inicializacion() {
    //sincronizar el modelo con la base de datos
    await Peliculasdb.sync (); 

 
}

inicializacion();



export { Peliculas }