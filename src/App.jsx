const kpis = [
  { label: 'นักเรียนทั้งหมด', value: '1,280', trend: '+3.2%' },
  { label: 'บิลค้างชำระ', value: '92', trend: '-1.1%' },
  { label: 'พนักงาน', value: '87', trend: '+0.8%' },
  { label: 'รายรับเดือนนี้', value: '฿2,480,000', trend: '+6.5%' }
];

const modules = [
  {
    title: 'การเงินและบัญชี',
    description: 'จัดการใบแจ้งหนี้ รับชำระเงิน กระทบยอด และสรุปรายงานการเงิน'
  },
  {
    title: 'ทะเบียนนักเรียน',
    description: 'เก็บข้อมูลนักเรียน ประวัติการลงทะเบียน และติดตามสถานะการเรียน'
  },
  {
    title: 'ทรัพยากรบุคคล (HR)',
    description: 'บริหารข้อมูลบุคลากร คำนวณเงินเดือน และติดตามการลา'
  },
  {
    title: 'จัดซื้อและสต็อก',
    description: 'ควบคุมคำสั่งซื้อ วัสดุการเรียน และแจ้งเตือนสินค้าต่ำกว่ากำหนด'
  }
];

const todoTasks = [
  'อนุมัติใบขอซื้ออุปกรณ์ห้องปฏิบัติการ',
  'ติดตามนักเรียนค้างชำระ 15 ราย',
  'ตรวจสอบรายงานเงินเดือนรอบสิ้นเดือน',
  'อัปเดตแผนการรับสมัครภาคเรียนใหม่'
];

function App() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>ERP Student</h1>
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
          <button type="button" className="primary-btn">
            + สร้างเอกสารใหม่
          </button>
        </header>

        <section className="kpi-grid">
          {kpis.map((item) => (
            <article key={item.label} className="kpi-card">
              <p>{item.label}</p>
              <h3>{item.value}</h3>
              <span>{item.trend} จากเดือนก่อน</span>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <div className="panel">
            <h3>โมดูลหลัก</h3>
            <div className="module-list">
              {modules.map((module) => (
                <article key={module.title} className="module-card">
                  <h4>{module.title}</h4>
                  <p>{module.description}</p>
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
