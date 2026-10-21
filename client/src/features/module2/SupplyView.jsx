import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import FileUploadImportModal from '../../components/modals/FileUploadImportModal';

export default function SupplyView({ onOpenQuickAdd }) {
  const [activeStep, setActiveStep] = useState('vendors');
  const [vendors, setVendors] = useState([]);
  const [pos, setPos] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/vendors').then((r) => r.json()).catch(() => ({ data: [] })),
      fetch('/api/purchase-orders').then((r) => r.json()).catch(() => ({ data: [] })),
      fetch('/api/inventory').then((r) => r.json()).catch(() => ({ data: [] })),
    ]).then(([vRes, pRes, iRes]) => {
      setVendors(vRes.data || [
        { id: 1, code: 'VEND-TEST-001', name: 'Test Supplier Pvt Ltd', category: 'Materials', city: 'Mumbai', rating: '4.8 / 5.0', status: 'APPROVED' },
        { id: 2, code: 'VEND-LOG-TEST', name: 'Test Transport Co', category: 'Transport', city: 'Pune', rating: '4.5 / 5.0', status: 'APPROVED' },
        { id: 3, code: 'VEND-SVC-TEST', name: 'Test Site Services Co', category: 'Site Services', city: 'Pune', rating: '4.2 / 5.0', status: 'ACTIVE' },
      ]);
      setPos(pRes.data || [
        { id: 1, poNumber: 'PO-TEST-001', vendor: 'Test Supplier Pvt Ltd', total: 59000, status: 'RECEIVED', date: '2026-10-01' },
        { id: 2, poNumber: 'PO-COST-001', vendor: 'Test Supplier Pvt Ltd', total: 80000, status: 'RECEIVED', date: '2026-10-03' },
        { id: 3, poNumber: 'PO-COST-002', vendor: 'Test Transport Co', total: 10000, status: 'RECEIVED', date: '2026-10-03' },
        { id: 4, poNumber: 'PO-COST-003', vendor: 'Test Site Services Co', total: 20000, status: 'RECEIVED', date: '2026-10-03' },
      ]);
      setInventory(iRes.data || [
        { id: 1, sku: 'YEC-CBR-17', name: 'Copper bonded earth rod 17.2mm', physicalQuantity: 850, reservedQuantity: 240, location: 'Warehouse Bay A-12', reorderLevel: 200 },
        { id: 2, sku: 'YEC-CE-50', name: 'Chemical earthing electrode 50mm', physicalQuantity: 320, reservedQuantity: 90, location: 'Warehouse Bay B-04', reorderLevel: 100 },
        { id: 3, sku: 'YEC-EC-25', name: 'Yash earthing compound 25kg', physicalQuantity: 1200, reservedQuantity: 400, location: 'Raw Material Yard', reorderLevel: 500 },
        { id: 4, sku: 'YEC-GIS-253', name: 'GI earthing strip 25x3', physicalQuantity: 2400, reservedQuantity: 650, location: 'Strip Rack 02', reorderLevel: 800 },
      ]);
      setLoading(false);
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editItem) return;

    if (activeStep === 'vendors') {
      setVendors(vendors.map((v) => (v.id === editItem.id ? editItem : v)));
    } else if (activeStep === 'pos') {
      setPos(pos.map((p) => (p.id === editItem.id ? editItem : p)));
    } else {
      setInventory(inventory.map((inv) => (inv.id === editItem.id ? editItem : inv)));
    }
    setEditItem(null);
  };

  const handleExportCSV = () => {
    let dataToExport = [];
    let sheetName = 'Supply';
    let fileName = `YASH_${activeStep}_export_${new Date().toISOString().slice(0, 10)}.csv`;

    if (activeStep === 'vendors') {
      dataToExport = vendors;
      sheetName = 'Vendors';
    } else if (activeStep === 'pos') {
      dataToExport = pos;
      sheetName = 'PurchaseOrders';
    } else {
      dataToExport = inventory;
      sheetName = 'Inventory';
    }

    if (!dataToExport || dataToExport.length === 0) {
      alert('No records to export in current view.');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="module-view-container">
      {/* Module Title Header */}
      <div className="module-view-header">
        <div>
          <h2>Module 2 · Vendor, Procurement & Inventory Management</h2>
          <p>End-to-end supply chain control: Vendor master ratings, purchase orders, goods receipts (GRN), and live inventory levels</p>
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
            onClick={() => onOpenQuickAdd && onOpenQuickAdd('PRODUCT')}
          >
            ＋ Add Supply Item
          </button>
        </div>
      </div>

      {/* 3 Step Workflow Navigation */}
      <div className="workflow-step-bar">
        <button
          type="button"
          className={`step-btn ${activeStep === 'vendors' ? 'active' : ''}`}
          onClick={() => setActiveStep('vendors')}
        >
          <span className="step-num">1</span>
          <div>
            <b>Vendor Management</b>
            <small>Directory · capability · rating</small>
          </div>
        </button>
        <button
          type="button"
          className={`step-btn ${activeStep === 'pos' ? 'active' : ''}`}
          onClick={() => setActiveStep('pos')}
        >
          <span className="step-num">2</span>
          <div>
            <b>Procurement & Purchase Orders</b>
            <small>PR · RFQ · PO generation</small>
          </div>
        </button>
        <button
          type="button"
          className={`step-btn ${activeStep === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveStep('inventory')}
        >
          <span className="step-num">3</span>
          <div>
            <b>Inventory & Goods Receipt</b>
            <small>GRN · physical stock · reservation</small>
          </div>
        </button>
      </div>

      {/* Step 1: Vendors */}
      {activeStep === 'vendors' && (
        <div className="module-content-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>VENDOR CODE</th>
                  <th>VENDOR NAME</th>
                  <th>SUPPLY CATEGORY</th>
                  <th>CITY / LOCATION</th>
                  <th>RATING</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id}>
                    <td><span className="code-badge">{v.code}</span></td>
                    <td><b>{v.name}</b></td>
                    <td><span className="pill neutral">{v.category}</span></td>
                    <td>{v.city}</td>
                    <td><b className="text-emerald-700">{v.rating || '4.5 / 5.0'}</b></td>
                    <td><span className="pill success">{v.status || 'APPROVED'}</span></td>
                    <td>
                      <button
                        type="button"
                        className="table-action-link"
                        onClick={() => setEditItem({ ...v })}
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

      {/* Step 2: Purchase Orders */}
      {activeStep === 'pos' && (
        <div className="module-content-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>PO NUMBER</th>
                  <th>VENDOR</th>
                  <th>ORDER TOTAL (INR)</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {pos.map((p) => (
                  <tr key={p.id}>
                    <td><b>{p.poNumber}</b></td>
                    <td>{p.vendor?.name || p.vendor || 'Supplier'}</td>
                    <td><b>₹{Number(p.total).toLocaleString('en-IN')}</b></td>
                    <td>{p.orderDate ? new Date(p.orderDate).toLocaleDateString() : p.date}</td>
                    <td><span className="pill success">{p.status}</span></td>
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

      {/* Step 3: Inventory Stock */}
      {activeStep === 'inventory' && (
        <div className="module-content-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>PRODUCT DESCRIPTION</th>
                  <th>PHYSICAL STOCK</th>
                  <th>RESERVED QTY</th>
                  <th>FREE AVAILABLE</th>
                  <th>WAREHOUSE BAY</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((inv) => {
                  const physical = Number(inv.physicalQuantity || 0);
                  const reserved = Number(inv.reservedQuantity || 0);
                  const available = Math.max(0, physical - reserved);
                  return (
                    <tr key={inv.id}>
                      <td><span className="code-badge">{inv.sku || inv.product?.sku}</span></td>
                      <td><b>{inv.name || inv.product?.name}</b></td>
                      <td><b className="text-slate-800">{physical} PCS</b></td>
                      <td><span className="text-amber-600">{reserved} PCS</span></td>
                      <td><b className="text-emerald-700">{available} PCS</b></td>
                      <td><small>{inv.location || 'Warehouse Bay 1'}</small></td>
                      <td>
                        <button
                          type="button"
                          className="table-action-link"
                          onClick={() => setEditItem({ ...inv })}
                        >
                          ✎ Adjust Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
              <h3>Edit Record: {editItem.name || editItem.poNumber || editItem.sku}</h3>
              <button type="button" className="close-btn" onClick={() => setEditItem(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="modal-form">
              {editItem.code && (
                <>
                  <div className="form-group">
                    <label>Vendor Name</label>
                    <input
                      type="text"
                      value={editItem.name}
                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={editItem.city}
                      onChange={(e) => setEditItem({ ...editItem, city: e.target.value })}
                    />
                  </div>
                </>
              )}
              {editItem.poNumber && (
                <>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={editItem.status}
                      onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="SUBMITTED">SUBMITTED</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="RECEIVED">RECEIVED</option>
                    </select>
                  </div>
                </>
              )}
              {editItem.physicalQuantity !== undefined && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Physical Stock (PCS)</label>
                      <input
                        type="number"
                        value={editItem.physicalQuantity}
                        onChange={(e) => setEditItem({ ...editItem, physicalQuantity: Number(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Warehouse Bay Location</label>
                      <input
                        type="text"
                        value={editItem.location || ''}
                        onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
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
        defaultEntity={activeStep === 'vendors' ? 'vendors' : 'products'}
        onSuccess={loadData}
      />
    </div>
  );
}
