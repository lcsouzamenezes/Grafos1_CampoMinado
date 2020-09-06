let timer;
let gameEnd = false;
const FIELD_SIZE = 5;

const TIMER = {
  days: 'd',
  hours: 'h',
  minutes: 'm',
  seconds: 's'
};

const timerCalc = (time) => {
  const days = Math.floor(time / (1000 * 60 * 60 * 24));
  const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);

  return {
      days,
      hours,
      minutes,
      seconds
  };
}

// Handle minefield timer
const startTimer = () => {
  const startTime = new Date();

  const updateTimer = () => {
      const currentTime = new Date();
      const time = currentTime - startTime;
      const timer = timerCalc(time);

      const value = Object.entries(timer)
          .map(([k, v]) => {
              // If it's a valid value
              if (v > 0) {
                  return `${v}${TIMER[k]}`;
              }
              return false;
          })
          .filter(v => v)
          .join(' ');

      document.getElementById('timer').innerHTML = value;
  }

  // 1 second interval
  timer = window.setInterval(updateTimer, 1000);
}

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
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
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
  startTimer();

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
