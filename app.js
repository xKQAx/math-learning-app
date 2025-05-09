const express = require('express');
const path = require('path');
const homeController = require('./src/controllers/homeController');
const progressController = require('./src/controllers/progressController');
const practiceController = require('./src/controllers/practiceController');
const numberFriendsController = require('./src/controllers/numberFriendsController');
const subtractionController = require('./src/controllers/subtractionController');
const differencesController = require('./src/controllers/differencesController');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const authRoutes = require('./src/routes/authRoutes');
const mongoose = require('mongoose');
const gamesController = require('./src/controllers/gamesController');

const app = express();
const PORT = 3000;

// Conexión a MongoDB
mongoose.connect('mongodb+srv://xKQAx:aliasgamer2.0@cluster0.8q0utd9.mongodb.net/')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Middleware para analizar datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your-secret-key', // Cambia esto por una clave secreta segura
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://xKQAx:aliasgamer2.0@cluster0.8q0utd9.mongodb.net/', // Cambia esto según tu configuración de MongoDB
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 día
    }
}));

app.use(authRoutes);

app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    next();
});

// Middleware para pasar el estado del usuario a las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Routes
// Ruta para la página principal
app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/loggedHome'); // Redirige a loggedHome si el usuario está autenticado
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Carga index.html si no está autenticado
});

app.get('/progress', (req, res) => {
    res.render('progress', { title: 'Progreso' });
});

app.get('/practice', (req, res) => {
    res.render('practice', { title: 'Práctica de Suma' });
});

app.get('/numberFriends', (req, res) => {
    res.render('numberFriends', { title: 'Amigos Números' });
});

app.get('/subtraction', (req, res) => {
    res.render('subtraction', { title: 'Ejercicios de Restas' });
});

app.get('/differences', (req, res) => {
    res.render('differences', { title: 'Diferencias entre Números' });
});

app.get('/games', gamesController.renderGames);

// Start the server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});