document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.button');
    
    let currentInput = '';
    let operator = null;
    let previousInput = '';
    let resultDisplayed = false;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            handleInput(button.getAttribute('data-value'));
        });
    });

    // 监听键盘输入
    document.addEventListener('keydown', (event) => {
        const key = event.key;

        if (isNumber(key) || isOperator(key) || key === '.' || key === 'Enter' || key === 'Backspace' || key === 'Escape' || key === 'c' || key === 'C') {
            handleInput(key);
        }
    });

    function handleInput(value) {
        if (value === 'C' || value === 'Escape' || value === 'c') {
            currentInput = '';
            operator = null;
            previousInput = '';
            display.textContent = '0';
            resultDisplayed = false;
            return;
        }

        if (value === 'Backspace' || value === '>') {
            currentInput = currentInput.slice(0, -1);
            display.textContent = currentInput === '' ? '0' : currentInput;
            return;
        }

        if (value === '=' || value === 'Enter') {
            if (operator && previousInput !== '' && currentInput !== '') {
                const result = calculate(parseFloat(previousInput), operator, parseFloat(currentInput));
                display.textContent = result;
                previousInput = result;
                currentInput = '';
                operator = null;
                resultDisplayed = true;
            }
            return;
        }

        if (isOperator(value)) {
            if (currentInput === '' && previousInput !== '') {
                operator = value;
                display.textContent = previousInput + ' ' + value;
            } else {
                if (operator) {
                    previousInput = calculate(parseFloat(previousInput), operator, parseFloat(currentInput));
                    display.textContent = previousInput + ' ' + value;
                } else {
                    previousInput = currentInput;
                    display.textContent = previousInput + ' ' + value;
                }
                currentInput = '';
                operator = value;
                resultDisplayed = false;
            }
            return;
        }

        if (resultDisplayed) {
            currentInput = value; // 开始新的输入
            resultDisplayed = false;
        } else {
            currentInput += value;
        }

        display.textContent = currentInput === '' ? '0' : currentInput;
    }

    function calculate(firstNumber, operator, secondNumber) {
        switch (operator) {
            case '+': return firstNumber + secondNumber;
            case '-': return firstNumber - secondNumber;
            case '*': return firstNumber * secondNumber;
            case '/': return firstNumber / secondNumber;
            default: return secondNumber;
        }
    }

    function isNumber(value) {
        return !isNaN(value) && value.trim() !== '';
    }

    function isOperator(value) {
        return ['+', '-', '*', '/'].includes(value);
    }
});

// ============================
// 更新检查部分保持不变
const { ipcRenderer } = require('electron');

ipcRenderer.on('update_available', () => {
  alert('A new update is available. Downloading now...');
});

ipcRenderer.on('update_downloaded', () => {
  alert('Update Downloaded. It will be installed on restart. Restart now?');
  if (confirm('Restart and install update?')) {
    ipcRenderer.send('restart_app');
  }
});

