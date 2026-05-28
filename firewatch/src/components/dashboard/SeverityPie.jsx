import { useMemo } from 'react';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import './chartjsSetup';
import { resolveCssColor, surfaceSx } from './dashboardStyles';

const severityColors = {
  critical: resolveCssColor('var(--severity-critical-chart)'),
  high: resolveCssColor('var(--severity-high-chart)'),
  medium: resolveCssColor('var(--severity-medium-chart)'),
  low: resolveCssColor('var(--severity-low-chart)'),
  info: resolveCssColor('var(--severity-info-chart)'),
};

const severityLabels = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  info: 'Info',
};

export function SeverityPie({ events = [], loading = false }) {
  const tooltipColors = useMemo(
    () => ({
      background: resolveCssColor('var(--color-surface)'),
      title: resolveCssColor('var(--color-text-primary)'),
      body: resolveCssColor('var(--color-text-primary)'),
      border: resolveCssColor('var(--color-border)'),
    }),
    []
  );

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

  const chartData = useMemo(
    () => ({
      labels: data.map((entry) => entry.name),
      datasets: [
        {
          data: data.map((entry) => entry.value),
          backgroundColor: data.map((entry) => severityColors[entry.severity]),
          borderWidth: 0,
          hoverOffset: 2,
        },
      ],
    }),
    [data]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: tooltipColors.background,
          titleColor: tooltipColors.title,
          bodyColor: tooltipColors.body,
          borderColor: tooltipColors.border,
          borderWidth: 1,
          cornerRadius: 10,
          titleFont: { family: 'Inter', weight: '700' },
          bodyFont: { family: 'Inter', weight: '500' },
          callbacks: {
            label: (context) => `${context.label}: ${context.parsed}`,
          },
          displayColors: false,
        },
      },
    }),
    [tooltipColors]
  );

  if (loading) {
    return (
      <Paper sx={{ ...surfaceSx, p: 3 }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
          Status Breakdown
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mb: 2 }}>
          Severity mix across live events
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ ...surfaceSx, p: 3 }}>
      <Typography sx={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
        Status Breakdown
      </Typography>
      <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mb: 2 }}>
        Severity mix across live events
      </Typography>
      {data.length > 0 ? (
        <Box>
          <Box sx={{ position: 'relative', height: 260 }}>
            <Doughnut data={chartData} options={options} />
            <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', letterSpacing: '0.04em' }}>
                  Total Events
                </Typography>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.1 }}>
                  {total}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', mt: 1 }}>
            {data.map((item) => (
              <Box key={item.severity} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '9999px', bgcolor: severityColors[item.severity] }} />
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {item.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box sx={{ height: 256, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: 'var(--color-text-muted)' }}>No events to display</Typography>
        </Box>
      )}
    </Paper>
  );
}