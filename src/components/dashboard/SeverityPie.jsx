/**
 * Severity Pie Chart Component
 * Displays distribution of events by severity level using Recharts PieChart
 */

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  getSeverityChartColor,
  getSeverityLabel,
} from '../../utils/severityColors';

export function SeverityPie({ events = [], loading = false }) {
  // Compute severity distribution
  const computeSeverityData = () => {
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
        name: getSeverityLabel(severity),
        value: count,
        severity,
      }));
  };

  const data = computeSeverityData();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Severity Distribution
        </h3>
        <div className="h-64 bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Severity Distribution
      </h3>
      {data.length > 0 ? (
        <div>
          <div className="h-64">
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
                      fill={getSeverityChartColor(entry.severity)}
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
                  formatter={(value) => [
                    value,
                    `${((value / total) * 100).toFixed(1)}%`,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
            {data.map((item) => (
              <div key={item.severity} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor: getSeverityChartColor(item.severity),
                  }}
                />
                <span className="text-gray-300">
                  {item.name}: {item.value} (
                  {((item.value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No events to display
        </div>
      )}
    </div>
  );
}