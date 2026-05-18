/**
 * Alerts Page
 * Main alerts management page for triaging security alerts
 * Shows active unacknowledged alerts, detail panel, and alert history
 */

import { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import { acknowledgeAlert } from '../firebase/alerts';
import { useGlobalTimeRange } from '../contexts/TimeRangeContext';
import { ActiveAlertsList } from '../components/alerts/ActiveAlertsList';
import { AlertDetail } from '../components/alerts/AlertDetail';
import { AlertHistory } from '../components/alerts/AlertHistory';

export default function Alerts() {
  const { alerts, loading, error } = useAlerts();
  const timeRange = useGlobalTimeRange();
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [acknowledging, setAcknowledging] = useState(false);

  const handleSelectAlert = (alert) => {
    setSelectedAlert(alert);
  };

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      setAcknowledging(true);
      await acknowledgeAlert(alertId);
      // Clear selection if the acknowledged alert was selected
      if (selectedAlert?.id === alertId) {
        setSelectedAlert(null);
      }
      console.log('Alert acknowledged successfully');
    } catch (err) {
      console.error('Error acknowledging alert:', err);
      alert(`Failed to acknowledge alert: ${err.message}`);
    } finally {
      setAcknowledging(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Alerts</h1>
          <p className="text-gray-400">
            Monitor and triage security alerts in real time
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6 text-red-200">
            <p className="font-semibold">Error loading alerts</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {/* Main Content - Active Alerts and Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Active Alerts List */}
          <div className="lg:col-span-1">
            <ActiveAlertsList
              alerts={alerts}
              loading={loading}
              selectedAlert={selectedAlert}
              onSelectAlert={handleSelectAlert}
              onAcknowledgeAlert={handleAcknowledgeAlert}
            />
          </div>

          {/* Alert Detail Panel */}
          <div className="lg:col-span-2">
            <AlertDetail alert={selectedAlert} loading={acknowledging} />
          </div>
        </div>

        {/* Alert History */}
        <AlertHistory timeRange={timeRange} />
      </div>
    </div>
  );
}