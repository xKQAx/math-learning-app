// loggedhome.js - JavaScript para la página principal de usuarios logueados

document.addEventListener('DOMContentLoaded', function() {
    // Inicialización de variables y constantes
    const gamesSlider = document.getElementById('games-slider');
    const sliderDots = document.querySelectorAll('.slider-dots .dot');
    const prevButton = document.querySelector('.slider-arrow.prev');
    const nextButton = document.querySelector('.slider-arrow.next');
    const quickActionCards = document.querySelectorAll('.quick-action-card');
    const animationElements = document.querySelectorAll('[data-animation]');
    
    let currentSlide = 0;
    const totalSlides = Math.ceil(gamesSlider.children.length / (getViewportWidth() < 768 ? 1 : 3)) - 1;
    
    // Funciones de utilidad
    function getViewportWidth() {
        return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    }
    
    function getCssVariable(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }
    
    // Control del slider de juegos
    function updateSlider() {
        const cardWidth = gamesSlider.querySelector('.game-card').offsetWidth;
        const gap = 20; // El espacio entre tarjetas definido en CSS
        const scrollAmount = (cardWidth + gap) * currentSlide;
        
        gamesSlider.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        // Actualizar estado de los dots
        sliderDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
        
        // Actualizar estado de los botones de navegación
        prevButton.disabled = currentSlide === 0;
        nextButton.disabled = currentSlide >= totalSlides;
        
        prevButton.style.opacity = currentSlide === 0 ? "0.5" : "1";
        nextButton.style.opacity = currentSlide >= totalSlides ? "0.5" : "1";
    }
    
    // Configurar evento para los dots del slider
    sliderDots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentSlide = i;
            updateSlider();
        });
    });
    
    // Configurar eventos para los botones de navegación del slider
    prevButton.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentSlide < totalSlides) {
            currentSlide++;
            updateSlider();
        }
    });
    
    // Detección de swipe para dispositivos táctiles
    let touchStartX = 0;
    let touchEndX = 0;
    
    gamesSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    gamesSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Umbral mínimo para considerar un swipe
        
        if (touchEndX < touchStartX - swipeThreshold && currentSlide < totalSlides) {
            // Swipe izquierdo - Avanzar
            currentSlide++;
            updateSlider();
        } else if (touchEndX > touchStartX + swipeThreshold && currentSlide > 0) {
            // Swipe derecho - Retroceder
            currentSlide--;
            updateSlider();
        }
    }
    
    // Animaciones al desplazamiento
    function handleScrollAnimations() {
        animationElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.85) { // Elemento visible en el 85% de la ventana
                const animationType = element.dataset.animation;
                
                switch (animationType) {
                    case 'fade-in':
                        element.classList.add('animate-fade-in');
                        break;
                    case 'bounce':
                        element.classList.add('animate-bounce');
                        // Eliminar la clase después de la animación para permitir repeticiones
                        setTimeout(() => {
                            element.classList.remove('animate-bounce');
                        }, 1000);
                        break;
                }
            }
        });
    }
    
    // Animaciones para tarjetas de acciones rápidas
    quickActionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.qa-icon');
            icon.style.transform = 'scale(1.1)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 300);
        });
    });
    
    // Contador de puntos con animación
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-value');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            let count = 0;
            const speed = 2000 / target; // Ajusta la velocidad según el valor final
            
            function updateCount() {
                if (count < target) {
                    count++;
                    counter.textContent = count;
                    requestAnimationFrame(updateCount);
                } else {
                    counter.textContent = target;
                }
            }
            
            updateCount();
        });
    }
    
    // Funcionalidad para dropdown del menú de usuario (si no está logueado)
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        const dropdownMenu = document.getElementById('dropdown-menu');
        
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });
        
        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('active');
        });
    }
    
    // Crear "confeti" de números y símbolos matemáticos para desafío completado
    function celebrateAchievement() {
        // Verificar si hay un parámetro en la URL que indique un logro reciente
        const urlParams = new URLSearchParams(window.location.search);
        const achievement = urlParams.get('achievement');
        
        if (achievement) {
            createConfetti();
            
            // Mostrar una notificación de logro
            const notification = document.createElement('div');
            notification.className = 'achievement-notification';
            notification.innerHTML = `
                <i class="fas fa-award"></i>
                <p>¡Felicidades! Has completado: ${decodeURIComponent(achievement)}</p>
                <button class="close-notification"><i class="fas fa-times"></i></button>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 500);
            
            // Configurar el cierre de la notificación
            notification.querySelector('.close-notification').addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });
            
            // Auto-cerrar después de 5 segundos
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 5000);
            
            // Limpiar el parámetro de la URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
    
    function createConfetti() {
        const mathSymbols = ['+', '-', '×', '÷', '=', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        document.body.appendChild(confettiContainer);
        
        // Crear 50 elementos de confeti
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
            
            // Posición aleatoria en el eje X
            const posX = Math.random() * 100;
            // Tamaño aleatorio
            const size = Math.random() * 20 + 10;
            // Color aleatorio
            const hue = Math.random() * 360;
            // Duración aleatoria de la animación
            const duration = Math.random() * 3 + 2;
            // Retraso aleatorio
            const delay = Math.random() * 1.5;
            
            confetti.style.left = `${posX}%`;
            confetti.style.fontSize = `${size}px`;
            confetti.style.color = `hsl(${hue}, 70%, 60%)`;
            confetti.style.animationDuration = `${duration}s`;
            confetti.style.animationDelay = `${delay}s`;
            
            confettiContainer.appendChild(confetti);
        }
        
        // Eliminar los confetis después de la animación
        setTimeout(() => {
            confettiContainer.remove();
        }, 6000);
    }
    
    // Detectar cambios de tamaño de pantalla para actualizar el slider
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Actualizar el número total de slides según el tamaño de la pantalla
            const newTotalSlides = Math.ceil(gamesSlider.children.length / (getViewportWidth() < 768 ? 1 : 3)) - 1;
            if (totalSlides !== newTotalSlides) {
                totalSlides = newTotalSlides;
                // Asegurarse de que currentSlide no sea mayor que el nuevo totalSlides
                if (currentSlide > totalSlides) {
                    currentSlide = totalSlides;
                }
                updateSlider();
            }
        }, 250);
    });
    
    // Inicialización
    updateSlider();
    window.addEventListener('scroll', handleScrollAnimations);
    handleScrollAnimations(); // Ejecutar una vez al cargar para elementos visibles inicialmente
    animateCounters();
    celebrateAchievement();
    
    // Agregar estilos CSS adicionales para las animaciones generadas por JS
    addDynamicStyles();
    
    function addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .achievement-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-left: 4px solid var(--accent-color);
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: 0 3px 15px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 15px;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                z-index: 1000;
            }
            
            .achievement-notification.show {
                transform: translateX(0);
            }
            
            .achievement-notification i.fa-award {
                font-size: 24px;
                color: var(--accent-color);
            }
            
            .achievement-notification p {
                flex: 1;
                margin: 0;
            }
            
            .close-notification {
                background: none;
                border: none;
                cursor: pointer;
                color: #999;
                padding: 5px;
            }
            
            .close-notification:hover {
                color: #333;
            }
            
            .confetti-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 999;
                overflow: hidden;
            }
            
            .confetti {
                position: absolute;
                top: -10px;
                animation: confettiFall linear forwards;
            }
            
            @keyframes confettiFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
            
            /* Estilo para el menú desplegable */
            .dropdown-menu {
                display: none;
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                min-width: 150px;
                border-radius: 5px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                z-index: 100;
                overflow: hidden;
            }
            
            .dropdown-menu.active {
                display: block;
                animation: fadeIn 0.2s ease;
            }
            
            .dropdown-menu a {
                display: block;
                padding: 12px 15px;
                text-decoration: none;
                color: #333;
                transition: background 0.2s;
            }
            
            .dropdown-menu a:hover {
                background: #f5f5f5;
                color: var(--primary-color);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        
        document.head.appendChild(style);
    }
});

// Mensajes motivacionales sobre aprendizaje y matemáticas
const motivationalMessages = [
    "El aprendizaje nunca agota la mente. – Leonardo da Vinci",
    "Las matemáticas son la música de la razón. – James Joseph Sylvester",
    "La educación es el arma más poderosa que puedes usar para cambiar el mundo. – Nelson Mandela",
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día. – Robert Collier",
    "No te preocupes por tus dificultades en matemáticas. Te puedo asegurar que las mías son aún mayores. – Albert Einstein",
    "Aprender es un tesoro que seguirá a su dueño a todas partes. – Proverbio chino",
    "La única manera de aprender matemáticas es haciendo matemáticas. – Paul Halmos",
    "Nunca consideres el estudio como una obligación, sino como una oportunidad para penetrar en el bello y maravilloso mundo del saber. – Albert Einstein",
    "El aprendizaje es experiencia, todo lo demás es información. – Albert Einstein",
    "El genio se hace con un 1% de talento, y un 99% de trabajo. – Albert Einstein",
    "La educación no es preparación para la vida; la educación es la vida en sí misma. – John Dewey",
    "El aprendizaje es un viaje, no un destino.",
    "La curiosidad es la mecha en la vela del aprendizaje. – William Arthur Ward",
    "El fracaso es la oportunidad de comenzar de nuevo, pero más inteligentemente. – Henry Ford",
    "Nunca dejes de aprender, porque la vida nunca deja de enseñar."
];

// Selecciona un mensaje aleatorio y lo muestra en el DOM
function setRandomMotivationalMessage() {
    const idx = Math.floor(Math.random() * motivationalMessages.length);
    const message = motivationalMessages[idx];
    const messageElement = document.querySelector('.motivational-message p');
    if (messageElement) {
        messageElement.textContent = message;
    }
}

document.addEventListener('DOMContentLoaded', setRandomMotivationalMessage);
document.getElementById('new-message-btn').addEventListener('click', setRandomMotivationalMessage);
