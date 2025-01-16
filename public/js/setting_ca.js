document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado"); // Verificar que el script está cargado
    let currentIndex = 0; // Declarar currentIndex como 0
    localStorage.setItem('currentIndex', currentIndex.toString()); // Guardar el valor en localStorage como string

    let puntaje = 0; 
    localStorage.setItem('puntaje', puntaje.toString());

    const audio = document.getElementById('screenSound');
    audio.play(); // Reproducir el sonido al cargar la pantalla

    // Seleccionar botones de dificultad
    const buttons = document.querySelectorAll('.difficulty-button');
    if (buttons.length === 0) {
        console.error("No se encontraron botones de dificultad.");
    }

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            console.log("Botón clickeado:", button); // Depuración
            buttons.forEach(b => b.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    // Función para aumentar el número
    window.increaseNumber = function() {
        const input = document.getElementById('numberInput');
        if (!input) {
            console.error("No se encontró el input del número.");
            return;
        }

        const currentValue = parseInt(input.value, 10);
        const maxValue = parseInt(input.max, 10);

        if (currentValue < maxValue) {
            input.value = currentValue + 1;
            console.log("Número aumentado:", input.value);
        }
    }

    // Función para disminuir el número
    window.decreaseNumber = function() {
        const input = document.getElementById('numberInput');
        if (!input) {
            console.error("No se encontró el input del número.");
            return;
        }

        const currentValue = parseInt(input.value, 10);
        const minValue = parseInt(input.min, 10);

        if (currentValue > minValue) {
            input.value = currentValue - 1;
            console.log("Número disminuido:", input.value);
        }
    }

    // Función para iniciar el juego
    window.startGame = function () {
        const selectedDifficulty = document.querySelector('.difficulty-button.selected')?.dataset.difficulty;
        const numberOfImages = parseInt(document.getElementById('numberInput').value, 10);
    
        if (!selectedDifficulty) {
            Swal.fire({
                icon: 'warning',
                title: '¡Oops!',
                text: 'Por favor, selecciona una dificultad.',
                confirmButtonText: 'Entendido'
            });
            return;
        }
    
        console.log('Dificultad seleccionada:', selectedDifficulty);
        console.log('Número de imágenes:', numberOfImages);
    
        fetch('http://localhost:5000/api/seleccionar_imagenes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dificultad: selectedDifficulty,
                cantidad: numberOfImages
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error,
                    confirmButtonText: 'Entendido'
                });
            } else {
                console.log('Imágenes seleccionadas:', data.imagenes);
                console.log('Frases generadas:', data.frases);

                // Guardar la lista de imágenes y frases en localStorage
                localStorage.setItem('imagenes', JSON.stringify(data.imagenes));
                localStorage.setItem('frases', JSON.stringify(data.frases));

                // No mostrar nada en la página
                // Si necesitas redirigir a otra página, descomenta esta línea:
                window.location.href = '/cuentameAlgo'; // Redirige a la página del juego
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un problema al conectarse al servidor.',
                confirmButtonText: 'Entendido'
            });
        });    
    };
});
