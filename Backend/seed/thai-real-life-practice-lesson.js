const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai real-life practice lesson data
const realLifePracticeLessonData = {
  "lesson_id": 20,
  "level": "Advanced",
  "title": "แบบฝึกประโยคจากชีวิตจริง",
  "description": "ฝึกการใช้ประโยคภาษาไทยในสถานการณ์จริง เช่น ซื้อของ เดินทาง ถามทาง สั่งอาหาร ทักทาย ฯลฯ",
  "scenarios": [
    {
      "situation": "ซื้อของในร้านสะดวกซื้อ",
      "dialogue": [
        {
          "speaker": "A",
          "sentence": "ขอโทษค่ะ น้ำเปล่าอยู่ตรงไหนคะ?",
          "romanization": "khǎaw-thôot khâ, náam bplào yùu dtrong-năi khá?",
          "meaning": "Excuse me, where is the bottled water?"
        },
        {
          "speaker": "B",
          "sentence": "อยู่ชั้นสองทางขวามือครับ",
          "romanization": "yùu chán sǎawng thaang kwǎa mue khráp",
          "meaning": "It's on the second shelf on your right."
        }
      ]
    },
    {
      "situation": "ถามทาง",
      "dialogue": [
        {
          "speaker": "A",
          "sentence": "ไป MRT สถานีนี้ไปทางไหนครับ?",
          "romanization": "bpai MRT sà-thǎa-nii níi bpai thaang năi khráp?",
          "meaning": "How do I get to this MRT station?"
        },
        {
          "speaker": "B",
          "sentence": "เดินตรงไปแล้วเลี้ยวซ้ายค่ะ",
          "romanization": "dern dtrong bpai láew líew sáai khâ",
          "meaning": "Go straight and then turn left."
        }
      ]
    },
    {
      "situation": "สั่งอาหารที่ร้านอาหาร",
      "dialogue": [
        {
          "speaker": "A",
          "sentence": "ขอข้าวผัดหนึ่งจานกับน้ำส้มหนึ่งแก้วครับ",
          "romanization": "khǎaw khâao-phàt nèung jaan gàp náam-sôm nèung gâew khráp",
          "meaning": "I'd like one plate of fried rice and one glass of orange juice."
        },
        {
          "speaker": "B",
          "sentence": "รับอะไรเพิ่มอีกไหมคะ?",
          "romanization": "ráp à-rai phôoem èek mái khá?",
          "meaning": "Would you like anything else?"
        },
        {
          "speaker": "A",
          "sentence": "ไม่แล้วครับ ขอบคุณครับ",
          "romanization": "mâi láew khráp, khàawp-khun khráp",
          "meaning": "No, that's all. Thank you."
        }
      ]
    },
    {
      "situation": "ทักทายและแนะนำตัว",
      "dialogue": [
        {
          "speaker": "A",
          "sentence": "สวัสดีครับ ผมชื่อไมค์",
          "romanization": "sà-wàt-dii khráp, phǒm chûue Mike",
          "meaning": "Hello, my name is Mike."
        },
        {
          "speaker": "B",
          "sentence": "ยินดีที่ได้รู้จักค่ะ",
          "romanization": "yin-dii thîi dâai rúu-jàk khâ",
          "meaning": "Nice to meet you."
        }
      ]
    },
    {
      "situation": "นัดพบกับเพื่อน",
      "dialogue": [
        {
          "speaker": "A",
          "sentence": "เจอกันที่ห้างบ่ายสองนะ",
          "romanization": "jer gan thîi hâang bàai sǎawng ná",
          "meaning": "See you at the mall at 2 pm."
        },
        {
          "speaker": "B",
          "sentence": "โอเค เจอกัน!",
          "romanization": "oh-kay, jer gan!",
          "meaning": "Okay, see you!"
        }
      ]
    },
    {
      "situation": "เรียกแท็กซี่",
      "dialogue": [
        {
          "speaker": "A",
          "sentence": "ไปสนามบินสุวรรณภูมิครับ",
          "romanization": "bpai sà-nǎam-bin Suwannaphum khráp",
          "meaning": "To Suvarnabhumi Airport, please."
        },
        {
          "speaker": "B",
          "sentence": "ได้ค่ะ ขึ้นรถเลยค่ะ",
          "romanization": "dâi khâ, khûen rót loei khâ",
          "meaning": "Sure, please get in."
        }
      ]
    },
    {
      "situation": "ขอความช่วยเหลือ",
      "dialogue": [
        {
          "speaker": "A",
          "sentence": "ช่วยด้วย! กระเป๋าหายครับ",
          "romanization": "chûai dûai! grà-bpǎo hǎai khráp",
          "meaning": "Help! My bag is missing."
        },
        {
          "speaker": "B",
          "sentence": "ใจเย็น ๆ เดี๋ยวช่วยตามให้นะคะ",
          "romanization": "jai-yen jai-yen, dĕeow chûai taam hâi ná khâ",
          "meaning": "Calm down, I'll help you find it."
        }
      ]
    }
  ],
  "note": "สามารถเพิ่มเติมสถานการณ์ในชีวิตประจำวันหรือประโยคที่พบเจอบ่อย ๆ ได้ตามความเหมาะสม"
};

