import express from "express";
import {
  getAuditLogs,
  getResourceAuditLogs,
  getUserAuditLogs,
  getRoomCapacityHistory,
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

// Get room capacity change history
auditLogRouter.get(
  "/room/:roomId/capacity-history",
  ClerkExpressRequireAuth(),
  getRoomCapacityHistory,
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
