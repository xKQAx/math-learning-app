const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// Renderizar la página de registro
const renderRegister = (req, res) => {
    res.render('register');
};

// Registrar un nuevo usuario
const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('El correo ya está registrado.');
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send('Error al registrar el usuario.');
    }
};

// Renderizar la página de inicio de sesión
const renderLogin = (req, res) => {
    res.render('login', {
        title: 'Inicio de Sesión',
        user: req.session?.user || null // Pasar el usuario si está logueado, o null si no
    });
};

// Iniciar sesión
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario por correo
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Correo o contraseña incorrectos.');
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Correo o contraseña incorrectos.');
        }

        // Guardar el usuario en la sesión
        req.session.user = user; // Aquí se guarda el usuario en la sesión
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al iniciar sesión.');
    }
};

// Cerrar sesión
const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al cerrar sesión.');
        }
        res.redirect('/login');
    });
};

const loginUser = (req, res) => {
    const { email, password } = req.body;

    // Simulación de autenticación (reemplaza con tu lógica real)
    if (email === "santiagocacuav@gmail.com" && password === "aliasgamer2.0") {
        req.session.user = { email }; // Guarda al usuario en la sesión
        return res.redirect('/loggedHome'); // Redirige a loggedHome.ejs
    }

    // Si las credenciales son incorrectas
    res.status(401).render('login', { error: 'Credenciales inválidas' });
};

module.exports = {
    renderRegister,
    register,
    renderLogin,
    login,
    logout,
    loginUser
};