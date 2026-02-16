import { useMemo, useState } from 'react';

const API_BASE = 'http://localhost:4000/api';

const todoTasks = [
  'อนุมัติใบขอซื้ออุปกรณ์ห้องปฏิบัติการ',
  'ติดตามนักเรียนค้างชำระ 15 ราย',
  'ตรวจสอบรายงานเงินเดือนรอบสิ้นเดือน',
  'อัปเดตแผนการรับสมัครภาคเรียนใหม่'
];

function App() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [kpi, setKpi] = useState(null);
  const [erpModules, setErpModules] = useState([]);

  const kpis = useMemo(() => {
    if (!kpi) {
      return [];
    }
    return [
      { label: 'นักเรียนทั้งหมด', value: String(kpi.students), trend: 'Live data' },
      { label: 'บิลค้างชำระ', value: String(kpi.invoicesPending), trend: 'Live data' },
      { label: 'พนักงาน', value: String(kpi.employees), trend: 'Live data' },
      { label: 'สินค้าใกล้หมด', value: String(kpi.lowStock), trend: 'Live data' }
    ];
  }, [kpi]);

  async function fetchDashboard(nextToken) {
    const [dashboardRes, modulesRes] = await Promise.all([
      fetch(`${API_BASE}/dashboard`, {
        headers: {
          Authorization: `Bearer ${nextToken}`
        }
      }),
      fetch(`${API_BASE}/modules`, {
        headers: {
          Authorization: `Bearer ${nextToken}`
        }
      })
    ]);

    const dashboard = await dashboardRes.json();
    const modules = await modulesRes.json();

    if (!dashboardRes.ok) {
      throw new Error(dashboard.error || 'โหลดข้อมูล dashboard ไม่สำเร็จ');
    }

    if (!modulesRes.ok) {
      throw new Error(modules.error || 'โหลดรายการโมดูล ERP ไม่สำเร็จ');
    }

    setKpi(dashboard.kpi);
    setErpModules(modules.data || []);
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
      }

      setToken(data.token);
      setUser(data.user);
      await fetchDashboard(data.token);
    } catch (loginError) {
      setError(loginError.message);
      setToken('');
      setUser(null);
      setKpi(null);
      setErpModules([]);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken('');
    setUser(null);
    setKpi(null);
    setErpModules([]);
    setError('');
  }

  if (!token) {
    return (
      <div className="login-page">
        <form className="login-card" onSubmit={handleLogin}>
          <h1>ERP Student Login</h1>
          <p>เข้าสู่ระบบเพื่อใช้งาน dashboard</p>

          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="admin"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="admin123"
          />

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>

          <small>Demo account: admin/admin123 หรือ finance/finance123</small>
        </form>
      </div>
    );
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>ERP Student</h1>
        <p className="user-badge">
          {user?.name} ({user?.role})
        </p>
        <nav>
          {['Dashboard', 'Finance', 'Students', 'HR', 'Inventory', 'Reports', 'Settings'].map((item) => (
            <button key={item} type="button" className="menu-item">
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div>
            <p className="eyebrow">ระบบบริหารโรงเรียน</p>
            <h2>ภาพรวม ERP</h2>
          </div>
          <div className="header-actions">
            <button type="button" className="primary-btn">
              + สร้างเอกสารใหม่
            </button>
            <button type="button" className="ghost-btn" onClick={handleLogout}>
              ออกจากระบบ
            </button>
          </div>
        </header>

        <section className="kpi-grid">
          {kpis.map((item) => (
            <article key={item.label} className="kpi-card">
              <p>{item.label}</p>
              <h3>{item.value}</h3>
              <span>{item.trend}</span>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <div className="panel">
            <h3>ฟังก์ชัน ERP ที่ควรมี (ครบโมดูล)</h3>
            <div className="module-list">
              {erpModules.map((module) => (
                <article key={module.code} className="module-card">
                  <div className="module-header">
                    <h4>{module.name}</h4>
                    <span className={`status-badge ${module.status}`}>{module.status}</span>
                  </div>
                  <ul className="feature-list">
                    {module.features?.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3>งานที่ต้องทำ</h3>
            <ul>
              {todoTasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
