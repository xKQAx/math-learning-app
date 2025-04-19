const homeController = {
    renderHome: (req, res) => {
        res.render('home', {
            title: 'Home - Math Learning App',
            message: 'Welcome to the Math Learning App! Let\'s have fun learning math together!'
        });
    }
};

module.exports = homeController;