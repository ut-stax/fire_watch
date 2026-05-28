import { useMemo, useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import { useGlobalTimeRange } from '../contexts/TimeRangeContext';
import { SearchBar } from '../components/explorer/SearchBar';
import { FilterControls } from '../components/explorer/FilterControls';
import { EventsTable } from '../components/explorer/EventsTable';
import { Box, Button, Paper, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ExploreIcon from '@mui/icons-material/TravelExplore';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import { surfaceSx } from '../components/dashboard/dashboardStyles';

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

  const metrics = useMemo(() => {
    const totalEvents = filteredEvents.length;
    const criticalEvents = filteredEvents.filter((event) => event.severity?.toLowerCase() === 'critical').length;
    const uniqueIPs = new Set(filteredEvents.map((event) => event.source_ip).filter(Boolean)).size;
    const topEventType = Object.entries(
      filteredEvents.reduce((accumulator, event) => {
        const key = event.event_type || 'unknown';
        accumulator[key] = (accumulator[key] || 0) + 1;
        return accumulator;
      }, {})
    ).sort((a, b) => b[1] - a[1])[0];

    return [
      {
        title: 'Matching Events',
        value: totalEvents,
        caption: `${events.length} total in range`,
        icon: ExploreIcon,
      },
      {
        title: 'Critical Matches',
        value: criticalEvents,
        caption: 'Highest-priority incidents',
        icon: WarningIcon,
      },
      {
        title: 'Unique IPs',
        value: uniqueIPs,
        caption: 'Source pivots available',
        icon: NetworkCheckIcon,
      },
      {
        title: 'Top Event Type',
        value: topEventType ? topEventType[0].replace(/_/g, ' ') : 'None',
        caption: topEventType ? `${topEventType[1]} events` : 'No matches yet',
        icon: SecurityIcon,
      },
    ];
  }, [filteredEvents, events.length]);

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
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ display: 'grid', gap: 3, width: '100%', maxWidth: '1280px', minWidth: 0 }}>
        <Paper sx={{ ...surfaceSx, p: { xs: 2.5, sm: 3 }, position: 'sticky', top: 0, zIndex: 20, bgcolor: 'var(--color-header-blur-bg)', backdropFilter: 'blur(12px)' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.15, color: 'var(--color-text-primary)' }}>
                Log Explorer
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', mt: 0.75, maxWidth: 640 }}>
                Search, pivot, and export security events with a responsive investigation workspace.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Button
                startIcon={<FilterAltIcon />}
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ severity: 'All', eventType: 'All', sourceIP: 'All' });
                  setIpFilter(null);
                }}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  bgcolor: 'transparent',
                  '&:hover': { bgcolor: 'var(--color-row-hover)', borderColor: 'var(--color-border)' },
                }}
              >
                Clear All
              </Button>
              <Button
                startIcon={<DownloadIcon />}
                variant="contained"
                onClick={handleExportCSV}
                disabled={filteredEvents.length === 0}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  bgcolor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                  '&:hover': { bgcolor: 'var(--color-primary-dark)' },
                }}
              >
                Export CSV
              </Button>
            </Box>
          </Box>
        </Paper>

        {error && (
          <Paper sx={{ ...surfaceSx, p: 2, bgcolor: 'var(--severity-critical-bg)', color: 'var(--severity-critical-fg)' }}>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700 }}>Error loading events</Typography>
            <Typography sx={{ fontSize: '0.875rem', mt: 0.5 }}>{error.message}</Typography>
          </Paper>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' },
            gap: 3,
          }}
        >
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Paper key={metric.title} sx={{ ...surfaceSx, p: 2.5, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{metric.title}</Typography>
                    <Typography sx={{ fontSize: metric.title === 'Top Event Type' ? '1.1rem' : '2rem', lineHeight: 1.1, fontWeight: 700, color: 'var(--color-text-primary)', mt: 0.75, overflowWrap: 'anywhere' }}>
                      {metric.value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 1 }}>
                      {metric.caption}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 40, height: 40, borderRadius: '9999px', display: 'grid', placeItems: 'center', bgcolor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                    <Icon sx={{ fontSize: 20 }} />
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>

        <Paper sx={{ ...surfaceSx, p: { xs: 2, sm: 2.5 }, position: 'sticky', top: 84, zIndex: 10 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.2fr) minmax(0, 1fr)' }, gap: 2, alignItems: 'start' }}>
            <Box sx={{ minWidth: 0 }}>
              <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search source IP, destination IP, event type, or message" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <FilterControls events={events} filters={filters} onFilterChange={handleFilterChange} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              Showing {filteredEvents.length} of {events.length} events
              {ipFilter ? ` • filtered by ${ipFilter}` : ''}
            </Typography>
            {ipFilter && (
              <Button color="inherit" size="small" onClick={() => setIpFilter(null)} sx={{ textTransform: 'none' }}>
                Clear IP filter
              </Button>
            )}
          </Box>
        </Paper>

        <Paper sx={{ ...surfaceSx, overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'grid', gap: 1 }}>
                {[...Array(10)].map((_, index) => (
                  <Box key={index} sx={{ height: 42, borderRadius: 1, bgcolor: 'var(--color-neutral-plate)', opacity: 0.7 }} />
                ))}
              </Box>
            </Box>
          ) : (
            <EventsTable events={filteredEvents} onIPClick={handleIPClick} />
          )}
        </Paper>
      </Box>
    </Box>
  );
}