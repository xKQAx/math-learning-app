const differencesController = {
    getDifferencesPage: (req, res) => {
        res.render('differences', {
            title: 'Diferencias entre Números',
            description: 'Practica encontrando la diferencia entre dos números.'
        });
    },

    calculateDifference: (req, res) => {
        const { number1, number2 } = req.body;
        const difference = Math.abs(number1 - number2);
        res.json({ difference });
    }
};

module.exports = differencesController;