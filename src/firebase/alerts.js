/**
 * Firestore alerts collection helper functions
 * Handles all read/write operations for security alerts
 */

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

const ALERTS_COLLECTION = 'alerts';

/**
 * Create a new alert in Firestore
 * @param {Object} alertData - Alert data object
 * @param {string} alertData.rule_name - Name of the triggered rule
 * @param {string} alertData.severity - Severity level (critical, high, medium, low, info)
 * @param {string} alertData.source_ip - IP address involved in the alert
 * @param {Array<string>} alertData.related_ids - Event document IDs that triggered the alert
 * @returns {Promise<string>} Document ID of the created alert
 */
export async function addAlert(alertData) {
  try {
    const {
      rule_name,
      severity,
      source_ip,
      related_ids = [],
    } = alertData;

    // Validate required fields
    if (!rule_name || !severity || !source_ip) {
      throw new Error('Alert must include rule_name, severity, and source_ip');
    }

    const alertToWrite = {
      rule_name,
      severity,
      source_ip,
      related_ids: Array.isArray(related_ids) ? related_ids : [],
      triggered_at: serverTimestamp(),
      acknowledged: false,
    };

    const docRef = await addDoc(collection(db, ALERTS_COLLECTION), alertToWrite);
    console.log(`Alert added with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error adding alert:', error);
    throw error;
  }
}

/**
 * Acknowledge (mark as reviewed) an existing alert
 * @param {string} alertId - Document ID of the alert to acknowledge
 * @returns {Promise<void>}
 */
export async function acknowledgeAlert(alertId) {
  try {
    const alertRef = doc(db, ALERTS_COLLECTION, alertId);
    await updateDoc(alertRef, {
      acknowledged: true,
    });
    console.log(`Alert ${alertId} acknowledged`);
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    throw error;
  }
}

/**
 * Get all unacknowledged alerts from Firestore
 * Ordered by triggered_at descending (newest first)
 * @returns {Promise<Array>} Array of unacknowledged alert objects with IDs
 */
export async function getUnacknowledgedAlerts() {
  try {
    const alertsQuery = query(
      collection(db, ALERTS_COLLECTION),
      where('acknowledged', '==', false),
      orderBy('triggered_at', 'desc')
    );

    const snapshot = await getDocs(alertsQuery);
    const alerts = [];

    snapshot.forEach((doc) => {
      alerts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return alerts;
  } catch (error) {
    console.error('Error fetching unacknowledged alerts:', error);
    throw error;
  }
}

/**
 * Get all alerts from Firestore (both acknowledged and unacknowledged)
 * Ordered by triggered_at descending
 * @returns {Promise<Array>} Array of all alert objects
 */
export async function getAllAlerts() {
  try {
    const alertsQuery = query(
      collection(db, ALERTS_COLLECTION),
      orderBy('triggered_at', 'desc')
    );

    const snapshot = await getDocs(alertsQuery);
    const alerts = [];

    snapshot.forEach((doc) => {
      alerts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return alerts;
  } catch (error) {
    console.error('Error fetching all alerts:', error);
    throw error;
  }
}

/**
 * Get acknowledged alerts only
 * Ordered by triggered_at descending
 * @returns {Promise<Array>} Array of acknowledged alert objects
 */
export async function getAcknowledgedAlerts() {
  try {
    const alertsQuery = query(
      collection(db, ALERTS_COLLECTION),
      where('acknowledged', '==', true),
      orderBy('triggered_at', 'desc')
    );

    const snapshot = await getDocs(alertsQuery);
    const alerts = [];

    snapshot.forEach((doc) => {
      alerts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return alerts;
  } catch (error) {
    console.error('Error fetching acknowledged alerts:', error);
    throw error;
  }
}
