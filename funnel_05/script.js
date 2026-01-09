// script.js - VERSIÓN FINAL OPTIMIZADA

// Variables globales
let currentQuestion = 0;
let score = 0;
let spacesLeft = 3; // Solo 3 espacios disponibles
const totalQuestions = 5;

// Datos del usuario para filtro final
let userData = {
    facturacion: '',
    presupuesto: '',
    rol: ''
};

// Preguntas optimizadas para segmentación empresarial
const questions = [
    {
        title: "¿Cuántas horas semanales dedicas tú o tu equipo a tareas repetitivas que podrían automatizarse?",
        options: [
            { text: "Menos de 10 horas", value: 1 },
            { text: "10-25 horas", value: 2 },
            { text: "25-40 horas", value: 3 },
            { text: "Más de 40 horas", value: 4 }
        ]
    },
    {
        title: "¿Cuánto tiempo perderías si tú o tu manager clave estuvieran ausentes 2 semanas?",
        options: [
            { text: "Ninguno - Sistema autónomo", value: 1 },
            { text: "Algunos retrasos menores", value: 2 },
            { text: "Problemas operativos significativos", value: 3 },
            { text: "El negocio se detendría", value: 4 }
        ]
    },
    {
        title: "¿Cuál es tu mayor dolor operativo actual?",
        options: [
            { text: "Comunicación entre equipos/departamentos", value: 1 },
            { text: "Gestión de datos entre múltiples herramientas", value: 2 },
            { text: "Escalabilidad de procesos manuales", value: 3 },
            { text: "Costos operativos creciendo más rápido que ingresos", value: 4 }
        ]
    },
    {
        title: "¿Cómo manejas actualmente la integración entre diferentes sistemas?",
        options: [
            { text: "Todo está centralizado en una plataforma", value: 1 },
            { text: "Uso herramientas de automatización (Zapier/Make)", value: 2 },
            { text: "Copio y pego datos entre sistemas", value: 3 },
            { text: "Tengo diferentes personas encargadas de cada sistema", value: 4 }
        ]
    },
    {
        title: "¿Qué tan dispuesto estás a invertir en transformar tus procesos operativos?",
        options: [
            { text: "Busco herramientas económicas puntuales", value: 1 },
            { text: "Invertiría en soluciones específicas por departamento", value: 2 },
            { text: "Estoy listo para una transformación operativa completa", value: 3 },
            { text: "Necesito una arquitectura empresarial integral", value: 4 }
        ]
    }
];

// Función para verificar si hay espacios disponibles
function checkSpaces() {
    return spacesLeft > 0;
}

// Función para actualizar contador de espacios
function updateSpacesCounter() {
    const counterElement = document.getElementById('spacesLeft');
    const hiddenField = document.getElementById('spacesLeftField');

    if (counterElement) {
        counterElement.textContent = spacesLeft;
        counterElement.style.color = spacesLeft <= 1 ? '#f87171' : '#10b981';

        // Efecto visual cuando quedan pocos espacios
        if (spacesLeft <= 1) {
            counterElement.style.animation = 'pulse 1s infinite';
        } else {
            counterElement.style.animation = 'none';
        }
    }

    if (hiddenField) {
        hiddenField.value = spacesLeft;
    }
}

// Función para scroll suave
function scrollToDiagnosis() {
    document.getElementById('diagnosis').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Iniciar diagnóstico
function startDiagnosis() {
    // Verificar si hay espacios disponibles
    if (!checkSpaces()) {
        showNoSpacesLeft();
        return;
    }

    document.getElementById('diagnosisIntro').classList.add('hidden');
    document.getElementById('progressContainer').classList.remove('hidden');
    document.getElementById('questionCard').classList.remove('hidden');
    currentQuestion = 0;
    score = 0;
    userData = { facturacion: '', presupuesto: '', rol: '' };
    // Fix: Validar nombre de función correcto y actualizar total pasos
    updateProgressBar();
    document.getElementById('totalSteps').textContent = totalQuestions;
    showQuestion();

    // Track en analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'start_diagnosis', {
            'event_category': 'engagement',
            'event_label': 'diagnosis_started'
        });
    }
}

// Mostrar pregunta
function showQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('questionTitle').textContent = question.title;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option-button';
        button.innerHTML = `<span>${option.text}</span>`;
        // Fix: Pasar el objeto completo o valor para mejor tracking si se desea, por ahora valor
        button.onclick = () => selectOption(option.value);
        optionsContainer.appendChild(button);
    });

    document.getElementById('currentStep').textContent = currentQuestion + 1;
    updateProgressBar();
}

