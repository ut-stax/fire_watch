import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { useGlobalTimeRange } from '../contexts/TimeRangeContext';
import { ManualEntryForm } from '../components/ingestion/ManualEntryForm';
import { FileUpload } from '../components/ingestion/FileUpload';
import { FakeLogGenerator } from '../components/ingestion/FakeLogGenerator';
import { Box, Button, Paper, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { surfaceSx } from '../components/dashboard/dashboardStyles';

export function LogIngestion() {
  const timeRange = useGlobalTimeRange();
  const { events, loading, error } = useEvents(500, timeRange);

  const metrics = useMemo(() => {
    const uniqueIPs = new Set(events.map((event) => event.source_ip).filter(Boolean)).size;
    const latestEvent = events[0];

    return [
      {
        label: 'Events in Range',
        value: loading ? '—' : events.length,
        caption: 'Normalized and ready to explore',
        icon: StorageIcon,
      },
      {
        label: 'Unique Sources',
        value: loading ? '—' : uniqueIPs,
        caption: 'Distinct IPs observed',
        icon: SecurityIcon,
      },
      {
        label: 'Ingestion Methods',
        value: '3',
        caption: 'Manual, file, and generator',
        icon: UploadFileIcon,
      },
      {
        label: 'Latest Event Type',
        value: latestEvent?.event_type?.replace(/_/g, ' ') || 'None',
        caption: latestEvent?.message || 'No recent events in the selected range',
        icon: CheckCircleIcon,
      },
    ];
  }, [events, loading]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ display: 'grid', gap: 3, width: '100%', maxWidth: '1280px', minWidth: 0 }}>
        <Paper
          sx={{
            ...surfaceSx,
            p: { xs: 2.5, sm: 3 },
            position: 'sticky',
            top: 0,
            zIndex: 20,
            bgcolor: 'var(--color-header-blur-bg)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.15, color: 'var(--color-text-primary)' }}>
                Log Ingestion
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', mt: 0.75, maxWidth: 720 }}>
                Import security events through a polished workflow built for manual entry, bulk uploads, and realistic scenario generation.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Button
                component={Link}
                to="/app/logs"
                variant="outlined"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  '&:hover': { bgcolor: 'var(--color-row-hover)', borderColor: 'var(--color-border)' },
                }}
              >
                Open Explorer
              </Button>
              <Button
                component={Link}
                to="/app"
                variant="contained"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  bgcolor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                  '&:hover': { bgcolor: 'var(--color-primary-dark)' },
                }}
              >
                Back to Dashboard
              </Button>
            </Box>
          </Box>
        </Paper>

        {error && (
          <Paper sx={{ ...surfaceSx, p: 2, bgcolor: 'var(--severity-critical-bg)', color: 'var(--severity-critical-fg)' }}>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700 }}>Ingestion stream unavailable</Typography>
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
              <Paper key={metric.label} sx={{ ...surfaceSx, p: 2.5, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{metric.label}</Typography>
                    <Typography sx={{ fontSize: metric.label === 'Latest Event Type' ? '1.05rem' : '2rem', fontWeight: 700, lineHeight: 1.1, color: 'var(--color-text-primary)', mt: 0.75, overflowWrap: 'anywhere' }}>
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

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <ManualEntryForm />
          <FakeLogGenerator />
        </Box>

        <FileUpload />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: '1.15fr 0.85fr' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Paper sx={{ ...surfaceSx, p: 3, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Ingestion Workflow
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 0.5, mb: 2.5 }}>
              How events move from input to searchable security telemetry
            </Typography>

            <Box sx={{ display: 'grid', gap: 1.5 }}>
              {[
                ['1. Capture', 'Use manual entry for one-off incidents or generate realistic scenarios for testing.'],
                ['2. Validate', 'Events are normalized and rejected if required fields or severity values are invalid.'],
                ['3. Publish', 'Accepted events are written to Firestore and immediately available in Dashboard and Explorer.'],
              ].map(([step, description]) => (
                <Box key={step} sx={{ display: 'flex', gap: 1.5, p: 1.75, borderRadius: '12px', bgcolor: 'var(--color-row-hover)' }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: '9999px', display: 'grid', placeItems: 'center', bgcolor: 'var(--color-primary-soft)', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 700, flex: '0 0 auto' }}>
                    {step.split('.')[0]}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{step}</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 0.5 }}>{description}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ ...surfaceSx, p: 3, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Reference
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 0.5, mb: 2.5 }}>
              Canonical event and severity vocabulary used by the ingestion pipeline
            </Typography>

            <Box sx={{ display: 'grid', gap: 1.5 }}>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', mb: 1 }}>Event Types</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {[
                    ['failed_login', 'Login attempt denied'],
                    ['successful_login', 'User successfully authenticated'],
                    ['port_scan', 'Network scan detected'],
                    ['privilege_escalation', 'Unauthorized privilege attempt'],
                    ['info', 'Informational event'],
                  ].map(([type, description]) => (
                    <Box key={type} sx={{ p: 1.25, borderRadius: '12px', border: '1px solid var(--color-border)', bgcolor: 'var(--color-surface)', minWidth: 160, flex: '1 1 0' }}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{type}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', mt: 0.5 }}>{description}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', mb: 1 }}>Severity Levels</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {[
                    ['Critical', 'Immediate action required', '#dc2626'],
                    ['High', 'Urgent attention needed', '#ea580c'],
                    ['Medium', 'Needs investigation', '#b45309'],
                    ['Low', 'Monitor and track', '#15803d'],
                    ['Info', 'General information', '#0369a1'],
                  ].map(([label, description, color]) => (
                    <Box key={label} sx={{ p: 1.25, borderRadius: '12px', border: '1px solid var(--color-border)', bgcolor: 'var(--color-surface)', minWidth: 160, flex: '1 1 0' }}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color }}>{label}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', mt: 0.5 }}>{description}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}