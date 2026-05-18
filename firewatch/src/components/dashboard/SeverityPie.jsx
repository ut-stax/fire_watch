/**
 * Severity Pie Chart Component
 * Displays distribution of events by severity level using Recharts PieChart
 */

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

const severityColors = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#06b6d4',
  low: '#3b82f6',
  info: '#6b7280',
};

const severityLabels = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  info: 'Info',
};

export function SeverityPie({ events = [], loading = false }) {
  const data = useMemo(() => {
    const severityCount = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };

    events.forEach((event) => {
      const sev = event.severity?.toLowerCase() || 'info';
      if (Object.prototype.hasOwnProperty.call(severityCount, sev)) {
        severityCount[sev]++;
      }
    });

    return Object.entries(severityCount)
      .filter((entry) => entry[1] > 0)
      .map(([severity, count]) => ({
        name: severityLabels[severity],
        value: count,
        severity,
      }));
  }, [events]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Severity Distribution
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Severity Distribution
      </Typography>
      {data.length > 0 ? (
        <Box>
          <Box sx={{ height: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={severityColors[entry.severity]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#e5e7eb' }}
                  formatter={(value) => [value, `${((value / total) * 100).toFixed(1)}%`]}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2,
              mt: 3,
            }}
          >
            {data.map((item) => (
              <Box key={item.severity} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    mr: 1,
                    bgcolor: severityColors[item.severity],
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {item.name}: {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box sx={{ height: 256, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">No events to display</Typography>
        </Box>
      )}
    </Paper>
  );
}