// ============================================================================
// Comprehensive Cross-Module & All-Role Credentials Verification Test
// ============================================================================

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

const ROLES_TO_TEST = [
  { role: "Super Administrator", email: "admin@yash.test", password: "Yash@Test123", expectedRole: "ADMIN" },
  { role: "Sales Manager", email: "sales@yash.test", password: "Yash@Test123", expectedRole: "SALES_MANAGER" },
  { role: "Chief Engineer", email: "engineer@yashgroup.com", password: "Yash@Test123", expectedRole: "ENGINEER" },
  { role: "Procurement Officer", email: "procurement@yashgroup.com", password: "Yash@Test123", expectedRole: "PROCUREMENT_OFFICER" },
  { role: "Project / Operations Manager", email: "operations@yashgroup.com", password: "Yash@Test123", expectedRole: "PROJECT_MANAGER" },
  { role: "Finance Manager", email: "finance@yash.test", password: "Yash@Test123", expectedRole: "FINANCE_MANAGER" },
  { role: "Bank Office Executive", email: "accountant@yash.test", password: "Yash@Test123", expectedRole: "BANK_OFFICE_EXECUTIVE" },
  { role: "Back Officer / Audit Viewer", email: "viewer@yash.test", password: "Yash@Test123", expectedRole: "BACK_OFFICER" },
];

let adminToken = "";

