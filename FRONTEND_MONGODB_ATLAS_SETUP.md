# Frontend MongoDB Atlas Setup Guide

## 🚀 การตั้งค่า Frontend ให้ใช้ MongoDB Atlas

### 1. ไฟล์ที่สร้างใหม่

#### `src/config/apiConfig.js`
- กำหนดค่า API endpoints สำหรับ MongoDB Atlas
- ตั้งค่า error handling
- Helper functions สำหรับการสร้าง URL และจัดการข้อผิดพลาด

#### `src/services/apiService.js`
- Service class สำหรับเรียกใช้ API
- Methods สำหรับ CRUD operations
- Error handling และ retry logic

#### `src/services/dataService.js`
- High-level service สำหรับจัดการข้อมูล
- Methods สำหรับแต่ละ category ของข้อมูล
- Fallback mechanisms

### 2. ไฟล์ที่อัปเดต

#### `src/screens/ThaiConsonantsGame.js`
- เพิ่ม `loadDataFromAtlas()` function
- ใช้ `apiService` แทนข้อมูล local
- มี fallback ไปยังข้อมูล local หาก API ล้มเหลว

#### `App.js`
- Import `API_CONFIG` สำหรับการตั้งค่า

### 3. การใช้งาน

#### 3.1 ใช้ API Service
```javascript
import apiService from '../services/apiService';

// ดึงข้อมูลคำศัพท์
const vocabularies = await apiService.getVocabularies();

// ดึงข้อมูลตาม category
const consonants = await apiService.getVocabulariesByCategory('basic_letters');

// ค้นหาคำศัพท์
const results = await apiService.searchVocabularies('สวัสดี');
```

#### 3.2 ใช้ Data Service
```javascript
import dataService from '../services/dataService';

// ดึงข้อมูลพยัญชนะไทย
const consonants = await dataService.getThaiConsonants();

// ดึงข้อมูลสระ
const vowels = await dataService.getThaiVowels();

// ดึงข้อมูลวรรณยุกต์
const tones = await dataService.getThaiTones();
```

### 4. Error Handling

#### 4.1 Network Error
```javascript
try {
  const data = await apiService.getVocabularies();
} catch (error) {
  if (error.message.includes('Network error')) {
    // แสดงข้อความ network error
  }
}
```

#### 4.2 Fallback to Local Data
```javascript
const loadData = async () => {
  try {
    // พยายามโหลดจาก MongoDB Atlas
    const data = await apiService.getVocabularies();
    setData(data);
  } catch (error) {
    // Fallback ไปยังข้อมูล local
    setData(localData);
  }
};
```

### 5. Configuration

#### 5.1 API Base URL
```javascript
// ใน src/config/apiConfig.js
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // เปลี่ยนเป็น URL ของ MongoDB Atlas
  // ...
};
```

#### 5.2 Environment Variables
```javascript
// สำหรับ production
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
```

### 6. Testing

#### 6.1 Test API Connection
```javascript
import apiService from '../services/apiService';

const testConnection = async () => {
  try {
    const data = await apiService.getVocabularies();
    console.log('✅ API Connection successful:', data);
  } catch (error) {
    console.error('❌ API Connection failed:', error);
  }
};
```

#### 6.2 Test Data Loading
```javascript
import dataService from '../services/dataService';

const testDataLoading = async () => {
  try {
    const consonants = await dataService.getThaiConsonants();
    console.log('✅ Consonants loaded:', consonants.length);
  } catch (error) {
    console.error('❌ Data loading failed:', error);
  }
};
```

### 7. Performance Optimization

#### 7.1 Caching
```javascript
// Cache ข้อมูลใน memory
const cache = new Map();

const getCachedData = async (key, fetchFunction) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetchFunction();
  cache.set(key, data);
  return data;
};
```

#### 7.2 Loading States
```javascript
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const loadData = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await apiService.getVocabularies();
    setData(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### 8. Troubleshooting

#### 8.1 Common Issues
- **Network Error**: ตรวจสอบ API URL และ internet connection
- **CORS Error**: ตรวจสอบ CORS settings ใน backend
- **Timeout Error**: เพิ่ม timeout value ใน API_CONFIG
- **Data Format Error**: ตรวจสอบ response format จาก API

#### 8.2 Debug Mode
```javascript
// เปิด debug mode
const DEBUG = true;

if (DEBUG) {
  console.log('API Request:', url, options);
  console.log('API Response:', response);
}
```

### 9. Production Deployment

#### 9.1 Environment Variables
```bash
# .env
EXPO_PUBLIC_API_URL=https://your-api-domain.com/api
EXPO_PUBLIC_DEBUG=false
```

#### 9.2 API URL Configuration
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'
  : process.env.EXPO_PUBLIC_API_URL;
```

## 🎉 เสร็จสิ้น!
ตอนนี้ Frontend ของคุณใช้ MongoDB Atlas แล้ว!
