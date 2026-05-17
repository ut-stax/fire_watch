/**
 * Fake Log Generator Component
 * UI for generating fake events for testing and demonstrations
 */

import { useState } from 'react';
import { addEvent } from '../../firebase/events';
import {
  generateFakeEvent,
  generateFakeEventBurst,
  generateBruteForceScenario,
  generatePortScanScenario,
} from '../../utils/fakeLogGenerator';

const EVENT_TYPES = [
  'failed_login',
  'successful_login',
  'port_scan',
  'privilege_escalation',
  'info',
];

const SCENARIOS = [
  { id: 'burst', label: '20 Mixed Events' },
  { id: 'brute_force', label: 'Brute Force Attack (5 events)' },
  { id: 'port_scan', label: 'Port Scan (10 events)' },
];

export function FakeLogGenerator() {
  const [selectedType, setSelectedType] = useState('failed_login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleGenerateSingle = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const fakeEvent = generateFakeEvent(selectedType);
      await addEvent(fakeEvent);

      setSuccess({
        count: 1,
        message: `Generated and added 1 ${selectedType.replace(/_/g, ' ')} event`,
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error generating event:', err);
      setError(err.message || 'Failed to generate event');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBurst = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setProgress(0);

    try {
      const fakeEvents = generateFakeEventBurst(20);

      // Add events one by one to show progress
      for (let i = 0; i < fakeEvents.length; i++) {
        await addEvent(fakeEvents[i]);
        setProgress(Math.round(((i + 1) / fakeEvents.length) * 100));
      }

      setSuccess({
        count: 20,
        message: 'Generated and added 20 mixed events successfully',
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error generating burst:', err);
      setError(err.message || 'Failed to generate burst');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleGenerateScenario = async (scenarioId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setProgress(0);

    try {
      let fakeEvents = [];
      let scenarioName = '';

      if (scenarioId === 'brute_force') {
        fakeEvents = generateBruteForceScenario(null, 5);
        scenarioName = 'brute force attack';
      } else if (scenarioId === 'port_scan') {
        fakeEvents = generatePortScanScenario(null, 10);
        scenarioName = 'port scan';
      }

      // Add events one by one
      for (let i = 0; i < fakeEvents.length; i++) {
        await addEvent(fakeEvents[i]);
        setProgress(Math.round(((i + 1) / fakeEvents.length) * 100));
      }

      setSuccess({
        count: fakeEvents.length,
        message: `Generated and added ${fakeEvents.length} events for ${scenarioName} scenario`,
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error generating scenario:', err);
      setError(err.message || 'Failed to generate scenario');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Fake Event Generator</h2>
      <p className="text-gray-400 mb-6">
        Generate realistic test events for demonstrations and testing
      </p>

      {/* Success Message */}
      {success && (
        <div className="bg-green-900 border border-green-700 rounded p-4 text-green-200 mb-4">
          ✓ {success.message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 border border-red-700 rounded p-4 text-red-200 mb-4">
          ✕ {error}
        </div>
      )}

      {/* Progress Bar */}
      {loading && progress > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Generating...</span>
            <span className="text-sm font-medium text-green-400">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Single Event Generator */}
        <div className="border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Generate Single Event</h3>

          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              disabled={loading}
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerateSingle}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded transition-colors whitespace-nowrap"
            >
              {loading && progress === 0 ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Bulk Generators */}
        <div className="border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Generate Bulk Events</h3>

          <div className="space-y-3">
            {/* Burst Button */}
            <button
              onClick={handleGenerateBurst}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded transition-colors"
            >
              {loading && progress > 0 ? `Generating... ${progress}%` : 'Generate 20 Mixed Events'}
            </button>

            {/* Scenario Buttons */}
            {SCENARIOS.slice(1).map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => handleGenerateScenario(scenario.id)}
                disabled={loading}
                className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded transition-colors"
              >
                {loading && progress > 0 ? `Generating... ${progress}%` : scenario.label}
              </button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gray-700 rounded p-4 text-sm text-gray-300">
          <p className="font-semibold mb-2">ℹ️ About Fake Events</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Single events use the selected event type</li>
            <li>Mixed events include a random combination of all event types</li>
            <li>Scenario events simulate coordinated attack patterns</li>
            <li>All events have realistic randomized IPs and timestamps</li>
            <li>Events are normalized and validated before being added to Firestore</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
