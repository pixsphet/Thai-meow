const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai time and calendar lesson data
const timeLessonData = {
  "lesson_id": 5,
  "level": "Beginner",
  "title": "วัน เวลา และเดือน",
  "vocab": [
    {
      "word": "วันจันทร์",
      "romanization": "wan jan",
      "meaning": "Monday",
      "example": "วันนี้คือวันจันทร์",
      "audio": "wan_jan.mp3"
    },
    {
      "word": "วันอังคาร",
      "romanization": "wan ang-khaan",
      "meaning": "Tuesday",
      "example": "พรุ่งนี้วันอังคาร",
      "audio": "wan_angkhan.mp3"
    },
    {
      "word": "วันพุธ",
      "romanization": "wan phút",
      "meaning": "Wednesday",
      "example": "ฉันมีเรียนวันพุธ",
      "audio": "wan_phut.mp3"
    },
    {
      "word": "วันพฤหัสบดี",
      "romanization": "wan phá-rúe-hàt-sà-baw-dii",
      "meaning": "Thursday",
      "example": "วันพฤหัสบดีเป็นวันที่สี่ของสัปดาห์",
      "audio": "wan_pharuehat.mp3"
    },
    {
      "word": "วันศุกร์",
      "romanization": "wan sùk",
      "meaning": "Friday",
      "example": "วันศุกร์ฉันไปเที่ยว",
      "audio": "wan_suk.mp3"
    },
    {
      "word": "วันเสาร์",
      "romanization": "wan sǎo",
      "meaning": "Saturday",
      "example": "วันเสาร์ฉันพักผ่อน",
      "audio": "wan_sao.mp3"
    },
    {
      "word": "วันอาทิตย์",
      "romanization": "wan aa-thít",
      "meaning": "Sunday",
      "example": "วันอาทิตย์คือวันหยุด",
      "audio": "wan_athit.mp3"
    },
    {
      "word": "เวลา",
      "romanization": "wee-laa",
      "meaning": "time",
      "example": "ตอนนี้เวลาเท่าไหร่?",
      "audio": "welaa.mp3"
    },
    {
      "word": "กี่โมง",
      "romanization": "gìi moong",
      "meaning": "what time?",
      "example": "ตอนนี้กี่โมง?",
      "audio": "gee_moong.mp3"
    },
    {
      "word": "โมงเช้า",
      "romanization": "moong cháo",
      "meaning": "AM (morning hours)",
      "example": "แปดโมงเช้า",
      "audio": "morning.mp3"
    },
    {
      "word": "บ่าย",
      "romanization": "bàai",
      "meaning": "afternoon",
      "example": "บ่ายสามโมง",
      "audio": "baai.mp3"
    },
    {
      "word": "ทุ่ม",
      "romanization": "thûm",
      "meaning": "PM (evening hours)",
      "example": "สองทุ่ม",
      "audio": "thum.mp3"
    },
    {
      "word": "นาฬิกา",
      "romanization": "naa-lí-gaa",
      "meaning": "o'clock / clock",
      "example": "หกนาฬิกา",
      "audio": "naliga.mp3"
    },
    {
      "word": "เช้า",
      "romanization": "cháo",
      "meaning": "morning",
      "example": "ฉันตื่นเช้า",
      "audio": "chao.mp3"
    },
    {
      "word": "กลางวัน",
      "romanization": "glaang-wan",
      "meaning": "noon / daytime",
      "example": "กลางวันอากาศร้อน",
      "audio": "noon.mp3"
    },
    {
      "word": "เย็น",
      "romanization": "yen",
      "meaning": "evening",
      "example": "ตอนเย็นฉันออกกำลังกาย",
      "audio": "yen.mp3"
    },
    {
      "word": "กลางคืน",
      "romanization": "glaang-khuuen",
      "meaning": "night",
      "example": "กลางคืนเงียบมาก",
      "audio": "night.mp3"
    },
    {
      "word": "เดือนมกราคม",
      "romanization": "duean má-gà-raa-khom",
      "meaning": "January",
      "example": "เดือนมกราคมเป็นต้นปี",
      "audio": "jan.mp3"
    },
    {
      "word": "เดือนกุมภาพันธ์",
      "romanization": "duean gum-paa-pan",
      "meaning": "February",
      "example": "กุมภาพันธ์มี 28 วัน",
      "audio": "feb.mp3"
    },
    {
      "word": "เดือนมีนาคม",
      "romanization": "duean mii-naa-khom",
      "meaning": "March",
      "example": "มีนาคมอากาศร้อน",
      "audio": "mar.mp3"
    },
    {
      "word": "เดือนเมษายน",
      "romanization": "duean mee-sǎa-yon",
      "meaning": "April",
      "example": "สงกรานต์อยู่ในเดือนเมษายน",
      "audio": "apr.mp3"
    },
    {
      "word": "เดือนพฤษภาคม",
      "romanization": "duean phrút-sà-paa-khom",
      "meaning": "May",
      "example": "พฤษภาคมมีวันแรงงาน",
      "audio": "may.mp3"
    },
    {
      "word": "เดือนมิถุนายน",
      "romanization": "duean mí-thù-naa-yon",
      "meaning": "June",
      "example": "มิถุนายนเริ่มฝนตก",
      "audio": "jun.mp3"
    },
    {
      "word": "เดือนกรกฎาคม",
      "romanization": "duean gà-rá-gà-daa-khom",
      "meaning": "July",
      "example": "เดือนกรกฎาคมฝนชุก",
      "audio": "jul.mp3"
    },
    {
      "word": "เดือนสิงหาคม",
      "romanization": "duean sǐng-hǎa-khom",
      "meaning": "August",
      "example": "สิงหาคมมีวันแม่",
      "audio": "aug.mp3"
    },
    {
      "word": "เดือนกันยายน",
      "romanization": "duean gan-yaa-yon",
      "meaning": "September",
      "example": "กันยายนเปิดเทอม",
      "audio": "sep.mp3"
    },
    {
      "word": "เดือนตุลาคม",
      "romanization": "duean dtù-laa-khom",
      "meaning": "October",
      "example": "ตุลาคมมีอากาศเย็น",
      "audio": "oct.mp3"
    },
    {
      "word": "เดือนพฤศจิกายน",
      "romanization": "duean phrúed-sà-jì-gaa-yon",
      "meaning": "November",
      "example": "ลอยกระทงอยู่ในเดือนพฤศจิกายน",
      "audio": "nov.mp3"
    },
    {
      "word": "เดือนธันวาคม",
      "romanization": "duean than-waa-khom",
      "meaning": "December",
      "example": "ธันวาคมมีวันคริสต์มาส",
      "audio": "dec.mp3"
    }
  ]
};

