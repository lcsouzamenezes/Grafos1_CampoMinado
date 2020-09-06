let gameEnd = false;
const FIELD_SIZE = 5;

const floodFill = (i, j, matrix) => {
  if (gameEnd) {
    return;
  }

  if (!isValid(i, j)) {
    return;
  }

  const element = document.getElementById(`${ i }${ j }`);
  const open = element.getAttribute('open');

  if (open) {
    return;
  }

  if (matrix[i][j] > 0 && matrix[i][j] !== -1) {
    element.innerHTML = matrix[i][j];
    element.setAttribute('open', true);
    return;
  }

  if (matrix[i][j] === 0) {
    element.setAttribute('open', true);
    element.className = 'box zero';
    floodFill(i, j - 1, matrix);
    floodFill(i, j + 1, matrix);
    floodFill(i - 1, j, matrix);
    floodFill(i + 1, j, matrix);
  }

  if (matrix[i][j] == -1) {
    element.innerHTML = '<img src=\"./assets/bomb.png\"></img>';
    const target = document.getElementById('start');
    target.hidden = false;
    gameEnd = true;
    return;
  }
}

const flag = (event) => {
  if (gameEnd) {
    return;
  }

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
  gameEnd = false;
  // Hide the start button
  target.hidden = true;

  // Get the field element
  const fieldElement = document.getElementById('field');
  fieldElement.innerHTML = '';
  const matrix = field(5);

  // Populates the field
  for (let i = 0; i < FIELD_SIZE; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < FIELD_SIZE; j++) {
      const cell = document.createElement('td');
      cell.onclick = () => floodFill(i, j, matrix);
      cell.oncontextmenu = (event) => flag(event);
      cell.setAttribute('id', `${ i }${ j }`);
      cell.setAttribute('value', matrix[i][j]);
      cell.className = 'box';
      row.appendChild(cell);
    }
    fieldElement.appendChild(row);
  }
};
