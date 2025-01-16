document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado"); // Verificar que el script está cargado

    const audio = document.getElementById('screenSound');
    audio.play(); // Reproducir el sonido al cargar la pantalla

    let currentIndex = parseInt(localStorage.getItem('currentIndex'));
    let numImagenes = parseInt(localStorage.getItem('numImagenes'));
    let retro = localStorage.getItem('retro');

    if (output) output.textContent = retro

    window.changeButton = function () {
        
        console.log(`Índice actual: ${currentIndex}, Total imágenes: ${numImagenes}`);

        // Si es la última imagen, redirigir a pantalla final
        if (currentIndex >= numImagenes) {
            window.location.href = '/terminado_ca';
        } else {
            // De lo contrario, redirigir a la siguiente pantalla
            currentIndex++;
            if (currentIndex >= numImagenes) {
                window.location.href = '/terminado_ca';
            }
            else{
                localStorage.setItem('currentIndex', currentIndex); // Actualizar índice
                window.location.href = '/cuentameAlgo';
        }
        }
    }

    window.repeat = function () {
        window.location.href = '/cuentameAlgo'; 
    }
});
