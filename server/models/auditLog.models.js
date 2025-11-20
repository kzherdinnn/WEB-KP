import mongoose from "mongoose";

const auditLogSchema = mongoose.Schema(
  {
    // Jenis aksi yang dilakukan
    action: {
      type: String,
      required: true,
      enum: [
        'CAPACITY_UPDATE',
        'ROOM_CREATE',
        'ROOM_UPDATE',
        'ROOM_DELETE',
        'BOOKING_CREATE',
        'BOOKING_CANCEL',
        'BOOKING_STATUS_CHANGE',
        'USER_CREATE',
        'USER_UPDATE',
        'USER_DELETE',
        'PAYMENT_RECEIVED',
        'PAYMENT_FAILED',
        'WEBHOOK_RECEIVED'
      ]
    },

    // Siapa yang melakukan aksi
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },

    // Target resource yang dipengaruhi
    resourceType: {
      type: String,
      required: true,
      enum: ['ROOM', 'BOOKING', 'USER', 'BENGKEL', 'PAYMENT']
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    // Data sebelum perubahan
    previousData: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    // Data setelah perubahan
    newData: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    // Informasi tambahan
    metadata: {
      ip: { type: String },
      userAgent: { type: String },
      method: { type: String },
      endpoint: { type: String }
    },

    // Deskripsi human-readable
    description: {
      type: String,
      required: true
    },

    // Status aksi
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'PENDING'],
      default: 'SUCCESS'
    },

    // Error message jika gagal
    errorMessage: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    // Index untuk performa query
    indexes: [
      { performedBy: 1, createdAt: -1 },
      { resourceType: 1, resourceId: 1, createdAt: -1 },
      { action: 1, createdAt: -1 },
      { createdAt: -1 }
    ]
  }
);

// Method untuk membuat log dengan format standar
auditLogSchema.statics.createLog = async function({
  action,
  performedBy,
  resourceType,
  resourceId,
  previousData = null,
  newData = null,
  description,
  metadata = {},
  status = 'SUCCESS',
  errorMessage = null
}) {
  try {
    const log = await this.create({
      action,
      performedBy,
      resourceType,
      resourceId,
      previousData,
      newData,
      description,
      metadata,
      status,
      errorMessage
    });
    return log;
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw error to prevent audit log failure from breaking main operation
    return null;
  }
};

// Method untuk get logs dengan filter
auditLogSchema.statics.getLogs = async function({
  action = null,
  performedBy = null,
  resourceType = null,
  resourceId = null,
  startDate = null,
  endDate = null,
  limit = 50,
  skip = 0
}) {
  const query = {};

  if (action) query.action = action;
  if (performedBy) query.performedBy = performedBy;
  if (resourceType) query.resourceType = resourceType;
  if (resourceId) query.resourceId = resourceId;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const logs = await this.find(query)
    .populate('performedBy', 'name email role')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const total = await this.countDocuments(query);

  return {
    logs,
    total,
    page: Math.floor(skip / limit) + 1,
    totalPages: Math.ceil(total / limit)
  };
};

// Virtual untuk mendapatkan perubahan spesifik
auditLogSchema.virtual('changes').get(function() {
  if (!this.previousData || !this.newData) return null;

  const changes = {};
  const allKeys = new Set([
    ...Object.keys(this.previousData || {}),
    ...Object.keys(this.newData || {})
  ]);

  allKeys.forEach(key => {
    const oldValue = this.previousData?.[key];
    const newValue = this.newData?.[key];

    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changes[key] = {
        from: oldValue,
        to: newValue
      };
    }
  });

  return Object.keys(changes).length > 0 ? changes : null;
});

// Ensure virtuals are included in JSON
auditLogSchema.set('toJSON', { virtuals: true });
auditLogSchema.set('toObject', { virtuals: true });

const auditLogModel = mongoose.model("auditlog", auditLogSchema);

export default auditLogModel;
