const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai greetings lesson data
const greetingsLessonData = {
  "lesson_id": 3,
  "level": "Beginner",
  "title": "คำทักทาย",
  "vocab": [
    {
      "word": "สวัสดี",
      "romanization": "sà-wàt-dii",
      "meaning": "hello / hi",
      "example": "สวัสดีครับ/ค่ะ",
      "audio": "sawasdee.mp3"
    },
    {
      "word": "สบายดีไหม",
      "romanization": "sà-baai dii mái",
      "meaning": "how are you?",
      "example": "คุณสบายดีไหม?",
      "audio": "sabaidee_mai.mp3"
    },
    {
      "word": "ขอบคุณ",
      "romanization": "khàawp-khun",
      "meaning": "thank you",
      "example": "ขอบคุณมากครับ/ค่ะ",
      "audio": "khobkhun.mp3"
    },
    {
      "word": "ไม่เป็นไร",
      "romanization": "mâi bpen rai",
      "meaning": "you're welcome / never mind",
      "example": "ไม่เป็นไรครับ/ค่ะ",
      "audio": "maipenrai.mp3"
    },
    {
      "word": "ชื่ออะไร",
      "romanization": "chûue à-rai",
      "meaning": "what's your name?",
      "example": "คุณชื่ออะไร?",
      "audio": "cheu_arai.mp3"
    },
    {
      "word": "ยินดีที่ได้รู้จัก",
      "romanization": "yin-dii thîi dâai rúu-jàk",
      "meaning": "nice to meet you",
      "example": "ยินดีที่ได้รู้จักครับ/ค่ะ",
      "audio": "yindee_ruujak.mp3"
    },
    {
      "word": "ลาก่อน",
      "romanization": "laa-gàawn",
      "meaning": "goodbye",
      "example": "ลาก่อน แล้วพบกันใหม่",
      "audio": "la_korn.mp3"
    },
    {
      "word": "ขอโทษ",
      "romanization": "khǎaw-thôot",
      "meaning": "sorry / excuse me",
      "example": "ขอโทษครับ/ค่ะ",
      "audio": "kho_thot.mp3"
    },
    {
      "word": "ครับ",
      "romanization": "khráp",
      "meaning": "polite particle (male)",
      "example": "สวัสดีครับ",
      "audio": "khrap.mp3"
    },
    {
      "word": "ค่ะ",
      "romanization": "khâ",
      "meaning": "polite particle (female)",
      "example": "ขอบคุณค่ะ",
      "audio": "kha.mp3"
    },
    {
      "word": "เป็นอย่างไรบ้าง",
      "romanization": "bpen yàang-rai bâang",
      "meaning": "how's it going?",
      "example": "วันนี้เป็นอย่างไรบ้าง?",
      "audio": "bpen_yangrai_baang.mp3"
    },
    {
      "word": "เชิญ",
      "romanization": "chern",
      "meaning": "please / go ahead",
      "example": "เชิญนั่งครับ/ค่ะ",
      "audio": "chern.mp3"
    },
    {
      "word": "ยินดีต้อนรับ",
      "romanization": "yin-dii dtâawn-ráp",
      "meaning": "welcome",
      "example": "ยินดีต้อนรับสู่ประเทศไทย",
      "audio": "welcome.mp3"
    },
    {
      "word": "พบกันใหม่",
      "romanization": "phóp gan mài",
      "meaning": "see you again",
      "example": "ไว้พบกันใหม่ครับ/ค่ะ",
      "audio": "see_you_again.mp3"
    },
    {
      "word": "แล้วเจอกัน",
      "romanization": "láew jer gan",
      "meaning": "see you",
      "example": "แล้วเจอกันนะ!",
      "audio": "see_you.mp3"
    },
    {
      "word": "ฝันดี",
      "romanization": "fǎn dii",
      "meaning": "good night",
      "example": "ราตรีสวัสดิ์ ฝันดีนะครับ/ค่ะ",
      "audio": "goodnight.mp3"
    },
    {
      "word": "ขอแนะนำตัว",
      "romanization": "khǎaw náe-nam dtuua",
      "meaning": "let me introduce myself",
      "example": "ขอแนะนำตัวครับ/ค่ะ ฉันชื่อ...",
      "audio": "introduce_myself.mp3"
    },
    {
      "word": "นานแค่ไหนแล้ว",
      "romanization": "naan khâae năi láew",
      "meaning": "how long has it been?",
      "example": "เราไม่ได้เจอกันนานแค่ไหนแล้วนะ?",
      "audio": "how_long.mp3"
    },
    {
      "word": "ไม่เจอกันนานเลย",
      "romanization": "mâi jer gan naan loei",
      "meaning": "long time no see",
      "example": "เฮ้! ไม่เจอกันนานเลย",
      "audio": "long_time_no_see.mp3"
    },
    {
      "word": "ขออนุญาต",
      "romanization": "khǎaw à-nú-yâat",
      "meaning": "excuse me / may I",
      "example": "ขออนุญาตถามหน่อยครับ/ค่ะ",
      "audio": "may_i.mp3"
    },
    {
      "word": "สบายดี",
      "romanization": "sà-baai dii",
      "meaning": "I'm fine / I'm good",
      "example": "ฉันสบายดี ขอบคุณครับ/ค่ะ",
      "audio": "sabaidee.mp3"
    },
    {
      "word": "ไม่สบาย",
      "romanization": "mâi sà-baai",
      "meaning": "not feeling well / sick",
      "example": "วันนี้ฉันไม่สบาย",
      "audio": "mai_sabai.mp3"
    },
    {
      "word": "คุณล่ะ",
      "romanization": "khun lâ",
      "meaning": "and you?",
      "example": "ฉันสบายดี แล้วคุณล่ะ?",
      "audio": "khun_la.mp3"
    },
    {
      "word": "ยินดี",
      "romanization": "yin-dii",
      "meaning": "glad / with pleasure",
      "example": "ยินดีช่วยครับ/ค่ะ",
      "audio": "yindee.mp3"
    },
    {
      "word": "เช่นกัน",
      "romanization": "chên gan",
      "meaning": "same to you / likewise",
      "example": "ยินดีที่ได้รู้จักเช่นกันครับ/ค่ะ",
      "audio": "chengan.mp3"
    }
  ]
};

async function seedGreetingsLesson() {
  try {
    console.log('Starting to seed Thai greetings lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: greetingsLessonData.lesson_id,
      title: greetingsLessonData.title,
      level: greetingsLessonData.level,
      description: 'เรียนรู้คำทักทายและมารยาทพื้นฐานภาษาไทย พร้อมตัวอย่างประโยคและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: greetingsLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = greetingsLessonData.vocab.map(async (vocabItem, index) => {
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
          category: 'greetings',
          difficulty: 'beginner',
          lesson_id: greetingsLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['greeting', 'conversation', 'polite', 'thai-language'],
          frequency: 0,
          is_active: true
        };

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabItem.word,
            lesson_id: greetingsLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${greetingsLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${greetingsLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${greetingsLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนคำทักทาย เราได้เรียนรู้คำทักทายและมารยาทพื้นฐานภาษาไทย ${greetingsLessonData.vocab.length} คำ พร้อมตัวอย่างประโยคและความหมาย`;
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
    console.error('Error seeding greetings lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedGreetingsLesson();
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

module.exports = { seedGreetingsLesson, greetingsLessonData };





