import { useMemo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import './chartjsSetup';
import { resolveCssColor, surfaceSx } from './dashboardStyles';

const toneMap = {
  critical: {
    iconBg: 'var(--severity-critical-bg)',
    iconFg: 'var(--severity-critical-fg)',
    line: 'var(--severity-critical-chart)',
    badgeFg: 'var(--severity-critical-fg)',
    badgeBg: 'var(--severity-critical-bg)',
  },
  events: {
    iconBg: 'var(--severity-info-bg)',
    iconFg: 'var(--severity-info-fg)',
    line: 'var(--severity-info-chart)',
    badgeFg: 'var(--severity-info-fg)',
    badgeBg: 'var(--severity-info-bg)',
  },
  threats: {
    iconBg: 'var(--severity-high-bg)',
    iconFg: 'var(--severity-high-fg)',
    line: 'var(--severity-high-chart)',
    badgeFg: 'var(--severity-high-fg)',
    badgeBg: 'var(--severity-high-bg)',
  },
  uptime: {
    iconBg: 'var(--severity-low-bg)',
    iconFg: 'var(--severity-low-fg)',
    line: 'var(--severity-low-chart)',
    badgeFg: 'var(--severity-low-fg)',
    badgeBg: 'var(--severity-low-bg)',
  },
};

const trendToneMap = {
  positive: {
    bg: 'var(--severity-low-bg)',
    fg: 'var(--severity-low-fg)',
  },
  negative: {
    bg: 'var(--severity-critical-bg)',
    fg: 'var(--severity-critical-fg)',
  },
  neutral: {
    bg: 'var(--color-border)',
    fg: 'var(--color-text-muted)',
  },
};

function MiniSparkline({ values, stroke }) {
  const data = useMemo(
    () => ({
      labels: values.map((_, index) => index),
      datasets: [
        {
          data: values,
          borderColor: stroke,
          borderWidth: 1.8,
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0.45,
          fill: false,
        },
      ],
    }),
    [values, stroke]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      elements: { line: { capBezierPoints: true } },
    }),
    []
  );

  return (
      <Box sx={{ width: 56, height: 24 }}>
      <Line data={data} options={options} />
    </Box>
  );
}

export function MetricCard({ title, value, icon: Icon, tone = 'events', series = [], badge = '', trend = 'neutral' }) {
  const palette = toneMap[tone] || toneMap.events;
  const trendPalette = trendToneMap[trend] || trendToneMap.neutral;
  const sparklineStroke = resolveCssColor(palette.line);

  return (
    <Paper sx={{ ...surfaceSx, p: 2.25, minHeight: 144, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.2 }}>
            {title}
          </Typography>
        </Box>
        {Icon ? (
          <Box sx={{ width: 24, height: 24, borderRadius: '9999px', bgcolor: palette.iconBg, color: palette.iconFg, display: 'grid', placeItems: 'center' }}>
            <Icon sx={{ fontSize: 14 }} />
          </Box>
        ) : null}
      </Box>

      <Typography sx={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, color: 'var(--color-text-primary)', mt: 1 }}>
        {value}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mt: 1.25 }}>
        <MiniSparkline values={series.length ? series : [1, 2, 1, 3, 2, 4, 3]} stroke={sparklineStroke} />
        {badge ? (
          <Box
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: '9999px',
              bgcolor: trendPalette.bg,
              color: trendPalette.fg,
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            {badge}
          </Box>
        ) : null}
      </Box>
    </Paper>
  );
}