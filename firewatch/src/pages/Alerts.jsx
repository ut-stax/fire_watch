import { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import { acknowledgeAlert } from '../firebase/alerts';
import { useGlobalTimeRange } from '../contexts/TimeRangeContext';
import { ActiveAlertsList } from '../components/alerts/ActiveAlertsList';
import { AlertDetail } from '../components/alerts/AlertDetail';
import { AlertHistory } from '../components/alerts/AlertHistory';
import { Box, Button, Paper, Typography } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { surfaceSx } from '../components/dashboard/dashboardStyles';

function getAlertTime(alert) {
  return alert?.triggered_at?.toDate?.() ? alert.triggered_at.toDate() : new Date(alert?.triggered_at);
}

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

  const activeAlerts = alerts.filter((alert) => !alert.acknowledged);
  const criticalAlerts = activeAlerts.filter((alert) => alert.severity?.toLowerCase() === 'critical');
  const highAlerts = activeAlerts.filter((alert) => alert.severity?.toLowerCase() === 'high');
  const latestAlert = activeAlerts.reduce((latest, alert) => {
    const alertTime = getAlertTime(alert).getTime();
    if (Number.isNaN(alertTime)) return latest;
    return alertTime > latest.time ? { time: alertTime, alert } : latest;
  }, { time: 0, alert: null }).alert;

  const summaryCards = [
    {
      label: 'Active Alerts',
      value: activeAlerts.length,
      caption: 'Unacknowledged incidents',
      icon: SecurityIcon,
    },
    {
      label: 'Critical Queue',
      value: criticalAlerts.length,
      caption: 'Immediate response required',
      icon: WarningIcon,
    },
    {
      label: 'High Priority',
      value: highAlerts.length,
      caption: 'Needs near-term triage',
      icon: CheckCircleIcon,
    },
    {
      label: 'Latest Alert',
      value: latestAlert ? latestAlert.rule_name.replace(/_/g, ' ') : 'None',
      caption: latestAlert ? latestAlert.source_ip : 'No recent alerts',
      icon: AccessTimeIcon,
    },
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ display: 'grid', gap: 3, width: '100%', maxWidth: '1280px', minWidth: 0 }}>
        <Paper
          sx={{
            ...surfaceSx,
            position: 'sticky',
            top: 0,
            zIndex: 20,
            px: { xs: 2.5, sm: 3 },
            py: 2.5,
            bgcolor: 'var(--color-header-blur-bg)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.15, color: 'var(--color-text-primary)' }}>
                Alerts
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', mt: 0.75, maxWidth: 640 }}>
                Triage live security alerts with a focused workspace for selection, acknowledgement, and investigation.
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={() => setSelectedAlert(activeAlerts[0] || null)}
              disabled={activeAlerts.length === 0}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                bgcolor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                '&:hover': { bgcolor: 'var(--color-primary-dark)' },
              }}
            >
              Focus Latest Alert
            </Button>
          </Box>
        </Paper>

        {error && (
          <Paper sx={{ ...surfaceSx, p: 2, bgcolor: 'var(--severity-critical-bg)', color: 'var(--severity-critical-fg)' }}>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700 }}>Error loading alerts</Typography>
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
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <Paper key={card.label} sx={{ ...surfaceSx, p: 2.5, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{card.label}</Typography>
                    <Typography sx={{ fontSize: card.label === 'Latest Alert' ? '1.05rem' : '2rem', lineHeight: 1.1, fontWeight: 700, color: 'var(--color-text-primary)', mt: 0.75, overflowWrap: 'anywhere' }}>
                      {card.value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 1 }}>
                      {card.caption}
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
            gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 0.95fr) minmax(0, 1.05fr)' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <ActiveAlertsList
            alerts={alerts}
            loading={loading}
            selectedAlert={selectedAlert}
            onSelectAlert={handleSelectAlert}
            onAcknowledgeAlert={handleAcknowledgeAlert}
          />

          <AlertDetail alert={selectedAlert} loading={acknowledging} />
        </Box>

        <AlertHistory timeRange={timeRange} />
      </Box>
    </Box>
  );
}