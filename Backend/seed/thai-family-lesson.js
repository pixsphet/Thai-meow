const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai family lesson data
const familyLessonData = {
  "lesson_id": 6,
  "level": "Beginner",
  "title": "คำใช้ในครอบครัว",
  "vocab": [
    {
      "word": "พ่อ",
      "romanization": "phâaw",
      "meaning": "father",
      "example": "พ่อของฉันใจดีมาก",
      "audio": "father.mp3"
    },
    {
      "word": "แม่",
      "romanization": "mâae",
      "meaning": "mother",
      "example": "แม่ทำอาหารอร่อย",
      "audio": "mother.mp3"
    },
    {
      "word": "พี่ชาย",
      "romanization": "phîi-chaai",
      "meaning": "older brother",
      "example": "พี่ชายของฉันเรียนเก่ง",
      "audio": "older_brother.mp3"
    },
    {
      "word": "พี่สาว",
      "romanization": "phîi-sǎao",
      "meaning": "older sister",
      "example": "พี่สาวทำงานที่โรงพยาบาล",
      "audio": "older_sister.mp3"
    },
    {
      "word": "น้องชาย",
      "romanization": "náawng-chaai",
      "meaning": "younger brother",
      "example": "น้องชายชอบเล่นเกม",
      "audio": "younger_brother.mp3"
    },
    {
      "word": "น้องสาว",
      "romanization": "náawng-sǎao",
      "meaning": "younger sister",
      "example": "น้องสาวเรียนอยู่ประถม",
      "audio": "younger_sister.mp3"
    },
    {
      "word": "ลูก",
      "romanization": "lûuk",
      "meaning": "child / son or daughter",
      "example": "ฉันมีลูกสองคน",
      "audio": "child.mp3"
    },
    {
      "word": "ปู่",
      "romanization": "pùu",
      "meaning": "grandfather (father's side)",
      "example": "ปู่ชอบเล่าเรื่องเก่าๆ",
      "audio": "grandfather_paternal.mp3"
    },
    {
      "word": "ย่า",
      "romanization": "yâa",
      "meaning": "grandmother (father's side)",
      "example": "ย่าทำขนมอร่อย",
      "audio": "grandmother_paternal.mp3"
    },
    {
      "word": "ตา",
      "romanization": "taa",
      "meaning": "grandfather (mother's side)",
      "example": "ตาอยู่ต่างจังหวัด",
      "audio": "grandfather_maternal.mp3"
    },
    {
      "word": "ยาย",
      "romanization": "yaai",
      "meaning": "grandmother (mother's side)",
      "example": "ยายปลูกผักในสวน",
      "audio": "grandmother_maternal.mp3"
    },
    {
      "word": "สามี",
      "romanization": "sǎa-mii",
      "meaning": "husband",
      "example": "สามีของฉันทำงานบริษัท",
      "audio": "husband.mp3"
    },
    {
      "word": "ภรรยา",
      "romanization": "phan-rá-yaa",
      "meaning": "wife",
      "example": "ภรรยาทำอาหารอร่อยมาก",
      "audio": "wife.mp3"
    },
    {
      "word": "ลูกชาย",
      "romanization": "lûuk-chaai",
      "meaning": "son",
      "example": "ลูกชายเรียนอยู่ชั้นมัธยม",
      "audio": "son.mp3"
    },
    {
      "word": "ลูกสาว",
      "romanization": "lûuk-sǎao",
      "meaning": "daughter",
      "example": "ลูกสาวชอบอ่านหนังสือ",
      "audio": "daughter.mp3"
    },
    {
      "word": "พี่น้อง",
      "romanization": "phîi-náawng",
      "meaning": "siblings",
      "example": "พี่น้องต้องช่วยเหลือกัน",
      "audio": "siblings.mp3"
    },
    {
      "word": "ญาติ",
      "romanization": "yâat",
      "meaning": "relative",
      "example": "วันปีใหม่ฉันไปเยี่ยมญาติ",
      "audio": "relative.mp3"
    },
    {
      "word": "ครอบครัว",
      "romanization": "khrâawp-khruua",
      "meaning": "family",
      "example": "ครอบครัวของฉันอยู่พร้อมหน้า",
      "audio": "family.mp3"
    },
    {
      "word": "คู่สมรส",
      "romanization": "khûu sǒm-rót",
      "meaning": "spouse",
      "example": "คู่สมรสควรให้เกียรติกัน",
      "audio": "spouse.mp3"
    },
    {
      "word": "หลานชาย",
      "romanization": "lǎan-chaai",
      "meaning": "grandson / nephew",
      "example": "หลานชายอยู่ชั้นประถม",
      "audio": "grandson.mp3"
    },
    {
      "word": "หลานสาว",
      "romanization": "lǎan-sǎao",
      "meaning": "granddaughter / niece",
      "example": "หลานสาววาดรูปเก่ง",
      "audio": "granddaughter.mp3"
    }
  ]
};

async function seedFamilyLesson() {
  try {
    console.log('Starting to seed Thai family lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: familyLessonData.lesson_id,
      title: familyLessonData.title,
      level: familyLessonData.level,
      description: 'เรียนรู้คำศัพท์เกี่ยวกับครอบครัวและญาติพี่น้องภาษาไทย พร้อมตัวอย่างประโยคและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: familyLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = familyLessonData.vocab.map(async (vocabItem, index) => {
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
        let category = 'family';
        if (vocabItem.word.includes('พ่อ') || vocabItem.word.includes('แม่')) {
          category = 'parents';
        } else if (vocabItem.word.includes('พี่') || vocabItem.word.includes('น้อง')) {
          category = 'siblings';
        } else if (vocabItem.word.includes('ปู่') || vocabItem.word.includes('ย่า') || vocabItem.word.includes('ตา') || vocabItem.word.includes('ยาย')) {
          category = 'grandparents';
        } else if (vocabItem.word.includes('สามี') || vocabItem.word.includes('ภรรยา') || vocabItem.word.includes('คู่สมรส')) {
          category = 'spouse';
        } else if (vocabItem.word.includes('ลูก')) {
          category = 'children';
        } else if (vocabItem.word.includes('หลาน')) {
          category = 'grandchildren';
        } else if (vocabItem.word.includes('ญาติ') || vocabItem.word.includes('ครอบครัว')) {
          category = 'family_general';
        }

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: category,
          difficulty: 'beginner',
          lesson_id: familyLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['family', 'relationship', 'thai-language', 'conversation'],
          frequency: 0,
          is_active: true
        };

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabItem.word,
            lesson_id: familyLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${familyLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${familyLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${familyLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนคำใช้ในครอบครัว เราได้เรียนรู้คำศัพท์เกี่ยวกับครอบครัวและญาติพี่น้องภาษาไทย ${familyLessonData.vocab.length} คำ พร้อมตัวอย่างประโยคและความหมาย`;
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
    console.error('Error seeding family lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedFamilyLesson();
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

module.exports = { seedFamilyLesson, familyLessonData };





