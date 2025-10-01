const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai numbers and age lesson data
const numbersLessonData = {
  "lesson_id": 4,
  "level": "Beginner",
  "title": "ตัวเลขและการถามอายุ",
  "vocab": [
    {
      "word": "หนึ่ง",
      "romanization": "nèung",
      "meaning": "one",
      "example": "ผมมีหนึ่งเล่ม",
      "audio": "neung.mp3"
    },
    {
      "word": "สอง",
      "romanization": "sǎawng",
      "meaning": "two",
      "example": "เธอมีสองพี่น้อง",
      "audio": "song.mp3"
    },
    {
      "word": "สาม",
      "romanization": "sǎam",
      "meaning": "three",
      "example": "มีสามคนในครอบครัว",
      "audio": "sam.mp3"
    },
    {
      "word": "สี่",
      "romanization": "sìi",
      "meaning": "four",
      "example": "ผมซื้อสี่ดอกไม้",
      "audio": "see.mp3"
    },
    {
      "word": "ห้า",
      "romanization": "hâa",
      "meaning": "five",
      "example": "ฉันมีห้าเล่มหนังสือ",
      "audio": "ha.mp3"
    },
    {
      "word": "หก",
      "romanization": "hòk",
      "meaning": "six",
      "example": "เขามีหกลูก",
      "audio": "hok.mp3"
    },
    {
      "word": "เจ็ด",
      "romanization": "jèt",
      "meaning": "seven",
      "example": "วันนี้วันที่เจ็ด",
      "audio": "jet.mp3"
    },
    {
      "word": "แปด",
      "romanization": "bpàet",
      "meaning": "eight",
      "example": "ฉันนอนแปดชั่วโมง",
      "audio": "paet.mp3"
    },
    {
      "word": "เก้า",
      "romanization": "gâo",
      "meaning": "nine",
      "example": "เธออายุเก้าปี",
      "audio": "kao.mp3"
    },
    {
      "word": "สิบ",
      "romanization": "sìp",
      "meaning": "ten",
      "example": "มีสิบคนในงาน",
      "audio": "sip.mp3"
    },
    {
      "word": "สิบเอ็ด",
      "romanization": "sìp èt",
      "meaning": "eleven",
      "example": "ผมอายุสิบเอ็ดปี",
      "audio": "sip_et.mp3"
    },
    {
      "word": "สิบสอง",
      "romanization": "sìp sǎawng",
      "meaning": "twelve",
      "example": "วันนี้วันที่สิบสอง",
      "audio": "sip_song.mp3"
    },
    {
      "word": "สิบสาม",
      "romanization": "sìp sǎam",
      "meaning": "thirteen",
      "example": "ฉันมีสิบสามเล่มหนังสือ",
      "audio": "sip_sam.mp3"
    },
    {
      "word": "สิบสี่",
      "romanization": "sìp sìi",
      "meaning": "fourteen",
      "example": "เขามีสิบสี่ดอกไม้",
      "audio": "sip_see.mp3"
    },
    {
      "word": "สิบห้า",
      "romanization": "sìp hâa",
      "meaning": "fifteen",
      "example": "งานเริ่มสิบห้านาที",
      "audio": "sip_ha.mp3"
    },
    {
      "word": "สิบหก",
      "romanization": "sìp hòk",
      "meaning": "sixteen",
      "example": "บ้านเลขที่สิบหก",
      "audio": "sip_hok.mp3"
    },
    {
      "word": "สิบเจ็ด",
      "romanization": "sìp jèt",
      "meaning": "seventeen",
      "example": "ลูกชายอายุสิบเจ็ดปี",
      "audio": "sip_jet.mp3"
    },
    {
      "word": "สิบแปด",
      "romanization": "sìp bpàet",
      "meaning": "eighteen",
      "example": "เธอสูงสิบแปดเซนติเมตร",
      "audio": "sip_paet.mp3"
    },
    {
      "word": "สิบเก้า",
      "romanization": "sìp gâo",
      "meaning": "nineteen",
      "example": "ราคาเก้าสิบเก้าบาท",
      "audio": "sip_kao.mp3"
    },
    {
      "word": "ยี่สิบ",
      "romanization": "yîi sìp",
      "meaning": "twenty",
      "example": "เขามีเงินยี่สิบบาท",
      "audio": "yee_sip.mp3"
    },
    {
      "word": "สามสิบ",
      "romanization": "sǎam sìp",
      "meaning": "thirty",
      "example": "สามสิบวันมีหนึ่งเดือน",
      "audio": "sam_sip.mp3"
    },
    {
      "word": "สี่สิบ",
      "romanization": "sìi sìp",
      "meaning": "forty",
      "example": "สี่สิบปีที่แล้ว",
      "audio": "see_sip.mp3"
    },
    {
      "word": "ห้าสิบ",
      "romanization": "hâa sìp",
      "meaning": "fifty",
      "example": "ห้าสิบคนมางาน",
      "audio": "ha_sip.mp3"
    },
    {
      "word": "หกสิบ",
      "romanization": "hòk sìp",
      "meaning": "sixty",
      "example": "อายุหกสิบปี",
      "audio": "hok_sip.mp3"
    },
    {
      "word": "เจ็ดสิบ",
      "romanization": "jèt sìp",
      "meaning": "seventy",
      "example": "เจ็ดสิบเปอร์เซ็นต์",
      "audio": "jet_sip.mp3"
    },
    {
      "word": "แปดสิบ",
      "romanization": "bpàet sìp",
      "meaning": "eighty",
      "example": "แปดสิบปีที่แล้ว",
      "audio": "paet_sip.mp3"
    },
    {
      "word": "เก้าสิบ",
      "romanization": "gâo sìp",
      "meaning": "ninety",
      "example": "เก้าสิบคนในห้อง",
      "audio": "kao_sip.mp3"
    },
    {
      "word": "หนึ่งร้อย",
      "romanization": "nèung ráawy",
      "meaning": "one hundred",
      "example": "หนึ่งร้อยเปอร์เซ็นต์",
      "audio": "neung_roy.mp3"
    },
    {
      "word": "อายุ",
      "romanization": "aa-yú",
      "meaning": "age",
      "example": "คุณอายุเท่าไหร่?",
      "audio": "ayu.mp3"
    },
    {
      "word": "เท่าไหร่",
      "romanization": "thâo rài",
      "meaning": "how much / how many",
      "example": "คุณอายุเท่าไหร่?",
      "audio": "taorai.mp3"
    },
    {
      "word": "กี่ปี",
      "romanization": "gìi bpii",
      "meaning": "how many years",
      "example": "คุณอายุ กี่ ปี?",
      "audio": "kee_bpii.mp3"
    },
    {
      "word": "คุณอายุเท่าไหร่?",
      "romanization": "khun aa-yú thâo rài?",
      "meaning": "How old are you?",
      "example": "คุณอายุเท่าไหร่?",
      "audio": "khun_ayu_taorai.mp3"
    },
    {
      "word": "ฉันอายุ...ปี",
      "romanization": "chǎn aa-yú ... bpii",
      "meaning": "I am ... years old",
      "example": "ฉันอายุยี่สิบปี",
      "audio": "chan_ayu.mp3"
    },
    {
      "word": "ผมอายุ...ปี",
      "romanization": "phǒm aa-yú ... bpii",
      "meaning": "I am ... years old (male speaker)",
      "example": "ผมอายุสามสิบปี",
      "audio": "phom_ayu.mp3"
    },
    {
      "word": "ปี",
      "romanization": "bpii",
      "meaning": "year",
      "example": "ฉันอายุยี่สิบปี",
      "audio": "bpii.mp3"
    },
    {
      "word": "วัน",
      "romanization": "wan",
      "meaning": "day",
      "example": "วันนี้วันอะไร?",
      "audio": "wan.mp3"
    },
    {
      "word": "เดือน",
      "romanization": "duean",
      "meaning": "month",
      "example": "เดือนนี้คือเดือนอะไร?",
      "audio": "duean.mp3"
    }
  ]
};

