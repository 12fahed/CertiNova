import AuditLog from '../models/AuditLog.js';

const auditLogger = async ({ action, userId, email, ipAddress, userAgent, status, details }) => {
  try {
    await AuditLog.create({
      action,
      userId: userId || null,
      email: email || null,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      status,
      details: details || null
    });
  } catch (error) {
    console.error('Audit log error:', error.message);
  }
};

export default auditLogger;