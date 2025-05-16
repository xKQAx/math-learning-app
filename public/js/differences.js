document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let currentLevel = 1;
    let currentProblem = 1;
    let totalProblems = 10;
    let firstNum = 0;
    let secondNum = 0;
    let correctAnswer = 0;
    let userAnswer = '';
    let score = 0;
    let problemsCompleted = 0;
    
    // Referencias a elementos del DOM
    const firstNumberEl = document.getElementById('firstNumber');
    const secondNumberEl = document.getElementById('secondNumber');
    const answerEl = document.getElementById('answer');
    const firstNumberBlocksEl = document.getElementById('firstNumberBlocks');
    const secondNumberBlocksEl = document.getElementById('secondNumberBlocks');
    const resultBlocksEl = document.getElementById('resultBlocks');
    const numButtons = document.querySelectorAll('.num-btn');
    const checkBtn = document.getElementById('checkBtn');
    const clearBtn = document.getElementById('clearBtn');
    const nextBtn = document.getElementById('nextBtn');
    const hintBtn = document.getElementById('hintBtn');
    const hintModal = document.getElementById('hintModal');
    const closeBtn = document.querySelector('.close-btn');
    const correctMessage = document.getElementById('correctMessage');
    const incorrectMessage = document.getElementById('incorrectMessage');
    const progressFill = document.getElementById('progressFill');
    const currentProblemEl = document.getElementById('currentProblem');
    const totalProblemsEl = document.getElementById('totalProblems');
    const levelBtns = document.querySelectorAll('.level-btn');
    const hintAnimationEl = document.querySelector('.hint-animation');
    
    // Inicialización
    initGame();
    
    // Configurar eventos
    numButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (userAnswer.length < 2) { // Limitar a números de dos dígitos
                userAnswer += this.dataset.num;
                updateAnswerDisplay();
            }
        });
    });
    
    checkBtn.addEventListener('click', checkAnswer);
    clearBtn.addEventListener('click', clearAnswer);
    nextBtn.addEventListener('click', nextProblem);
    hintBtn.addEventListener('click', showHint);
    closeBtn.addEventListener('click', closeHint);
    
    levelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            levelBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentLevel = parseInt(this.dataset.level);
            resetGame();
        });
    });
    
    // Cerrar modal de pista al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target == hintModal) {
            closeHint();
        }
    });
    
    // Funciones del juego
    function initGame() {
        totalProblemsEl.textContent = totalProblems;
        currentProblemEl.textContent = currentProblem;
        generateProblem();
    }
    
    function resetGame() {
        currentProblem = 1;
        problemsCompleted = 0;
        score = 0;
        updateProgress();
        currentProblemEl.textContent = currentProblem;
        generateProblem();
    }
    
    function generateProblem() {
        clearFeedback();
        clearAnswer();
        clearBlocks();
        
        // Generar números según el nivel
        switch(currentLevel) {
            case 1: // Nivel 1: Diferencias pequeñas (resultado entre 1-5)
                secondNum = Math.floor(Math.random() * 5) + 1; // 1-5
                firstNum = secondNum + Math.floor(Math.random() * 5) + 1; // asegura una diferencia de 1-5
                break;
            case 2: // Nivel 2: Diferencias medianas (resultado entre 3-9)
                secondNum = Math.floor(Math.random() * 7) + 1; // 1-7
                firstNum = secondNum + Math.floor(Math.random() * 7) + 3; // asegura una diferencia de 3-9
                break;
            case 3: // Nivel 3: Diferencias grandes (resultado entre 5-15)
                secondNum = Math.floor(Math.random() * 10) + 1; // 1-10
                firstNum = secondNum + Math.floor(Math.random() * 11) + 5; // asegura una diferencia de 5-15
                break;
        }
        
        // Asegurar que firstNum sea siempre menor que 20
        if (firstNum >= 20) {
            firstNum = 19;
        }
        
        correctAnswer = firstNum - secondNum;
        
        // Actualizar la visualización
        firstNumberEl.textContent = firstNum;
        secondNumberEl.textContent = secondNum;
        answerEl.textContent = '?';
        
        // Crear bloques visuales
        createBlocks(firstNumberBlocksEl, firstNum, 'first');
        createBlocks(secondNumberBlocksEl, secondNum, 'second');
    }
    
    function createBlocks(container, number, type) {
        container.innerHTML = '';
        
        for (let i = 0; i < number; i++) {
            const block = document.createElement('div');
            block.className = 'block';
            block.dataset.index = i;
            
            // Diferentes colores según el tipo
            if (type === 'first') {
                block.style.backgroundColor = getRandomColor(9370219); // Variación del color morado
            } else if (type === 'second') {
                block.style.backgroundColor = getRandomColor(16724736); // Variación del color rojo
            } else if (type === 'result') {
                block.style.backgroundColor = getRandomColor(6723891); // Variación del color verde
            }
            
            container.appendChild(block);
        }
    }
    
    function getRandomColor(baseColor, variance = 30) {
        // Convertir el número decimal a formato hexadecimal RGB
        let r = (baseColor >> 16) & 255;
        let g = (baseColor >> 8) & 255;
        let b = baseColor & 255;
        
        // Agregar una ligera variación al color
        r = Math.max(0, Math.min(255, r + Math.floor(Math.random() * variance * 2) - variance));
        g = Math.max(0, Math.min(255, g + Math.floor(Math.random() * variance * 2) - variance));
        b = Math.max(0, Math.min(255, b + Math.floor(Math.random() * variance * 2) - variance));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    function updateAnswerDisplay() {
        answerEl.textContent = userAnswer || '?';
    }
    
    function clearAnswer() {
        userAnswer = '';
        updateAnswerDisplay();
    }
    
    function checkAnswer() {
        if (userAnswer === '') return;
        
        const answer = parseInt(userAnswer);
        
        if (answer === correctAnswer) {
            // Respuesta correcta
            score++;
            showFeedback(true);
            createBlocks(resultBlocksEl, correctAnswer, 'result');
            
            // Animar los bloques para mostrar la resta visualmente
            animateSubtraction();
            
            // Deshabilitar los botones hasta el siguiente problema
            toggleNumButtons(false);
            nextBtn.style.display = 'block';
            
            // Actualizar progreso
            problemsCompleted++;
            updateProgress();
        } else {
            // Respuesta incorrecta
            showFeedback(false);
        }
    }
    
    function animateSubtraction() {
        const firstBlocks = firstNumberBlocksEl.querySelectorAll('.block');
        const secondBlocks = secondNumberBlocksEl.querySelectorAll('.block');
        
        // Marcar los bloques que serán "restados"
        for (let i = 0; i < secondNum; i++) {
            const index = firstNum - 1 - i;
            if (index >= 0 && index < firstBlocks.length) {
                gsap.to(firstBlocks[index], {
                    backgroundColor: '#ffcccc',
                    opacity: 0.5,
                    scale: 0.8,
                    duration: 0.5,
                    delay: i * 0.1
                });
            }
        }
        
        // Hacer que los bloques del segundo número "desaparezcan" gradualmente
        gsap.to(secondBlocks, {
            opacity: 0.3,
            scale: 0.7,
            stagger: 0.1,
            duration: 0.5
        });
        
        // Mostrar los bloques del resultado con un efecto de aparición
        setTimeout(() => {
            const resultBlocks = resultBlocksEl.querySelectorAll('.block');
            gsap.from(resultBlocks, {
                opacity: 0,
                scale: 0,
                stagger: 0.1,
                duration: 0.5
            });
        }, 1000);
    }
    
    function showFeedback(isCorrect) {
        if (isCorrect) {
            correctMessage.style.display = 'block';
            incorrectMessage.style.display = 'none';
            
            // Añadir una animación de celebración
            gsap.to(correctMessage, {
                scale: 1.1,
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });
            
            // Sonido de éxito (opcional, requiere audio)
            // playSound('success');
        } else {
            incorrectMessage.style.display = 'block';
            correctMessage.style.display = 'none';
            
            // Añadir una animación de vibración
            gsap.to(incorrectMessage, {
                x: 10,
                duration: 0.1,
                yoyo: true,
                repeat: 3
            });
            
            // Sonido de error (opcional, requiere audio)
            // playSound('error');
        }
    }
    
    function clearFeedback() {
        correctMessage.style.display = 'none';
        incorrectMessage.style.display = 'none';
    }
    
    function nextProblem() {
        if (currentProblem < totalProblems) {
            currentProblem++;
            currentProblemEl.textContent = currentProblem;
            toggleNumButtons(true);
            clearBlocks();
            generateProblem();
        } else {
            // Juego completado
            showGameCompleted();
        }
    }
    
    function clearBlocks() {
        firstNumberBlocksEl.innerHTML = '';
        secondNumberBlocksEl.innerHTML = '';
        resultBlocksEl.innerHTML = '';
    }
    
    function toggleNumButtons(enable) {
        numButtons.forEach(btn => {
            btn.disabled = !enable;
            if (enable) {
                btn.classList.remove('disabled');
            } else {
                btn.classList.add('disabled');
            }
        });
        
        checkBtn.disabled = !enable;
        clearBtn.disabled = !enable;
    }
    
    function updateProgress() {
        const percentage = (problemsCompleted / totalProblems) * 100;
        progressFill.style.width = `${percentage}%`;
    }
    
    function showGameCompleted() {
        const gameBoard = document.querySelector('.game-board');
        gameBoard.innerHTML = `
            <div class="game-completed">
                <h2>¡Felicidades!</h2>
                <p>Has completado todos los problemas.</p>
                <div class="end-actions">
                    <button id="playAgainBtn" class="control-btn">Jugar de Nuevo</button>
                    <button id="finishLessonButton" class="control-btn">Finalizar Lección</button>
                </div>
            </div>
        `;
    
        document.getElementById('playAgainBtn').addEventListener('click', function() {
            location.reload();
        });
    
        document.getElementById('finishLessonButton').addEventListener('click', function() {
            fetch('/progress/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId: 'differences' })
            }).then(res => {
                if (res.ok) window.location.href = '/progress';
            });
        });
    }
    
    function showHint() {
        hintModal.style.display = 'block';
        
        // Limpiar cualquier animación anterior
        hintAnimationEl.innerHTML = '';
        
        // Crear una animación simple para la pista
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.gap = '20px';
        
        // Primer grupo de bloques
        const firstGroup = document.createElement('div');
        firstGroup.className = 'hint-blocks';
        firstGroup.style.display = 'flex';
        firstGroup.style.flexWrap = 'wrap';
        firstGroup.style.maxWidth = '150px';
        firstGroup.style.gap = '5px';
        
        // Crear bloques para el primer número
        for (let i = 0; i < firstNum; i++) {
            const block = document.createElement('div');
            block.className = 'block';
            block.style.width = '25px';
            block.style.height = '25px';
            block.style.backgroundColor = '#9370db';
            block.style.borderRadius = '5px';
            firstGroup.appendChild(block);
        }
        
        // Símbolo de resta
        const minusSign = document.createElement('div');
        minusSign.textContent = '-';
        minusSign.style.fontSize = '2rem';
        minusSign.style.fontWeight = 'bold';
        minusSign.style.color = '#9370db';
        
        // Segundo grupo de bloques
        const secondGroup = document.createElement('div');
        secondGroup.className = 'hint-blocks';
        secondGroup.style.display = 'flex';
        secondGroup.style.flexWrap = 'wrap';
        secondGroup.style.maxWidth = '150px';
        secondGroup.style.gap = '5px';
        
        // Crear bloques para el segundo número
        for (let i = 0; i < secondNum; i++) {
            const block = document.createElement('div');
            block.className = 'block';
            block.style.width = '25px';
            block.style.height = '25px';
            block.style.backgroundColor = '#ff9999';
            block.style.borderRadius = '5px';
            secondGroup.appendChild(block);
        }
        
        // Símbolo de igual
        const equalsSign = document.createElement('div');
        equalsSign.textContent = '=';
        equalsSign.style.fontSize = '2rem';
        equalsSign.style.fontWeight = 'bold';
        equalsSign.style.color = '#9370db';
        
        // Grupo de resultado
        const resultGroup = document.createElement('div');
        resultGroup.className = 'hint-blocks';
        resultGroup.style.display = 'flex';
        resultGroup.style.flexWrap = 'wrap';
        resultGroup.style.maxWidth = '150px';
        resultGroup.style.gap = '5px';
        
        // Crear bloques para el resultado
        for (let i = 0; i < correctAnswer; i++) {
            const block = document.createElement('div');
            block.className = 'block';
            block.style.width = '25px';
            block.style.height = '25px';
            block.style.backgroundColor = '#66bb6a';
            block.style.borderRadius = '5px';
            block.style.opacity = '0';
            resultGroup.appendChild(block);
        }
        
        // Añadir todos los elementos al contenedor
        container.appendChild(firstGroup);
        container.appendChild(minusSign);
        container.appendChild(secondGroup);
        container.appendChild(equalsSign);
        container.appendChild(resultGroup);
        hintAnimationEl.appendChild(container);
        
        // Animar la pista
        animateHint(firstGroup, secondGroup, resultGroup);
    }
    
    function animateHint(firstGroup, secondGroup, resultGroup) {
        // Resaltar los bloques del primer grupo
        gsap.to(firstGroup.querySelectorAll('.block'), {
            scale: 1.2,
            backgroundColor: '#9370db',
            stagger: 0.05,
            duration: 0.3,
            repeat: 1,
            yoyo: true
        });
        
        // Después de un momento, resaltar los bloques que se van a quitar
        setTimeout(() => {
            const firstBlocks = firstGroup.querySelectorAll('.block');
            
            // Resaltar los bloques a quitar en el primer grupo (desde el final)
            for (let i = 0; i < secondNum; i++) {
                const index = firstNum - 1 - i;
                if (index >= 0 && index < firstBlocks.length) {
                    gsap.to(firstBlocks[index], {
                        backgroundColor: '#ffcccc',
                        scale: 0.8,
                        opacity: 0.5,
                        duration: 0.5,
                        delay: i * 0.1
                    });
                }
            }
            
            // Resaltar los bloques del segundo grupo
            gsap.to(secondGroup.querySelectorAll('.block'), {
                scale: 1.2,
                backgroundColor: '#ff5252',
                stagger: 0.05,
                duration: 0.3,
                delay: 1,
                repeat: 1,
                yoyo: true
            });
            
            // Mostrar los bloques resultantes
            setTimeout(() => {
                const resultBlocks = resultGroup.querySelectorAll('.block');
                gsap.to(resultBlocks, {
                    opacity: 1,
                    scale: 1,
                    stagger: 0.1,
                    duration: 0.5
                });
            }, 2000);
        }, 1000);
    }
    
    function closeHint() {
        hintModal.style.display = 'none';
    }
    
    // Función para añadir efecto de desplazamiento suave a los botones de nivel
    levelBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -5,
                duration: 0.2
            });
        });
        
        btn.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                duration: 0.2
            });
        });
    });
    
    // Función para añadir efectos de hover a los botones numéricos
    numButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.1,
                duration: 0.2
            });
        });
        
        btn.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.2
            });
        });
    });
    
    // Efectos de pulsación para botones
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('mousedown', function() {
            gsap.to(this, {
                scale: 0.95,
                duration: 0.1
            });
        });
        
        btn.addEventListener('mouseup', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.1
            });
        });
    });
});