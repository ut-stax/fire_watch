import { AlertCard } from './AlertCard';
import { getSeverityOrder } from '../../utils/severityColors';
import { Paper, Typography, Box, Skeleton } from '@mui/material';
import { surfaceSx } from '../dashboard/dashboardStyles';

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
      <Paper sx={{ ...surfaceSx, p: 3 }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          Active Alerts
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 0.5, mb: 2 }}>
          Unacknowledged incidents sorted by severity and recency
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} variant="rounded" height={92} sx={{ borderRadius: '12px' }} />
          ))}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ ...surfaceSx, p: 3, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Box>
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Active Alerts {alerts.length > 0 && `(${alerts.length})`}
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 0.5 }}>
            Unacknowledged incidents sorted by severity and recency
          </Typography>
        </Box>
        <Box sx={{ px: 1.25, py: 0.5, borderRadius: '9999px', bgcolor: 'var(--color-neutral-plate)', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
          {alerts.length} open
        </Box>
      </Box>

      {alerts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5, px: 2, border: '1px dashed var(--color-border)', borderRadius: '12px', bgcolor: 'var(--color-row-hover)' }}>
          <Typography sx={{ fontSize: '2rem', mb: 1 }}>
            ✓
          </Typography>
          <Typography sx={{ color: 'var(--color-text-muted)' }}>
            No active alerts — environment is clear.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: { xs: 560, xl: 760 }, overflowY: 'auto', pr: 0.5 }}>
          {sortedAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              isSelected={selectedAlert?.id === alert.id}
              onSelect={onSelectAlert}
              onAcknowledge={onAcknowledgeAlert}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
}