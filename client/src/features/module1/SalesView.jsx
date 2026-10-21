import React, { useState } from "react";
import EnquiriesPage from "../../pages/EnquiriesPage";
import QuotationsPage from "../../pages/QuotationsPage";
import OrdersPage from "../../pages/OrdersPage";
import CustomersPage from "../../pages/CustomersPage";
import AccessManagementPage from "../../pages/AccessManagementPage";

import {
  Users,
  FileQuestion,
  FileCheck,
  ShoppingCart,
  ShieldAlert,
} from "lucide-react";

export default function SalesView() {
  const [activeTab, setActiveTab] = useState("enquiries");

  const subTabs = [
    { id: "enquiries", label: "Leads & Enquiries", icon: FileQuestion },
    { id: "quotations", label: "Quotations", icon: FileCheck },
    { id: "orders", label: "Sales Orders", icon: ShoppingCart },
    { id: "customers", label: "Customer Master", icon: Users },
    { id: "access", label: "Access & Users", icon: ShieldAlert },
  ];

  return (
    <div className="sales-workspace" style={{ width: "100%" }}>
      {/* Sub-navigation bar inside Sales module */}
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
        {activeTab === "enquiries" && <EnquiriesPage />}
        {activeTab === "quotations" && <QuotationsPage />}
        {activeTab === "orders" && <OrdersPage />}
        {activeTab === "customers" && <CustomersPage />}
        {activeTab === "access" && <AccessManagementPage />}
      </div>
    </div>
  );
}
