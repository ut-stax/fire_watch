/**
 * Top Source IPs Bar Chart Component
 * Displays top 10 source IPs by event count using Recharts BarChart
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function TopIPsChart({ events = [], loading = false }) {
  // Compute top 10 IPs by event count
  const computeTopIPs = () => {
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
  };

  const data = computeTopIPs();

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Source IPs</h3>
        <div className="h-64 bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Top Source IPs</h3>
      {data.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis
                dataKey="ip"
                type="category"
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
                width={110}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#e5e7eb' }}
                formatter={(value, name, props) => [
                  value,
                  `IP: ${props.payload.fullIp}`,
                ]}
              />
              <Bar dataKey="count" fill="#f97316" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No events to display
        </div>
      )}
    </div>
  );
}
