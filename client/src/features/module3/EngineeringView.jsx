import React, { useState } from "react";
import DashboardView from "./DashboardView";
import ProductsView from "./ProductsView";
import SpecificationsView from "./SpecificationsView";
import BOMManagerView from "./BOMManagerView";
import CostingSimulationView from "./CostingSimulationView";
import DocumentsView from "./DocumentsView";
import TrainingLibraryView from "./TrainingLibraryView";
import TaskCenterView from "./TaskCenterView";
import TraceabilityView from "./TraceabilityView";
import ReportsView from "./ReportsView";

import {
  LayoutDashboard,
  Boxes,
  FileCheck2,
  Layers,
  Calculator,
  FileCode,
  GraduationCap,
  CheckSquare,
  Network,
  FileSpreadsheet,
} from "lucide-react";

export default function EngineeringView() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [traceSku, setTraceSku] = useState("YEC-CBR-172-3000");
  const [simBOMId, setSimBOMId] = useState(null);

  const subTabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Product Master", icon: Boxes },
    { id: "specifications", label: "Specifications", icon: FileCheck2 },
    { id: "bom-manager", label: "BOM Manager", icon: Layers },
    { id: "costing-simulation", label: "Costing Simulation", icon: Calculator },
    { id: "documents", label: "Drawings & CAD", icon: FileCode },
    { id: "training", label: "Training Library", icon: GraduationCap },
    { id: "tasks", label: "Task Center", icon: CheckSquare },
    { id: "traceability", label: "Traceability", icon: Network },
    { id: "reports", label: "Reports", icon: FileSpreadsheet },
  ];

  return (
    <div className="engineering-workspace" style={{ width: "100%" }}>
      {/* Sub-navigation bar inside Engineering module */}
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
        {activeTab === "dashboard" && <DashboardView onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === "products" && (
          <ProductsView
            onSelectProductForTrace={(sku) => {
              setTraceSku(sku);
              setActiveTab("traceability");
            }}
          />
        )}
        {activeTab === "specifications" && <SpecificationsView />}
        {activeTab === "bom-manager" && (
          <BOMManagerView
            onSelectForCostSimulation={(bomId) => {
              setSimBOMId(bomId);
              setActiveTab("costing-simulation");
            }}
          />
        )}
        {activeTab === "costing-simulation" && <CostingSimulationView initialBOMId={simBOMId} />}
        {activeTab === "documents" && <DocumentsView />}
        {activeTab === "training" && <TrainingLibraryView />}
        {activeTab === "tasks" && <TaskCenterView />}
        {activeTab === "traceability" && <TraceabilityView initialSku={traceSku} />}
        {activeTab === "reports" && <ReportsView />}
      </div>
    </div>
  );
}
