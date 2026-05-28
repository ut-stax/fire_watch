import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { useAlerts } from '../hooks/useAlerts';
import { useGlobalTimeRange } from '../contexts/TimeRangeContext';
import { MetricCard } from '../components/dashboard/MetricCard';
import { EventFeedTable } from '../components/dashboard/EventFeedTable';
import { EventTimeline } from '../components/dashboard/EventTimeline';
import { SeverityPie } from '../components/dashboard/SeverityPie';
import { TopIPsChart } from '../components/dashboard/TopIPsChart';
import { TimeRangeSelector } from '../components/TimeRangeSelector';
import { Box, Button, Paper, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { surfaceSx } from '../components/dashboard/dashboardStyles';

function getEventTime(event) {
  return event.timestamp?.toDate?.() ? event.timestamp.toDate() : new Date(event.timestamp);
}

function getWindowBuckets(events, referenceTime, bucketCount = 12, windowHours = 24, filterFn = () => true, uniqueByIp = false) {
  const bucketMs = (windowHours * 60 * 60 * 1000) / bucketCount;
  const buckets = Array.from({ length: bucketCount }, () => ({ count: 0, ips: new Set() }));

  events.forEach((event) => {
    if (!filterFn(event)) return;
    const eventTime = getEventTime(event);
    const elapsed = referenceTime - eventTime.getTime();
    if (Number.isNaN(eventTime.getTime()) || elapsed < 0 || elapsed > windowHours * 60 * 60 * 1000) return;
    const index = Math.min(bucketCount - 1, Math.floor(elapsed / bucketMs));
    const bucket = buckets[bucketCount - 1 - index];
    if (uniqueByIp) bucket.ips.add(event.source_ip || 'unknown');
    else bucket.count += 1;
  });

  return buckets.map((bucket) => (uniqueByIp ? bucket.ips.size : bucket.count));
}

function getTrend(series) {
  if (!series.length) return { label: '0% vs last window', tone: 'neutral' };
  const half = Math.max(1, Math.floor(series.length / 2));
  const current = series.slice(half).reduce((sum, value) => sum + value, 0);
  const previous = series.slice(0, half).reduce((sum, value) => sum + value, 0);
  if (previous === 0) {
    return { label: current > 0 ? '+100% vs last window' : '0% vs last window', tone: current > 0 ? 'positive' : 'neutral' };
  }
  const percentage = Math.round(((current - previous) / previous) * 100);
  return {
    label: `${percentage > 0 ? '+' : ''}${percentage}% vs last window`,
    tone: percentage < 0 ? 'negative' : 'positive',
  };
}

export default function Dashboard() {
  const timeRange = useGlobalTimeRange();
  const { events, loading: eventsLoading, error: eventsError } = useEvents(500, timeRange);
  const { alerts, loading: alertsLoading, error: alertsError } = useAlerts();
  const referenceTime = useMemo(() => {
    const latestEventTime = events.reduce((latest, event) => {
      const eventTime = getEventTime(event).getTime();
      return Number.isNaN(eventTime) ? latest : Math.max(latest, eventTime);
    }, 0);

    return latestEventTime;
  }, [events]);

  const analytics = useMemo(() => {
    const totalEvents = events.length;
    const criticalAlerts = alerts.filter((alert) => alert.severity?.toLowerCase() === 'critical' && !alert.acknowledged).length;
    const uniqueIPs = new Set(events.map((event) => event.source_ip)).size;

    const oneHourAgo = referenceTime - 60 * 60 * 1000;
    const eventsPerHour = events.filter((event) => {
      const eventTime = getEventTime(event).getTime();
      return eventTime >= oneHourAgo && eventTime <= referenceTime;
    }).length;

    const totalSeries = getWindowBuckets(events, referenceTime, 12, 24, () => true, false);
    const criticalSeries = getWindowBuckets(events, referenceTime, 12, 24, (event) => event.severity?.toLowerCase() === 'critical', false);
    const uniqueSeries = getWindowBuckets(events, referenceTime, 12, 24, () => true, true);
    const hourlySeries = getWindowBuckets(events, referenceTime, 12, 24, () => true, false);

    return {
      metrics: [
        {
          title: 'Total Events',
          value: totalEvents,
          tone: 'events',
          icon: SecurityIcon,
          series: totalSeries,
          badge: getTrend(totalSeries).label,
          trend: getTrend(totalSeries).tone,
        },
        {
          title: 'Critical Alerts',
          value: criticalAlerts,
          tone: 'critical',
          icon: WarningIcon,
          series: criticalSeries,
          badge: getTrend(criticalSeries).label,
          trend: getTrend(criticalSeries).tone,
        },
        {
          title: 'Unique IPs',
          value: uniqueIPs,
          tone: 'threats',
          icon: NetworkCheckIcon,
          series: uniqueSeries,
          badge: getTrend(uniqueSeries).label,
          trend: getTrend(uniqueSeries).tone,
        },
        {
          title: 'Events / Hour',
          value: eventsPerHour,
          tone: 'uptime',
          icon: TrendingUpIcon,
          series: hourlySeries,
          badge: getTrend(hourlySeries).label,
          trend: getTrend(hourlySeries).tone,
        },
      ],
    };
  }, [events, alerts, referenceTime]);

  const isLoading = eventsLoading || alertsLoading;
  const error = eventsError || alertsError;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ display: 'grid', gap: 3, width: '100%', maxWidth: '1120px', minWidth: 0 }}>
        <Paper
          sx={{
            ...surfaceSx,
            position: 'sticky',
            top: 0,
            zIndex: 50,
            px: 3,
            py: 2.25,
            bgcolor: 'var(--color-header-blur-bg)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.15, color: 'var(--color-text-primary)' }}>
                Dashboard
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', mt: 0.5 }}>
                Real-time security event monitoring and analysis
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Button
                component={Link}
                to="/app/ingest"
                startIcon={<UploadFileIcon />}
                variant="contained"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: 40,
                  bgcolor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                  '&:hover': { bgcolor: 'var(--color-primary-dark)' },
                }}
              >
                Ingest Logs
              </Button>
              <Button
                component={Link}
                to="/app/logs"
                startIcon={<SearchIcon />}
                variant="outlined"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: 40,
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  bgcolor: 'transparent',
                  '&:hover': { bgcolor: 'var(--color-row-hover)', borderColor: 'var(--color-border)' },
                }}
              >
                Explore Logs
              </Button>
              <TimeRangeSelector timeRange={timeRange} onTimeRangeChange={timeRange} />
            </Box>
          </Box>
        </Paper>

        {error && (
          <Paper
            sx={{
              ...surfaceSx,
              p: 2,
              bgcolor: 'var(--severity-critical-bg)',
              color: 'var(--severity-critical-fg)',
            }}
          >
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700 }}>Error loading data</Typography>
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
          {analytics.metrics.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              tone={metric.tone}
              series={metric.series}
              badge={metric.badge}
              trend={metric.trend}
            />
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.75fr) minmax(0, 1fr)' },
            gap: 3,
          }}
        >
          <EventTimeline events={events} loading={isLoading} />
          <SeverityPie events={events} loading={isLoading} />
        </Box>

        <EventFeedTable events={events} loading={isLoading} />

        <TopIPsChart events={events} loading={isLoading} />

        {!isLoading && events.length === 0 && (
          <Paper sx={{ ...surfaceSx, p: 4, textAlign: 'center' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '9999px', mx: 'auto', mb: 2, bgcolor: 'var(--color-border)', display: 'grid', placeItems: 'center', color: 'var(--color-text-muted)' }}>
              <SecurityIcon sx={{ fontSize: 28 }} />
            </Box>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              No data yet
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', mt: 1, mb: 2 }}>
              Generate events from Log Ingestion to see the dashboard populate in real time.
            </Typography>
            <Button
              component={Link}
              to="/app/ingest"
              variant="contained"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                bgcolor: 'var(--color-primary)',
                '&:hover': { bgcolor: 'var(--color-primary-dark)' },
              }}
            >
              Go to Log Ingestion
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
