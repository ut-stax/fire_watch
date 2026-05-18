/**
 * Alert Card Component
 * Displays a single alert with severity badge, rule name, source IP, and acknowledge button
 */

import { format } from 'date-fns';
import { getSeverityChartColor, getSeverityLabel } from '../../utils/severityColors';
import { Paper, Typography, Box, Button } from '@mui/material';

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
        p: 2,
        borderLeft: 4,
        borderColor: severityColor,
        cursor: 'pointer',
        bgcolor: isSelected ? 'grey.800' : 'background.paper',
        '&:hover': {
          bgcolor: 'grey.800',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box
              sx={{
                bgcolor: severityColor,
                color: 'common.white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {getSeverityLabel(alert.severity)}
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
              {alert.rule_name}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Source IP: <Box component="span" sx={{ fontFamily: 'monospace', color: 'text.primary' }}>{alert.source_ip}</Box>
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {format(alertTime, 'MMM dd, HH:mm:ss')}
          </Typography>
        </Box>
        <Button
          onClick={handleAcknowledge}
          variant="outlined"
          size="small"
          sx={{ whiteSpace: 'nowrap' }}
        >
          Acknowledge
        </Button>
      </Box>
    </Paper>
  );
}
