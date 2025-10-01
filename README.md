# 🇹🇭 Thai Meow - Thai Language Learning App

A comprehensive Thai language learning application built with React Native and Node.js, featuring interactive games, AI-powered text-to-speech, and progress tracking.

![Thai Meow App](https://img.shields.io/badge/React%20Native-Expo-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![Database](https://img.shields.io/badge/Database-MongoDB-orange)
![TTS](https://img.shields.io/badge/TTS-AI%20For%20Thai%20%2B%20ElevenLabs-red)

## ✨ Features

### 🎮 Interactive Learning Games
- **Matching Game**: Match Thai words with English translations
- **Arrange Sentence**: Arrange words to form correct sentences
- **Multiple Choice**: Choose the correct answer from options
- **Drag & Drop**: Interactive vocabulary building
- **Fill in the Blanks**: Complete sentences with missing words

### 📚 Comprehensive Content
- **44 Thai Consonants** with pronunciation guides
- **10 Thai Vowels** with audio examples
- **5 Thai Tones** with visual indicators
- **150+ Vocabulary Words** across 10 categories:
  - Greetings (การทักทาย)
  - Family (ครอบครัว)
  - Numbers (ตัวเลข)
  - Colors (สี)
  - Food (อาหาร)
  - Animals (สัตว์)
  - Body Parts (อวัยวะ)
  - And more!

### 🔊 AI-Powered Text-to-Speech
- **AI For Thai TTS**: High-quality Thai pronunciation
- **ElevenLabs Integration**: Premium voice synthesis
- **Vaja9 TTS**: Advanced Thai speech synthesis
- **Offline Audio Caching**: Fast, reliable audio playback

### 📊 Progress Tracking
- **User Profiles**: Personalized learning experience
- **Achievement System**: Unlock badges and rewards
- **Streak Tracking**: Daily learning motivation
- **XP & Leveling**: Gamified progression system
- **Leaderboard**: Compete with other learners

### 🎯 Game Modes
- **Lesson Mode**: Structured learning path
- **Practice Mode**: Free-form practice
- **Quiz Mode**: Test your knowledge
- **Challenge Mode**: Daily challenges and goals

## 🛠️ Technical Stack

### Frontend
- **React Native** with Expo framework
- **AsyncStorage** for local data persistence
- **Expo AV** for audio playback
- **React Navigation** for app navigation
- **Context API** for state management

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT Authentication** for user management
- **RESTful API** design
- **CORS** enabled for cross-origin requests

### Database Models
- **User**: User profiles and authentication
- **Vocabulary**: Thai words and translations
- **Lesson**: Learning modules and content
- **Progress**: User learning progress
- **Achievement**: Badges and rewards
- **GameResult**: Game performance tracking

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pixsphet/Project-Thai-Meow.git
   cd Project-Thai-Meow
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Frontend/thai-meow
   npm install
   ```

4. **Set up Environment Variables**
   ```bash
   # Backend/.env
   MONGODB_URI=mongodb://localhost:27017/thai-meow
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

5. **Start MongoDB**
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Or use MongoDB Atlas
   # Update MONGODB_URI in .env file
   ```

6. **Seed the Database**
   ```bash
   cd Backend
   node seed-atlas.js
   node seed-complete-vocabulary.js
   ```

7. **Start the Backend Server**
   ```bash
   cd Backend
   node server.js
   ```

8. **Start the Frontend App**
   ```bash
   cd Frontend/thai-meow
   npx expo start
   ```

## 📱 App Structure

```
Project-Thai-Meow/
├── Backend/                 # Node.js Backend
│   ├── models/             # MongoDB Models
│   ├── routes/             # API Routes
│   ├── services/           # TTS Services
│   ├── seed/               # Database Seeding
│   └── server.js           # Main Server File
├── Frontend/               # React Native Frontend
│   └── thai-meow/
│       ├── src/
│       │   ├── components/ # Reusable Components
│       │   ├── screens/    # App Screens
│       │   ├── services/   # API Services
│       │   └── utils/      # Utility Functions
│       └── App.js          # Main App Component
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Vocabulary
- `GET /api/vocab-words` - Get all vocabulary
- `GET /api/vocab-words/lesson/:lessonKey` - Get lesson vocabulary
- `GET /api/vocab-words/random` - Get random vocabulary

### Games
- `POST /api/games/matching` - Matching game data
- `POST /api/games/arrange-sentence` - Sentence arrangement game
- `POST /api/games/quiz` - Quiz game data

### Progress
- `GET /api/progress/:userId` - Get user progress
- `POST /api/progress` - Update user progress
- `GET /api/achievements` - Get user achievements

## 🎨 UI/UX Features

- **Duolingo-style Interface**: Familiar, intuitive design
- **Cat Mascot**: Friendly Thai Meow character
- **Smooth Animations**: Engaging user experience
- **Responsive Design**: Works on all screen sizes
- **Dark/Light Theme**: Customizable appearance
- **Haptic Feedback**: Tactile response for interactions

## 🔒 Security Features

- **JWT Authentication**: Secure user sessions
- **Password Hashing**: bcrypt encryption
- **Input Validation**: Sanitized user inputs
- **CORS Protection**: Cross-origin security
- **Rate Limiting**: API abuse prevention

## 📈 Performance Optimizations

- **Audio Caching**: Pre-loaded audio files
- **Image Optimization**: Compressed assets
- **Lazy Loading**: On-demand content loading
- **Database Indexing**: Optimized queries
- **Memory Management**: Efficient resource usage

## 🧪 Testing

```bash
# Backend Tests
cd Backend
npm test

# Frontend Tests
cd Frontend/thai-meow
npm test
```

## 📦 Deployment

### Backend Deployment
1. Deploy to Heroku, Vercel, or AWS
2. Set up MongoDB Atlas
3. Configure environment variables
4. Deploy with `git push heroku main`

### Frontend Deployment
1. Build with `expo build`
2. Deploy to App Store/Google Play
3. Or use Expo EAS Build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AI For Thai** for Thai TTS services
- **ElevenLabs** for premium voice synthesis
- **Expo** for React Native framework
- **MongoDB** for database services
- **Thai Language Community** for content inspiration

## 📞 Support

For support, email support@thai-meow.com or create an issue on GitHub.

---

**Made with ❤️ for Thai language learners worldwide**

[![GitHub stars](https://img.shields.io/github/stars/pixsphet/Project-Thai-Meow?style=social)](https://github.com/pixsphet/Project-Thai-Meow)
[![GitHub forks](https://img.shields.io/github/forks/pixsphet/Project-Thai-Meow?style=social)](https://github.com/pixsphet/Project-Thai-Meow)
[![GitHub issues](https://img.shields.io/github/issues/pixsphet/Project-Thai-Meow)](https://github.com/pixsphet/Project-Thai-Meow/issues)