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
const progressRoutes = require('./src/routes/progressRoutes');
const User = require('./src/models/userModel');
const isAuthenticated = require('./src/middleware/authMiddleware');

const app = express();
const PORT = 3000;

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Middleware para analizar datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET, // Usa también una variable de entorno para la clave secreta
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 día
    }
}));

// Middleware para registrar solicitudes (logging)
app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    next();
});

// Middleware para hacer el usuario disponible en todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Middleware de autenticación para rutas públicas vs. privadas
app.use((req, res, next) => {
    // Rutas que deben redirigir a loggedHome si el usuario está autenticado
    const publicRoutes = ['/', '/index.html'];
    
    if (req.session.user && publicRoutes.includes(req.path)) {
        return res.redirect('/loggedHome');
    }
    
    next();
});

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Rutas de autenticación
app.use(authRoutes);
app.use(progressRoutes);

// Middleware para rutas públicas que requieren redirección si el usuario no está autentiado
function redirectIfAuthenticated(req, res, next) {
    if (req.session.user) {
        return res.redirect('/loggedHome');
    }
    next();
}

// RUTAS

// Ruta pública principal (para usuarios no autenticados)
app.get('/', redirectIfAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta del home para usuarios autenticados
app.get('/loggedHome', isAuthenticated, (req, res) => {
    res.render('loggedHome', { 
        user: req.session.user,
        cssPath: '/css/loggedHome.css' // Añadimos la ruta CSS
    });
});

// Página de inicio de sesión (solo accesible si no está autenticado)
app.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render('login');
});

// Página de registro (solo accesible si no está autenticado)
app.get('/register', redirectIfAuthenticated, (req, res) => {
    res.render('register');
});

// Página de progreso (requiere autenticación)
app.get('/progress', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        res.render('progress', { user });
    } catch (error) {
        console.error('Error al obtener el progreso del usuario:', error);
        res.status(500).send('Error al cargar la página de progreso');
    }
});

// Otras rutas protegidas
app.get('/practice', isAuthenticated, (req, res) => {
    res.render('practice', { title: 'Práctica de Suma' });
});

app.get('/numberFriends', isAuthenticated, (req, res) => {
    res.render('numberFriends', { user: req.session.user });
});

app.get('/subtraction', isAuthenticated, (req, res) => {
    res.render('subtraction', { user: req.session.user });
});

app.get('/differences', isAuthenticated, (req, res) => {
    res.render('differences', { user: req.session.user });
});

app.get('/games', isAuthenticated, (req, res) => {
    res.render('games', { user: req.session.user });
});

// Servir archivos estáticos (IMPORTANTE: esto debe ir DESPUÉS de definir las rutas principales)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});