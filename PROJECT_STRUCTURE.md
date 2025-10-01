# 📁 Thai Meow - โครงสร้างโปรเจค

## 🗂️ **โครงสร้างไฟล์หลัก**

```
App/
├── 📱 Frontend/
│   └── thai-meow/
│       ├── 📱 App.js (Navigation หลัก)
│       ├── 📱 index.js (Entry Point)
│       ├── 📦 package.json
│       ├── 📦 package-lock.json
│       └── 📁 src/
│           ├── 📁 screens/ (หน้าจอทั้งหมด)
│           ├── 📁 services/ (บริการ)
│           ├── 📁 contexts/ (Context API)
│           ├── 📁 components/ (คอมโพเนนต์)
│           ├── 📁 navigation/ (Navigation)
│           ├── 📁 config/ (การตั้งค่า)
│           ├── 📁 hooks/ (Custom Hooks)
│           ├── 📁 utils/ (Utilities)
│           └── 📁 asset/ (รูปภาพ, ไฟล์)
│
├── 🔧 Backend/
│   ├── 📱 server.js (Server หลัก)
│   ├── 📦 package.json
│   ├── 📁 routes/ (API Routes)
│   ├── 📁 models/ (Database Models)
│   ├── 📁 controllers/ (Controllers)
│   ├── 📁 middleware/ (Middleware)
│   ├── 📁 services/ (Backend Services)
│   ├── 📁 config/ (การตั้งค่า)
│   └── 📁 seed/ (ข้อมูลเริ่มต้น)
│
└── 📚 Documentation/
    ├── 📄 README.md
    ├── 📄 API_DOCUMENTATION.md
    ├── 📄 FEATURES_SUMMARY.md
    ├── 📄 MONGODB_ATLAS_SETUP.md
    └── 📄 COMPLETE_FEATURES_LIST.md
```

## 📱 **Frontend Structure**

### 🖥️ **Screens** (`/src/screens/`)
```
screens/
├── 🏠 HomeScreen.js (หน้าหลัก)
├── 🎯 LevelStage1.js (ระดับเริ่มต้น)
├── 🎯 LevelStage2.js (ระดับกลาง)
├── 🎯 LevelStage3.js (ระดับสูง)
├── 🎮 NewLessonGame.js (เกมใหม่)
├── 🔐 SignUpScreen.js (สมัครสมาชิก)
├── 🔑 SignInScreen.js (เข้าสู่ระบบ)
├── 👤 ProfileScreen.js (โปรไฟล์)
├── ✏️ EditProfileScreen.js (แก้ไขโปรไฟล์)
├── 🏆 AchievementScreen.js (รางวัล)
├── 📊 ProgressDashboardScreen.js (สถิติ)
├── 🏅 LeaderboardScreen.js (อันดับ)
├── 🎁 TreasurechestScreen.js (กล่องสมบัติ)
├── 📋 QuestScreen.js (ภารกิจ)
├── 🎯 DailyChallengeScreen.js (ความท้าทายประจำวัน)
├── ⚙️ SettingsScreen.js (ตั้งค่า)
├── 🎉 GameCompleteScreen.js (จบเกม)
├── ✅ LessonCompleteScreen.js (จบบทเรียน)
├── 🔄 MainTab.js (Tab Navigator หลัก)
├── 🌟 FirstScreen.js (หน้าต้อนรับ)
├── 📖 Onboarding1.js (แนะนำ 1)
├── 📖 Onboarding2.js (แนะนำ 2)
├── 📖 Onboarding3.js (แนะนำ 3)
├── 🎮 ArrangeSentenceScreen.js (เกมเรียงประโยค)
├── 🎮 WordMatchingGame.js (เกมจับคู่)
├── 🎮 DuolingoStyleGame.js (เกม Duolingo)
├── 🎮 BeginnerDuolingoGame.js (เกม Duolingo เริ่มต้น)
├── 🎮 IntermediateDuolingoGame.js (เกม Duolingo กลาง)
├── 🎮 MiniGameScreen.js (เกมเล็ก)
├── 🎮 ThaiConsonantsGame.js (เกมพยัญชนะ)
├── 🎮 ThaiVowelsGame.js (เกมสระ)
└── 📄 mockLessonData.js (ข้อมูลทดสอบ)
```

