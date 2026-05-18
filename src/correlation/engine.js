/**
 * Correlation Engine
 * Processes security events against correlation rules to generate alerts
 */

import { CORRELATION_RULES } from './rules';
import { addAlert, getUnacknowledgedAlerts } from '../firebase/alerts';

/**
 * Check if a duplicate alert already exists
 * Looks for unacknowledged alerts with same rule_name and source_ip within 10 minutes
 * @param {string} ruleName - Name of the rule that triggered
 * @param {string} sourceIP - Source IP involved in the alert
 * @returns {Promise<boolean>} True if duplicate found, false otherwise
 */
async function checkDuplicateAlert(ruleName, sourceIP) {
  try {
    const unackedAlerts = await getUnacknowledgedAlerts();
    const now = Date.now();
    const tenMinutesMs = 10 * 60 * 1000;

    // Check if a recent alert with same rule and IP exists
    const duplicateExists = unackedAlerts.some((alert) => {
      const alertTime = alert.triggered_at?.toMillis?.() || 
                       new Date(alert.triggered_at).getTime();
      const timeDiff = now - alertTime;

      return (
        alert.rule_name === ruleName &&
        alert.source_ip === sourceIP &&
        timeDiff <= tenMinutesMs
      );
    });

    return duplicateExists;
  } catch (error) {
    console.error('Error checking for duplicate alerts:', error);
    // On error, allow the alert (fail open)
    return false;
  }
}

/**
 * Run the correlation engine against all rules for a new event
 * Evaluates all rules and generates alerts for triggered rules
 * @param {Array} allEvents - Complete array of events from Firestore
 * @param {Object} newEvent - The new event that triggered evaluation
 * @returns {Promise<Array>} Array of created alert IDs, or empty array if no alerts created
 */
export async function runCorrelationEngine(allEvents, newEvent) {
  const createdAlerts = [];

  try {
    // Iterate through all correlation rules
    for (const rule of CORRELATION_RULES) {
      try {
        // Evaluate the rule against events
        const result = rule.evaluate(allEvents, newEvent);

        if (!result.triggered) {
          continue;
        }

        // Rule triggered - check for duplicate alert
        const isDuplicate = await checkDuplicateAlert(rule.name, newEvent.source_ip);

        if (isDuplicate) {
          console.log(
            `Skipping duplicate alert: ${rule.name} from IP ${newEvent.source_ip}`
          );
          continue;
        }

        // Create the alert
        const alertData = {
          rule_name: rule.name,
          severity: rule.severity,
          source_ip: newEvent.source_ip,
          related_ids: result.relatedIds || [],
        };

        const alertId = await addAlert(alertData);
        createdAlerts.push(alertId);

        console.log(`Alert created: ${rule.name} (ID: ${alertId})`);
      } catch (ruleError) {
        console.error(`Error evaluating rule ${rule.id}:`, ruleError);
        // Continue to next rule on error
      }
    }
  } catch (error) {
    console.error('Error running correlation engine:', error);
  }

  return createdAlerts;
}

/**
 * Run engine against a batch of events
 * Useful for processing multiple events at once (e.g., after file upload)
 * @param {Array} events - Array of events to process
 * @returns {Promise<Array>} Array of all created alert IDs
 */
export async function runCorrelationEngineBatch(events) {
  const allAlerts = [];

  for (const event of events) {
    const alerts = await runCorrelationEngine(events, event);
    allAlerts.push(...alerts);
  }

  return allAlerts;
}
