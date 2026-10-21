import React, { useState, useEffect } from 'react';

export default function SiteView({ onOpenQuickAdd }) {
  const [activeStep, setActiveStep] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [installations, setInstallations] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/projects').then((r) => r.json()).catch(() => ({ data: [] })),
      fetch('/api/installations').then((r) => r.json()).catch(() => ({ data: [] })),
      fetch('/api/service-tickets').then((r) => r.json()).catch(() => ({ data: [] })),
    ]).then(([pRes, iRes, tRes]) => {
      setProjects(pRes.data || [
        { id: 1, projectCode: 'JOB-TEST-001', name: 'Solar Substation Grounding - EPC Demo', siteName: 'MIDC Ranjangaon, Pune', status: 'IN_PROGRESS', progress: 65, engineer: 'Sunil Verma' },
        { id: 2, projectCode: 'PRJ-2026-002', name: 'Data Centre Lightning Protection Grid', siteName: 'Electronic City, Bengaluru', status: 'SURVEY_PENDING', progress: 20, engineer: 'Sunil Verma' },
      ]);
      setInstallations(iRes.data || [
        { id: 1, installNo: 'INST-2026-001', projectCode: 'JOB-TEST-001', soilResistivity: '14.2 Ω-m', measuredResistance: '0.85 Ω (Target < 1.0 Ω)', status: 'TESTING', proofUploaded: 'True' },
        { id: 2, installNo: 'INST-2026-002', projectCode: 'PRJ-2026-002', soilResistivity: '22.0 Ω-m', measuredResistance: 'Pending Final Earth Test', status: 'IN_PROGRESS', proofUploaded: 'Pending' },
      ]);
      setTickets(tRes.data || [
        { id: 1, ticketNo: 'SVC-TEST-001', issue: 'Substation earthing resistance check above 2 ohms', status: 'IN_PROGRESS', serialNo: 'SN-CHL-0001', reported: '4 days ago' },
        { id: 2, ticketNo: 'SVC-TEST-002', issue: 'Lightning protection rod inspection requested', status: 'OPEN', serialNo: 'SN-CMP-0002', reported: '1 day ago' },
        { id: 3, ticketNo: 'SVC-TEST-003', issue: 'Annual preventive maintenance and soil resistivity', status: 'CLOSED', serialNo: 'SN-CHL-0003', reported: '30 days ago' },
      ]);
      setLoading(false);
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editItem) return;

    if (activeStep === 'projects') {
      setProjects(projects.map((p) => (p.id === editItem.id ? editItem : p)));
    } else if (activeStep === 'installations') {
      setInstallations(installations.map((i) => (i.id === editItem.id ? editItem : i)));
    } else {
      setTickets(tickets.map((t) => (t.id === editItem.id ? editItem : t)));
    }
    setEditItem(null);
  };

  return (
    <div className="module-view-container">
      {/* Module Header */}
      <div className="module-view-header">
        <div>
          <h2>Module 5 · Project, Installation & Field Service</h2>
          <p>Site execution operations: EPC project scheduling, installation testing logs with soil resistivity proof, and after-sales service tickets</p>
        </div>
        <div className="module-header-actions">
          <button
            type="button"
            className="action-btn-primary"
            onClick={() => onOpenQuickAdd && onOpenQuickAdd('PROJECT')}
          >
            ＋ Add Site Project
          </button>
        </div>
      </div>

      {/* 3 Step Serial Workflow Navigation */}
      <div className="workflow-step-bar">
        <button
          type="button"
          className={`step-btn ${activeStep === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveStep('projects')}
        >
          <span className="step-num">1</span>
          <div>
            <b>Project & Site Planning</b>
            <small>Survey · timeline · team</small>
          </div>
        </button>
        <button
          type="button"
          className={`step-btn ${activeStep === 'installations' ? 'active' : ''}`}
          onClick={() => setActiveStep('installations')}
        >
          <span className="step-num">2</span>
          <div>
            <b>Installation & Commissioning</b>
            <small>Site work · testing · resistance proof</small>
          </div>
        </button>
        <button
          type="button"
          className={`step-btn ${activeStep === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveStep('tickets')}
        >
          <span className="step-num">3</span>
          <div>
            <b>Service & Warranty</b>
            <small>Complaint · warranty · AMC visits</small>
          </div>
        </button>
      </div>

      {/* Step 1: Projects Table */}
      {activeStep === 'projects' && (
        <div className="module-content-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>PROJECT CODE</th>
                  <th>PROJECT NAME</th>
                  <th>SITE LOCATION</th>
                  <th>LEAD ENGINEER</th>
                  <th>EXECUTION %</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td><span className="code-badge">{p.projectCode}</span></td>
                    <td><b>{p.name}</b></td>
                    <td>{p.siteName || 'Site Location'}</td>
                    <td><b>{p.engineer || 'Sunil Verma'}</b></td>
                    <td>
                      <div className="flex-align-center gap-2">
                        <span>{p.progress || 60}%</span>
                        <div className="mini-progress-bar">
                          <div className="fill-green" style={{ width: `${p.progress || 60}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`pill ${p.status === 'COMPLETED' ? 'success' : 'info'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action-link"
                        onClick={() => setEditItem({ ...p })}
                      >
                        ✎ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Step 2: Installation Testing Table */}
      {activeStep === 'installations' && (
        <div className="module-content-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>INSTALL LOG NO</th>
                  <th>PROJECT CODE</th>
                  <th>SOIL RESISTIVITY</th>
                  <th>EARTH RESISTANCE RESULT</th>
                  <th>PROOF UPLOADED</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {installations.map((i) => (
                  <tr key={i.id}>
                    <td><b>{i.installNo}</b></td>
                    <td><span className="code-badge">{i.projectCode}</span></td>
                    <td>{i.soilResistivity}</td>
                    <td><b className="text-emerald-700">{i.measuredResistance}</b></td>
                    <td><span className="pill neutral">{i.proofUploaded}</span></td>
                    <td>
                      <span className={`pill ${i.status === 'COMPLETED' ? 'success' : 'warning'}`}>
                        {i.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action-link"
                        onClick={() => setEditItem({ ...i })}
                      >
                        ✎ Edit Result
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Step 3: Service Tickets Table */}
      {activeStep === 'tickets' && (
        <div className="module-content-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>TICKET NO</th>
                  <th>ISSUE DESCRIPTION</th>
                  <th>EQUIPMENT SERIAL</th>
                  <th>REPORTED</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td><b>{t.ticketNo}</b></td>
                    <td><div className="cell-primary font-medium">{t.issue}</div></td>
                    <td><span className="code-badge">{t.serialNo}</span></td>
                    <td><small>{t.reported}</small></td>
                    <td>
                      <span className={`pill ${t.status === 'CLOSED' ? 'success' : 'warning'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action-link"
                        onClick={() => setEditItem({ ...t })}
                      >
                        ✎ Edit Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="modal-overlay" onClick={() => setEditItem(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Record: {editItem.projectCode || editItem.installNo || editItem.ticketNo}</h3>
              <button type="button" className="close-btn" onClick={() => setEditItem(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="modal-form">
              {editItem.projectCode && (
                <>
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      value={editItem.name}
                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Execution Progress (%)</label>
                      <input
                        type="number"
                        value={editItem.progress || 60}
                        onChange={(e) => setEditItem({ ...editItem, progress: Number(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={editItem.status}
                        onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                      >
                        <option value="PLANNED">PLANNED</option>
                        <option value="SURVEY_PENDING">SURVEY_PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {editItem.measuredResistance && (
                <>
                  <div className="form-group">
                    <label>Measured Earth Resistance Result</label>
                    <input
                      type="text"
                      value={editItem.measuredResistance}
                      onChange={(e) => setEditItem({ ...editItem, measuredResistance: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={editItem.status}
                      onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                    >
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="TESTING">TESTING</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                </>
              )}
              {editItem.issue && (
                <>
                  <div className="form-group">
                    <label>Issue Description</label>
                    <input
                      type="text"
                      value={editItem.issue}
                      onChange={(e) => setEditItem({ ...editItem, issue: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={editItem.status}
                      onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
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
    </div>
  );
}
