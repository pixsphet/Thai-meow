const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai basic questions lesson data
const questionsLessonData = {
  "lesson_id": 11,
  "level": "Intermediate",
  "title": "คำถามพื้นฐาน",
  "vocab": [
    {
      "word": "อะไร",
      "romanization": "à-rai",
      "meaning": "what",
      "example": "นี่คืออะไร?",
      "audio": "arai.mp3"
    },
    {
      "word": "ที่ไหน",
      "romanization": "thîi-nǎi",
      "meaning": "where",
      "example": "ห้องน้ำอยู่ที่ไหน?",
      "audio": "thinai.mp3"
    },
    {
      "word": "ใคร",
      "romanization": "khrai",
      "meaning": "who",
      "example": "เขาเป็นใคร?",
      "audio": "khrai.mp3"
    },
    {
      "word": "เมื่อไหร่",
      "romanization": "mûea-rài",
      "meaning": "when",
      "example": "คุณจะไปเมื่อไหร่?",
      "audio": "muearai.mp3"
    },
    {
      "word": "ทำไม",
      "romanization": "tham-mai",
      "meaning": "why",
      "example": "ทำไมคุณเศร้า?",
      "audio": "thammai.mp3"
    },
    {
      "word": "อย่างไร",
      "romanization": "yàang-rai",
      "meaning": "how",
      "example": "คุณไปโรงเรียนอย่างไร?",
      "audio": "yangrai.mp3"
    },
    {
      "word": "กี่",
      "romanization": "gìi",
      "meaning": "how many / how much",
      "example": "คุณมีพี่น้องกี่คน?",
      "audio": "gii.mp3"
    },
    {
      "word": "อันไหน",
      "romanization": "an nǎi",
      "meaning": "which one",
      "example": "อันไหนของคุณ?",
      "audio": "annai.mp3"
    },
    {
      "word": "ของใคร",
      "romanization": "khǎawng khrai",
      "meaning": "whose",
      "example": "นี่ของใคร?",
      "audio": "khongkhrai.mp3"
    },
    {
      "word": "ทำอย่างไร",
      "romanization": "tham yàang-rai",
      "meaning": "how to do",
      "example": "ทำเค้กทำอย่างไร?",
      "audio": "thamyangrai.mp3"
    }
  ]
};

async function seedQuestionsLesson() {
  try {
    console.log('Starting to seed Thai basic questions lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: questionsLessonData.lesson_id,
      title: questionsLessonData.title,
      level: questionsLessonData.level,
      description: 'เรียนรู้คำถามพื้นฐานภาษาไทย พร้อมตัวอย่างประโยคและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: questionsLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = questionsLessonData.vocab.map(async (vocabItem, index) => {
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

        // Determine category based on question type
        let category = 'questions';
        if (vocabItem.word.includes('อะไร')) {
          category = 'what_questions';
        } else if (vocabItem.word.includes('ที่ไหน')) {
          category = 'where_questions';
        } else if (vocabItem.word.includes('ใคร') || vocabItem.word.includes('ของใคร')) {
          category = 'who_questions';
        } else if (vocabItem.word.includes('เมื่อไหร่')) {
          category = 'when_questions';
        } else if (vocabItem.word.includes('ทำไม')) {
          category = 'why_questions';
        } else if (vocabItem.word.includes('อย่างไร') || vocabItem.word.includes('ทำอย่างไร')) {
          category = 'how_questions';
        } else if (vocabItem.word.includes('กี่')) {
          category = 'quantity_questions';
        } else if (vocabItem.word.includes('อันไหน')) {
          category = 'choice_questions';
        }

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: category,
          difficulty: 'intermediate',
          lesson_id: questionsLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['questions', 'interrogative', 'conversation', 'thai-language', 'grammar'],
          frequency: 0,
          is_active: true
        };

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabItem.word,
            lesson_id: questionsLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${questionsLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${questionsLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${questionsLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนคำถามพื้นฐาน เราได้เรียนรู้คำถามพื้นฐานภาษาไทย ${questionsLessonData.vocab.length} คำ พร้อมตัวอย่างประโยคและความหมาย`;
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
    console.error('Error seeding questions lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedQuestionsLesson();
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

module.exports = { seedQuestionsLesson, questionsLessonData };





