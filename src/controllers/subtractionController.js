const subtractionExercises = (req, res) => {
    const exercises = [
        { question: "5 - 0", answer: 5 },
        { question: "5 - 1", answer: 4 },
        { question: "5 - 2", answer: 3 },
        { question: "5 - 3", answer: 2 },
        { question: "5 - 4", answer: 1 },
        { question: "5 - 5", answer: 0 },
    ];

    res.render('subtraction', { exercises });
};

const checkAnswer = (req, res) => {
    const { userAnswer, exerciseIndex } = req.body;
    const correctAnswers = [5, 4, 3, 2, 1, 0];
    const isCorrect = parseInt(userAnswer) === correctAnswers[exerciseIndex];

    res.json({ isCorrect });
};

module.exports = {
    subtractionExercises,
    checkAnswer,
};