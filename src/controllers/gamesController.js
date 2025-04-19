exports.renderGames = (req, res) => {
    res.render('games', {
        title: 'Juegos Matemáticos',
        user: req.session?.user || null // Pasar el usuario si está logueado, o null si no
    });
};