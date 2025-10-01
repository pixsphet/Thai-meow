const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai shopping lesson data
const shoppingLessonData = {
  "lesson_id": 12,
  "level": "Intermediate",
  "title": "การซื้อของ",
  "vocab": [
    {
      "word": "ราคาเท่าไหร่",
      "romanization": "raa-khaa thâo-rài",
      "meaning": "how much is it?",
      "example": "เสื้อตัวนี้ราคาเท่าไหร่?",
      "audio": "price.mp3"
    },
    {
      "word": "แพง",
      "romanization": "phaaeng",
      "meaning": "expensive",
      "example": "ของชิ้นนี้แพงมาก",
      "audio": "paeng.mp3"
    },
    {
      "word": "ถูก",
      "romanization": "thùuk",
      "meaning": "cheap",
      "example": "อันนี้ราคาถูก",
      "audio": "thuuk.mp3"
    },
    {
      "word": "ลดราคา",
      "romanization": "lót raa-khaa",
      "meaning": "discount",
      "example": "มีลดราคามั้ย?",
      "audio": "discount.mp3"
    },
    {
      "word": "ต่อราคา",
      "romanization": "dtàaw raa-khaa",
      "meaning": "bargain",
      "example": "ขอลดหน่อยได้ไหม? ฉันจะต่อราคา",
      "audio": "bargain.mp3"
    },
    {
      "word": "เงินสด",
      "romanization": "ngern sòt",
      "meaning": "cash",
      "example": "คุณรับเงินสดไหม?",
      "audio": "cash.mp3"
    },
    {
      "word": "บัตรเครดิต",
      "romanization": "bàt khree-dìt",
      "meaning": "credit card",
      "example": "จ่ายด้วยบัตรเครดิตได้ไหม?",
      "audio": "creditcard.mp3"
    },
    {
      "word": "ซื้อ",
      "romanization": "súue",
      "meaning": "buy",
      "example": "ฉันอยากซื้อของชิ้นนี้",
      "audio": "sue.mp3"
    },
    {
      "word": "ขาย",
      "romanization": "khǎai",
      "meaning": "sell",
      "example": "เขาขายผลไม้ที่ตลาด",
      "audio": "khaai.mp3"
    },
    {
      "word": "จ่ายเงิน",
      "romanization": "jàai ngern",
      "meaning": "pay",
      "example": "ฉันจะจ่ายเงินตอนนี้",
      "audio": "pay.mp3"
    },
    {
      "word": "ใบเสร็จ",
      "romanization": "bai-sèt",
      "meaning": "receipt",
      "example": "ขอใบเสร็จด้วยครับ",
      "audio": "receipt.mp3"
    },
    {
      "word": "ตะกร้า",
      "romanization": "tà-grâa",
      "meaning": "basket",
      "example": "ใส่ของลงในตะกร้า",
      "audio": "basket.mp3"
    },
    {
      "word": "ของ",
      "romanization": "khǎawng",
      "meaning": "thing / item",
      "example": "ฉันซื้อของจากตลาด",
      "audio": "thing.mp3"
    },
    {
      "word": "ร้านค้า",
      "romanization": "ráan-kháa",
      "meaning": "store / shop",
      "example": "ร้านค้านี้มีของหลากหลาย",
      "audio": "shop.mp3"
    }
  ]
};

async function seedShoppingLesson() {
  try {
    console.log('Starting to seed Thai shopping lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: shoppingLessonData.lesson_id,
      title: shoppingLessonData.title,
      level: shoppingLessonData.level,
      description: 'เรียนรู้คำศัพท์เกี่ยวกับการซื้อของ ภาษาไทย พร้อมตัวอย่างประโยคและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: shoppingLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = shoppingLessonData.vocab.map(async (vocabItem, index) => {
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

        // Determine category based on shopping context
        let category = 'shopping';
        if (vocabItem.word.includes('ราคา') || vocabItem.word.includes('แพง') || vocabItem.word.includes('ถูก') || vocabItem.word.includes('ลดราคา') || vocabItem.word.includes('ต่อราคา')) {
          category = 'pricing';
        } else if (vocabItem.word.includes('เงินสด') || vocabItem.word.includes('บัตรเครดิต') || vocabItem.word.includes('จ่ายเงิน') || vocabItem.word.includes('ใบเสร็จ')) {
          category = 'payment';
        } else if (vocabItem.word.includes('ซื้อ') || vocabItem.word.includes('ขาย')) {
          category = 'transaction';
        } else if (vocabItem.word.includes('ตะกร้า') || vocabItem.word.includes('ของ') || vocabItem.word.includes('ร้านค้า')) {
          category = 'shopping_items';
        }

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: category,
          difficulty: 'intermediate',
          lesson_id: shoppingLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['shopping', 'commerce', 'thai-language', 'conversation', 'money'],
          frequency: 0,
          is_active: true
        };

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabItem.word,
            lesson_id: shoppingLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${shoppingLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${shoppingLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${shoppingLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนการซื้อของ เราได้เรียนรู้คำศัพท์เกี่ยวกับการซื้อของภาษาไทย ${shoppingLessonData.vocab.length} คำ พร้อมตัวอย่างประโยคและความหมาย`;
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
    console.error('Error seeding shopping lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedShoppingLesson();
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

module.exports = { seedShoppingLesson, shoppingLessonData };