// Seleccionar opción
function selectOption(value) {
    score += value;
    currentQuestion++;

    // Track selección
    if (typeof gtag !== 'undefined') {
        gtag('event', 'select_option', {
            'event_category': 'engagement',
            'event_label': `question_${currentQuestion}_score_${value}`
        });
    }

    if (currentQuestion < totalQuestions) {
        showQuestion();
    } else {
        finishDiagnosis();
    }
}

// Actualizar barra de progreso
function updateProgressBar() {
    const progress = ((currentQuestion) / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

// Finalizar diagnóstico con filtros avanzados
function finishDiagnosis() {
    document.getElementById('questionCard').classList.add('hidden');
    document.getElementById('analyzingState').classList.remove('hidden');

    // Guardar score en campo hidden
    const scoreField = document.getElementById('diagnosisScore');
    if (scoreField) {
        scoreField.value = score;
    }

    // Simulación de análisis más realista
    setTimeout(() => {
        document.getElementById('analyzingState').classList.add('hidden');

        // Verificar si hay espacios antes de continuar
        if (!checkSpaces()) {
            showNoSpacesLeft();
            return;
        }

        // CORRECTED LOGIC: Solo basarse en el SCORE de las preguntas.
        // Los filtros de facturación/presupuesto se aplican al enviar el formulario (handleFormSubmit)
        // ya que el usuario aún no ha llenado esos campos en este punto.

        // Umbral de calificación (15 de 20 puntos posibles máx)
        let isQualified = score >= 12; // Ajustado para ser razonable (3 puntos promedio por pregunta)

        // Mostrar resultado apropiado
        if (isQualified) {
            document.getElementById('resultQualify').classList.remove('hidden');

            // Mostrar campo de empresa si no es CEO/Founder (Pre-check visual si aplica)
            const rol = document.querySelector('select[name="rol"]')?.value;
            if (rol && rol !== 'fundador') {
                document.getElementById('companyField').classList.remove('hidden');
            }

            // Track conversión cualificada
            if (typeof gtag !== 'undefined') {
                gtag('event', 'qualify', {
                    'event_category': 'conversion',
                    'event_label': `score_${score}`,
                    'value': score
                });
            }
        } else {
            document.getElementById('resultReject').classList.remove('hidden');

            // Track rechazo
            if (typeof gtag !== 'undefined') {
                gtag('event', 'reject', {
                    'event_category': 'conversion',
                    'event_label': `score_${score}`
                });
            }
        }
    }, 2000);
}

// Mostrar cuando no hay espacios
function showNoSpacesLeft() {
    document.getElementById('diagnosisIntro').classList.add('hidden');
    document.getElementById('noSpacesLeft').classList.remove('hidden');
}

// Unirse a lista de espera
function joinWaitlist() {
    alert('Te has unido a la lista de espera. Te contactaremos cuando haya nuevos espacios disponibles.');

    if (typeof gtag !== 'undefined') {
        gtag('event', 'join_waitlist', {
            'event_category': 'conversion',
            'event_label': 'waitlist_joined'
        });
    }

    resetDiagnosis();
}

// Manejar envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Validación adicional
    const email = formData.get('email');
    const facturacion = formData.get('facturacion');
    const presupuesto = formData.get('presupuesto');

    // Validar email corporativo (REMOVIDO A PETICIÓN)
    // const personalDomains = [];
    // const emailDomain = email.split('@')[1]?.toLowerCase();

    // if (personalDomains.includes(emailDomain)) {
    //     alert('Por favor, utiliza tu email corporativo. No aceptamos emails personales.');
    //     return;
    // }

    // Filtro de presupuesto mínimo
    if (presupuesto === '0-5k' || presupuesto === '5-10k') {
        alert('Para nuestra metodología de arquitectura empresarial, requerimos una inversión mínima de $10K. Te recomendamos soluciones más básicas por ahora.');
        return;
    }

    // Filtro de facturación mínima
    if (facturacion === 'menos-100k') {
        alert('Nuestra metodología está optimizada para negocios con facturación superior a $100K anuales. Te recomendamos enfocarte en crecimiento primero.');
        return;
    }

    // Reducir espacios disponibles
    if (spacesLeft > 0) {
        spacesLeft--;
        updateSpacesCounter();
    }

    // Mostrar estado de éxito
    document.getElementById('resultQualify').classList.add('hidden');
    document.getElementById('finalSuccess').classList.remove('hidden');

    // Enviar formulario a Formspree
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                // Track conversión exitosa
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'submit_application', {
                        'event_category': 'conversion',
                        'event_label': 'application_submitted',
                        'value': getValueFromBudget(presupuesto)
                    });

                    // Evento de conversión para Google Ads
                    gtag('event', 'conversion', {
                        'send_to': 'AW-CONVERSION_ID',
                        'value': getValueFromBudget(presupuesto),
                        'currency': 'USD'
                    });
                }

                // Limpiar formulario
                form.reset();
            } else {
                alert('Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.');
        });
}

