const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai colors lesson data
const colorsLessonData = {
  "lesson_id": 8,
  "level": "Beginner",
  "title": "สี",
  "vocab": [
    {
      "word": "สีแดง",
      "romanization": "sǐi daeng",
      "meaning": "red",
      "example": "ฉันชอบสีแดง",
      "audio": "red.mp3"
    },
    {
      "word": "สีฟ้า",
      "romanization": "sǐi fáa",
      "meaning": "light blue",
      "example": "ท้องฟ้ามีสีฟ้า",
      "audio": "lightblue.mp3"
    },
    {
      "word": "สีน้ำเงิน",
      "romanization": "sǐi náam-ngern",
      "meaning": "dark blue / navy",
      "example": "เขาใส่เสื้อสีน้ำเงิน",
      "audio": "darkblue.mp3"
    },
    {
      "word": "สีเขียว",
      "romanization": "sǐi khǐeow",
      "meaning": "green",
      "example": "ใบไม้มีสีเขียว",
      "audio": "green.mp3"
    },
    {
      "word": "สีเหลือง",
      "romanization": "sǐi lǔeang",
      "meaning": "yellow",
      "example": "พระใส่จีวรสีเหลือง",
      "audio": "yellow.mp3"
    },
    {
      "word": "สีส้ม",
      "romanization": "sǐi sôm",
      "meaning": "orange",
      "example": "เธอชอบสีส้ม",
      "audio": "orange.mp3"
    },
    {
      "word": "สีชมพู",
      "romanization": "sǐi chom-phuu",
      "meaning": "pink",
      "example": "ดอกไม้สีชมพูสวยมาก",
      "audio": "pink.mp3"
    },
    {
      "word": "สีม่วง",
      "romanization": "sǐi mûang",
      "meaning": "purple",
      "example": "ฉันมีปากกาสีม่วง",
      "audio": "purple.mp3"
    },
    {
      "word": "สีดำ",
      "romanization": "sǐi dam",
      "meaning": "black",
      "example": "กระเป๋าใบนี้สีดำ",
      "audio": "black.mp3"
    },
    {
      "word": "สีขาว",
      "romanization": "sǐi khǎao",
      "meaning": "white",
      "example": "ห้องนอนของฉันทาสีขาว",
      "audio": "white.mp3"
    },
    {
      "word": "สีเทา",
      "romanization": "sǐi thao",
      "meaning": "gray",
      "example": "แมวสีเทาน่ารัก",
      "audio": "gray.mp3"
    },
    {
      "word": "สีน้ำตาล",
      "romanization": "sǐi náam-dtaan",
      "meaning": "brown",
      "example": "โต๊ะตัวนี้สีน้ำตาล",
      "audio": "brown.mp3"
    },
    {
      "word": "สีทอง",
      "romanization": "sǐi thong",
      "meaning": "gold",
      "example": "พระพุทธรูปสีทอง",
      "audio": "gold.mp3"
    },
    {
      "word": "สีเงิน",
      "romanization": "sǐi ngern",
      "meaning": "silver",
      "example": "นาฬิกาสีเงินดูดี",
      "audio": "silver.mp3"
    }
  ]
};

async function seedColorsLesson() {
  try {
    console.log('Starting to seed Thai colors lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: colorsLessonData.lesson_id,
      title: colorsLessonData.title,
      level: colorsLessonData.level,
      description: 'เรียนรู้คำศัพท์เกี่ยวกับสีต่างๆ ภาษาไทย พร้อมตัวอย่างประโยคและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: colorsLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = colorsLessonData.vocab.map(async (vocabItem, index) => {
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

        // Determine category based on color type
        let category = 'colors';
        if (vocabItem.word.includes('แดง') || vocabItem.word.includes('ฟ้า') || vocabItem.word.includes('น้ำเงิน') || vocabItem.word.includes('เขียว') || vocabItem.word.includes('เหลือง') || vocabItem.word.includes('ส้ม') || vocabItem.word.includes('ชมพู') || vocabItem.word.includes('ม่วง')) {
          category = 'primary_colors';
        } else if (vocabItem.word.includes('ดำ') || vocabItem.word.includes('ขาว') || vocabItem.word.includes('เทา') || vocabItem.word.includes('น้ำตาล')) {
          category = 'neutral_colors';
        } else if (vocabItem.word.includes('ทอง') || vocabItem.word.includes('เงิน')) {
          category = 'metallic_colors';
        }

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: category,
          difficulty: 'beginner',
          lesson_id: colorsLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['colors', 'visual', 'descriptive', 'thai-language'],
          frequency: 0,
          is_active: true
        };

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabItem.word,
            lesson_id: colorsLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${colorsLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${colorsLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${colorsLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนสี เราได้เรียนรู้คำศัพท์เกี่ยวกับสีต่างๆ ภาษาไทย ${colorsLessonData.vocab.length} สี พร้อมตัวอย่างประโยคและความหมาย`;
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
    console.error('Error seeding colors lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedColorsLesson();
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

module.exports = { seedColorsLesson, colorsLessonData };





