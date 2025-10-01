require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
const Lesson = require('./models/Lesson');
const VocabWord = require('./models/VocabWord');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thai-meow';

// Lesson data
const lessonsData = [
  { order: 1, key: "consonants_basic", titleTH: "พยัญชนะพื้นฐาน", level: "Beginner", note: "ก-ฮ" },
  { order: 2, key: "vowels_basic", titleTH: "สระพื้นฐาน", level: "Beginner", note: "อา-อู" },
  { order: 3, key: "tones", titleTH: "วรรณยุกต์", level: "Beginner", note: "เสียง 5 เสียง" },
  { order: 4, key: "greetings", titleTH: "การทักทาย", level: "Beginner", note: "สวัสดี, ขอบคุณ" },
  { order: 5, key: "family", titleTH: "ครอบครัว", level: "Beginner", note: "พ่อ, แม่, ลูก" },
  { order: 6, key: "numbers", titleTH: "ตัวเลข", level: "Beginner", note: "1-100" },
  { order: 7, key: "colors", titleTH: "สี", level: "Beginner", note: "แดง, น้ำเงิน, เขียว" },
  { order: 8, key: "food", titleTH: "อาหาร", level: "Beginner", note: "ข้าว, ปลา, ผัก" },
  { order: 9, key: "animals", titleTH: "สัตว์", level: "Beginner", note: "หมา, แมว, ปลา" },
  { order: 10, key: "body_parts", titleTH: "ส่วนร่างกาย", level: "Beginner", note: "หัว, มือ, เท้า" },
  { order: 11, key: "time", titleTH: "เวลา", level: "Intermediate", note: "เช้า, บ่าย, เย็น" },
  { order: 12, key: "weather", titleTH: "อากาศ", level: "Intermediate", note: "ร้อน, หนาว, ฝน" },
  { order: 13, key: "places", titleTH: "สถานที่", level: "Intermediate", note: "บ้าน, โรงเรียน, โรงพยาบาล" },
  { order: 14, key: "transportation", titleTH: "การขนส่ง", level: "Intermediate", note: "รถ, เรือ, เครื่องบิน" },
  { order: 15, key: "shopping", titleTH: "การช้อปปิ้ง", level: "Intermediate", note: "ซื้อ, ขาย, ราคา" },
  { order: 16, key: "hobbies", titleTH: "งานอดิเรก", level: "Intermediate", note: "อ่าน, ฟัง, เล่น" },
  { order: 17, key: "questions", titleTH: "คำถาม", level: "Intermediate", note: "อะไร, ใคร, ที่ไหน" },
  { order: 18, key: "conjunctions", titleTH: "คำเชื่อม", level: "Advanced", note: "และ, หรือ, แต่" },
  { order: 19, key: "classifiers", titleTH: "ลักษณนาม", level: "Advanced", note: "ตัว, คน, ใบ" },
  { order: 20, key: "dialogue", titleTH: "บทสนทนา", level: "Advanced", note: "การสนทนาประจำวัน" }
];

