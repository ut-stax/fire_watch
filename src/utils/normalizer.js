/**
 * Event normalizer utility
 * Normalizes arbitrary input data to match the standard Firestore event schema
 */

/**
 * Normalize raw event data to standard event schema
 * @param {Object} rawData - Raw event object with arbitrary fields
 * @returns {Object} Normalized event object matching Firestore schema
 */
export function normalizeEvent(rawData) {
  if (!rawData || typeof rawData !== 'object') {
    throw new Error('Event data must be a non-null object');
  }

  return {
    timestamp: rawData.timestamp || new Date(),
    source_ip: String(rawData.source_ip || rawData.sourceIp || '').trim() || '',
    dest_ip: String(rawData.dest_ip || rawData.destIp || '').trim() || '',
    event_type: String(rawData.event_type || rawData.eventType || rawData.type || 'info')
      .toLowerCase()
      .trim() || 'info',
    severity: String(rawData.severity || 'info')
      .toLowerCase()
      .trim() || 'info',
    message: String(rawData.message || rawData.msg || '').trim() || '',
    raw_log: String(rawData.raw_log || rawData.rawLog || rawData.log || '').trim() || '',
  };
}

/**
 * Validate event object against schema
 * @param {Object} event - Event object to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateEvent(event) {
  const errors = [];

  if (!event.source_ip) {
    errors.push('source_ip is required');
  }
  if (!event.event_type) {
    errors.push('event_type is required');
  }
  if (!event.severity) {
    errors.push('severity is required');
  }
  if (!event.message) {
    errors.push('message is required');
  }

  const validEventTypes = [
    'failed_login',
    'port_scan',
    'privilege_escalation',
    'successful_login',
    'info',
    'brute_force_attempt',
  ];
  if (!validEventTypes.includes(event.event_type)) {
    errors.push(
      `event_type must be one of: ${validEventTypes.join(', ')}`
    );
  }

  const validSeverities = ['critical', 'high', 'medium', 'low', 'info'];
  if (!validSeverities.includes(event.severity)) {
    errors.push(`severity must be one of: ${validSeverities.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
