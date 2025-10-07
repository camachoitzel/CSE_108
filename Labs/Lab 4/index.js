//Calculator Program
import React, { useState } from 'react';

function Calculator(){
    //keeps track of display value
    const [displayValue, setDisplayValue] = useState('');
    
    //keep track of the numbers operators and result
    const [firstNumber, setFirstNumber] = useState(null);
    const [secondNumber, setSecondNumber] = useState(null);
    const [currentOperator, setCurrentOperator] = useState(null);
    const [lastOperator, setLastOperator] = useState(null);
    const [lastOperand, setLastOperand] = useState(null);
    const [operatorJustPressed, setOperatorJustPressed] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    const [activeOperator, setActiveOperator] = useState(null);


    function operate(operator, a, b) {

        if (operator === '+') return a + b;
        if (operator === '-') return a - b;
        if (operator === '*') return a * b;
        if (operator === '/') return b !== 0 ? a / b : 'Error';
        return b;
    }

    function appendToDisplay(input) {
        if (input === '.') {
        const parts = displayValue.split(/[\+\-\*\/]/);
        const lastNumber = parts[parts.length - 1];
        
            if (lastNumber.includes('.')){
                return;
            }  
        }
        
        if (operatorJustPressed) {
        setDisplayValue(input);  // Replace clears with current input
        setOperatorJustPressed(false);
        setActiveOperator(null);
        } 
        
        else {
            setDisplayValue(prev => prev + input);
        }
    }



    function clearDisplay() {
        
        setDisplayValue('');
        setFirstNumber(null);
        setSecondNumber(null);
        setCurrentOperator(null);
        setLastOperator(null);
        setLastOperand(null);
        setLastResult(null);
        setOperatorJustPressed(false);
        setActiveOperator(null);
    }


    //used to calculate the result
    function calculate() {
        if (currentOperator) {
            const value = parseFloat(displayValue);
            setSecondNumber(value);
            const result = operate(currentOperator, firstNumber, value);
            setDisplayValue(String(result));
            setLastOperator(currentOperator);
            setLastOperand(value);
            setLastResult(result);
            setFirstNumber(result);
            setCurrentOperator(null);
            setOperatorJustPressed(false);
            setActiveOperator(null);
            
        } else if (lastOperator && lastOperand !== null) {
            // Repeated equals
            const result = operate(lastOperator, parseFloat(displayValue), lastOperand);
            setDisplayValue(String(result));
            setFirstNumber(result);
            setLastResult(result);
        }
    }

    function operatorButtonPressed(operator, btn) {
        // If an operator is already active and a number is entered, calculate
        if (currentOperator && !operatorJustPressed) {
            const value = parseFloat(displayValue);
            setSecondNumber(value);
            const result = operate(currentOperator, firstNumber, value);
            setDisplayValue(String(result));
            setFirstNumber(result);
            setLastOperator(currentOperator);
            setLastOperand(value);
        } else {
            setFirstNumber(parseFloat(displayValue));
        }
        setCurrentOperator(operator);
        setOperatorJustPressed(true);
        setActiveOperator(operator);

    }

    const numberButtons = [];
        for (let i = 0; i <= 9; i++) {
        numberButtons.push(
      <button key={i} onClick={() => appendToDisplay(String(i))}>
        {i}
      </button>
        );
    }

    return (
        <div id="calculator">
          <input id="display" type="text" value={displayValue} readOnly />
          <div id="keys">
            <div className="numbers">{numberButtons}</div>
            <div className="operators">
              {['+', '-', '*', '/'].map(op => (
                <button
                  key={op}
                  onClick={() => operatorButtonPressed(op)}
                  className={`operator-btn ${activeOperator === op ? 'active-operator' : ''}`}
                >
                  {op}
                </button>
              ))}
            </div>
            <button onClick={clearDisplay} className="clear-btn">C</button>
            <button onClick={() => appendToDisplay('.')}>.</button>
            <button onClick={calculate}>=</button>
          </div>
        </div>
    );

}

export default Calculator;
