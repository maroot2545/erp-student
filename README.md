# ERP Student (React + Backend)

ระบบ ERP สำหรับสถานศึกษา โดยมี React (frontend) และ Node.js API (backend)

## สิ่งที่ต้องมี
- Node.js 18+ (แนะนำ 20+)
- npm 9+

ตรวจสอบเวอร์ชัน:
```bash
node -v
npm -v
```

## วิธีการเปิดใช้งาน (ใช้งานจริง)

### 1) ติดตั้ง dependencies
```bash
npm install
```

### 2) เปิด Backend API
รันคำสั่งนี้ใน Terminal แรก:
```bash
npm run server
```

เมื่อสำเร็จจะเห็นข้อความ:
```text
ERP backend running on http://localhost:4000
```

### 3) เปิด Frontend
รันคำสั่งนี้ใน Terminal ที่สอง:
```bash
npm run dev
```

จากนั้นเปิดเบราว์เซอร์ที่ URL ที่ Vite แสดง (ปกติคือ `http://localhost:5173`)

---

## ตรวจสอบว่า backend พร้อมใช้งาน

### Health check
```bash
curl http://localhost:4000/api/health
```
คาดหวังผลลัพธ์:
```json
{"status":"ok","service":"erp-student-backend"}
```

### Dashboard summary
```bash
curl http://localhost:4000/api/dashboard
```

---

## API ที่มีให้ใช้งาน
- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/students`
- `POST /api/students`
- `GET /api/invoices`
- `POST /api/invoices`
- `GET /api/employees`
- `POST /api/employees`
- `GET /api/inventory`
- `POST /api/inventory`

ตัวอย่างเพิ่มนักเรียน:
```bash
curl -X POST http://localhost:4000/api/students \
  -H "Content-Type: application/json" \
  -d '{"code":"STU-010","name":"Demo User","grade":"M.2","status":"active"}'
```

> หมายเหตุ: backend ปัจจุบันเก็บข้อมูลแบบ in-memory (ข้อมูลจะหายเมื่อ restart server)

---

## คำสั่งสำหรับ production ฝั่ง Frontend
```bash
npm run build
npm run preview
```

## ปัญหาที่พบบ่อย
- ถ้า `npm install` ไม่ผ่าน ให้ตรวจสอบ network/proxy/registry ขององค์กร
- ถ้าพอร์ต 4000 ถูกใช้งานอยู่ ให้ปิดโปรเซสเดิมก่อน แล้วรันใหม่
- ถ้า frontend เรียก API ไม่ได้ ให้เช็คว่า backend ยังรันอยู่ที่ `http://localhost:4000`
