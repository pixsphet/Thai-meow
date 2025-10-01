const express = require('express');
const router = express.Router();

// สร้างเสียงจากข้อความ
router.post('/generate', async (req, res) => {
  try {
    const { text, voice, rate, pitch, volume, emotion } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // TTS service not available
    res.status(503).json({
      success: false,
      error: 'TTS service not available'
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
