
const expenses = [];

// Function to update total balance
function updateTotalBalance() {
  const totalBalance = expenses.reduce((total, expense) => total + expense.amount, 0);
  document.getElementById('total-balance').innerText = `₹${totalBalance.toFixed(2)}`;
}

// Function to render the expenses list
function renderExpenses() {
  const expensesContainer = document.querySelector('.expenses');
  expensesContainer.innerHTML = ''; // Clear the list

  expenses.forEach(expense => {
    const expenseItem = document.createElement('div');
    expenseItem.classList.add('expense-item');
    expenseItem.innerHTML = `<p>${expense.name} (${expense.category})</p><span>₹${expense.amount.toFixed(2)}</span>`;
    expensesContainer.appendChild(expenseItem);
  });

  // Update total balance after rendering
  updateTotalBalance();
}

// Function to add expense
async function addExpense() {
  const name = document.getElementById('expense-name').value;
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const category = document.getElementById('expense-category').value;

  if (name && !isNaN(amount) && amount > 0) {
    const expense = { name, amount, category };
    
    // Send POST request to the backend API
    try {
      const response = await fetch('http://localhost:5000/api/expenses', { // Update with your backend URL if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Expense added:', data);
        
        // Add the new expense locally and render the updated list
        expenses.push(data);
        renderExpenses();

        // Clear input fields
        document.getElementById('expense-name').value = '';
        document.getElementById('expense-amount').value = '';
        document.getElementById('expense-category').value = 'Food';
      } else {
        alert('Failed to add expense');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding expense');
    }

  } else {
    alert('Please enter valid expense details');
  }
}

// Add event listener for the "Add Expense" button
document.getElementById('add-expense').addEventListener('click', addExpense);

// Calculator functionality
let currentInput = '';
let operator = null;
let previousInput = '';
let currentCalculation = '';  // String to show the calculation process
const calculatorDisplay = document.getElementById('calculator-display');

// Function to update calculator display
function updateCalculatorDisplay(value) {
  calculatorDisplay.innerText = value ? `₹${value}` : '₹0.00';
}

// Function to update the full calculation display (e.g., "3+2")
function updateCalculationDisplay() {
  calculatorDisplay.innerText = currentCalculation ? currentCalculation : '₹0.00';
}

// Handle number and decimal button clicks
document.querySelectorAll('.calc-button').forEach(button => {
  button.addEventListener('click', () => {
    const buttonText = button.innerText;

    // Handle the decimal point
    if (buttonText === '.' && currentInput.includes('.')) return;

    currentInput += buttonText;
    currentCalculation += buttonText;  // Add to the displayed calculation string
    updateCalculationDisplay();
  });
});

// Handle operator button clicks (+, -, ×, ÷)
document.querySelectorAll('.operator').forEach(button => {
  button.addEventListener('click', () => {
    if (currentInput === '') return; // If no number is entered, do nothing

    // Save current input as previous input
    previousInput = currentInput;
    currentInput = '';
    operator = button.innerText; // Set the operator (+, -, ×, ÷)

    currentCalculation += ` ${operator} `;  // Show operator in the calculation display
    updateCalculationDisplay();
  });
});

// Handle the equals (submit) button click
document.querySelector('.submit').addEventListener('click', () => {
  if (currentInput === '' || previousInput === '') return; // If no calculation is ready, do nothing

  let result;
  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);

  // Perform calculation based on the selected operator
  switch (operator) {
    case '+':
      result = prev + curr;
      break;
    case '-':
      result = prev - curr;
      break;
    case '×':
      result = prev * curr;
      break;
    case '÷':
      result = prev / curr;
      break;
    default:
      return;
  }

  // Display only the result and clear the previous calculation
  currentCalculation = '';  // Clear the calculation string
  updateCalculatorDisplay(result.toFixed(2)); // Show only the result

  // Reset for next calculation
  currentInput = result.toString();
  previousInput = '';
  operator = null;
});

// Handle reset (AC) button click
document.querySelector('.reset').addEventListener('click', () => {
  currentInput = '';
  previousInput = '';
  operator = null;
  currentCalculation = '';  // Clear the full calculation
  updateCalculatorDisplay('0.00');
});

// Handle backspace button click
document.querySelector('.backspace').addEventListener('click', () => {
  // Remove the last character from the current input and calculation string
  currentInput = currentInput.slice(0, -1);
  currentCalculation = currentCalculation.slice(0, -1);

  // If current input becomes empty, reset to 0
  if (!currentInput && !currentCalculation) {
    updateCalculatorDisplay('0.00');
  } else {
    updateCalculationDisplay();
  }
});
