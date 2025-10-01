const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai vowels and tones lesson data
const vowelsLessonData = {
  "lesson_id": 2,
  "level": "Beginner",
  "title": "สระและวรรณยุกต์",
  "vocab": [
    {
      "word": "อะ",
      "romanization": "a",
      "meaning": "short vowel 'a'",
      "example": "จะ, ละ",
      "audio": "a_short.mp3"
    },
    {
      "word": "อา",
      "romanization": "aa",
      "meaning": "long vowel 'aa'",
      "example": "มา, ตา",
      "audio": "a_long.mp3"
    },
    {
      "word": "อิ",
      "romanization": "i",
      "meaning": "short vowel 'i'",
      "example": "ปิ, กิ",
      "audio": "i_short.mp3"
    },
    {
      "word": "อี",
      "romanization": "ii",
      "meaning": "long vowel 'ii'",
      "example": "มี, ดี",
      "audio": "i_long.mp3"
    },
    {
      "word": "อึ",
      "romanization": "ue",
      "meaning": "short vowel 'ue'",
      "example": "ฮึ, ขึ",
      "audio": "ue_short.mp3"
    },
    {
      "word": "อื",
      "romanization": "uue",
      "meaning": "long vowel 'uue'",
      "example": "มือ, คือ",
      "audio": "ue_long.mp3"
    },
    {
      "word": "อุ",
      "romanization": "u",
      "meaning": "short vowel 'u'",
      "example": "ปุ, กุ",
      "audio": "u_short.mp3"
    },
    {
      "word": "อู",
      "romanization": "uu",
      "meaning": "long vowel 'uu'",
      "example": "ดู, ครู",
      "audio": "u_long.mp3"
    },
    {
      "word": "เอะ",
      "romanization": "e",
      "meaning": "short vowel 'e'",
      "example": "เละ, เหะ",
      "audio": "e_short.mp3"
    },
    {
      "word": "เอ",
      "romanization": "ee",
      "meaning": "long vowel 'ee'",
      "example": "เม, เท",
      "audio": "e_long.mp3"
    },
    {
      "word": "แอะ",
      "romanization": "ae",
      "meaning": "short vowel 'ae'",
      "example": "แอะ, แดะ",
      "audio": "ae_short.mp3"
    },
    {
      "word": "แอ",
      "romanization": "aae",
      "meaning": "long vowel 'aae'",
      "example": "แมว, แดง",
      "audio": "ae_long.mp3"
    },
    {
      "word": "โอะ",
      "romanization": "o",
      "meaning": "short vowel 'o'",
      "example": "โต๊ะ, โอะ",
      "audio": "o_short.mp3"
    },
    {
      "word": "โอ",
      "romanization": "oo",
      "meaning": "long vowel 'oo'",
      "example": "โต, โก",
      "audio": "o_long.mp3"
    },
    {
      "word": "เอาะ",
      "romanization": "aw",
      "meaning": "short vowel 'aw'",
      "example": "พ่อ, จ่อ",
      "audio": "aw_short.mp3"
    },
    {
      "word": "ออ",
      "romanization": "aaw",
      "meaning": "long vowel 'aaw'",
      "example": "ขอ, รอ",
      "audio": "aw_long.mp3"
    },
    {
      "word": "เออะ",
      "romanization": "oe",
      "meaning": "short vowel 'oe'",
      "example": "เถอะ, เยอะ",
      "audio": "oe_short.mp3"
    },
    {
      "word": "เออ",
      "romanization": "ooe",
      "meaning": "long vowel 'ooe'",
      "example": "เธอ, เจอ",
      "audio": "oe_long.mp3"
    },
    {
      "word": "เอียะ",
      "romanization": "ia",
      "meaning": "short vowel 'ia'",
      "example": "เรียะ (ไม่ค่อยใช้)",
      "audio": "ia_short.mp3"
    },
    {
      "word": "เอีย",
      "romanization": "iia",
      "meaning": "long vowel 'iia'",
      "example": "เสีย, เรียน",
      "audio": "ia_long.mp3"
    },
    {
      "word": "เอือะ",
      "romanization": "uea",
      "meaning": "short vowel 'uea'",
      "example": "เอือะ (ไม่ค่อยใช้)",
      "audio": "uea_short.mp3"
    },
    {
      "word": "เอือ",
      "romanization": "uuea",
      "meaning": "long vowel 'uuea'",
      "example": "เสือ, เหือด",
      "audio": "uea_long.mp3"
    },
    {
      "word": "อัวะ",
      "romanization": "ua",
      "meaning": "short vowel 'ua'",
      "example": "ตัวะ (ไม่ค่อยใช้)",
      "audio": "ua_short.mp3"
    },
    {
      "word": "อัว",
      "romanization": "uaa",
      "meaning": "long vowel 'uaa'",
      "example": "หัว, ตัว",
      "audio": "ua_long.mp3"
    },
    {
      "word": "อำ",
      "romanization": "am",
      "meaning": "nasal vowel 'am'",
      "example": "ทำ, จำ",
      "audio": "am.mp3"
    },
    {
      "word": "ไอ",
      "romanization": "ai",
      "meaning": "diphthong 'ai'",
      "example": "ไป, ไม้",
      "audio": "ai.mp3"
    },
    {
      "word": "ใอ",
      "romanization": "ai",
      "meaning": "diphthong 'ai' (alt)",
      "example": "ใบ, ใหญ่",
      "audio": "ai_alt.mp3"
    },
    {
      "word": "เอา",
      "romanization": "ao",
      "meaning": "diphthong 'ao'",
      "example": "เขา, เรา",
      "audio": "ao.mp3"
    },
    {
      "word": "ฤ",
      "romanization": "rue",
      "meaning": "special vowel 'rue'",
      "example": "ฤดู",
      "audio": "rue.mp3"
    },
    {
      "word": "ฤๅ",
      "romanization": "ruue",
      "meaning": "special vowel 'ruue'",
      "example": "ฤๅชา",
      "audio": "ruue.mp3"
    },
    {
      "word": "ฦ",
      "romanization": "lue",
      "meaning": "special vowel 'lue'",
      "example": "ฦๅชา",
      "audio": "lue.mp3"
    },
    {
      "word": "ฦๅ",
      "romanization": "luue",
      "meaning": "special vowel 'luue'",
      "example": "ฦๅ (โบราณ)",
      "audio": "luue.mp3"
    },
    {
      "word": "ไม่มีวรรณยุกต์",
      "romanization": "no tone",
      "meaning": "mid tone (no marker)",
      "example": "มา, กา",
      "audio": "tone_mid.mp3"
    },
    {
      "word": "ไม้เอก",
      "romanization": "mai ek",
      "meaning": "low tone (่)",
      "example": "ป่า, ข่า",
      "audio": "tone_low.mp3"
    },
    {
      "word": "ไม้โท",
      "romanization": "mai tho",
      "meaning": "falling tone (้)",
      "example": "ข้า, ป้า",
      "audio": "tone_falling.mp3"
    },
    {
      "word": "ไม้ตรี",
      "romanization": "mai tri",
      "meaning": "high tone (๊)",
      "example": "พี่, จ๊า",
      "audio": "tone_high.mp3"
    },
    {
      "word": "ไม้จัตวา",
      "romanization": "mai jattawa",
      "meaning": "rising tone (๋)",
      "example": "อ๋อ, หร๋อ",
      "audio": "tone_rising.mp3"
    }
  ]
};

