const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure the database connection (MySQL)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    process.exit(1);
  }
  console.log('Connected to database.');
});

app.get('/', (req, res) => {
  res.send('Hello Capmu!');
});

app.post('/add-user', express.json(), (req, res) => {
  const { name } = req.body;
  const query = 'INSERT INTO users (name) VALUES (?)';
  db.query(query, [name], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Error inserting data');
    }
    console.log(`User '${name}' saved with id ${results.insertId}`);
    res.status(201).send(`User '${name}' added successfully with id ${results.insertId}`);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
