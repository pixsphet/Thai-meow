const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Connect to database
const db = new sqlite3.Database('./db/thai_meow.db');

// Test route
app.get('/', (req, res) => {
  res.send('ThaiMeow Backend Running!');
});

// Get all lessons
app.get('/lessons', (req, res) => {
  db.all('SELECT * FROM lessons', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// lesson
app.get('/lessons/:id/vocab', (req, res) => {
  const lessonId = req.params.id;
  db.all('SELECT * FROM vocab WHERE lesson_id = ?', [lessonId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${30000}`);
});