async function seedRealLifePracticeLesson() {
  try {
    console.log('Starting to seed Thai real-life practice lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: realLifePracticeLessonData.lesson_id,
      title: realLifePracticeLessonData.title,
      level: realLifePracticeLessonData.level,
      description: realLifePracticeLessonData.description,
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: realLifePracticeLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each scenario and create vocabulary entries
    let totalSentences = 0;
    const vocabularyPromises = [];

    for (let scenarioIndex = 0; scenarioIndex < realLifePracticeLessonData.scenarios.length; scenarioIndex++) {
      const scenario = realLifePracticeLessonData.scenarios[scenarioIndex];
      console.log(`\nProcessing scenario ${scenarioIndex + 1}: ${scenario.situation}`);
      
      for (let sentenceIndex = 0; sentenceIndex < scenario.dialogue.length; sentenceIndex++) {
        const sentence = scenario.dialogue[sentenceIndex];
        totalSentences++;

        const promise = (async () => {
          try {
            // Generate AI TTS audio for the Thai sentence
            const thaiAudio = await aiTtsService.generateThaiSpeech(sentence.sentence, {
              voice: 'th-TH-Standard-A',
              rate: '0.8',
              emotion: 'neutral'
            });

            // Generate AI TTS audio for the meaning
            const meaningAudio = await aiTtsService.generateThaiSpeech(sentence.meaning, {
              voice: 'th-TH-Standard-B',
              rate: '1.0',
              emotion: 'neutral'
            });

            // Create a unique word identifier for each sentence
            const wordId = `reallife_${scenarioIndex + 1}_${sentenceIndex + 1}_${sentence.speaker}`;
            
            const vocabularyData = {
              word: wordId,
              thai_word: sentence.sentence,
              romanization: sentence.romanization,
              meaning: sentence.meaning,
              example: sentence.sentence,
              category: 'real_life_practice',
              difficulty: 'advanced',
              lesson_id: realLifePracticeLessonData.lesson_id,
              usage_examples: [{
                thai: sentence.sentence,
                romanization: sentence.romanization,
                english: sentence.meaning
              }],
              audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
              tags: ['real-life', 'practice', 'conversation', 'thai-language', 'advanced', `scenario-${scenarioIndex + 1}`, `speaker-${sentence.speaker}`],
              frequency: 0,
              is_active: true,
              // Additional real-life practice specific fields
              practice_info: {
                situation: scenario.situation,
                speaker: sentence.speaker,
                scenario_index: scenarioIndex + 1,
                sentence_index: sentenceIndex + 1
              }
            };

            const vocabulary = await Vocabulary.findOneAndUpdate(
              { 
                word: vocabularyData.word,
                lesson_id: realLifePracticeLessonData.lesson_id 
              },
              vocabularyData,
              { upsert: true, new: true }
            );

            console.log(`  - ${sentence.speaker}: ${sentence.sentence.substring(0, 40)}...`);
            
            return {
              vocabulary,
              audio: {
                thai: thaiAudio,
                meaning: meaningAudio
              }
            };
          } catch (error) {
            console.error(`Error processing sentence ${sentence.sentence}:`, error);
            return null;
          }
        })();

        vocabularyPromises.push(promise);
      }
    }

    const results = await Promise.all(vocabularyPromises);
    const successfulResults = results.filter(result => result !== null);

    console.log(`\nSeeding completed!`);
    console.log(`- Lesson: ${lesson.title}`);
    console.log(`- Total scenarios: ${realLifePracticeLessonData.scenarios.length}`);
    console.log(`- Total sentences: ${totalSentences}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${totalSentences - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนแบบฝึกประโยคจากชีวิตจริง เราได้เรียนรู้การสนทนาในสถานการณ์จริง ${realLifePracticeLessonData.scenarios.length} สถานการณ์ รวม ${totalSentences} ประโยค พร้อมเสียงอ่าน`;
    const lessonSummaryAudio = await aiTtsService.generateThaiSpeech(lessonSummaryText, {
      voice: 'th-TH-Standard-A',
      rate: '0.9',
      emotion: 'excited'
    });

    console.log(`\nLesson summary audio generated: ${lessonSummaryAudio.success ? 'Success' : 'Failed'}`);

    return {
      lesson,
      scenarioCount: realLifePracticeLessonData.scenarios.length,
      sentenceCount: totalSentences,
      vocabularyCount: successfulResults.length,
      audioGenerated: lessonSummaryAudio.success
    };

  } catch (error) {
    console.error('Error seeding real-life practice lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedRealLifePracticeLesson();
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

module.exports = { seedRealLifePracticeLesson, realLifePracticeLessonData };





