let images = [];
let phrases = [];
let isFirstClick = true;

// Obtener currentIndex de localStorage, o inicializarlo en 0 si no existe
let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;

// Guardar el valor inicializado en localStorage si no existía
if (localStorage.getItem('currentIndex') === null) {
    localStorage.setItem('currentIndex', currentIndex);
}

document.addEventListener('DOMContentLoaded', () => {
    // Recuperar las imágenes y frases de localStorage
    try {
        images = JSON.parse(localStorage.getItem('imagenes')) || [];
        phrases = JSON.parse(localStorage.getItem('frases')) || [];
    } catch (error) {
        console.error("Error al procesar los datos de localStorage:", error);
        images = [];
        phrases = [];
    }

    images = images.map(image => 'img\\CuentameAlgo\\' + image);
    numberOfImages = images.length
    localStorage.setItem('numImagenes', JSON.stringify(numberOfImages));

    if (images.length > 0 && phrases.length > 0) {
        updateContent();
    } else {
        console.error('No se encontraron imágenes o frases en el almacenamiento local.');
    }
});

function updateContent() {
    const imageElement = document.querySelector('.img');
    const phraseElement = document.querySelector('.phrase');
    if (imageElement) {
        imageElement.addEventListener('click', solution); // Asignamos el evento click a la función 'solution'
    } else {
        console.error('La imagen no fue encontrada.');
    }

    if (imageElement && phraseElement) {
        const imagePath = images[currentIndex];
        const rute = imagePath.replace('.png', '');
        const word = rute.split('\\').slice(-1)[0]; // Toma la última parte después del último '\\'

        // Usamos una expresión regular para reemplazar solo la palabra `word` en la frase
        const phrase = phrases[currentIndex].replace(new RegExp(`\\b${word}\\b`, 'g'), (match) => "_".repeat(match.length));

        imageElement.src = imagePath; // Actualiza la imagen
        phraseElement.textContent = phrase; // Actualiza el texto
    } else {
        console.error('No se encontraron elementos de imagen o frase en el DOM.');
    }
}


function solution() {
    const imageElement = document.querySelector('.img');
    const phraseElement = document.querySelector('.phrase');

    if (imageElement && phraseElement) {
        imageElement.src = images[currentIndex]; // Actualiza la imagen
        phraseElement.textContent = phrases[currentIndex]; // Actualiza el texto
    } else {
        console.error('No se encontraron elementos de imagen o frase en el DOM.');
    }
}

// Verificar compatibilidad con la Web Speech API

if (!('webkitSpeechRecognition' in window)) {
    alert('Tu navegador no soporta la API de reconocimiento de voz.');
} else {
    // Inicializar SpeechRecognition
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES'; // Idioma: español
    recognition.interimResults = false; // No mostrar resultados intermedios
    recognition.continuous = false; // Detenerse automáticamente

    function changeButton() {
        const buttonElement = document.getElementById('startButton');
        const imageRight = document.querySelector('.img-right');

        if (isFirstClick) {
            recognition.start();

            if (buttonElement) {
                buttonElement.textContent = 'Terminar';
                buttonElement.style.backgroundColor = '#F8A4A4';
            }

            if (imageRight) {
                imageRight.src = '/img/CuentameAlgo/pastillaDespierta.png';
            }

            isFirstClick = false;
        } else {
            recognition.stop();
        }
    }

    // Evento al obtener resultados
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const output = document.getElementById('output'); // Asegúrate de que el elemento `output` existe en el DOM
        if (output) output.textContent = transcript;

        const url = 'http://localhost:5001/comparar';
        const data = {
            frase_usuario: transcript,
            frase_referencia: phrases[currentIndex]
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta de la API:', data);
                //Agregar Retroalimentación
                const retro = data.mensaje;
                localStorage.setItem('retro', retro);

                if (data.es_correcto) {
                    console.log('La frase es correcta');
                    if (images.length > 0 && phrases.length > 0) {
                        currentIndex = currentIndex + 1;
                        localStorage.setItem('currentIndex', currentIndex);
                    } else {
                        console.error('No hay imágenes o frases para mostrar.');
                    }
                    setTimeout(() => {
                        window.location.href = '/felicidadesCA';
                    }, 2000);
                } else {
                    console.log('La frase no es correcta:', data.mensaje);
                    setTimeout(() => {
                        window.location.href = '/errorCA';
                    }, 2000);
                    
                }
            })
            .catch(error => {
                console.error('Error al hacer la solicitud:', error);
            });
    };

    // Evento al terminar
    recognition.onend = () => {
        const startButton = document.getElementById('startButton');
        const stopButton = document.getElementById('stopButton');
        const output = document.getElementById('output');

        if (startButton) startButton.disabled = false;
        if (stopButton) stopButton.disabled = true;

        if (output && output.textContent === 'Escuchando...') {
            output.textContent = 'No se detectó audio.';
        }
    };

    // Evento de error
    recognition.onerror = (event) => {
        const output = document.getElementById('output');
        console.error('Error en el reconocimiento:', event.error);
        if (output) output.textContent = `Error: ${event.error}`;
    };
}
