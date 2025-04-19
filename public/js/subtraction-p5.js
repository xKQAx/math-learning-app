// subtraction-p5.js - Visualización interactiva mejorada de restas con p5.js

let exercises = [
    { minuend: 5, subtrahend: 0, correctAnswer: 5 },
    { minuend: 5, subtrahend: 1, correctAnswer: 4 },
    { minuend: 5, subtrahend: 2, correctAnswer: 3 },
    { minuend: 5, subtrahend: 3, correctAnswer: 2 },
    { minuend: 5, subtrahend: 4, correctAnswer: 1 },
    { minuend: 5, subtrahend: 5, correctAnswer: 0 },
];

let currentExerciseIndex = 0;
let circles = [];
let removedCount = 0;

function setup() {
    console.log('p5.js inicializado');
    let canvas = createCanvas(400, 200); // Reducir el tamaño del lienzo
    canvas.parent('p5-container');
    loadExercise(currentExerciseIndex);
}

function draw() {
    background(240);

    // Dibujar los círculos
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        if (circle.active) {
            fill(circle.color);
            stroke(0); // Agregar borde negro
            strokeWeight(2);
            ellipse(circle.x, circle.y, circle.size);
        }
    }

    // Mostrar el resultado de la resta debajo del lienzo
    const resultDiv = document.getElementById('result');
    const exercise = exercises[currentExerciseIndex];
    const currentResult = exercise.minuend - removedCount;
    resultDiv.innerHTML = `
        <div class="result-box">
            <p><strong>Resultado actual:</strong></p>
            <p class="operation"><span>${exercise.minuend} - ${removedCount}</span> = <span class="result-value">${currentResult}</span></p>
        </div>
    `;
}

// Actualizar la barra de progreso
function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    const percentage = ((currentExerciseIndex + 1) / exercises.length) * 100; // Corregido
    progressBar.style.width = `${percentage}%`;
}

// Reiniciar la barra de progreso
function resetProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = '0%';
}

// Validar la respuesta del usuario
function validateAnswerInput(inputElement) {
    inputElement.addEventListener('input', () => {
        // Eliminar caracteres no numéricos
        inputElement.value = inputElement.value.replace(/[^0-9]/g, '');

        // Limitar el rango entre 0 y 50
        if (inputElement.value !== '') {
            const value = parseInt(inputElement.value, 10);
            if (value < 0) {
                inputElement.value = 0;
            } else if (value > 50) {
                inputElement.value = 50;
            }
        }
    });
}

// Cargar el ejercicio actual
function loadExercise(index) {
    const exercise = exercises[index];
    console.log(`Cargando ejercicio: ${exercise.minuend} - ${exercise.subtrahend}`);
    circles = [];
    removedCount = 0;

    // Crear los círculos para el minuendo
    const startX = width / 2 - (exercise.minuend * 50) / 2; // Centrar los círculos
    for (let i = 0; i < exercise.minuend; i++) {
        circles.push({
            x: startX + i * 50,
            y: height / 2,
            size: 60, // Tamaño de los círculos
            color: '#4a6dff',
            active: true,
        });
    }

    // Actualizar el texto del ejercicio
    const exerciseContainer = document.getElementById('current-exercise');
    exerciseContainer.innerHTML = `
        <p style="font-size: 1.5rem; font-weight: bold;">${exercise.minuend} - ${exercise.subtrahend} = ?</p>
        <input type="number" id="user-answer" placeholder="Tu respuesta" style="font-size: 1.2rem; padding: 0.5rem;">
        <p id="feedback" style="color: gray; font-size: 1.2rem;"></p>
    `;

    // Deshabilitar el botón "Siguiente ejercicio"
    const nextButton = document.getElementById('next-exercise');
    nextButton.disabled = true;

    // Validar la respuesta
    const userAnswerInput = document.getElementById('user-answer');
    validateAnswerInput(userAnswerInput); // Aplicar validación al campo
    userAnswerInput.addEventListener('input', () => validateAnswer(exercise, userAnswerInput, nextButton));

    // Actualizar la barra de progreso
    updateProgressBar();

    // Asociar el evento al botón "Siguiente ejercicio"
    nextButton.addEventListener('click', nextExercise);
}

// Detectar clics en los círculos
function mousePressed() {
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        if (circle.active && dist(mouseX, mouseY, circle.x, circle.y) < circle.size / 2) {
            circle.active = false; // Desactivar el círculo
            removedCount++; // Incrementar el conteo de círculos eliminados
            break;
        }
    }
}

// Validar la respuesta
function validateAnswer(exercise, userAnswerInput, nextButton) {
    const userAnswer = parseInt(userAnswerInput.value, 10);
    const feedback = document.getElementById('feedback');

    if (isNaN(userAnswer)) {
        feedback.textContent = 'Por favor, ingresa un número.';
        feedback.style.color = 'orange';
        nextButton.disabled = true;
    } else if (userAnswer === exercise.correctAnswer) {
        feedback.textContent = '¡Correcto!';
        feedback.style.color = 'green';
        nextButton.disabled = false;
    } else {
        feedback.textContent = `Incorrecto. La respuesta correcta es ${exercise.correctAnswer}`;
        feedback.style.color = 'red';
        nextButton.disabled = true;
    }
}

// Reiniciar el ejercicio actual
function resetExercise() {
    loadExercise(currentExerciseIndex); // Recargar el ejercicio actual
    updateProgressBar(); // Mantener el progreso actual
}

// Mostrar pista
function showHint() {
    const exercise = exercises[currentExerciseIndex];
    for (let i = 0; i < exercise.subtrahend; i++) {
        circles[i].color = '#ffcc00'; // Cambiar el color de los círculos que deben eliminarse
    }
}

// Resolver paso a paso
function autoSolve() {
    const exercise = exercises[currentExerciseIndex];
    let removed = 0;

    const interval = setInterval(() => {
        if (removed < exercise.subtrahend) {
            circles[removed].active = false; // Desactivar el círculo
            removedCount++;
            removed++;
        } else {
            clearInterval(interval);
        }
    }, 500);
}

// Avanzar al siguiente ejercicio
function nextExercise() {
    if (currentExerciseIndex < exercises.length - 1) {
        currentExerciseIndex++;
        loadExercise(currentExerciseIndex);
    } else {
        const exerciseContainer = document.getElementById('current-exercise');
        exerciseContainer.innerHTML = '<p>¡Has completado todos los ejercicios!</p>';
        const nextButton = document.getElementById('next-exercise');
        nextButton.disabled = true;

        // Actualizar la barra de progreso al 100%
        currentExerciseIndex = exercises.length; // Asegurarse de que el índice refleje el progreso completo
        updateProgressBar();
    }
}

// Asociar los botones a sus eventos
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('reset-exercise').addEventListener('click', resetExercise);
    document.getElementById('show-hint').addEventListener('click', showHint);
    document.getElementById('auto-solve').addEventListener('click', autoSolve);
    document.getElementById('next-exercise').addEventListener('click', nextExercise);
});
