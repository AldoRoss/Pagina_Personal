document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado"); // Verificar que el script está cargado

    const audio = document.getElementById('screenSound');
    audio.play(); // Reproducir el sonido al cargar la pantalla


    window.changeButton = function () {
        window.location.href = '/settingTotis'; 
    }
});