// Calcular valor para analytics
function getValueFromBudget(budget) {
    const values = {
        '10-25k': 10000,
        '25-50k': 25000,
        '50k+': 50000
    };
    return values[budget] || 0;
}

// Resetear diagnóstico
function resetDiagnosis() {
    document.getElementById('finalSuccess').classList.add('hidden');
    document.getElementById('resultReject').classList.add('hidden');
    document.getElementById('resultQualify').classList.add('hidden');
    document.getElementById('noSpacesLeft').classList.add('hidden');
    document.getElementById('progressContainer').classList.add('hidden');
    document.getElementById('diagnosisIntro').classList.remove('hidden');
    document.getElementById('applicationForm').reset();
    document.getElementById('companyField').classList.add('hidden');
}

// Sistema de video modal
function setupVideoModal() {
    const videoTrigger = document.getElementById('videoTrigger');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');

    if (videoTrigger && videoModal && closeModal) {
        // Abrir modal
        videoTrigger.addEventListener('click', () => {
            videoModal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Track video play
            if (typeof gtag !== 'undefined') {
                gtag('event', 'play_video', {
                    'event_category': 'engagement',
                    'event_label': 'intro_video'
                });
            }
        });

        // Cerrar modal
        closeModal.addEventListener('click', () => {
            videoModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Cerrar al hacer click fuera
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                videoModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Validación de email en tiempo real (REMOVIDO)
// function setupEmailValidation() { ... }

// Filtros en tiempo real para presupuesto y facturación
function setupRealTimeFilters() {
    const facturacionSelect = document.getElementById('facturacionSelect');
    const presupuestoSelect = document.getElementById('presupuestoSelect');
    const submitBtn = document.getElementById('submitBtn');

    function updateSubmitButton() {
        const facturacion = facturacionSelect?.value;
        const presupuesto = presupuestoSelect?.value;

        if (facturacion === 'menos-100k') {
            submitBtn.disabled = true;
            submitBtn.title = 'Facturación mínima requerida: $100K anuales';
            submitBtn.style.opacity = '0.6';
            submitBtn.style.cursor = 'not-allowed';
        } else if (presupuesto === '0-5k' || presupuesto === '5-10k') {
            submitBtn.disabled = true;
            submitBtn.title = 'Presupuesto mínimo requerido: $10K';
            submitBtn.style.opacity = '0.6';
            submitBtn.style.cursor = 'not-allowed';
        } else {
            submitBtn.disabled = false;
            submitBtn.title = '';
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }
    }

    if (facturacionSelect) {
        facturacionSelect.addEventListener('change', updateSubmitButton);
    }

    if (presupuestoSelect) {
        presupuestoSelect.addEventListener('change', updateSubmitButton);
    }

    // Inicializar estado del botón
    updateSubmitButton();
}

// Navegación fija y scroll suave
function setupNavigation() {
    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    // Configurar componentes
    setupNavigation();
    setupVideoModal();
    // setupEmailValidation(); // Removido
    setupRealTimeFilters();
    updateSpacesCounter();

    // Configurar formulario
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', handleFormSubmit);
    }

    // Mostrar/ocultar campo empresa basado en rol
    const rolSelect = document.querySelector('select[name="rol"]');
    if (rolSelect) {
        rolSelect.addEventListener('change', function () {
            const companyField = document.getElementById('companyField');
            if (this.value !== 'fundador') {
                companyField.classList.remove('hidden');
            } else {
                companyField.classList.add('hidden');
            }
        });
    }

    console.log('Sistema de diagnóstico inicializado. Espacios disponibles:', spacesLeft);
});