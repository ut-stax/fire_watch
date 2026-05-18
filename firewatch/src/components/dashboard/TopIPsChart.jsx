/**
 * Top Source IPs Bar Chart Component
 * Displays top 10 source IPs by event count using Recharts BarChart
 */

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

export function TopIPsChart({ events = [], loading = false }) {
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

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Top Source IPs
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
        Top Source IPs
      </Typography>
      {data.length > 0 ? (
        <Box sx={{ height: 256 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" style={{ fontSize: 12 }} />
              <YAxis
                dataKey="ip"
                type="category"
                stroke="#9ca3af"
                style={{ fontSize: 11 }}
                width={110}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#e5e7eb' }}
                formatter={(value, name, props) => [value, `IP: ${props.payload.fullIp}`]}
              />
              <Bar dataKey="count" fill="#f97316" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box sx={{ height: 256, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">No events to display</Typography>
        </Box>
      )}
    </Paper>
  );
}