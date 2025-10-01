const express = require('express');
const router = express.Router();

// สร้างเสียงแบบง่ายๆ (mock audio URLs)
router.post('/generate', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // สร้าง mock audio URL
    const audioId = Buffer.from(text).toString('base64').substring(0, 16);
    const audioUrl = `/api/audio/${audioId}.mp3`;
    
    res.json({
      success: true,
      audio_url: audioUrl,
      cached: false
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// เสิร์ฟไฟล์เสียง mock
router.get('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    
    // ส่ง mock audio data (silence)
    const mockAudioBuffer = Buffer.alloc(1024); // 1KB of silence
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Accept-Ranges', 'bytes');
    
    res.send(mockAudioBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;







