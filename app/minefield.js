const FIELD_SIZE = 5;

const floodFill = (i, j) => {
  if (!isValid(i, j) || document.getElementById(`${ i }${ j }`).innerHTML === 'aberto') {
    return;
  }

  if (matrix[i][j] > 0 && matrix[i][j] != 8 ) {
    document.getElementById(`${ i }${ j }`).innerHTML = matrix[i][j];
    return;
  }

  if (matrix[i][j] == 0) {
    reveal(i, j, m);
    floodFill(i, j - 1);
    floodFill(i, j + 1);
    floodFill(i - 1, j);
    floodFill(i + 1, j);
  }

  if (matrix[i][j] == -1) {
    document.getElementById(`${ i }${ j }`).innerHTML = '<img src=\"./assets/bomb.png\"></img>';
    return;
  }
}

// Reveal a box
const reveal = ({ target }) => {
  const value = parseInt(target.getAttribute('value'));

  // Has a bomb
  if (value === -1) {
    target.innerHTML = '<img src=\"./assets/bomb.png\"></img>';
    return;
  }

  // Clean space
  if (value === 0) {
    target.className = 'box zero';
    return;
  }

  // Set the neighbors count
  target.innerHTML = value;
}

const flag = (event) => {
  event.preventDefault();

  // Set as a flag box
  const { target } = event;
  target.innerHTML = '<img src=\"./assets/flag.png\"></img>';
  target.className = 'box';

  // Don't show the current behavior
  return false;
}

const onClick = (i, j) => {
  floodFill(parseInt(i), parseInt(j));
}

const random = (max) => Math.floor((Math.random() * 1000) + 1) % max;

const isValid = (x, y) => x >= 0 && x < FIELD_SIZE && y >=0 && y < FIELD_SIZE;

const hasBomb = (x, y, m) => isValid(x, y) && m[x][y] === -1;

const neighbors = (x, y, m) => {
  let n = 0;
  if (hasBomb(x - 1, y - 1, m)) {
    n++;
  }
  if (hasBomb(x, y - 1, m)) {
    n++;
  }
  if (hasBomb(x + 1, y - 1, m)) {
    n++;
  }
  if (hasBomb(x - 1, y, m)) {
    n++;
  }
  if (hasBomb(x + 1, y, m)) {
    n++;
  }
  if (hasBomb(x - 1, y + 1, m)) {
    n++;
  }
  if (hasBomb(x, y + 1, m)) {
    n++;
  }
  if (hasBomb(x + 1, y + 1, m)) {
    n++;
  }
  return n;
}

const field = (max) => {
  let n = 0;
  let m = [];
  for (let i = 0; i < FIELD_SIZE; i++) {
    m[i] = [];
    for (let j = 0; j < FIELD_SIZE; j++) {
      m[i][j] = 0;
    }
  }

  while (n < max) {
    const x = random(FIELD_SIZE);
    const y = random(FIELD_SIZE);

    m[x][y] = -1;
    n++;
  }

  for (let i = 0; i < FIELD_SIZE; i++) {
    for (let j = 0; j < FIELD_SIZE; j++) {
      if (m[i][j] !== -1) {
        m[i][j] = neighbors(i, j, m);
      }
    }
  }

  return m;
}

const start = ({ target }) => {
  // Hide the start button
  target.hidden = true;

  // Get the field element
  const fieldElement = document.getElementById('field');
  const matrix = field(5);

  // Populates the field
  for (let i = 0; i < FIELD_SIZE; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < FIELD_SIZE; j++) {
      const cell = document.createElement('td');
      cell.setAttribute('onclick', 'reveal(event)');
      cell.setAttribute('value', matrix[i][j]);
      cell.className = 'box';
      row.appendChild(cell);
    }
    fieldElement.appendChild(row);
  }
};
