/**
 * Time Range Selector Component
 * Preset buttons and custom date range picker for filtering data
 */

import { useState } from 'react';
import { format } from 'date-fns';

const PRESETS = ['Last 1h', 'Last 6h', 'Last 24h', 'Last 7d'];

export function TimeRangeSelector({ timeRange, onTimeRangeChange }) {
  const [showCustom, setShowCustom] = useState(false);

  const handlePresetClick = (preset) => {
    onTimeRangeChange.setPreset(preset);
    setShowCustom(false);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const from = new Date(formData.get('from'));
    const to = new Date(formData.get('to'));
    if (!isNaN(from) && !isNaN(to)) {
      onTimeRangeChange.setCustomRange(from, to);
    }
    setShowCustom(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Preset Buttons */}
      <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            className={`px-3 py-1.5 text-sm rounded-md transition ${
              timeRange.activePreset === preset
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Custom Range Button */}
      <div className="relative">
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`px-3 py-1.5 text-sm rounded-lg transition flex items-center gap-1 ${
            timeRange.activePreset === 'Custom'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Custom
        </button>

        {/* Custom Date Picker */}
        {showCustom && (
          <form
            onSubmit={handleCustomSubmit}
            className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg z-50 min-w-80"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">From</label>
                <input
                  type="datetime-local"
                  name="from"
                  defaultValue={format(timeRange.from, "yyyy-MM-dd'T'HH:mm")}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">To</label>
                <input
                  type="datetime-local"
                  name="to"
                  defaultValue={format(timeRange.to, "yyyy-MM-dd'T'HH:mm")}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustom(false)}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}