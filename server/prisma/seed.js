// ============================================================================
// YASH GROUP ERP - Unified Master Database Seeder (All Modules 1 to 7)
// ============================================================================

import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const now = new Date();
const daysAgo = (days) => new Date(now.getTime() - days * 86_400_000);
const daysFromNow = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

const users = [
  {
    name: "System Administrator",
    email: "admin@yash.test",
    employeeCode: "YEC-ADM01",
    designation: "General Administrator",
    role: "ADMIN",
    department: "Administration",
  },
  {
    name: "Priya Mehta",
    email: "priya.mehta@yashgroup.in",
    employeeCode: "YEC-S001",
    designation: "Sales Manager",
    role: "SALES_MANAGER",
    department: "Sales",
  },
  {
    name: "Rahul Sharma",
    email: "rahul.sharma@yashgroup.in",
    employeeCode: "YEC-S002",
    designation: "Sales Consultant",
    role: "SALES_CONSULTANT",
    department: "Sales",
  },
  {
    name: "Ananya Patel",
    email: "ananya.patel@yashgroup.in",
    employeeCode: "YEC-S003",
    designation: "Sales Consultant",
    role: "SALES_CONSULTANT",
    department: "Sales",
  },
  {
    name: "Er. Rajesh Sharma",
    email: "engineer@yashgroup.com",
    employeeCode: "YEC-ENG01",
    designation: "Chief Technical Engineer",
    role: "ENGINEER",
    department: "Engineering",
  },
  {
    name: "Vikram Malhotra",
    email: "procurement@yashgroup.com",
    employeeCode: "YEC-PRC01",
    designation: "Procurement & Sourcing Lead",
    role: "PROCUREMENT_OFFICER",
    department: "Purchase",
  },
  {
    name: "Sunil Verma",
    email: "operations@yashgroup.com",
    employeeCode: "YEC-OPS01",
    designation: "Head of Site Operations",
    role: "PROJECT_MANAGER",
    department: "Projects",
  },
  {
    name: "Arun Deshmukh",
    email: "finance@yash.test",
    employeeCode: "YEC-FIN01",
    designation: "Finance & Accounts Head",
    role: "FINANCE_MANAGER",
    department: "Finance",
  },
  {
    name: "Neha Joshi",
    email: "accountant@yash.test",
    employeeCode: "YEC-ACC01",
    designation: "Senior Bank & Accounts Executive",
    role: "BANK_OFFICE_EXECUTIVE",
    department: "Finance",
  },
  {
    name: "Audit Viewer",
    email: "viewer@yash.test",
    employeeCode: "YEC-AUD01",
    designation: "Compliance & Audit Viewer",
    role: "BACK_OFFICER",
    department: "Operations",
  },
];

const catalogue = [
  ["COPPER_ROD", "Earthing electrodes", "YEC-CBR-17", "Copper bonded earth rod", "17.2 mm × 3000 mm", 2380, 18, true],
  ["COPPER_ROD", "Earthing electrodes", "YEC-CBR-14", "Copper bonded earth rod", "14.2 mm × 2400 mm", 1760, 18, true],
  ["GI_ROD", "Earthing electrodes", "YEC-GI-40", "GI earthing electrode", "40 mm × 3000 mm", 1280, 18, true],
  ["CHEM_ROD", "Earthing electrodes", "YEC-CE-50", "Chemical earthing electrode", "50 mm × 3000 mm", 4250, 18, true],
  ["EARTH_COMPOUND", "Earthing compounds", "YEC-EC-25", "Yash earthing compound", "25 kg bag", 1580, 18, true],
  ["EARTH_COMPOUND", "Earthing compounds", "YEC-EC-10", "Yash earthing compound", "10 kg bag", 720, 18, true],
  ["GI_STRIP", "Conductors & strips", "YEC-GIS-253", "GI earthing strip", "25 × 3 mm", 365, 18, false],
  ["COPPER_STRIP", "Conductors & strips", "YEC-CS-253", "Copper earthing strip", "25 × 3 mm", 2140, 18, false],
  ["LIGHTNING_KIT", "Lightning protection", "YEC-LPS-01", "Lightning protection kit", "Complete set", 18500, 18, true],
  ["TEST_LINK", "Accessories", "YEC-TL-01", "Test link and inspection chamber", "Heavy-duty set", 890, 18, false],
  ["BACKFILL", "Earthing compounds", "YEC-BF-01", "Conductive backfill compound", "50 kg bag", 2640, 18, false],
  ["SURGE_DEVICE", "Lightning protection", "YEC-SPD-40", "Surge protection device", "40 kA, Type 2", 4350, 18, false],
];

