const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const expenseRoutes = require('./routes/expenses'); // Adjust the path as necessary
const userRoutes = require('./routes/userRoutes'); // User authentication routes
require('dotenv').config(); // Loads environment variables from .env file

const app = express();

// Middleware
app.use(express.json()); // Allows the app to handle JSON requests

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:5500', // Replace with the frontend URL (port 5500 if used)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    credentials: true, // Enable sending cookies and authorization headers
};
app.use(cors(corsOptions));

// MongoDB connection
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('Error: MONGO_URI is not defined in the .env file');
    process.exit(1); // Exit the server if MongoDB URI is missing
}

// Connect to MongoDB using mongoose
mongoose.set('strictQuery', false);
mongoose.connect(mongoUri, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });


// Health Check Route
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running.');
});

// Authentication Routes (Login and Register)
app.use('/', userRoutes);

// Expense Routes (CRUD Operations)
app.use('/api/expenses', expenseRoutes);

// 404 Error Handling
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// General Error Handling
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message || 'Internal Server Error',
        },
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
