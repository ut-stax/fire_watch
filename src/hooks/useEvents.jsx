/**
 * useEvents custom hook
 * Streams live events from Firestore in real-time using onSnapshot
 * Integrates with correlation engine to process events for attack pattern detection
 */

import { useEffect, useState, useRef, useMemo } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { runCorrelationEngine } from '../correlation/engine';

/**
 * useEvents hook
 * Subscribes to the events collection and provides real-time updates
 * Automatically triggers correlation rule evaluation for new events
 * @param {number} maxEvents - Maximum number of events to keep in memory (default: 200)
 * @param {Object} timeRange - Optional time range filter with from and to Date objects
 * @returns {Object} { events, loading, error }
 */
export function useEvents(maxEvents = 200, timeRange = null) {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track processed event IDs to avoid re-processing
  const processedIdsRef = useRef(new Set());

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
          const newEvents = []; // Track newly arrived events

          snapshot.forEach((doc) => {
            const event = {
              id: doc.id,
              ...doc.data(),
            };
            eventsList.push(event);

            // Detect new events that haven't been processed
            if (!processedIdsRef.current.has(doc.id)) {
              newEvents.push(event);
              processedIdsRef.current.add(doc.id);
            }
          });

          setAllEvents(eventsList);
          setLoading(false);
          setError(null);

          // Run correlation engine on each new event
          if (newEvents.length > 0) {
            newEvents.forEach((newEvent) => {
              runCorrelationEngine(eventsList, newEvent).catch((err) => {
                console.error('Error running correlation engine:', err);
              });
            });
          }
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
    return () => {
      unsubscribe();
      // Reset processed IDs on unmount
      processedIdsRef.current.clear();
    };
  }, [maxEvents]);

  // Apply time range filter if provided
  const events = useMemo(() => {
    if (!timeRange || !timeRange.from || !timeRange.to) {
      return allEvents;
    }

    const fromTime = timeRange.from.getTime();
    const toTime = timeRange.to.getTime();

    return allEvents.filter((event) => {
      const eventTime = event.timestamp?.toDate?.()
        ? event.timestamp.toDate().getTime()
        : new Date(event.timestamp).getTime();
      return eventTime >= fromTime && eventTime <= toTime;
    });
  }, [allEvents, timeRange]);

  return { events, loading, error };
}