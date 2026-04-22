import { query } from '../config/db.js';

export const writeAuditLog = async ({ tenantId, actorUserId, action, entityType, entityId, payload = {} }) => {
  await query(
    `INSERT INTO audit_logs (tenant_id, actor_user_id, action, entity_type, entity_id, payload)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [tenantId, actorUserId || null, action, entityType, entityId || null, payload]
  );
};