async function seedVowelsLesson() {
  try {
    console.log('Starting to seed Thai vowels and tones lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: vowelsLessonData.lesson_id,
      title: vowelsLessonData.title,
      level: vowelsLessonData.level,
      description: 'เรียนรู้สระและวรรณยุกต์ภาษาไทย พร้อมตัวอย่างคำและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: vowelsLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = vowelsLessonData.vocab.map(async (vocabItem, index) => {
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
        let category = 'vowels';
        if (vocabItem.word.includes('วรรณยุกต์') || vocabItem.word.includes('ไม้')) {
          category = 'tones';
        } else if (vocabItem.word.includes('ฤ') || vocabItem.word.includes('ฦ')) {
          category = 'special_vowels';
        }

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: category,
          difficulty: 'beginner',
          lesson_id: vowelsLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['vowel', 'tone', 'thai-alphabet', 'pronunciation'],
          frequency: 0,
          is_active: true
        };

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabItem.word,
            lesson_id: vowelsLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${vowelsLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${vowelsLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${vowelsLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนสระและวรรณยุกต์ เราได้เรียนรู้สระและวรรณยุกต์ภาษาไทย ${vowelsLessonData.vocab.length} ตัว พร้อมตัวอย่างคำและความหมาย`;
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
    console.error('Error seeding vowels lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedVowelsLesson();
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

module.exports = { seedVowelsLesson, vowelsLessonData };





