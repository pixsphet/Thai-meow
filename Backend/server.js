const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // ใช้ sqlite3 library
const app = express();

// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database('./db/thai_meow.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
  }
});

app.use(express.json());

// ดึงข้อมูลบทเรียนทั้งหมด หรือดึงตาม level
app.get('/lessons', (req, res) => {
  const level = req.query.level; // รับ query parameter เช่น ?level=beginner
  let query = 'SELECT * FROM lessons';
  const params = [];

  if (level) {
    query += ' WHERE level = ?';
    params.push(level);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// ดึงคำศัพท์จากบทเรียน
app.get('/vocab/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  const query = 'SELECT * FROM vocab WHERE lesson_id = ?';

  db.all(query, [lessonId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// ดึงบทสนทนาจากบทเรียน
app.get('/dialogue/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  const query = 'SELECT * FROM dialogue WHERE lesson_id = ?';

  db.all(query, [lessonId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// ดึงคำถามแบบทดสอบจากบทเรียน
app.get('/quiz/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  const query = 'SELECT * FROM quiz WHERE lesson_id = ?';

  db.all(query, [lessonId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// ดึงสถานการณ์การสนทนา
app.get('/scenario/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  const query = 'SELECT * FROM scenario WHERE lesson_id = ?';

  db.all(query, [lessonId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// สุ่มคำศัพท์สำหรับเกม
app.get('/game/vocab/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  const { count = 10 } = req.query; // จำนวนคำศัพท์ที่ต้องการ (default 10)
  
  const query = `
    SELECT * FROM vocab 
    WHERE lesson_id = ? 
    ORDER BY RANDOM() 
    LIMIT ?
  `;
  
  db.all(query, [lessonId, count], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// สุ่มคำศัพท์จากหลายบทเรียน
app.get('/game/vocab/random', (req, res) => {
  const { count = 10, level = 'Beginner' } = req.query;
  
  const query = `
    SELECT v.*, l.title as lesson_title 
    FROM vocab v
    JOIN lessons l ON v.lesson_id = l.lesson_id
    WHERE l.level = ?
    ORDER BY RANDOM()
    LIMIT ?
  `;
  
  db.all(query, [level, count], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// สร้างคำถามแบบเลือกตอบ
app.get('/game/quiz/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  const { count = 5 } = req.query;

  // ดึงคำศัพท์หลัก
  const mainQuery = `
    SELECT * FROM vocab
    WHERE lesson_id = ?
    ORDER BY RANDOM()
    LIMIT ?
  `;

  db.all(mainQuery, [lessonId, count], (err, mainWords) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (mainWords.length === 0) {
      res.json([]);
      return;
    }

    // สร้างคำถามสำหรับแต่ละคำ
    const questions = mainWords.map(word => {
      // สร้างตัวเลือกแบบง่าย (ใช้คำศัพท์อื่นในบทเรียนเดียวกัน)
      const otherWords = mainWords.filter(w => w.id !== word.id);
      const distractors = otherWords.slice(0, 3).map(w => w.meaning);

      // สร้างตัวเลือก
      const options = [
        { text: word.meaning, correct: true },
        ...distractors.map(meaning => ({ text: meaning, correct: false }))
      ];

      // สุ่มลำดับตัวเลือก
      const shuffledOptions = options.sort(() => Math.random() - 0.5);

      return {
        id: word.id,
        word: word.word,
        romanization: word.romanization,
        options: shuffledOptions,
        correctAnswer: word.meaning
      };
    });

    res.json(questions);
  });
});

// บันทึกความคืบหน้าผู้ใช้
app.post('/user/progress', (req, res) => {
  const { lessonId, score, totalQuestions, completedAt } = req.body;
  
  // คำนวณเปอร์เซ็นต์
  const percentage = totalQuestions > 0 ? (score / totalQuestions) : 0;
  const status = percentage >= 0.8 ? 'done' : 'current';

  // บันทึกข้อมูลความคืบหน้า (ใช้โครงสร้างเดิม)
  const insertQuery = `
    INSERT OR REPLACE INTO user_progress (user_id, lesson_id, progress, status)
    VALUES (1, ?, ?, ?)
  `;

  db.run(insertQuery, [lessonId, percentage, status], function(err) {
    if (err) {
      console.error('Error inserting progress:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      console.log(`Progress saved: lessonId=${lessonId}, score=${score}/${totalQuestions}, percentage=${(percentage*100).toFixed(1)}%`);
      res.json({ 
        success: true, 
        message: 'Progress saved successfully',
        percentage: percentage * 100,
        status: status
      });
    }
  });
});

// ดึงความคืบหน้าผู้ใช้
app.get('/user/progress', (req, res) => {
  const query = `
    SELECT up.*, l.title as lesson_title, l.level
    FROM user_progress up
    LEFT JOIN lessons l ON up.lesson_id = l.id
    WHERE up.user_id = 1
    ORDER BY up.lesson_id ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// ดึงสถิติผู้ใช้
app.get('/user/stats', (req, res) => {
  const query = `
    SELECT 
      COUNT(*) as total_lessons_completed,
      AVG(progress) as average_progress,
      MAX(progress) as best_progress,
      MIN(progress) as worst_progress,
      SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completed_lessons
    FROM user_progress
    WHERE user_id = 1
  `;

  db.get(query, [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(row);
    }
  });
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
