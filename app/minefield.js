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

const random = () => Math.floor(Math.random() * 8);

// Reveal a box
const reveal = ({ target }) => {
  const value = target.getAttribute('value');
  target.className = `box ${ BOX[value] }`;
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

const start = ({ target }) => {
  // Hide the start button
  target.hidden = true;

  // Get the field element
  const field = document.getElementById('field');

  // Populates the field
  [...new Array(FIELD_SIZE)].forEach(() => {
    const child = getRandomBox();
    field.appendChild(child);
  });
};
