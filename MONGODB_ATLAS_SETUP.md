# MongoDB Atlas Setup Guide

## 🚀 การตั้งค่า MongoDB Atlas สำหรับ Thai Meow App

### 1. สร้าง MongoDB Atlas Account
1. ไปที่ [MongoDB Atlas](https://www.mongodb.com/atlas)
2. สมัครสมาชิกหรือเข้าสู่ระบบ
3. สร้าง Cluster ใหม่ (เลือก Free Tier)

### 2. ตั้งค่า Database User
1. ไปที่ "Database Access" ในเมนูซ้าย
2. คลิก "Add New Database User"
3. ตั้งค่า Username และ Password
4. เลือก "Read and write to any database"
5. คลิก "Add User"

### 3. ตั้งค่า Network Access
1. ไปที่ "Network Access" ในเมนูซ้าย
2. คลิก "Add IP Address"
3. เลือก "Allow access from anywhere" (0.0.0.0/0)
4. คลิก "Confirm"

### 4. รับ Connection String
1. ไปที่ "Database" ในเมนูซ้าย
2. คลิก "Connect" ที่ Cluster ของคุณ
3. เลือก "Connect your application"
4. คัดลอก Connection String

### 5. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` ในโฟลเดอร์ `Backend/`:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thai_meow?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=production

# AI For Thai API Configuration
AI_FOR_THAI_API_KEY=your_ai_for_thai_api_key_here
AI_FOR_THAI_BASE_URL=https://api.aiforthai.in.th
```

### 6. รันคำสั่งตั้งค่า

```bash
# ไปที่โฟลเดอร์ Backend
cd Backend

# ตั้งค่า MongoDB Atlas
npm run setup-atlas

# ทดสอบการเชื่อมต่อ
npm run test-atlas

# ย้ายข้อมูลจาก Local MongoDB ไป Atlas
npm run migrate-atlas

# เริ่ม Server
npm start
```

### 7. ตรวจสอบการทำงาน
1. เปิด Browser ไปที่ `http://localhost:3000`
2. ทดสอบ API endpoints:
   - `GET /api/vocabulary` - ดูคำศัพท์
   - `GET /api/games` - ดูเกม
   - `GET /api/arrange-sentence` - ดูประโยค

### 8. Troubleshooting

#### ปัญหาการเชื่อมต่อ
- ตรวจสอบ Connection String
- ตรวจสอบ Username และ Password
- ตรวจสอบ IP Whitelist
- ตรวจสอบ Internet Connection

#### ปัญหาการย้ายข้อมูล
- ตรวจสอบ Local MongoDB ทำงานอยู่
- ตรวจสอบข้อมูลใน Local Database
- ตรวจสอบ Connection String ของ Atlas

### 9. ข้อมูลสำคัญ
- **Database Name**: `thai_meow`
- **Collections**: `vocabularies`, `lessons`, `userprogress`, `gameresults`
- **Indexes**: สร้างอัตโนมัติเพื่อประสิทธิภาพที่ดี

### 10. การบำรุงรักษา
- ตรวจสอบการใช้งานใน MongoDB Atlas Dashboard
- Monitor Performance และ Usage
- Backup ข้อมูลเป็นประจำ
- อัปเดต Connection String เมื่อจำเป็น

## 🎉 เสร็จสิ้น!
ตอนนี้แอพของคุณใช้ MongoDB Atlas แล้ว!