import { format } from 'date-fns';
import { getSeverityChartColor, getSeverityLabel } from '../../utils/severityColors';
import { Paper, Typography, Box, Button } from '@mui/material';
import { surfaceSx } from '../dashboard/dashboardStyles';

const severityBadgeStyles = {
  critical: { bg: '#dc2626', fg: '#ffffff' },
  high: { bg: '#ea580c', fg: '#ffffff' },
  medium: { bg: '#b45309', fg: '#ffffff' },
  low: { bg: '#15803d', fg: '#ffffff' },
  info: { bg: '#0369a1', fg: '#ffffff' },
};

export function AlertCard({ alert, onSelect, onAcknowledge, isSelected = false }) {
  const handleAcknowledge = (e) => {
    e.stopPropagation();
    onAcknowledge(alert.id);
  };

  const severityColor = getSeverityChartColor(alert.severity);
  const alertTime = alert.triggered_at?.toDate?.()
    ? alert.triggered_at.toDate()
    : new Date(alert.triggered_at);

  return (
    <Paper
      onClick={() => onSelect(alert)}
      sx={{
        ...surfaceSx,
        p: 2,
        cursor: 'pointer',
        bgcolor: isSelected ? 'var(--color-neutral-plate)' : 'var(--color-surface)',
        borderLeft: `4px solid ${severityColor}`,
        transition: 'transform 160ms ease, background-color 160ms ease, border-color 160ms ease',
        '&:hover': {
          bgcolor: 'var(--color-row-hover)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5, flexWrap: 'wrap' }}>
            <Box
              sx={{
                bgcolor: severityBadgeStyles[alert.severity?.toLowerCase()]?.bg || severityColor,
                color: severityBadgeStyles[alert.severity?.toLowerCase()]?.fg || 'common.white',
                px: 1,
                py: 0.5,
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
              }}
            >
              {getSeverityLabel(alert.severity)}
            </Box>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)' }} noWrap>
              {alert.rule_name}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mb: 0.75 }}>
            Source IP: <Box component="span" sx={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--color-text-primary)' }}>{alert.source_ip}</Box>
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {format(alertTime, 'MMM dd, HH:mm:ss')}
          </Typography>
        </Box>
        <Button
          onClick={handleAcknowledge}
          variant="contained"
          size="small"
          sx={{
            whiteSpace: 'nowrap',
            minWidth: 0,
            textTransform: 'none',
            borderRadius: '8px',
            bgcolor: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            boxShadow: 'none',
            '&:hover': { bgcolor: 'var(--color-primary-dark)', boxShadow: 'none' },
          }}
        >
          Acknowledge
        </Button>
      </Box>
    </Paper>
  );
}
