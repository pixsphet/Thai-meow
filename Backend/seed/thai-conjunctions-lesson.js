const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai conjunctions and complex sentences lesson data
const conjunctionsLessonData = {
  "lesson_id": 16,
  "level": "Advanced",
  "title": "การใช้คำเชื่อมและประโยคซับซ้อน",
  "vocab": [
    {
      "word": "และ",
      "romanization": "láe",
      "meaning": "and",
      "example": "ฉันชอบกาแฟและชา",
      "audio": "lae.mp3"
    },
    {
      "word": "แต่",
      "romanization": "dtàe",
      "meaning": "but",
      "example": "เขารวยแต่ไม่หยิ่ง",
      "audio": "dtae.mp3"
    },
    {
      "word": "หรือ",
      "romanization": "rǔue",
      "meaning": "or",
      "example": "คุณจะกินข้าวหรือก๋วยเตี๋ยว?",
      "audio": "rue.mp3"
    },
    {
      "word": "เพราะ",
      "romanization": "prór",
      "meaning": "because",
      "example": "ฉันไม่ไปเพราะฝนตก",
      "audio": "phro.mp3"
    },
    {
      "word": "ถ้า",
      "romanization": "thâa",
      "meaning": "if",
      "example": "ถ้าฝนตก เราจะไม่ออกไปข้างนอก",
      "audio": "thaa.mp3"
    },
    {
      "word": "เมื่อ",
      "romanization": "mûea",
      "meaning": "when",
      "example": "เมื่อฉันหิว ฉันจะกินข้าว",
      "audio": "muea.mp3"
    },
    {
      "word": "ดังนั้น",
      "romanization": "dang-nán",
      "meaning": "therefore / so",
      "example": "เขาเหนื่อยมาก ดังนั้นเขาจึงนอนเร็ว",
      "audio": "dangnan.mp3"
    },
    {
      "word": "แม้ว่า",
      "romanization": "máe wâa",
      "meaning": "even though",
      "example": "แม้ว่าเขาจะยุ่ง เขาก็มาช่วย",
      "audio": "maewaa.mp3"
    },
    {
      "word": "เพื่อ",
      "romanization": "phûea",
      "meaning": "in order to / for",
      "example": "ฉันเรียนหนักเพื่อสอบให้ผ่าน",
      "audio": "phuea.mp3"
    },
    {
      "word": "เพราะฉะนั้น",
      "romanization": "prór chà-nán",
      "meaning": "therefore",
      "example": "ฝนตกหนัก เพราะฉะนั้นเราควรอยู่บ้าน",
      "audio": "phorchana.mp3"
    },
    {
      "word": "จนกระทั่ง",
      "romanization": "jon grà-thâng",
      "meaning": "until",
      "example": "เธอทำงานจนกระทั่งดึก",
      "audio": "jongrathang.mp3"
    },
    {
      "word": "ไม่เพียงแต่...แต่ยัง...",
      "romanization": "mâi phiiang dtàe... dtàe yang...",
      "meaning": "not only... but also...",
      "example": "เขาไม่เพียงแต่หล่อ แต่ยังฉลาดด้วย",
      "audio": "maipiang.mp3"
    },
    {
      "word": "ถึงแม้ว่า...แต่...",
      "romanization": "tǔeng máe wâa... dtàe...",
      "meaning": "although... but...",
      "example": "ถึงแม้ว่าเธอเหนื่อย แต่เธอยังทำต่อ",
      "audio": "thuengmae.mp3"
    }
  ]
};

async function seedConjunctionsLesson() {
  try {
    console.log('Starting to seed Thai conjunctions lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: conjunctionsLessonData.lesson_id,
      title: conjunctionsLessonData.title,
      level: conjunctionsLessonData.level,
      description: 'เรียนรู้คำเชื่อมและโครงสร้างประโยคซับซ้อนในภาษาไทย พร้อมตัวอย่างประโยคและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: conjunctionsLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = conjunctionsLessonData.vocab.map(async (vocabItem, index) => {
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

        // Determine category based on conjunction type
        let category = 'conjunctions';
        if (vocabItem.word.includes('และ') || vocabItem.word.includes('หรือ')) {
          category = 'coordinating_conjunctions';
        } else if (vocabItem.word.includes('เพราะ') || vocabItem.word.includes('ดังนั้น') || vocabItem.word.includes('เพราะฉะนั้น')) {
          category = 'causal_conjunctions';
        } else if (vocabItem.word.includes('ถ้า') || vocabItem.word.includes('เมื่อ') || vocabItem.word.includes('จนกระทั่ง')) {
          category = 'temporal_conjunctions';
        } else if (vocabItem.word.includes('แม้ว่า') || vocabItem.word.includes('ถึงแม้ว่า') || vocabItem.word.includes('ไม่เพียงแต่')) {
          category = 'contrastive_conjunctions';
        } else if (vocabItem.word.includes('เพื่อ')) {
          category = 'purpose_conjunctions';
        }

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: category,
          difficulty: 'advanced',
          lesson_id: conjunctionsLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['conjunctions', 'grammar', 'complex-sentences', 'thai-language', 'advanced'],
          frequency: 0,
          is_active: true
        };

        // Check if word already exists in other lessons
        const existingVocab = await Vocabulary.findOne({ 
          word: vocabItem.word,
          lesson_id: { $ne: conjunctionsLessonData.lesson_id }
        });

        if (existingVocab) {
          // Create a new entry with lesson-specific context
          vocabularyData.word = `${vocabItem.word}_conjunction`;
          vocabularyData.thai_word = vocabItem.word;
        }

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabularyData.word,
            lesson_id: conjunctionsLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${conjunctionsLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${conjunctionsLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${conjunctionsLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนการใช้คำเชื่อมและประโยคซับซ้อน เราได้เรียนรู้คำเชื่อมภาษาไทย ${conjunctionsLessonData.vocab.length} คำ พร้อมตัวอย่างประโยคและความหมาย`;
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
    console.error('Error seeding conjunctions lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedConjunctionsLesson();
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

module.exports = { seedConjunctionsLesson, conjunctionsLessonData };





