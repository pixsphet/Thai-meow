const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai classifiers lesson data
const classifiersLessonData = {
  "lesson_id": 17,
  "level": "Advanced",
  "title": "คำลักษณนามพื้นฐาน",
  "vocab": [
    {
      "word": "คน",
      "romanization": "khon",
      "meaning": "person (classifier for people)",
      "example": "มีนักเรียนสองคนในห้อง",
      "audio": "khon.mp3"
    },
    {
      "word": "ตัว",
      "romanization": "tua",
      "meaning": "classifier for animals or body parts",
      "example": "ฉันมีแมวหนึ่งตัว",
      "audio": "tua.mp3"
    },
    {
      "word": "เล่ม",
      "romanization": "lêm",
      "meaning": "classifier for books or notebooks",
      "example": "เขาอ่านหนังสือสองเล่ม",
      "audio": "lem.mp3"
    },
    {
      "word": "คัน",
      "romanization": "khan",
      "meaning": "classifier for vehicles",
      "example": "รถยนต์สามคันอยู่ข้างนอก",
      "audio": "khan.mp3"
    },
    {
      "word": "บ้าน",
      "romanization": "bâan",
      "meaning": "classifier for houses",
      "example": "เธอมีบ้านหนึ่งหลัง",
      "audio": "baan.mp3"
    },
    {
      "word": "แผ่น",
      "romanization": "phàen",
      "meaning": "classifier for flat objects (paper, discs)",
      "example": "ฉันมีซีดีห้าแผ่น",
      "audio": "phaen.mp3"
    },
    {
      "word": "ใบ",
      "romanization": "bai",
      "meaning": "classifier for flat or thin objects (leaves, tickets)",
      "example": "ฉันมีตั๋วสองใบ",
      "audio": "bai.mp3"
    },
    {
      "word": "ดวง",
      "romanization": "duang",
      "meaning": "classifier for celestial bodies, lamps, eyes",
      "example": "พระอาทิตย์หนึ่งดวง",
      "audio": "duang.mp3"
    },
    {
      "word": "ขวด",
      "romanization": "khùat",
      "meaning": "classifier for bottles",
      "example": "ฉันดื่มน้ำสองขวด",
      "audio": "khuat.mp3"
    },
    {
      "word": "แก้ว",
      "romanization": "gâew",
      "meaning": "classifier for glasses (drinking)",
      "example": "เขาดื่มน้ำสามแก้ว",
      "audio": "kaew.mp3"
    },
    {
      "word": "กล่อง",
      "romanization": "glòng",
      "meaning": "classifier for boxes",
      "example": "เรามีขนมหนึ่งกล่อง",
      "audio": "glong.mp3"
    },
    {
      "word": "ชิ้น",
      "romanization": "chín",
      "meaning": "classifier for pieces (food, items)",
      "example": "เค้กหนึ่งชิ้น",
      "audio": "chin.mp3"
    },
    {
      "word": "ถุง",
      "romanization": "thǔng",
      "meaning": "classifier for bags",
      "example": "แม่ซื้อผลไม้สองถุง",
      "audio": "thueng.mp3"
    },
    {
      "word": "ลูก",
      "romanization": "lûuk",
      "meaning": "classifier for round objects (fruits, balls)",
      "example": "เขาเล่นฟุตบอลหนึ่งลูก",
      "audio": "luuk.mp3"
    }
  ]
};

async function seedClassifiersLesson() {
  try {
    console.log('Starting to seed Thai classifiers lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: classifiersLessonData.lesson_id,
      title: classifiersLessonData.title,
      level: classifiersLessonData.level,
      description: 'เรียนรู้คำลักษณนามพื้นฐานในภาษาไทย พร้อมตัวอย่างประโยคและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: classifiersLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = classifiersLessonData.vocab.map(async (vocabItem, index) => {
      try {
        // Generate AI TTS audio for the Thai word
        const thaiAudio = await aiTtsService.generateThaiSpeech(vocabItem.word, {
          voice: 'th-TH-Standard-A',
          rate: '0.9',
          emotion: 'neutral'
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

        // Determine category based on classifier type
        let category = 'classifiers';
        if (vocabItem.word === 'คน') {
          category = 'people_classifiers';
        } else if (vocabItem.word === 'ตัว') {
          category = 'animal_classifiers';
        } else if (vocabItem.word === 'เล่ม') {
          category = 'book_classifiers';
        } else if (vocabItem.word === 'คัน') {
          category = 'vehicle_classifiers';
        } else if (vocabItem.word === 'บ้าน') {
          category = 'building_classifiers';
        } else if (vocabItem.word === 'แผ่น' || vocabItem.word === 'ใบ') {
          category = 'flat_object_classifiers';
        } else if (vocabItem.word === 'ดวง') {
          category = 'celestial_classifiers';
        } else if (vocabItem.word === 'ขวด' || vocabItem.word === 'แก้ว') {
          category = 'container_classifiers';
        } else if (vocabItem.word === 'กล่อง' || vocabItem.word === 'ถุง') {
          category = 'storage_classifiers';
        } else if (vocabItem.word === 'ชิ้น' || vocabItem.word === 'ลูก') {
          category = 'piece_classifiers';
        }

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: category,
          difficulty: 'advanced',
          lesson_id: classifiersLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['classifiers', 'grammar', 'counting', 'thai-language', 'advanced'],
          frequency: 0,
          is_active: true
        };

        // Check if word already exists in other lessons
        const existingVocab = await Vocabulary.findOne({ 
          word: vocabItem.word,
          lesson_id: { $ne: classifiersLessonData.lesson_id }
        });

        if (existingVocab) {
          // Create a new entry with lesson-specific context
          vocabularyData.word = `${vocabItem.word}_classifier`;
          vocabularyData.thai_word = vocabItem.word;
        }

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabularyData.word,
            lesson_id: classifiersLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${classifiersLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${classifiersLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${classifiersLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนคำลักษณนามพื้นฐาน เราได้เรียนรู้คำลักษณนามภาษาไทย ${classifiersLessonData.vocab.length} คำ พร้อมตัวอย่างประโยคและความหมาย`;
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
    console.error('Error seeding classifiers lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedClassifiersLesson();
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

module.exports = { seedClassifiersLesson, classifiersLessonData };
