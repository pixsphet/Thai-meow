const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai consonant lesson data
const consonantLessonData = {
  "lesson_id": 1,
  "level": "Beginner",
  "title": "พยัญชนะพื้นฐาน",
  "vocab": [
    {
      "word": "ก",
      "romanization": "gor",
      "meaning": "chicken",
      "example": "ก ไก่",
      "audioText": "กอ ไก่"
    },
    {
      "word": "ข",
      "romanization": "khor",
      "meaning": "egg",
      "example": "ข ไข่",
      "audioText": "ขอ ไข่"
    },
    {
      "word": "ฃ",
      "romanization": "kho",
      "meaning": "bottle (เก่า ไม่ใช้แล้ว)",
      "example": "ฃ ขวด (ไม่ใช้แล้ว)",
      "audioText": "ขอ ขวด"
    },
    {
      "word": "ค",
      "romanization": "kho",
      "meaning": "buffalo",
      "example": "ค ควาย",
      "audioText": "ขอ ขวด"
    },
    {
      "word": "ฅ",
      "romanization": "kho",
      "meaning": "person (เก่า ไม่ใช้แล้ว)",
      "example": "ฅ คน (ไม่ใช้แล้ว)",
      "audioText": "ขอ ขวด"
    },
    {
      "word": "ฆ",
      "romanization": "kho",
      "meaning": "bell",
      "example": "ฆ ระฆัง",
      "audioText": "ขอ ขวด"
    },
    {
      "word": "ง",
      "romanization": "ngor",
      "meaning": "snake",
      "example": "ง งู",
      "audioText": "งอ งู"
    },
    {
      "word": "จ",
      "romanization": "jor",
      "meaning": "plate",
      "example": "จ จาน",
      "audioText": "จอ จาน"
    },
    {
      "word": "ฉ",
      "romanization": "chor",
      "meaning": "small cymbals",
      "example": "ฉ ฉิ่ง",
      "audioText": "ฉอ ฉิ่ง"
    },
    {
      "word": "ช",
      "romanization": "chor",
      "meaning": "elephant",
      "example": "ช ช้าง",
      "audioText": "ฉอ ฉิ่ง"
    },
    {
      "word": "ซ",
      "romanization": "sor",
      "meaning": "chain",
      "example": "ซ โซ่",
      "audioText": "ซอ โซ่"
    },
    {
      "word": "ฌ",
      "romanization": "chor",
      "meaning": "tree",
      "example": "ฌ เฌอ",
      "audioText": "ฉอ ฉิ่ง"
    },
    {
      "word": "ญ",
      "romanization": "yor",
      "meaning": "woman",
      "example": "ญ หญิง",
      "audioText": "ญอ หญิง"
    },
    {
      "word": "ฎ",
      "romanization": "dor",
      "meaning": "crown",
      "example": "ฎ ชฎา",
      "audioText": "ดอ เด็ก"
    },
    {
      "word": "ฏ",
      "romanization": "tor",
      "meaning": "mace",
      "example": "ฏ ปฏัก",
      "audioText": "ตอ เต่า"
    },
    {
      "word": "ฐ",
      "romanization": "thor",
      "meaning": "base",
      "example": "ฐ ฐาน",
      "audioText": "ถอ ถุง"
    },
    {
      "word": "ฑ",
      "romanization": "thor",
      "meaning": "a character name",
      "example": "ฑ มณโฑ",
      "audioText": "ถอ ถุง"
    },
    {
      "word": "ฒ",
      "romanization": "thor",
      "meaning": "old person",
      "example": "ฒ ผู้เฒ่า",
      "audioText": "ถอ ถุง"
    },
    {
      "word": "ณ",
      "romanization": "nor",
      "meaning": "novice monk",
      "example": "ณ เณร",
      "audioText": "นอ หนู"
    },
    {
      "word": "ด",
      "romanization": "dor",
      "meaning": "child",
      "example": "ด เด็ก",
      "audioText": "ดอ เด็ก"
    },
    {
      "word": "ต",
      "romanization": "tor",
      "meaning": "turtle",
      "example": "ต เต่า",
      "audioText": "ตอ เต่า"
    },
    {
      "word": "ถ",
      "romanization": "thor",
      "meaning": "bag",
      "example": "ถ ถุง",
      "audioText": "ถอ ถุง"
    },
    {
      "word": "ท",
      "romanization": "thor",
      "meaning": "soldier",
      "example": "ท ทหาร",
      "audioText": "ถอ ถุง"
    },
    {
      "word": "ธ",
      "romanization": "thor",
      "meaning": "flag",
      "example": "ธ ธง",
      "audioText": "ถอ ถุง"
    },
    {
      "word": "น",
      "romanization": "nor",
      "meaning": "mouse",
      "example": "น หนู",
      "audioText": "นอ หนู"
    },
    {
      "word": "บ",
      "romanization": "bor",
      "meaning": "house",
      "example": "บ บ้าน",
      "audioText": "บอ บ้าน"
    },
    {
      "word": "ป",
      "romanization": "por",
      "meaning": "crab",
      "example": "ป ปู",
      "audioText": "ปอ ปู"
    },
    {
      "word": "ผ",
      "romanization": "phor",
      "meaning": "bee",
      "example": "ผ ผึ้ง",
      "audioText": "พอ พาน"
    },
    {
      "word": "ฝ",
      "romanization": "for",
      "meaning": "lid",
      "example": "ฝ ฝา",
      "audioText": "ฟอ ฟัน"
    },
    {
      "word": "พ",
      "romanization": "phor",
      "meaning": "tray",
      "example": "พ พาน",
      "audioText": "พอ พาน"
    },
    {
      "word": "ฟ",
      "romanization": "for",
      "meaning": "tooth",
      "example": "ฟ ฟัน",
      "audioText": "ฟอ ฟัน"
    },
    {
      "word": "ภ",
      "romanization": "phor",
      "meaning": "junk (เรือสำเภา)",
      "example": "ภ สำเภา",
      "audioText": "พอ พาน"
    },
    {
      "word": "ม",
      "romanization": "mor",
      "meaning": "horse",
      "example": "ม ม้า",
      "audioText": "มอ ม้า"
    },
    {
      "word": "ย",
      "romanization": "yor",
      "meaning": "giant",
      "example": "ย ยักษ์",
      "audioText": "ญอ หญิง"
    },
    {
      "word": "ร",
      "romanization": "ror",
      "meaning": "boat",
      "example": "ร เรือ",
      "audioText": "รอ เรือ"
    },
    {
      "word": "ล",
      "romanization": "lor",
      "meaning": "monkey",
      "example": "ล ลิง",
      "audioText": "ลอ ลิง"
    },
    {
      "word": "ว",
      "romanization": "wor",
      "meaning": "ring",
      "example": "ว แหวน",
      "audioText": "วอ แหวน"
    },
    {
      "word": "ศ",
      "romanization": "sor",
      "meaning": "pavilion",
      "example": "ศ ศาลา",
      "audioText": "ซอ โซ่"
    },
    {
      "word": "ษ",
      "romanization": "sor",
      "meaning": "hermit",
      "example": "ษ ฤาษี",
      "audioText": "ซอ โซ่"
    },
    {
      "word": "ส",
      "romanization": "sor",
      "meaning": "tiger",
      "example": "ส เสือ",
      "audioText": "ซอ โซ่"
    },
    {
      "word": "ห",
      "romanization": "hor",
      "meaning": "chest",
      "example": "ห หีบ",
      "audioText": "หอ หีบ"
    },
    {
      "word": "ฬ",
      "romanization": "lor",
      "meaning": "kite",
      "example": "ฬ จุฬา",
      "audioText": "ลอ ลิง"
    },
    {
      "word": "อ",
      "romanization": "or",
      "meaning": "basin",
      "example": "อ อ่าง",
      "audioText": "ออ อ่าง"
    },
    {
      "word": "ฮ",
      "romanization": "hor",
      "meaning": "owl",
      "example": "ฮ นกฮูก",
      "audioText": "หอ หีบ"
    }
  ]
};

async function seedConsonantLesson() {
  try {
    console.log('Starting to seed Thai consonant lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: consonantLessonData.lesson_id,
      title: consonantLessonData.title,
      level: consonantLessonData.level,
      description: 'เรียนรู้พยัญชนะพื้นฐานภาษาไทย 44 ตัว พร้อมตัวอย่างคำและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: consonantLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = consonantLessonData.vocab.map(async (vocabItem, index) => {
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

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: 'basic_letters',
          difficulty: 'beginner',
          lesson_id: consonantLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['consonant', 'basic', 'thai-alphabet'],
          frequency: 0,
          is_active: true
        };

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabItem.word,
            lesson_id: consonantLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${consonantLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${consonantLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${consonantLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนพยัญชนะพื้นฐาน เราได้เรียนรู้พยัญชนะไทย ${consonantLessonData.vocab.length} ตัว พร้อมตัวอย่างคำและความหมาย`;
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
    console.error('Error seeding consonant lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedConsonantLesson();
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

module.exports = { seedConsonantLesson, consonantLessonData };
