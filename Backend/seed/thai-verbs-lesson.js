const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai basic verbs lesson data
const verbsLessonData = {
  "lesson_id": 9,
  "level": "Beginner",
  "title": "คำกริยาเบื้องต้น",
  "vocab": [
    {
      "word": "ไป",
      "romanization": "bpai",
      "meaning": "to go",
      "example": "ฉันจะไปโรงเรียน",
      "audio": "pai.mp3"
    },
    {
      "word": "มา",
      "romanization": "maa",
      "meaning": "to come",
      "example": "เธอมาบ้านฉันทุกวัน",
      "audio": "maa.mp3"
    },
    {
      "word": "กิน",
      "romanization": "gin",
      "meaning": "to eat",
      "example": "ฉันกินข้าวแล้ว",
      "audio": "gin.mp3"
    },
    {
      "word": "ดื่ม",
      "romanization": "dùuem",
      "meaning": "to drink",
      "example": "เขาดื่มน้ำผลไม้",
      "audio": "duem.mp3"
    },
    {
      "word": "พูด",
      "romanization": "phûut",
      "meaning": "to speak",
      "example": "เด็กพูดภาษาไทยได้",
      "audio": "phut.mp3"
    },
    {
      "word": "ฟัง",
      "romanization": "fang",
      "meaning": "to listen",
      "example": "ฉันฟังเพลงทุกวัน",
      "audio": "fang.mp3"
    },
    {
      "word": "อ่าน",
      "romanization": "àan",
      "meaning": "to read",
      "example": "เธออ่านหนังสือก่อนนอน",
      "audio": "aan.mp3"
    },
    {
      "word": "เขียน",
      "romanization": "khǐan",
      "meaning": "to write",
      "example": "เขียนชื่อของคุณบนกระดาษ",
      "audio": "khian.mp3"
    },
    {
      "word": "ดู",
      "romanization": "duu",
      "meaning": "to watch / see",
      "example": "เราดูหนังด้วยกัน",
      "audio": "duu.mp3"
    },
    {
      "word": "เล่น",
      "romanization": "lên",
      "meaning": "to play",
      "example": "เด็กๆ เล่นฟุตบอล",
      "audio": "len.mp3"
    },
    {
      "word": "ทำ",
      "romanization": "tham",
      "meaning": "to do / make",
      "example": "เธอกำลังทำการบ้าน",
      "audio": "tham.mp3"
    },
    {
      "word": "เรียน",
      "romanization": "rian",
      "meaning": "to study / learn",
      "example": "ฉันเรียนภาษาไทย",
      "audio": "rian.mp3"
    },
    {
      "word": "ทำงาน",
      "romanization": "tham-ngaan",
      "meaning": "to work",
      "example": "พ่อทำงานทุกวันจันทร์ถึงศุกร์",
      "audio": "thamngaan.mp3"
    },
    {
      "word": "พักผ่อน",
      "romanization": "phák-phòn",
      "meaning": "to rest / relax",
      "example": "วันเสาร์ฉันพักผ่อนอยู่บ้าน",
      "audio": "phakpon.mp3"
    },
    {
      "word": "นอน",
      "romanization": "nawn",
      "meaning": "to sleep",
      "example": "เด็กต้องนอนแต่หัวค่ำ",
      "audio": "norn.mp3"
    }
  ]
};

async function seedVerbsLesson() {
  try {
    console.log('Starting to seed Thai basic verbs lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: verbsLessonData.lesson_id,
      title: verbsLessonData.title,
      level: verbsLessonData.level,
      description: 'เรียนรู้คำกริยาเบื้องต้นภาษาไทย พร้อมตัวอย่างประโยคและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: verbsLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = verbsLessonData.vocab.map(async (vocabItem, index) => {
      try {
        // Generate AI TTS audio for the Thai word
        const thaiAudio = await aiTtsService.generateThaiSpeech(vocabItem.word, {
          voice: 'th-TH-Standard-A',
          rate: '0.9',
          emotion: 'happy'
        });

        // Generate AI TTS audio for the example
        const exampleAudio = await aiTtsService.generateThaiSpeech(vocabItem.example, {
          voice: 'th-TH-Standard-A',
          rate: '0.8',
          emotion: 'excited'
        });

        // Generate AI TTS audio for the meaning
        const meaningAudio = await aiTtsService.generateThaiSpeech(vocabItem.meaning, {
          voice: 'th-TH-Standard-B',
          rate: '1.0',
          emotion: 'neutral'
        });

        // Determine category based on verb type
        let category = 'verbs';
        if (vocabItem.word.includes('ไป') || vocabItem.word.includes('มา')) {
          category = 'movement_verbs';
        } else if (vocabItem.word.includes('กิน') || vocabItem.word.includes('ดื่ม')) {
          category = 'consumption_verbs';
        } else if (vocabItem.word.includes('พูด') || vocabItem.word.includes('ฟัง') || vocabItem.word.includes('อ่าน') || vocabItem.word.includes('เขียน')) {
          category = 'communication_verbs';
        } else if (vocabItem.word.includes('ดู') || vocabItem.word.includes('เล่น')) {
          category = 'activity_verbs';
        } else if (vocabItem.word.includes('ทำ') || vocabItem.word.includes('เรียน') || vocabItem.word.includes('ทำงาน')) {
          category = 'action_verbs';
        } else if (vocabItem.word.includes('พักผ่อน') || vocabItem.word.includes('นอน')) {
          category = 'rest_verbs';
        }

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: category,
          difficulty: 'beginner',
          lesson_id: verbsLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['verbs', 'action', 'thai-language', 'grammar'],
          frequency: 0,
          is_active: true
        };

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabItem.word,
            lesson_id: verbsLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${verbsLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
        return {
          vocabulary,
          audio: {
            thai: thaiAudio,
            example: exampleAudio,
            meaning: meaningAudio
          }
        };
      } catch (error) {
        console.error(`Error processing vocabulary ${vocabItem.word}:`, error);
        return null;
      }
    });

    const results = await Promise.all(vocabularyPromises);
    const successfulResults = results.filter(result => result !== null);

    console.log(`\nSeeding completed!`);
    console.log(`- Lesson: ${lesson.title}`);
    console.log(`- Total vocabulary items: ${verbsLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${verbsLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนคำกริยาเบื้องต้น เราได้เรียนรู้คำกริยาเบื้องต้นภาษาไทย ${verbsLessonData.vocab.length} คำ พร้อมตัวอย่างประโยคและความหมาย`;
    const lessonSummaryAudio = await aiTtsService.generateThaiSpeech(lessonSummaryText, {
      voice: 'th-TH-Standard-A',
      rate: '0.9',
      emotion: 'excited'
    });

    console.log(`\nLesson summary audio generated: ${lessonSummaryAudio.success ? 'Success' : 'Failed'}`);

    return {
      lesson,
      vocabularyCount: successfulResults.length,
      audioGenerated: lessonSummaryAudio.success
    };

  } catch (error) {
    console.error('Error seeding verbs lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedVerbsLesson();
    })
    .then((result) => {
      console.log('Seeding completed successfully:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedVerbsLesson, verbsLessonData };





