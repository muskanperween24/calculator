// Get references to the display and all buttons
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';
let operator = '';
let firstOperand = null;
let shouldReplaceDisplay = false; // Flag to determine if the next digit should replace the display

// Function to update the display
function updateDisplay(value) {
    display.value = value;
}

// Function to handle number button clicks
function handleNumberClick(value) {
    if (shouldReplaceDisplay) {
        currentInput = value;
        shouldReplaceDisplay = false;
    } else {
        currentInput += value;
    }
    updateDisplay(currentInput);
}

// Function to handle operator button clicks
function handleOperatorClick(op) {
    if (op === 'AC') {
        currentInput = '';
        operator = '';
        firstOperand = null;
        shouldReplaceDisplay = false;
        updateDisplay('');
        return;
    }

    if (op === '+/-') {
        if (currentInput) {
            currentInput = parseFloat(currentInput) * -1;
            updateDisplay(currentInput);
        }
        return;
    }

    // If there's a current input and an operator already, perform calculation
    if (currentInput && operator && firstOperand !== null) {
        handleEqualClick(); // Perform the pending calculation
    }

    // Store the current input as the first operand and set the operator
    if (currentInput) { // Only store if there's a number
        firstOperand = parseFloat(currentInput);
    }
    operator = op;
    currentInput = ''; // Clear current input for the next number
    shouldReplaceDisplay = true; // Next digit will replace the display
}

// Function to handle the equals button click
function handleEqualClick() {
    if (operator && firstOperand !== null && currentInput) {
        const secondOperand = parseFloat(currentInput);
        let result = null;

        switch (operator) {
            case '+':
                result = firstOperand + secondOperand;
                break;
            case '-':
                result = firstOperand - secondOperand;
                break;
            case '*':
                result = firstOperand * secondOperand;
                break;
            case '/':
                if (secondOperand === 0) {
                    updateDisplay('Error');
                    resetCalculatorState();
                    return;
                }
                result = firstOperand / secondOperand;
                break;
            case '%':
                result = firstOperand % secondOperand;
                break;
        }

        // Handle potential floating point inaccuracies
        if (result !== null) {
            currentInput = result.toString();
            updateDisplay(currentInput);
            firstOperand = result; // Set result as the new first operand for chained operations
            operator = ''; // Reset operator after equals
            shouldReplaceDisplay = true;
        }
    } else if (currentInput && firstOperand !== null && !operator) {
        // Case: User clicks '=' after entering a number without an operator
        // No action needed, or perhaps just update display with currentInput
        // For now, we'll do nothing to avoid unintended behavior.
    }
}


// Function to reset calculator state (used for AC and Error)
function resetCalculatorState() {
    currentInput = '';
    operator = '';
    firstOperand = null;
    shouldReplaceDisplay = false;
}


// Add event listener to each button
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');

        // Highlight the clicked operator button
        // Remove highlight from previously active operator
        document.querySelectorAll('.btn-operator').forEach(btn => btn.classList.remove('active-operator'));
        if (button.classList.contains('btn-operator') && value !== 'AC' && value !== '+/-') {
            button.classList.add('active-operator');
        }

        if (button.classList.contains('btn')) { // Check if it's a valid button
            if (button.classList.contains('btn-operator')) {
                handleOperatorClick(value);
            } else if (button.classList.contains('btn-equal')) {
                handleEqualClick();
            } else {
                // It's a number or a decimal point
                handleNumberClick(value);
            }
        }
    });
});

// Initial display update (optional, can be empty)
updateDisplay('');