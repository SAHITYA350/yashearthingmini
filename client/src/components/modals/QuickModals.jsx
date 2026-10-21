import React, { useState, useEffect } from 'react';

// ============================================================================
// 1. Quick Add Modal (Unified Data Inward for All Modules)
// ============================================================================
export function QuickAddModal({ isOpen, onClose, onCreated }) {
  const [activeType, setActiveType] = useState('LEAD');
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      let endpoint = '/api/enquiries';
      let payload = { ...formData };

      if (activeType === 'LEAD') {
        endpoint = '/api/enquiries';
        payload = {
          customerName: formData.customerName || 'New Prospect',
          contactName: formData.contactName || 'Primary Contact',
          email: formData.email || 'lead@prospect.in',
          phone: formData.phone || '+91 98000 00000',
          city: formData.city || 'Pune',
          source: formData.source || 'WEBSITE',
          requirement: formData.requirement || 'Standard Earthing Rods',
          expectedValue: Number(formData.expectedValue || 100000),
          stage: 'NEW',
          priority: 'HIGH',
        };
      } else if (activeType === 'TASK') {
        endpoint = '/api/tasks';
        payload = {
          title: formData.title || 'Operational Work Order Task',
          department: formData.department || 'Sales',
          priority: formData.priority || 'MEDIUM',
          shift: 'GENERAL',
          description: formData.description || 'Standard task description',
        };
      } else if (activeType === 'PROJECT') {
        endpoint = '/api/projects';
        payload = {
          name: formData.name || 'New EPC Grounding Site Project',
          siteName: formData.siteName || 'Site Location',
          status: 'PLANNED',
          customerId: 1,
        };
      } else if (activeType === 'PRODUCT') {
        endpoint = '/api/products';
        payload = {
          sku: formData.sku || `YEC-PRD-${Date.now().toString().slice(-4)}`,
          name: formData.name || 'Custom Grounding Assembly',
          listPrice: Number(formData.listPrice || 2500),
          gstPercent: 18,
          unitOfMeasure: 'PCS',
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Creation failed');

      setMsg('Created successfully! Reflecting in live workspace.');
      setTimeout(() => {
        onCreated && onCreated(data);
        onClose();
      }, 900);
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>＋ Quick Add New Entry</h3>
            <small>Universal record creator across all 7 ERP modules</small>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="tab-pill-row">
          <button
            type="button"
            className={activeType === 'LEAD' ? 'tab-pill active' : 'tab-pill'}
            onClick={() => setActiveType('LEAD')}
          >
            💼 Sales Lead
          </button>
          <button
            type="button"
            className={activeType === 'TASK' ? 'tab-pill active' : 'tab-pill'}
            onClick={() => setActiveType('TASK')}
          >
            ✓ Action Task
          </button>
          <button
            type="button"
            className={activeType === 'PROJECT' ? 'tab-pill active' : 'tab-pill'}
            onClick={() => setActiveType('PROJECT')}
          >
            🏗️ Site Project
          </button>
          <button
            type="button"
            className={activeType === 'PRODUCT' ? 'tab-pill active' : 'tab-pill'}
            onClick={() => setActiveType('PRODUCT')}
          >
            ⚙️ Product SKU
          </button>
        </div>

        {msg && <div className="modal-msg">{msg}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          {activeType === 'LEAD' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Company / Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Reliance Solar EPC"
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="rajesh@reliancesolar.in"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98220 12345"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expected Deal Value (₹)</label>
                  <input
                    type="number"
                    placeholder="150000"
                    onChange={(e) => setFormData({ ...formData, expectedValue: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Source</label>
                  <select onChange={(e) => setFormData({ ...formData, source: e.target.value })}>
                    <option value="WEBSITE">Website Form</option>
                    <option value="INDIAN_MART">IndiaMART</option>
                    <option value="TRADE_INDIA">TradeIndia</option>
                    <option value="REFERRAL">Direct Referral</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Technical Requirement</label>
                <textarea
                  rows="2"
                  placeholder="e.g. 50 nos of 17.2mm Copper bonded rods with 25kg compound bags"
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                ></textarea>
              </div>
            </>
          )}

          {activeType === 'TASK' && (
            <>
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspect incoming raw copper rods at inward gate"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Responsible Department</label>
                  <select onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                    <option value="Sales">Sales & CRM</option>
                    <option value="Engineering">Product Engineering</option>
                    <option value="Projects">Field Operations</option>
                    <option value="Warehouse">Warehouse & GRN</option>
                    <option value="Finance">Commercial Finance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="CRITICAL">Critical SLA</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeType === 'PROJECT' && (
            <>
              <div className="form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 132kV Substation Earthing & Lightning Protection"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Site Location</label>
                  <input
                    type="text"
                    placeholder="MIDC Ranjangaon, Pune"
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          {activeType === 'PRODUCT' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pure Copper Earth Strip 25x3"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>SKU Code</label>
                  <input
                    type="text"
                    placeholder="YEC-CS-253"
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Unit List Price (₹)</label>
                  <input
                    type="number"
                    placeholder="2140"
                    onChange={(e) => setFormData({ ...formData, listPrice: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save & Link to Workflow'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 2. Trace Job Modal (Full Lifecycle Traceability)
// ============================================================================
export function TraceJobModal({ isOpen, onClose }) {
  const [sku, setSku] = useState('YEC-CBR-17');
  const [traceData, setTraceData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTrace(sku);
    }
  }, [isOpen]);

  const loadTrace = (target) => {
    setLoading(true);
    fetch(`/api/engineering/traceability/${target}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setTraceData(res.data);
      })
      .catch((err) => console.log('Trace err:', err))
      .finally(() => setLoading(false));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card wide-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>🔍 End-to-End Enterprise Traceability</h3>
            <small>Lead → Supply → Engineering → Production → Site → Accounts → People</small>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="trace-search-bar">
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Enter Product SKU (e.g. YEC-CBR-17, YEC-CE-50)"
          />
          <button type="button" onClick={() => loadTrace(sku)} className="btn-search">
            Trace Lifecycle
          </button>
        </div>

        {loading ? (
          <div className="trace-loading">Extracting enterprise lifecycle audit trail...</div>
        ) : traceData ? (
          <div className="trace-content">
            <div className="trace-summary-header">
              <div>
                <h4>{traceData.product?.name} ({traceData.product?.sku})</h4>
                <p>Standard Make: <b>YASH</b> · UOM: {traceData.product?.unitOfMeasure} · Category: {traceData.product?.category}</p>
              </div>
              <div className="trace-badge-group">
                <span className="pill success">UL Certified</span>
                <span className="pill info">ISO 9001:2015</span>
              </div>
            </div>

            <div className="timeline-container">
              {traceData.timeline?.map((step, idx) => (
                <div key={idx} className="timeline-step">
                  <div className="timeline-node">
                    <span className="node-icon">✓</span>
                    {idx < traceData.timeline.length - 1 && <span className="node-line"></span>}
                  </div>
                  <div className="timeline-card">
                    <div className="timeline-card-header">
                      <b>{step.title}</b>
                      <span className="timeline-date">
                        {step.date ? new Date(step.date).toLocaleDateString() : 'Active'}
                      </span>
                    </div>
                    <p className="timeline-details">{step.details}</p>
                    <span className="stage-pill">{step.stage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="trace-empty">Select or search any SKU to view the complete lifecycle.</div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 3. Media & CAD Drawings Modal
// ============================================================================
export function MediaLibraryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const mediaItems = [
    { title: 'Copper Bonded Earth Rod 17.2mm Technical CAD', type: 'DRAWING', code: 'DWG-CBR-17-R3', date: '2026-10-15', format: 'PDF / DWG' },
    { title: 'Chemical Earthing Electrode Internal Assembly', type: 'DRAWING', code: 'DWG-CE-50-R2', date: '2026-10-12', format: 'PDF / CAD' },
    { title: 'UL 467 Compliance Test Report & Micro-finish Certificate', type: 'TEST_CERT', code: 'CERT-UL-2026', date: '2026-09-28', format: 'NABL Certified' },
    { title: 'Site Installation & Exothermic Welding Standard Video', type: 'TRAINING', code: 'VID-TRN-EXO-01', date: '2026-09-10', format: '1080p Video' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>📷 Technical Drawings, Media & Training Library</h3>
            <small>Approved engineering media assets, wiring drawings & video SOPs</small>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="media-grid">
          {mediaItems.map((m, i) => (
            <div key={i} className="media-card">
              <div className="media-icon-box">
                {m.type === 'DRAWING' ? '📐' : m.type === 'TRAINING' ? '🎥' : '📜'}
              </div>
              <div className="media-info">
                <b>{m.title}</b>
                <div className="media-meta">
                  <span>{m.code}</span> · <small>{m.format}</small>
                </div>
                <span className="media-date">Updated: {m.date}</span>
              </div>
              <button
                type="button"
                className="media-download-btn"
                onClick={() => alert(`Downloading verified technical pack: ${m.code}`)}
              >
                View / Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
