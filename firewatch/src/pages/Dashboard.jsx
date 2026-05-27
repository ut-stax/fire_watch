/**
 * Dashboard Page
 * Main dashboard displaying live KPI metrics, event feed, and visualization charts
 * Uses useEvents and useAlerts hooks to stream real-time data from Firestore
 */

import { useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import { useAlerts } from '../hooks/useAlerts';
import { useGlobalTimeRange } from '../contexts/TimeRangeContext';
import { MetricCard } from '../components/dashboard/MetricCard';
import { EventFeedTable } from '../components/dashboard/EventFeedTable';
import { EventTimeline } from '../components/dashboard/EventTimeline';
import { SeverityPie } from '../components/dashboard/SeverityPie';
import { TopIPsChart } from '../components/dashboard/TopIPsChart';
import { TrendIndicator } from '../components/dashboard/TrendIndicator';
import { Box, Typography, Paper, Button } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const timeRange = useGlobalTimeRange();
  const { events, loading: eventsLoading, error: eventsError } = useEvents(500, timeRange);
  const { alerts, loading: alertsLoading, error: alertsError } = useAlerts();

  const metrics = useMemo(() => {
    if (!events.length) {
      return {
        totalEvents: 0,
        criticalAlerts: 0,
        uniqueIPs: 0,
        eventsPerHour: 0,
      };
    }

    const totalEvents = events.length;
    const criticalAlerts = alerts.filter(
      (a) => a.severity?.toLowerCase() === 'critical' && !a.acknowledged
    ).length;
    const uniqueIPs = new Set(events.map((e) => e.source_ip)).size;

    const now = new Date();
    const oneHourAgo = new Date(now - 60 * 60 * 1000);
    const eventsLastHour = events.filter((e) => {
      const eventTime = e.timestamp?.toDate?.()
        ? e.timestamp.toDate()
        : new Date(e.timestamp);
      return eventTime >= oneHourAgo;
    }).length;

    return {
      totalEvents,
      criticalAlerts,
      uniqueIPs,
      eventsPerHour: eventsLastHour,
    };
  }, [events, alerts]);

  const isLoading = eventsLoading || alertsLoading;
  const error = eventsError || alertsError;

  return (
    <Box>
      <Paper sx={{ p: 4, mb: 3, borderRadius: 3, bgcolor: 'primary.soft', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, position: 'relative', overflow: 'visible' }}>
        <Box sx={{ position: 'absolute', left: -40, top: 12, display: { xs: 'none', md: 'block' } }}>
          <img src="/assets/chevron-left.svg" alt="" style={{ height: 140, opacity: 0.95 }} />
        </Box>
        <Box sx={{ position: 'absolute', right: -40, bottom: 12, display: { xs: 'none', md: 'block' } }}>
          <img src="/assets/chevron-right.svg" alt="" style={{ height: 140, opacity: 0.95 }} />
        </Box>
        <Box>
          <Typography variant="h3" gutterBottom fontWeight={700} color="text.primary">
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time security event monitoring and analysis
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} to="/app/ingest" variant="contained" size="large">
            Ingest logs
          </Button>
          <Button component={Link} to="/app/logs" variant="outlined" size="large">
            Explore logs
          </Button>
        </Box>
      </Paper>

      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.dark', color: 'error.contrastText' }}>
          <Typography variant="h6">Error loading data</Typography>
          <Typography variant="body2">{error.message}</Typography>
        </Paper>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 3,
        }}
      >
        <MetricCard
          title="Total Events"
          value={metrics.totalEvents}
          icon={SecurityIcon}
          color="primary"
        />
        <MetricCard
          title="Critical Alerts"
          value={metrics.criticalAlerts}
          icon={WarningIcon}
          color="error"
        />
        <MetricCard
          title="Unique IPs"
          value={metrics.uniqueIPs}
          icon={NetworkCheckIcon}
          color="secondary"
        />
        <MetricCard
          title="Events/Hour"
          value={metrics.eventsPerHour}
          icon={TrendingUpIcon}
          color="success"
        />
      </Box>

      <TrendIndicator events={events} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 3,
        }}
      >
        <EventTimeline events={events} loading={isLoading} />
        <SeverityPie events={events} loading={isLoading} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <EventFeedTable events={events} loading={isLoading} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <TopIPsChart events={events} loading={isLoading} />
      </Box>

      {!isLoading && events.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ fontSize: 64, mb: 2 }}>📊</Box>
          <Typography variant="h5" gutterBottom>
            No data yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Generate some events using the Log Ingestion page to see real-time dashboards
            and metrics appear here.
          </Typography>
          <Button
            component={Link}
            to="/app/ingest"
            variant="contained"
            size="large"
          >
            Go to Log Ingestion
          </Button>
        </Paper>
      )}
    </Box>
  );
}