import auditLogModel from "../models/auditLog.models.js";
import roomModel from "../models/room.models.js";
import bookingModel from "../models/booking.models.js";
import userModel from "../models/user.models.js";

// Get audit logs with filters
export const getAuditLogs = async (req, res) => {
  try {
    const {
      action,
      resourceType,
      resourceId,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = req.query;

    const userId = req.auth?.userId || req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Check if user is admin
    const user = await userModel.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const result = await auditLogModel.getLogs({
      action,
      resourceType,
      resourceId,
      startDate,
      endDate,
      limit: parseInt(limit),
      skip,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get audit logs for specific resource
export const getResourceAuditLogs = async (req, res) => {
  try {
    const { resourceType, resourceId } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const userId = req.auth?.userId || req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Check if user is admin
    const user = await userModel.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const result = await auditLogModel.getLogs({
      resourceType: resourceType.toUpperCase(),
      resourceId,
      limit: parseInt(limit),
      skip,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching resource audit logs:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get audit logs by user
export const getUserAuditLogs = async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const userId = req.auth?.userId || req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Check if user is admin
    const user = await userModel.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const result = await auditLogModel.getLogs({
      performedBy: targetUserId,
      limit: parseInt(limit),
      skip,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching user audit logs:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get capacity change history for a room
export const getRoomCapacityHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50 } = req.query;

    const userId = req.auth?.userId || req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Check if user is admin
    const user = await userModel.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // Get room info
    const room = await roomModel.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Get capacity update logs
    const logs = await auditLogModel
      .find({
        resourceId: roomId,
        action: "CAPACITY_UPDATE",
      })
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      room: {
        _id: room._id,
        type: room.type,
        totalRooms: room.totalRooms,
        availableRooms: room.availableRooms,
      },
      history: logs,
    });
  } catch (error) {
    console.error("Error fetching room capacity history:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get audit statistics
export const getAuditStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const userId = req.auth?.userId || req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Check if user is admin
    const user = await userModel.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Get statistics
    const [totalLogs, actionStats, resourceStats, recentLogs] =
      await Promise.all([
        auditLogModel.countDocuments(dateFilter),
        auditLogModel.aggregate([
          { $match: dateFilter },
          { $group: { _id: "$action", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        auditLogModel.aggregate([
          { $match: dateFilter },
          { $group: { _id: "$resourceType", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        auditLogModel
          .find(dateFilter)
          .populate("performedBy", "name email")
          .sort({ createdAt: -1 })
          .limit(10),
      ]);

    return res.status(200).json({
      success: true,
      statistics: {
        totalLogs,
        byAction: actionStats,
        byResource: resourceStats,
        recentActivity: recentLogs,
      },
    });
  } catch (error) {
    console.error("Error fetching audit statistics:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Export audit logs as CSV
export const exportAuditLogs = async (req, res) => {
  try {
    const {
      action,
      resourceType,
      startDate,
      endDate,
      format = "csv",
    } = req.query;

    const userId = req.auth?.userId || req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Check if user is admin
    const user = await userModel.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const query = {};
    if (action) query.action = action;
    if (resourceType) query.resourceType = resourceType;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await auditLogModel
      .find(query)
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(5000); // Limit untuk performance

    if (format === "csv") {
      // Generate CSV
      const csvRows = [
        [
          "Timestamp",
          "Action",
          "Resource Type",
          "Resource ID",
          "Performed By",
          "Email",
          "Description",
          "Status",
          "IP Address",
        ].join(","),
      ];

      logs.forEach((log) => {
        const row = [
          new Date(log.createdAt).toISOString(),
          log.action,
          log.resourceType,
          log.resourceId,
          log.performedBy?.name || "N/A",
          log.performedBy?.email || "N/A",
          `"${log.description.replace(/"/g, '""')}"`,
          log.status,
          log.metadata?.ip || "N/A",
        ].join(",");
        csvRows.push(row);
      });

      const csv = csvRows.join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="audit-logs-${Date.now()}.csv"`,
      );
      return res.send(csv);
    } else if (format === "json") {
      // Return JSON
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="audit-logs-${Date.now()}.json"`,
      );
      return res.json({
        success: true,
        exportDate: new Date().toISOString(),
        totalRecords: logs.length,
        logs,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid format. Use 'csv' or 'json'",
      });
    }
  } catch (error) {
    console.error("Error exporting audit logs:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
