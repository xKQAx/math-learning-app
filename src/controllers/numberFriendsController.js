const numberFriendsController = {
    getNumberFriendsPage: (req, res) => {
        res.render('numberFriends', {
            title: 'Number Friends',
            message: 'Welcome to the Number Friends interactive feature! Here you can learn about numbers in a fun way.'
        });
    },

    generateNumberFriendsActivity: (req, res) => {
        const activity = {
            numbers: numberFriendsController.getRandomNumbers(1, 20, 5), // Generar 5 números aleatorios entre 1 y 20
            instructions: 'Can you find the sum of these numbers?'
        };
        res.json(activity);
    },

    getRandomNumbers: (min, max, count) => {
        const numbers = [];
        while (numbers.length < count) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
        return numbers;
    }
};

module.exports = numberFriendsController;