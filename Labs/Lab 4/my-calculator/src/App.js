//Calculator Program
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

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

    function operatorButtonPressed(operator) {
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

    const operatorProps = { variant: "contained", color: "info" };
    const clearProps = { variant: "contained", color: "error" };
    const numberProps = { variant: "contained", color: "success" };
    const otherProps = { variant: "contained", color: "success" };

    return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh', background: 'hsl(0, 0%, 95%)' }}
    >
      <Grid item xs={12} md={6} >
        <Grid
          container
          direction="column"
          style={{
            background: "hsl(0, 0%, 15%)",
            borderRadius: "15px",
            maxWidth: "500px",
            margin: "0 auto",
            overflow: "hidden",
            padding: "24px"
          }}
        >
          <TextField
            id="display"
            value={displayValue}
            inputProps={{ readOnly: true, style: { fontSize: '3rem', color: 'white', backgroundColor: 'hsl(0, 0%, 20%)' } }}
            variant="filled"
            fullWidth
            sx={{ marginBottom: 2, backgroundColor: 'hsl(0, 0%, 20%)', borderRadius: '6px' }}
          />

          <Grid container spacing={2} id="keys">
            {/* Row 1 */}
            <Grid item xs={3}>
              <Button {...numberProps} onClick={() => appendToDisplay('7')}>7</Button>
            </Grid>
            <Grid item xs={3}>
              <Button {...numberProps} onClick={() => appendToDisplay('8')}>8</Button>
            </Grid>
            <Grid item xs={3}>
              <Button {...numberProps} onClick={() => appendToDisplay('9')}>9</Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                {...operatorProps}
                onClick={() => operatorButtonPressed('/')}
                sx={activeOperator === '/' ? { boxShadow: '0 0 0 4px #ffb700', backgroundColor: 'hsl(197, 100%, 63%)' } : {}}
              >
                /
              </Button>
            </Grid>
            {/* Row 2 */}
            <Grid item xs={3}>
              <Button {...numberProps} onClick={() => appendToDisplay('4')}>4</Button>
            </Grid>
            <Grid item xs={3}>
              <Button {...numberProps} onClick={() => appendToDisplay('5')}>5</Button>
            </Grid>
            <Grid item xs={3}>
              <Button {...numberProps} onClick={() => appendToDisplay('6')}>6</Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                {...operatorProps}
                onClick={() => operatorButtonPressed('*')}
                sx={activeOperator === '*' ? { boxShadow: '0 0 0 4px #ffb700', backgroundColor: 'hsl(197, 100%, 63%)' } : {}}
              >
                *
              </Button>
            </Grid>
            {/* Row 3 */}
            <Grid item xs={3}>
              <Button {...numberProps} onClick={() => appendToDisplay('1')}>1</Button>
            </Grid>
            <Grid item xs={3}>
              <Button {...numberProps} onClick={() => appendToDisplay('2')}>2</Button>
            </Grid>
            <Grid item xs={3}>
              <Button {...numberProps} onClick={() => appendToDisplay('3')}>3</Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                {...operatorProps}
                onClick={() => operatorButtonPressed('-')}
                sx={activeOperator === '-' ? { boxShadow: '0 0 0 4px #ffb700', backgroundColor: 'hsl(197, 100%, 63%)' } : {}}
              >
                -
              </Button>
            </Grid>
            {/* Row 4 */}
            <Grid item xs={3}>
              <Button {...numberProps} onClick={() => appendToDisplay('0')}>0</Button>
            </Grid>
            <Grid item xs={3}>
              <Button {...otherProps} onClick={() => appendToDisplay('.')}>.</Button>
            </Grid>
            <Grid item xs={3}>
              <Button {...otherProps} onClick={calculate}>=</Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                {...operatorProps}
                onClick={() => operatorButtonPressed('+')}
                sx={activeOperator === '+' ? { boxShadow: '0 0 0 4px #ffb700', backgroundColor: 'hsl(197, 100%, 63%)' } : {}}
              >
                +
              </Button>
            </Grid>
            {/* Row 5 (Clear Button) */}
            <Grid item xs={12}>
              <Button {...clearProps} onClick={clearDisplay}>C</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

}

export default Calculator;
