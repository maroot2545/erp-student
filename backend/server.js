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

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
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
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });

    req.on('error', reject);
  });
}

function getNextId(items) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
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

  if (req.method === 'GET' && pathname === '/api/dashboard') {
    const pendingInvoices = db.invoices.filter((invoice) => invoice.status === 'pending').length;
    const lowStock = db.inventory.filter((item) => item.qty < item.minQty).length;

    sendJson(res, 200, {
      kpi: {
        students: db.students.length,
        invoicesPending: pendingInvoices,
        employees: db.employees.length,
        lowStock
      },
      modules: Object.keys(modules)
    });
    return;
  }

  const listMatch = pathname?.match(/^\/api\/(students|invoices|employees|inventory)$/);
  if (req.method === 'GET' && listMatch) {
    const key = modules[listMatch[1]];
    sendJson(res, 200, { data: db[key] });
    return;
  }

  const createMatch = pathname?.match(/^\/api\/(students|invoices|employees|inventory)$/);
  if (req.method === 'POST' && createMatch) {
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
