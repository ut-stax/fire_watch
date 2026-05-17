/**
 * Events Table Component
 * Paginated table with sortable columns and clickable IP pivot
 */

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { getSeverityColor, getSeverityLabel } from '../../utils/severityColors';

export function EventsTable({ events, onIPClick, rowsPerPage = 50 }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (aVal === undefined || aVal === null) aVal = '';
      if (bVal === undefined || bVal === null) bVal = '';

      if (sortConfig.key === 'timestamp' || sortConfig.key === 'triggered_at') {
        const aTime = aVal?.toDate?.() ? aVal.toDate().getTime() : new Date(aVal).getTime();
        const bTime = bVal?.toDate?.() ? bVal.toDate().getTime() : new Date(bVal).getTime();
        return sortConfig.direction === 'asc' ? aTime - bTime : bTime - aTime;
      }

      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [events, sortConfig]);

  const totalPages = Math.ceil(sortedEvents.length / rowsPerPage);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedEvents.slice(start, start + rowsPerPage);
  }, [sortedEvents, currentPage, rowsPerPage]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
    setCurrentPage(1);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  const handleIPClick = (ip) => {
    if (onIPClick) {
      onIPClick(ip);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-700 border-b border-gray-600">
              <th
                className="px-4 py-3 text-left text-gray-300 font-semibold cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort('timestamp')}
              >
                Time {getSortIndicator('timestamp')}
              </th>
              <th
                className="px-4 py-3 text-left text-gray-300 font-semibold cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort('source_ip')}
              >
                Source IP {getSortIndicator('source_ip')}
              </th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Dest IP</th>
              <th
                className="px-4 py-3 text-left text-gray-300 font-semibold cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort('event_type')}
              >
                Type {getSortIndicator('event_type')}
              </th>
              <th
                className="px-4 py-3 text-left text-gray-300 font-semibold cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort('severity')}
              >
                Severity {getSortIndicator('severity')}
              </th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Message</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEvents.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  No events match the current filters
                </td>
              </tr>
            ) : (
              paginatedEvents.map((event) => {
                const eventTime = event.timestamp?.toDate?.()
                  ? event.timestamp.toDate()
                  : new Date(event.timestamp);
                const severityColor = getSeverityColor(event.severity);

                return (
                  <tr
                    key={event.id}
                    className="border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap text-xs">
                      {format(eventTime, 'MMM dd, HH:mm:ss')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleIPClick(event.source_ip)}
                        className="text-blue-400 hover:text-blue-300 font-mono text-xs underline"
                      >
                        {event.source_ip}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-300 font-mono text-xs">
                      {event.dest_ip || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs">
                      {event.event_type?.replace(/_/g, ' ') || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${severityColor.badge}`}
                      >
                        {getSeverityLabel(event.severity)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs max-w-xs truncate">
                      {event.message || '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-700 text-gray-300 rounded disabled:opacity-50 hover:bg-gray-600"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-700 text-gray-300 rounded disabled:opacity-50 hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}