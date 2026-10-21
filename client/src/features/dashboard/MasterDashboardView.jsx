import React, { useState, useEffect } from 'react';

export default function MasterDashboardView({ onNavigate, setActiveTab, onOpenQuickAdd, onOpenTrace }) {
  const navigate = (tab) => {
    if (typeof onNavigate === 'function') {
      onNavigate(tab);
    } else if (typeof setActiveTab === 'function') {
      setActiveTab(tab);
    }
  };

  const [metrics, setMetrics] = useState({
    activeLeads: 21,
    confirmedOrders: 7,
    openTasks: 24,
    productionOutput: 84,
    receivable: 604000,
    avgPerformance: 90,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch live counts from backend
    Promise.all([
      fetch('/api/enquiries').then((r) => r.json()).catch(() => ({ total: 21 })),
      fetch('/api/sales-orders').then((r) => r.json()).catch(() => ({ total: 7 })),
      fetch('/api/tasks').then((r) => r.json()).catch(() => ({ data: [] })),
      fetch('/api/finance/receivables').then((r) => r.json()).catch(() => ({ data: { total: 604000 } })),
    ]).then(([enq, orders, tasks, recv]) => {
      setMetrics((prev) => ({
        ...prev,
        activeLeads: enq?.total || enq?.data?.length || 21,
        confirmedOrders: orders?.total || orders?.data?.length || 7,
        openTasks: tasks?.data?.length || 24,
        receivable: recv?.data?.total || recv?.data?.outstanding || 604000,
      }));
      setLoading(false);
    });
  }, []);

  const matrixRows = [
    {
      module: 'M1 Sales & CRM',
      kpi: 'Lead Conversion Ratio',
      target: '35%',
      achieved: '38%',
      risk: 'Healthy Pipeline',
      status: 'green',
      actionTab: 'sales',
    },
    {
      module: 'M2 Vendor & Supply',
      kpi: 'PO Delivery On-Time',
      target: '95%',
      achieved: '92%',
      risk: '2 Orders Pending Delivery',
      status: 'amber',
      actionTab: 'vendors',
    },
    {
      module: 'M3 Engineering',
      kpi: 'BOM Cost Accuracy',
      target: '±2%',
      achieved: '99.1%',
      risk: 'All BOMs Released',
      status: 'green',
      actionTab: 'engineering',
    },
    {
      module: 'M4 Production',
      kpi: 'Plant Capacity Utilization',
      target: '85%',
      achieved: '84%',
      risk: 'On Target',
      status: 'green',
      actionTab: 'production',
    },
    {
      module: 'M5 Field & Site',
      kpi: 'Site Handover SLA',
      target: '14 Days',
      achieved: '12 Days',
      risk: 'Substation Site In Progress',
      status: 'green',
      actionTab: 'projects',
    },
    {
      module: 'M6 Commercial',
      kpi: 'Debtor Collection DSO',
      target: '45 Days',
      achieved: '38 Days',
      risk: '₹68,000 Follow-up Due',
      status: 'amber',
      actionTab: 'finance',
    },
    {
      module: 'M7 Workforce',
      kpi: 'Task SLA Completion',
      target: '90%',
      achieved: '90%',
      risk: '3 High Priority Open',
      status: 'green',
      actionTab: 'tasks',
    },
  ];

  const criticalActions = [
    {
      id: 1,
      title: '5 quotations need client follow-up',
      subtitle: 'Sales / Calling team',
      tag: 'Today',
      color: '#f59e0b',
      tab: 'sales',
    },
    {
      id: 2,
      title: 'Material inspection for Copper Bonded Rods (GRN-001)',
      subtitle: 'Warehouse Inward Gate',
      tag: 'Urgent',
      color: '#ef4444',
      tab: 'inventory',
    },
    {
      id: 3,
      title: 'JOB-TEST-001 Soil Resistivity survey sign-off',
      subtitle: 'Field Site Pune',
      tag: 'Action',
      color: '#0e7054',
      tab: 'projects',
    },
    {
      id: 4,
      title: 'Tax invoice INV-TEST-002 overdue by 30 days',
      subtitle: 'Finance / Accounts Dept',
      tag: 'Finance',
      color: '#f59e0b',
      tab: 'finance',
    },
  ];

  return (
    <div className="dashboard-wrapper">
      {/* Hero Green Banner Matching Screenshot */}
      <div className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">YASH GROUP · VERSION 3 COMPLETE</div>
          <h2 className="hero-title">Daily control from lead to employee performance.</h2>
          <p className="hero-desc">
            One connected ERP where executives can act directly from the data: contact customers,
            open commercial documents, assign work to stakeholders, control engineering/production,
            and view financial and employee performance.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="hero-btn primary"
              onClick={() => navigate('sales')}
            >
              Open Sales
            </button>
            <button
              type="button"
              className="hero-btn outline"
              onClick={() => navigate('tasks')}
            >
              Task Centre
            </button>
            <button
              type="button"
              className="hero-btn outline"
              onClick={() => navigate('engineering')}
            >
              Engineering & BOM
            </button>
          </div>
        </div>

        <div className="hero-media">
          <div className="product-showcase-box">
            <div className="product-tag">Yash Earthing Solutions</div>
            <div className="product-showcase-title">Advanced Grounding & Lightning Kit</div>
            <div className="product-features">
              <span>✓ UL Listed Rods</span>
              <span>✓ Carbon Backfill</span>
              <span>✓ IEEE 80 Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key Operational KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => navigate('sales')}>
          <div className="kpi-header">
            <span className="kpi-label">ACTIVE LEADS</span>
            <span className="kpi-indicator dot-green"></span>
          </div>
          <div className="kpi-value">{metrics.activeLeads}</div>
          <div className="kpi-sub">Across 8 digital sources</div>
          <div className="kpi-progress">
            <div className="bar green" style={{ width: '70%' }}></div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('sales')}>
          <div className="kpi-header">
            <span className="kpi-label">CONFIRMED ORDERS</span>
            <span className="kpi-indicator dot-emerald"></span>
          </div>
          <div className="kpi-value">{metrics.confirmedOrders}</div>
          <div className="kpi-sub">Live dispatch pipeline</div>
          <div className="kpi-progress">
            <div className="bar emerald" style={{ width: '65%' }}></div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('tasks')}>
          <div className="kpi-header">
            <span className="kpi-label">OPEN TASKS</span>
            <span className="kpi-indicator dot-teal"></span>
          </div>
          <div className="kpi-value">{metrics.openTasks}</div>
          <div className="kpi-sub">All stakeholders & shifts</div>
          <div className="kpi-progress">
            <div className="bar teal" style={{ width: '80%' }}></div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('production')}>
          <div className="kpi-header">
            <span className="kpi-label">PRODUCTION OUTPUT</span>
            <span className="kpi-indicator dot-purple"></span>
          </div>
          <div className="kpi-value">{metrics.productionOutput}%</div>
          <div className="kpi-sub">Against plant shift plan</div>
          <div className="kpi-progress">
            <div className="bar purple" style={{ width: `${metrics.productionOutput}%` }}></div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('finance')}>
          <div className="kpi-header">
            <span className="kpi-label">RECEIVABLE</span>
            <span className="kpi-indicator dot-amber"></span>
          </div>
          <div className="kpi-value">₹{(metrics.receivable / 100000).toFixed(2)}L</div>
          <div className="kpi-sub">Commercial follow-up</div>
          <div className="kpi-progress">
            <div className="bar amber" style={{ width: '55%' }}></div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => navigate('tasks')}>
          <div className="kpi-header">
            <span className="kpi-label">AVG PERFORMANCE</span>
            <span className="kpi-indicator dot-green"></span>
          </div>
          <div className="kpi-value">{metrics.avgPerformance}%</div>
          <div className="kpi-sub">Employee scorecard index</div>
          <div className="kpi-progress">
            <div className="bar green" style={{ width: `${metrics.avgPerformance}%` }}></div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Operating Matrix & Critical Action Centre */}
      <div className="matrix-action-split">
        {/* Left Column: Company Operating Matrix */}
        <div className="panel matrix-panel">
          <div className="panel-header">
            <div>
              <h3>Company Operating Matrix</h3>
              <small>Module-level operational health without opening every screen</small>
            </div>
            <button
              type="button"
              className="table-action-btn"
              onClick={() => onOpenQuickAdd('TASK')}
            >
              + Add Target
            </button>
          </div>

          <div className="table-container">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>MODULE</th>
                  <th>PRIMARY KPI</th>
                  <th>TARGET</th>
                  <th>ACHIEVED</th>
                  <th>RISK / STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {matrixRows.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <b>{row.module}</b>
                    </td>
                    <td>{row.kpi}</td>
                    <td><span className="pill neutral">{row.target}</span></td>
                    <td>
                      <span className={`pill ${row.status === 'green' ? 'success' : 'warning'}`}>
                        {row.achieved}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${row.status}`}>
                        {row.risk}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="cell-btn"
                        onClick={() => navigate(row.actionTab)}
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Critical Action Centre */}
        <div className="panel action-panel">
          <div className="panel-header">
            <div>
              <h3>Critical Action Centre</h3>
              <small>What management needs acted on today</small>
            </div>
            <span className="pulse-chip">4 Live</span>
          </div>

          <div className="action-list">
            {criticalActions.map((item) => (
              <div
                key={item.id}
                className="action-card"
                onClick={() => navigate(item.tab)}
              >
                <div className="action-card-header">
                  <span className="action-title">{item.title}</span>
                  <span
                    className="action-tag"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    {item.tag}
                  </span>
                </div>
                <div className="action-card-footer">
                  <span className="action-sub">{item.subtitle}</span>
                  <span className="action-arrow">→</span>
                </div>
              </div>
            ))}
          </div>

          <div className="quick-access-box">
            <h4>Quick Workflow Execution</h4>
            <div className="quick-btn-grid">
              <button
                type="button"
                className="quick-tile"
                onClick={() => onNavigate('sales')}
              >
                <span>💼</span> Create Quote
              </button>
              <button
                type="button"
                className="quick-tile"
                onClick={() => onNavigate('engineering')}
              >
                <span>⚙️</span> Simulate BOM
              </button>
              <button
                type="button"
                className="quick-tile"
                onClick={() => onNavigate('finance')}
              >
                <span>₹</span> View Receivables
              </button>
              <button
                type="button"
                className="quick-tile"
                onClick={() => onNavigate('projects')}
              >
                <span>🏗️</span> Trace Site Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
