const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
// const ttsService = require('../services/ttsService'); // Commented out - service not found
const Vocabulary = require('../models/Vocabulary');

// เสิร์ฟไฟล์เสียง
router.get('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const audioPath = path.join(__dirname, '../cache/audio', filename);
    
    if (!fs.existsSync(audioPath)) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    // ตั้งค่า headers สำหรับไฟล์เสียง
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache 1 year
    res.setHeader('Accept-Ranges', 'bytes');
    
    // ส่งไฟล์เสียง
    const audioStream = fs.createReadStream(audioPath);
    audioStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้างเสียงจากข้อความ
router.post('/generate', async (req, res) => {
  try {
    const { text, voice = 'th-TH-PremwadeeNeural', rate = '1.0', pitch = '1.0' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // const result = await ttsService.generateThaiSpeech(text, { voice, rate, pitch });
    const result = { success: false, message: 'TTS service not available' };
    
    if (result.success) {
      res.json({
        success: true,
        audio_url: result.audioUrl,
        cached: result.cached
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้างเสียงสำหรับคำศัพท์
router.post('/vocabulary/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vocabulary = await Vocabulary.findById(id);

    if (!vocabulary) {
      return res.status(404).json({ error: 'Vocabulary not found' });
    }

    // const audioResults = await ttsService.generateGameAudio(vocabulary);
    const audioResults = { success: false, message: 'TTS service not available' };
    
    res.json({
      success: true,
      vocabulary_id: id,
      thai_word: vocabulary.thai_word,
      meaning: vocabulary.meaning,
      audio: audioResults
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้างเสียงสำหรับตัวเลือกในเกม
router.post('/game-options', async (req, res) => {
  try {
    const { options } = req.body;

    if (!options || !Array.isArray(options)) {
      return res.status(400).json({ error: 'Options array is required' });
    }

    // const audioOptions = await ttsService.generateGameOptionsAudio(options);
    const audioOptions = { success: false, message: 'TTS service not available' };
    
    res.json({
      success: true,
      options: audioOptions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้างเสียงสำหรับคำแนะนำเกม
router.get('/instructions/game', async (req, res) => {
  try {
    // const instructions = await ttsService.generateGameInstructions();
    const instructions = { success: false, message: 'TTS service not available' };
    
    res.json({
      success: true,
      instructions: instructions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้างเสียงสำหรับผลลัพธ์เกม
router.post('/feedback', async (req, res) => {
  try {
    const { correct, score, total } = req.body;

    if (typeof correct !== 'boolean' || typeof score !== 'number' || typeof total !== 'number') {
      return res.status(400).json({ error: 'Invalid feedback parameters' });
    }

    // const feedback = await ttsService.generateGameFeedback(correct, score, total);
    const feedback = { success: false, message: 'TTS service not available' };
    
    res.json({
      success: true,
      feedback: feedback
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้างเสียงสำหรับประโยคในเกม Arrange Sentence
router.post('/arrange-sentence', async (req, res) => {
  try {
    const { thai_sentence, english_sentence, romanization } = req.body;

    if (!thai_sentence) {
      return res.status(400).json({ error: 'Thai sentence is required' });
    }

    const audioPromises = [];

    // สร้างเสียงสำหรับประโยคไทย
    if (thai_sentence) {
      audioPromises.push(
        // ttsService.generateThaiSpeech(thai_sentence, {
        //   voice: 'th-TH-PremwadeeNeural',
        //   rate: '0.8'
        // }).then(result => ({
        //   type: 'thai_sentence',
        //   text: thai_sentence,
        //   audio_url: result.success ? result.audioUrl : null
        // }))
        Promise.resolve({
          type: 'thai_sentence',
          text: thai_sentence,
          audio_url: null
        })
      );
    }

    // สร้างเสียงสำหรับประโยคอังกฤษ
    if (english_sentence) {
      audioPromises.push(
        // ttsService.generateThaiSpeech(english_sentence, {
        //   voice: 'th-TH-PremwadeeNeural',
        //   rate: '1.0'
        // }).then(result => ({
        //   type: 'english_sentence',
        //   text: english_sentence,
        //   audio_url: result.success ? result.audioUrl : null
        // }))
        Promise.resolve({
          type: 'english_sentence',
          text: english_sentence,
          audio_url: null
        })
      );
    }

    // สร้างเสียงสำหรับคำอ่าน
    if (romanization) {
      audioPromises.push(
        // ttsService.generateThaiSpeech(romanization, {
        //   voice: 'th-TH-PremwadeeNeural',
        //   rate: '0.9'
        // }).then(result => ({
        //   type: 'romanization',
        //   text: romanization,
        //   audio_url: result.success ? result.audioUrl : null
        // }))
        Promise.resolve({
          type: 'romanization',
          text: romanization,
          audio_url: null
        })
      );
    }

    const audioResults = await Promise.all(audioPromises);
    
    res.json({
      success: true,
      audio: audioResults
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้างเสียงสำหรับคำเดี่ยวๆ
router.post('/word', async (req, res) => {
  try {
    const { word, type = 'thai' } = req.body;

    if (!word) {
      return res.status(400).json({ error: 'Word is required' });
    }

    const rate = type === 'thai' ? '0.9' : '1.0';
    // const result = await ttsService.generateThaiSpeech(word, {
    //   voice: 'th-TH-PremwadeeNeural',
    //   rate: rate
    // });
    const result = { success: false, message: 'TTS service not available' };

    if (result.success) {
      res.json({
        success: true,
        word: word,
        type: type,
        audio_url: result.audioUrl
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ลบไฟล์เสียงเก่า
router.delete('/cleanup', (req, res) => {
  try {
    // ttsService.cleanupOldAudio();
    res.json({
      success: true,
      message: 'Audio cleanup completed'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
