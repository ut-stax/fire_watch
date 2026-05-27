/**
 * Active Alerts List Component
 * Displays unacknowledged alerts sorted by severity and time
 */

import { AlertCard } from './AlertCard';
import { getSeverityOrder } from '../../utils/severityColors';
import { Paper, Typography, Box, Skeleton } from '@mui/material';

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
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(26,26,26,0.06)' }}>
        <Typography variant="h6" gutterBottom>
          Active Alerts
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={80} />
          ))}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(26,26,26,0.06)' }}>
      <Typography variant="h6" gutterBottom>
        Active Alerts {alerts.length > 0 && `(${alerts.length})`}
      </Typography>

      {alerts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            ✓
          </Typography>
          <Typography color="text.secondary">
            No active alerts — environment is clear.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 384, overflowY: 'auto' }}>
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