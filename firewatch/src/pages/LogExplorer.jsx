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
import { Paper, Typography, Box, Alert, Button } from '@mui/material';

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

  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (event) =>
          event.source_ip?.toLowerCase().includes(term) ||
          event.event_type?.toLowerCase().includes(term) ||
          event.message?.toLowerCase().includes(term)
      );
    }

    if (filters.severity && filters.severity !== 'All') {
      result = result.filter((event) => event.severity === filters.severity.toLowerCase());
    }

    if (filters.eventType && filters.eventType !== 'All') {
      result = result.filter((event) => event.event_type === filters.eventType);
    }

    if (filters.sourceIP && filters.sourceIP !== 'All') {
      result = result.filter((event) => event.source_ip === filters.sourceIP);
    }

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
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h3" gutterBottom>
          Log Explorer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search and investigate security events
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">Error loading events</Typography>
          <Typography variant="body2">{error.message}</Typography>
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: { lg: 'center' },
            gap: 2,
          }}
        >
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <FilterControls events={events} filters={filters} onFilterChange={handleFilterChange} />
        </Box>
      </Paper>

      {ipFilter && (
        <Alert
          severity="info"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => setIpFilter(null)}>
              Clear filter
            </Button>
          }
        >
          Filtering by IP: <strong>{ipFilter}</strong>
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredEvents.length} of {events.length} events
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={handleExportCSV}
          disabled={filteredEvents.length === 0}
        >
          Export CSV
        </Button>
      </Box>

      <Paper>
        {loading ? (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[...Array(10)].map((_, i) => (
                <Box key={i} sx={{ height: 40, bgcolor: 'grey.800', borderRadius: 1 }} />
              ))}
            </Box>
          </Box>
        ) : (
          <EventsTable events={filteredEvents} onIPClick={handleIPClick} />
        )}
      </Paper>
    </Box>
  );
}