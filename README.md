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

### 3) เปิด Frontend
รันคำสั่งนี้ใน Terminal ที่สอง:
```bash
npm run dev
```

จากนั้นเปิดเบราว์เซอร์ที่ URL ที่ Vite แสดง (ปกติคือ `http://localhost:5173`)

---

## ERP ครบระบบควรมีฟังก์ชันอะไรบ้าง
ระบบนี้มีการจัดหมวดฟังก์ชันหลักแบบครบโมดูล ดังนี้

1. **การเงินและบัญชี**
   - ผังบัญชี, AP/AR, รับ/จ่าย, งบการเงิน, ภาษี
2. **ทะเบียนนักเรียนและวิชาการ**
   - ประวัตินักเรียน/ผู้ปกครอง, ลงทะเบียน, ตารางเรียน, ผลการเรียน, การเข้าเรียน
3. **ทรัพยากรบุคคล (HR)**
   - ข้อมูลพนักงาน, เวลา/ลา/OT, เงินเดือน, ประเมินผล, โครงสร้างองค์กร
4. **จัดซื้อและคลังพัสดุ**
   - PR/PO, รับเข้า/เบิกจ่าย, นับสต็อก, แจ้งเตือนขั้นต่ำ, ซัพพลายเออร์
5. **รับสมัครและ CRM**
   - lead, pipeline, นัดหมาย, สื่อสารผู้ปกครอง, conversion report
6. **รายงานและ BI**
   - executive dashboard, analytics report, export, scheduled report, role-based report access

---

## การใช้งานระบบ Login
หน้าแรกจะเป็นหน้า login ก่อนเข้า dashboard

### บัญชีทดสอบ
- `admin / admin123`
- `finance / finance123`

### ทดสอบ login ด้วย API
```bash
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

ผลลัพธ์จะได้ `token` สำหรับเรียก API อื่น ๆ

---

## API ที่มีให้ใช้งาน
### Public routes
- `GET /api/health`
- `POST /api/login`

### Protected routes (ต้อง login ก่อน)
- `GET /api/me`
- `GET /api/dashboard`
- `GET /api/modules`  ← รายการฟังก์ชัน ERP ครบโมดูล
- `GET /api/students`
- `POST /api/students`
- `GET /api/invoices`
- `POST /api/invoices`
- `GET /api/employees`
- `POST /api/employees`
- `GET /api/inventory`
- `POST /api/inventory`

ตัวอย่างเรียก API ที่ต้องใช้ token:
```bash
curl http://localhost:4000/api/modules \
  -H "Authorization: Bearer <TOKEN>"
```

> หมายเหตุ: backend ปัจจุบันเก็บข้อมูลแบบ in-memory (ข้อมูลจะหายเมื่อ restart server)

---

## คำสั่งสำหรับ production ฝั่ง Frontend
```bash
npm run build
npm run preview
```
