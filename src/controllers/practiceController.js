const practiceController = {
    generateMathProblem: function() {
        const operation = Math.random() < 0.5 ? 'addition' : 'subtraction';
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;

        let problem;
        let answer;

        if (operation === 'addition') {
            problem = `${num1} + ${num2}`;
            answer = num1 + num2;
        } else {
            problem = `${num1} - ${num2}`;
            answer = num1 - num2;
        }

        return { problem, answer };
    },

    handlePracticeRequest: function(req, res) {
        const mathProblem = this.generateMathProblem();
        res.render('practice', { problem: mathProblem.problem, answer: mathProblem.answer });
    }
};

module.exports = practiceController;