// client/src/components/modals/FileUploadImportModal.jsx
import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Trash2,
  Edit2,
  Layers,
  ArrowRight
} from "lucide-react";

export default function FileUploadImportModal({
  isOpen,
  onClose,
  defaultEntity = "products",
  onSuccess = () => {},
  toast = (msg) => alert(msg)
}) {
  const [targetEntity, setTargetEntity] = useState(defaultEntity);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [parsedData, setParsedData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importSummary, setImportSummary] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const entityTemplates = {
    products: {
      label: "Products & Catalogue Master",
      endpoint: "/api/products/batch",
      sampleHeaders: ["sku", "name", "variant", "category", "listPrice", "gstPercent", "unitOfMeasure", "standardMake", "hsnCode"],
      sampleData: [
        {
          sku: "YEC-CBR-20",
          name: "Copper bonded earth rod 20mm",
          variant: "20 mm x 3000 mm",
          category: "Earthing electrodes",
          listPrice: 2850,
          gstPercent: 18,
          unitOfMeasure: "PCS",
          standardMake: "YASH",
          hsnCode: "8538"
        },
        {
          sku: "YEC-EC-50",
          name: "Yash premium earthing compound",
          variant: "50 kg bag",
          category: "Earthing compounds",
          listPrice: 2900,
          gstPercent: 18,
          unitOfMeasure: "BAG",
          standardMake: "YASH",
          hsnCode: "3824"
        }
      ]
    },
    leads: {
      label: "Sales Leads & CRM Enquiries",
      endpoint: "/api/enquiries/import",
      sampleHeaders: ["customerName", "contactName", "phone", "email", "city", "productSku", "quantity", "expectedValue", "source", "stage"],
      sampleData: [
        {
          customerName: "Mahindra Infra Projects",
          contactName: "Rajesh Shinde",
          phone: "+91 98220 99887",
          email: "rajesh@mahindrainfra.test",
          city: "Pune",
          productSku: "YEC-CBR-17",
          quantity: 150,
          expectedValue: 357000,
          source: "INDIAN_MART",
          stage: "QUALIFIED"
        }
      ]
    },
    vendors: {
      label: "Approved Vendors & Suppliers",
      endpoint: "/api/vendors",
      sampleHeaders: ["code", "name", "category", "city", "gstin", "phone", "email"],
      sampleData: [
        {
          code: "VEND-COPPER-01",
          name: "National Copper Smelters Pvt Ltd",
          category: "Materials",
          city: "Mumbai",
          gstin: "27AAACN1234F1Z1",
          phone: "+91 22 2456 7890",
          email: "sales@nationalcopper.test"
        }
      ]
    }
  };

  const currentTemplate = entityTemplates[targetEntity] || entityTemplates.products;

  const handleFile = (file) => {
    if (!file) return;
    const name = file.name;
    const ext = name.split(".").pop().toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(ext)) {
      toast("Please select a valid CSV or Excel (.xlsx, .xls) file.");
      return;
    }

    setFileName(name);
    setFileSize((file.size / 1024).toFixed(1) + " KB");
    setImportSummary(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (json.length === 0) {
          toast("The selected file contains no rows.");
          return;
        }

        const cols = Object.keys(json[0]);
        setColumns(cols);
        setParsedData(json);
      } catch (err) {
        console.error("Parse error:", err);
        toast("Failed to parse file: " + err.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleCellChange = (rowIndex, colKey, value) => {
    setParsedData((prev) => {
      const copy = [...prev];
      copy[rowIndex] = { ...copy[rowIndex], [colKey]: value };
      return copy;
    });
  };

  const handleDeleteRow = (rowIndex) => {
    setParsedData((prev) => prev.filter((_, idx) => idx !== rowIndex));
  };

  const handleDownloadSample = (format = "csv") => {
    const ws = XLSX.utils.json_to_sheet(currentTemplate.sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample");
    if (format === "csv") {
      XLSX.writeFile(wb, `YASH_${targetEntity}_sample_template.csv`);
    } else {
      XLSX.writeFile(wb, `YASH_${targetEntity}_sample_template.xlsx`);
    }
  };

  const handleExecuteImport = async () => {
    if (parsedData.length === 0) {
      toast("No data rows to import.");
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("token");

      if (targetEntity === "products") {
        const res = await fetch("/api/products/batch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ items: parsedData })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Import failed");
        setImportSummary({
          success: true,
          count: json.count || parsedData.length,
          message: json.message || `Successfully processed ${parsedData.length} products.`
        });
        toast(`Imported ${parsedData.length} products successfully!`);
        onSuccess();
      } else if (targetEntity === "leads") {
        const res = await fetch("/api/enquiries/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ rows: parsedData })
        });
        const json = await res.json();
        if (!res.ok && res.status !== 207) throw new Error(json.error || "Lead import failed");
        const createdCount = json.data?.created?.length || parsedData.length;
        setImportSummary({
          success: true,
          count: createdCount,
          message: `Created ${createdCount} leads.`
        });
        toast(`Imported ${createdCount} leads successfully!`);
        onSuccess();
      } else {
        // Fallback or generic batch
        for (const row of parsedData) {
          await fetch(currentTemplate.endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(row)
          });
        }
        setImportSummary({
          success: true,
          count: parsedData.length,
          message: `Imported ${parsedData.length} records.`
        });
        toast(`Imported ${parsedData.length} items!`);
        onSuccess();
      }
    } catch (err) {
      console.error("Import error:", err);
      toast("Import error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-card"
        style={{ maxWidth: 960, width: "95vw", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(16, 185, 129, 0.15)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Data Importer & File Upload</h3>
              <small style={{ color: "#64748b" }}>Upload CSV or Excel (.xlsx, .xls) files directly into ERP modules</small>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ overflowY: "auto", flex: 1, padding: "20px" }}>
          {/* Target Entity Selector */}
          <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>Target Destination:</span>
            {Object.entries(entityTemplates).map(([key, tpl]) => (
              <button
                key={key}
                type="button"
                className={`tab-btn ${targetEntity === key ? "active" : ""}`}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: targetEntity === key ? "1px solid #10b981" : "1px solid #cbd5e1",
                  background: targetEntity === key ? "#ecfdf5" : "#fff",
                  color: targetEntity === key ? "#047857" : "#475569",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer"
                }}
                onClick={() => {
                  setTargetEntity(key);
                  setParsedData([]);
                  setFileName("");
                }}
              >
                {tpl.label}
              </button>
            ))}
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: isDragging ? "2px dashed #10b981" : "2px dashed #cbd5e1",
              borderRadius: 12,
              padding: "28px 20px",
              textAlign: "center",
              cursor: "pointer",
              background: isDragging ? "rgba(16, 185, 129, 0.05)" : "#f8fafc",
              transition: "all 0.2s ease",
              marginBottom: 16
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            <UploadCloud size={40} style={{ color: isDragging ? "#10b981" : "#94a3b8", margin: "0 auto 10px" }} />
            <h4 style={{ margin: "0 0 6px", fontSize: "0.95rem", color: "#1e293b" }}>
              Drag & Drop your CSV or Excel file here, or <span style={{ color: "#10b981", textDecoration: "underline" }}>browse</span>
            </h4>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b" }}>
              Supports .csv, .xlsx, and .xls files up to 15MB
            </p>
          </div>

          {/* Sample template download helper */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, background: "#f1f5f9", padding: "10px 14px", borderRadius: 8 }}>
            <span style={{ fontSize: "0.8rem", color: "#475569" }}>
              Need the exact columns for <strong>{currentTemplate.label}</strong>?
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                onClick={() => handleDownloadSample("csv")}
              >
                <Download size={13} style={{ marginRight: 4 }} /> Sample CSV
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                onClick={() => handleDownloadSample("xlsx")}
              >
                <Download size={13} style={{ marginRight: 4 }} /> Sample Excel (.xlsx)
              </button>
            </div>
          </div>

          {/* File Loaded Status */}
          {fileName && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 8, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle2 size={18} style={{ color: "#10b981" }} />
                <div>
                  <strong style={{ fontSize: "0.85rem", color: "#065f46" }}>{fileName}</strong>
                  <span style={{ fontSize: "0.75rem", color: "#047857", marginLeft: 8 }}>({fileSize} · {parsedData.length} records parsed)</span>
                </div>
              </div>
              <button
                type="button"
                style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 4 }}
                onClick={() => {
                  setParsedData([]);
                  setFileName("");
                }}
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
          )}

          {/* Import Success Banner */}
          {importSummary && (
            <div style={{ padding: "12px 16px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <CheckCircle2 size={20} style={{ color: "#16a34a" }} />
              <div>
                <strong style={{ color: "#166534" }}>{importSummary.message}</strong>
                <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#15803d" }}>Records have been synchronized into the database and are live in the system.</p>
              </div>
            </div>
          )}

          {/* Interactive Editable Preview Table */}
          {parsedData.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h5 style={{ margin: 0, fontSize: "0.85rem", color: "#334155", fontWeight: 700 }}>
                  Interactive Preview & Edit (Showing {Math.min(parsedData.length, 50)} of {parsedData.length} rows)
                </h5>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Tip: Click any cell to edit value before importing</span>
              </div>
              <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 8, maxHeight: 300 }}>
                <table className="data-table" style={{ width: "100%", fontSize: "0.78rem" }}>
                  <thead style={{ background: "#f8fafc", position: "sticky", top: 0, zIndex: 1 }}>
                    <tr>
                      <th style={{ width: 40 }}>#</th>
                      {columns.map((col) => (
                        <th key={col} style={{ whiteSpace: "nowrap" }}>{col}</th>
                      ))}
                      <th style={{ width: 50 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, 50).map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td style={{ color: "#94a3b8" }}>{rIdx + 1}</td>
                        {columns.map((col) => (
                          <td key={col} style={{ padding: "4px 8px" }}>
                            <input
                              type="text"
                              value={row[col] ?? ""}
                              onChange={(e) => handleCellChange(rIdx, col, e.target.value)}
                              style={{
                                width: "100%",
                                border: "1px solid transparent",
                                padding: "4px 6px",
                                borderRadius: 4,
                                background: "transparent",
                                fontSize: "0.78rem",
                                outline: "none"
                              }}
                              onFocus={(e) => (e.target.style.borderColor = "#10b981")}
                              onBlur={(e) => (e.target.style.borderColor = "transparent")}
                            />
                          </td>
                        ))}
                        <td>
                          <button
                            type="button"
                            style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 2 }}
                            onClick={() => handleDeleteRow(rIdx)}
                            title="Delete this row"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={uploading}>
            Cancel
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ background: "#10b981", borderColor: "#10b981", minWidth: 160 }}
              disabled={parsedData.length === 0 || uploading}
              onClick={handleExecuteImport}
            >
              {uploading ? "Importing Data..." : `Import ${parsedData.length} Records →`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