async function seedTimeLesson() {
  try {
    console.log('Starting to seed Thai time and calendar lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: timeLessonData.lesson_id,
      title: timeLessonData.title,
      level: timeLessonData.level,
      description: 'เรียนรู้วัน เวลา และเดือนภาษาไทย พร้อมตัวอย่างประโยคและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: timeLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each vocabulary item
    const vocabularyPromises = timeLessonData.vocab.map(async (vocabItem, index) => {
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
        let category = 'time';
        if (vocabItem.word.includes('วัน') && !vocabItem.word.includes('เดือน')) {
          category = 'days';
        } else if (vocabItem.word.includes('เดือน')) {
          category = 'months';
        } else if (vocabItem.word.includes('เวลา') || vocabItem.word.includes('โมง') || vocabItem.word.includes('ทุ่ม') || vocabItem.word.includes('นาฬิกา')) {
          category = 'time_expressions';
        } else if (vocabItem.word.includes('เช้า') || vocabItem.word.includes('บ่าย') || vocabItem.word.includes('เย็น') || vocabItem.word.includes('กลางวัน') || vocabItem.word.includes('กลางคืน')) {
          category = 'time_periods';
        }

        const vocabularyData = {
          word: vocabItem.word,
          thai_word: vocabItem.word,
          romanization: vocabItem.romanization,
          meaning: vocabItem.meaning,
          example: vocabItem.example,
          category: category,
          difficulty: 'beginner',
          lesson_id: timeLessonData.lesson_id,
          usage_examples: [{
            thai: vocabItem.example,
            romanization: vocabItem.romanization,
            english: vocabItem.meaning
          }],
          audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
          tags: ['time', 'calendar', 'days', 'months', 'thai-language'],
          frequency: 0,
          is_active: true
        };

        const vocabulary = await Vocabulary.findOneAndUpdate(
          { 
            word: vocabItem.word,
            lesson_id: timeLessonData.lesson_id 
          },
          vocabularyData,
          { upsert: true, new: true }
        );

        console.log(`Vocabulary ${index + 1}/${timeLessonData.vocab.length}: ${vocabItem.word} - ${vocabItem.meaning}`);
        
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
    console.log(`- Total vocabulary items: ${timeLessonData.vocab.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${timeLessonData.vocab.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนวัน เวลา และเดือน เราได้เรียนรู้วัน เวลา และเดือนภาษาไทย ${timeLessonData.vocab.length} คำ พร้อมตัวอย่างประโยคและความหมาย`;
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
    console.error('Error seeding time lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedTimeLesson();
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

module.exports = { seedTimeLesson, timeLessonData };





