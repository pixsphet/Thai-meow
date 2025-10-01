const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');
const aiTtsService = require('../services/aiTtsService');

// Thai summary and quiz lesson data
const summaryQuizLessonData = {
  "lesson_id": 19,
  "level": "Advanced",
  "title": "สรุปบทเรียน + แบบทดสอบรวม",
  "summary": [
    "บทนี้สรุปเนื้อหาสำคัญจากบทเรียนทั้งหมด เช่น พยัญชนะ สระ ตัวเลข วัน เวลา สี คำทักทาย การถาม-ตอบเบื้องต้น การซื้อของ ฯลฯ",
    "ผู้เรียนจะได้ทบทวนคำศัพท์ โครงสร้างประโยค และฝึกการใช้งานจริง"
  ],
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "คำว่า 'ขอบคุณ' ภาษาอังกฤษแปลว่าอะไร?",
      "choices": [
        { "text": "Hello", "is_correct": false },
        { "text": "Goodbye", "is_correct": false },
        { "text": "Thank you", "is_correct": true },
        { "text": "Sorry", "is_correct": false }
      ],
      "answer": "Thank you",
      "explanation": "ขอบคุณ = Thank you"
    },
    {
      "type": "fill_in_the_blank",
      "question": "เติมคำในประโยค: วันนี้เป็นวัน______ (Monday)",
      "answer": "จันทร์",
      "romanization": "jan",
      "explanation": "วันจันทร์ = Monday"
    },
    {
      "type": "translate_thai_to_eng",
      "question": "แปลประโยค: ฉันอายุยี่สิบปี",
      "answer": "I am twenty years old",
      "explanation": "ฉันอายุยี่สิบปี = I am twenty years old"
    },
    {
      "type": "match",
      "question": "จับคู่คำศัพท์กับความหมาย",
      "pairs": [
        { "thai": "แดง", "eng": "Red" },
        { "thai": "แม่", "eng": "Mother" },
        { "thai": "กิน", "eng": "Eat" },
        { "thai": "บ้าน", "eng": "House" }
      ]
    },
    {
      "type": "multiple_choice",
      "question": "ถ้าต้องการถาม 'What time is it?' ในภาษาไทย ควรถามว่าอะไร?",
      "choices": [
        { "text": "คุณชื่ออะไร", "is_correct": false },
        { "text": "กี่โมง", "is_correct": true },
        { "text": "คุณอยู่ที่ไหน", "is_correct": false },
        { "text": "คุณสบายดีไหม", "is_correct": false }
      ],
      "answer": "กี่โมง",
      "explanation": "What time is it? = กี่โมง"
    },
    {
      "type": "fill_in_the_blank",
      "question": "เติมคำในประโยค: ______ มีห้าสิบบาท (He has fifty baht)",
      "answer": "เขา",
      "romanization": "khǎo",
      "explanation": "เขา = He/She"
    },
    {
      "type": "translate_eng_to_thai",
      "question": "แปลเป็นไทย: See you again",
      "answer": "พบกันใหม่",
      "romanization": "phóp gan mài",
      "explanation": "See you again = พบกันใหม่"
    },
    {
      "type": "sentence_order",
      "question": "เรียงประโยคต่อไปนี้ให้ถูกต้อง: 1. สวัสดี 2. ครับ 3. ค่ะ",
      "correct_order": ["สวัสดี", "ครับ/ค่ะ"],
      "explanation": "คำทักทายที่ถูกต้อง คือ สวัสดีครับ/ค่ะ"
    }
  ],
  "note": "ครูหรือผู้สอนสามารถเพิ่ม/ปรับแบบทดสอบได้เอง เพื่อให้เหมาะสมกับผู้เรียนแต่ละกลุ่ม"
};

