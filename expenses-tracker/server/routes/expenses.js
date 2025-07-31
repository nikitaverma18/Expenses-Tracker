const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find(); // Fetch all expenses from the database
    res.status(200).json(expenses); // Send the expenses as JSON
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ message: 'Server Error: Unable to fetch expenses' }); // Handle server error
  }
});

// Add a new expense
router.post('/', async (req, res) => {
  const { name, amount, category } = req.body;

  // Basic validation
  if (!name || !amount || !category) {
    return res.status(400).json({ message: 'Please provide name, amount, and category' });
  }

  try {
    const newExpense = new Expense({ name, amount, category }); // Create a new expense instance
    const savedExpense = await newExpense.save(); // Save the expense to the database
    res.status(201).json(savedExpense); // Respond with the saved expense
  } catch (err) {
    console.error('Error adding new expense:', err);
    res.status(500).json({ message: 'Server Error: Unable to add expense', error: err.message }); // Include error message for debugging
  }
});

// Update an expense
router.put('/:id', async (req, res) => {
  const { name, amount, category } = req.body;

  // Basic validation
  if (!name || !amount || !category) {
    return res.status(400).json({ message: 'Please provide name, amount, and category to update' });
  }

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { name, amount, category },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' }); // Handle case where the expense is not found
    }

    res.status(200).json(updatedExpense); // Respond with the updated expense
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).json({ message: 'Server Error: Unable to update expense' }); // Handle server error
  }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id); // Delete the expense by ID

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' }); // Handle case where the expense is not found
    }

    res.status(200).json({ message: 'Expense deleted successfully' }); // Respond with a success message
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ message: 'Server Error: Unable to delete expense' }); // Handle server error
  }
});

module.exports = router; // Export the router