const prospects = [
  ["SuryaGrid Projects", "Amit Kulkarni", "amit@suryagrid.in", "+91 98220 44108", "Pune", "Maharashtra", "INDIAN_MART", "YEC-CBR-17", 120, 286000, "PO_RECEIVED", "HIGH", 2],
  ["Apex Infra Systems", "Neha Shah", "neha@apexinfra.in", "+91 98250 21884", "Ahmedabad", "Gujarat", "WEBSITE", "YEC-EC-25", 80, 148000, "QUOTATION_SENT", "MEDIUM", 2],
  ["Narmada Electricals", "Sanjay Patel", "sanjay@narmadaelectricals.in", "+91 98980 77032", "Vadodara", "Gujarat", "JUSTDIAL", "YEC-GIS-253", 250, 91250, "REQUIREMENT_CAPTURED", "HIGH", 2],
  ["Meridian Power EPC", "Farhan Ali", "farhan@meridianpower.com", "+91 98191 60276", "Navi Mumbai", "Maharashtra", "EXPORT_INDIA", "YEC-CBR-14", 60, 105600, "CONTACTED", "MEDIUM", 3],
  ["GreenSpark Energy", "Kavita Rao", "kavita@greenspark.co.in", "+91 98490 11234", "Hyderabad", "Telangana", "REFERRAL", "YEC-LPS-01", 12, 222000, "NEW", "LOW", 1],
  ["BuildCore Engineering", "Rohit Deshmukh", "rohit@buildcore.in", "+91 97654 33821", "Nashik", "Maharashtra", "TRADE_INDIA", "YEC-CE-50", 36, 153000, "QUOTATION_DRAFT", "HIGH", 3],
  ["Prism Renewables", "Isha Nair", "isha@prismrenewables.in", "+91 98470 14522", "Kochi", "Kerala", "GOOGLE_ADS", "YEC-CBR-17", 48, 114240, "QUALIFIED", "MEDIUM", 2],
  ["Eastern Switchgear", "Debashish Sen", "debashish@easternswitchgear.in", "+91 98300 12783", "Kolkata", "West Bengal", "SULEKHA", "YEC-GI-40", 100, 128000, "NEGOTIATION", "HIGH", 3],
  ["Vardhan Industrial", "Mehul Joshi", "mehul@vardhanindustrial.in", "+91 98790 44201", "Rajkot", "Gujarat", "META_ADS", "YEC-EC-10", 140, 100800, "CONTACTED", "MEDIUM", 1],
  ["NorthStar EPC", "Pooja Arora", "pooja@northstarepc.in", "+91 98100 91827", "Gurugram", "Haryana", "INDIAN_MART", "YEC-CS-253", 75, 160500, "QUOTATION_SENT", "HIGH", 2],
  ["Deccan Solar Works", "Vivek Reddy", "vivek@deccansolar.in", "+91 98480 26091", "Vijayawada", "Andhra Pradesh", "WEBSITE", "YEC-TL-01", 90, 80100, "REQUIREMENT_CAPTURED", "LOW", 1],
  ["Pioneer Cement Ltd", "Anil Soni", "anil@pioneercement.in", "+91 94141 15007", "Jaipur", "Rajasthan", "EXCEL", "YEC-BF-01", 64, 168960, "PO_RECEIVED", "HIGH", 3],
  ["BluePeak Data Centres", "Ritu Menon", "ritu@bluepeakdc.in", "+91 98451 02035", "Bengaluru", "Karnataka", "REFERRAL", "YEC-SPD-40", 24, 104400, "QUOTATION_DRAFT", "CRITICAL", 2],
  ["Sahyadri Electricals", "Prakash Jadhav", "prakash@sahyadrielectricals.in", "+91 94220 34017", "Kolhapur", "Maharashtra", "JUSTDIAL", "YEC-GIS-253", 320, 116800, "CONTACTED", "MEDIUM", 1],
  ["Orbit Infra Projects", "Sonal Gupta", "sonal@orbitinfra.in", "+91 98110 76322", "Noida", "Uttar Pradesh", "GOOGLE_ADS", "YEC-CE-50", 18, 76500, "NEW", "MEDIUM", 3],
  ["Coastal Wind Energy", "Martin Dsouza", "martin@coastalwind.in", "+91 83224 45018", "Panaji", "Goa", "EXPORT_INDIA", "YEC-LPS-01", 8, 148000, "LOST", "LOW", 2],
  ["Rudra Transformers", "Kiran Shah", "kiran@rudratransformers.in", "+91 26522 40977", "Vadodara", "Gujarat", "TRADE_INDIA", "YEC-CBR-17", 40, 95200, "QUOTATION_SENT", "MEDIUM", 1],
  ["Kaveri Agri Power", "Chandru Rao", "chandru@kaveriagri.in", "+91 94480 62531", "Mysuru", "Karnataka", "WEBSITE", "YEC-EC-25", 55, 101750, "QUALIFIED", "LOW", 3],
  ["Aster Hospitals", "Divya Krishnan", "divya@asterfacilities.in", "+91 48441 80103", "Kochi", "Kerala", "REFERRAL", "YEC-GI-40", 32, 40960, "NEGOTIATION", "HIGH", 2],
  ["Horizon Rail Systems", "Arvind Bhat", "arvind@horizonrail.in", "+91 22288 41703", "Mumbai", "Maharashtra", "INDIAN_MART", "YEC-CBR-14", 200, 352000, "NEW", "HIGH", 1],
  ["Sunfield Developers", "Maya Thomas", "maya@sunfielddev.in", "+91 80421 37250", "Bengaluru", "Karnataka", "MANUAL", "YEC-GIS-253", 90, 32850, "LOST", "LOW", 3],
];

