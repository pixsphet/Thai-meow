const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai places lesson data
const placesLessonData = {
  "lesson_id": 10,
  "level": "Beginner",
  "title": "สถานที่",
  "vocab": [
    {
      "word": "บ้าน",
      "romanization": "bâan",
      "meaning": "home / house",
      "example": "ฉันอยู่ที่บ้าน",
      "audio": "baan.mp3"
    },
    {
      "word": "โรงเรียน",
      "romanization": "roong-rian",
      "meaning": "school",
      "example": "เด็กไปโรงเรียนทุกเช้า",
      "audio": "school.mp3"
    },
    {
      "word": "ตลาด",
      "romanization": "tà-làat",
      "meaning": "market",
      "example": "แม่ไปตลาดทุกวัน",
      "audio": "market.mp3"
    },
    {
      "word": "ห้างสรรพสินค้า",
      "romanization": "hâang sàp-pa-sǐn-kháa",
      "meaning": "shopping mall",
      "example": "เราจะไปห้างตอนเย็น",
      "audio": "mall.mp3"
    },
    {
      "word": "ร้านอาหาร",
      "romanization": "ráan aa-hǎan",
      "meaning": "restaurant",
      "example": "เขาชอบไปร้านอาหารญี่ปุ่น",
      "audio": "restaurant.mp3"
    },
    {
      "word": "โรงพยาบาล",
      "romanization": "roong phá-yaa-baan",
      "meaning": "hospital",
      "example": "แม่ไปโรงพยาบาลเพื่อตรวจสุขภาพ",
      "audio": "hospital.mp3"
    },
    {
      "word": "สวนสาธารณะ",
      "romanization": "sǔan sǎa-thaa-rá-ná",
      "meaning": "public park",
      "example": "เราวิ่งที่สวนสาธารณะ",
      "audio": "park.mp3"
    },
    {
      "word": "วัด",
      "romanization": "wát",
      "meaning": "temple",
      "example": "ครอบครัวไปวัดวันอาทิตย์",
      "audio": "temple.mp3"
    },
    {
      "word": "สนามบิน",
      "romanization": "sà-nǎam-bin",
      "meaning": "airport",
      "example": "พ่อเดินทางจากสนามบินดอนเมือง",
      "audio": "airport.mp3"
    },
    {
      "word": "สถานีตำรวจ",
      "romanization": "sà-thǎa-nii tam-rùat",
      "meaning": "police station",
      "example": "เขาไปแจ้งความที่สถานีตำรวจ",
      "audio": "police.mp3"
    },
    {
      "word": "โรงแรม",
      "romanization": "roong-raem",
      "meaning": "hotel",
      "example": "เราพักที่โรงแรมริมทะเล",
      "audio": "hotel.mp3"
    },
    {
      "word": "มหาวิทยาลัย",
      "romanization": "má-hǎa-wít-thá-yaa-lai",
      "meaning": "university",
      "example": "พี่ชายเรียนที่มหาวิทยาลัยเชียงใหม่",
      "audio": "university.mp3"
    }
  ]
};

async function seedPlacesLesson() {
  try {
    console.log('Starting to seed Thai places lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: placesLessonData.lesson_id,
      title: placesLessonData.title,
      level: placesLessonData.level,
      description: 'เรียนรู้คำศัพท์เกี่ยวกับสถานที่ต่างๆ ภาษาไทย พร้อมตัวอย่างประโยคและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: placesLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = placesLessonData.vocab.map(async (vocabItem, index) => {
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

        // Determine category based on place type
        let category = 'places';
        if (vocabItem.word.includes('บ้าน')) {
          category = 'residential';
        } else if (vocabItem.word.includes('โรงเรียน') || vocabItem.word.includes('มหาวิทยาลัย')) {
          category = 'educational';
        } else if (vocabItem.word.includes('ตลาด') || vocabItem.word.includes('ห้างสรรพสินค้า') || vocabItem.word.includes('ร้านอาหาร')) {
          category = 'commercial';
        } else if (vocabItem.word.includes('โรงพยาบาล') || vocabItem.word.includes('สถานีตำรวจ')) {
          category = 'public_services';
        } else if (vocabItem.word.includes('สวนสาธารณะ') || vocabItem.word.includes('วัด')) {
          category = 'recreational';
        } else if (vocabItem.word.includes('สนามบิน') || vocabItem.word.includes('โรงแรม')) {
          category = 'transportation_tourism';
        }

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: category,
          difficulty: 'beginner',
          lesson_id: placesLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['places', 'location', 'thai-language', 'navigation'],
          frequency: 0,
          is_active: true
        };

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabItem.word,
            lesson_id: placesLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${placesLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${placesLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${placesLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนสถานที่ เราได้เรียนรู้คำศัพท์เกี่ยวกับสถานที่ต่างๆ ภาษาไทย ${placesLessonData.vocab.length} สถานที่ พร้อมตัวอย่างประโยคและความหมาย`;
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
    console.error('Error seeding places lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedPlacesLesson();
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

module.exports = { seedPlacesLesson, placesLessonData };





