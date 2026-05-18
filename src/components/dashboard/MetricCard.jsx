/**
 * Metric Card Component
 * Displays a single KPI metric with title, value, icon, and color styling
 */

export function MetricCard({ title, value, icon: Icon, colorClass = 'bg-blue-900' }) {
  return (
    <div className={`${colorClass} rounded-lg p-6 border border-gray-700`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        {Icon && (
          <div className="text-white opacity-20">
            <Icon size={40} />
          </div>
        )}
      </div>
    </div>
  );
}
