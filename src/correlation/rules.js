/**
 * Correlation Rules Definition
 * Defines all security event correlation rules used by the rule engine
 */

/**
 * Brute Force Detection Rule
 * Triggers when 5+ failed login attempts from the same IP occur within 60 seconds
 */
const bruteForceDetection = {
  id: 'brute_force_detection',
  name: 'Brute Force Attack Detected',
  severity: 'critical',
  description: '5 or more failed login attempts from the same IP address within 60 seconds',

  evaluate(events, newEvent) {
    // Only process if newEvent is a failed_login
    if (newEvent.event_type !== 'failed_login') {
      return { triggered: false, relatedIds: [] };
    }

    const sourceIP = newEvent.source_ip;
    const newEventTime = new Date(newEvent.timestamp).getTime();
    const windowMs = 60 * 1000; // 60 seconds

    // Filter events: same source IP, failed_login type, within 60s window (including newEvent)
    const matchingEvents = events.filter((event) => {
      const eventTime = new Date(event.timestamp).getTime();
      return (
        event.source_ip === sourceIP &&
        event.event_type === 'failed_login' &&
        eventTime >= newEventTime - windowMs &&
        eventTime <= newEventTime
      );
    });

    // Trigger if 5+ failed logins in window
    const triggered = matchingEvents.length >= 5;

    return {
      triggered,
      relatedIds: triggered ? matchingEvents.map((e) => e.id) : [],
    };
  },
};

/**
 * Credential Stuffing Rule
 * Triggers when failed login is followed by successful login from same IP within 300 seconds
 */
const credentialStuffing = {
  id: 'credential_stuffing',
  name: 'Credential Stuffing Attack Suspected',
  severity: 'high',
  description: 'Failed login attempt followed by successful login from the same IP within 5 minutes',

  evaluate(events, newEvent) {
    // Only process if newEvent is a successful_login
    if (newEvent.event_type !== 'successful_login') {
      return { triggered: false, relatedIds: [] };
    }

    const sourceIP = newEvent.source_ip;
    const successfulLoginTime = new Date(newEvent.timestamp).getTime();
    const windowMs = 300 * 1000; // 300 seconds (5 minutes)

    // Look for failed login before this successful login
    const failedLoginEvent = events.find((event) => {
      const eventTime = new Date(event.timestamp).getTime();
      return (
        event.source_ip === sourceIP &&
        event.event_type === 'failed_login' &&
        eventTime < successfulLoginTime &&
        eventTime >= successfulLoginTime - windowMs
      );
    });

    if (!failedLoginEvent) {
      return { triggered: false, relatedIds: [] };
    }

    // Found pattern: failed_login → successful_login
    return {
      triggered: true,
      relatedIds: [failedLoginEvent.id, newEvent.id],
    };
  },
};

/**
 * Port Scan Detection Rule
 * Triggers when 10+ distinct destination IPs are contacted from the same source IP within 30 seconds
 */
const portScanDetection = {
  id: 'port_scan_detection',
  name: 'Port Scan Activity Detected',
  severity: 'high',
  description: '10 or more distinct destination IPs contacted from the same source IP within 30 seconds',

  evaluate(events, newEvent) {
    // Only process if newEvent is a port_scan
    if (newEvent.event_type !== 'port_scan') {
      return { triggered: false, relatedIds: [] };
    }

    const sourceIP = newEvent.source_ip;
    const newEventTime = new Date(newEvent.timestamp).getTime();
    const windowMs = 30 * 1000; // 30 seconds

    // Filter events: same source IP, port_scan type, within 30s window
    const matchingEvents = events.filter((event) => {
      const eventTime = new Date(event.timestamp).getTime();
      return (
        event.source_ip === sourceIP &&
        event.event_type === 'port_scan' &&
        eventTime >= newEventTime - windowMs &&
        eventTime <= newEventTime
      );
    });

    // Count distinct destination IPs
    const distinctDestIPs = new Set(
      matchingEvents
        .map((e) => e.dest_ip)
        .filter((ip) => ip && ip.length > 0)
    );

    // Trigger if 10+ distinct destinations
    const triggered = distinctDestIPs.size >= 10;

    return {
      triggered,
      relatedIds: triggered ? matchingEvents.map((e) => e.id) : [],
    };
  },
};

/**
 * Privilege Escalation Rule
 * Triggers when failed login is followed by privilege escalation attempt from same IP within 120 seconds
 */
const privilegeEscalation = {
  id: 'privilege_escalation',
  name: 'Privilege Escalation Attempt Detected',
  severity: 'critical',
  description: 'Failed login followed by privilege escalation attempt from the same IP within 2 minutes',

  evaluate(events, newEvent) {
    // Only process if newEvent is a privilege_escalation
    if (newEvent.event_type !== 'privilege_escalation') {
      return { triggered: false, relatedIds: [] };
    }

    const sourceIP = newEvent.source_ip;
    const escTime = new Date(newEvent.timestamp).getTime();
    const windowMs = 120 * 1000; // 120 seconds (2 minutes)

    // Look for failed login before this escalation attempt
    const failedLoginEvent = events.find((event) => {
      const eventTime = new Date(event.timestamp).getTime();
      return (
        event.source_ip === sourceIP &&
        event.event_type === 'failed_login' &&
        eventTime < escTime &&
        eventTime >= escTime - windowMs
      );
    });

    if (!failedLoginEvent) {
      return { triggered: false, relatedIds: [] };
    }

    // Found pattern: failed_login → privilege_escalation
    return {
      triggered: true,
      relatedIds: [failedLoginEvent.id, newEvent.id],
    };
  },
};

// Export all rules as an array
export const CORRELATION_RULES = [
  bruteForceDetection,
  credentialStuffing,
  portScanDetection,
  privilegeEscalation,
];

// Export individual rules for direct reference
export {
  bruteForceDetection,
  credentialStuffing,
  portScanDetection,
  privilegeEscalation,
};
