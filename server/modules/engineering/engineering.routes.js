import express from "express";
import dashboardRoutes from "./dashboard.routes.js";
import productsRoutes from "./products.routes.js";
import specificationsRoutes from "./specifications.routes.js";
import bomsRoutes from "./boms.routes.js";
import documentsRoutes from "./documents.routes.js";
import tasksRoutes from "./tasks.routes.js";
import traceabilityRoutes from "./traceability.routes.js";
import reportsRoutes from "./reports.routes.js";

const router = express.Router();

router.use("/dashboard", dashboardRoutes);
router.use("/products", productsRoutes);
router.use("/specifications", specificationsRoutes);
router.use("/boms", bomsRoutes);
router.use("/documents", documentsRoutes);
router.use("/tasks", tasksRoutes);
router.use("/traceability", traceabilityRoutes);
router.use("/reports", reportsRoutes);

export default router;