const SEED_INVOICES = [
  { invoiceNo: "INV-TEST-001", subtotal: "100000", taxAmount: "18000", total: "118000", paidAmount: "50000", status: "PARTIALLY_PAID", issueDaysAgo: 30, dueInDays: 15 },
  { invoiceNo: "INV-TEST-002", subtotal: "40000", taxAmount: "7200", total: "47200", paidAmount: "0", status: "OVERDUE", issueDaysAgo: 60, dueInDays: -30 },
  { invoiceNo: "INV-JOB-001", subtotal: "169491.53", taxAmount: "30508.47", total: "200000", paidAmount: "200000", status: "PAID", issueDaysAgo: 25, dueInDays: 5 },
];

const SEED_VENDOR_BILLS = [
  { billNo: "BILL-TEST-001", vendorCode: "VEND-TEST-001", poNumber: "PO-TEST-001", subtotal: "50000", taxAmount: "9000", total: "59000", paidAmount: "20000", status: "PARTIALLY_PAID", billDaysAgo: 14, dueInDays: 16 },
  { billNo: "EXP-TRANSPORT-001", vendorCode: "VEND-LOG-TEST", poNumber: null, subtotal: "8474.58", taxAmount: "1525.42", total: "10000", paidAmount: "0", status: "APPROVED", billDaysAgo: 5, dueInDays: 25 },
  { billNo: "EXP-CONSUMABLE-001", vendorCode: "VEND-SVC-TEST", poNumber: null, subtotal: "4237.29", taxAmount: "762.71", total: "5000", paidAmount: "0", status: "SUBMITTED", billDaysAgo: 2, dueInDays: 28 },
];

