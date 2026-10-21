import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import FileUploadImportModal from '../../components/modals/FileUploadImportModal';

export default function WorkforceView() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [editItem, setEditItem] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      taskNo: 'TSK-2026-001',
      title: 'Review high-value Copper Rod quote for SuryaGrid Projects',
      department: 'Sales',
      stakeholder: 'Priya Mehta',
      priority: 'HIGH',
      shift: 'General',
      dueAt: '2026-10-22',
      status: 'IN_PROGRESS',
    },
    {
      id: 2,
      taskNo: 'TSK-2026-002',
      title: 'Conduct earth resistance soil survey at MIDC Pune substation',
      department: 'Projects',
      stakeholder: 'Sunil Verma',
      priority: 'CRITICAL',
      shift: 'Morning Site Shift',
      dueAt: '2026-10-21',
      status: 'OPEN',
    },
    {
      id: 3,
      taskNo: 'TSK-2026-003',
      title: 'Release BOM Revision 2 for Chemical Earthing Electrode',
      department: 'Engineering',
      stakeholder: 'Er. Rajesh Sharma',
      priority: 'MEDIUM',
      shift: 'R&D Shift',
      dueAt: '2026-10-23',
      status: 'WAITING_APPROVAL',
    },
    {
      id: 4,
      taskNo: 'TSK-2026-004',
      title: 'Match vendor bill with GRN for Test Supplier PO-001',
      department: 'Finance',
      stakeholder: 'Neha Joshi',
      priority: 'HIGH',
      shift: 'Accounts Shift',
      dueAt: '2026-10-22',
      status: 'OPEN',
    },
    {
      id: 5,
      taskNo: 'TSK-2026-005',
      title: 'Inspect incoming shipment of 17.2mm Copper bonded rods',
      department: 'Warehouse',
      stakeholder: 'Vikram Malhotra',
      priority: 'MEDIUM',
      shift: 'Inward Gate',
      dueAt: '2026-10-20',
      status: 'COMPLETED',
    },
  ]);

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Priya Mehta', code: 'YEC-S001', role: 'SALES_MANAGER', dept: 'Sales', attendance: '98%', status: 'Active' },
    { id: 2, name: 'Rahul Sharma', code: 'YEC-S002', role: 'SALES_CONSULTANT', dept: 'Sales', attendance: '95%', status: 'Active' },
    { id: 3, name: 'Ananya Patel', code: 'YEC-S003', role: 'SALES_CONSULTANT', dept: 'Sales', attendance: '96%', status: 'Active' },
    { id: 4, name: 'Er. Rajesh Sharma', code: 'YEC-ENG01', role: 'ENGINEER', dept: 'Engineering', attendance: '99%', status: 'Active' },
    { id: 5, name: 'Vikram Malhotra', code: 'YEC-PRC01', role: 'PROCUREMENT_OFFICER', dept: 'Purchase', attendance: '94%', status: 'Active' },
    { id: 6, name: 'Sunil Verma', code: 'YEC-OPS01', role: 'PROJECT_MANAGER', dept: 'Projects', attendance: '97%', status: 'Active' },
    { id: 7, name: 'Arun Deshmukh', code: 'YEC-FIN01', role: 'FINANCE_MANAGER', dept: 'Finance', attendance: '100%', status: 'Active' },
    { id: 8, name: 'Neha Joshi', code: 'YEC-ACC01', role: 'BANK_OFFICE_EXECUTIVE', dept: 'Finance', attendance: '96%', status: 'Active' },
  ]);

  const [targets, setTargets] = useState([
    { id: 1, staff: 'Priya Mehta', targetCalls: 25, completedCalls: 22, targetVal: '₹5,00,000', achievedVal: '₹4,34,000', rate: '87%' },
    { id: 2, staff: 'Rahul Sharma', targetCalls: 35, completedCalls: 31, targetVal: '₹4,00,000', achievedVal: '₹3,80,000', rate: '95%' },
    { id: 3, staff: 'Ananya Patel', targetCalls: 35, completedCalls: 34, targetVal: '₹4,00,000', achievedVal: '₹4,12,000', rate: '103%' },
  ]);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editItem) return;

    if (activeTab === 'tasks') {
      setTasks(tasks.map((t) => (t.id === editItem.id ? editItem : t)));
    } else if (activeTab === 'employees') {
      setEmployees(employees.map((em) => (em.id === editItem.id ? editItem : em)));
    } else {
      setTargets(targets.map((tg) => (tg.id === editItem.id ? editItem : tg)));
    }
    setEditItem(null);
  };

  const handleExportCSV = () => {
    let dataToExport = [];
    let sheetName = 'Workforce';
    let fileName = `YASH_${activeTab}_export_${new Date().toISOString().slice(0, 10)}.csv`;

    if (activeTab === 'tasks') {
      dataToExport = tasks;
      sheetName = 'Tasks';
    } else if (activeTab === 'employees') {
      dataToExport = employees;
      sheetName = 'Employees';
    } else {
      dataToExport = targets;
      sheetName = 'Targets';
    }

    if (!dataToExport || dataToExport.length === 0) {
      alert('No data to export.');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="module-view-container">
      {/* Module Header */}
      <div className="module-view-header">
        <div>
          <h2>Module 7 · Workforce, Daily Control & Management MIS</h2>
          <p>Daily stakeholder task assignments, shift coordination, employee attendance, and executive MIS scorecards</p>
        </div>
        <div className="module-header-actions" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="action-btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderColor: '#0ea5e9', color: '#0284c7', background: '#fff', padding: '7px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}
            onClick={handleExportCSV}
          >
            📥 Export CSV
          </button>
          <button
            type="button"
            className="action-btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderColor: '#10b981', color: '#047857', background: '#fff', padding: '7px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}
            onClick={() => setShowImportModal(true)}
          >
            📁 Import CSV / Excel
          </button>
          <button
            type="button"
            className="action-btn-primary"
            onClick={() => {
              const newTask = {
                id: Date.now(),
                taskNo: `TSK-2026-${String(tasks.length + 1).padStart(3, '0')}`,
                title: 'New Operational Action Task',
                department: 'Projects',
                stakeholder: 'Sunil Verma',
                priority: 'HIGH',
                shift: 'General',
                dueAt: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
                status: 'OPEN',
              };
              setTasks([newTask, ...tasks]);
            }}
          >
            ＋ Assign New Task
          </button>
        </div>
      </div>

      {/* Serial Workflow Steps Bar */}
      <div className="workflow-step-bar">
        <button
          type="button"
          className={`step-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <span className="step-num">1</span>
          <div>
            <b>Daily Task Assignment</b>
            <small>All stakeholders · shifts · SLAs</small>
          </div>
        </button>
        <button
          type="button"
          className={`step-btn ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          <span className="step-num">2</span>
          <div>
            <b>Employees & Roster</b>
            <small>Roles · designations · attendance</small>
          </div>
        </button>
        <button
          type="button"
          className={`step-btn ${activeTab === 'mis' ? 'active' : ''}`}
          onClick={() => setActiveTab('mis')}
        >
          <span className="step-num">3</span>
          <div>
            <b>Management MIS & Targets</b>
            <small>Target vs achieved · calling scores</small>
          </div>
        </button>
      </div>

      {/* Content Area */}
      <div className="module-content-card">
        {/* Step 1: Tasks Table */}
        {activeTab === 'tasks' && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>TASK NO</th>
                  <th>TASK TITLE</th>
                  <th>DEPARTMENT</th>
                  <th>ASSIGNED TO</th>
                  <th>PRIORITY</th>
                  <th>SHIFT</th>
                  <th>DUE DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id}>
                    <td><b>{t.taskNo}</b></td>
                    <td><div className="cell-primary font-medium">{t.title}</div></td>
                    <td><span className="pill neutral">{t.department}</span></td>
                    <td><b>{t.stakeholder}</b></td>
                    <td>
                      <span className={`pill ${t.priority === 'CRITICAL' ? 'danger' : t.priority === 'HIGH' ? 'warning' : 'info'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td><small>{t.shift}</small></td>
                    <td>{t.dueAt}</td>
                    <td>
                      <span className={`pill ${t.status === 'COMPLETED' ? 'success' : t.status === 'IN_PROGRESS' ? 'info' : 'warning'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action-link"
                        onClick={() => setEditItem({ ...t })}
                      >
                        ✎ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Step 2: Employees Table */}
        {activeTab === 'employees' && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>EMP CODE</th>
                  <th>EMPLOYEE NAME</th>
                  <th>DEPARTMENT</th>
                  <th>ASSIGNED SYSTEM ROLE</th>
                  <th>ATTENDANCE SCORE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((em) => (
                  <tr key={em.id}>
                    <td><b>{em.code}</b></td>
                    <td><div className="cell-primary font-bold">{em.name}</div></td>
                    <td>{em.dept}</td>
                    <td><span className="pill info">{em.role}</span></td>
                    <td><b>{em.attendance}</b></td>
                    <td><span className="pill success">{em.status}</span></td>
                    <td>
                      <button
                        type="button"
                        className="table-action-link"
                        onClick={() => setEditItem({ ...em })}
                      >
                        ✎ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Step 3: Management MIS Targets */}
        {activeTab === 'mis' && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>STAFF NAME</th>
                  <th>TARGET CALLS</th>
                  <th>COMPLETED CALLS</th>
                  <th>TARGET VALUE</th>
                  <th>ACHIEVED PIPELINE</th>
                  <th>COMPLETION %</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {targets.map((tg) => (
                  <tr key={tg.id}>
                    <td><b>{tg.staff}</b></td>
                    <td>{tg.targetCalls}</td>
                    <td><b>{tg.completedCalls}</b></td>
                    <td>{tg.targetVal}</td>
                    <td><span className="text-green-700 font-bold">{tg.achievedVal}</span></td>
                    <td>
                      <div className="flex-align-center gap-2">
                        <b>{tg.rate}</b>
                        <div className="mini-progress-bar">
                          <div className="fill-green" style={{ width: tg.rate }}></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action-link"
                        onClick={() => setEditItem({ ...tg })}
                      >
                        ✎ Edit Target
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="modal-overlay" onClick={() => setEditItem(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Record: {editItem.taskNo || editItem.name || editItem.staff}</h3>
              <button type="button" className="close-btn" onClick={() => setEditItem(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="modal-form">
              {editItem.taskNo && (
                <>
                  <div className="form-group">
                    <label>Task Title</label>
                    <input
                      type="text"
                      value={editItem.title}
                      onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Priority</label>
                      <select
                        value={editItem.priority}
                        onChange={(e) => setEditItem({ ...editItem, priority: e.target.value })}
                      >
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={editItem.status}
                        onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="WAITING_APPROVAL">WAITING_APPROVAL</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {editItem.code && (
                <>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      value={editItem.dept}
                      onChange={(e) => setEditItem({ ...editItem, dept: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Attendance Score</label>
                    <input
                      type="text"
                      value={editItem.attendance}
                      onChange={(e) => setEditItem({ ...editItem, attendance: e.target.value })}
                    />
                  </div>
                </>
              )}
              {editItem.staff && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Completed Calls</label>
                      <input
                        type="number"
                        value={editItem.completedCalls}
                        onChange={(e) => setEditItem({ ...editItem, completedCalls: Number(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Achieved Pipeline</label>
                      <input
                        type="text"
                        value={editItem.achievedVal}
                        onChange={(e) => setEditItem({ ...editItem, achievedVal: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setEditItem(null)}>Cancel</button>
                <button type="submit" className="btn-submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILE UPLOAD & CSV / XLSX IMPORTER */}
      <FileUploadImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        defaultEntity="leads"
        onSuccess={() => {}}
      />
    </div>
  );
}
