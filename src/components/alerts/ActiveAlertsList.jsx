/**
 * Active Alerts List Component
 * Displays unacknowledged alerts sorted by severity and time
 */

import { AlertCard } from './AlertCard';
import { getSeverityOrder } from '../../utils/severityColors';

export function ActiveAlertsList({
  alerts = [],
  loading = false,
  selectedAlert = null,
  onSelectAlert,
  onAcknowledgeAlert,
}) {
  // Sort alerts: Critical first, then High, then by triggered_at descending
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityDiff = getSeverityOrder(a.severity) - getSeverityOrder(b.severity);
    if (severityDiff !== 0) return severityDiff;

    const timeA = a.triggered_at?.toDate?.()
      ? a.triggered_at.toDate().getTime()
      : new Date(a.triggered_at).getTime();
    const timeB = b.triggered_at?.toDate?.()
      ? b.triggered_at.toDate().getTime()
      : new Date(b.triggered_at).getTime();
    return timeB - timeA;
  });

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Active Alerts</h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-700 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">
        Active Alerts {alerts.length > 0 && `(${alerts.length})`}
      </h2>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">✓</div>
          <p className="text-gray-400">
            No active alerts — environment is clear.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              isSelected={selectedAlert?.id === alert.id}
              onSelect={onSelectAlert}
              onAcknowledge={onAcknowledgeAlert}
            />
          ))}
        </div>
      )}
    </div>
  );
}
