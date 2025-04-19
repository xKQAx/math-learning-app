// main.js - Script principal mejorado para la aplicación de aprendizaje matemático
import * as math from 'mathjs';

// Estado global de la aplicación
const appState = {
    currentExerciseIndex: 0,
    exercises: [],
    userProgress: {
        correctAnswers: 0,
        totalAttempts: 0,
        streak: 0
    }
};

// Función para inicializar la aplicación
function init() {
    setupNavigation();
    setupSubtractionExercises();
    setupEventListeners();
    
    // Aplicar estilos adicionales dinámicamente
    applyDynamicStyles();
}

// Aplicar estilos dinámicos
function applyDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .exercise {
            transition: all 0.3s ease;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .exercise.active {
            background-color: #f0f7ff;
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .answer.correct {
            border-color: #4caf50;
            background-color: #e8f5e9;
            animation: pulse-success 1s;
        }
        
        .answer.incorrect {
            border-color: #f44336;
            background-color: #ffebee;
            animation: shake 0.5s;
        }
        
        .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            border-radius: 0;
            opacity: 0;
            pointer-events: none;
            animation: confetti-fall 3s ease-in-out forwards, confetti-shake 2s ease-in-out forwards;
            transform-origin: center;
        }
        
        @keyframes pulse-success {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
        
        @keyframes confetti-fall {
            0% { top: -10%; opacity: 1; }
            80% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        
        @keyframes confetti-shake {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(45deg); }
            50% { transform: rotate(0deg); }
            75% { transform: rotate(-45deg); }
            100% { transform: rotate(0deg); }
        }
        
        .p5-button {
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            background-color: #4a6dff;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
            margin-right: 10px;
        }
        
        .p5-button:hover {
            background-color: #3a5bee;
            transform: translateY(-2px);
        }
        
        .result-box {
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            background-color: #f5f5f5;
            border-left: 5px solid #ccc;
            transition: all 0.5s ease;
        }
        
        .result-box.success {
            background-color: #e8f5e9;
            border-left: 5px solid #4caf50;
        }
        
        .congratulation {
            font-weight: bold;
            color: #2e7d32;
            animation: pulse-success 2s infinite;
        }
        
        .feedback-message {
            margin-top: 10px;
            font-style: italic;
            opacity: 0;
            animation: fade-in 0.5s forwards;
        }
        
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .progress-indicator {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
        }
        
        .progress-dot {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background-color: #ddd;
            transition: all 0.3s ease;
        }
        
        .progress-dot.active {
            background-color: #4a6dff;
            transform: scale(1.2);
        }
        
        .progress-dot.completed {
            background-color: #4caf50;
        }
    `;
    document.head.appendChild(style);
}

// Configurar eventos para la navegación
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Prevenir la navegación predeterminada para SPA
            if (window.location.origin === event.target.origin) {
                event.preventDefault();
                const page = event.target.pathname.replace('/', '') || 'home';
                loadPage(page);
            }
        });
    });
}

// Configurar eventos globales
function setupEventListeners() {
    // Evento de tecla para navegación entre ejercicios
    document.addEventListener('keydown', (event) => {
        // Flechas para navegar entre ejercicios
        if (event.key === 'ArrowRight') {
            navigateToExercise(appState.currentExerciseIndex + 1);
        } else if (event.key === 'ArrowLeft') {
            navigateToExercise(appState.currentExerciseIndex - 1);
        } else if (event.key === 'Enter') {
            // Enter para enviar respuesta del ejercicio actual
            const submitButton = document.getElementById('submit-answers');
            if (submitButton) submitButton.click();
        }
    });
}

// Cargar una página específica
function loadPage(page) {
    console.log(`Cargando página: ${page}`);
    // Aquí implementarías la lógica para cargar el contenido específico
    
    // Si estamos cargando la página de restas, inicializar ejercicios
    if (page === 'subtraction') {
        setupSubtractionExercises();
    }
}

// Configurar los ejercicios de resta
function setupSubtractionExercises() {
    const subtractionContainer = document.getElementById('subtraction-exercises');
    const submitButton = document.getElementById('submit-answers');
    const resultDiv = document.getElementById('result');
    const p5Container = document.getElementById('p5-container');
    
    if (!subtractionContainer || !submitButton) return;
    
    // Crear ejercicios dinámicamente con dificultad progresiva
    appState.exercises = [
        { minuend: 5, subtrahend: 2, result: 3, completed: false },
        { minuend: 5, subtrahend: 3, result: 2, completed: false },
        { minuend: 5, subtrahend: 1, result: 4, completed: false },
        { minuend: 5, subtrahend: 0, result: 5, completed: false },
        { minuend: 8, subtrahend: 3, result: 5, completed: false },
        { minuend: 10, subtrahend: 5, result: 5, completed: false },
        { minuend: 12, subtrahend: 7, result: 5, completed: false },
        { minuend: 15, subtrahend: 8, result: 7, completed: false }
    ];
    
    // Limpiar y generar nuevos ejercicios
    subtractionContainer.innerHTML = '';
    
    // Crear indicador de progreso
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'progress-indicator';
    
    for (let i = 0; i < appState.exercises.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        dot.dataset.index = i;
        dot.addEventListener('click', () => navigateToExercise(i));
        progressIndicator.appendChild(dot);
    }
    
    subtractionContainer.appendChild(progressIndicator);
    
    // Generar ejercicios
    appState.exercises.forEach((ex, index) => {
        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'exercise';
        exerciseDiv.dataset.index = index;
        exerciseDiv.style.display = index === appState.currentExerciseIndex ? 'block' : 'none';
        
        const problem = document.createElement('p');
        problem.textContent = `${ex.minuend} - ${ex.subtrahend} = ?`;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'answer';
        input.dataset.correct = ex.result;
        input.placeholder = 'Tu respuesta';
        
        // Agregar evento para visualizar al hacer focus
        input.addEventListener('focus', () => {
            updateVisualization(ex.minuend, ex.subtrahend);
            highlightCurrentExercise(index);
        });
        
        // Verificación en tiempo real
        input.addEventListener('input', (e) => {
            // Limpiar clases previas
            input.classList.remove('correct', 'incorrect');
            
            // Si hay un valor, verificar
            if (e.target.value !== '') {
                const userAnswer = parseInt(e.target.value, 10);
                const correctAnswer = parseInt(input.dataset.correct, 10);
                
                // Verificar después de un corto retraso para evitar verificaciones rápidas
                setTimeout(() => {
                    if (e.target.value === input.value) { // Asegurarse de que sea el último valor
                        if (userAnswer === correctAnswer) {
                            input.classList.add('correct');
                            showFeedback(exerciseDiv, true);
                        } else {
                            input.classList.add('incorrect');
                            showFeedback(exerciseDiv, false);
                        }
                    }
                }, 500);
            }
        });
        
        exerciseDiv.appendChild(problem);
        exerciseDiv.appendChild(input);
        
        // Agregar espacio para feedback
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'feedback-message';
        exerciseDiv.appendChild(feedbackDiv);
        
        subtractionContainer.appendChild(exerciseDiv);
    });
    
    // Agregar controles de navegación
    const navigationControls = document.createElement('div');
    navigationControls.className = 'navigation-controls';
    navigationControls.style.display = 'flex';
    navigationControls.style.justifyContent = 'space-between';
    navigationControls.style.marginTop = '20px';
    
    const prevButton = document.createElement('button');
    prevButton.textContent = '← Anterior';
    prevButton.className = 'p5-button';
    prevButton.addEventListener('click', () => navigateToExercise(appState.currentExerciseIndex - 1));
    
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente →';
    nextButton.className = 'p5-button';
    nextButton.addEventListener('click', () => navigateToExercise(appState.currentExerciseIndex + 1));
    
    navigationControls.appendChild(prevButton);
    navigationControls.appendChild(nextButton);
    
    subtractionContainer.appendChild(navigationControls);
    
    // Configurar el botón para verificar respuestas
    submitButton.addEventListener('click', () => {
        const currentExercise = document.querySelector(`.exercise[data-index="${appState.currentExerciseIndex}"]`);
        const answer = currentExercise.querySelector('.answer');
        const userAnswer = parseInt(answer.value, 10);
        
        if (isNaN(userAnswer)) {
            showFeedback(currentExercise, null, "Por favor ingresa un número");
            return;
        }
        
        const correctAnswer = parseInt(answer.dataset.correct, 10);
        
        // Actualizar estado del ejercicio
        if (userAnswer === correctAnswer) {
            answer.classList.add('correct');
            appState.exercises[appState.currentExerciseIndex].completed = true;
            appState.userProgress.correctAnswers++;
            appState.userProgress.streak++;
            
            updateProgressIndicator();
            showFeedback(currentExercise, true);
            
            // Mostrar resultado
            resultDiv.innerHTML = `
                <div class="result-box success">
                    <h3>¡Correcto!</h3>
                    <p>${appState.exercises[appState.currentExerciseIndex].minuend} - ${appState.exercises[appState.currentExerciseIndex].subtrahend} = ${correctAnswer}</p>
                    <p class="congratulation">¡Muy bien! Has resuelto correctamente el ejercicio.</p>
                </div>
            `;
            
            // Animación de celebración
            celebrateSuccess('small');
            
            // Avanzar automáticamente al siguiente ejercicio después de un éxito
            setTimeout(() => {
                navigateToExercise(appState.currentExerciseIndex + 1);
            }, 2000);
        } else {
            answer.classList.add('incorrect');
            appState.userProgress.streak = 0;
            
            // Mostrar resultado
            resultDiv.innerHTML = `
                <div class="result-box">
                    <h3>Incorrecto</h3>
                    <p>La respuesta ${userAnswer} no es correcta. Intenta de nuevo.</p>
                    <p>Pista: Observa la visualización y cuenta los objetos que quedan después de restar ${appState.exercises[appState.currentExerciseIndex].subtrahend}.</p>
                </div>
            `;
            
            showFeedback(currentExercise, false);
        }
        
        appState.userProgress.totalAttempts++;
    });
    
    // Actualizar progreso visual
    updateProgressIndicator();
    
    // Inicializar la visualización P5.js para el primer ejercicio
    if (appState.exercises.length > 0) {
        const firstExercise = appState.exercises[appState.currentExerciseIndex];
        updateVisualization(firstExercise.minuend, firstExercise.subtrahend);
        highlightCurrentExercise(appState.currentExerciseIndex);
    }
}

// Navegación entre ejercicios
function navigateToExercise(index) {
    // Validar el índice
    if (index < 0 || index >= appState.exercises.length) return;
    
    // Ocultar ejercicio actual
    const currentExerciseDiv = document.querySelector(`.exercise[data-index="${appState.currentExerciseIndex}"]`);
    if (currentExerciseDiv) {
        currentExerciseDiv.style.display = 'none';
        currentExerciseDiv.classList.remove('active');
    }
    
    // Actualizar índice actual
    appState.currentExerciseIndex = index;
    
    // Mostrar nuevo ejercicio
    const newExerciseDiv = document.querySelector(`.exercise[data-index="${index}"]`);
    if (newExerciseDiv) {
        newExerciseDiv.style.display = 'block';
        newExerciseDiv.classList.add('active');
    }
    // Actualizar visualización
    const exercise = appState.exercises[index];
    updateVisualization(exercise.minuend, exercise.subtrahend);
    highlightCurrentExercise(index);
    updateProgressIndicator();
}
// Actualizar el indicador de progreso
function updateProgressIndicator() {
    const progressDots = document.querySelectorAll('.progress-dot');
    progressDots.forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        if (index < appState.currentExerciseIndex) {
            dot.classList.add('completed');
        } else if (index === appState.currentExerciseIndex) {
            dot.classList.add('active');
        }
    });
}
// Mostrar feedback
function showFeedback(exerciseDiv, isCorrect, message) {
    const feedbackDiv = exerciseDiv.querySelector('.feedback-message');
    feedbackDiv.textContent = isCorrect === null ? message : (isCorrect ? "¡Bien hecho!" : "Intenta de nuevo.");
    feedbackDiv.style.opacity = 1;
}
// Resaltar el ejercicio actual
function highlightCurrentExercise(index) {
    const exercises = document.querySelectorAll('.exercise');
    exercises.forEach((ex, i) => {
        if (i === index) {
            ex.classList.add('active');
        } else {
            ex.classList.remove('active');
        }
    });
}
// Actualizar visualización P5.js
function updateVisualization(minuend, subtrahend) {
    // Aquí puedes implementar la lógica para actualizar la visualización de P5.js
    console.log(`Actualizando visualización: ${minuend} - ${subtrahend}`);
    // Por ejemplo, podrías dibujar círculos o rectángulos en un canvas
}
// Celebrar éxito con animación
function celebrateSuccess(size) {
    const confetti = document.createElement('div');
    confetti.className = `confetti ${size}`;
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 3000);
}
// Inicializar la aplicación al cargar
document.addEventListener('DOMContentLoaded', init);
document.addEventListener('DOMContentLoaded', () => {
    console.log('¡Bienvenido al Aprendizaje de Matemáticas!');

    const submitButton = document.getElementById('submit-answers');

    if (submitButton) {
        submitButton.addEventListener('click', () => {
            const exercises = document.querySelectorAll('.exercise');

            exercises.forEach(exercise => {
                const input = exercise.querySelector('.answer');
                const userAnswer = parseInt(input.value, 10);
                const correctAnswer = parseInt(input.getAttribute('data-correct'), 10);

                // Crear o actualizar el mensaje de feedback
                let feedback = exercise.querySelector('.feedback');
                if (!feedback) {
                    feedback = document.createElement('p');
                    feedback.classList.add('feedback');
                    exercise.appendChild(feedback);
                }

                // Validar la respuesta
                if (userAnswer === correctAnswer) {
                    feedback.textContent = '¡Correcto!';
                    feedback.style.color = 'green';
                    input.style.borderColor = 'green';
                } else if (isNaN(userAnswer)) {
                    feedback.textContent = 'Por favor, ingresa un número.';
                    feedback.style.color = 'orange';
                    input.style.borderColor = 'orange';
                } else {
                    feedback.textContent = `Incorrecto. La respuesta correcta es ${correctAnswer}`;
                    feedback.style.color = 'red';
                    input.style.borderColor = 'red';
                }
            });
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    console.log('¡Validación de respuestas activada!');

    const submitButton = document.getElementById('submit-answers');

    if (submitButton) {
        submitButton.addEventListener('click', () => {
            const exercises = document.querySelectorAll('.exercise'); // Selecciona todos los ejercicios

            exercises.forEach(exercise => {
                const input = exercise.querySelector('.answer'); // Campo de entrada
                const userAnswer = parseInt(input.value, 10); // Respuesta del usuario
                const correctAnswer = parseInt(input.getAttribute('data-correct'), 10); // Respuesta correcta

                // Crear o actualizar el mensaje de feedback
                let feedback = exercise.querySelector('.feedback');
                if (!feedback) {
                    feedback = document.createElement('p');
                    feedback.classList.add('feedback');
                    exercise.appendChild(feedback);
                }

                // Validar la respuesta
                if (userAnswer === correctAnswer) {
                    feedback.textContent = '¡Correcto!';
                    feedback.style.color = 'green';
                    input.style.borderColor = 'green';
                } else if (isNaN(userAnswer)) {
                    feedback.textContent = 'Por favor, ingresa un número.';
                    feedback.style.color = 'orange';
                    input.style.borderColor = 'orange';
                } else {
                    feedback.textContent = `Incorrecto. La respuesta correcta es ${correctAnswer}`;
                    feedback.style.color = 'red';
                    input.style.borderColor = 'red';
                }
            });
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    console.log('¡Validación de ejercicios activada!');

    const exercises = [
        { question: '5 - 2 = ?', correctAnswer: 3 },
        { question: '5 - 3 = ?', correctAnswer: 2 },
        { question: '5 - 1 = ?', correctAnswer: 4 },
        { question: '5 - 0 = ?', correctAnswer: 5 }
    ];

    let currentExerciseIndex = 0;

    const exerciseContainer = document.getElementById('current-exercise');
    const nextButton = document.getElementById('next-exercise');
    const resultDiv = document.getElementById('result');

    // Función para cargar el ejercicio actual
    function loadExercise(index) {
        const exercise = exercises[index];
        exerciseContainer.innerHTML = `
            <p>${exercise.question}</p>
            <input type="number" id="user-answer" placeholder="Tu respuesta">
            <p id="feedback" style="color: gray;"></p>
        `;
        nextButton.disabled = true; // Deshabilitar el botón hasta que se valide la respuesta
    }

    // Función para validar la respuesta
    function validateAnswer() {
        const userAnswerInput = document.getElementById('user-answer');
        const feedback = document.getElementById('feedback');
        const userAnswer = parseInt(userAnswerInput.value, 10);
        const correctAnswer = exercises[currentExerciseIndex].correctAnswer;

        if (isNaN(userAnswer)) {
            feedback.textContent = 'Por favor, ingresa un número.';
            feedback.style.color = 'orange';
            nextButton.disabled = true;
        } else if (userAnswer === correctAnswer) {
            feedback.textContent = '¡Correcto!';
            feedback.style.color = 'green';
            nextButton.disabled = false; // Habilitar el botón "Siguiente ejercicio"
        } else {
            feedback.textContent = `Incorrecto. La respuesta correcta es ${correctAnswer}`;
            feedback.style.color = 'red';
            nextButton.disabled = true;
        }
    }

    // Función para avanzar al siguiente ejercicio
    function nextExercise() {
        if (currentExerciseIndex < exercises.length - 1) {
            currentExerciseIndex++;
            loadExercise(currentExerciseIndex);
        } else {
            exerciseContainer.innerHTML = '<p>¡Has completado todos los ejercicios!</p>';
            nextButton.disabled = true;
        }
    }

    // Eventos
    exerciseContainer.addEventListener('input', validateAnswer);
    nextButton.addEventListener('click', nextExercise);

    // Cargar el primer ejercicio
    loadExercise(currentExerciseIndex);
});
// Exportar funciones para pruebas unitarias
export { appState, init, loadPage, setupSubtractionExercises, navigateToExercise, updateProgressIndicator, showFeedback, highlightCurrentExercise, updateVisualization };
// Exportar funciones de utilidad
export { celebrateSuccess, applyDynamicStyles };
// Exportar funciones de prueba
export { setupEventListeners, setupNavigation };

exports.renderLogin = (req, res) => {
    res.render('login', {
        title: 'Inicio de Sesión',
        user: req.session?.user || null // Pasar el usuario si está logueado, o null si no
    });
};
