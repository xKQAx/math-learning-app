document.addEventListener('DOMContentLoaded', () => {
    // Inicializar efectos de animación al desplazarse
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Inicializar slider de testimonios
    initTestimonialSlider();
    
    // Animación de números flotantes
    animateFloatingElements();
});

// Función para el slider de testimonios
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    
    // Función para mostrar un testimonio específico
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            dots[i].classList.remove('active');
        });
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }
    
    // Event listeners para los botones de navegación
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = testimonials.length - 1;
            showTestimonial(newIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            let newIndex = currentIndex + 1;
            if (newIndex >= testimonials.length) newIndex = 0;
            showTestimonial(newIndex);
        });
    }
    
    // Event listeners para los puntos indicadores
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });
    
    // Avance automático del slider cada 5 segundos
    setInterval(() => {
        let newIndex = currentIndex + 1;
        if (newIndex >= testimonials.length) newIndex = 0;
        showTestimonial(newIndex);
    }, 5000);
}

// Función para animar elementos flotantes
function animateFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-shapes .shape');
    
    floatingElements.forEach(element => {
        // Posición inicial aleatoria
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 50;
        element.style.left = `${randomX}%`;
        element.style.top = `${randomY}%`;
        
        // Animación continua
        setInterval(() => {
            const newX = Math.random() * 100;
            const newY = Math.random() * 50;
            
            element.style.transition = 'all 10s ease-in-out';
            element.style.left = `${newX}%`;
            element.style.top = `${newY}%`;
            element.style.transform = `rotate(${Math.random() * 360}deg)`;
        }, 10000 + Math.random() * 5000); // Timing ligeramente diferente para cada elemento
    });
    
    // Animación de números en la sección CTA
    const floatingNumbers = document.querySelectorAll('.floating-numbers span');
    
    floatingNumbers.forEach(number => {
        setInterval(() => {
            // Animación de rebote vertical aleatoria
            const newY = -15 + Math.random() * 30;
            number.style.transform = `translateY(${newY}px)`;
        }, 2000 + Math.random() * 1000);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    // Función para actualizar el testimonio activo
    function updateTestimonials(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Event listener para el botón "Anterior"
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            updateTestimonials(currentIndex);
        });
    }

    // Event listener para el botón "Siguiente"
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateTestimonials(currentIndex);
        });
    }

    // Event listeners para los puntos indicadores
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateTestimonials(currentIndex);
        });
    });

    // Avance automático del slider cada 5 segundos
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateTestimonials(currentIndex);
    }, 5000);

    // Inicializar el primer testimonio como activo
    updateTestimonials(currentIndex);
});

document.addEventListener('DOMContentLoaded', () => {
    const wheel = document.querySelector('.wheel');
    const wheelCenter = document.querySelector('.wheel-center');
    let currentRotation = 0;

    wheelCenter.addEventListener('click', () => {
        currentRotation += 120; // Gira 120 grados por cada clic
        wheel.style.transform = `rotate(${currentRotation}deg)`;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.how-it-works-slider');
    const steps = document.querySelectorAll('.how-it-works-step');
    const prevBtn = document.querySelector('.how-it-works-slider-container .prev-btn');
    const nextBtn = document.querySelector('.how-it-works-slider-container .next-btn');
    let currentIndex = 0;

    // Función para mover el slider
    function moveSlider(index) {
        const offset = -index * 100; // Calcula el desplazamiento en porcentaje
        slider.style.transform = `translateX(${offset}%)`;
        currentIndex = index;
    }

    // Event listener para el botón "Anterior"
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = steps.length - 1; // Vuelve al último paso si está en el primero
            moveSlider(newIndex);
        });
    }

    // Event listener para el botón "Siguiente"
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            let newIndex = currentIndex + 1;
            if (newIndex >= steps.length) newIndex = 0; // Vuelve al primer paso si está en el último
            moveSlider(newIndex);
        });
    }

    // Avance automático del slider cada 5 segundos
    setInterval(() => {
        let newIndex = currentIndex + 1;
        if (newIndex >= steps.length) newIndex = 0;
        moveSlider(newIndex);
    }, 5000);

    // Inicializar el slider en el primer paso
    moveSlider(currentIndex);
});
