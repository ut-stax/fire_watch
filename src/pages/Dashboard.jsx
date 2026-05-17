/**
 * Dashboard Page
 * Main dashboard displaying live KPI metrics, event feed, and visualization charts
 * Uses useEvents and useAlerts hooks to stream real-time data from Firestore
 */

import { useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import { useAlerts } from '../hooks/useAlerts';
import { useGlobalTimeRange } from '../contexts/TimeRangeContext';
import { MetricCard } from '../components/dashboard/MetricCard';
import { EventFeedTable } from '../components/dashboard/EventFeedTable';
import { EventTimeline } from '../components/dashboard/EventTimeline';
import { SeverityPie } from '../components/dashboard/SeverityPie';
import { TopIPsChart } from '../components/dashboard/TopIPsChart';
import { TrendIndicator } from '../components/dashboard/TrendIndicator';

// Icons for metric cards (using simple Unicode/emoji-like approach)
const IconShield = ({ size = 24 }) => (
  <div style={{ fontSize: size, lineHeight: 1 }}>🛡️</div>
);
const IconAlert = ({ size = 24 }) => (
  <div style={{ fontSize: size, lineHeight: 1 }}>⚠️</div>
);
const IconNetwork = ({ size = 24 }) => (
  <div style={{ fontSize: size, lineHeight: 1 }}>🌐</div>
);
const IconTrendingUp = ({ size = 24 }) => (
  <div style={{ fontSize: size, lineHeight: 1 }}>📈</div>
);

export default function Dashboard() {
  const timeRange = useGlobalTimeRange();
  const { events, loading: eventsLoading, error: eventsError } = useEvents(500, timeRange);
  const { alerts, loading: alertsLoading, error: alertsError } = useAlerts();

  // Compute KPI metrics using useMemo for performance
  const metrics = useMemo(() => {
    if (!events.length) {
      return {
        totalEvents: 0,
        criticalAlerts: 0,
        uniqueIPs: 0,
        eventsPerHour: 0,
      };
    }

    // Total events
    const totalEvents = events.length;

    // Critical unacknowledged alerts
    const criticalAlerts = alerts.filter(
      (a) => a.severity?.toLowerCase() === 'critical' && !a.acknowledged
    ).length;

    // Unique source IPs
    const uniqueIPs = new Set(events.map((e) => e.source_ip)).size;

    // Events per hour (from last 60 minutes)
    const now = new Date();
    const oneHourAgo = new Date(now - 60 * 60 * 1000);
    const eventsLastHour = events.filter((e) => {
      const eventTime = e.timestamp?.toDate?.()
        ? e.timestamp.toDate()
        : new Date(e.timestamp);
      return eventTime >= oneHourAgo;
    }).length;

    return {
      totalEvents,
      criticalAlerts,
      uniqueIPs,
      eventsPerHour: eventsLastHour,
    };
  }, [events, alerts]);

  const isLoading = eventsLoading || alertsLoading;
  const error = eventsError || alertsError;

  return (
    <div className="min-h-screen bg-gray-900 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Real-time security event monitoring and analysis
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6 text-red-200">
            <p className="font-semibold">Error loading data</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {/* KPI Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Events"
            value={metrics.totalEvents}
            icon={IconShield}
            colorClass="bg-blue-900"
          />
          <MetricCard
            title="Critical Alerts"
            value={metrics.criticalAlerts}
            icon={IconAlert}
            colorClass="bg-red-900"
          />
          <MetricCard
            title="Unique IPs"
            value={metrics.uniqueIPs}
            icon={IconNetwork}
            colorClass="bg-purple-900"
          />
          <MetricCard
            title="Events/Hour"
            value={metrics.eventsPerHour}
            icon={IconTrendingUp}
            colorClass="bg-green-900"
          />
        </div>

        {/* Trend Indicator */}
        <TrendIndicator events={events} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EventTimeline events={events} loading={isLoading} />
          <SeverityPie events={events} loading={isLoading} />
        </div>

        {/* Live Event Feed */}
        <div className="mb-8">
          <EventFeedTable events={events} loading={isLoading} />
        </div>

        {/* Top IPs Chart */}
        <div className="mb-8">
          <TopIPsChart events={events} loading={isLoading} />
        </div>

        {/* No Data State */}
        {!isLoading && events.length === 0 && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No data yet
            </h3>
            <p className="text-gray-400 mb-6">
              Generate some events using the Log Ingestion page to see real-time
              dashboards and metrics appear here.
            </p>
            <a
              href="/ingest"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go to Log Ingestion
            </a>
          </div>
        )}
      </div>
    </div>
  );
}