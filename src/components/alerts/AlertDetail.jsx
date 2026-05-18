/**
 * Alert Detail Panel Component
 * Displays detailed information about a selected alert and its related events
 */

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getSeverityColor, getSeverityLabel } from '../../utils/severityColors';

export function AlertDetail({ alert = null }) {
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Fetch related events when alert changes
  useEffect(() => {
    if (!alert || !alert.related_ids || alert.related_ids.length === 0) {
      return;
    }

    const fetchRelatedEvents = async () => {
      setEventsLoading(true);
      try {
        const events = [];
        for (const eventId of alert.related_ids) {
          try {
            const eventRef = doc(db, 'events', eventId);
            const eventSnap = await getDoc(eventRef);
            if (eventSnap.exists()) {
              events.push({
                id: eventSnap.id,
                ...eventSnap.data(),
              });
            }
          } catch (err) {
            console.error(`Error fetching event ${eventId}:`, err);
          }
        }
        setRelatedEvents(events);
      } catch (error) {
        console.error('Error fetching related events:', error);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchRelatedEvents();
  }, [alert]);

  if (!alert) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Select an alert to view details</p>
        </div>
      </div>
    );
  }

  const severityColor = getSeverityColor(alert.severity);
  const alertTime = alert.triggered_at?.toDate?.()
    ? alert.triggered_at.toDate()
    : new Date(alert.triggered_at);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Alert Details</h2>

      {/* Alert Metadata */}
      <div className="space-y-4 mb-6 pb-6 border-b border-gray-700">
        <div>
          <p className="text-gray-400 text-sm mb-1">Rule</p>
          <p className="text-white font-semibold">{alert.rule_name}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-1">Severity</p>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${severityColor.badge}`}
            >
              {getSeverityLabel(alert.severity)}
            </span>
          </div>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-1">Source IP</p>
          <p className="text-white font-mono text-sm">{alert.source_ip}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-1">Triggered At</p>
          <p className="text-white text-sm">{format(alertTime, 'MMM dd, yyyy HH:mm:ss')}</p>
        </div>

        {alert.related_ids && alert.related_ids.length > 0 && (
          <div>
            <p className="text-gray-400 text-sm mb-1">Related Events</p>
            <p className="text-white text-sm">{alert.related_ids.length} event(s)</p>
          </div>
        )}
      </div>

      {/* Related Events */}
      <div>
        <h3 className="text-white font-semibold mb-3">Related Events</h3>

        {eventsLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
        ) : relatedEvents.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {relatedEvents.map((event) => {
              const eventTime = event.timestamp?.toDate?.()
                ? event.timestamp.toDate()
                : new Date(event.timestamp);
              const eventSeverityColor = getSeverityColor(event.severity);

              return (
                <div
                  key={event.id}
                  className="bg-gray-700 rounded p-3 text-sm space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-gray-300 font-mono text-xs">
                      {format(eventTime, 'HH:mm:ss')}
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${eventSeverityColor.badge}`}
                    >
                      {event.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Type:</span> {event.event_type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">IP:</span> {event.source_ip}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {event.message}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No related events found</p>
        )}
      </div>
    </div>
  );
}