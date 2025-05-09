const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); // Continúa con la siguiente función de middleware o ruta
    }
    res.redirect('/login'); // Redirige al usuario a la página de inicio de sesión si no está autenticado
};

module.exports = isAuthenticated;