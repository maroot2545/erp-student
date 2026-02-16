import { createServer } from 'node:http';
import { parse } from 'node:url';

const PORT = Number(process.env.PORT || 4000);

const db = {
  students: [
    { id: 1, code: 'STU-001', name: 'Anan S.', grade: 'M.4', status: 'active' },
    { id: 2, code: 'STU-002', name: 'Mali K.', grade: 'M.5', status: 'active' },
    { id: 3, code: 'STU-003', name: 'Narin P.', grade: 'M.6', status: 'inactive' }
  ],
  invoices: [
    { id: 1, invoiceNo: 'INV-2026-001', studentId: 1, amount: 12500, status: 'paid' },
    { id: 2, invoiceNo: 'INV-2026-002', studentId: 2, amount: 9800, status: 'pending' }
  ],
  employees: [
    { id: 1, employeeNo: 'EMP-001', name: 'Somchai T.', department: 'Finance', status: 'active' },
    { id: 2, employeeNo: 'EMP-002', name: 'Nuttaya P.', department: 'Academic', status: 'active' }
  ],
  inventory: [
    { id: 1, sku: 'ITM-001', name: 'A4 Paper', qty: 140, minQty: 80 },
    { id: 2, sku: 'ITM-002', name: 'Whiteboard Marker', qty: 35, minQty: 40 }
  ]
};

const modules = {
  students: 'students',
  invoices: 'invoices',
  employees: 'employees',
  inventory: 'inventory'
};


const moduleCatalog = [
  {
    code: 'finance',
    name: 'การเงินและบัญชี',
    status: 'ready',
    features: [
      'ผังบัญชี (Chart of Accounts)',
      'บัญชีเจ้าหนี้/ลูกหนี้ (AP/AR)',
      'รับชำระ/จ่ายชำระ',
      'งบการเงิน (P&L, Balance Sheet, Cashflow)',
      'ภาษีและใบกำกับภาษี'
    ]
  },
  {
    code: 'student',
    name: 'ทะเบียนนักเรียนและวิชาการ',
    status: 'ready',
    features: [
      'ข้อมูลนักเรียนและผู้ปกครอง',
      'ลงทะเบียนเรียน/ย้ายห้อง',
      'ตารางเรียน/ตารางสอน',
      'วัดผล/ผลการเรียน',
      'บันทึกการเข้าเรียน/พฤติกรรม'
    ]
  },
  {
    code: 'hr',
    name: 'ทรัพยากรบุคคล (HR)',
    status: 'ready',
    features: [
      'แฟ้มประวัติพนักงาน',
      'เวลาทำงาน/การลา/OT',
      'เงินเดือน/สลิปเงินเดือน',
      'ประเมินผลพนักงาน',
      'โครงสร้างองค์กรและตำแหน่ง'
    ]
  },
  {
    code: 'inventory',
    name: 'จัดซื้อและคลังพัสดุ',
    status: 'ready',
    features: [
      'ใบขอซื้อ/ใบสั่งซื้อ (PR/PO)',
      'รับสินค้าเข้า/เบิกจ่าย',
      'นับสต็อก/ปรับปรุงสต็อก',
      'แจ้งเตือนสินค้าต่ำกว่ากำหนด',
      'ซัพพลายเออร์และราคาทุน'
    ]
  },
  {
    code: 'crm',
    name: 'รับสมัครและ CRM',
    status: 'planning',
    features: [
      'Lead ผู้สนใจเรียน',
      'Pipeline การสมัคร',
      'นัดหมายเยี่ยมชมโรงเรียน',
      'การสื่อสารกับผู้ปกครอง',
      'รายงาน conversion'
    ]
  },
  {
    code: 'reports',
    name: 'รายงานและ BI',
    status: 'ready',
    features: [
      'Dashboard ผู้บริหาร',
      'รายงานเชิงวิเคราะห์',
      'ส่งออกข้อมูล Excel/PDF',
      'ตั้งเวลาออกรายงานอัตโนมัติ',
      'สิทธิ์เข้าถึงรายงานตามบทบาท'
    ]
  }
];

const users = [
  { id: 1, username: 'admin', password: 'admin123', name: 'System Admin', role: 'admin' },
  { id: 2, username: 'finance', password: 'finance123', name: 'Finance Officer', role: 'finance' }
];

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body too large'));
      }
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });

    req.on('error', reject);
  });
}

function getNextId(items) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

function createToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 8
  };
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

function getUserFromToken(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    return null;
  }

  const token = auth.slice(7);
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
    if (!decoded?.exp || decoded.exp < Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

function requireAuth(req, res) {
  const user = getUserFromToken(req);
  if (!user) {
    sendJson(res, 401, { error: 'Unauthorized. Please login first.' });
    return null;
  }
  return user;
}

function handler(req, res) {
  const { pathname } = parse(req.url || '', true);

  if (req.method === 'OPTIONS') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, { status: 'ok', service: 'erp-student-backend' });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/login') {
    readBody(req)
      .then((payload) => {
        const username = String(payload.username || '').trim();
        const password = String(payload.password || '').trim();

        if (!username || !password) {
          sendJson(res, 400, { error: 'username and password are required' });
          return;
        }

        const user = users.find((item) => item.username === username && item.password === password);
        if (!user) {
          sendJson(res, 401, { error: 'Invalid credentials' });
          return;
        }

        const token = createToken(user);
        sendJson(res, 200, {
          token,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role
          }
        });
      })
      .catch((error) => {
        sendJson(res, 400, { error: error.message });
      });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/me') {
    const user = requireAuth(req, res);
    if (!user) {
      return;
    }
    sendJson(res, 200, { user });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/modules') {
    const user = requireAuth(req, res);
    if (!user) {
      return;
    }

    sendJson(res, 200, { data: moduleCatalog });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/dashboard') {
    const user = requireAuth(req, res);
    if (!user) {
      return;
    }

    const pendingInvoices = db.invoices.filter((invoice) => invoice.status === 'pending').length;
    const lowStock = db.inventory.filter((item) => item.qty < item.minQty).length;

    sendJson(res, 200, {
      kpi: {
        students: db.students.length,
        invoicesPending: pendingInvoices,
        employees: db.employees.length,
        lowStock
      },
      modules: moduleCatalog.map((module) => ({ code: module.code, name: module.name, status: module.status })),
      user
    });
    return;
  }

  const listMatch = pathname?.match(/^\/api\/(students|invoices|employees|inventory)$/);
  if (req.method === 'GET' && listMatch) {
    const user = requireAuth(req, res);
    if (!user) {
      return;
    }

    const key = modules[listMatch[1]];
    sendJson(res, 200, { data: db[key] });
    return;
  }

  const createMatch = pathname?.match(/^\/api\/(students|invoices|employees|inventory)$/);
  if (req.method === 'POST' && createMatch) {
    const user = requireAuth(req, res);
    if (!user) {
      return;
    }

    const key = modules[createMatch[1]];

    readBody(req)
      .then((payload) => {
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
          sendJson(res, 400, { error: 'Body must be an object' });
          return;
        }

        const item = { id: getNextId(db[key]), ...payload };
        db[key].push(item);
        sendJson(res, 201, { data: item });
      })
      .catch((error) => {
        sendJson(res, 400, { error: error.message });
      });
    return;
  }

  sendJson(res, 404, { error: 'Not Found' });
}

const server = createServer(handler);

server.listen(PORT, () => {
  console.log(`ERP backend running on http://localhost:${PORT}`);
});
