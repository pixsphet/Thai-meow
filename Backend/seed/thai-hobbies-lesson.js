const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai hobbies lesson data
const hobbiesLessonData = {
  "lesson_id": 15,
  "level": "Intermediate",
  "title": "งานอดิเรก",
  "vocab": [
    {
      "word": "งานอดิเรก",
      "romanization": "ngaan à-dì-rèk",
      "meaning": "hobby",
      "example": "งานอดิเรกของฉันคือวาดรูป",
      "audio": "hobby.mp3"
    },
    {
      "word": "เล่นกีฬา",
      "romanization": "lên gii-laa",
      "meaning": "to play sports",
      "example": "เขาชอบเล่นกีฬา",
      "audio": "play_sport.mp3"
    },
    {
      "word": "ว่ายน้ำ",
      "romanization": "wâai náam",
      "meaning": "swimming",
      "example": "ฉันไปว่ายน้ำทุกเย็น",
      "audio": "swim.mp3"
    },
    {
      "word": "วิ่ง",
      "romanization": "wîng",
      "meaning": "running",
      "example": "เขาวิ่งตอนเช้า",
      "audio": "run.mp3"
    },
    {
      "word": "เตะฟุตบอล",
      "romanization": "dtè fút-bon",
      "meaning": "play football (soccer)",
      "example": "เด็กๆ ชอบเตะฟุตบอล",
      "audio": "football.mp3"
    },
    {
      "word": "อ่านหนังสือ",
      "romanization": "àan năng-sǔe",
      "meaning": "reading books",
      "example": "ฉันอ่านหนังสือก่อนนอน",
      "audio": "read_book.mp3"
    },
    {
      "word": "วาดรูป",
      "romanization": "wâat rôop",
      "meaning": "drawing",
      "example": "เขาวาดรูปเก่งมาก",
      "audio": "draw.mp3"
    },
    {
      "word": "ฟังเพลง",
      "romanization": "fang pleeng",
      "meaning": "listening to music",
      "example": "ฉันชอบฟังเพลงเกาหลี",
      "audio": "listen_music.mp3"
    },
    {
      "word": "ร้องเพลง",
      "romanization": "róng pleeng",
      "meaning": "singing",
      "example": "พี่สาวร้องเพลงเพราะมาก",
      "audio": "sing.mp3"
    },
    {
      "word": "ทำอาหาร",
      "romanization": "tam aa-hǎan",
      "meaning": "cooking",
      "example": "แม่ชอบทำอาหารไทย",
      "audio": "cook.mp3"
    },
    {
      "word": "ถ่ายรูป",
      "romanization": "tàai rôop",
      "meaning": "taking photos",
      "example": "เขาชอบถ่ายรูปวิว",
      "audio": "take_photo.mp3"
    },
    {
      "word": "เล่นเกม",
      "romanization": "lên geem",
      "meaning": "playing games",
      "example": "น้องชายเล่นเกมทุกวัน",
      "audio": "play_game.mp3"
    },
    {
      "word": "ดูหนัง",
      "romanization": "duu năng",
      "meaning": "watching movies",
      "example": "คืนนี้ฉันจะดูหนัง",
      "audio": "watch_movie.mp3"
    },
    {
      "word": "เดินเล่น",
      "romanization": "dern lên",
      "meaning": "taking a walk",
      "example": "ปู่ชอบเดินเล่นในสวน",
      "audio": "walk.mp3"
    },
    {
      "word": "ปลูกต้นไม้",
      "romanization": "plùuk dtôn mái",
      "meaning": "planting trees",
      "example": "ยายปลูกต้นไม้หน้าบ้าน",
      "audio": "plant.mp3"
    },
    {
      "word": "ออกกำลังกาย",
      "romanization": "òk gam-lang-gaai",
      "meaning": "exercising",
      "example": "เราควรออกกำลังกายทุกวัน",
      "audio": "exercise.mp3"
    }
  ]
};

async function seedHobbiesLesson() {
  try {
    console.log('Starting to seed Thai hobbies lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: hobbiesLessonData.lesson_id,
      title: hobbiesLessonData.title,
      level: hobbiesLessonData.level,
      description: 'เรียนรู้คำศัพท์เกี่ยวกับงานอดิเรก ภาษาไทย พร้อมตัวอย่างประโยคและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: hobbiesLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = hobbiesLessonData.vocab.map(async (vocabItem, index) => {
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

        // Determine category based on hobby type
        let category = 'hobbies';
        if (vocabItem.word.includes('เล่นกีฬา') || vocabItem.word.includes('ว่ายน้ำ') || vocabItem.word.includes('วิ่ง') || vocabItem.word.includes('เตะฟุตบอล') || vocabItem.word.includes('ออกกำลังกาย')) {
          category = 'sports';
        } else if (vocabItem.word.includes('อ่านหนังสือ') || vocabItem.word.includes('วาดรูป')) {
          category = 'arts_crafts';
        } else if (vocabItem.word.includes('ฟังเพลง') || vocabItem.word.includes('ร้องเพลง') || vocabItem.word.includes('ดูหนัง')) {
          category = 'entertainment';
        } else if (vocabItem.word.includes('ทำอาหาร') || vocabItem.word.includes('ปลูกต้นไม้')) {
          category = 'lifestyle';
        } else if (vocabItem.word.includes('ถ่ายรูป') || vocabItem.word.includes('เล่นเกม') || vocabItem.word.includes('เดินเล่น')) {
          category = 'recreation';
        }

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: category,
          difficulty: 'intermediate',
          lesson_id: hobbiesLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['hobbies', 'activities', 'leisure', 'thai-language', 'lifestyle'],
          frequency: 0,
          is_active: true
        };

        // Check if word already exists in other lessons
        const existingVocab = await Vocabulary.findOne({ 
          word: vocabItem.word,
          lesson_id: { $ne: hobbiesLessonData.lesson_id }
        });

        if (existingVocab) {
          // Create a new entry with lesson-specific context
          vocabularyData.word = `${vocabItem.word}_hobby`;
          vocabularyData.thai_word = vocabItem.word;
        }

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabularyData.word,
            lesson_id: hobbiesLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${hobbiesLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${hobbiesLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${hobbiesLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนงานอดิเรก เราได้เรียนรู้คำศัพท์เกี่ยวกับงานอดิเรกภาษาไทย ${hobbiesLessonData.vocab.length} คำ พร้อมตัวอย่างประโยคและความหมาย`;
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
    console.error('Error seeding hobbies lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedHobbiesLesson();
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

module.exports = { seedHobbiesLesson, hobbiesLessonData };





