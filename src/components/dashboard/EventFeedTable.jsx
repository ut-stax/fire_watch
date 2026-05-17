/**
 * Event Feed Table Component
 * Displays recent events in a table format with severity badges
 */

import { format } from 'date-fns';
import { getSeverityColor } from '../../utils/severityColors';

export function EventFeedTable({ events = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Live Event Feed</h3>
        <div className="space-y-3">
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

  const displayEvents = events.slice(0, 50);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Live Event Feed</h3>
        <p className="text-gray-400 text-sm mt-1">
          {events.length} events (showing latest 50)
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-700 border-b border-gray-600">
              <th className="px-6 py-3 text-left text-gray-300 font-semibold">
                Time
              </th>
              <th className="px-6 py-3 text-left text-gray-300 font-semibold">
                Source IP
              </th>
              <th className="px-6 py-3 text-left text-gray-300 font-semibold">
                Type
              </th>
              <th className="px-6 py-3 text-left text-gray-300 font-semibold">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-gray-300 font-semibold">
                Message
              </th>
            </tr>
          </thead>
          <tbody>
            {displayEvents.length > 0 ? (
              displayEvents.map((event) => {
                const severityColor = getSeverityColor(event.severity);
                const eventTime = event.timestamp?.toDate?.()
                  ? event.timestamp.toDate()
                  : new Date(event.timestamp);

                return (
                  <tr
                    key={event.id}
                    className="border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-3 text-gray-300 whitespace-nowrap">
                      {format(eventTime, 'HH:mm:ss')}
                    </td>
                    <td className="px-6 py-3 text-gray-300 font-mono text-xs">
                      {event.source_ip}
                    </td>
                    <td className="px-6 py-3 text-gray-300">
                      {event.event_type.replace(/_/g, ' ')}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${severityColor.badge}`}
                      >
                        {event.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-300 max-w-xs truncate">
                      {event.message}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No events yet. Generate some to see them appear here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
