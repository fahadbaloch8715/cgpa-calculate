const display = document.getElementById('display');
const operators = ['+', '-', '*', '/'];

function appendValue(val) {
    // Prevent multiple consecutive operators
    const lastChar = display.value.slice(-1);
    if (
        operators.includes(val) &&
        (display.value === '' && val !== '-') // Only allow minus at start
    ) {
        return;
    }
    if (
        operators.includes(val) &&
        operators.includes(lastChar)
    ) {
        // Replace last operator with new one
        display.value = display.value.slice(0, -1) + val;
        return;
    }
    display.value += val;
}

function clearDisplay() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        // Only allow numbers, operators, parentheses, spaces, and dots
        if (/^[0-9+\-*/.() ]+$/.test(display.value)) {
            // Evaluate and handle undefined/empty result
            const result = eval(display.value);
            display.value = (result !== undefined) ? result : '';
        } else {
            display.value = 'Error';
        }
    } catch {
        display.value = 'Error';
    }
}

// Optional: Keyboard support
document.addEventListener('keydown', function (e) {
    if ((e.key >= '0' && e.key <= '9') || operators.includes(e.key) || e.key === '.') {
        appendValue(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
        e.preventDefault();
    } else if (e.key === 'Backspace') {
        deleteLast();
        e.preventDefault();
    } else if (e.key.toLowerCase() === 'c') {
        clearDisplay();
        e.preventDefault();
    }
});
