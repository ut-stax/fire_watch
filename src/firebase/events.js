/**
 * Firestore events collection helper functions
 * Handles all read/write operations for security events
 */

import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { normalizeEvent, validateEvent } from '../utils/normalizer';

const EVENTS_COLLECTION = 'events';

/**
 * Add a new event to Firestore
 * @param {Object} eventData - Event data (will be normalized)
 * @returns {Promise<string>} Document ID of the created event
 */
export async function addEvent(eventData) {
  try {
    // Normalize and validate the event
    const normalizedEvent = normalizeEvent(eventData);
    const validation = validateEvent(normalizedEvent);

    if (!validation.valid) {
      throw new Error(`Event validation failed: ${validation.errors.join(', ')}`);
    }

    // Add server timestamp
    const eventToWrite = {
      ...normalizedEvent,
      timestamp: serverTimestamp(),
    };

    // Write to Firestore
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), eventToWrite);
    console.log(`Event added with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
}

/**
 * Get the most recent N events from Firestore
 * @param {number} limitN - Number of events to retrieve (default: 100)
 * @returns {Promise<Array>} Array of event objects with their document IDs
 */
export async function getRecentEvents(limitN = 100) {
  try {
    const eventsQuery = query(
      collection(db, EVENTS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(limitN)
    );

    const snapshot = await getDocs(eventsQuery);
    const events = [];

    snapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return events;
  } catch (error) {
    console.error('Error fetching recent events:', error);
    throw error;
  }
}

/**
 * Get all events from Firestore (no limit)
 * Use with caution in production
 * @returns {Promise<Array>} Array of all event objects
 */
export async function getAllEvents() {
  try {
    const snapshot = await getDocs(collection(db, EVENTS_COLLECTION));
    const events = [];

    snapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return events;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
}