### 🔧 **Services** (`/src/services/`)
```
services/
├── 🎵 aiForThaiTtsService.js (AI TTS ภาษาไทย)
├── 🎵 aiTtsService.js (TTS ทั่วไป)
├── 🎵 aiSpeechService.js (Speech Service)
├── 🎵 ttsService.js (TTS พื้นฐาน)
├── 🌐 apiClient.js (API Client หลัก)
├── 🌐 apiService.js (API Service)
├── 🌐 dataService.js (Data Service)
├── 🎮 dailyChallengeService.js (ภารกิจประจำวัน)
├── 📊 progressService.js (ติดตามความคืบหน้า)
└── 🔐 authService.js (Authentication)
```

### 🎨 **Components** (`/src/components/`)
```
components/
├── 🎨 CustomTabBar.js (Tab Bar กำหนดเอง)
├── 🎮 GameModeSelector.js (เลือกโหมดเกม)
└── 📊 ProgressRing.js (วงกลมความคืบหน้า)
```

### 🎯 **Contexts** (`/src/contexts/`)
```
contexts/
├── 🎨 ThemeContext.js (ธีม)
├── 👤 UserContext.js (ข้อมูลผู้ใช้)
└── 📊 ProgressContext.js (ความคืบหน้า)
```

### ⚙️ **Config** (`/src/config/`)
```
config/
├── 🌐 apiConfig.js (การตั้งค่า API)
├── 🎨 designSystem.js (ระบบออกแบบ)
├── 👥 MOCK_FRIENDS.js (ข้อมูลเพื่อนจำลอง)
└── 📊 mockData.js (ข้อมูลจำลอง)
```

## 🔧 **Backend Structure**

### 🛣️ **Routes** (`/routes/`)
```
routes/
├── 🔐 auth.js (Authentication)
├── 📚 vocabulary.js (คำศัพท์)
├── 🎮 games.js (เกม)
├── 📊 progress.js (ความคืบหน้า)
├── 🏆 achievements.js (รางวัล)
├── 🏅 leaderboard.js (อันดับ)
├── 🎯 dailyChallenges.js (ภารกิจประจำวัน)
├── 🎵 audio.js (เสียง)
├── 🎵 simple-audio.js (เสียงง่าย)
├── 🎵 ai-audio.js (AI เสียง)
└── 📝 arrange-sentence.js (เรียงประโยค)
```

### 🗄️ **Models** (`/models/`)
```
models/
├── 👤 User.js (ผู้ใช้)
├── 📚 Vocabulary.js (คำศัพท์)
├── 📖 Lesson.js (บทเรียน)
├── ❓ Question.js (คำถาม)
├── 📊 Progress.js (ความคืบหน้า)
├── 👤 UserProgress.js (ความคืบหน้าผู้ใช้)
├── 🏆 Achievement.js (รางวัล)
├── 🎯 DailyChallenge.js (ภารกิจประจำวัน)
├── 👤 UserDailyChallenge.js (ภารกิจประจำวันผู้ใช้)
└── 🎮 GameResult.js (ผลเกม)
```

### 🎵 **Services** (`/services/`)
```
services/
├── 🎵 ttsService.js (TTS Service)
└── 🎵 aiTtsService.js (AI TTS Service)
```

## 📱 **Navigation Structure**

