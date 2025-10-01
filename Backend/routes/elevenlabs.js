const express = require('express');
const router = express.Router();
const elevenLabsService = require('../services/elevenLabsService');
const path = require('path');

// สร้างเสียงพูดภาษาไทย
router.post('/speak', async (req, res) => {
  try {
    const { text, options = {} } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    console.log('🎤 ElevenLabs TTS request:', text);

    const result = await elevenLabsService.generateThaiSpeech(text, options);

    if (result.success) {
      res.json({
        success: true,
        message: 'Speech generated successfully',
        audioPath: result.audioPath,
        cached: result.cached
      });
    } else if (result.fallback) {
      // ElevenLabs ไม่พร้อมใช้งาน ให้ frontend ใช้ fallback
      res.status(503).json({
        success: false,
        message: 'ElevenLabs not available, please use fallback TTS',
        fallback: true
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to generate speech'
      });
    }

  } catch (error) {
    console.error('❌ ElevenLabs TTS error:', error);
    
    // ตรวจสอบว่าเป็น error เกี่ยวกับ API key หรือไม่
    if (error.message.includes('not initialized') || error.message.includes('API key')) {
      res.status(503).json({
        success: false,
        message: 'ElevenLabs not available, please use fallback TTS',
        fallback: true,
        error: error.message
      });
    } else {
      res.status(503).json({
        success: false,
        message: 'ElevenLabs not available, please use fallback TTS',
        fallback: true,
        error: error.message
      });
    }
  }
});

// สร้างเสียงพูดสำหรับเกม
router.post('/game-audio', async (req, res) => {
  try {
    const { vocabData, options = {} } = req.body;

    if (!vocabData || !vocabData.thai) {
      return res.status(400).json({
        success: false,
        message: 'Vocabulary data with Thai text is required'
      });
    }

    console.log('🎮 ElevenLabs game audio request:', vocabData.thai);

    const result = await elevenLabsService.generateGameAudio(vocabData, options);

    if (result.success) {
      res.json({
        success: true,
        message: 'Game audio generated successfully',
        audioPath: result.audioPath,
        cached: result.cached
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to generate game audio'
      });
    }

  } catch (error) {
    console.error('❌ ElevenLabs game audio error:', error);
    res.status(500).json({
      success: false,
      message: 'Game audio generation failed',
      error: error.message
    });
  }
});

// สร้างเสียงพูดสำหรับบทเรียน
router.post('/lesson-audio', async (req, res) => {
  try {
    const { lessonData, options = {} } = req.body;

    if (!lessonData || !lessonData.titleTH) {
      return res.status(400).json({
        success: false,
        message: 'Lesson data with Thai title is required'
      });
    }

    console.log('📚 ElevenLabs lesson audio request:', lessonData.titleTH);

    const result = await elevenLabsService.generateLessonAudio(lessonData, options);

    if (result.success) {
      res.json({
        success: true,
        message: 'Lesson audio generated successfully',
        audioPath: result.audioPath,
        cached: result.cached
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to generate lesson audio'
      });
    }

  } catch (error) {
    console.error('❌ ElevenLabs lesson audio error:', error);
    res.status(500).json({
      success: false,
      message: 'Lesson audio generation failed',
      error: error.message
    });
  }
});

// ตรวจสอบสถานะ API
router.get('/status', async (req, res) => {
  try {
    const status = await elevenLabsService.checkApiStatus();
    res.json(status);
  } catch (error) {
    console.error('❌ ElevenLabs status check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Status check failed',
      error: error.message
    });
  }
});

// ดูข้อมูล cache
router.get('/cache', async (req, res) => {
  try {
    const cacheInfo = elevenLabsService.getCacheSize();
    res.json({
      success: true,
      cache: cacheInfo
    });
  } catch (error) {
    console.error('❌ ElevenLabs cache info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cache info',
      error: error.message
    });
  }
});

// ล้าง cache
router.delete('/cache', async (req, res) => {
  try {
    const cleared = elevenLabsService.clearCache();
    if (cleared) {
      res.json({
        success: true,
        message: 'Cache cleared successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to clear cache'
      });
    }
  } catch (error) {
    console.error('❌ ElevenLabs cache clear error:', error);
    res.status(500).json({
      success: false,
      message: 'Cache clear failed',
      error: error.message
    });
  }
});

// เสิร์ฟไฟล์เสียง
router.get('/audio/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const audioPath = path.join(__dirname, '../cache/audio/elevenlabs', filename);
    
    // ตรวจสอบว่าไฟล์มีอยู่จริง
    const fs = require('fs');
    if (!fs.existsSync(audioPath)) {
      return res.status(404).json({
        success: false,
        message: 'Audio file not found'
      });
    }

    // ส่งไฟล์เสียง
    res.sendFile(audioPath);
  } catch (error) {
    console.error('❌ ElevenLabs audio serve error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve audio file',
      error: error.message
    });
  }
});

module.exports = router;
