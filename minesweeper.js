document.getElementById('startGame').addEventListener('click', () => {
    const gridSize = parseInt(document.getElementById('gridSize').value);
    const bombCount = parseInt(document.getElementById('bombCount').value);
    startGame(gridSize, bombCount);
});

function startGame(size, bombs) {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    const cells = Array(size * size).fill(0);
    for (let i = 0; i < bombs; i++) {
        let index;
        do {
            index = Math.floor(Math.random() * cells.length);
        } while (cells[index] === 'B');
        cells[index] = 'B';
    }

    for (let i = 0; i < cells.length; i++) {
        if (cells[i] !== 'B') {
            const neighbors = getNeighbors(i, size);
            cells[i] = neighbors.filter(n => cells[n] === 'B').length;
        }
    }

    cells.forEach((cell, index) => {
        const div = document.createElement('div');
        div.classList.add('cell');
        div.addEventListener('click', () => openCell(div, cell));
        board.appendChild(div);
    });
}

function getNeighbors(index, size) {
    const neighbors = [];
    const row = Math.floor(index / size);
    const col = index % size;

    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < size && c >= 0 && c < size && !(r === row && c === col)) {
                neighbors.push(r * size + c);
            }
        }
    }
    return neighbors;
}

function openCell(cell, value) {
    if (cell.classList.contains('open')) return;

    cell.classList.add('open');
    if (value === 'B') {
        cell.classList.add('bomb');
        cell.textContent = '💣';
        alert('ゲームオーバー！');
    } else if (value > 0) {
        cell.classList.add('number');
        cell.textContent = value;
    } else {
        cell.textContent = '';
    }
}