async function seedSummaryQuizLesson() {
  try {
    console.log('Starting to seed Thai summary and quiz lesson...');

    // Create or update the lesson
    const lessonData = {
      lesson_id: summaryQuizLessonData.lesson_id,
      title: summaryQuizLessonData.title,
      level: summaryQuizLessonData.level,
      description: 'สรุปบทเรียนและแบบทดสอบรวม ครอบคลุมเนื้อหาจากบทเรียนทั้งหมด พร้อมแบบทดสอบหลากหลายรูปแบบ',
      progress: 0,
      is_completed: false
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lesson_id: summaryQuizLessonData.lesson_id },
      lessonData,
      { upsert: true, new: true }
    );

    console.log(`Lesson created/updated: ${lesson.title} (ID: ${lesson._id})`);

    // Process each quiz question and create vocabulary entries
    let totalQuestions = summaryQuizLessonData.quiz.length;
    const vocabularyPromises = [];

    for (let questionIndex = 0; questionIndex < summaryQuizLessonData.quiz.length; questionIndex++) {
      const question = summaryQuizLessonData.quiz[questionIndex];
      console.log(`\nProcessing question ${questionIndex + 1}: ${question.type}`);
      
      const promise = (async () => {
        try {
          // Generate AI TTS audio for the question
          const questionAudio = await aiTtsService.generateThaiSpeech(question.question, {
            voice: 'th-TH-Standard-A',
            rate: '0.8',
            emotion: 'neutral'
          });

          // Generate AI TTS audio for the answer/explanation
          let answerText = '';
          if (question.answer) {
            answerText = question.answer;
          } else if (question.correct_order) {
            answerText = question.correct_order.join(' ');
          } else if (question.pairs) {
            answerText = question.pairs.map(pair => `${pair.thai} = ${pair.eng}`).join(', ');
          }

          const answerAudio = await aiTtsService.generateThaiSpeech(answerText, {
            voice: 'th-TH-Standard-A',
            rate: '0.8',
            emotion: 'excited'
          });

          // Create a unique word identifier for each question
          const wordId = `quiz_${questionIndex + 1}_${question.type}`;
          
          const vocabularyData = {
            word: wordId,
            thai_word: question.question,
            romanization: question.romanization || '',
            meaning: answerText,
            example: question.explanation || '',
            category: 'quiz',
            difficulty: 'advanced',
            lesson_id: summaryQuizLessonData.lesson_id,
            usage_examples: [{
              thai: question.question,
              romanization: question.romanization || '',
              english: answerText
            }],
            audio_url: questionAudio.success ? questionAudio.audioUrl : '',
            tags: ['quiz', 'test', 'summary', 'thai-language', 'advanced', `type-${question.type}`],
            frequency: 0,
            is_active: true,
            // Additional quiz-specific fields
            quiz_info: {
              type: question.type,
              question_index: questionIndex + 1,
              choices: question.choices || null,
              pairs: question.pairs || null,
              correct_order: question.correct_order || null,
              explanation: question.explanation || ''
            }
          };

          const vocabulary = await Vocabulary.findOneAndUpdate(
            { 
              word: vocabularyData.word,
              lesson_id: summaryQuizLessonData.lesson_id 
            },
            vocabularyData,
            { upsert: true, new: true }
          );

          console.log(`  - ${question.type}: ${question.question.substring(0, 50)}...`);
          
          return {
            vocabulary,
            audio: {
              question: questionAudio,
              answer: answerAudio
            }
          };
        } catch (error) {
          console.error(`Error processing question ${question.question}:`, error);
          return null;
        }
      })();

      vocabularyPromises.push(promise);
    }

    // Add summary entries
    for (let summaryIndex = 0; summaryIndex < summaryQuizLessonData.summary.length; summaryIndex++) {
      const summaryText = summaryQuizLessonData.summary[summaryIndex];
      
      const promise = (async () => {
        try {
          // Generate AI TTS audio for the summary
          const summaryAudio = await aiTtsService.generateThaiSpeech(summaryText, {
            voice: 'th-TH-Standard-A',
            rate: '0.8',
            emotion: 'neutral'
          });

          const wordId = `summary_${summaryIndex + 1}`;
          
          const vocabularyData = {
            word: wordId,
            thai_word: summaryText,
            romanization: '',
            meaning: 'Summary of lesson content',
            example: summaryText,
            category: 'summary',
            difficulty: 'advanced',
            lesson_id: summaryQuizLessonData.lesson_id,
            usage_examples: [{
              thai: summaryText,
              romanization: '',
              english: 'Summary of lesson content'
            }],
            audio_url: summaryAudio.success ? summaryAudio.audioUrl : '',
            tags: ['summary', 'overview', 'thai-language', 'advanced'],
            frequency: 0,
            is_active: true,
            quiz_info: {
              type: 'summary',
              summary_index: summaryIndex + 1
            }
          };

          const vocabulary = await Vocabulary.findOneAndUpdate(
            { 
              word: vocabularyData.word,
              lesson_id: summaryQuizLessonData.lesson_id 
            },
            vocabularyData,
            { upsert: true, new: true }
          );

          console.log(`  - Summary ${summaryIndex + 1}: ${summaryText.substring(0, 50)}...`);
          
          return {
            vocabulary,
            audio: {
              summary: summaryAudio
            }
          };
        } catch (error) {
          console.error(`Error processing summary ${summaryText}:`, error);
          return null;
        }
      })();

      vocabularyPromises.push(promise);
    }

    const results = await Promise.all(vocabularyPromises);
    const successfulResults = results.filter(result => result !== null);

    console.log(`\nSeeding completed!`);
    console.log(`- Lesson: ${lesson.title}`);
    console.log(`- Total quiz questions: ${totalQuestions}`);
    console.log(`- Total summary items: ${summaryQuizLessonData.summary.length}`);
    console.log(`- Successfully processed: ${successfulResults.length}`);
    console.log(`- Failed: ${vocabularyPromises.length - successfulResults.length}`);

    // Generate lesson summary audio
    const lessonSummaryText = `ยินดีต้อนรับสู่บทเรียนสรุปและแบบทดสอบรวม เราได้รวบรวมเนื้อหาสำคัญจากบทเรียนทั้งหมด ${totalQuestions} คำถาม และ ${summaryQuizLessonData.summary.length} สรุป พร้อมเสียงอ่าน`;
    const lessonSummaryAudio = await aiTtsService.generateThaiSpeech(lessonSummaryText, {
      voice: 'th-TH-Standard-A',
      rate: '0.9',
      emotion: 'excited'
    });

    console.log(`\nLesson summary audio generated: ${lessonSummaryAudio.success ? 'Success' : 'Failed'}`);

    return {
      lesson,
      quizCount: totalQuestions,
      summaryCount: summaryQuizLessonData.summary.length,
      vocabularyCount: successfulResults.length,
      audioGenerated: lessonSummaryAudio.success
    };

  } catch (error) {
    console.error('Error seeding summary and quiz lesson:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      return seedSummaryQuizLesson();
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

module.exports = { seedSummaryQuizLesson, summaryQuizLessonData };





