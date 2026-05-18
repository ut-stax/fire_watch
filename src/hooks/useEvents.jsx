/**
 * useEvents custom hook
 * Streams live events from Firestore in real-time using onSnapshot
 */

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * useEvents hook
 * Subscribes to the events collection and provides real-time updates
 * @param {number} maxEvents - Maximum number of events to keep in memory (default: 200)
 * @returns {Object} { events, loading, error }
 */
export function useEvents(maxEvents = 200) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Create query: order by timestamp descending, limit to maxEvents
    const eventsQuery = query(
      collection(db, 'events'),
      orderBy('timestamp', 'desc'),
      limit(maxEvents)
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        try {
          const eventsList = [];
          snapshot.forEach((doc) => {
            eventsList.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setEvents(eventsList);
          setLoading(false);
          setError(null);
        } catch (err) {
          console.error('Error processing events snapshot:', err);
          setError(err);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error subscribing to events:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [maxEvents]);

  return { events, loading, error };
}
