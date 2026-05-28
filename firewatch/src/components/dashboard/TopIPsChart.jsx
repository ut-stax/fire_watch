import { useMemo } from 'react';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import './chartjsSetup';
import { resolveCssColor, surfaceSx } from './dashboardStyles';

export function TopIPsChart({ events = [], loading = false }) {
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
    const ipCount = {};

    events.forEach((event) => {
      const ip = event.source_ip || 'Unknown';
      ipCount[ip] = (ipCount[ip] || 0) + 1;
    });

    return Object.entries(ipCount)
      .map(([ip, count]) => ({
        ip: ip.length > 15 ? ip.substring(0, 12) + '...' : ip,
        fullIp: ip,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [events]);

  const chartData = useMemo(
    () => ({
      labels: data.map((item) => item.ip),
      datasets: [
        {
          data: data.map((item) => item.count),
          backgroundColor: resolveCssColor('var(--color-primary)'),
          borderRadius: 8,
          barThickness: 10,
        },
      ],
    }),
    [data]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      animation: false,
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
            label: (context) => `Events: ${context.parsed.x ?? context.parsed.y ?? context.parsed}`,
            title: (items) => items[0]?.label || 'Top IP',
          },
          displayColors: false,
        },
      },
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          ticks: {
            color: 'var(--color-text-muted)',
            font: { size: 11, family: 'Inter' },
          },
        },
        y: {
          grid: { display: false, drawBorder: false },
          ticks: {
            color: 'var(--color-text-muted)',
            font: { size: 11, family: 'JetBrains Mono' },
          },
        },
      },
    }),
    [tooltipColors]
  );

  if (loading) {
    return (
      <Paper sx={{ ...surfaceSx, p: 3 }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
          Top Source IPs
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mb: 2 }}>
          Highest-volume source addresses
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
        Top Source IPs
      </Typography>
      <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mb: 2 }}>
        Highest-volume source addresses
      </Typography>
      {data.length > 0 ? (
        <Box sx={{ height: 280 }}>
          <Bar data={chartData} options={options} />
        </Box>
      ) : (
        <Box sx={{ height: 256, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: 'var(--color-text-muted)' }}>No events to display</Typography>
        </Box>
      )}
    </Paper>
  );
}