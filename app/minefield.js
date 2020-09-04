const FIELD_SIZE = 500;

const start = () => {
  [...new Array(FIELD_SIZE)].forEach(() => {
    document.write('<div class="box one">1</div>');
  });
}