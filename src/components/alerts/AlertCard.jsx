/**
 * Alert Card Component
 * Displays a single alert with severity badge, rule name, source IP, and acknowledge button
 */

import { format } from 'date-fns';
import { getSeverityColor, getSeverityLabel } from '../../utils/severityColors';

export function AlertCard({ alert, onSelect, onAcknowledge, isSelected = false }) {
  const handleAcknowledge = (e) => {
    e.stopPropagation();
    onAcknowledge(alert.id);
  };

  const severityColor = getSeverityColor(alert.severity);
  const alertTime = alert.triggered_at?.toDate?.()
    ? alert.triggered_at.toDate()
    : new Date(alert.triggered_at);

  return (
    <div
      onClick={() => onSelect(alert)}
      className={`p-4 border border-l-4 rounded cursor-pointer transition ${
        isSelected
          ? 'bg-gray-700 border-gray-600 border-l-blue-500'
          : `bg-gray-800 border-gray-700 ${severityColor.borderText.split(' ')[0]}`
      } hover:bg-gray-700`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${severityColor.badge}`}>
              {getSeverityLabel(alert.severity)}
            </span>
            <p className="text-white font-semibold text-sm truncate">
              {alert.rule_name}
            </p>
          </div>
          <p className="text-gray-400 text-sm mb-1">
            Source IP: <span className="font-mono text-gray-300">{alert.source_ip}</span>
          </p>
          <p className="text-gray-500 text-xs">
            {format(alertTime, 'MMM dd, HH:mm:ss')}
          </p>
        </div>
        <button
          onClick={handleAcknowledge}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded text-xs font-semibold transition whitespace-nowrap"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
}
