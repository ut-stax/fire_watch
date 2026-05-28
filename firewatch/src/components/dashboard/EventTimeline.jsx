import { useMemo } from 'react';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import './chartjsSetup';
import { resolveCssColor, surfaceSx } from './dashboardStyles';

export function EventTimeline({ events = [], loading = false }) {
  const data = useMemo(() => {
    const now = new Date();
    const buckets = Array.from({ length: 24 }, () => 0);

    events.forEach((event) => {
      const eventTime = event.timestamp?.toDate?.() ? event.timestamp.toDate() : new Date(event.timestamp);
      if (Number.isNaN(eventTime.getTime())) return;
      const ageMs = now.getTime() - eventTime.getTime();
      if (ageMs <= 24 * 60 * 60 * 1000) {
        const hourIndex = eventTime.getHours();
        buckets[hourIndex] += 1;
      }
    });

    return buckets;
  }, [events]);

  const chartData = useMemo(
    () => ({
      labels: data.map((_, index) => `${String(index).padStart(2, '0')}:00`),
      datasets: [
        {
          data,
          borderColor: resolveCssColor('var(--color-primary)'),
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0.42,
          fill: true,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(37, 99, 235, 0.2)';
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(37, 99, 235, 0.18)');
            gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
            return gradient;
          },
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
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'var(--color-surface)',
          titleColor: 'var(--color-text-primary)',
          bodyColor: 'var(--color-text-primary)',
          borderColor: 'var(--color-border)',
          borderWidth: 1,
          displayColors: false,
        },
      },
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          ticks: {
            color: 'var(--color-text-muted)',
            font: { size: 11, family: 'Inter' },
            maxTicksLimit: 6,
            autoSkip: true,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(244, 244, 245, 0.5)',
            drawBorder: false,
            lineWidth: 1,
          },
          ticks: {
            color: 'var(--color-text-muted)',
            font: { size: 11, family: 'Inter' },
            maxTicksLimit: 4,
            precision: 0,
          },
        },
      },
    }),
    []
  );

  if (loading) {
    return (
      <Paper sx={{ ...surfaceSx, p: 3 }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
          Event Timeline
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mb: 2 }}>
          24-hour distribution of live event volume
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
        Event Timeline
      </Typography>
      <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mb: 2 }}>
        24-hour distribution of live event volume
      </Typography>
      <Box sx={{ height: 280 }}>
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
}