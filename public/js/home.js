// Seleccionar todas las imágenes arrastrables y los slots
const draggables = document.querySelectorAll('.draggable');
const slots = document.querySelectorAll('.slot');

// Añadir eventos de arrastrar a las imágenes
draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart);
    draggable.addEventListener('dragend', dragEnd);
});

// Añadir eventos a los slots
slots.forEach(slot => {
    slot.addEventListener('dragover', dragOver);
    slot.addEventListener('dragenter', dragEnter);
    slot.addEventListener('dragleave', dragLeave);
    slot.addEventListener('drop', dragDrop);
});

function dragStart(event) {
    // Añadir un identificador al elemento arrastrado
    event.dataTransfer.setData('text/plain', event.target.dataset.color);
    event.target.classList.add('dragging');
}

function dragEnd(event) {
    // Quitar la clase visual cuando termine el arrastre
    event.target.classList.remove('dragging');
}

function dragOver(event) {
    // Prevenir el comportamiento por defecto para permitir el drop
    event.preventDefault();
}

function dragEnter(event) {
    // Añadir una clase para indicar que el slot está activo
    event.preventDefault();
    event.target.classList.add('slot-hover');
}

function dragLeave(event) {
    // Quitar la clase visual cuando el elemento arrastrado sale del slot
    event.target.classList.remove('slot-hover');
}

function dragDrop(event) {
  event.preventDefault();

  const slotColor = event.target.dataset.color;
  const draggableColor = event.dataTransfer.getData('text/plain');

  if (slotColor === draggableColor) {
      const draggingElement = document.querySelector('.dragging');

      // Añadir la imagen al slot sin eliminar otras imágenes
      event.target.appendChild(draggingElement);
      event.target.classList.remove('slot-hover');

      // Verificar si se cumplió la condición de ganar
      checkWinCondition();
  } else {
      window.location.href = '/error'
      window.onload = function() {
        // Obtener el audio de la página
        const screenSound = document.getElementById('screenSound');
        
        // Reproducir el sonido
        screenSound.play();
    }
  }
}

function checkWinCondition() {
  const slots = document.querySelectorAll('.slot');
  let isWin = true; // Suponemos que todo está bien y verificamos lo contrario

  slots.forEach(slot => {
      const slotColor = slot.dataset.color;
      const children = slot.children;

      // Verificamos si el slot tiene una imagen y si la imagen coincide con el color
      if (children.length === 0 || children[0].dataset.color !== slotColor) {
          isWin = false; // Si no hay imagen o la imagen no coincide, no ha ganado
      }
  });

  // Si isWin sigue siendo true, significa que todas las imágenes están en los colores correctos
  if (isWin) {
      window.location.href = '/felicidadesC'
      window.onload = function() {
        // Obtener el audio de la página
        const screenSound = document.getElementById('screenSound');
        
        // Reproducir el sonido
        screenSound.play();
    }
  }
}

