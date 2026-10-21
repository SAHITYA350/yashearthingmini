import React from 'react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  currentUser,
  counts = {},
}) {
  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (sidebarOpen && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const navItems = [
    {
      group: 'CONTROL TOWER',
      id: 'dashboard',
      icon: '⌂',
      title: 'Master Dashboard',
      subtitle: 'Entire company in one view',
      badge: 'Live',
    },
    {
      group: 'MODULE 1 · SALES & REVENUE',
      id: 'sales',
      icon: '◎',
      title: 'Sales, CRM & Orders',
      subtitle: 'Lead · Quotation · Orders · Clients',
      badge: counts.sales || '21 Leads',
    },
    {
      group: 'MODULE 2 · VENDOR & INVENTORY',
      id: 'supply',
      icon: '↔',
      title: 'Vendor, Procurement & Stock',
      subtitle: 'Vendors · Purchase Orders · GRN & Stock',
      badge: counts.vendors || '3 Vendors',
    },
    {
      group: 'MODULE 3 · PRODUCT & ENGINEERING',
      id: 'engineering',
      icon: '◇',
      title: 'Product & Engineering',
      subtitle: 'Products · BOMs & Costing · Drawings',
      badge: counts.engineering || '64 SKUs',
    },
    {
      group: 'MODULE 4 · PLANT & PRODUCTION',
      id: 'production',
      icon: '⚙',
      title: 'Production & Quality',
      subtitle: 'Work Orders · Job Cards · QA Inspect',
      badge: '3 Orders',
    },
    {
      group: 'MODULE 5 · FIELD & INSTALLATION',
      id: 'site',
      icon: '⌂',
      title: 'Site Projects & Service',
      subtitle: 'Projects · Installation Logs · Tickets',
      badge: counts.projects || '2 Sites',
    },
    {
      group: 'MODULE 6 · COMMERCIAL & FINANCE',
      id: 'finance',
      icon: '₹',
      title: 'Commercial & Finance ERP',
      subtitle: 'Invoices · Vendor Bills · P&L · GST',
      badge: '₹6.04L Recv',
    },
    {
      group: 'MODULE 7 · WORKFORCE & MIS',
      id: 'tasks',
      icon: '◉',
      title: 'Daily Control & Workforce',
      subtitle: 'Task Assignments · Performance · MIS',
      badge: counts.tasks || '24 Tasks',
    },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay show"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="brand">
          <div className="logo-badge-square">
            <span>Y</span>
          </div>
          <div className="brand-info">
            <h1>YASH GROUP ERP</h1>
            <small>Version 3 · Complete Enterprise Control</small>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Sidebar"
          >
            ✕
          </button>
        </div>

        {/* Operational System Subtitle Pill */}
        <div className="brand-flow-pill">
          <div className="flow-badge">Green · White Operational System</div>
          <div className="flow-chain">
            Lead → Supply → Engineering → Production → Site → Accounts → People
          </div>
        </div>

        {/* Navigation Groups (1 Title + 1 Subtitle per Module) */}
        <div className="sidebar-nav-scroll">
          {navItems.map((item) => (
            <div key={item.id} className="navgroup">
              <div className="navlabel">{item.group}</div>
              <button
                type="button"
                className={`navbtn ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="navico">{item.icon}</span>
                <div className="nav-text">
                  <b>{item.title}</b>
                  <small>{item.subtitle}</small>
                </div>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            </div>
          ))}
        </div>

        {/* Current User Session Footer */}
        {currentUser && (
          <div className="sidebar-user-footer">
            <div className="user-avatar-circle">
              {currentUser.name
                ? currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'YG'}
            </div>
            <div className="user-meta">
              <b>{currentUser.name || 'Enterprise User'}</b>
              <small>{currentUser.role || 'ADMIN'}</small>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
