const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai dialogue lesson data
const dialogueLessonData = {
  "lesson_id": 18,
  "level": "Advanced",
  "title": "ฝึกสนทนาเบื้องต้น (Dialogue)",
  "dialogues": [
    {
      "situation": "เจอกันครั้งแรก / แนะนำตัว",
      "conversation": [
        {
          "role": "A",
          "sentence": "สวัสดีครับ/ค่ะ",
          "romanization": "sà-wàt-dii khráp/khâ",
          "meaning": "Hello"
        },
        {
          "role": "B",
          "sentence": "สวัสดีค่ะ/ครับ",
          "romanization": "sà-wàt-dii khâ/khráp",
          "meaning": "Hello"
        },
        {
          "role": "A",
          "sentence": "คุณชื่ออะไรครับ/คะ?",
          "romanization": "khun chûue à-rai khráp/khâ?",
          "meaning": "What's your name?"
        },
        {
          "role": "B",
          "sentence": "ผม/ฉันชื่อ John ครับ/ค่ะ",
          "romanization": "phǒm/chǎn chûue John khráp/khâ",
          "meaning": "My name is John"
        },
        {
          "role": "A",
          "sentence": "ยินดีที่ได้รู้จักครับ/ค่ะ",
          "romanization": "yin-dii thîi dâai rúu-jàk khráp/khâ",
          "meaning": "Nice to meet you"
        }
      ]
    },
    {
      "situation": "ถามสารทุกข์สุกดิบ (ทักทายทั่วไป)",
      "conversation": [
        {
          "role": "A",
          "sentence": "สบายดีไหมครับ/คะ?",
          "romanization": "sà-baai dii mái khráp/khâ?",
          "meaning": "How are you?"
        },
        {
          "role": "B",
          "sentence": "สบายดีค่ะ/ครับ แล้วคุณล่ะ?",
          "romanization": "sà-baai dii khâ/khráp láew khun lâ?",
          "meaning": "I'm fine. And you?"
        }
      ]
    },
    {
      "situation": "ขอความช่วยเหลือ",
      "conversation": [
        {
          "role": "A",
          "sentence": "ขอโทษครับ/ค่ะ ขอถามทางไปตลาดได้ไหม?",
          "romanization": "khǎaw-thôot khráp/khâ, khǎaw thǎam thaang bpai dtà-làat dâai mái?",
          "meaning": "Excuse me, can I ask the way to the market?"
        },
        {
          "role": "B",
          "sentence": "ตรงไปแล้วเลี้ยวขวาครับ/ค่ะ",
          "romanization": "dtrong bpai láew líew khwǎa khráp/khâ",
          "meaning": "Go straight and turn right"
        },
        {
          "role": "A",
          "sentence": "ขอบคุณมากครับ/ค่ะ",
          "romanization": "khàawp-khun mâak khráp/khâ",
          "meaning": "Thank you very much"
        }
      ]
    },
    {
      "situation": "สั่งอาหารที่ร้าน",
      "conversation": [
        {
          "role": "A",
          "sentence": "ขอข้าวผัดหนึ่งจานครับ/ค่ะ",
          "romanization": "khǎaw khâao phàt nèung jaan khráp/khâ",
          "meaning": "One plate of fried rice, please"
        },
        {
          "role": "B",
          "sentence": "รับอะไรเพิ่มไหมครับ/คะ?",
          "romanization": "ráp à-rai phôoem mái khráp/khâ?",
          "meaning": "Would you like anything else?"
        },
        {
          "role": "A",
          "sentence": "น้ำเปล่าหนึ่งแก้วครับ/ค่ะ",
          "romanization": "náam bplào nèung gâew khráp/khâ",
          "meaning": "A glass of water, please"
        }
      ]
    },
    {
      "situation": "ซื้อของในร้านค้า",
      "conversation": [
        {
          "role": "A",
          "sentence": "อันนี้ราคาเท่าไหร่ครับ/คะ?",
          "romanization": "an-níi raa-khaa thâo-rài khráp/khâ?",
          "meaning": "How much is this?"
        },
        {
          "role": "B",
          "sentence": "ห้าสิบบาทครับ/ค่ะ",
          "romanization": "hâa sìp bàat khráp/khâ",
          "meaning": "Fifty baht"
        },
        {
          "role": "A",
          "sentence": "ขอลดหน่อยได้ไหมครับ/คะ?",
          "romanization": "khǎaw lót nòi dâai mái khráp/khâ?",
          "meaning": "Can I get a discount?"
        },
        {
          "role": "B",
          "sentence": "ได้ค่ะ/ครับ เหลือสี่สิบบาท",
          "romanization": "dâai khâ/khráp, lǔea sìi sìp bàat",
          "meaning": "Yes, 40 baht"
        }
      ]
    },
    {
      "situation": "นัดพบเพื่อน",
      "conversation": [
        {
          "role": "A",
          "sentence": "เราจะเจอกันกี่โมงดี?",
          "romanization": "rao jà jer gan gìi moong dii?",
          "meaning": "What time should we meet?"
        },
        {
          "role": "B",
          "sentence": "สี่โมงเย็นได้ไหม?",
          "romanization": "sìi moong yen dâai mái?",
          "meaning": "Is 4 PM okay?"
        },
        {
          "role": "A",
          "sentence": "ได้เลย เจอกันที่ร้านกาแฟนะ",
          "romanization": "dâai loei, jer gan thîi ráan gaa-fae ná",
          "meaning": "Sure! See you at the coffee shop"
        }
      ]
    }
  ]
};

