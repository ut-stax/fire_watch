/**
 * Alerts Page
 * Main alerts management page for triaging security alerts
 */

import { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import { acknowledgeAlert } from '../firebase/alerts';
import { useGlobalTimeRange } from '../contexts/TimeRangeContext';
import { ActiveAlertsList } from '../components/alerts/ActiveAlertsList';
import { AlertDetail } from '../components/alerts/AlertDetail';
import { AlertHistory } from '../components/alerts/AlertHistory';
import { Paper, Typography, Box, Alert } from '@mui/material';

export default function Alerts() {
  const { alerts, loading, error } = useAlerts();
  const timeRange = useGlobalTimeRange();
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [acknowledging, setAcknowledging] = useState(false);

  const handleSelectAlert = (alert) => {
    setSelectedAlert(alert);
  };

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      setAcknowledging(true);
      await acknowledgeAlert(alertId);
      if (selectedAlert?.id === alertId) {
        setSelectedAlert(null);
      }
    } catch (err) {
      console.error('Error acknowledging alert:', err);
    } finally {
      setAcknowledging(false);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 4, mb: 3, borderRadius: 3, bgcolor: 'primary.soft', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h3" gutterBottom fontWeight={700} color="text.primary">
            Alerts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and triage security alerts in real time
          </Typography>
        </Box>
        <Box />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">Error loading alerts</Typography>
          <Typography variant="body2">{error.message}</Typography>
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 3,
        }}
      >
        <Box>
          <ActiveAlertsList
            alerts={alerts}
            loading={loading}
            selectedAlert={selectedAlert}
            onSelectAlert={handleSelectAlert}
            onAcknowledgeAlert={handleAcknowledgeAlert}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: '1', lg: 'span 2' } }}>
          <AlertDetail alert={selectedAlert} loading={acknowledging} />
        </Box>
      </Box>

      <AlertHistory timeRange={timeRange} />
    </Box>
  );
}