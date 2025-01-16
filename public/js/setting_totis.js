document.addEventListener('DOMContentLoaded', () => {
    // Añadir la clase 'selected' al botón de dificultad seleccionado
    const buttons = document.querySelectorAll('.difficulty-button');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            buttons.forEach(b => b.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    // Función para iniciar el juego
    window.startGame = function () {
        const selectedDifficulty = document.querySelector('.difficulty-button.selected')?.dataset.difficulty;

        if (selectedDifficulty) {
            // Redirige al juego con la dificultad seleccionada
            const url = `/totis?difficulty=${selectedDifficulty}`;
            window.location.href = url; // Redirige a la página del juego
        } else {
            // Si no se selecciona dificultad, muestra una alerta con SweetAlert
            Swal.fire({
                icon: 'warning',
                title: '¡Oops!',
                text: 'Por favor, selecciona una dificultad.',
                confirmButtonText: 'Entendido'
            });
        }
    };
});
