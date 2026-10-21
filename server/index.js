// ============================================================================
// YASH GROUP ERP - Unified API entry point.
//
// Folder layout:
//   config/permissions.js   -> RBAC map (roles -> modules -> actions)
//   lib/prisma.js           -> shared Prisma client
//   modules/<name>/         -> self-contained feature workspaces
// ============================================================================

import "dotenv/config";
import express from "express";
import cors from "cors";
// Native lightweight cookie parser middleware
const cookieParserMiddleware = (req, _res, next) => {
  req.cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [key, ...v] = cookie.split("=");
      if (key) req.cookies[key.trim()] = decodeURIComponent(v.join("=").trim());
    });
  }
  next();
};

import errorHandler from "./common/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import modulesRouter from "./modules/index.js";
import financeRoutes from "./modules/finance/finance.routes.js";
import engineeringRoutes from "./modules/engineering/engineering.routes.js";
import productsRoutes from "./modules/engineering/products.routes.js";
import specificationsRoutes from "./modules/engineering/specifications.routes.js";
import bomsRoutes from "./modules/engineering/boms.routes.js";
import traceabilityRoutes from "./modules/engineering/traceability.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import leadRoutes from "./modules/leads/lead.routes.js";
import serviceRoutes from "./modules/services/service.routes.js";

import { prisma } from "./lib/prisma.js";
import { createModularApiRoutes } from "./src/modules/index.js";
import { createAuthenticate } from "./src/middleware/authenticate.js";
import csrf from "./src/middleware/csrf.js";

// BigInt JSON serialization support
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "15mb" }));
app.use(cookieParserMiddleware);

// System Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "YASH ERP Unified backend is running",
    modules: [
      "Module 1: CRM & Sales Management",
      "Module 2: Project, Installation & Service Tickets",
      "Module 3: Product & Engineering Workspace",
      "Module 5: Procurement, Inventory & Vendors",
      "Module 6: Commercial & Finance ERP"
    ],
    timestamp: new Date().toISOString()
  });
});

// Authentication Routes (JWT / bearer + profile)
app.use("/api/auth", authRoutes);

// Module 3: Product & Engineering Workspace (Mount products before general /api router)
app.use("/api/products", productsRoutes);
app.use("/api/specifications", specificationsRoutes);
app.use("/api/boms", bomsRoutes);
app.use("/api/traceability", traceabilityRoutes);
app.use("/api/engineering", engineeringRoutes);

// Module 1: CRM & Sales Workspace (Customers, Enquiries, Quotations, Sales Orders, Invoices, Dashboard)
const crmSalesRouter = createModularApiRoutes({
  prisma,
  authenticate: createAuthenticate(prisma),
  csrf,
  production: process.env.NODE_ENV === "production"
});
app.use("/api", crmSalesRouter);
app.use("/api/v1", crmSalesRouter);

// Module 6: Commercial & Finance ERP
app.use("/api/finance", financeRoutes);

// Module 2 & 5: Field Operations, Projects, Installations, Service Tickets, Procurement, Inventory, Vendors
app.use("/api", modulesRouter);

app.use("/api/users", userRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/services", serviceRoutes);

// Central Error Handler & 404
app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found`
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🚀 YASH GROUP ERP - Unified Server`);
  console.log(`📡 All 5 Modules Running on http://localhost:${PORT}`);
  console.log(`========================================================`);
});
