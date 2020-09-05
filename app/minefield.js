const BOX = {
  0: 'zero',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven'
};

const FIELD_SIZE = 500;

const random = () => Math.floor(Math.random() * 9);

// Bomb is represented by 8
const isBomb = value => value === '8';

function isValid(i, j) {
  return (i >= 0 && i < 9 && j >= 0 && j < 9);
}

const floodFill = (i, j) => {
  if (!isValid(i, j)) {
    return;
  }

  if (matrix[i][j] > 0) {
    matrix[i][j] = 10;
    return;
  }

  if (matrix[i][j] == 0) {
    matrix[i][j] = 10;
    floodFill(i, j - 1);
    floodFill(i, j + 1);
    floodFill(i - 1, j);
    floodFill(i + 1, j);
  }
}

// Reveal a box
const reveal = ({ target }) => {
  const value = target.getAttribute('value');
  target.className = `box ${BOX[value]}`;

  // Bomb is represented by 8
  if (isBomb(value)) {
    target.innerHTML = '<img src=\"./assets/bomb.png\"></img>';
    target.className = 'box';
    return;
  }

  // We don't want to show 0
  if (value > 0) {
    target.innerHTML = value;
  }
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

// Create a random box
const getRandomBox = () => {
  const value = random();
  const div = document.createElement('div');

  // Start as closed
  div.setAttribute('open', false);
  // Set the inner value
  div.setAttribute('value', value);
  // Set the onclick event that reveals a box
  div.setAttribute('onclick', 'reveal(event)');
  // Set the right click handler
  div.setAttribute('oncontextmenu', 'flag(event)');
  // Set the className
  div.className = 'box';

  return div;
};

let matrix = [];

const onClick = ({ target }) => {
  const x = target.getAttribute('x')
  const y = target.getAttribute('y')
  floodFill(parseInt(x), parseInt(y));
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const div = document.createElement('div');
      div.setAttribute('x', i);
      div.setAttribute('y', j);
      div.setAttribute('onclick', 'onClick(event)');
      div.innerHTML = `${matrix[i][j]}|`;
      field.appendChild(div);
    }
  }
}

class Cell {
  count = random();
  releved = false;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get element() {
    const div = document.createElement('div');
    div.className = 'box';
    div.innerHTML = count;
  }

  revel() {
    this.releved = true;
  }
}

const start = ({ target }) => {
  // Hide the start button
  target.hidden = true;

  // Get the field element
  const field = document.getElementById('field');

  // Populates the field
  for (let i = 0; i < 9; i++) {
    matrix[i] = [];
    for (let j = 0; j < 9; j++) {
      matrix[i][j] = 0;
    }
  }
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const div = document.createElement('div');
      div.setAttribute('x', i);
      div.setAttribute('y', j);
      div.setAttribute('onclick', 'onClick(event)');
      div.innerHTML = `${matrix[i][j]}|`;
      field.appendChild(div);
    }
  }
};
