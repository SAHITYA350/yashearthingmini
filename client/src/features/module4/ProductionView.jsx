import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import FileUploadImportModal from '../../components/modals/FileUploadImportModal';

export default function ProductionView() {
  const [activeTab, setActiveTab] = useState('planning');
  const [editItem, setEditItem] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const [workOrders, setWorkOrders] = useState([
    {
      id: 1,
      woNo: 'WO-2026-001',
      product: 'Copper Bonded Earth Rod 17.2mm',
      sku: 'YEC-CBR-17',
      batch: 'BATCH-CBR-091',
      plannedQty: 500,
      completedQty: 420,
      rejectedQty: 8,
      status: 'IN_PROGRESS',
      startDate: '2026-10-18',
      dueDate: '2026-10-24',
      supervisor: 'Kishore Patil',
      shift: 'Shift A (Morning)',
    },
    {
      id: 2,
      woNo: 'WO-2026-002',
      product: 'Chemical Earthing Electrode 50mm',
      sku: 'YEC-CE-50',
      batch: 'BATCH-CE-042',
      plannedQty: 150,
      completedQty: 150,
      rejectedQty: 2,
      status: 'QC_INSPECTION',
      startDate: '2026-10-16',
      dueDate: '2026-10-21',
      supervisor: 'Sunil Rao',
      shift: 'Shift B (Evening)',
    },
    {
      id: 3,
      woNo: 'WO-2026-003',
      product: 'Lightning Protection Kit Complete',
      sku: 'YEC-LPS-01',
      batch: 'BATCH-LP-018',
      plannedQty: 40,
      completedQty: 40,
      rejectedQty: 0,
      status: 'RELEASED',
      startDate: '2026-10-12',
      dueDate: '2026-10-18',
      supervisor: 'Kishore Patil',
      shift: 'Shift A (Morning)',
    },
  ]);

  const [qaInspections, setQaInspections] = useState([
    {
      id: 1,
      inspNo: 'QA-2026-104',
      woNo: 'WO-2026-002',
      sampleSize: 15,
      copperMicronThickness: '254 microns (UL Spec > 250)',
      tensileStrength: '610 N/mm²',
      coatingAdhesion: 'Pass (Hammer Test)',
      status: 'PASSED',
      inspector: 'Amit Joshi (Lead QA)',
      certifiedAt: '2026-10-20',
    },
    {
      id: 2,
      inspNo: 'QA-2026-105',
      woNo: 'WO-2026-001',
      sampleSize: 20,
      copperMicronThickness: 'Pending Microscopic Measurement',
      tensileStrength: 'Under Test',
      coatingAdhesion: 'Testing',
      status: 'IN_PROGRESS',
      inspector: 'Amit Joshi (Lead QA)',
      certifiedAt: 'In Inspection',
    },
  ]);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editItem) return;

    if (activeTab === 'planning' || activeTab === 'execution') {
      setWorkOrders(workOrders.map((w) => (w.id === editItem.id ? editItem : w)));
    } else {
      setQaInspections(qaInspections.map((q) => (q.id === editItem.id ? editItem : q)));
    }
    setEditItem(null);
  };

  const handleExportCSV = () => {
    if (!workOrders || workOrders.length === 0) {
      alert('No work orders to export.');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      workOrders.map((w) => ({
        WONumber: w.woNo,
        Product: w.product,
        SKU: w.sku,
        Batch: w.batch,
        PlannedQty: w.plannedQty,
        CompletedQty: w.completedQty,
        RejectedQty: w.rejectedQty,
        Status: w.status,
        StartDate: w.startDate,
        DueDate: w.dueDate,
        Supervisor: w.supervisor,
        Shift: w.shift,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'WorkOrders');
    XLSX.writeFile(wb, `YASH_WorkOrders_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="module-view-container">
      {/* Module Header */}
      <div className="module-view-header">
        <div>
          <h2>Module 4 · Production & Quality Control</h2>
          <p>Plant shop floor scheduling, work order execution, routing steps, and QA laboratory testing</p>
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
              const newWo = {
                id: Date.now(),
                woNo: `WO-2026-${String(workOrders.length + 1).padStart(3, '0')}`,
                product: 'Copper Bonded Earth Rod 14.2mm',
                sku: 'YEC-CBR-14',
                batch: `BATCH-${Date.now().toString().slice(-4)}`,
                plannedQty: 200,
                completedQty: 0,
                rejectedQty: 0,
                status: 'PLANNED',
                startDate: new Date().toISOString().slice(0, 10),
                dueDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
                supervisor: 'Kishore Patil',
                shift: 'Shift A (Morning)',
              };
              setWorkOrders([newWo, ...workOrders]);
            }}
          >
            ＋ Release New Work Order
          </button>
        </div>
      </div>

      {/* Serial Workflow Steps Bar */}
      <div className="workflow-step-bar">
        <button
          type="button"
          className={`step-btn ${activeTab === 'planning' ? 'active' : ''}`}
          onClick={() => setActiveTab('planning')}
        >
          <span className="step-num">1</span>
          <div>
            <b>Production Planning</b>
            <small>Demand schedule · Plant capacity</small>
          </div>
        </button>
        <button
          type="button"
          className={`step-btn ${activeTab === 'execution' ? 'active' : ''}`}
          onClick={() => setActiveTab('execution')}
        >
          <span className="step-num">2</span>
          <div>
            <b>Manufacturing Execution</b>
            <small>Raw issue · Operations · Output</small>
          </div>
        </button>
        <button
          type="button"
          className={`step-btn ${activeTab === 'quality' ? 'active' : ''}`}
          onClick={() => setActiveTab('quality')}
        >
          <span className="step-num">3</span>
          <div>
            <b>Quality & Finished Goods</b>
            <small>Micron test · Tensile · Release</small>
          </div>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="module-content-card">
        {/* Step 1 & 2: Work Orders Table */}
        {(activeTab === 'planning' || activeTab === 'execution') && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>WORK ORDER</th>
                  <th>PRODUCT & SKU</th>
                  <th>BATCH NO</th>
                  <th>PLANNED QTY</th>
                  <th>PRODUCED</th>
                  <th>YIELD %</th>
                  <th>SUPERVISOR / SHIFT</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {workOrders.map((wo) => {
                  const yieldPct = ((wo.completedQty / wo.plannedQty) * 100).toFixed(0);
                  return (
                    <tr key={wo.id}>
                      <td><b>{wo.woNo}</b></td>
                      <td>
                        <div className="cell-primary">{wo.product}</div>
                        <small className="cell-secondary">{wo.sku}</small>
                      </td>
                      <td><span className="code-badge">{wo.batch}</span></td>
                      <td><b>{wo.plannedQty} PCS</b></td>
                      <td>
                        <span className="text-green-700 font-bold">{wo.completedQty}</span>
                        {wo.rejectedQty > 0 && <small className="text-red-500"> ({wo.rejectedQty} rej)</small>}
                      </td>
                      <td>
                        <div className="flex-align-center gap-2">
                          <span>{yieldPct}%</span>
                          <div className="mini-progress-bar">
                            <div className="fill-green" style={{ width: `${Math.min(100, yieldPct)}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{wo.supervisor}</div>
                        <small className="text-muted">{wo.shift}</small>
                      </td>
                      <td>
                        <span className={`pill ${wo.status === 'RELEASED' ? 'success' : wo.status === 'QC_INSPECTION' ? 'info' : 'warning'}`}>
                          {wo.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="table-action-link"
                          onClick={() => setEditItem({ ...wo })}
                        >
                          ✎ Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Step 3: Quality Inspections Table */}
        {activeTab === 'quality' && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>INSPECTION NO</th>
                  <th>WORK ORDER</th>
                  <th>SAMPLE SIZE</th>
                  <th>COPPER COATING MICRONS</th>
                  <th>TENSILE STRENGTH</th>
                  <th>ADHESION TEST</th>
                  <th>QA INSPECTOR</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {qaInspections.map((qa) => (
                  <tr key={qa.id}>
                    <td><b>{qa.inspNo}</b></td>
                    <td><span className="code-badge">{qa.woNo}</span></td>
                    <td>{qa.sampleSize} units</td>
                    <td><b>{qa.copperMicronThickness}</b></td>
                    <td>{qa.tensileStrength}</td>
                    <td>{qa.coatingAdhesion}</td>
                    <td>{qa.inspector}</td>
                    <td>
                      <span className={`pill ${qa.status === 'PASSED' ? 'success' : 'warning'}`}>
                        {qa.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action-link"
                        onClick={() => setEditItem({ ...qa })}
                      >
                        ✎ Edit QA
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
              <h3>Edit Record: {editItem.woNo || editItem.inspNo}</h3>
              <button type="button" className="close-btn" onClick={() => setEditItem(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="modal-form">
              {editItem.woNo && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Completed Qty</label>
                      <input
                        type="number"
                        value={editItem.completedQty}
                        onChange={(e) => setEditItem({ ...editItem, completedQty: Number(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Rejected Qty</label>
                      <input
                        type="number"
                        value={editItem.rejectedQty}
                        onChange={(e) => setEditItem({ ...editItem, rejectedQty: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={editItem.status}
                      onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                    >
                      <option value="PLANNED">PLANNED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="QC_INSPECTION">QC_INSPECTION</option>
                      <option value="RELEASED">RELEASED (Finished Goods)</option>
                    </select>
                  </div>
                </>
              )}
              {editItem.inspNo && (
                <>
                  <div className="form-group">
                    <label>Micron Measurement</label>
                    <input
                      type="text"
                      value={editItem.copperMicronThickness}
                      onChange={(e) => setEditItem({ ...editItem, copperMicronThickness: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>QA Status</label>
                    <select
                      value={editItem.status}
                      onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                    >
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="PASSED">PASSED</option>
                      <option value="REJECTED">REJECTED</option>
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

      {/* FILE UPLOAD & CSV / XLSX IMPORTER */}
      <FileUploadImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        defaultEntity="products"
        onSuccess={() => {}}
      />
    </div>
  );
}
