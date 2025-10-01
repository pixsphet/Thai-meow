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

const seedThaiTones = async () => {
  await connectDB();

  try {
    console.log('Seeding Thai Tones...');

    const lessonData = {
      lesson_id: 102, // Unique ID for Thai Tones lesson
      level: 'Beginner',
      title: 'วรรณยุกต์ไทย',
      description: 'เรียนรู้วรรณยุกต์ 4 รูป 5 เสียง พร้อมภาพประกอบและเสียงอ่าน',
      category: 'tones',
      order: 2, // This lesson comes third after consonants and vowels
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

    // ลบข้อมูลเก่าของวรรณยุกต์ก่อน
    await Vocabulary.deleteMany({ lesson_id: lesson.lesson_id });
    console.log('Deleted existing Thai tones data');

    const tones = [
      { thai_word: '่', romanization: 'mai ek', meaning: 'ไม้เอก (low tone)', example: 'ก่า', image: 'mai_ek.png', audioText: 'ไม้เอก', tone: 'low' },
      { thai_word: '้', romanization: 'mai tho', meaning: 'ไม้โท (falling tone)', example: 'ก้า', image: 'mai_tho.png', audioText: 'ไม้โท', tone: 'falling' },
      { thai_word: '๊', romanization: 'mai tri', meaning: 'ไม้ตรี (high tone)', example: 'ก๊า', image: 'mai_tri.png', audioText: 'ไม้ตรี', tone: 'high' },
      { thai_word: '๋', romanization: 'mai chattawa', meaning: 'ไม้จัตวา (rising tone)', example: 'ก๋า', image: 'mai_chattawa.png', audioText: 'ไม้จัตวา', tone: 'rising' },
    ];

    for (let i = 0; i < tones.length; i++) {
      const tone = tones[i];
      const vocabularyData = {
        lesson_id: lesson.lesson_id,
        word: tone.thai_word,
        thai_word: tone.thai_word,
        romanization: tone.romanization,
        meaning: tone.meaning,
        example: tone.example,
        audio: tone.audio,
        image: tone.image,
        order: i + 1,
        category: 'tones',
        tone: tone.tone,
      };

      const vocab = new Vocabulary(vocabularyData);
      await vocab.save();
      console.log(`Vocabulary "${tone.thai_word}" added.`);
    }

    console.log('Thai Tones seeding complete!');
  } catch (error) {
    console.error('Error seeding Thai Tones:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedThaiTones();
