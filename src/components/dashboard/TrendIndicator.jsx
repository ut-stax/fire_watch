/**
 * Trend Indicator Component
 * Shows event rate trend comparison between current and previous time window
 */

import { useMemo } from 'react';

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

  const getArrow = () => {
    if (trend.direction === 'up') return '↗';
    if (trend.direction === 'down') return '↘';
    return '→';
  };

  const getColorClass = () => {
    if (trend.direction === 'up') return 'text-green-400';
    if (trend.direction === 'down') return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">Event Rate Trend</p>
          <p className="text-gray-500 text-xs">vs. previous window</p>
        </div>
        <div className="text-right">
          <span className={`text-2xl ${getColorClass()}`}>{getArrow()}</span>
          <p className={`text-xl font-bold ${getColorClass()}`}>
            {trend.percentage > 0 ? '+' : ''}{trend.percentage}%
          </p>
        </div>
      </div>
    </div>
  );
}