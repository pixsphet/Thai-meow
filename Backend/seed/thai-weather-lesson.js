const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai weather and seasons lesson data
const weatherLessonData = {
  "lesson_id": 14,
  "level": "Intermediate",
  "title": "อากาศและฤดูกาล",
  "vocab": [
    {
      "word": "อากาศ",
      "romanization": "aa-gàat",
      "meaning": "weather",
      "example": "วันนี้อากาศดีมาก",
      "audio": "weather.mp3"
    },
    {
      "word": "ร้อน",
      "romanization": "rón",
      "meaning": "hot",
      "example": "วันนี้อากาศร้อน",
      "audio": "hot.mp3"
    },
    {
      "word": "เย็น",
      "romanization": "yen",
      "meaning": "cool / cold",
      "example": "ตอนเช้าอากาศเย็น",
      "audio": "cool.mp3"
    },
    {
      "word": "ฝนตก",
      "romanization": "fǒn dtòk",
      "meaning": "rain",
      "example": "เมื่อวานฝนตกหนัก",
      "audio": "rain.mp3"
    },
    {
      "word": "แดดออก",
      "romanization": "dàet òrk",
      "meaning": "sunny",
      "example": "ช่วงบ่ายแดดออก",
      "audio": "sunny.mp3"
    },
    {
      "word": "ลมแรง",
      "romanization": "lom raeng",
      "meaning": "windy",
      "example": "วันนี้ลมแรงมาก",
      "audio": "windy.mp3"
    },
    {
      "word": "ฟ้าร้อง",
      "romanization": "fáa róng",
      "meaning": "thunder",
      "example": "เมื่อคืนฟ้าร้องดัง",
      "audio": "thunder.mp3"
    },
    {
      "word": "พายุ",
      "romanization": "paa-yú",
      "meaning": "storm",
      "example": "มีพายุเข้ามาวันนี้",
      "audio": "storm.mp3"
    },
    {
      "word": "อุณหภูมิ",
      "romanization": "un-hà-puum",
      "meaning": "temperature",
      "example": "อุณหภูมิวันนี้ 30 องศา",
      "audio": "temperature.mp3"
    },
    {
      "word": "ฤดูร้อน",
      "romanization": "rʉ́-duu rón",
      "meaning": "summer",
      "example": "ฤดูร้อนในไทยเริ่มมีนาคม",
      "audio": "summer.mp3"
    },
    {
      "word": "ฤดูฝน",
      "romanization": "rʉ́-duu fǒn",
      "meaning": "rainy season",
      "example": "ฤดูฝนมีฝนตกเกือบทุกวัน",
      "audio": "rainy.mp3"
    },
    {
      "word": "ฤดูหนาว",
      "romanization": "rʉ́-duu nǎao",
      "meaning": "winter",
      "example": "ฤดูหนาวอากาศเย็น",
      "audio": "winter.mp3"
    },
    {
      "word": "หมอก",
      "romanization": "mòk",
      "meaning": "fog",
      "example": "เช้านี้มีหมอกหนา",
      "audio": "fog.mp3"
    },
    {
      "word": "พยากรณ์อากาศ",
      "romanization": "phá-yaa-gon aa-gàat",
      "meaning": "weather forecast",
      "example": "ฉันดูพยากรณ์อากาศทุกวัน",
      "audio": "forecast.mp3"
    },
    {
      "word": "เปียก",
      "romanization": "bpìak",
      "meaning": "wet",
      "example": "ฝนตกทำให้เสื้อเปียก",
      "audio": "wet.mp3"
    },
    {
      "word": "แห้ง",
      "romanization": "hâeng",
      "meaning": "dry",
      "example": "อากาศช่วงนี้แห้งมาก",
      "audio": "dry.mp3"
    }
  ]
};

async function seedWeatherLesson() {
  try {
    console.log('Starting to seed Thai weather and seasons lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: weatherLessonData.lesson_id,
      title: weatherLessonData.title,
      level: weatherLessonData.level,
      description: 'เรียนรู้คำศัพท์เกี่ยวกับอากาศและฤดูกาล ภาษาไทย พร้อมตัวอย่างประโยคและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: weatherLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = weatherLessonData.vocab.map(async (vocabItem, index) => {
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

        // Determine category based on weather context
        let category = 'weather';
        if (vocabItem.word.includes('ร้อน') || vocabItem.word.includes('เย็น') || vocabItem.word.includes('อุณหภูมิ')) {
          category = 'temperature';
        } else if (vocabItem.word.includes('ฝน') || vocabItem.word.includes('พายุ') || vocabItem.word.includes('ฟ้าร้อง')) {
          category = 'precipitation';
        } else if (vocabItem.word.includes('แดด') || vocabItem.word.includes('ลม') || vocabItem.word.includes('หมอก')) {
          category = 'atmospheric_conditions';
        } else if (vocabItem.word.includes('ฤดู')) {
          category = 'seasons';
        } else if (vocabItem.word.includes('เปียก') || vocabItem.word.includes('แห้ง')) {
          category = 'moisture';
        } else if (vocabItem.word.includes('พยากรณ์')) {
          category = 'weather_forecast';
        }

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: category,
          difficulty: 'intermediate',
          lesson_id: weatherLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['weather', 'seasons', 'climate', 'thai-language', 'nature'],
          frequency: 0,
          is_active: true
        };

        // Check if word already exists in other lessons
        const existingVocab = await Vocabulary.findOne({ 
          word: vocabItem.word,
          lesson_id: { $ne: weatherLessonData.lesson_id }
        });

        if (existingVocab) {
          // Create a new entry with lesson-specific context
          vocabularyData.word = `${vocabItem.word}_weather`;
          vocabularyData.thai_word = vocabItem.word;
        }

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabularyData.word,
            lesson_id: weatherLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${weatherLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${weatherLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${weatherLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนอากาศและฤดูกาล เราได้เรียนรู้คำศัพท์เกี่ยวกับอากาศและฤดูกาลภาษาไทย ${weatherLessonData.vocab.length} คำ พร้อมตัวอย่างประโยคและความหมาย`;
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
    console.error('Error seeding weather lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedWeatherLesson();
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

module.exports = { seedWeatherLesson, weatherLessonData };