async function seedDialogueLesson() {
  try {
    console.log('Starting to seed Thai dialogue lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: dialogueLessonData.lesson_id,
      title: dialogueLessonData.title,
      level: dialogueLessonData.level,
      description: 'เรียนรู้การสนทนาภาษาไทยในสถานการณ์ต่างๆ พร้อมตัวอย่างบทสนทนาและเสียงอ่าน',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: dialogueLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each dialogue and create vocabulary entries
    let totalSentences = 0;
    const vocabularyPromises = [];

    for (let dialogueIndex = 0; dialogueIndex < dialogueLessonData.dialogues.length; dialogueIndex++) {
      const dialogue = dialogueLessonData.dialogues[dialogueIndex];
      console.log(`\nProcessing dialogue ${dialogueIndex + 1}: ${dialogue.situation}`);
      
      for (let sentenceIndex = 0; sentenceIndex < dialogue.conversation.length; sentenceIndex++) {
        const sentence = dialogue.conversation[sentenceIndex];
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
            const wordId = `dialogue_${dialogueIndex + 1}_${sentenceIndex + 1}_${sentence.role}`;
            
            const vocabularyData = {
              word: wordId,
              thai_word: sentence.sentence,
              romanization: sentence.romanization,
              meaning: sentence.meaning,
              example: sentence.sentence,
              category: 'dialogue',
              difficulty: 'advanced',
              lesson_id: dialogueLessonData.lesson_id,
              usage_examples: [{
                thai: sentence.sentence,
                romanization: sentence.romanization,
                english: sentence.meaning
              }],
              audio_url: thaiAudio.success ? thaiAudio.audioUrl : '',
              tags: ['dialogue', 'conversation', 'thai-language', 'advanced', `situation-${dialogueIndex + 1}`, `role-${sentence.role}`],
              frequency: 0,
              is_active: true,
              // Additional dialogue-specific fields
              dialogue_info: {
                situation: dialogue.situation,
                role: sentence.role,
                dialogue_index: dialogueIndex + 1,
                sentence_index: sentenceIndex + 1
              }
            };

            const vocabulary = await Vocabulary.findOneAndUpdate(
              { 
                word: vocabularyData.word,
                lesson_id: dialogueLessonData.lesson_id 
              },
              vocabularyData,
              { upsert: true, new: true }
            );

            console.log(`  - ${sentence.role}: ${sentence.sentence.substring(0, 30)}...`);
            
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
    console.log(`- Total dialogues: ${dialogueLessonData.dialogues.length}`);
    console.log(`- Total sentences: ${totalSentences}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${totalSentences - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนฝึกสนทนาเบื้องต้น เราได้เรียนรู้การสนทนาในสถานการณ์ต่างๆ ${dialogueLessonData.dialogues.length} สถานการณ์ รวม ${totalSentences} ประโยค พร้อมเสียงอ่าน`;
    const lessonSummaryAudio = await aiTtsService.generateThaiSpeech(lessonSummaryText, {
      voice: 'th-TH-Standard-A',
      rate: '0.9',
      emotion: 'excited'
    });

    console.log(`\nLesson summary audio generated: ${lessonSummaryAudio.success ? 'Success' : 'Failed'}`);

    return {
      lesson,
      dialogueCount: dialogueLessonData.dialogues.length,
      sentenceCount: totalSentences,
      vocabularyCount: successfulResults.length,
      audioGenerated: lessonSummaryAudio.success
    };

  } catch (error) {
    console.error('Error seeding dialogue lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedDialogueLesson();
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

module.exports = { seedDialogueLesson, dialogueLessonData };





