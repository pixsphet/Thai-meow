require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
const Lesson = require('./models/Lesson');
const VocabWord = require('./models/VocabWord');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thai-meow';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function seedFromExistingFiles() {
  console.log('🌱 Starting seed from existing files...\n');
  
  try {
    await connectDB();
    
    const seedDir = path.join(__dirname, 'seed');
    const files = fs.readdirSync(seedDir);
    
    let totalWords = 0;
    let processedFiles = 0;
    
    for (const file of files) {
      if (file.endsWith('.js') && file.startsWith('thai-')) {
        console.log(`📖 Processing file: ${file}`);
        
        try {
          // Import the seed file
          const seedFile = require(path.join(seedDir, file));
          
          // Extract lesson data
          const lessonData = seedFile.lessonData || seedFile.lesson || {};
          const vocabularyData = seedFile.vocabularyData || seedFile.vocabulary || seedFile.words || [];
          
          if (!lessonData.key || !lessonData.titleTH) {
            console.log(`⚠️ Skipping ${file} - no valid lesson data`);
            continue;
          }
          
          // Create or update lesson
          const lesson = await Lesson.findOneAndUpdate(
            { key: lessonData.key },
            {
              key: lessonData.key,
              titleTH: lessonData.titleTH,
              level: lessonData.level || 'Beginner',
              note: lessonData.note || '',
              order: lessonData.order || 0
            },
            { upsert: true, new: true }
          );
          
          console.log(`✅ Lesson: ${lesson.titleTH} (${lesson.key})`);
          
          // Process vocabulary
          if (Array.isArray(vocabularyData) && vocabularyData.length > 0) {
            let wordCount = 0;
            
            for (const word of vocabularyData) {
              if (word.thai) {
                try {
                  await VocabWord.findOneAndUpdate(
                    { thai: word.thai, lessonKey: lessonData.key },
                    {
                      thai: word.thai,
                      roman: word.roman || word.pronunciation || '',
                      en: word.en || word.english || word.meaning || '',
                      pos: word.pos || word.partOfSpeech || '',
                      lessonKey: lessonData.key,
                      level: lessonData.level || 'Beginner',
                      tags: [lessonData.key, (lessonData.level || 'Beginner').toLowerCase()],
                      exampleTH: word.exampleTH || word.example || '',
                      exampleEN: word.exampleEN || word.exampleEnglish || ''
                    },
                    { upsert: true, new: true }
                  );
                  wordCount++;
                } catch (error) {
                  console.log(`⚠️ Skipped word: ${word.thai} - ${error.message}`);
                }
              }
            }
            
            console.log(`✅ Processed ${wordCount} words from ${file}`);
            totalWords += wordCount;
          } else {
            console.log(`⚠️ No vocabulary data found in ${file}`);
          }
          
          processedFiles++;
          
        } catch (error) {
          console.log(`❌ Error processing ${file}: ${error.message}`);
        }
      }
    }
    
    // Summary
    console.log('\n📊 Seeding Summary:');
    console.log(`   Files processed: ${processedFiles}`);
    console.log(`   Total vocabulary words: ${totalWords}`);
    
    // Get final counts
    const lessonCount = await Lesson.countDocuments();
    const vocabCount = await VocabWord.countDocuments();
    
    console.log(`   Total lessons in DB: ${lessonCount}`);
    console.log(`   Total vocabulary in DB: ${vocabCount}`);
    
    console.log('\n🎉 Seeding from existing files completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the seeding
seedFromExistingFiles();
