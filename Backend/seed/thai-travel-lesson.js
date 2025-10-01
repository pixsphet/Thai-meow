const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai travel lesson data
const travelLessonData = {
  "lesson_id": 13,
  "level": "Intermediate",
  "title": "การเดินทาง",
  "vocab": [
    {
      "word": "ไป",
      "romanization": "bpai",
      "meaning": "go",
      "example": "ฉันจะไปตลาด",
      "audio": "bpai.mp3"
    },
    {
      "word": "มา",
      "romanization": "maa",
      "meaning": "come",
      "example": "เขามาจากกรุงเทพฯ",
      "audio": "maa.mp3"
    },
    {
      "word": "ซ้าย",
      "romanization": "sáai",
      "meaning": "left",
      "example": "เลี้ยวซ้ายตรงแยกหน้า",
      "audio": "left.mp3"
    },
    {
      "word": "ขวา",
      "romanization": "khwǎa",
      "meaning": "right",
      "example": "เลี้ยวขวาที่แยกไฟแดง",
      "audio": "right.mp3"
    },
    {
      "word": "ตรงไป",
      "romanization": "dtrong bpai",
      "meaning": "go straight",
      "example": "ตรงไปอีก 100 เมตร",
      "audio": "straight.mp3"
    },
    {
      "word": "แยก",
      "romanization": "yâek",
      "meaning": "intersection",
      "example": "เลี้ยวขวาที่แยกถัดไป",
      "audio": "intersection.mp3"
    },
    {
      "word": "รถเมล์",
      "romanization": "rót mee",
      "meaning": "bus",
      "example": "ฉันนั่งรถเมล์ไปโรงเรียน",
      "audio": "bus.mp3"
    },
    {
      "word": "รถแท็กซี่",
      "romanization": "rót thák-sîi",
      "meaning": "taxi",
      "example": "เรานั่งแท็กซี่กลับบ้าน",
      "audio": "taxi.mp3"
    },
    {
      "word": "รถไฟฟ้า",
      "romanization": "rót fai fáa",
      "meaning": "skytrain / electric train",
      "example": "รถไฟฟ้าสะดวกมาก",
      "audio": "bts.mp3"
    },
    {
      "word": "รถไฟใต้ดิน",
      "romanization": "rót fai dtâi din",
      "meaning": "subway / MRT",
      "example": "ฉันใช้รถไฟใต้ดินทุกวัน",
      "audio": "mrt.mp3"
    },
    {
      "word": "รถจักรยาน",
      "romanization": "rót jàk-grà-yaan",
      "meaning": "bicycle",
      "example": "เขาขี่จักรยานไปทำงาน",
      "audio": "bicycle.mp3"
    },
    {
      "word": "เดิน",
      "romanization": "dern",
      "meaning": "walk",
      "example": "เราเดินไปสวนสาธารณะ",
      "audio": "walk.mp3"
    },
    {
      "word": "ขึ้น",
      "romanization": "kêun",
      "meaning": "get on (vehicle)",
      "example": "ขึ้นรถตรงนี้ได้เลย",
      "audio": "get_on.mp3"
    },
    {
      "word": "ลง",
      "romanization": "long",
      "meaning": "get off (vehicle)",
      "example": "ลงที่ป้ายหน้า",
      "audio": "get_off.mp3"
    },
    {
      "word": "สถานี",
      "romanization": "sà-thǎa-nii",
      "meaning": "station",
      "example": "สถานีถัดไปคืออโศก",
      "audio": "station.mp3"
    },
    {
      "word": "รถตู้",
      "romanization": "rót dtûu",
      "meaning": "van",
      "example": "รถตู้ไปอยุธยาออกกี่โมง?",
      "audio": "van.mp3"
    }
  ]
};

async function seedTravelLesson() {
  try {
    console.log('Starting to seed Thai travel lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: travelLessonData.lesson_id,
      title: travelLessonData.title,
      level: travelLessonData.level,
      description: 'เรียนรู้คำศัพท์เกี่ยวกับการเดินทาง ภาษาไทย พร้อมตัวอย่างประโยคและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: travelLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = travelLessonData.vocab.map(async (vocabItem, index) => {
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

        // Determine category based on travel context
        let category = 'travel';
        if (vocabItem.word.includes('ไป') || vocabItem.word.includes('มา') || vocabItem.word.includes('เดิน')) {
          category = 'movement';
        } else if (vocabItem.word.includes('ซ้าย') || vocabItem.word.includes('ขวา') || vocabItem.word.includes('ตรงไป') || vocabItem.word.includes('แยก')) {
          category = 'directions';
        } else if (vocabItem.word.includes('รถ') || vocabItem.word.includes('สถานี')) {
          category = 'transportation';
        } else if (vocabItem.word.includes('ขึ้น') || vocabItem.word.includes('ลง')) {
          category = 'boarding';
        }

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: category,
          difficulty: 'intermediate',
          lesson_id: travelLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['travel', 'transportation', 'directions', 'thai-language', 'navigation'],
          frequency: 0,
          is_active: true
        };

        // Check if word already exists in other lessons
        const existingVocab = await Vocabulary.findOne({ 
          word: vocabItem.word,
          lesson_id: { $ne: travelLessonData.lesson_id }
        });

        if (existingVocab) {
          // Create a new entry with lesson-specific context
          vocabularyData.word = `${vocabItem.word}_travel`;
          vocabularyData.thai_word = vocabItem.word;
        }

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabularyData.word,
            lesson_id: travelLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${travelLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${travelLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${travelLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนการเดินทาง เราได้เรียนรู้คำศัพท์เกี่ยวกับการเดินทางภาษาไทย ${travelLessonData.vocab.length} คำ พร้อมตัวอย่างประโยคและความหมาย`;
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
    console.error('Error seeding travel lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedTravelLesson();
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

module.exports = { seedTravelLesson, travelLessonData };