// Vocabulary data for each lesson
const vocabularyData = {
  consonants_basic: [
    { thai: "ก", roman: "g", en: "chicken", pos: "consonant", exampleTH: "ก ไก่", exampleEN: "G for chicken" },
    { thai: "ข", roman: "kh", en: "egg", pos: "consonant", exampleTH: "ข ไข่", exampleEN: "Kh for egg" },
    { thai: "ค", roman: "kh", en: "buffalo", pos: "consonant", exampleTH: "ค ควาย", exampleEN: "Kh for buffalo" },
    { thai: "ง", roman: "ng", en: "snake", pos: "consonant", exampleTH: "ง งู", exampleEN: "Ng for snake" },
    { thai: "จ", roman: "j", en: "plate", pos: "consonant", exampleTH: "จ จาน", exampleEN: "J for plate" },
    { thai: "ฉ", roman: "ch", en: "flag", pos: "consonant", exampleTH: "ฉ ฉิ่ง", exampleEN: "Ch for cymbal" },
    { thai: "ช", roman: "ch", en: "elephant", pos: "consonant", exampleTH: "ช ช้าง", exampleEN: "Ch for elephant" },
    { thai: "ซ", roman: "s", en: "chain", pos: "consonant", exampleTH: "ซ โซ่", exampleEN: "S for chain" },
    { thai: "ญ", roman: "y", en: "woman", pos: "consonant", exampleTH: "ญ หญิง", exampleEN: "Y for woman" },
    { thai: "ด", roman: "d", en: "child", pos: "consonant", exampleTH: "ด เด็ก", exampleEN: "D for child" }
  ],
  vowels_basic: [
    { thai: "อา", roman: "aa", en: "long a", pos: "vowel", exampleTH: "อา อ่าง", exampleEN: "Aa for basin" },
    { thai: "อี", roman: "ii", en: "long i", pos: "vowel", exampleTH: "อี อีเก้ง", exampleEN: "Ii for barking deer" },
    { thai: "อู", roman: "uu", en: "long u", pos: "vowel", exampleTH: "อู อูฐ", exampleEN: "Uu for camel" },
    { thai: "เอ", roman: "e", en: "e", pos: "vowel", exampleTH: "เอ เอา", exampleEN: "E for take" },
    { thai: "โอ", roman: "o", en: "o", pos: "vowel", exampleTH: "โอ โอ่ง", exampleEN: "O for jar" }
  ],
  tones: [
    { thai: "สามัญ", roman: "saman", en: "mid tone", pos: "tone", exampleTH: "กา", exampleEN: "crow" },
    { thai: "เอก", roman: "ek", en: "low tone", pos: "tone", exampleTH: "ขา", exampleEN: "leg" },
    { thai: "โท", roman: "tho", en: "falling tone", pos: "tone", exampleTH: "ข่า", exampleEN: "galangal" },
    { thai: "ตรี", roman: "tri", en: "high tone", pos: "tone", exampleTH: "ขา", exampleEN: "leg" },
    { thai: "จัตวา", roman: "chattawa", en: "rising tone", pos: "tone", exampleTH: "ขา", exampleEN: "leg" }
  ],
  greetings: [
    { thai: "สวัสดี", roman: "sawasdee", en: "hello", pos: "greeting", exampleTH: "สวัสดีครับ", exampleEN: "Hello (polite)" },
    { thai: "ขอบคุณ", roman: "khob khun", en: "thank you", pos: "greeting", exampleTH: "ขอบคุณมาก", exampleEN: "Thank you very much" },
    { thai: "ขอโทษ", roman: "khor thot", en: "sorry", pos: "greeting", exampleTH: "ขอโทษครับ", exampleEN: "Sorry (polite)" },
    { thai: "ลาก่อน", roman: "la kon", en: "goodbye", pos: "greeting", exampleTH: "ลาก่อนนะ", exampleEN: "Goodbye" },
    { thai: "ยินดี", roman: "yin dee", en: "pleased", pos: "greeting", exampleTH: "ยินดีที่ได้รู้จัก", exampleEN: "Nice to meet you" }
  ],
  family: [
    { thai: "พ่อ", roman: "phor", en: "father", pos: "noun", exampleTH: "พ่อของฉัน", exampleEN: "my father" },
    { thai: "แม่", roman: "mae", en: "mother", pos: "noun", exampleTH: "แม่ของฉัน", exampleEN: "my mother" },
    { thai: "ลูก", roman: "luk", en: "child", pos: "noun", exampleTH: "ลูกชาย", exampleEN: "son" },
    { thai: "ลูกสาว", roman: "luk sao", en: "daughter", pos: "noun", exampleTH: "ลูกสาวของฉัน", exampleEN: "my daughter" },
    { thai: "พี่", roman: "phi", en: "elder sibling", pos: "noun", exampleTH: "พี่ชาย", exampleEN: "elder brother" },
    { thai: "น้อง", roman: "nong", en: "younger sibling", pos: "noun", exampleTH: "น้องสาว", exampleEN: "younger sister" },
    { thai: "ปู่", roman: "pu", en: "grandfather (father's side)", pos: "noun", exampleTH: "ปู่ของฉัน", exampleEN: "my grandfather" },
    { thai: "ย่า", roman: "ya", en: "grandmother (father's side)", pos: "noun", exampleTH: "ย่าของฉัน", exampleEN: "my grandmother" },
    { thai: "ตา", roman: "ta", en: "grandfather (mother's side)", pos: "noun", exampleTH: "ตาของฉัน", exampleEN: "my grandfather" },
    { thai: "ยาย", roman: "yai", en: "grandmother (mother's side)", pos: "noun", exampleTH: "ยายของฉัน", exampleEN: "my grandmother" }
  ],
  numbers: [
    { thai: "หนึ่ง", roman: "nueng", en: "one", pos: "number", exampleTH: "หนึ่งคน", exampleEN: "one person" },
    { thai: "สอง", roman: "song", en: "two", pos: "number", exampleTH: "สองคน", exampleEN: "two people" },
    { thai: "สาม", roman: "sam", en: "three", pos: "number", exampleTH: "สามคน", exampleEN: "three people" },
    { thai: "สี่", roman: "si", en: "four", pos: "number", exampleTH: "สี่คน", exampleEN: "four people" },
    { thai: "ห้า", roman: "ha", en: "five", pos: "number", exampleTH: "ห้าคน", exampleEN: "five people" },
    { thai: "หก", roman: "hok", en: "six", pos: "number", exampleTH: "หกคน", exampleEN: "six people" },
    { thai: "เจ็ด", roman: "chet", en: "seven", pos: "number", exampleTH: "เจ็ดคน", exampleEN: "seven people" },
    { thai: "แปด", roman: "paet", en: "eight", pos: "number", exampleTH: "แปดคน", exampleEN: "eight people" },
    { thai: "เก้า", roman: "kao", en: "nine", pos: "number", exampleTH: "เก้าคน", exampleEN: "nine people" },
    { thai: "สิบ", roman: "sip", en: "ten", pos: "number", exampleTH: "สิบคน", exampleEN: "ten people" }
  ],
  colors: [
    { thai: "แดง", roman: "daeng", en: "red", pos: "adjective", exampleTH: "สีแดง", exampleEN: "red color" },
    { thai: "น้ำเงิน", roman: "nam ngoen", en: "blue", pos: "adjective", exampleTH: "สีน้ำเงิน", exampleEN: "blue color" },
    { thai: "เขียว", roman: "khiao", en: "green", pos: "adjective", exampleTH: "สีเขียว", exampleEN: "green color" },
    { thai: "เหลือง", roman: "lueang", en: "yellow", pos: "adjective", exampleTH: "สีเหลือง", exampleEN: "yellow color" },
    { thai: "ดำ", roman: "dam", en: "black", pos: "adjective", exampleTH: "สีดำ", exampleEN: "black color" },
    { thai: "ขาว", roman: "khao", en: "white", pos: "adjective", exampleTH: "สีขาว", exampleEN: "white color" },
    { thai: "ม่วง", roman: "muang", en: "purple", pos: "adjective", exampleTH: "สีม่วง", exampleEN: "purple color" },
    { thai: "ส้ม", roman: "som", en: "orange", pos: "adjective", exampleTH: "สีส้ม", exampleEN: "orange color" },
    { thai: "ชมพู", roman: "chom phu", en: "pink", pos: "adjective", exampleTH: "สีชมพู", exampleEN: "pink color" },
    { thai: "น้ำตาล", roman: "nam tan", en: "brown", pos: "adjective", exampleTH: "สีน้ำตาล", exampleEN: "brown color" }
  ],
  food: [
    { thai: "ข้าว", roman: "khao", en: "rice", pos: "noun", exampleTH: "ข้าวสวย", exampleEN: "cooked rice" },
    { thai: "ปลา", roman: "pla", en: "fish", pos: "noun", exampleTH: "ปลาทู", exampleEN: "mackerel" },
    { thai: "เนื้อ", roman: "nuea", en: "meat", pos: "noun", exampleTH: "เนื้อหมู", exampleEN: "pork" },
    { thai: "ผัก", roman: "phak", en: "vegetable", pos: "noun", exampleTH: "ผักกาด", exampleEN: "cabbage" },
    { thai: "ผลไม้", roman: "phon la mai", en: "fruit", pos: "noun", exampleTH: "ผลไม้สด", exampleEN: "fresh fruit" },
    { thai: "น้ำ", roman: "nam", en: "water", pos: "noun", exampleTH: "น้ำเปล่า", exampleEN: "plain water" },
    { thai: "นม", roman: "nom", en: "milk", pos: "noun", exampleTH: "นมวัว", exampleEN: "cow's milk" },
    { thai: "ขนม", roman: "khanom", en: "dessert", pos: "noun", exampleTH: "ขนมหวาน", exampleEN: "sweet dessert" },
    { thai: "กาแฟ", roman: "ka fae", en: "coffee", pos: "noun", exampleTH: "กาแฟดำ", exampleEN: "black coffee" },
    { thai: "ชา", roman: "cha", en: "tea", pos: "noun", exampleTH: "ชาเขียว", exampleEN: "green tea" }
  ],
  animals: [
    { thai: "หมา", roman: "ma", en: "dog", pos: "noun", exampleTH: "หมาใหญ่", exampleEN: "big dog" },
    { thai: "แมว", roman: "maeo", en: "cat", pos: "noun", exampleTH: "แมวตัวเล็ก", exampleEN: "small cat" },
    { thai: "ปลา", roman: "pla", en: "fish", pos: "noun", exampleTH: "ปลาทอง", exampleEN: "goldfish" },
    { thai: "นก", roman: "nok", en: "bird", pos: "noun", exampleTH: "นกแก้ว", exampleEN: "parrot" },
    { thai: "วัว", roman: "wua", en: "cow", pos: "noun", exampleTH: "วัวตัวใหญ่", exampleEN: "big cow" },
    { thai: "ควาย", roman: "khwai", en: "buffalo", pos: "noun", exampleTH: "ควายดำ", exampleEN: "black buffalo" },
    { thai: "หมู", roman: "mu", en: "pig", pos: "noun", exampleTH: "หมูอ้วน", exampleEN: "fat pig" },
    { thai: "ไก่", roman: "kai", en: "chicken", pos: "noun", exampleTH: "ไก่ตัวเล็ก", exampleEN: "small chicken" },
    { thai: "เป็ด", roman: "pet", en: "duck", pos: "noun", exampleTH: "เป็ดน้ำ", exampleEN: "water duck" },
    { thai: "ช้าง", roman: "chang", en: "elephant", pos: "noun", exampleTH: "ช้างใหญ่", exampleEN: "big elephant" }
  ],
  body_parts: [
    { thai: "หัว", roman: "hua", en: "head", pos: "noun", exampleTH: "หัวใหญ่", exampleEN: "big head" },
    { thai: "ตา", roman: "ta", en: "eye", pos: "noun", exampleTH: "ตาสวย", exampleEN: "beautiful eyes" },
    { thai: "หู", roman: "hu", en: "ear", pos: "noun", exampleTH: "หูเล็ก", exampleEN: "small ears" },
    { thai: "จมูก", roman: "cha muk", en: "nose", pos: "noun", exampleTH: "จมูกใหญ่", exampleEN: "big nose" },
    { thai: "ปาก", roman: "pak", en: "mouth", pos: "noun", exampleTH: "ปากเล็ก", exampleEN: "small mouth" },
    { thai: "มือ", roman: "mue", en: "hand", pos: "noun", exampleTH: "มือใหญ่", exampleEN: "big hands" },
    { thai: "เท้า", roman: "thao", en: "foot", pos: "noun", exampleTH: "เท้าเล็ก", exampleEN: "small feet" },
    { thai: "แขน", roman: "khaen", en: "arm", pos: "noun", exampleTH: "แขนยาว", exampleEN: "long arms" },
    { thai: "ขา", roman: "kha", en: "leg", pos: "noun", exampleTH: "ขายาว", exampleEN: "long legs" },
    { thai: "ท้อง", roman: "thong", en: "stomach", pos: "noun", exampleTH: "ท้องใหญ่", exampleEN: "big stomach" }
  ],
  time: [
    { thai: "เช้า", roman: "chao", en: "morning", pos: "noun", exampleTH: "ตอนเช้า", exampleEN: "in the morning" },
    { thai: "บ่าย", roman: "bai", en: "afternoon", pos: "noun", exampleTH: "ตอนบ่าย", exampleEN: "in the afternoon" },
    { thai: "เย็น", roman: "yen", en: "evening", pos: "noun", exampleTH: "ตอนเย็น", exampleEN: "in the evening" },
    { thai: "คืน", roman: "khuen", en: "night", pos: "noun", exampleTH: "ตอนคืน", exampleEN: "at night" },
    { thai: "วัน", roman: "wan", en: "day", pos: "noun", exampleTH: "วันนี้", exampleEN: "today" },
    { thai: "สัปดาห์", roman: "sap da", en: "week", pos: "noun", exampleTH: "สัปดาห์นี้", exampleEN: "this week" },
    { thai: "เดือน", roman: "duean", en: "month", pos: "noun", exampleTH: "เดือนนี้", exampleEN: "this month" },
    { thai: "ปี", roman: "pi", en: "year", pos: "noun", exampleTH: "ปีนี้", exampleEN: "this year" },
    { thai: "ชั่วโมง", roman: "chua mong", en: "hour", pos: "noun", exampleTH: "หนึ่งชั่วโมง", exampleEN: "one hour" },
    { thai: "นาที", roman: "na thi", en: "minute", pos: "noun", exampleTH: "ห้านาที", exampleEN: "five minutes" }
  ],
  weather: [
    { thai: "ร้อน", roman: "ron", en: "hot", pos: "adjective", exampleTH: "อากาศร้อน", exampleEN: "hot weather" },
    { thai: "หนาว", roman: "nao", en: "cold", pos: "adjective", exampleTH: "อากาศหนาว", exampleEN: "cold weather" },
    { thai: "ฝน", roman: "fon", en: "rain", pos: "noun", exampleTH: "ฝนตก", exampleEN: "raining" },
    { thai: "แดด", roman: "daet", en: "sun", pos: "noun", exampleTH: "แดดแรง", exampleEN: "strong sun" },
    { thai: "ลม", roman: "lom", en: "wind", pos: "noun", exampleTH: "ลมแรง", exampleEN: "strong wind" },
    { thai: "เมฆ", roman: "mekh", en: "cloud", pos: "noun", exampleTH: "เมฆมาก", exampleEN: "many clouds" },
    { thai: "ฟ้า", roman: "fa", en: "sky", pos: "noun", exampleTH: "ฟ้าสวย", exampleEN: "beautiful sky" },
    { thai: "ชื้น", roman: "chuen", en: "humid", pos: "adjective", exampleTH: "อากาศชื้น", exampleEN: "humid weather" },
    { thai: "แห้ง", roman: "haeng", en: "dry", pos: "adjective", exampleTH: "อากาศแห้ง", exampleEN: "dry weather" },
    { thai: "หมอก", roman: "mok", en: "fog", pos: "noun", exampleTH: "หมอกหนา", exampleEN: "thick fog" }
  ],
  places: [
    { thai: "บ้าน", roman: "ban", en: "house", pos: "noun", exampleTH: "บ้านใหญ่", exampleEN: "big house" },
    { thai: "โรงเรียน", roman: "rong rian", en: "school", pos: "noun", exampleTH: "โรงเรียนใกล้บ้าน", exampleEN: "school near home" },
    { thai: "โรงพยาบาล", roman: "rong pha ya ban", en: "hospital", pos: "noun", exampleTH: "โรงพยาบาลใหญ่", exampleEN: "big hospital" },
    { thai: "ตลาด", roman: "ta lat", en: "market", pos: "noun", exampleTH: "ตลาดสด", exampleEN: "fresh market" },
    { thai: "ร้านค้า", roman: "ran kha", en: "shop", pos: "noun", exampleTH: "ร้านค้าเล็ก", exampleEN: "small shop" },
    { thai: "ธนาคาร", roman: "tha na khan", en: "bank", pos: "noun", exampleTH: "ธนาคารใหญ่", exampleEN: "big bank" },
    { thai: "ร้านอาหาร", roman: "ran a han", en: "restaurant", pos: "noun", exampleTH: "ร้านอาหารอร่อย", exampleEN: "delicious restaurant" },
    { thai: "สวนสาธารณะ", roman: "suan sa tha ra na", en: "park", pos: "noun", exampleTH: "สวนสาธารณะใหญ่", exampleEN: "big park" },
    { thai: "วัด", roman: "wat", en: "temple", pos: "noun", exampleTH: "วัดเก่า", exampleEN: "old temple" },
    { thai: "สนามบิน", roman: "sa nam bin", en: "airport", pos: "noun", exampleTH: "สนามบินใหญ่", exampleEN: "big airport" }
  ],
  transportation: [
    { thai: "รถ", roman: "rot", en: "car", pos: "noun", exampleTH: "รถใหญ่", exampleEN: "big car" },
    { thai: "รถบัส", roman: "rot bat", en: "bus", pos: "noun", exampleTH: "รถบัสสีแดง", exampleEN: "red bus" },
    { thai: "รถไฟ", roman: "rot fai", en: "train", pos: "noun", exampleTH: "รถไฟเร็ว", exampleEN: "fast train" },
    { thai: "เรือ", roman: "ruea", en: "boat", pos: "noun", exampleTH: "เรือใหญ่", exampleEN: "big boat" },
    { thai: "เครื่องบิน", roman: "khrueang bin", en: "airplane", pos: "noun", exampleTH: "เครื่องบินใหญ่", exampleEN: "big airplane" },
    { thai: "รถจักรยาน", roman: "rot chak ra yan", en: "bicycle", pos: "noun", exampleTH: "รถจักรยานสีแดง", exampleEN: "red bicycle" },
    { thai: "รถมอเตอร์ไซค์", roman: "rot mo to sai", en: "motorcycle", pos: "noun", exampleTH: "รถมอเตอร์ไซค์เร็ว", exampleEN: "fast motorcycle" },
    { thai: "แท็กซี่", roman: "thaek si", en: "taxi", pos: "noun", exampleTH: "แท็กซี่สีเหลือง", exampleEN: "yellow taxi" },
    { thai: "รถตุ๊กตุ๊ก", roman: "rot tuk tuk", en: "tuk-tuk", pos: "noun", exampleTH: "รถตุ๊กตุ๊กสีแดง", exampleEN: "red tuk-tuk" },
    { thai: "เรือด่วน", roman: "ruea duan", en: "express boat", pos: "noun", exampleTH: "เรือด่วนเร็ว", exampleEN: "fast express boat" }
  ],
  shopping: [
    { thai: "ซื้อ", roman: "sue", en: "buy", pos: "verb", exampleTH: "ซื้อของ", exampleEN: "buy things" },
    { thai: "ขาย", roman: "khai", en: "sell", pos: "verb", exampleTH: "ขายของ", exampleEN: "sell things" },
    { thai: "ราคา", roman: "ra kha", en: "price", pos: "noun", exampleTH: "ราคาแพง", exampleEN: "expensive price" },
    { thai: "เงิน", roman: "ngoen", en: "money", pos: "noun", exampleTH: "เงินเยอะ", exampleEN: "a lot of money" },
    { thai: "ของ", roman: "khong", en: "thing", pos: "noun", exampleTH: "ของสวย", exampleEN: "beautiful thing" },
    { thai: "ร้าน", roman: "ran", en: "store", pos: "noun", exampleTH: "ร้านใหญ่", exampleEN: "big store" },
    { thai: "ลูกค้า", roman: "luk kha", en: "customer", pos: "noun", exampleTH: "ลูกค้าใหม่", exampleEN: "new customer" },
    { thai: "ลดราคา", roman: "lot ra kha", en: "discount", pos: "noun", exampleTH: "ลดราคา 50%", exampleEN: "50% discount" },
    { thai: "จ่าย", roman: "chai", en: "pay", pos: "verb", exampleTH: "จ่ายเงิน", exampleEN: "pay money" },
    { thai: "รับ", roman: "rap", en: "receive", pos: "verb", exampleTH: "รับของ", exampleEN: "receive things" }
  ],
  hobbies: [
    { thai: "อ่าน", roman: "an", en: "read", pos: "verb", exampleTH: "อ่านหนังสือ", exampleEN: "read books" },
    { thai: "ฟัง", roman: "fang", en: "listen", pos: "verb", exampleTH: "ฟังเพลง", exampleEN: "listen to music" },
    { thai: "เล่น", roman: "len", en: "play", pos: "verb", exampleTH: "เล่นกีฬา", exampleEN: "play sports" },
    { thai: "ดู", roman: "du", en: "watch", pos: "verb", exampleTH: "ดูหนัง", exampleEN: "watch movies" },
    { thai: "ร้อง", roman: "rong", en: "sing", pos: "verb", exampleTH: "ร้องเพลง", exampleEN: "sing songs" },
    { thai: "เต้น", roman: "ten", en: "dance", pos: "verb", exampleTH: "เต้นรำ", exampleEN: "dance" },
    { thai: "วาด", roman: "wat", en: "draw", pos: "verb", exampleTH: "วาดรูป", exampleEN: "draw pictures" },
    { thai: "ถ่าย", roman: "thai", en: "take photos", pos: "verb", exampleTH: "ถ่ายรูป", exampleEN: "take photos" },
    { thai: "เดิน", roman: "doen", en: "walk", pos: "verb", exampleTH: "เดินเล่น", exampleEN: "walk for fun" },
    { thai: "วิ่ง", roman: "wing", en: "run", pos: "verb", exampleTH: "วิ่งออกกำลังกาย", exampleEN: "run for exercise" }
  ],
  questions: [
    { thai: "อะไร", roman: "a rai", en: "what", pos: "question", exampleTH: "อะไรคือ", exampleEN: "what is" },
    { thai: "ใคร", roman: "khrai", en: "who", pos: "question", exampleTH: "ใครคือ", exampleEN: "who is" },
    { thai: "ที่ไหน", roman: "thi nai", en: "where", pos: "question", exampleTH: "อยู่ที่ไหน", exampleEN: "where is" },
    { thai: "เมื่อไหร่", roman: "muea rai", en: "when", pos: "question", exampleTH: "เมื่อไหร่จะมา", exampleEN: "when will you come" },
    { thai: "ทำไม", roman: "tham mai", en: "why", pos: "question", exampleTH: "ทำไมถึง", exampleEN: "why did" },
    { thai: "อย่างไร", roman: "yang rai", en: "how", pos: "question", exampleTH: "ทำอย่างไร", exampleEN: "how to do" },
    { thai: "เท่าไหร่", roman: "thao rai", en: "how much", pos: "question", exampleTH: "ราคาเท่าไหร่", exampleEN: "how much is the price" },
    { thai: "กี่", roman: "ki", en: "how many", pos: "question", exampleTH: "กี่คน", exampleEN: "how many people" },
    { thai: "หรือไม่", roman: "rue mai", en: "or not", pos: "question", exampleTH: "ใช่หรือไม่", exampleEN: "yes or no" },
    { thai: "ไหม", roman: "mai", en: "question particle", pos: "question", exampleTH: "สวยไหม", exampleEN: "is it beautiful" }
  ],
  conjunctions: [
    { thai: "และ", roman: "lae", en: "and", pos: "conjunction", exampleTH: "ฉันและเธอ", exampleEN: "you and I" },
    { thai: "หรือ", roman: "rue", en: "or", pos: "conjunction", exampleTH: "แดงหรือน้ำเงิน", exampleEN: "red or blue" },
    { thai: "แต่", roman: "tae", en: "but", pos: "conjunction", exampleTH: "สวยแต่แพง", exampleEN: "beautiful but expensive" },
    { thai: "เพราะ", roman: "phro", en: "because", pos: "conjunction", exampleTH: "เพราะว่า", exampleEN: "because" },
    { thai: "ถ้า", roman: "tha", en: "if", pos: "conjunction", exampleTH: "ถ้าฉันมีเงิน", exampleEN: "if I have money" },
    { thai: "เมื่อ", roman: "muea", en: "when", pos: "conjunction", exampleTH: "เมื่อฉันมา", exampleEN: "when I come" },
    { thai: "จนกว่า", roman: "jon kwa", en: "until", pos: "conjunction", exampleTH: "จนกว่าจะเสร็จ", exampleEN: "until finished" },
    { thai: "หลังจาก", roman: "lang jak", en: "after", pos: "conjunction", exampleTH: "หลังจากกินข้าว", exampleEN: "after eating" },
    { thai: "ก่อน", roman: "kon", en: "before", pos: "conjunction", exampleTH: "ก่อนไป", exampleEN: "before going" },
    { thai: "ในขณะที่", roman: "nai kha na thi", en: "while", pos: "conjunction", exampleTH: "ในขณะที่ฉันทำงาน", exampleEN: "while I work" }
  ],
  classifiers: [
    { thai: "ตัว", roman: "tua", en: "classifier for animals", pos: "classifier", exampleTH: "หมา 2 ตัว", exampleEN: "2 dogs" },
    { thai: "คน", roman: "khon", en: "classifier for people", pos: "classifier", exampleTH: "คน 3 คน", exampleEN: "3 people" },
    { thai: "ใบ", roman: "bai", en: "classifier for leaves", pos: "classifier", exampleTH: "ใบไม้ 5 ใบ", exampleEN: "5 leaves" },
    { thai: "อัน", roman: "an", en: "classifier for things", pos: "classifier", exampleTH: "ของ 1 อัน", exampleEN: "1 thing" },
    { thai: "เล่ม", roman: "lem", en: "classifier for books", pos: "classifier", exampleTH: "หนังสือ 2 เล่ม", exampleEN: "2 books" },
    { thai: "คัน", roman: "khan", en: "classifier for vehicles", pos: "classifier", exampleTH: "รถ 1 คัน", exampleEN: "1 car" },
    { thai: "หลัง", roman: "lang", en: "classifier for houses", pos: "classifier", exampleTH: "บ้าน 1 หลัง", exampleEN: "1 house" },
    { thai: "ดอก", roman: "dok", en: "classifier for flowers", pos: "classifier", exampleTH: "ดอกไม้ 3 ดอก", exampleEN: "3 flowers" },
    { thai: "ชิ้น", roman: "chin", en: "classifier for pieces", pos: "classifier", exampleTH: "ขนม 4 ชิ้น", exampleEN: "4 pieces of dessert" },
    { thai: "จาน", roman: "chan", en: "classifier for plates", pos: "classifier", exampleTH: "ข้าว 1 จาน", exampleEN: "1 plate of rice" }
  ],
  dialogue: [
    { thai: "สวัสดีครับ", roman: "sawasdee khrap", en: "hello (polite male)", pos: "greeting", exampleTH: "สวัสดีครับ คุณสบายดีไหม", exampleEN: "Hello, how are you?" },
    { thai: "สวัสดีค่ะ", roman: "sawasdee kha", en: "hello (polite female)", pos: "greeting", exampleTH: "สวัสดีค่ะ คุณสบายดีไหม", exampleEN: "Hello, how are you?" },
    { thai: "สบายดี", roman: "sa bai dee", en: "fine", pos: "response", exampleTH: "สบายดีครับ", exampleEN: "I'm fine" },
    { thai: "ขอบคุณ", roman: "khob khun", en: "thank you", pos: "response", exampleTH: "ขอบคุณมาก", exampleEN: "Thank you very much" },
    { thai: "ไม่เป็นไร", roman: "mai pen rai", en: "you're welcome", pos: "response", exampleTH: "ไม่เป็นไรครับ", exampleEN: "You're welcome" },
    { thai: "ขอโทษ", roman: "khor thot", en: "sorry", pos: "response", exampleTH: "ขอโทษครับ", exampleEN: "Sorry" },
    { thai: "ไม่เป็นไร", roman: "mai pen rai", en: "it's okay", pos: "response", exampleTH: "ไม่เป็นไรครับ", exampleEN: "It's okay" },
    { thai: "ลาก่อน", roman: "la kon", en: "goodbye", pos: "greeting", exampleTH: "ลาก่อนนะ", exampleEN: "Goodbye" },
    { thai: "พบกันใหม่", roman: "phop kan mai", en: "see you again", pos: "greeting", exampleTH: "พบกันใหม่นะ", exampleEN: "See you again" },
    { thai: "ยินดีที่ได้รู้จัก", roman: "yin dee thi dai ru chak", en: "nice to meet you", pos: "greeting", exampleTH: "ยินดีที่ได้รู้จักครับ", exampleEN: "Nice to meet you" }
  ]
};

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function seedLessons() {
  console.log('📚 Seeding lessons...');
  
  try {
    // Clear existing lessons
    await Lesson.deleteMany({});
    console.log('🗑️ Cleared existing lessons');
    
    // Insert new lessons
    const lessons = await Lesson.insertMany(lessonsData);
    console.log(`✅ Inserted ${lessons.length} lessons`);
    
    return lessons;
  } catch (error) {
    console.error('❌ Error seeding lessons:', error);
    throw error;
  }
}

