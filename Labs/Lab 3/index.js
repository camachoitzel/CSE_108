//Calculator Program

const display = document.getElementById("display");
const operatorBtns = document.querySelectorAll(".operator-btn");
//keep track of the numbers operators and result
let firstNumber = null;
let secondNumber = null;
let currentOperator = null;
let lastOperator = null;
let lastOperand = null;
let operatorJustPressed = false;
let lastResult = null;
let activeOperatorBtn = null;

function appendToDisplay(input) {
    // If an operator was just pressed, clear display for next number
    if (operatorJustPressed) {
        display.value = "";
        operatorJustPressed = false;
        removeOperatorHighlight();
    }
    display.value += input;
}

//clears the display setx value to empty string then sets nums and operators to null
function clearDisplay() {
    display.value = "";
    firstNumber = null;
    secondNumber = null;
    currentOperator = null;
    lastOperator = null;
    lastOperand = null;
    lastResult = null;
    operatorJustPressed = false;
    removeOperatorHighlight();
}

//used to calculate the result
function calculate() {
    if (currentOperator) {
        secondNumber = parseFloat(display.value);
        let result = operate(currentOperator, firstNumber, secondNumber);
        display.value = result;
        lastOperator = currentOperator;
        lastOperand = secondNumber;
        lastResult = result;
        firstNumber = result;
        currentOperator = null;
        operatorJustPressed = false;
        removeOperatorHighlight();
    } else if (lastOperator && lastOperand !== null) {
        // Repeated equals
        let result = operate(lastOperator, parseFloat(display.value), lastOperand);
        display.value = result;
        firstNumber = result;
        lastResult = result;
    }
}

function operatorButtonPressed(operator, btn) {
    // If an operator is already active and a number is entered, calculate
    if (currentOperator && !operatorJustPressed) {
        secondNumber = parseFloat(display.value);
        let result = operate(currentOperator, firstNumber, secondNumber);
        display.value = result;
        firstNumber = result;
        lastOperator = currentOperator;
        lastOperand = secondNumber;
    } else {
        firstNumber = parseFloat(display.value);
    }
    currentOperator = operator;
    operatorJustPressed = true;
    highlightOperator(btn);
}

function operate(operator, a, b) {
    if (operator === '+') return a + b;
    if (operator === '-') return a - b;
    if (operator === '*') return a * b;
    if (operator === '/') return b !== 0 ? a / b : 'Error';
    return b;
}

function highlightOperator(btn) {
    removeOperatorHighlight();
    btn.classList.add('active-operator');
    activeOperatorBtn = btn;
}

function removeOperatorHighlight() {
    operatorBtns.forEach(function(btn) {
        btn.classList.remove('active-operator');
    });
    activeOperatorBtn = null;
}

// Attach event listeners to operator buttons
operatorBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        operatorButtonPressed(btn.textContent.trim(), btn);
    });
});
