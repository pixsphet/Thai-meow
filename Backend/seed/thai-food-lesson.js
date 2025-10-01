const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai food and drinks lesson data
const foodLessonData = {
  "lesson_id": 7,
  "level": "Beginner",
  "title": "อาหารและเครื่องดื่ม",
  "vocab": [
    {
      "word": "ข้าว",
      "romanization": "khâao",
      "meaning": "rice",
      "example": "ฉันกินข้าวตอนเที่ยง",
      "audio": "khao.mp3"
    },
    {
      "word": "น้ำ",
      "romanization": "náam",
      "meaning": "water",
      "example": "ขอน้ำหนึ่งแก้วครับ/ค่ะ",
      "audio": "naam.mp3"
    },
    {
      "word": "กาแฟ",
      "romanization": "gaa-fae",
      "meaning": "coffee",
      "example": "ฉันดื่มกาแฟทุกเช้า",
      "audio": "coffee.mp3"
    },
    {
      "word": "ชา",
      "romanization": "chaa",
      "meaning": "tea",
      "example": "คุณชอบดื่มชาหรือกาแฟ?",
      "audio": "tea.mp3"
    },
    {
      "word": "นม",
      "romanization": "nom",
      "meaning": "milk",
      "example": "เด็กๆ ดื่มนมทุกวัน",
      "audio": "milk.mp3"
    },
    {
      "word": "ผลไม้",
      "romanization": "phŏn-lá-mái",
      "meaning": "fruit",
      "example": "ฉันชอบกินผลไม้",
      "audio": "fruit.mp3"
    },
    {
      "word": "ขนม",
      "romanization": "khà-nŏm",
      "meaning": "snack / dessert",
      "example": "ขนมนี้อร่อยมาก",
      "audio": "snack.mp3"
    },
    {
      "word": "ข้าวผัด",
      "romanization": "khâao-phàt",
      "meaning": "fried rice",
      "example": "ฉันสั่งข้าวผัดกุ้ง",
      "audio": "friedrice.mp3"
    },
    {
      "word": "ก๋วยเตี๋ยว",
      "romanization": "gŭai-dtĭao",
      "meaning": "noodle soup",
      "example": "ผมชอบกินก๋วยเตี๋ยวเนื้อ",
      "audio": "noodlesoup.mp3"
    },
    {
      "word": "ซุป",
      "romanization": "súp",
      "meaning": "soup",
      "example": "ซุปไก่อุ่นๆ ทำให้รู้สึกดี",
      "audio": "soup.mp3"
    },
    {
      "word": "ข้าวเหนียว",
      "romanization": "khâao-nĭeow",
      "meaning": "sticky rice",
      "example": "ข้าวเหนียวมะม่วงเป็นของหวานไทย",
      "audio": "stickyrice.mp3"
    },
    {
      "word": "น้ำผลไม้",
      "romanization": "náam-phŏn-lá-mái",
      "meaning": "fruit juice",
      "example": "ฉันดื่มน้ำผลไม้ทุกเช้า",
      "audio": "juice.mp3"
    },
    {
      "word": "โค้ก",
      "romanization": "kôok",
      "meaning": "Coke / cola",
      "example": "ขอแก้วโค้กเย็นๆ",
      "audio": "coke.mp3"
    },
    {
      "word": "ไอศกรีม",
      "romanization": "ai-sà-griim",
      "meaning": "ice cream",
      "example": "เด็กๆ ชอบกินไอศกรีม",
      "audio": "icecream.mp3"
    },
    {
      "word": "ไข่ดาว",
      "romanization": "khài-daao",
      "meaning": "fried egg (sunny side up)",
      "example": "ฉันกินข้าวกับไข่ดาว",
      "audio": "friedegg.mp3"
    },
    {
      "word": "ไข่ต้ม",
      "romanization": "khài-tôm",
      "meaning": "boiled egg",
      "example": "ไข่ต้มมีโปรตีนสูง",
      "audio": "boiledegg.mp3"
    },
    {
      "word": "หมูทอด",
      "romanization": "mŭu-thâawt",
      "meaning": "fried pork",
      "example": "หมูทอดกรอบนอกนุ่มใน",
      "audio": "friedpork.mp3"
    },
    {
      "word": "ปลาทอด",
      "romanization": "bplaa-thâawt",
      "meaning": "fried fish",
      "example": "ปลาทอดอร่อยมาก",
      "audio": "friedfish.mp3"
    },
    {
      "word": "ข้าวมันไก่",
      "romanization": "khâao-man-gài",
      "meaning": "Hainanese chicken rice",
      "example": "ฉันสั่งข้าวมันไก่หนึ่งจาน",
      "audio": "chickenrice.mp3"
    },
    {
      "word": "ข้าวแกง",
      "romanization": "khâao-gaeng",
      "meaning": "rice with curry",
      "example": "ข้าวแกงมีหลายอย่างให้เลือก",
      "audio": "ricecurry.mp3"
    }
  ]
};

async function seedFoodLesson() {
  try {
    console.log('Starting to seed Thai food and drinks lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: foodLessonData.lesson_id,
      title: foodLessonData.title,
      level: foodLessonData.level,
      description: 'เรียนรู้คำศัพท์เกี่ยวกับอาหารและเครื่องดื่มภาษาไทย พร้อมตัวอย่างประโยคและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: foodLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = foodLessonData.vocab.map(async (vocabItem, index) => {
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
        let category = 'food';
        if (vocabItem.word.includes('น้ำ') || vocabItem.word.includes('กาแฟ') || vocabItem.word.includes('ชา') || vocabItem.word.includes('นม') || vocabItem.word.includes('โค้ก')) {
          category = 'drinks';
        } else if (vocabItem.word.includes('ผลไม้') || vocabItem.word.includes('ขนม') || vocabItem.word.includes('ไอศกรีม')) {
          category = 'desserts';
        } else if (vocabItem.word.includes('ข้าว') || vocabItem.word.includes('ก๋วยเตี๋ยว') || vocabItem.word.includes('ซุป')) {
          category = 'main_dishes';
        } else if (vocabItem.word.includes('ไข่') || vocabItem.word.includes('หมู') || vocabItem.word.includes('ปลา')) {
          category = 'proteins';
        }

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: category,
          difficulty: 'beginner',
          lesson_id: foodLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['food', 'drinks', 'thai-cuisine', 'restaurant', 'cooking'],
          frequency: 0,
          is_active: true
        };

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabItem.word,
            lesson_id: foodLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${foodLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${foodLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${foodLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนอาหารและเครื่องดื่ม เราได้เรียนรู้คำศัพท์เกี่ยวกับอาหารและเครื่องดื่มภาษาไทย ${foodLessonData.vocab.length} คำ พร้อมตัวอย่างประโยคและความหมาย`;
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
    console.error('Error seeding food lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedFoodLesson();
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

module.exports = { seedFoodLesson, foodLessonData };





