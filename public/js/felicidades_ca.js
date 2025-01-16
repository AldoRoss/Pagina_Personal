document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado"); // Verificar que el script está cargado

    const audio = document.getElementById('screenSound');
    audio.play(); // Reproducir el sonido al cargar la pantalla

    // Leer valores desde localStorage con valores predeterminados
    let currentIndex = parseInt(localStorage.getItem('currentIndex'));
    let numImagenes = parseInt(localStorage.getItem('numImagenes'));
    let puntaje = parseInt(localStorage.getItem('puntaje'));
    let retro = localStorage.getItem('retro');
    if (output) output.textContent = retro

    window.changeButton = function () {
        console.log(`Índice actual: ${currentIndex}, Total imágenes: ${numImagenes}`);
        puntaje++
        localStorage.setItem('puntaje', puntaje);


        // Si es la última imagen, redirigir a pantalla final
        if (currentIndex === numImagenes) {
            window.location.href = '/terminado_ca';
            localStorage.setItem('currentIndex', currentIndex); // Actualizar índice
        } else {
            // De lo contrario, redirigir a la siguiente pantalla
            window.location.href = '/cuentameAlgo';
        }
    };
});

