const express = require('express');
const cors = require('cors');
const app = express();

// Middleware to handle CORS requests
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Database connection
const db = require('./database'); // Adjusted to the correct relative path

// API endpoint to fetch all dishes
app.get('/api/dishes', (req, res) => {
    db.query('SELECT * FROM DISHES', (err, results) => {
        if (err) {
            console.error('Failed to retrieve dishes from database:', err);
            // Send a 500 Internal Server Error response if there's a database error
            return res.status(500).send('Error fetching dishes from the database');
        }
        // Send the results as JSON
        res.json(results);
    });
});

// Port configuration
const port = process.env.PORT || 3004; // Use the environment variable PORT, or 3000 if it's not set
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
