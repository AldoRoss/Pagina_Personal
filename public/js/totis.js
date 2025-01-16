document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get('difficulty'); // Obtener dificultad seleccionada
    const grid = document.querySelector('.grid');
    const movementCards = document.querySelectorAll('.movement-card');
    const remainingMoves = {
        up: Infinity,
        down: Infinity,
        left: Infinity,
        right: Infinity,
    };

    let playerPos; // Declarar posiciones globales
    let totisPos;

    const obstacles = new Set();

    let lastMoveTime = Date.now();  // Mantener el tiempo del último movimiento
    const MOVEMENT_TIMEOUT = 10000;  // 10 segundos en milisegundos
    const timer = setInterval(() => {
        if (Date.now() - lastMoveTime >= MOVEMENT_TIMEOUT) {
            // Si pasaron más de 10 segundos sin movimiento
            window.location.href = '/perdiste'; // Redirigir a la pantalla de "perdió"
        }
    }, 1000);  // Revisar cada segundo

    // Configuración inicial del tablero
    function getRandomPosition() {
        const row = Math.floor(Math.random() * 6); // Filas de 0 a 5
        const col = Math.floor(Math.random() * 9); // Columnas de 0 a 8
        return { row, col };
    }

    function setupPositions() {
        // Generar posición inicial para el jugador
        let validPosition = false;

        while (!validPosition) {
            playerPos = getRandomPosition();
            if (!obstacles.has(`${playerPos.row}-${playerPos.col}`)) {
                validPosition = true; // La posición del jugador no tiene obstáculos
            }
        }

        // Generar posición inicial para Totis
        validPosition = false;
        while (!validPosition) {
            totisPos = getRandomPosition();
            if (
                !obstacles.has(`${totisPos.row}-${totisPos.col}`) &&
                (playerPos.row !== totisPos.row || playerPos.col !== totisPos.col)
            ) {
                validPosition = true; // La posición de Totis es válida
            }
        }
    }

    function setupGame() {
        obstacles.clear();
        setupPositions();

        switch (difficulty) {
            case 'easy':
                setupEasy();
                break;
            case 'normal':
                setupNormal();
                break;
            case 'hard':
                setupHard();
                break;
            default:
                console.error('Dificultad no reconocida.');
        }

        if (!isSolvable()) {
            alert('El tablero generado no es resoluble. Reiniciando...');
            setupGame(); // Reiniciar
        } else {
            updateRemainingMovesUI();
            renderGrid();
        }
    }

    function setupEasy() {
        remainingMoves.up = remainingMoves.down = remainingMoves.left = remainingMoves.right = Infinity;
    }

    function setupNormal() {
        const { moveCounts } = distributeMovesBFS();
        const extraMoves = 3;
        for (const [move, count] of Object.entries(moveCounts)) {
            remainingMoves[move] = count + extraMoves;
        }
        addObstacles(5);
    }

    function setupHard() {
        const { moveCounts } = distributeMovesBFS();
        const extraMoves = 1;
        for (const [move, count] of Object.entries(moveCounts)) {
            remainingMoves[move] = count + extraMoves;
        }
        addObstacles(15);
    }

    function updateRemainingMovesUI() {
        for (const [move, count] of Object.entries(remainingMoves)) {
            const span = document.querySelector(`.remaining[data-move="${move}"]`);
            if (span) span.innerText = count === Infinity ? '∞' : count;
        }
    }

    function distributeMovesBFS() {
        const directions = {
            up: { row: -1, col: 0 },
            down: { row: 1, col: 0 },
            left: { row: 0, col: -1 },
            right: { row: 0, col: 1 },
        };

        const queue = [{ row: playerPos.row, col: playerPos.col, path: [] }];
        const visited = new Set();
        const moveCounts = { up: 0, down: 0, left: 0, right: 0 };

        while (queue.length > 0) {
            const { row, col, path } = queue.shift();
            const key = `${row}-${col}`;

            if (visited.has(key)) continue;
            visited.add(key);

            if (row === totisPos.row && col === totisPos.col) {
                path.forEach(move => moveCounts[move]++);
                break;
            }

            for (const [direction, { row: dRow, col: dCol }] of Object.entries(directions)) {
                const newRow = row + dRow;
                const newCol = col + dCol;
                const neighborKey = `${newRow}-${newCol}`;

                if (
                    newRow >= 0 &&
                    newRow < 6 &&
                    newCol >= 0 &&
                    newCol < 9 &&
                    !obstacles.has(neighborKey) &&
                    !visited.has(neighborKey)
                ) {
                    queue.push({ row: newRow, col: newCol, path: [...path, direction] });
                }
            }
        }

        return { moveCounts };
    }

    function isSolvable() {
        const queue = [playerPos];
        const visited = new Set();
        const directions = [
            { row: -1, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: 0, col: 1 },
        ];

        while (queue.length > 0) {
            const { row, col } = queue.shift();
            const key = `${row}-${col}`;

            if (visited.has(key)) continue;
            visited.add(key);

            if (row === totisPos.row && col === totisPos.col) return true;

            for (const { row: dRow, col: dCol } of directions) {
                const newRow = row + dRow;
                const newCol = col + dCol;
                const neighborKey = `${newRow}-${newCol}`;

                if (
                    newRow >= 0 &&
                    newRow < 6 &&
                    newCol >= 0 &&
                    newCol < 9 &&
                    !obstacles.has(neighborKey) &&
                    !visited.has(neighborKey)
                ) {
                    queue.push({ row: newRow, col: newCol });
                }
            }
        }

        return false;
    }

    function addObstacles(count) {
        do {
            obstacles.clear();
            while (obstacles.size < count) {
                const row = Math.floor(Math.random() * 6);
                const col = Math.floor(Math.random() * 9);
                if (
                    (row !== playerPos.row || col !== playerPos.col) &&
                    (row !== totisPos.row || col !== totisPos.col)
                ) {
                    obstacles.add(`${row}-${col}`);
                }
            }
        } while (!isSolvable());
    }

    function renderGrid() {
        grid.innerHTML = '';
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;

                if (row === playerPos.row && col === playerPos.col) {
                    cell.innerHTML = '<img src="/img/player.png" alt="Jugador">';
                } else if (row === totisPos.row && col === totisPos.col) {
                    cell.innerHTML = '<img src="/img/totis.png" alt="Totis">';
                } else if (obstacles.has(`${row}-${col}`)) {
                    cell.innerHTML = '<img src="/img/muro.png" alt="Muro">';
                }

                grid.appendChild(cell);
            }
        }
    }




    // Mover jugador
    function movePlayer(direction) {
        const { row, col } = playerPos;
        let newRow = row;
        let newCol = col;

        if (remainingMoves[direction] <= 0) return; // No permitir movimientos si ya no hay movimientos restantes

        switch (direction) {
            case 'up':
                newRow = row - 1;
                break;
            case 'down':
                newRow = row + 1;
                break;
            case 'left':
                newCol = col - 1;
                break;
            case 'right':
                newCol = col + 1;
                break;
        }

        // Validar límites del tablero y obstáculos
        if (
            newRow >= 0 &&
            newRow < 6 &&
            newCol >= 0 &&
            newCol < 9 &&
            !obstacles.has(`${newRow}-${newCol}`)
        ) {
            // Movimiento válido
            playerPos = { row: newRow, col: newCol };

            // Restar movimiento si no es infinito
            if (remainingMoves[direction] !== Infinity) {
                remainingMoves[direction]--;
            }

            // Actualizar la UI de movimientos restantes
            document.querySelector(`.remaining[data-move="${direction}"]`).innerText =
                remainingMoves[direction] === Infinity ? '∞' : remainingMoves[direction];

            renderGrid();

            // Verificar si el jugador alcanzó a Totis
            if (playerPos.row === totisPos.row && playerPos.col === totisPos.col) {
                window.location.href = '/felicidades'; // Redirigir a pantalla de victoria
            }

            // Verificar si el jugador ha perdido por no tener suficientes movimientos
            const zeroMovesCount = Object.values(remainingMoves).filter(count => count <= 0).length;

            if (zeroMovesCount >= 3) {
                renderGrid(); // Asegurar que el tablero se renderice antes de la redirección
                setTimeout(() => {
                    window.location.href = '/perdiste'; // Redirigir a pantalla de "perdió"
                }, 500); // Pequeño retraso para mostrar el estado final
            }

            // Verificar si el tablero ya no se puede resolver
            if (!isSolvable()) {
                renderGrid(); // Asegurar que el tablero se renderice antes de la redirección
                setTimeout(() => {
                    window.location.href = '/perdiste';
                }, 500); // Pequeño retraso para mostrar el estado final
            }

            lastMoveTime = Date.now();

        } else {
            console.error(`Movimiento inválido hacia ${newRow}-${newCol}. Obstáculo o fuera de límites.`);

            // Comprobar si el jugador puede llegar al objetivo con los movimientos restantes
            if (!canReachGoal()) {
                renderGrid(); // Asegurar que el tablero se renderice antes de la redirección
                setTimeout(() => {
                    window.location.href = '/perdiste'; // Redirigir a pantalla de "perdió"
                }, 500); // Pequeño retraso para mostrar el estado final
            }

            return; // Detener ejecución si el movimiento no es válido
        }
    }

    // Función que verifica si es posible llegar al objetivo con los movimientos restantes
    function canReachGoal() {
        const directions = [
            { row: -1, col: 0 }, // Arriba
            { row: 1, col: 0 }, // Abajo
            { row: 0, col: -1 }, // Izquierda
            { row: 0, col: 1 }, // Derecha
        ];

        let remainingMovesCopy = { ...remainingMoves };

        // Usamos un enfoque similar a un BFS o DFS para ver si podemos llegar al objetivo con los movimientos restantes
        function dfs(currentRow, currentCol, movesLeft) {
            // Si ya estamos en el objetivo, hemos ganado
            if (currentRow === totisPos.row && currentCol === totisPos.col) {
                return true;
            }

            // Si no quedan movimientos, no podemos seguir
            if (movesLeft === 0) {
                return false;
            }

            // Recorrer las direcciones posibles
            for (const { row: dRow, col: dCol } of directions) {
                const newRow = currentRow + dRow;
                const newCol = currentCol + dCol;

                // Comprobar límites y obstáculos
                if (
                    newRow >= 0 &&
                    newRow < 6 &&
                    newCol >= 0 &&
                    newCol < 9 &&
                    !obstacles.has(`${newRow}-${newCol}`)
                ) {
                    // Si aún no hemos visitado esta celda, avanzar
                    if (remainingMovesCopy[direction] > 0) {
                        remainingMovesCopy[direction]--;
                        if (dfs(newRow, newCol, movesLeft - 1)) {
                            return true;
                        }
                        remainingMovesCopy[direction]++;
                    }
                }
            }

            return false;
        }

        // Iniciar DFS desde la posición actual del jugador
        return dfs(playerPos.row, playerPos.col, Object.values(remainingMoves).reduce((acc, val) => acc + val, 0));
    }

    // Evento para arrastrar movimientos
    movementCards.forEach((card) => {
        card.addEventListener('click', () => {
            const move = card.getAttribute('data-move');
            movePlayer(move);
        });
    });

    setupGame();
});
