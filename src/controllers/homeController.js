const renderHome = (req, res) => {
    const isLoggedIn = req.session?.user ? true : false; // Verificar si el usuario está logueado
    const user = req.session?.user || null; // Obtener los datos del usuario si está logueado

    res.render('home', { isLoggedIn, user });
};

module.exports = {
    renderHome,
};