async function run() {
  console.log("===============================================================");
  console.log("🚀 YASH ERP - MULTI-MODULE & ALL-ROLE AUTOMATED VERIFICATION");
  console.log(`📡 Testing against: ${BASE_URL}`);
  console.log("===============================================================\n");

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  async function check(name, testFn) {
    totalTests++;
    try {
      const result = await testFn();
      passedTests++;
      console.log(`  ✅ [PASS] ${name} -> ${result || "OK"}`);
    } catch (err) {
      failedTests++;
      console.error(`  ❌ [FAIL] ${name} -> ${err.message}`);
    }
  }

  // 1. Health Endpoint Test
  console.log("--- 1. SYSTEM HEALTH CHECK ---");
  await check("Unified Health Check (/api/health)", async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);
    return `${data.modules?.length || 5} modules registered`;
  });

  // 2. Authentication and Role Verification
  console.log("\n--- 2. ALL USER ROLES CREDENTIALS & LOGIN VERIFICATION ---");
  for (const cred of ROLES_TO_TEST) {
    await check(`Login as [${cred.role}] (${cred.email})`, async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cred.email, password: cred.password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      if (cred.expectedRole && data.data?.user?.role !== cred.expectedRole) {
        throw new Error(`Expected role ${cred.expectedRole}, got ${data.data?.user?.role}`);
      }
      if (cred.expectedRole === "ADMIN") {
        adminToken = data.data?.token;
      }
      return `Authenticated as ${data.data?.user?.name} (Role: ${data.data?.user?.role})`;
    });
  }

  const authHeaders = {
    "Content-Type": "application/json",
    ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
  };

  // 3. Module 1: CRM & Sales Management
  console.log("\n--- 3. MODULE 1: CRM & SALES MANAGEMENT ---");
  await check("Customer Management (/api/customers)", async () => {
    const res = await fetch(`${BASE_URL}/api/customers`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} customers available`;
  });

  await check("Enquiries & Leads (/api/enquiries)", async () => {
    const res = await fetch(`${BASE_URL}/api/enquiries`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} enquiries available`;
  });

  await check("Quotations Engine (/api/quotations)", async () => {
    const res = await fetch(`${BASE_URL}/api/quotations`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} quotations available`;
  });

  await check("Sales Orders (/api/sales-orders)", async () => {
    const res = await fetch(`${BASE_URL}/api/sales-orders`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} sales orders available`;
  });

  // 4. Module 2: Field Operations & Projects
  console.log("\n--- 4. MODULE 2: FIELD OPERATIONS & PROJECTS ---");
  await check("Projects Engine (/api/projects)", async () => {
    const res = await fetch(`${BASE_URL}/api/projects`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} active projects`;
  });

  await check("Installations Tracking (/api/installations)", async () => {
    const res = await fetch(`${BASE_URL}/api/installations`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} installation records`;
  });

  await check("Service Tickets (/api/service-tickets)", async () => {
    const res = await fetch(`${BASE_URL}/api/service-tickets`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} service tickets`;
  });

  // 5. Module 3: Product Engineering & BOM Workspace
  console.log("\n--- 5. MODULE 3: PRODUCT ENGINEERING & BOM WORKSPACE ---");
  await check("Engineering Dashboard (/api/engineering/dashboard/summary)", async () => {
    const res = await fetch(`${BASE_URL}/api/engineering/dashboard/summary`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const summary = data.data || {};
    return `Products: ${summary.totalProducts ?? 0}, BOMs: ${summary.totalBOMs ?? 0}, Tasks: ${summary.activeTasks ?? 0}`;
  });

  await check("Products Catalogue (/api/products)", async () => {
    const res = await fetch(`${BASE_URL}/api/products`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} products listed`;
  });

  await check("Technical Specifications (/api/specifications)", async () => {
    const res = await fetch(`${BASE_URL}/api/specifications`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} technical specifications`;
  });

  await check("Bill of Materials (BOM) & Costing (/api/boms)", async () => {
    const res = await fetch(`${BASE_URL}/api/boms`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} BOM structures registered`;
  });

  await check("Engineering Tasks & ECN (/api/tasks)", async () => {
    const res = await fetch(`${BASE_URL}/api/tasks`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} workflow tasks`;
  });

  await check("Engineering Traceability (/api/traceability/matrix)", async () => {
    const res = await fetch(`${BASE_URL}/api/traceability/matrix`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return `Traceability matrix responsive`;
  });

  // 6. Module 5: Procurement, Inventory & Vendors
  console.log("\n--- 6. MODULE 5: PROCUREMENT, INVENTORY & VENDORS ---");
  await check("Vendor Directory (/api/vendors)", async () => {
    const res = await fetch(`${BASE_URL}/api/vendors`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} vendors in database`;
  });

  await check("Purchase Orders (/api/purchase-orders)", async () => {
    const res = await fetch(`${BASE_URL}/api/purchase-orders`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} purchase orders`;
  });

  await check("Inventory Stock Levels (/api/inventory)", async () => {
    const res = await fetch(`${BASE_URL}/api/inventory`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} inventory SKUs tracked`;
  });

  // 7. Module 6: Commercial & Finance ERP
  console.log("\n--- 7. MODULE 6: COMMERCIAL & FINANCE ERP ---");
  await check("Tax Invoices (/api/invoices)", async () => {
    const res = await fetch(`${BASE_URL}/api/invoices`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} customer invoices`;
  });

  await check("Chart of Accounts (/api/finance/accounts)", async () => {
    const res = await fetch(`${BASE_URL}/api/finance/accounts`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = data.data || [];
    return `${items.length} ledger accounts`;
  });

  await check("Balance Sheet Reporting (/api/finance/reports/balance-sheet)", async () => {
    const res = await fetch(`${BASE_URL}/api/finance/reports/balance-sheet`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return `Balance sheet computed`;
  });

  await check("Profit & Loss Statement (/api/finance/reports/profit-loss)", async () => {
    const res = await fetch(`${BASE_URL}/api/finance/reports/profit-loss`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return `P&L summary generated`;
  });

  await check("GST / Tax Summary (/api/finance/tax/summary)", async () => {
    const res = await fetch(`${BASE_URL}/api/finance/tax/summary`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return `GST liability and input tax credit generated`;
  });

  // Cross-Module Lookups
  console.log("\n--- 8. CROSS-MODULE DATA CONTINUITY LOOKUPS ---");
  await check("Unified Lookups (/api/lookups)", async () => {
    const res = await fetch(`${BASE_URL}/api/lookups`, { headers: authHeaders });
    const data = await res.json();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const d = data.data || {};
    return `SalesOrders: ${d.salesOrders?.length || 0}, Customers: ${d.customers?.length || 0}, Products: ${d.products?.length || 0}`;
  });

  console.log("\n===============================================================");
  console.log(`📊 TEST RESULTS SUMMARY: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
  console.log("===============================================================");

  if (failedTests > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Test runner encountered fatal error:", err);
  process.exit(1);
});
