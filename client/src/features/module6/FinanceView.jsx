import React, { useState } from "react";
import FinanceDashboard from "../../modules/finance/pages/FinanceDashboard";
import InvoicesPage from "../../modules/finance/pages/InvoicesPage";
import ReceivablesPage from "../../modules/finance/pages/ReceivablesPage";
import PaymentsPage from "../../modules/finance/pages/PaymentsPage";
import VendorBillsPage from "../../modules/finance/pages/VendorBillsPage";
import ExpensesPage from "../../modules/finance/pages/ExpensesPage";
import CostingPage from "../../modules/finance/pages/CostingPage";
import FinanceReportsPage from "../../modules/finance/pages/FinanceReportsPage";

import {
  PieChart,
  FileText,
  CreditCard,
  Receipt,
  Layers,
  BarChart3,
  FileSpreadsheet,
} from "lucide-react";

export default function FinanceView() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const subTabs = [
    { id: "dashboard", label: "Dashboard", icon: PieChart },
    { id: "invoices", label: "Invoices & Billing", icon: FileText },
    { id: "receivables", label: "Receivables & Ageing", icon: CreditCard },
    { id: "payments", label: "Payments Received", icon: Receipt },
    { id: "vendor-bills", label: "Vendor Bills", icon: Layers },
    { id: "expenses", label: "Direct Expenses", icon: CreditCard },
    { id: "costing", label: "Job Costing", icon: BarChart3 },
    { id: "reports", label: "MIS & Audit Reports", icon: FileSpreadsheet },
  ];

  return (
    <div className="finance-workspace" style={{ width: "100%" }}>
      {/* Sub-navigation bar inside Finance module */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "12px",
          marginBottom: "20px",
          borderBottom: "1px solid var(--line, #dfe9e4)",
        }}
      >
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "10px",
                border: isActive ? "1px solid #0b7a4f" : "1px solid transparent",
                backgroundColor: isActive ? "#e8f5ef" : "#ffffff",
                color: isActive ? "#08663f" : "#475569",
                fontWeight: isActive ? 700 : 500,
                fontSize: "12.5px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render active sub-view */}
      <div>
        {activeTab === "dashboard" && <FinanceDashboard />}
        {activeTab === "invoices" && <InvoicesPage />}
        {activeTab === "receivables" && <ReceivablesPage />}
        {activeTab === "payments" && <PaymentsPage />}
        {activeTab === "vendor-bills" && <VendorBillsPage />}
        {activeTab === "expenses" && <ExpensesPage />}
        {activeTab === "costing" && <CostingPage />}
        {activeTab === "reports" && <FinanceReportsPage />}
      </div>
    </div>
  );
}
