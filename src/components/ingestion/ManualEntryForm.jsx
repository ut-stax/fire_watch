/**
 * Manual Entry Form Component
 * Allows analysts to manually enter individual log events
 */

import { useState } from 'react';
import { addEvent } from '../../firebase/events';
import { normalizeEvent, validateEvent } from '../../utils/normalizer';

const EVENT_TYPES = [
  'failed_login',
  'successful_login',
  'port_scan',
  'privilege_escalation',
  'info',
];

const SEVERITY_LEVELS = ['critical', 'high', 'medium', 'low', 'info'];

export function ManualEntryForm() {
  const [formData, setFormData] = useState({
    source_ip: '',
    dest_ip: '',
    event_type: 'failed_login',
    severity: 'medium',
    message: '',
    raw_log: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.source_ip.trim()) {
        throw new Error('Source IP is required');
      }
      if (!formData.event_type) {
        throw new Error('Event type is required');
      }
      if (!formData.severity) {
        throw new Error('Severity is required');
      }
      if (!formData.message.trim()) {
        throw new Error('Message is required');
      }

      // Normalize the event
      const normalizedEvent = normalizeEvent(formData);

      // Validate the normalized event
      const validation = validateEvent(normalizedEvent);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Add to Firestore
      await addEvent(normalizedEvent);

      // Show success message and reset form
      setSuccess(true);
      setFormData({
        source_ip: '',
        dest_ip: '',
        event_type: 'failed_login',
        severity: 'medium',
        message: '',
        raw_log: '',
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error submitting event:', err);
      setError(err.message || 'Failed to submit event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Manual Event Entry</h2>
      <p className="text-gray-400 mb-6">Enter a single security event manually</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Success Message */}
        {success && (
          <div className="bg-green-900 border border-green-700 rounded p-4 text-green-200">
            ✓ Event added successfully!
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded p-4 text-red-200">
            ✕ {error}
          </div>
        )}

        {/* Source IP */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Source IP *
          </label>
          <input
            type="text"
            name="source_ip"
            value={formData.source_ip}
            onChange={handleChange}
            placeholder="e.g., 192.168.1.100"
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {/* Destination IP */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Destination IP (optional)
          </label>
          <input
            type="text"
            name="dest_ip"
            value={formData.dest_ip}
            onChange={handleChange}
            placeholder="e.g., 10.0.0.1"
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {/* Event Type and Severity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Type *
            </label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              disabled={loading}
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Severity *
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              disabled={loading}
            >
              {SEVERITY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="e.g., Failed login attempt from suspicious IP"
            rows="3"
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {/* Raw Log */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Raw Log (optional)
          </label>
          <textarea
            name="raw_log"
            value={formData.raw_log}
            onChange={handleChange}
            placeholder="e.g., [2024-01-15 14:32:10] Failed password for admin from 192.168.1.100 port 54321"
            rows="3"
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 rounded transition-colors"
        >
          {loading ? 'Submitting...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
}
