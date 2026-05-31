import express from 'express';
import jwt from 'jsonwebtoken';
import sequelize from './Peliculasdb.js';


const app = express();
const port = 3000;
const SECRET_KEY = 'mi_clave_secreta_para_jwt';

const logger = (req, res, next) => {
    console.log(`${new Date().toLocaleString()} - ${req.method} en ${req.url}`);
    next();
};

const validarApiKey = (req, res, next) => {
    const apiKey = req.query.key?.trim();

    if (apiKey === '123456') {
        next();
    } else {
        res.status(403).send('Acceso denegado: clave API invalida');
    }
};

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Token no proporcionado'
        });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: 'Token invalido'
            });
        }

        req.user = user;
        next();
    });
};

app.use(logger);
app.use(express.json());
app.use(validarApiKey);



//iniciar conexion a la base de datos 

try { 
    await sequelize.authenticate();
    console.log('Conexion a la base de datos establecida exitosamente');
    await sequelize.sync();
} catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);

}


app.listen(process.env.PORT | 3001, () => {
    console.log(`Servidor escuchando en el puerto ${process.env.PORT || 3001}`);
});




app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === '1234') {
        const user = { id: 1, name: 'jean' };

        const token = jwt.sign(user, SECRET_KEY, {
            expiresIn: '1h'
        });

        res.json({
            message: 'Autenticacion exitosa',
            token
        });
    } else {
        res.status(401).json({
            message: 'Credenciales invalidas'
        });
    }
});

app.get('/api/peliculas', verificarToken, async (req, res) => {
    const peliculas = await Peliculas.findAll();

    res.status(200).json({
        mensaje: 'Lista de peliculas',
        peliculas
    });
});

app.post('/api/peliculas', verificarToken, async (req, res) => {
    const body = req.body;
    const nuevaPelicula = await Peliculas.create(body);

    res.status(201).json({
        mensaje: 'Pelicula guardada',
        pelicula: nuevaPelicula
    });
});

app.post('/api/peliculas/bulk', verificarToken, async (req, res) => {
    try {
        const body = req.body;
        const nuevaPelicula = await Peliculas.create(body);

        res.status(201).json({
            mensaje: 'Pelicula Guardada',
            pelicula: nuevaPelicula
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.put('/api/peliculas/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;

        const pelicula = await Peliculas.findByPk(id);

        if (!pelicula) {
            return res.status(404).json({
                mensaje: 'Pelicula no encontrada'
            });
        }

        await pelicula.update(body);

        res.status(200).json({
            mensaje: 'Pelicula actualizada',
            pelicula
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.delete('/api/peliculas/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;

        const pelicula = await Peliculas.findByPk(id);

        if (!pelicula) {
            return res.status(404).json({
                mensaje: 'Pelicula no encontrada'
            });
        }

        await pelicula.destroy();

        res.status(200).json({
            mensaje: 'Pelicula eliminada'
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


app.get('/', async (req, res) => {
    res.send('Bienvenido a la API de Peliculas');
});