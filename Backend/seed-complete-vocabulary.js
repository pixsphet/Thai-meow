require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
const Lesson = require('./models/Lesson');
const VocabWord = require('./models/VocabWord');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thai-meow';

// Complete vocabulary data for all lessons
const completeVocabularyData = {
  consonants_basic: [
    { thai: "ก", roman: "g", en: "chicken", pos: "consonant", exampleTH: "กอ-ไก่", exampleEN: "G for chicken" },
    { thai: "ข", roman: "kh", en: "egg", pos: "consonant", exampleTH: "ขอ-ไข่", exampleEN: "Kh for egg" },
    { thai: "ฃ", roman: "kh", en: "bottle", pos: "consonant", exampleTH: "ขอ-ขวด", exampleEN: "Kh for bottle" },
    { thai: "ค", roman: "kh", en: "buffalo", pos: "consonant", exampleTH: "คอ-ควาย", exampleEN: "Kh for buffalo" },
    { thai: "ฅ", roman: "kh", en: "person", pos: "consonant", exampleTH: "คอ-คน", exampleEN: "Kh for person" },
    { thai: "ฆ", roman: "kh", en: "bell", pos: "consonant", exampleTH: "คอ-ระ-คัง", exampleEN: "Kh for bell" },
    { thai: "ง", roman: "ng", en: "snake", pos: "consonant", exampleTH: "งอ-งู", exampleEN: "Ng for snake" },
    { thai: "จ", roman: "j", en: "plate", pos: "consonant", exampleTH: "จอ-จาน", exampleEN: "J for plate" },
    { thai: "ฉ", roman: "ch", en: "cymbals", pos: "consonant", exampleTH: "ฉอ-ฉิ่ง", exampleEN: "Ch for cymbals" },
    { thai: "ช", roman: "ch", en: "elephant", pos: "consonant", exampleTH: "ชอ-ช้าง", exampleEN: "Ch for elephant" },
    { thai: "ซ", roman: "s", en: "chain", pos: "consonant", exampleTH: "ซอ-โซ่", exampleEN: "S for chain" },
    { thai: "ฌ", roman: "ch", en: "tree", pos: "consonant", exampleTH: "ชอ-เชอ", exampleEN: "Ch for tree" },
    { thai: "ญ", roman: "y", en: "woman", pos: "consonant", exampleTH: "ยอ-หฺยิง", exampleEN: "Y for woman" },
    { thai: "ฎ", roman: "d", en: "headdress", pos: "consonant", exampleTH: "ดอ-ชะ-ดา", exampleEN: "D for headdress" },
    { thai: "ฏ", roman: "t", en: "javelin", pos: "consonant", exampleTH: "ตอ-ปะ-ตัก", exampleEN: "T for javelin" },
    { thai: "ฐ", roman: "th", en: "base", pos: "consonant", exampleTH: "ถอ-ถาน, ถอ-สัน-ถาน", exampleEN: "Th for base" },
    { thai: "ฑ", roman: "th", en: "Mondho", pos: "consonant", exampleTH: "ทอ-มน-โท, ทอ-นาง-มน-โท", exampleEN: "Th for Mondho" },
    { thai: "ฒ", roman: "th", en: "elderly person", pos: "consonant", exampleTH: "ทอ-ผู้-เท่า", exampleEN: "Th for elderly person" },
    { thai: "ณ", roman: "n", en: "novice monk", pos: "consonant", exampleTH: "นอ-เนน", exampleEN: "N for novice monk" },
    { thai: "ด", roman: "d", en: "child", pos: "consonant", exampleTH: "ดอ-เด็ก", exampleEN: "D for child" },
    { thai: "ต", roman: "t", en: "turtle", pos: "consonant", exampleTH: "ตอ-เต่า", exampleEN: "T for turtle" },
    { thai: "ถ", roman: "th", en: "bag", pos: "consonant", exampleTH: "ถอ-ถุง", exampleEN: "Th for bag" },
    { thai: "ท", roman: "th", en: "soldier", pos: "consonant", exampleTH: "ทอ-ทะ-หาน", exampleEN: "Th for soldier" },
    { thai: "ธ", roman: "th", en: "flag", pos: "consonant", exampleTH: "ทอ-ทง", exampleEN: "Th for flag" },
    { thai: "น", roman: "n", en: "mouse", pos: "consonant", exampleTH: "นอ-หนู", exampleEN: "N for mouse" },
    { thai: "บ", roman: "b", en: "leaf", pos: "consonant", exampleTH: "บอ-ไบ-ไม้", exampleEN: "B for leaf" },
    { thai: "ป", roman: "p", en: "fish", pos: "consonant", exampleTH: "ปอ-ปฺลา", exampleEN: "P for fish" },
    { thai: "ผ", roman: "ph", en: "bee", pos: "consonant", exampleTH: "ผอ-ผึ้ง", exampleEN: "Ph for bee" },
    { thai: "ฝ", roman: "f", en: "lid", pos: "consonant", exampleTH: "ฝอ-ฝา", exampleEN: "F for lid" },
    { thai: "พ", roman: "ph", en: "tray", pos: "consonant", exampleTH: "พอ-พาน", exampleEN: "Ph for tray" },
    { thai: "ฟ", roman: "f", en: "tooth", pos: "consonant", exampleTH: "ฟอ-ฟัน", exampleEN: "F for tooth" },
    { thai: "ภ", roman: "ph", en: "junk boat", pos: "consonant", exampleTH: "พอ-สำ-เพา", exampleEN: "Ph for junk boat" },
    { thai: "ม", roman: "m", en: "horse", pos: "consonant", exampleTH: "มอ-ม้า", exampleEN: "M for horse" },
    { thai: "ย", roman: "y", en: "giant", pos: "consonant", exampleTH: "ยอ-ยัก", exampleEN: "Y for giant" },
    { thai: "ร", roman: "r", en: "boat", pos: "consonant", exampleTH: "รอ-เรือ", exampleEN: "R for boat" },
    { thai: "ล", roman: "l", en: "monkey", pos: "consonant", exampleTH: "ลอ-ลิง", exampleEN: "L for monkey" },
    { thai: "ว", roman: "w", en: "ring", pos: "consonant", exampleTH: "วอ-แหวน", exampleEN: "W for ring" },
    { thai: "ศ", roman: "s", en: "pavilion", pos: "consonant", exampleTH: "สอ-สา-ลา", exampleEN: "S for pavilion" },
    { thai: "ษ", roman: "s", en: "hermit", pos: "consonant", exampleTH: "สอ-รือ-สี", exampleEN: "S for hermit" },
    { thai: "ส", roman: "s", en: "tiger", pos: "consonant", exampleTH: "สอ-เสือ", exampleEN: "S for tiger" },
    { thai: "ห", roman: "h", en: "box", pos: "consonant", exampleTH: "หอ-หีบ", exampleEN: "H for box" },
    { thai: "ฬ", roman: "l", en: "kite", pos: "consonant", exampleTH: "ลอ-จุ-ลา", exampleEN: "L for kite" },
    { thai: "อ", roman: "a", en: "basin", pos: "consonant", exampleTH: "ออ-อ่าง", exampleEN: "A for basin" },
    { thai: "ฮ", roman: "h", en: "owl", pos: "consonant", exampleTH: "ฮอ-นก-ฮูก", exampleEN: "H for owl" }
  ],
  vowels_basic: [
    { thai: "อา", roman: "aa", en: "long a", pos: "vowel", exampleTH: "อา อ่าง", exampleEN: "Aa for basin" },
    { thai: "อี", roman: "ii", en: "long i", pos: "vowel", exampleTH: "อี อีเก้ง", exampleEN: "Ii for barking deer" },
    { thai: "อู", roman: "uu", en: "long u", pos: "vowel", exampleTH: "อู อูฐ", exampleEN: "Uu for camel" },
    { thai: "เอ", roman: "e", en: "e", pos: "vowel", exampleTH: "เอ เอา", exampleEN: "E for take" },
    { thai: "โอ", roman: "o", en: "o", pos: "vowel", exampleTH: "โอ โอ่ง", exampleEN: "O for jar" },
    { thai: "แอ", roman: "ae", en: "ae", pos: "vowel", exampleTH: "แอ แอปเปิล", exampleEN: "Ae for apple" },
    { thai: "ไอ", roman: "ai", en: "ai", pos: "vowel", exampleTH: "ไอ ไข่", exampleEN: "Ai for egg" },
    { thai: "ใอ", roman: "ai", en: "ai", pos: "vowel", exampleTH: "ใอ ใบบัว", exampleEN: "Ai for lotus leaf" },
    { thai: "เอา", roman: "ao", en: "ao", pos: "vowel", exampleTH: "เอา เอา", exampleEN: "Ao for take" },
    { thai: "อัว", roman: "ua", en: "ua", pos: "vowel", exampleTH: "อัว อัว", exampleEN: "Ua for ua" }
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
    { thai: "ยินดี", roman: "yin dee", en: "pleased", pos: "greeting", exampleTH: "ยินดีที่ได้รู้จัก", exampleEN: "Nice to meet you" },
    { thai: "สบายดี", roman: "sa bai dee", en: "fine", pos: "greeting", exampleTH: "สบายดีครับ", exampleEN: "I'm fine" },
    { thai: "ไม่เป็นไร", roman: "mai pen rai", en: "you're welcome", pos: "greeting", exampleTH: "ไม่เป็นไรครับ", exampleEN: "You're welcome" },
    { thai: "พบกันใหม่", roman: "phop kan mai", en: "see you again", pos: "greeting", exampleTH: "พบกันใหม่นะ", exampleEN: "See you again" },
    { thai: "ยินดีที่ได้รู้จัก", roman: "yin dee thi dai ru chak", en: "nice to meet you", pos: "greeting", exampleTH: "ยินดีที่ได้รู้จักครับ", exampleEN: "Nice to meet you" },
    { thai: "สวัสดีตอนเช้า", roman: "sawasdee ton chao", en: "good morning", pos: "greeting", exampleTH: "สวัสดีตอนเช้าครับ", exampleEN: "Good morning" }
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
    { thai: "ยาย", roman: "yai", en: "grandmother (mother's side)", pos: "noun", exampleTH: "ยายของฉัน", exampleEN: "my grandmother" },
    { thai: "ลุง", roman: "lung", en: "uncle", pos: "noun", exampleTH: "ลุงของฉัน", exampleEN: "my uncle" },
    { thai: "ป้า", roman: "pa", en: "aunt", pos: "noun", exampleTH: "ป้าของฉัน", exampleEN: "my aunt" },
    { thai: "น้า", roman: "na", en: "aunt (mother's side)", pos: "noun", exampleTH: "น้าของฉัน", exampleEN: "my aunt" },
    { thai: "อา", roman: "a", en: "uncle (father's side)", pos: "noun", exampleTH: "อาของฉัน", exampleEN: "my uncle" }
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
    { thai: "สิบ", roman: "sip", en: "ten", pos: "number", exampleTH: "สิบคน", exampleEN: "ten people" },
    { thai: "ยี่สิบ", roman: "yi sip", en: "twenty", pos: "number", exampleTH: "ยี่สิบคน", exampleEN: "twenty people" },
    { thai: "สามสิบ", roman: "sam sip", en: "thirty", pos: "number", exampleTH: "สามสิบคน", exampleEN: "thirty people" },
    { thai: "สี่สิบ", roman: "si sip", en: "forty", pos: "number", exampleTH: "สี่สิบคน", exampleEN: "forty people" },
    { thai: "ห้าสิบ", roman: "ha sip", en: "fifty", pos: "number", exampleTH: "ห้าสิบคน", exampleEN: "fifty people" },
    { thai: "ร้อย", roman: "roi", en: "hundred", pos: "number", exampleTH: "ร้อยคน", exampleEN: "hundred people" }
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
    { thai: "น้ำตาล", roman: "nam tan", en: "brown", pos: "adjective", exampleTH: "สีน้ำตาล", exampleEN: "brown color" },
    { thai: "เทา", roman: "thao", en: "gray", pos: "adjective", exampleTH: "สีเทา", exampleEN: "gray color" },
    { thai: "ทอง", roman: "thong", en: "gold", pos: "adjective", exampleTH: "สีทอง", exampleEN: "gold color" }
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
    { thai: "ชา", roman: "cha", en: "tea", pos: "noun", exampleTH: "ชาเขียว", exampleEN: "green tea" },
    { thai: "น้ำผลไม้", roman: "nam phon la mai", en: "juice", pos: "noun", exampleTH: "น้ำส้ม", exampleEN: "orange juice" },
    { thai: "ไอศกรีม", roman: "ai sa krim", en: "ice cream", pos: "noun", exampleTH: "ไอศกรีมวานิลลา", exampleEN: "vanilla ice cream" },
    { thai: "เค้ก", roman: "khek", en: "cake", pos: "noun", exampleTH: "เค้กช็อกโกแลต", exampleEN: "chocolate cake" },
    { thai: "พิซซ่า", roman: "phit sa", en: "pizza", pos: "noun", exampleTH: "พิซซ่าฮาวาย", exampleEN: "Hawaiian pizza" }
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
    { thai: "ช้าง", roman: "chang", en: "elephant", pos: "noun", exampleTH: "ช้างใหญ่", exampleEN: "big elephant" },
    { thai: "เสือ", roman: "suea", en: "tiger", pos: "noun", exampleTH: "เสือลาย", exampleEN: "striped tiger" },
    { thai: "สิงโต", roman: "sing to", en: "lion", pos: "noun", exampleTH: "สิงโตตัวใหญ่", exampleEN: "big lion" },
    { thai: "หมี", roman: "mi", en: "bear", pos: "noun", exampleTH: "หมีขาว", exampleEN: "polar bear" },
    { thai: "กบ", roman: "kop", en: "frog", pos: "noun", exampleTH: "กบเขียว", exampleEN: "green frog" }
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
    { thai: "ท้อง", roman: "thong", en: "stomach", pos: "noun", exampleTH: "ท้องใหญ่", exampleEN: "big stomach" },
    { thai: "หลัง", roman: "lang", en: "back", pos: "noun", exampleTH: "หลังตรง", exampleEN: "straight back" },
    { thai: "ไหล่", roman: "lai", en: "shoulder", pos: "noun", exampleTH: "ไหล่กว้าง", exampleEN: "broad shoulders" },
    { thai: "คอ", roman: "kho", en: "neck", pos: "noun", exampleTH: "คอยาว", exampleEN: "long neck" },
    { thai: "หัวใจ", roman: "hua chai", en: "heart", pos: "noun", exampleTH: "หัวใจใหญ่", exampleEN: "big heart" }
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

async function seedCompleteVocabulary() {
  console.log('🌱 Starting complete vocabulary seeding...\n');
  
  try {
    await connectDB();
    
    let totalWords = 0;
    
    // Process each lesson's vocabulary
    for (const [lessonKey, words] of Object.entries(completeVocabularyData)) {
      console.log(`📖 Processing lesson: ${lessonKey}`);
      
      // Get lesson info
      let lesson = await Lesson.findOne({ key: lessonKey });
      if (!lesson) {
        // Try to find by titleTH
        const titleMap = {
          'consonants_basic': 'พยัญชนะพื้นฐาน',
          'vowels_basic': 'สระพื้นฐาน',
          'tones': 'วรรณยุกต์',
          'greetings': 'การทักทาย',
          'family': 'ครอบครัว',
          'numbers': 'ตัวเลข',
          'colors': 'สี',
          'food': 'อาหาร',
          'animals': 'สัตว์',
          'body_parts': 'อวัยวะ'
        };
        lesson = await Lesson.findOne({ titleTH: titleMap[lessonKey] });
        if (lesson) {
          // Update with key
          await Lesson.findByIdAndUpdate(lesson._id, { key: lessonKey });
        }
      }
      if (!lesson) {
        console.log(`⚠️ Lesson ${lessonKey} not found, skipping vocabulary`);
        continue;
      }
      
      let wordCount = 0;
      
      // Process each word
      for (const word of words) {
        try {
          await VocabWord.findOneAndUpdate(
            { thai: word.thai, lessonKey: lessonKey },
            {
              thai: word.thai,
              roman: word.roman,
              en: word.en,
              pos: word.pos,
              lessonKey: lessonKey,
              level: lesson.level,
              tags: [lessonKey, lesson.level.toLowerCase()],
              exampleTH: word.exampleTH,
              exampleEN: word.exampleEN
            },
            { upsert: true, new: true }
          );
          wordCount++;
        } catch (error) {
          console.log(`⚠️ Skipped word: ${word.thai} - ${error.message}`);
        }
      }
      
      console.log(`✅ Processed ${wordCount} words for lesson: ${lessonKey}`);
      totalWords += wordCount;
    }
    
    // Summary
    console.log('\n📊 Seeding Summary:');
    console.log(`   Total vocabulary words processed: ${totalWords}`);
    
    // Get final counts
    const lessonCount = await Lesson.countDocuments();
    const vocabCount = await VocabWord.countDocuments();
    
    console.log(`   Total lessons in DB: ${lessonCount}`);
    console.log(`   Total vocabulary in DB: ${vocabCount}`);
    
    console.log('\n🎉 Complete vocabulary seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the seeding
seedCompleteVocabulary();
