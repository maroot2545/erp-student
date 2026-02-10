# ERP Student (React + Backend)

ระบบ ERP สำหรับสถานศึกษา โดยมี React (frontend) และ Node.js API (backend)

## ฟีเจอร์หลักฝั่ง Frontend
- แดชบอร์ดภาพรวม KPI
- โมดูลหลัก: การเงิน, นักเรียน, HR, สต็อก
- รายการงานที่ต้องติดตาม
- รองรับหน้าจอ desktop/mobile แบบ responsive

## ฟีเจอร์หลักฝั่ง Backend
- Health check: `GET /api/health`
- Dashboard summary: `GET /api/dashboard`
- CRUD (เบื้องต้น):
  - `GET /api/students`, `POST /api/students`
  - `GET /api/invoices`, `POST /api/invoices`
  - `GET /api/employees`, `POST /api/employees`
  - `GET /api/inventory`, `POST /api/inventory`

> ข้อมูลถูกเก็บแบบ in-memory เหมาะสำหรับเริ่มต้นพัฒนา/ทดสอบ

## เริ่มต้นใช้งาน Frontend
```bash
npm install
npm run dev
```

## เริ่มต้นใช้งาน Backend
```bash
npm run server
```

Backend จะรันที่ `http://localhost:4000`

## Build สำหรับ production (Frontend)
```bash
npm run build
npm run preview
```
