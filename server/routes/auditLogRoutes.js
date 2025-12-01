import express from "express";
import {
  getAuditLogs,
  getResourceAuditLogs,
  getUserAuditLogs,
  getSparepartStockHistory,
  getAuditStatistics,
  exportAuditLogs,
} from "../controllers/auditLogController.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const auditLogRouter = express.Router();

// Middleware to require authentication
// All routes require admin authentication

// Get all audit logs with filters
auditLogRouter.get("/", ClerkExpressRequireAuth(), getAuditLogs);

// Get audit logs for specific resource
auditLogRouter.get(
  "/resource/:resourceType/:resourceId",
  ClerkExpressRequireAuth(),
  getResourceAuditLogs,
);

// Get audit logs by user
auditLogRouter.get(
  "/user/:userId",
  ClerkExpressRequireAuth(),
  getUserAuditLogs,
);

// Get sparepart stock change history
auditLogRouter.get(
  "/sparepart/:sparepartId/stock-history",
  ClerkExpressRequireAuth(),
  getSparepartStockHistory,
);

// Get audit statistics
auditLogRouter.get(
  "/statistics",
  ClerkExpressRequireAuth(),
  getAuditStatistics,
);

// Export audit logs (CSV or JSON)
auditLogRouter.get("/export", ClerkExpressRequireAuth(), exportAuditLogs);

export default auditLogRouter;
