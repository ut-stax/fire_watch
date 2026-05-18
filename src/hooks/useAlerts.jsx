/**
 * useAlerts custom hook
 * Streams live unacknowledged alerts from Firestore in real-time using onSnapshot
 */

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * useAlerts hook
 * Subscribes to unacknowledged alerts in the alerts collection and provides real-time updates
 * @returns {Object} { alerts, loading, error }
 */
export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Create query: only unacknowledged alerts, ordered by triggered_at descending
    const alertsQuery = query(
      collection(db, 'alerts'),
      where('acknowledged', '==', false),
      orderBy('triggered_at', 'desc')
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      alertsQuery,
      (snapshot) => {
        try {
          const alertsList = [];
          snapshot.forEach((doc) => {
            alertsList.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setAlerts(alertsList);
          setLoading(false);
          setError(null);
        } catch (err) {
          console.error('Error processing alerts snapshot:', err);
          setError(err);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error subscribing to alerts:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { alerts, loading, error };
}
