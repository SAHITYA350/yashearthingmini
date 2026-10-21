// ============================================================================
// Module 6 - Finance & Commercial: route aggregator.
// Mounted at /api/finance in server/index.js.
// ============================================================================

import express from "express";
import { authenticate, authorize } from "../../utils/auth.js";
import reportCtrl from "./controllers/financeReport.controller.js";
import paymentCtrl from "./controllers/payment.controller.js";

import invoiceRoutes from "./routes/invoice.routes.js";
import receivablesRoutes from "./routes/receivables.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import vendorBillRoutes from "./routes/vendorBill.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import costingRoutes from "./routes/costing.routes.js";

const router = express.Router();

// ---------------- Dashboard & MIS reports ----------------
router.get("/dashboard", authenticate, authorize("finance", "read"), reportCtrl.dashboard);
router.get("/reports/mis", authenticate, authorize("finance", "read"), reportCtrl.mis);

// ---------------- Chart of Accounts ----------------
router.get("/accounts", authenticate, async (req, res) => {
  try {
    const accounts = [
      { id: 1, code: "1010", name: "HDFC Operating Current A/c", type: "BANK", balance: 2450000 },
      { id: 2, code: "1020", name: "ICICI Cash Credit A/c", type: "BANK", balance: 500000 },
      { id: 3, code: "1100", name: "Trade Accounts Receivable (Sundry Debtors)", type: "CURRENT_ASSET", balance: 1850000 },
      { id: 4, code: "1200", name: "Raw Material & Component Inventory", type: "CURRENT_ASSET", balance: 3200000 },
      { id: 5, code: "2010", name: "Trade Accounts Payable (Sundry Creditors)", type: "CURRENT_LIABILITY", balance: 1420000 },
      { id: 6, code: "2050", name: "GST Output Tax Liability (CGST/SGST/IGST)", type: "DUTIES_AND_TAXES", balance: 215000 },
      { id: 7, code: "1060", name: "GST Input Tax Credit Receivable", type: "CURRENT_ASSET", balance: 178000 },
      { id: 8, code: "3000", name: "Commercial Project Sales Revenue", type: "INCOME", balance: 12500000 },
      { id: 9, code: "4000", name: "Direct Cost of Goods Sold (BOM & Labour)", type: "EXPENSE", balance: 8200000 },
      { id: 10, code: "5000", name: "Operating, Freight & Site Expenses", type: "EXPENSE", balance: 950000 },
    ];
    res.json({ success: true, data: accounts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- Balance Sheet ----------------
router.get("/reports/balance-sheet", authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        asOfDate: new Date().toISOString(),
        assets: {
          currentAssets: [
            { name: "Cash & Bank Balances", amount: 2950000 },
            { name: "Trade Receivables", amount: 1850000 },
            { name: "Inventory Stock", amount: 3200000 },
            { name: "Input Tax Credit (GST)", amount: 178000 },
          ],
          totalAssets: 8178000,
        },
        liabilities: {
          currentLiabilities: [
            { name: "Trade Payables", amount: 1420000 },
            { name: "GST Output Liability", amount: 215000 },
            { name: "Short Term Provisions", amount: 180000 },
          ],
          totalLiabilities: 1815000,
        },
        equity: {
          shareCapital: 4000000,
          retainedEarnings: 2363000,
          totalEquity: 6363000,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- Profit & Loss ----------------
router.get("/reports/profit-loss", authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        fiscalYear: "2026-2027",
        revenue: {
          salesRevenue: 12500000,
          serviceRevenue: 850000,
          totalRevenue: 13350000,
        },
        costOfGoodsSold: {
          materialCost: 7100000,
          directLabour: 1100000,
          totalCOGS: 8200000,
        },
        grossProfit: 5150000,
        operatingExpenses: {
          siteInstallationExpenses: 450000,
          administrativeExpenses: 320000,
          logisticsFreight: 180000,
          totalOperatingExpenses: 950000,
        },
        operatingProfit: 4200000,
        netProfit: 3360000,
        netMarginPercent: 25.17,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- Tax / GST Summary ----------------
router.get("/tax/summary", authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        filingPeriod: "Current Quarter",
        outputGst: {
          cgst: 96750,
          sgst: 96750,
          igst: 21500,
          total: 215000,
        },
        inputTaxCredit: {
          cgst: 80100,
          sgst: 80100,
          igst: 17800,
          total: 178000,
        },
        netTaxPayable: 37000,
        status: "READY_FOR_GSTR3B_FILING",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- Workflow sub-routers ----------------
router.use("/invoices", invoiceRoutes);
router.use("/receivables", receivablesRoutes);
router.use("/payments", paymentRoutes);
router.use("/vendor-bills", vendorBillRoutes);
router.use("/expenses", expenseRoutes);
router.use("/jobs", costingRoutes);

// ---------------- Nested money-movement endpoints ----------------
// Customer receipt against an invoice
router.post(
  "/invoices/:id/receipts",
  authenticate,
  authorize("finance", "create"),
  paymentCtrl.createReceipt
);

// Supplier payment against a vendor bill.
router.post(
  "/vendor-bills/:id/payments",
  authenticate,
  authorize("finance", "create"),
  paymentCtrl.createBillPayment
);

export default router;
