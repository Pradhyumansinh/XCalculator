import { useState } from 'react';
import './Calculator.css';
// import { prettyDOM } from '@testing-library/react';

const Calculator = () => {
    const [result, setResult] = useState('');
    const [inputValue, setInputValue] = useState('');

    const handleButtonClick = (value) => {
        if (value === '=') {
            try {
                setResult(calculateResult(inputValue));
            } catch (error) {
                setResult('Error');
            }
        } else if (value === 'C') {
            setInputValue('');
            setResult('');
        } else {
            setInputValue(inputValue + value);
        }
    }

    const calculateResult = (exp) => {
        if (exp === '') {
            return 'Error';
        }
        const operators = ['+', '-', '*', '/'];
        const precedence = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2,
        };

        const stack = [];
        const output = [];

        for (let i = 0; i < exp.length; i++) {
            const char = exp[i];

            if (char === '(') {
                stack.push(char);
            } else if (char === ')') {
                while (stack.length && stack[stack.length - 1] !== '(') {
                    output.push(stack.pop());
                }
                stack.pop();
            } else if (operators.includes(char)) {
                while (
                    stack.length &&
                    precedence[stack[stack.length - 1]] >= precedence[char]
                ) {
                    output.push(stack.pop());
                }
                stack.push(char);
            } else {
                let num = '';
                while (i < exp.length && !operators.includes(exp[i]) && exp[i] !== '(' && exp[i] !== ')') {
                    num += exp[i];
                    i++;
                }
                i--;
                output.push(num);
            }
        }

        while (stack.length) {
            output.push(stack.pop());
        }

        const evalStack = [];

        for (let token of output) {
            if (!operators.includes(token)) {
                evalStack.push(parseFloat(token));
            } else {
                const num2 = evalStack.pop();
                const num1 = evalStack.pop();
                switch (token) {
                    case '+':
                        evalStack.push(num1 + num2);
                        break;
                    case '-':
                        evalStack.push(num1 - num2);
                        break;
                    case '*':
                        evalStack.push(num1 * num2);
                        break;
                    case '/':
                        if (num1 === 0 && num2 === 0) {
                            evalStack.push('NaN');
                        } else if (num1 !== 0 && num2 === 0) {
                            evalStack.push('Infinity');
                        } else {
                            evalStack.push(num1 / num2);
                        }
                        break;
                    default:
                        throw new Error('Invalid operator');
                }
            }
        }

        if (evalStack.length !== 1) {
            throw new Error('Invalid expression');
        }

        return evalStack[0];
    };

    return (
        <div>
            <h1>React Calculator</h1>
            <input type='text' readOnly name='inputText' id='inputText' className='inputBox' value={inputValue} /><br></br>
            <div className='result'>{result}</div><br></br>
            <div className='row'>
                <button onClick={() => handleButtonClick('7')}>7</button>
                <button onClick={() => handleButtonClick('8')}>8</button>
                <button onClick={() => handleButtonClick('9')}>9</button>
                <button onClick={() => handleButtonClick('+')}>+</button>
            </div>
            <div className='row'>
                <button onClick={() => handleButtonClick('4')}>4</button>
                <button onClick={() => handleButtonClick('5')}>5</button>
                <button onClick={() => handleButtonClick('6')}>6</button>
                <button onClick={() => handleButtonClick('-')}>-</button>
            </div>
            <div className='row'>
                <button onClick={() => handleButtonClick('1')}>1</button>
                <button onClick={() => handleButtonClick('2')}>2</button>
                <button onClick={() => handleButtonClick('3')}>3</button>
                <button onClick={() => handleButtonClick('*')}>*</button>
            </div>
            <div className='row'>
                <button onClick={() => handleButtonClick('C')}>C</button>
                <button onClick={() => handleButtonClick('0')}>0</button>
                <button onClick={() => handleButtonClick('=')}>=</button>
                <button onClick={() => handleButtonClick('/')}>/</button>
            </div >
        </div >
    );
}

export default Calculator;