const JOB_COST_POS = [
  {
    pr: { requestNo: "PR-TEST-001", notes: "Material procurement for JOB-TEST-001" },
    rfq: { rfqNo: "RFQ-TEST-001" },
    po: { poNumber: "PO-COST-001", vendorCode: "VEND-TEST-001", subtotal: "67796.61", taxAmount: "12203.39", total: "80000" },
  },
  {
    pr: { requestNo: "PR-TEST-002", notes: "Logistics for JOB-TEST-001" },
    rfq: { rfqNo: "RFQ-TEST-002" },
    po: { poNumber: "PO-COST-002", vendorCode: "VEND-LOG-TEST", subtotal: "8474.58", taxAmount: "1525.42", total: "10000" },
  },
  {
    pr: { requestNo: "PR-TEST-003", notes: "Site services for JOB-TEST-001" },
    rfq: { rfqNo: "RFQ-TEST-003" },
    po: { poNumber: "PO-COST-003", vendorCode: "VEND-SVC-TEST", subtotal: "16949.15", taxAmount: "3050.85", total: "20000" },
  },
];

async function main() {
  console.log("===============================================================");
  console.log("🚀 YASH GROUP ERP - SEEDING COMPLETE ENTERPRISE CONTROL DATA");
  console.log("===============================================================\n");

  const defaultPassword = process.env.SEED_PASSWORD || "Yash@Test123";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // 1. Seed Users & Roles
  console.log("▶ Seeding Users & Role Profiles...");
  const seededUsers = await Promise.all(
    users.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          employeeCode: user.employeeCode,
          designation: user.designation,
          role: user.role,
          department: user.department,
          isActive: true,
          passwordHash,
        },
        create: {
          ...user,
          passwordHash,
          isActive: true,
        },
      })
    )
  );

  // Also ensure sales@yash.test exists as alias for sales manager testing
  await prisma.user.upsert({
    where: { email: "sales@yash.test" },
    update: { passwordHash, isActive: true, role: "SALES_MANAGER" },
    create: {
      name: "Priya Mehta",
      email: "sales@yash.test",
      employeeCode: "YEC-S001B",
      designation: "Sales Manager",
      role: "SALES_MANAGER",
      department: "Sales",
      passwordHash,
      isActive: true,
    },
  });

  const manager = seededUsers[1]; // Priya Mehta

  // 2. Seed Product Categories & Catalogue
  console.log("▶ Seeding Product Categories & Catalogue...");
  const categoryNames = [...new Set(catalogue.map((item) => item[1]))];
  const categories = Object.fromEntries(
    await Promise.all(
      categoryNames.map(async (name) => {
        const type = name === "Earthing compounds" ? "CONSUMABLE" : "FINISHED_GOOD";
        const category = await prisma.category.upsert({
          where: { name },
          update: { type },
          create: { name, type },
        });
        return [name, category.id];
      })
    )
  );

  const products = await Promise.all(
    catalogue.map(async ([skuCategory, category, productSku, name, variant, price, gstPercent, isManufactured]) =>
      prisma.product.upsert({
        where: { sku: productSku },
        update: {
          name,
          variant,
          listPrice: price,
          gstPercent,
          isManufactured,
          isActive: true,
          categoryId: categories[category],
        },
        create: {
          sku: productSku,
          name,
          variant,
          listPrice: price,
          gstPercent,
          isManufactured,
          isActive: true,
          categoryId: categories[category],
          standardMake: "YASH",
          unitOfMeasure: "PCS",
          description: `${name} · ${variant}`,
        },
      })
    )
  );
  const productBySku = Object.fromEntries(products.map((p) => [p.sku, p]));

  // 3. Seed Customers, Leads, CallLogs, Quotations & SalesOrders
  console.log("▶ Seeding 21 Prospects, Leads, Quotations & Orders...");
  for (const [index, row] of prospects.entries()) {
    const [name, contactName, email, phone, city, state, source, sku, quantity, expectedValue, stage, priority, ownerIndex] = row;
    const code = `DEMO-LD-${String(index + 1).padStart(3, "0")}`;
    const product = productBySku[sku];
    const owner = seededUsers[ownerIndex] || seededUsers[1];
    if (!product) continue;

    const customer = await prisma.customer.upsert({
      where: { code: `DEMO-C-${String(index + 1).padStart(3, "0")}` },
      update: { name, email, phone, city, state, isActive: true },
      create: {
        code: `DEMO-C-${String(index + 1).padStart(3, "0")}`,
        name,
        email,
        phone,
        city,
        state,
      },
    });

    const lead = await prisma.lead.upsert({
      where: { code },
      update: {
        source,
        customerName: name,
        contactName,
        email,
        phone,
        city,
        state,
        productName: product.name,
        productSku: sku,
        variant: product.variant,
        productId: product.id,
        quantity,
        expectedValue: new Prisma.Decimal(expectedValue),
        stage,
        priority,
        customerId: customer.id,
        assignedToId: owner.id,
        requirement: `Confirm ${product.name} (${product.variant}), order quantity ${quantity}, delivery to ${city}.`,
      },
      create: {
        code,
        source,
        customerName: name,
        contactName,
        email,
        phone,
        city,
        state,
        productName: product.name,
        productSku: sku,
        variant: product.variant,
        productId: product.id,
        quantity,
        expectedValue: new Prisma.Decimal(expectedValue),
        stage,
        priority,
        customerId: customer.id,
        assignedToId: owner.id,
        assignedById: manager.id,
        assignedByName: manager.name,
        contactType: "New Contact",
        requirement: `Confirm ${product.name} (${product.variant}), order quantity ${quantity}, delivery to ${city}.`,
      },
    });

    // Call log
    if (["CONTACTED", "QUALIFIED", "REQUIREMENT_CAPTURED", "QUOTATION_DRAFT", "QUOTATION_SENT", "NEGOTIATION", "PO_RECEIVED", "CONVERTED"].includes(stage)) {
      const existingCall = await prisma.callLog.findFirst({ where: { leadId: lead.id } });
      if (!existingCall) {
        await prisma.callLog.create({
          data: {
            leadId: lead.id,
            callerId: owner.id,
            customerName: name,
            phone,
            outcome: "ANSWERED",
            durationSeconds: 245,
            discussionHighlights: `Spoke with ${contactName}. Confirmed ${quantity} units for ${city}; reviewed site and delivery requirement.`,
            nextFollowUpAt: ["CONTACTED", "NEGOTIATION"].includes(stage) ? new Date(now.getTime() + 2 * 86_400_000) : null,
            intent: "Positive",
            quoteRequested: true,
            loggedAt: daysAgo(Math.max(1, index % 9)),
          },
        });
      }
    }

    // Quotation
    if (["QUOTATION_DRAFT", "QUOTATION_SENT", "NEGOTIATION", "PO_RECEIVED", "CONVERTED"].includes(stage)) {
      const quotationNo = `DEMO-QT-${String(index + 1).padStart(3, "0")}`;
      const subtotal = new Prisma.Decimal(expectedValue).div(1.18).toDecimalPlaces(2);
      const gstAmount = new Prisma.Decimal(expectedValue).minus(subtotal).toDecimalPlaces(2);
      const quoteStatus = stage === "QUOTATION_DRAFT" ? "DRAFT" : stage === "PO_RECEIVED" || stage === "CONVERTED" ? "CONVERTED" : "SENT_TO_CLIENT";

      const quotation = await prisma.quotation.upsert({
        where: { quotationNo },
        update: {
          leadId: lead.id,
          customerId: customer.id,
          salesRepresentativeId: owner.id,
          status: quoteStatus,
          subtotal,
          taxableAmount: subtotal,
          gstPercent: 18,
          gstAmount,
          taxAmount: gstAmount,
          total: expectedValue,
          validUntil: new Date(daysAgo(-15)),
          paymentTerms: "50% advance, balance before dispatch",
          deliveryTerms: "Delivery to customer site",
        },
        create: {
          quotationNo,
          leadId: lead.id,
          customerId: customer.id,
          salesRepresentativeId: owner.id,
          status: quoteStatus,
          subtotal,
          taxableAmount: subtotal,
          gstPercent: 18,
          gstAmount,
          taxAmount: gstAmount,
          total: expectedValue,
          validUntil: new Date(daysAgo(-15)),
          validityDays: 15,
          callerName: contactName,
          preparedBy: owner.name,
          paymentTerms: "50% advance, balance before dispatch",
          deliveryTerms: "Delivery to customer site",
          sentAt: quoteStatus === "DRAFT" ? null : daysAgo(Math.max(1, index % 7)),
          emailSentAt: quoteStatus === "DRAFT" ? null : daysAgo(Math.max(1, index % 7)),
          emailRecipient: quoteStatus === "DRAFT" ? null : email,
          items: {
            create: [
              {
                productId: product.id,
                description: `${product.name} · ${product.variant}`,
                quantity,
                unitPrice: subtotal.div(quantity).toDecimalPlaces(2),
                taxPercent: 18,
                subtotal,
                lineTotal: new Prisma.Decimal(expectedValue),
              },
            ],
          },
        },
      });

      // Sales Order
      if (stage === "PO_RECEIVED" || stage === "CONVERTED") {
        const customerPONumber = `DEMO-PO-${String(index + 1).padStart(3, "0")}`;
        const existingOrder = await prisma.salesOrder.findUnique({ where: { quotationId: quotation.id } });
        if (!existingOrder) {
          const order = await prisma.salesOrder.create({
            data: {
              orderNumber: `DEMO-SO-${String(index + 1).padStart(3, "0")}`,
              quotationId: quotation.id,
              customerId: customer.id,
              createdById: owner.id,
              customerPONumber,
              productSummary: `${product.name} · ${product.variant}`,
              quantitySummary: String(quantity),
              deliveryLocation: `${city}, ${state}`,
              status: stage === "CONVERTED" ? "CONFIRMED" : "PENDING",
              orderDate: daysAgo(Math.max(1, index % 6)),
              confirmedAt: stage === "CONVERTED" ? daysAgo(1) : null,
              subtotal,
              gstAmount,
              grandTotal: expectedValue,
              notes: "Seeded demonstration order; verified customer PO.",
            },
          });
          await prisma.salesOrderItem.create({
            data: {
              salesOrderId: order.id,
              productId: product.id,
              productSkuSnapshot: product.sku,
              productNameSnapshot: product.name,
              quantity,
              unitPrice: subtotal.div(quantity).toDecimalPlaces(2),
              gstPercent: 18,
              baseAmount: subtotal,
              taxableAmount: subtotal,
              gstAmount,
              lineTotal: expectedValue,
            },
          });
        }
      }
    }
  }

  // 4. Seed Vendors, Purchase Orders, Bills & Costing
  console.log("▶ Seeding Vendors, Vendor Bills & Job Costing...");
  const vendors = {};
  const VENDOR_DEFS = [
    { code: "VEND-TEST-001", name: "Test Supplier Pvt Ltd", category: "Materials", city: "Mumbai" },
    { code: "VEND-LOG-TEST", name: "Test Transport Co", category: "Transport", city: "Pune" },
    { code: "VEND-SVC-TEST", name: "Test Site Services Co", category: "Site Services", city: "Pune" },
  ];
  for (const v of VENDOR_DEFS) {
    vendors[v.code] = await prisma.vendor.upsert({
      where: { code: v.code },
      update: { name: v.name, category: v.category, city: v.city },
      create: {
        code: v.code,
        name: v.name,
        category: v.category,
        gstin: "27BBBCS5678G1Z2",
        city: v.city,
        state: "Maharashtra",
      },
    });
  }

  const defaultUser = seededUsers[0];
  const firstCustomer = await prisma.customer.findFirst();

  const costOrder = await prisma.salesOrder.upsert({
    where: { orderNumber: "SO-COST-001" },
    update: { status: "DELIVERED" },
    create: {
      orderNumber: "SO-COST-001",
      customerId: firstCustomer.id,
      createdById: defaultUser.id,
      status: "DELIVERED",
      subtotal: "169491.53",
      gstAmount: "30508.47",
      grandTotal: "200000",
      invoiceStatus: "Issued",
      orderDate: daysFromNow(-40),
    },
  });

  for (const inv of SEED_INVOICES) {
    await prisma.invoice.upsert({
      where: { invoiceNo: inv.invoiceNo },
      update: { status: inv.status, paidAmount: inv.paidAmount },
      create: {
        invoiceNo: inv.invoiceNo,
        customerId: firstCustomer.id,
        salesOrderId: costOrder.id,
        status: inv.status,
        issueDate: daysFromNow(-inv.issueDaysAgo),
        dueDate: daysFromNow(inv.dueInDays),
        subtotal: inv.subtotal,
        taxAmount: inv.taxAmount,
        total: inv.total,
        paidAmount: inv.paidAmount,
      },
    });
  }

  const po = await prisma.purchaseOrder.upsert({
    where: { poNumber: "PO-TEST-001" },
    update: { status: "RECEIVED" },
    create: {
      poNumber: "PO-TEST-001",
      vendorId: vendors["VEND-TEST-001"].id,
      status: "RECEIVED",
      orderDate: daysFromNow(-20),
      subtotal: "50000",
      taxAmount: "9000",
      total: "59000",
    },
  });

  await prisma.goodsReceipt.upsert({
    where: { grnNumber: "GRN-TEST-001" },
    update: { status: "ACCEPTED" },
    create: {
      grnNumber: "GRN-TEST-001",
      purchaseOrderId: po.id,
      status: "ACCEPTED",
      receivedAt: daysFromNow(-15),
    },
  });

  for (const b of SEED_VENDOR_BILLS) {
    await prisma.vendorBill.upsert({
      where: { billNo: b.billNo },
      update: { status: b.status, paidAmount: b.paidAmount },
      create: {
        billNo: b.billNo,
        vendorId: vendors[b.vendorCode].id,
        purchaseOrderId: b.poNumber === "PO-TEST-001" ? po.id : null,
        status: b.status,
        billDate: daysFromNow(-b.billDaysAgo),
        dueDate: daysFromNow(b.dueInDays),
        subtotal: b.subtotal,
        taxAmount: b.taxAmount,
        total: b.total,
        paidAmount: b.paidAmount,
      },
    });
  }

  // 5. Seed Project and Costing Chain
  const project = await prisma.project.upsert({
    where: { projectCode: "JOB-TEST-001" },
    update: { status: "IN_PROGRESS" },
    create: {
      projectCode: "JOB-TEST-001",
      salesOrderId: costOrder.id,
      customerId: firstCustomer.id,
      ownerId: defaultUser.id,
      name: "Solar Substation Grounding - EPC Demo",
      status: "IN_PROGRESS",
      plannedStart: daysFromNow(-20),
    },
  });

  for (const c of JOB_COST_POS) {
    const pr = await prisma.purchaseRequest.upsert({
      where: { requestNo: c.pr.requestNo },
      update: { status: "CONVERTED" },
      create: {
        requestNo: c.pr.requestNo,
        salesOrderId: costOrder.id,
        status: "CONVERTED",
        requestedById: defaultUser.id,
        notes: c.pr.notes,
      },
    });
    const rfq = await prisma.rFQ.upsert({
      where: { rfqNo: c.rfq.rfqNo },
      update: { status: "AWARDED" },
      create: {
        rfqNo: c.rfq.rfqNo,
        purchaseRequestId: pr.id,
        status: "AWARDED",
        sentAt: daysFromNow(-18),
      },
    });
    await prisma.purchaseOrder.upsert({
      where: { poNumber: c.po.poNumber },
      update: { status: "RECEIVED" },
      create: {
        poNumber: c.po.poNumber,
        vendorId: vendors[c.po.vendorCode].id,
        rfqId: rfq.id,
        status: "RECEIVED",
        orderDate: daysFromNow(-18),
        subtotal: c.po.subtotal,
        taxAmount: c.po.taxAmount,
        total: c.po.total,
      },
    });
  }

  // 6. Service Tickets
  const SEED_TICKETS = [
    { ticketNo: "SVC-TEST-001", issue: "Substation earthing resistance check above 2 ohms", status: "IN_PROGRESS", serialNumber: "SN-CHL-0001", reportedDaysAgo: 4 },
    { ticketNo: "SVC-TEST-002", issue: "Lightning protection rod inspection requested", status: "OPEN", serialNumber: "SN-CMP-0002", reportedDaysAgo: 1 },
    { ticketNo: "SVC-TEST-003", issue: "Annual preventive maintenance and soil resistivity", status: "CLOSED", serialNumber: "SN-CHL-0003", reportedDaysAgo: 30 },
  ];
  for (const t of SEED_TICKETS) {
    await prisma.serviceTicket.upsert({
      where: { ticketNo: t.ticketNo },
      update: { status: t.status },
      create: {
        ticketNo: t.ticketNo,
        customerId: firstCustomer.id,
        issue: t.issue,
        status: t.status,
        serialNumber: t.serialNumber,
        assignedToId: defaultUser.id,
        reportedAt: daysFromNow(-t.reportedDaysAgo),
        warrantyStart: daysFromNow(-400),
        warrantyEnd: daysFromNow(300),
      },
    });
  }

  // 7. Seed Tasks for Daily Control
  const taskCount = await prisma.task.count();
  if (taskCount === 0) {
    const defaultTasks = [
      { taskNo: "TSK-001", title: "Review high-value Copper Rod quote for SuryaGrid", department: "Sales", priority: "HIGH", status: "IN_PROGRESS" },
      { taskNo: "TSK-002", title: "Conduct earth resistance soil survey at Pune site", department: "Projects", priority: "CRITICAL", status: "OPEN" },
      { taskNo: "TSK-003", title: "Release BOM Revision 2 for Chemical Earthing Electrode", department: "Engineering", priority: "MEDIUM", status: "WAITING_APPROVAL" },
      { taskNo: "TSK-004", title: "Match vendor bill with GRN for Test Supplier PO-001", department: "Finance", priority: "HIGH", status: "OPEN" },
      { taskNo: "TSK-005", title: "Inspect incoming shipment of 17.2mm Copper bonded rods", department: "Warehouse", priority: "MEDIUM", status: "COMPLETED" },
    ];
    for (const t of defaultTasks) {
      await prisma.task.create({
        data: {
          taskNo: t.taskNo,
          title: t.title,
          department: t.department,
          priority: t.priority,
          status: t.status,
          createdById: defaultUser.id,
          assignedToId: manager.id,
          projectId: project.id,
        },
      });
    }
  }

  console.log("\n===============================================================");
  console.log("✅ SEEDING FINISHED SUCCESSFULLY WITH ZERO DUPLICATES!");
  console.log("===============================================================");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });