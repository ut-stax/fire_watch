/**
 * Event Timeline Chart Component
 * Displays event count distribution across 24 hours using Recharts LineChart
 */

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

export function EventTimeline({ events = [], loading = false }) {
  const data = useMemo(() => {
    const now = new Date();
    const hourData = {};

    for (let i = 0; i < 24; i++) {
      hourData[i] = 0;
    }

    events.forEach((event) => {
      const eventTime = event.timestamp?.toDate?.()
        ? event.timestamp.toDate()
        : new Date(event.timestamp);

      if (now - eventTime < 24 * 60 * 60 * 1000) {
        const hour = eventTime.getHours();
        hourData[hour]++;
      }
    });

    return Array.from({ length: 24 }, (_, i) => ({
      hour: String(i).padStart(2, '0') + ':00',
      count: hourData[i],
    }));
  }, [events]);

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Event Timeline
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
        Event Timeline
      </Typography>
      <Box sx={{ height: 256 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="hour" stroke="#9ca3af" style={{ fontSize: 12 }} interval={2} />
            <YAxis stroke="#9ca3af" style={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}