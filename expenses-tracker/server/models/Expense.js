const mongoose = require('mongoose');

// Define the Expense schema
const ExpenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Other'], // Example categories
  },
  date: {
    type: Date,
    default: Date.now, // Use Date.now without parentheses so it runs when a document is created
    validate: {
      validator: function(value) {
        return value <= Date.now(); // Ensure date is not in the future
      },
      message: 'Date cannot be in the future',
    },
  },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Export the Expense model
module.exports = mongoose.model('Expense', ExpenseSchema);
