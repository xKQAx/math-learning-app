/**
 * Number Friends - Juego interactivo para aprender sumas de números menores a 20
 * Diseñado para niños de primaria
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const gameIntro = document.getElementById('game-intro');
    const gamePlay = document.getElementById('game-play');
    const gameEnd = document.getElementById('game-end');
    const startGameBtn = document.getElementById('start-game');
    const nextProblemBtn = document.getElementById('next-problem');
    const playAgainBtn = document.getElementById('play-again');
    const firstNumber = document.getElementById('first-number');
    const secondNumber = document.getElementById('second-number');
    const resultNumber = document.getElementById('result-number');
    const firstNumberText = document.getElementById('first-number-text');
    const resultNumberText = document.getElementById('result-number-text');
    const numberOptions = document.getElementById('number-options');
    const resultFeedback = document.getElementById('result-feedback');
    const currentLevelEl = document.getElementById('current-level');
    const levelProgressBar = document.getElementById('level-progress');
    const finalScoreEl = document.getElementById('final-score');
    const totalProblemsEl = document.getElementById('total-problems');
    
    // Variables del juego
    let currentLevel = 1;
    let totalLevels = 5;
    let problemsPerLevel = 5;
    let totalProblems = totalLevels * problemsPerLevel;
    let currentProblemInLevel = 0;
    let score = 0;
    let currentProblem = {};
    
    // Configuración de niveles de dificultad
    const levelConfig = {
        1: { minSum: 5, maxSum: 10, minFirst: 1, maxFirst: 5 },
        2: { minSum: 6, maxSum: 12, minFirst: 2, maxFirst: 7 },
        3: { minSum: 8, maxSum: 15, minFirst: 3, maxFirst: 9 },
        4: { minSum: 10, maxSum: 18, minFirst: 4, maxFirst: 12 },
        5: { minSum: 12, maxSum: 20, minFirst: 5, maxFirst: 15 }
    };
    
    // Sonidos del juego (se simularán con efectos visuales)
    const playSound = (type) => {
        // En una implementación real, aquí reproducirías sonidos
        console.log(`Playing ${type} sound`);
    };
    
    // Iniciar el juego
    startGameBtn.addEventListener('click', () => {
        gameIntro.style.display = 'none';
        gamePlay.style.display = 'block';
        initLevel(currentLevel);
    });
    
    // Iniciar nuevo nivel
    function initLevel(level) {
        currentProblemInLevel = 0;
        updateLevelInfo();
        generateProblem();
    }
    
    // Generar un nuevo problema basado en el nivel actual
    function generateProblem() {
        const config = levelConfig[currentLevel];
        
        // Generar número resultado (suma total)
        const sum = getRandomInt(config.minSum, config.maxSum);
        
        // Generar primer número
        const first = getRandomInt(config.minFirst, Math.min(config.maxFirst, sum - 1));
        
        // Calcular segundo número (la respuesta)
        const second = sum - first;
        
        currentProblem = {
            first: first,
            second: second,
            sum: sum
        };
        
        // Actualizar la interfaz
        displayProblem(currentProblem);
    }
    
    // Mostrar el problema en la interfaz
    function displayProblem(problem) {
        // Actualizar números en el problema
        firstNumber.querySelector('.character-body').textContent = problem.first;
        resultNumber.querySelector('.character-body').textContent = problem.sum;
        
        // Reiniciar el segundo número como incógnita
        secondNumber.querySelector('.character-body').textContent = '?';
        
        // Actualizar textos de instrucción
        firstNumberText.textContent = problem.first;
        resultNumberText.textContent = problem.sum;
        
        // Generar opciones de respuesta
        generateOptions(problem);
        
        // Reiniciar feedback
        resultFeedback.textContent = '';
        resultFeedback.className = 'result-feedback';
        
        // Ocultar botón "siguiente"
        nextProblemBtn.style.display = 'none';
        
        // Animar el primer número para que muestre curiosidad
        animateCharacterCuriosity(firstNumber);
    }
    
    // Generar opciones de respuesta
    function generateOptions(problem) {
        // Limpiar opciones anteriores
        numberOptions.innerHTML = '';
        
        // La respuesta correcta
        const correctAnswer = problem.second;
        
        // Crear un conjunto de posibles opciones que incluye la respuesta correcta
        let options = [correctAnswer];
        
        // Añadir opciones incorrectas pero cercanas al rango de nivel actual
        while (options.length < 4) {
            const config = levelConfig[currentLevel];
            let option;
            
            // 50% de probabilidad de que la opción sea cercana a la respuesta correcta
            if (Math.random() < 0.5) {
                // Opción cercana (±3)
                const offset = getRandomInt(1, 3) * (Math.random() < 0.5 ? 1 : -1);
                option = correctAnswer + offset;
            } else {
                // Opción del rango del nivel
                option = getRandomInt(1, Math.min(10, config.maxSum - 1));
            }
            
            // Asegurarse de que la opción esté entre 1 y 19, y no sea igual a otras opciones
            if (option >= 1 && option <= 19 && !options.includes(option)) {
                options.push(option);
            }
        }
        
        // Barajar las opciones
        options = shuffleArray(options);
        
        // Crear elementos en la interfaz para cada opción
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'number-option';
            optionElement.textContent = option;
            
            // Añadir evento de clic
            optionElement.addEventListener('click', () => selectOption(option, correctAnswer, optionElement));
            
            numberOptions.appendChild(optionElement);
        });
    }
    
    // Manejar selección de una opción
    function selectOption(selectedOption, correctAnswer, optionElement) {
        // Prevenir múltiples selecciones
        if (nextProblemBtn.style.display === 'block') return;
        
        const isCorrect = selectedOption === correctAnswer;
        
        // Añadir clase seleccionada
        optionElement.classList.add('selected');
        
        // Deshabilitar otras opciones
        disableAllOptions();
        
        // Mostrar feedback visual
        if (isCorrect) {
            // Respuesta correcta
            resultFeedback.textContent = '¡Correcto! ¡Muy bien!';
            resultFeedback.className = 'result-feedback correct-answer';
            score++;
            
            // Mostrar la respuesta en el problema
            secondNumber.querySelector('.character-body').textContent = correctAnswer;
            
            // Animar personajes felices
            animateHappyCharacters();
            
            // Reproducir sonido de éxito
            playSound('success');
        } else {
            // Respuesta incorrecta
            resultFeedback.textContent = `¡Inténtalo de nuevo! La respuesta es ${correctAnswer}`;
            resultFeedback.className = 'result-feedback wrong-answer';
            
            // Mostrar la respuesta correcta
            secondNumber.querySelector('.character-body').textContent = correctAnswer;
            
            // Animar personajes tristes
            animateSadCharacters();
            
            // Reproducir sonido de error
            playSound('error');
        }
        
        // Mostrar botón para siguiente problema
        nextProblemBtn.style.display = 'block';
    }
    
    // Deshabilitar todas las opciones de respuesta
    function disableAllOptions() {
        const options = document.querySelectorAll('.number-option');
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
    }
    
    // Manejar el botón de siguiente problema
    nextProblemBtn.addEventListener('click', () => {
        currentProblemInLevel++;
        
        // Verificar si terminamos el nivel actual
        if (currentProblemInLevel >= problemsPerLevel) {
            // Avanzar al siguiente nivel
            currentLevel++;
            
            // Verificar si terminamos todos los niveles
            if (currentLevel > totalLevels) {
                // Fin del juego
                showGameEnd();
                return;
            }
            
            // Iniciar nuevo nivel
            initLevel(currentLevel);
        } else {
            // Continuar con el nivel actual
            updateLevelInfo();
            generateProblem();
        }
    });
    
    // Mostrar pantalla de fin de juego
    function showGameEnd() {
        gamePlay.style.display = 'none';
        gameEnd.style.display = 'block';
        
        // Mostrar puntuación final
        finalScoreEl.textContent = score;
        totalProblemsEl.textContent = totalProblems;
        
        // Aplicar animación a las estrellas según la puntuación
        const stars = document.querySelectorAll('.fa-star');
        const percentage = score / totalProblems;
        
        if (percentage >= 0.8) {
            // 3 estrellas
            stars.forEach(star => star.classList.add('bounce'));
        } else if (percentage >= 0.6) {
            // 2 estrellas
            stars[0].classList.add('bounce');
            stars[1].classList.add('bounce');
        } else if (percentage >= 0.3) {
            // 1 estrella
            stars[0].classList.add('bounce');
        }
    }
    
    // Reiniciar el juego
    playAgainBtn.addEventListener('click', () => {
        // Reiniciar variables del juego
        currentLevel = 1;
        currentProblemInLevel = 0;
        score = 0;
        
        // Ocultar pantalla de fin y mostrar juego
        gameEnd.style.display = 'none';
        gamePlay.style.display = 'block';
        
        // Iniciar desde el primer nivel
        initLevel(currentLevel);
    });
    
    // Funciones de animación para los personajes
    function animateCharacterCuriosity(character) {
        // Animar ojos para mostrar curiosidad
        const eyes = character.querySelectorAll('.eye');
        const mouth = character.querySelector('.mouth');
        
        // Restablecer clases
        character.classList.remove('bounce');
        
        // Aplicar animaciones
        eyes.forEach(eye => {
            eye.style.transform = 'scale(1.2)';
            setTimeout(() => { eye.style.transform = 'scale(1)'; }, 500);
        });
        
        mouth.style.width = '20px';
        setTimeout(() => { mouth.style.width = '24px'; }, 500);
    }
    
    function animateHappyCharacters() {
        const characters = document.querySelectorAll('.number-character');
        characters.forEach(char => {
            char.classList.add('bounce');
            const mouth = char.querySelector('.mouth');
            if (mouth) {
                mouth.classList.add('big-smile');
            }
        });
        
        resultNumber.classList.add('glow');
        
        // Quitar animaciones después de un tiempo
        setTimeout(() => {
            characters.forEach(char => {
                char.classList.remove('bounce');
                const mouth = char.querySelector('.mouth');
                if (mouth) {
                    mouth.classList.remove('big-smile');
                }
            });
            
            resultNumber.classList.remove('glow');
        }, 1500);
    }
    
    function animateSadCharacters() {
        const firstCharacter = firstNumber;
        const secondCharacter = secondNumber;
        
        // Animar boca triste
        const firstMouth = firstCharacter.querySelector('.mouth');
        const secondMouth = secondCharacter.querySelector('.mouth');
        
        if (firstMouth) {
            firstMouth.style.borderRadius = '12px 12px 0 0';
            firstMouth.style.borderBottom = 'none';
            firstMouth.style.borderTop = '3px solid #333';
            setTimeout(() => {
                firstMouth.style.borderRadius = '0 0 12px 12px';
                firstMouth.style.borderBottom = '3px solid #333';
                firstMouth.style.borderTop = 'none';
            }, 1500);
        }
        
        if (secondMouth) {
            secondMouth.style.borderRadius = '12px 12px 0 0';
            secondMouth.style.borderBottom = 'none';
            secondMouth.style.borderTop = '3px solid #333';
            setTimeout(() => {
                secondMouth.style.borderRadius = '0 0 12px 12px';
                secondMouth.style.borderBottom = '3px solid #333';
                secondMouth.style.borderTop = 'none';
            }, 1500);
        }
    }
    
    // Actualizar la información de nivel y progreso
    function updateLevelInfo() {
        currentLevelEl.textContent = currentLevel;
        
        // Calcular y actualizar progreso
        const progress = (currentProblemInLevel / problemsPerLevel) * 100;
        levelProgressBar.style.width = `${progress}%`;
    }
    
    // Funciones de utilidad
    
    // Obtener número aleatorio entre min y max (ambos incluidos)
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Barajar un array (algoritmo Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Función para visualizar objetos de números
    function visualizeNumber(number) {
        // Esta función podría expandirse para mostrar representaciones visuales
        // como bloques, puntos o agrupaciones de objetos que representen el número
        console.log(`Visualizing number: ${number}`);
    }
    
    // Función de accesibilidad - leer instrucciones en voz alta (simulada)
    function readInstructions() {
        const instructions = document.querySelector('.game-instruction').textContent;
        console.log(`Reading aloud: ${instructions}`);
        // En implementación real, utilizaría la API de síntesis de voz
    }
    
    // Añadir eventos adicionales para interactividad
    
    // Efecto hover en personajes
    const allCharacters = document.querySelectorAll('.number-character');
    allCharacters.forEach(character => {
        character.addEventListener('mouseover', () => {
            const eyes = character.querySelectorAll('.eye');
            eyes.forEach(eye => {
                eye.style.transform = 'scale(1.1)';
            });
        });
        
        character.addEventListener('mouseout', () => {
            const eyes = character.querySelectorAll('.eye');
            eyes.forEach(eye => {
                eye.style.transform = 'scale(1)';
            });
        });
    });
    
    // Easter egg - Hacer doble clic en el número resultado muestra una visualización especial
    resultNumber.addEventListener('dblclick', () => {
        resultNumber.classList.add('bounce');
        setTimeout(() => {
            resultNumber.classList.remove('bounce');
        }, 1000);
        visualizeNumber(currentProblem.sum);
    });
    
    // Inicializamos el juego mostrando la pantalla de introducción
    // El juego se iniciará cuando el usuario haga clic en "¡Jugar Ahora!"
});