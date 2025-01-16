document.addEventListener('DOMContentLoaded', () => {
    let numImagenes = parseInt(localStorage.getItem('numImagenes'));
    let puntaje = parseInt(localStorage.getItem('puntaje'));
    const output = document.getElementById('output'); // Asegúrate de que el elemento `output` existe en el DOM
    if (output) output.textContent = (`Obtuviste: ${puntaje} de ${numImagenes} puntos.`)


    const audio = document.getElementById('screenSound');
    audio.play(); // Reproducir el sonido al cargar la pantalla
    
    console.log("DOM cargado"); // Verificar que el script está cargado

    window.changeButton = function () {
        window.location.href = '/panelDeJuegos'; 
    }

});
