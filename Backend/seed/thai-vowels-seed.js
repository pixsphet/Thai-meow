const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');

dotenv.config({ path: './.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/thai_meow', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedThaiVowels = async () => {
  await connectDB();

  try {
    console.log('Seeding Thai Vowels...');

    const lessonData = {
      lesson_id: 101, // Unique ID for Thai Vowels lesson
      level: 'Beginner',
      title: 'สระไทย',
      description: 'เรียนรู้สระพื้นฐาน 18 ตัว พร้อมภาพประกอบและเสียงอ่าน',
      category: 'vowel',
      order: 1, // This lesson comes second after consonants
    };

    let lesson = await Lesson.findOne({ lesson_id: lessonData.lesson_id });

    if (lesson) {
      console.log(`Lesson with lesson_id ${lessonData.lesson_id} already exists. Updating...`);
      lesson = await Lesson.findOneAndUpdate(
        { lesson_id: lessonData.lesson_id },
        lessonData,
        { new: true, upsert: true }
      );
    } else {
      lesson = new Lesson(lessonData);
      await lesson.save();
      console.log(`Lesson "${lesson.title}" added.`);
    }

    // ลบข้อมูลเก่าของสระไทยก่อน
    await Vocabulary.deleteMany({ lesson_id: lesson.lesson_id });
    // ลบข้อมูลที่มี word เป็น "ฤ" ออกด้วย
    await Vocabulary.deleteMany({ word: { $in: ['ฤ', 'ฤา', 'ฦ', 'ฦา'] } });
    console.log('Deleted existing Thai vowels data');

    const vowels = [
      { thai_word: 'ะ', romanization: 'a', meaning: 'อะ (a)', example: 'อะ', image: 'a.png', audioText: 'อะ', type: 'short' },
      { thai_word: 'า', romanization: 'aa', meaning: 'อา (aa)', example: 'อา', image: 'aa.png', audioText: 'อา', type: 'long' },
      { thai_word: 'ิ', romanization: 'i', meaning: 'อิ (i)', example: 'อิ', image: 'i.png', audioText: 'อิ', type: 'short' },
      { thai_word: 'ี', romanization: 'ii', meaning: 'อี (ii)', example: 'อี', image: 'ii.png', audioText: 'อี', type: 'long' },
      { thai_word: 'ึ', romanization: 'ue', meaning: 'อึ (ue)', example: 'อึ', image: 'ue.png', audioText: 'อึ', type: 'short' },
      { thai_word: 'ือ', romanization: 'uue', meaning: 'อือ (uue)', example: 'อือ', image: 'uue.png', audioText: 'อือ', type: 'long' },
      { thai_word: 'ุ', romanization: 'u', meaning: 'อุ (u)', example: 'อุ', image: 'u.png', audioText: 'อุ', type: 'short' },
      { thai_word: 'ู', romanization: 'uu', meaning: 'อู (uu)', example: 'อู', image: 'uu.png', audioText: 'อู', type: 'long' },
      { thai_word: 'เ', romanization: 'e', meaning: 'เอ (e)', example: 'เอ', image: 'e.png', audioText: 'เอ', type: 'short' },
      { thai_word: 'แ', romanization: 'ae', meaning: 'แอ (ae)', example: 'แอ', image: 'ae.png', audioText: 'แอ', type: 'short' },
      { thai_word: 'โ', romanization: 'o', meaning: 'โอ (o)', example: 'โอ', image: 'o.png', audioText: 'โอ', type: 'short' },
      { thai_word: 'ใ', romanization: 'ai', meaning: 'ไอ (ai)', example: 'ไอ', image: 'ai.png', audioText: 'ไอ', type: 'short' },
      { thai_word: 'ไ', romanization: 'ai', meaning: 'ไอ (ai)', example: 'ไอ', image: 'ai2.png', audioText: 'ไอ', type: 'short' },
      { thai_word: 'ำ', romanization: 'am', meaning: 'อำ (am)', example: 'อำ', image: 'am.png', audioText: 'อำ', type: 'short' },
      { thai_word: 'ฤ', romanization: 'rue', meaning: 'ฤ (rue)', example: 'ฤ', image: 'rue.png', audioText: 'ฤ', type: 'special' },
      { thai_word: 'ฤา', romanization: 'ruue', meaning: 'ฤา (ruue)', example: 'ฤา', image: 'ruue.png', audioText: 'ฤา', type: 'special' },
      { thai_word: 'ฦ', romanization: 'lue', meaning: 'ฦ (lue)', example: 'ฦ', image: 'lue.png', audioText: 'ฦ', type: 'special' },
      { thai_word: 'ฦา', romanization: 'luue', meaning: 'ฦา (luue)', example: 'ฦา', image: 'luue.png', audioText: 'ฦา', type: 'special' },
    ];

    for (let i = 0; i < vowels.length; i++) {
      const vowel = vowels[i];
      const vocabularyData = {
        lesson_id: lesson.lesson_id,
        word: vowel.thai_word,
        thai_word: vowel.thai_word,
        romanization: vowel.romanization,
        meaning: vowel.meaning,
        example: vowel.example,
        audio: vowel.audio,
        image: vowel.image,
        order: i + 1,
        category: 'vowels',
        type: vowel.type,
      };

      const vocab = new Vocabulary(vocabularyData);
      await vocab.save();
      console.log(`Vocabulary "${vowel.thai_word}" added.`);
    }

    console.log('Thai Vowels seeding complete!');
  } catch (error) {
    console.error('Error seeding Thai Vowels:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedThaiVowels();
