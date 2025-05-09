const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const isAuthenticated = require('../middleware/authMiddleware'); // Requerir el middleware correctamente

// Rutas de autenticación
router.get('/register', authController.renderRegister);
router.post('/register', authController.register);
router.get('/login', authController.renderLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Ruta protegida para la página de inicio después de iniciar sesión
router.get('/loggedHome', isAuthenticated, (req, res) => {
    res.render('loggedHome', { user: req.session.user });
});

module.exports = router;