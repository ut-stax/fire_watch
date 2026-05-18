/**
 * Trend Indicator Component
 * Shows event rate trend comparison between current and previous time window
 */

import { useMemo } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

export function TrendIndicator({ events }) {
  const trend = useMemo(() => {
    if (!events || events.length === 0) {
      return { percentage: 0, direction: 'stable', label: 'No data' };
    }

    const sortedEvents = [...events].sort((a, b) => {
      const timeA = a.timestamp?.toDate?.() ? a.timestamp.toDate().getTime() : new Date(a.timestamp).getTime();
      const timeB = b.timestamp?.toDate?.() ? b.timestamp.toDate().getTime() : new Date(b.timestamp).getTime();
      return timeA - timeB;
    });

    if (sortedEvents.length === 0) {
      return { percentage: 0, direction: 'stable', label: 'No data' };
    }

    const firstTime = sortedEvents[0].timestamp?.toDate?.()
      ? sortedEvents[0].timestamp.toDate().getTime()
      : new Date(sortedEvents[0].timestamp).getTime();
    const lastTime = sortedEvents[sortedEvents.length - 1].timestamp?.toDate?.()
      ? sortedEvents[sortedEvents.length - 1].timestamp.toDate().getTime()
      : new Date(sortedEvents[sortedEvents.length - 1].timestamp).getTime();

    const totalWindow = lastTime - firstTime;
    const midPoint = firstTime + totalWindow / 2;

    const currentCount = sortedEvents.filter((e) => {
      const t = e.timestamp?.toDate?.() ? e.timestamp.toDate().getTime() : new Date(e.timestamp).getTime();
      return t >= midPoint;
    }).length;

    const previousCount = sortedEvents.filter((e) => {
      const t = e.timestamp?.toDate?.() ? e.timestamp.toDate().getTime() : new Date(e.timestamp).getTime();
      return t < midPoint;
    }).length;

    if (previousCount === 0) {
      return { percentage: currentCount > 0 ? 100 : 0, direction: 'up', label: 'Increasing' };
    }

    const percentage = Math.round(((currentCount - previousCount) / previousCount) * 100);
    const direction = percentage >= 0 ? 'up' : 'down';

    return { percentage, direction, label: percentage >= 0 ? 'Increasing' : 'Decreasing' };
  }, [events]);

  const TrendIcon = () => {
    if (trend.direction === 'up') return <TrendingUpIcon />;
    if (trend.direction === 'down') return <TrendingDownIcon />;
    return <TrendingFlatIcon />;
  };

  const color = trend.direction === 'up' ? 'success.main' : trend.direction === 'down' ? 'error.main' : 'text.secondary';

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Event Rate Trend
          </Typography>
          <Typography variant="caption" color="text.secondary">
            vs. previous window
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ color }}>{<TrendIcon />}</Box>
          <Typography variant="h5" fontWeight={700} sx={{ color }}>
            {trend.percentage > 0 ? '+' : ''}{trend.percentage}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}