async function seedVocabulary() {
  console.log('📖 Seeding vocabulary...');
  
  try {
    // Clear existing vocabulary
    await VocabWord.deleteMany({});
    console.log('🗑️ Cleared existing vocabulary');
    
    let totalWords = 0;
    
    // Insert vocabulary for each lesson
    for (const [lessonKey, words] of Object.entries(vocabularyData)) {
      const lesson = await Lesson.findOne({ key: lessonKey });
      if (!lesson) {
        console.log(`⚠️ Lesson ${lessonKey} not found, skipping vocabulary`);
        continue;
      }
      
      const vocabWords = words.map(word => ({
        ...word,
        lessonKey: lessonKey,
        level: lesson.level,
        tags: [lessonKey, lesson.level.toLowerCase()]
      }));
      
      // Use upsert to handle duplicates
      let insertedCount = 0;
      for (const word of vocabWords) {
        try {
          await VocabWord.findOneAndUpdate(
            { thai: word.thai, lessonKey: word.lessonKey },
            word,
            { upsert: true, new: true }
          );
          insertedCount++;
        } catch (error) {
          console.log(`⚠️ Skipped duplicate word: ${word.thai} in lesson ${lessonKey}`);
        }
      }
      console.log(`✅ Processed ${insertedCount} words for lesson: ${lessonKey}`);
      totalWords += insertedCount;
    }
    
    console.log(`✅ Total vocabulary words inserted: ${totalWords}`);
    return totalWords;
  } catch (error) {
    console.error('❌ Error seeding vocabulary:', error);
    throw error;
  }
}

async function seedAllVocabulary() {
  console.log('🌱 Starting vocabulary seeding process...\n');
  
  try {
    await connectDB();
    
    // Seed lessons first
    const lessons = await seedLessons();
    
    // Seed vocabulary
    const totalWords = await seedVocabulary();
    
    // Summary
    console.log('\n📊 Seeding Summary:');
    console.log(`   Lessons: ${lessons.length}`);
    console.log(`   Vocabulary Words: ${totalWords}`);
    console.log(`   Lessons with vocabulary: ${Object.keys(vocabularyData).length}`);
    
    console.log('\n🎉 Vocabulary seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the seeding
seedAllVocabulary();
