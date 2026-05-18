/**
 * Metric Card Component
 * Displays a single KPI metric with title, value, icon, and color styling
 */

import { Paper, Typography, Box } from '@mui/material';

const colorMap = {
  primary: { bg: 'primary.main', text: 'primary.contrastText' },
  secondary: { bg: 'secondary.main', text: 'secondary.contrastText' },
  success: { bg: 'success.main', text: 'success.contrastText' },
  error: { bg: 'error.main', text: 'error.contrastText' },
  info: { bg: 'info.main', text: 'info.contrastText' },
  warning: { bg: 'warning.main', text: 'warning.contrastText' },
};

export function MetricCard({ title, value, icon: Icon, color = 'primary' }) {
  const colors = colorMap[color] || colorMap.primary;

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: colors.bg,
        color: colors.text,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h3" fontWeight={700}>
            {value}
          </Typography>
        </Box>
        {Icon && (
          <Box sx={{ opacity: 0.2, fontSize: 48 }}>
            <Icon />
          </Box>
        )}
      </Box>
    </Paper>
  );
}