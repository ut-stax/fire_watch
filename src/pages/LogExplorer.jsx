/**
 * Log Explorer Page
 * Search, filter, and investigate security events with CSV export
 */

import { useState, useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import { useGlobalTimeRange } from '../contexts/TimeRangeContext';
import { SearchBar } from '../components/explorer/SearchBar';
import { FilterControls } from '../components/explorer/FilterControls';
import { EventsTable } from '../components/explorer/EventsTable';

export default function LogExplorer() {
  const timeRange = useGlobalTimeRange();
  const { events, loading, error } = useEvents(500, timeRange);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    severity: 'All',
    eventType: 'All',
    sourceIP: 'All',
  });
  const [ipFilter, setIpFilter] = useState(null);

  // Filter and search events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (event) =>
          event.source_ip?.toLowerCase().includes(term) ||
          event.event_type?.toLowerCase().includes(term) ||
          event.message?.toLowerCase().includes(term)
      );
    }

    // Apply severity filter
    if (filters.severity && filters.severity !== 'All') {
      result = result.filter((event) => event.severity === filters.severity.toLowerCase());
    }

    // Apply event type filter
    if (filters.eventType && filters.eventType !== 'All') {
      result = result.filter((event) => event.event_type === filters.eventType);
    }

    // Apply IP filter
    if (filters.sourceIP && filters.sourceIP !== 'All') {
      result = result.filter((event) => event.source_ip === filters.sourceIP);
    }

    // Apply IP pivot filter
    if (ipFilter) {
      result = result.filter((event) => event.source_ip === ipFilter);
    }

    return result;
  }, [events, searchTerm, filters, ipFilter]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setIpFilter(null);
  };

  const handleIPClick = (ip) => {
    setIpFilter(ip);
    setFilters((prev) => ({ ...prev, sourceIP: ip }));
  };

  const handleExportCSV = () => {
    const headers = ['timestamp', 'source_ip', 'dest_ip', 'event_type', 'severity', 'message'];
    const csvContent = [
      headers.join(','),
      ...filteredEvents.map((event) => {
        const eventTime = event.timestamp?.toDate?.()
          ? event.timestamp.toDate().toISOString()
          : new Date(event.timestamp).toISOString();
        return [
          eventTime,
          event.source_ip || '',
          event.dest_ip || '',
          event.event_type || '',
          event.severity || '',
          `"${(event.message || '').replace(/"/g, '""')}"`,
        ].join(',');
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `firewatch-logs-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Log Explorer</h1>
          <p className="text-gray-400">Search and investigate security events</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6 text-red-200">
            <p className="font-semibold">Error loading events</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <FilterControls events={events} filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* IP Pivot Indicator */}
        {ipFilter && (
          <div className="bg-blue-900 border border-blue-700 rounded-lg p-3 mb-4 flex items-center justify-between">
            <span className="text-blue-200">
              Filtering by IP: <span className="font-mono">{ipFilter}</span>
            </span>
            <button
              onClick={() => setIpFilter(null)}
              className="text-blue-300 hover:text-blue-200 text-sm underline"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Results Info and Export */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400 text-sm">
            Showing {filteredEvents.length} of {events.length} events
          </p>
          <button
            onClick={handleExportCSV}
            disabled={filteredEvents.length === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>

        {/* Events Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-6">
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-700 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <EventsTable events={filteredEvents} onIPClick={handleIPClick} />
          )}
        </div>
      </div>
    </div>
  );
}