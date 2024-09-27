const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database query error:', err); // Log the error
        return res.status(500).send('Internal Server Error'); // Send a generic message
      }
      res.json(results);
    });
  });
  
// 2. Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// 3. Filter patients by First Name
app.get('/patients/first-name/:name', (req, res) => {
  const { name } = req.params;
  const query = 'SELECT * FROM patients WHERE first_name = ?';
  db.query(query, [name], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const { specialty } = req.params;
  const query = 'SELECT * FROM providers WHERE provider_specialty = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Add a root route
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
  });

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port 3000...`);
});
