import React from 'react';

export default function TopBar({
  activeTab,
  sidebarOpen,
  setSidebarOpen,
  currentUser,
  onOpenTrace,
  onOpenMedia,
  onOpenTaskModal,
  onOpenAddModal,
  onOpenPerformance,
  onOpenImport,
  onLogout,
}) {
  const titles = {
    dashboard: {
      version: 'Version 3',
      name: 'Master Dashboard',
      sub: 'Entire company in one operational view',
    },
    sales: {
      version: 'Module 1',
      name: 'Sales, CRM & Orders',
      sub: 'Lead generation · Quotation calculator · Sales orders · Customer register',
    },
    supply: {
      version: 'Module 2',
      name: 'Vendor, Procurement & Stock',
      sub: 'Approved vendors · RFQ & Purchase orders · Goods receipt & Warehouse',
    },
    engineering: {
      version: 'Module 3',
      name: 'Product & Technical Engineering',
      sub: 'Product catalogue · BOM revisions · Specifications · Costing simulation',
    },
    production: {
      version: 'Module 4',
      name: 'Production & Quality Control',
      sub: 'Plant work orders · Routing execution · Laboratory QA testing & Release',
    },
    site: {
      version: 'Module 5',
      name: 'Site Projects & Installation Service',
      sub: 'EPC field project execution · Installation logs · Warranty tickets',
    },
    finance: {
      version: 'Module 6',
      name: 'Commercial & Finance ERP',
      sub: 'Tax invoices · Vendor bills · P&L ledger · GST tax liability & MIS',
    },
    tasks: {
      version: 'Module 7',
      name: 'Daily Control & Workforce MIS',
      sub: 'Stakeholder task assignment · Shifts & SLAs · Employee performance targets',
    },
  };

  const current = titles[activeTab] || titles.dashboard;

  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AD';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <div className="crumb">
          <small className="crumb-version">{current.version}</small>
          <b className="crumb-title">{current.name}</b>
        </div>
      </div>

      <div className="topactions">
        <button
          type="button"
          className="topbtn"
          onClick={onOpenTaskModal}
          title="Daily Task Centre"
        >
          Tasks
        </button>
        <button
          type="button"
          className="topbtn"
          onClick={onOpenPerformance}
          title="Employee & Company Performance Analysis"
        >
          Performance
        </button>
        <button
          type="button"
          className="topbtn"
          onClick={onOpenTrace}
          title="Full Lifecycle Traceability"
        >
          Trace Job
        </button>
        <button
          type="button"
          className="topbtn"
          onClick={onOpenMedia}
          title="Drawings & Media Library"
        >
          Media Library
        </button>
        <button
          type="button"
          className="topbtn"
          onClick={onOpenImport}
          title="Upload CSV / Excel spreadsheets directly into ERP"
        >
          📁 Import CSV/Excel
        </button>
        <button
          type="button"
          className="topbtn primary add-btn"
          onClick={onOpenAddModal}
          title="Add new Lead, Task, Project or SKU"
        >
          + Quick Add
        </button>

        {/* User Profile Pill */}
        <div className="user-profile-pill">
          <div className="user-avatar-badge">{initials}</div>
          <div className="user-text-info">
            <b>{currentUser?.name || 'Administrator'}</b>
            <small>{currentUser?.designation || currentUser?.role || 'Management'}</small>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          className="topbtn-logout"
          onClick={onLogout}
          title="Sign out of ERP session"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
