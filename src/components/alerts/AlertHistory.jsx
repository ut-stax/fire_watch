/**
 * Alert History Component
 * Displays previously acknowledged alerts in a table format
 */

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getSeverityColor, getSeverityLabel } from '../../utils/severityColors';

export function AlertHistory({ timeRange }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query with time range filters
        const constraints = [
          where('acknowledged', '==', true),
          orderBy('triggered_at', 'desc'),
        ];

        if (timeRange?.from) {
          constraints.push(where('triggered_at', '>=', timeRange.from));
        }
        if (timeRange?.to) {
          constraints.push(where('triggered_at', '<=', timeRange.to));
        }

        const alertsQuery = query(collection(db, 'alerts'), ...constraints);
        const snapshot = await getDocs(alertsQuery);
        const alertsList = [];

        snapshot.forEach((doc) => {
          alertsList.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setAlerts(alertsList);
      } catch (err) {
        console.error('Error fetching alert history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Alert History</h2>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-gray-700 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Alert History</h2>
        <p className="text-gray-400 text-sm mt-1">
          {alerts.length} acknowledged alert(s)
        </p>
      </div>

      {error && (
        <div className="p-6 text-red-200 bg-red-900 border-t border-red-700">
          <p>Error loading history: {error}</p>
        </div>
      )}

      {alerts.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No acknowledged alerts yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-700 border-t border-gray-600">
                <th className="px-6 py-3 text-left text-gray-300 font-semibold">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-gray-300 font-semibold">
                  Rule
                </th>
                <th className="px-6 py-3 text-left text-gray-300 font-semibold">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-gray-300 font-semibold">
                  Source IP
                </th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => {
                const alertTime = alert.triggered_at?.toDate?.()
                  ? alert.triggered_at.toDate()
                  : new Date(alert.triggered_at);
                const severityColor = getSeverityColor(alert.severity);

                return (
                  <tr
                    key={alert.id}
                    className="border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-3 text-gray-300 whitespace-nowrap text-xs">
                      {format(alertTime, 'MMM dd, HH:mm:ss')}
                    </td>
                    <td className="px-6 py-3 text-gray-300 max-w-xs truncate">
                      {alert.rule_name}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${severityColor.badge}`}
                      >
                        {getSeverityLabel(alert.severity)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-300 font-mono text-xs">
                      {alert.source_ip}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}