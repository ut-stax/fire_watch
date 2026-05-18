/**
 * Filter Controls Component
 * Severity, event type, and source IP dropdown filters
 */

import { useMemo } from 'react';

const SEVERITY_LEVELS = ['All', 'Critical', 'High', 'Medium', 'Low', 'Info'];
const EVENT_TYPES = ['All', 'failed_login', 'port_scan', 'privilege_escalation', 'successful_login', 'info'];

export function FilterControls({ events, filters, onFilterChange }) {
  const uniqueIPs = useMemo(() => {
    const ips = new Set(['All']);
    events.forEach((event) => {
      if (event.source_ip) {
        ips.add(event.source_ip);
      }
    });
    return Array.from(ips).sort();
  }, [events]);

  const handleSeverityChange = (e) => {
    onFilterChange('severity', e.target.value);
  };

  const handleEventTypeChange = (e) => {
    onFilterChange('eventType', e.target.value);
  };

  const handleIPChange = (e) => {
    onFilterChange('sourceIP', e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <select
        value={filters.severity || 'All'}
        onChange={handleSeverityChange}
        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {SEVERITY_LEVELS.map((level) => (
          <option key={level} value={level}>
            {level === 'All' ? 'All Severities' : level}
          </option>
        ))}
      </select>

      <select
        value={filters.eventType || 'All'}
        onChange={handleEventTypeChange}
        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {EVENT_TYPES.map((type) => (
          <option key={type} value={type}>
            {type === 'All' ? 'All Event Types' : type.replace(/_/g, ' ')}
          </option>
        ))}
      </select>

      <select
        value={filters.sourceIP || 'All'}
        onChange={handleIPChange}
        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-40"
      >
        {uniqueIPs.map((ip) => (
          <option key={ip} value={ip}>
            {ip === 'All' ? 'All IPs' : ip}
          </option>
        ))}
      </select>
    </div>
  );
}