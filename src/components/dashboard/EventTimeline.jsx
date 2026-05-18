/**
 * Event Timeline Chart Component
 * Displays event count distribution across 24 hours using Recharts LineChart
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function EventTimeline({ events = [], loading = false }) {
  // Compute hourly event counts for last 24 hours
  const computeHourlyData = () => {
    const now = new Date();
    const hourData = {};

    // Initialize all 24 hours with 0 count
    for (let i = 0; i < 24; i++) {
      hourData[i] = 0;
    }

    // Count events by hour
    events.forEach((event) => {
      const eventTime = event.timestamp?.toDate?.()
        ? event.timestamp.toDate()
        : new Date(event.timestamp);

      // Only count events from last 24 hours
      if (now - eventTime < 24 * 60 * 60 * 1000) {
        const hour = eventTime.getHours();
        hourData[hour]++;
      }
    });

    // Convert to chart format
    return Array.from({ length: 24 }, (_, i) => ({
      hour: String(i).padStart(2, '0') + ':00',
      count: hourData[i],
    }));
  };

  const data = computeHourlyData();

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 col-span-2">
        <h3 className="text-lg font-semibold text-white mb-4">Event Timeline</h3>
        <div className="h-64 bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Event Timeline</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="hour"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              interval={2}
            />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
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
      </div>
    </div>
  );
}
