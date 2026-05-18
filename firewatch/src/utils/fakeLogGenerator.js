/**
 * Fake Log Generator Utility
 * Generates realistic security events for testing and demonstrations
 */

import { normalizeEvent } from './normalizer';

// Realistic IP ranges for testing
const IP_PREFIXES = [
  '192.168.1.',
  '192.168.10.',
  '10.0.0.',
  '10.10.0.',
  '172.16.0.',
  '203.0.113.',
  '198.51.100.',
];

const COMMON_PORTS = [
  '22', '23', '80', '443', '445', '3306', '5432', '6379', '8080',
  '8443', '9200', '27017', '5672', '3389',
];

/**
 * Generate a random IP address
 * @returns {string} Random IP address
 */
function generateRandomIP() {
  const prefix = IP_PREFIXES[Math.floor(Math.random() * IP_PREFIXES.length)];
  const lastOctet = Math.floor(Math.random() * 255) + 1;
  return `${prefix}${lastOctet}`;
}

/**
 * Generate a random destination IP with optional port
 * @returns {string} Random IP address with optional :port
 */
function generateRandomDestIP() {
  const ip = generateRandomIP();
  const includePort = Math.random() > 0.5;
  if (includePort) {
    const port = COMMON_PORTS[Math.floor(Math.random() * COMMON_PORTS.length)];
    return `${ip}:${port}`;
  }
  return ip;
}

/**
 * Generate a fake event of a specific type
 * @param {string} type - Event type (brute_force_attempt, port_scan, privilege_escalation, successful_login, info)
 * @returns {Object} Normalized fake event object
 */
export function generateFakeEvent(type = 'info') {
  const sourceIP = generateRandomIP();
  const timestamp = new Date(Date.now() - Math.random() * 3600000); // Random time in last hour

  let event = {
    timestamp,
    source_ip: sourceIP,
    dest_ip: '',
    event_type: type,
    severity: 'info',
    message: '',
    raw_log: '',
  };

  switch (type.toLowerCase()) {
    case 'brute_force_attempt':
    case 'failed_login':
      event = {
        ...event,
        event_type: 'failed_login',
        severity: 'high',
        dest_ip: generateRandomDestIP(),
        message: `Failed login attempt from ${sourceIP}`,
        raw_log: `[${timestamp.toISOString()}] Failed password for user from ${sourceIP} port ${Math.floor(Math.random() * 65535)}`,
      };
      break;

    case 'successful_login':
      event = {
        ...event,
        event_type: 'successful_login',
        severity: 'info',
        dest_ip: generateRandomDestIP(),
        message: `Successful login from ${sourceIP}`,
        raw_log: `[${timestamp.toISOString()}] Accepted publickey for user from ${sourceIP} port ${Math.floor(Math.random() * 65535)}`,
      };
      break;

    case 'port_scan':
      event = {
        ...event,
        event_type: 'port_scan',
        severity: 'high',
        dest_ip: generateRandomDestIP(),
        message: `Port scan detected from ${sourceIP}`,
        raw_log: `[${timestamp.toISOString()}] Port scan detected: ${sourceIP} → multiple destinations`,
      };
      break;

    case 'privilege_escalation':
      event = {
        ...event,
        event_type: 'privilege_escalation',
        severity: 'critical',
        dest_ip: generateRandomDestIP(),
        message: `Privilege escalation attempt from ${sourceIP}`,
        raw_log: `[${timestamp.toISOString()}] sudo: Unauthorized user attempt from ${sourceIP}`,
      };
      break;

    case 'info':
    default:
      event = {
        ...event,
        event_type: 'info',
        severity: 'info',
        message: `System event from ${sourceIP}`,
        raw_log: `[${timestamp.toISOString()}] System event logged from ${sourceIP}`,
      };
      break;
  }

  // Normalize and return
  return normalizeEvent(event);
}

/**
 * Generate a burst of multiple fake events with mixed types
 * @param {number} count - Number of events to generate (default: 20)
 * @returns {Array<Object>} Array of normalized fake event objects
 */
export function generateFakeEventBurst(count = 20) {
  const eventTypes = [
    'failed_login',
    'successful_login',
    'port_scan',
    'privilege_escalation',
    'info',
  ];

  const events = [];
  for (let i = 0; i < count; i++) {
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    events.push(generateFakeEvent(randomType));
  }

  return events;
}

/**
 * Generate multiple fake events of a specific type
 * @param {string} type - Event type to generate
 * @param {number} count - Number of events to generate
 * @returns {Array<Object>} Array of normalized fake event objects
 */
export function generateFakeEventsByType(type, count = 5) {
  const events = [];
  for (let i = 0; i < count; i++) {
    events.push(generateFakeEvent(type));
  }
  return events;
}

/**
 * Generate events simulating a brute force attack from a specific IP
 * @param {string} sourceIP - Source IP to use (random if not provided)
 * @param {number} count - Number of failed logins to generate (default: 5)
 * @returns {Array<Object>} Array of failed_login events from the same source
 */
export function generateBruteForceScenario(sourceIP = null, count = 5) {
  const attackerIP = sourceIP || generateRandomIP();
  const events = [];

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - (count - i) * 5000); // Spread over 25 seconds
    const event = {
      timestamp,
      source_ip: attackerIP,
      dest_ip: generateRandomDestIP(),
      event_type: 'failed_login',
      severity: 'high',
      message: `Failed login attempt ${i + 1}/${count} from ${attackerIP}`,
      raw_log: `[${timestamp.toISOString()}] Failed password for user from ${attackerIP}`,
    };
    events.push(normalizeEvent(event));
  }

  return events;
}

/**
 * Generate events simulating a port scan from a specific IP
 * @param {string} sourceIP - Source IP to use (random if not provided)
 * @param {number} distinctIPs - Number of distinct destination IPs to scan (default: 10)
 * @returns {Array<Object>} Array of port_scan events to different destinations
 */
export function generatePortScanScenario(sourceIP = null, distinctIPs = 10) {
  const scannerIP = sourceIP || generateRandomIP();
  const events = [];

  for (let i = 0; i < distinctIPs; i++) {
    const timestamp = new Date(Date.now() - (distinctIPs - i) * 2000); // Spread over 20 seconds
    const event = {
      timestamp,
      source_ip: scannerIP,
      dest_ip: `${IP_PREFIXES[Math.floor(Math.random() * IP_PREFIXES.length)]}${Math.floor(Math.random() * 255) + 1}`,
      event_type: 'port_scan',
      severity: 'high',
      message: `Port scan from ${scannerIP} to destination ${i + 1}/${distinctIPs}`,
      raw_log: `[${timestamp.toISOString()}] Port scan detected from ${scannerIP}`,
    };
    events.push(normalizeEvent(event));
  }

  return events;
}