### 🗺️ **App Navigation**
```javascript
App.js (Stack Navigator)
├── 🌟 FirstScreen
├── 📖 Onboarding1/2/3
├── 🏠 MainTab (Bottom Tab Navigator)
│   ├── 🏠 HomeScreen
│   ├── 🎁 TreasurechestScreen
│   ├── 👤 ProfileScreen
│   ├── 📋 QuestScreen
│   └── ⚙️ SettingsScreen
├── 🎯 LevelStage1/2/3
├── 🎮 NewLessonGame
├── 🔐 SignUpScreen
├── 🔑 SignInScreen
└── หน้าจออื่นๆ
```

## 🎨 **Asset Structure**

### 🖼️ **Images** (`/src/asset/`)
```
asset/
├── 🖼️ logo.png (โลโก้)
├── 🖼️ Catsmile.png (แมวยิ้ม)
├── 🖼️ Grumpy Cat.png (แมวหงุดหงิด)
├── 🖼️ happy.png (แมวสุขใจ)
├── 🖼️ catcry.png (แมวร้องไห้)
├── 🖼️ complete.png (จบแล้ว)
├── 🖼️ speaker.png (ลำโพง)
├── 🖼️ onboard1/2/3.png (ภาพแนะนำ)
└── 📁 animations/ (ไฟล์ Lottie)
    ├── cat_on_firstscreen.json
    ├── speaking.json
    ├── LoadingCat.json
    └── อื่นๆ
```

## 📦 **Dependencies**

### 📱 **Frontend Dependencies**
```json
{
  "expo": "^49.0.0",
  "react": "18.2.0",
  "react-native": "0.72.6",
  "@react-navigation/native": "^6.1.7",
  "@react-navigation/stack": "^6.3.17",
  "@react-navigation/bottom-tabs": "^6.5.8",
  "expo-speech": "~11.3.0",
  "lottie-react-native": "5.1.6",
  "expo-linear-gradient": "~12.3.0",
  "@expo/vector-icons": "^13.0.0"
}
```

### 🔧 **Backend Dependencies**
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

## 🚀 **การรันโปรเจค**

### 📱 **Frontend**
```bash
cd Frontend/thai-meow
npm install
npx expo start
```

### 🔧 **Backend**
```bash
cd Backend
npm install
npm start
```

## 📊 **Database Structure**

### 🗄️ **MongoDB Collections**
```
Collections:
├── users (ผู้ใช้)
├── vocabularies (คำศัพท์)
├── lessons (บทเรียน)
├── questions (คำถาม)
├── progresses (ความคืบหน้า)
├── achievements (รางวัล)
├── dailychallenges (ภารกิจประจำวัน)
└── gameresults (ผลเกม)
```

## 🎯 **API Endpoints**

### 🌐 **Main Endpoints**
```
API Base URL: http://localhost:3000/api

Authentication:
├── POST /auth/register (สมัครสมาชิก)
├── POST /auth/login (เข้าสู่ระบบ)
└── POST /auth/logout (ออกจากระบบ)

Vocabulary:
├── GET /vocabulary (ดึงคำศัพท์)
├── GET /vocabulary/category (ดึงตามหมวดหมู่)
└── GET /vocabulary/:id (ดึงตาม ID)

Games:
├── GET /games (ดึงเกม)
├── POST /games/result (บันทึกผลเกม)
└── GET /games/leaderboard (อันดับ)

Progress:
├── GET /progress (ดึงความคืบหน้า)
├── POST /progress (บันทึกความคืบหน้า)
└── PUT /progress/:id (อัปเดตความคืบหน้า)
```

---

## 🎉 **สรุปโครงสร้าง**

โปรเจค Thai Meow มีโครงสร้างที่ชัดเจนและเป็นระเบียบ:
- ✅ **Frontend** - React Native + Expo
- ✅ **Backend** - Node.js + Express + MongoDB
- ✅ **Navigation** - React Navigation
- ✅ **State Management** - Context API
- ✅ **Database** - MongoDB Atlas
- ✅ **Authentication** - JWT
- ✅ **TTS** - AI For Thai + Expo Speech

พร้อมใช้งานและสามารถพัฒนาต่อได้! 🚀
