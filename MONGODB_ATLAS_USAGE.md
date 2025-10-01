# MongoDB Atlas Usage Guide

## 🚀 การใช้งาน MongoDB Atlas สำหรับ Thai Meow App

### 📋 คำสั่งที่ใช้ได้

```bash
# ไปที่โฟลเดอร์ Backend
cd Backend

# ตั้งค่า MongoDB Atlas
npm run setup-atlas

# ทดสอบการเชื่อมต่อ
npm run test-atlas

# สร้างข้อมูลทดสอบ
npm run seed-atlas

# ย้ายข้อมูลจาก Local MongoDB
npm run migrate-atlas

# ทดสอบ API
npm run test-api

# เริ่ม Server
npm start

# เริ่ม Server แบบ Development
npm run dev
```

### 🔧 การตั้งค่า

#### 1. สร้างไฟล์ .env
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thai_meow?retryWrites=true&w=majority
PORT=3000
NODE_ENV=production
```

#### 2. ตั้งค่า MongoDB Atlas
1. สร้าง Cluster ใน MongoDB Atlas
2. ตั้งค่า Database User
3. ตั้งค่า Network Access (0.0.0.0/0)
4. คัดลอก Connection String

### 📊 ข้อมูลใน Database

#### Collections:
- **vocabularies** - คำศัพท์ภาษาไทย
- **lessons** - บทเรียน
- **userprogress** - ความคืบหน้าผู้ใช้
- **gameresults** - ผลการเล่นเกม

#### Indexes:
- `vocabularies.word` - สำหรับค้นหาคำศัพท์
- `vocabularies.lesson_id` - สำหรับค้นหาตามบทเรียน
- `vocabularies.category` - สำหรับค้นหาตามหมวดหมู่
- `lessons.lesson_id` - สำหรับค้นหาบทเรียน
- `lessons.level` - สำหรับค้นหาตามระดับ
- `userprogress.user_id` - สำหรับค้นหาความคืบหน้า

### 🧪 การทดสอบ

#### 1. ทดสอบการเชื่อมต่อ
```bash
npm run test-atlas
```

#### 2. ทดสอบ API
```bash
# เริ่ม Server
npm start

# ใน Terminal อื่น
npm run test-api
```

#### 3. ทดสอบใน Browser
- `http://localhost:3000/api/vocabulary`
- `http://localhost:3000/api/games`
- `http://localhost:3000/api/arrange-sentence`

### 🔍 Troubleshooting

#### ปัญหาการเชื่อมต่อ
- ตรวจสอบ Connection String
- ตรวจสอบ Username และ Password
- ตรวจสอบ IP Whitelist
- ตรวจสอบ Internet Connection

#### ปัญหาการย้ายข้อมูล
- ตรวจสอบ Local MongoDB ทำงานอยู่
- ตรวจสอบข้อมูลใน Local Database
- ตรวจสอบ Connection String ของ Atlas

#### ปัญหา API
- ตรวจสอบ Server ทำงานอยู่
- ตรวจสอบ Port 3000
- ตรวจสอบ CORS Settings

### 📈 การ Monitor

#### MongoDB Atlas Dashboard
- ตรวจสอบการใช้งาน
- Monitor Performance
- ดู Usage Statistics
- ตรวจสอบ Connection Pool

#### Logs
- ตรวจสอบ Server Logs
- ตรวจสอบ Error Logs
- ตรวจสอบ Connection Logs

### 🎯 Best Practices

#### 1. Connection Management
- ใช้ Connection Pool
- ตั้งค่า Timeout ที่เหมาะสม
- ตรวจสอบ Connection State

#### 2. Data Management
- ใช้ Indexes เพื่อประสิทธิภาพ
- ตรวจสอบ Data Size
- Backup ข้อมูลเป็นประจำ

#### 3. Security
- ใช้ Strong Password
- ตั้งค่า IP Whitelist
- ใช้ SSL/TLS

### 🚀 Production Deployment

#### 1. Environment Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thai_meow?retryWrites=true&w=majority
PORT=3000
NODE_ENV=production
```

#### 2. Server Configuration
- ใช้ PM2 หรือ Docker
- ตั้งค่า Load Balancer
- ตั้งค่า Health Check

#### 3. Monitoring
- ใช้ MongoDB Atlas Monitoring
- ตั้งค่า Alerts
- ตรวจสอบ Performance

## 🎉 เสร็จสิ้น!
ตอนนี้แอพของคุณใช้ MongoDB Atlas แล้ว!
