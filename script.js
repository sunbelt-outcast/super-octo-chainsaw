const currentOperand = document.querySelector('#current-operand');
const previousOperand = document.querySelector('#previous-operand');

let current = '0';
let previous = '';
let operation = null;
let resetOnNextNumber = false;

function formatNumber(value) {
  if (value === 'Error') return value;

  const [integer, decimal] = value.split('.');
  const formattedInteger = Number(integer).toLocaleString('en-US');
  return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
}

function updateDisplay() {
  currentOperand.textContent = formatNumber(current);
  previousOperand.textContent = previous && operation
    ? `${formatNumber(previous)} ${operation}`
    : '';
}

function appendNumber(number) {
  if (resetOnNextNumber) {
    current = '0';
    resetOnNextNumber = false;
  }

  if (number === '.' && current.includes('.')) return;
  if (current === '0' && number !== '.') current = number;
  else current += number;
  updateDisplay();
}

function chooseOperation(nextOperation) {
  if (operation && !resetOnNextNumber) calculate();
  operation = nextOperation;
  previous = current;
  resetOnNextNumber = true;
  updateDisplay();
}

function calculate() {
  if (!operation || previous === '') return;

  const left = Number(previous.replace(/,/g, ''));
  const right = Number(current.replace(/,/g, ''));
  let result;

  switch (operation) {
    case '+': result = left + right; break;
    case '−': result = left - right; break;
    case '×': result = left * right; break;
    case '÷':
      if (right === 0) {
        current = 'Error';
        previous = '';
        operation = null;
        resetOnNextNumber = true;
        updateDisplay();
        return;
      }
      result = left / right;
      break;
  }

  current = String(Math.round((result + Number.EPSILON) * 100000000000) / 100000000000);
  previous = '';
  operation = null;
  resetOnNextNumber = true;
  updateDisplay();
}

function clear() {
  current = '0';
  previous = '';
  operation = null;
  resetOnNextNumber = false;
  updateDisplay();
}

function deleteNumber() {
  if (resetOnNextNumber || current === 'Error') {
    clear();
    return;
  }
  current = current.length > 1 ? current.slice(0, -1) : '0';
  updateDisplay();
}

document.querySelectorAll('[data-number]').forEach((button) => {
  button.addEventListener('click', () => appendNumber(button.dataset.number));
});

document.querySelectorAll('[data-operation]').forEach((button) => {
  button.addEventListener('click', () => chooseOperation(button.dataset.operation));
});

document.querySelector('[data-action="clear"]').addEventListener('click', clear);
document.querySelector('[data-action="delete"]').addEventListener('click', deleteNumber);
document.querySelector('[data-action="equals"]').addEventListener('click', calculate);

window.addEventListener('keydown', (event) => {
  if (/^[0-9.]$/.test(event.key)) appendNumber(event.key);
  else if (event.key === '+') chooseOperation('+');
  else if (event.key === '-') chooseOperation('−');
  else if (event.key === '*') chooseOperation('×');
  else if (event.key === '/') chooseOperation('÷');
  else if (event.key === 'Enter' || event.key === '=') calculate();
  else if (event.key === 'Backspace') deleteNumber();
  else if (event.key === 'Escape') clear();
});