async function seedNumbersLesson() {
  try {
    console.log('Starting to seed Thai numbers and age lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: numbersLessonData.lesson_id,
      title: numbersLessonData.title,
      level: numbersLessonData.level,
      description: 'เรียนรู้ตัวเลขภาษาไทยและการถาม-ตอบเรื่องอายุ พร้อมตัวอย่างประโยคและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: numbersLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = numbersLessonData.vocab.map(async (vocabItem, index) => {
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

        // Determine category based on word type
        let category = 'numbers';
        if (vocabItem.word.includes('อายุ') || vocabItem.word.includes('เท่าไหร่') || vocabItem.word.includes('กี่ปี')) {
          category = 'age_questions';
        } else if (vocabItem.word.includes('ปี') || vocabItem.word.includes('วัน') || vocabItem.word.includes('เดือน')) {
          category = 'time_units';
        }

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: category,
          difficulty: 'beginner',
          lesson_id: numbersLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['number', 'age', 'counting', 'thai-language', 'conversation'],
          frequency: 0,
          is_active: true
        };

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabItem.word,
            lesson_id: numbersLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${numbersLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${numbersLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${numbersLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนตัวเลขและการถามอายุ เราได้เรียนรู้ตัวเลขภาษาไทยและการถาม-ตอบเรื่องอายุ ${numbersLessonData.vocab.length} คำ พร้อมตัวอย่างประโยคและความหมาย`;
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
    console.error('Error seeding numbers lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedNumbersLesson();
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

module.exports = { seedNumbersLesson, numbersLessonData };





