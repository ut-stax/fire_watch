/**
 * Severity Color Mapping
 * Maps severity levels to Tailwind CSS color classes for consistent styling
 */

/**
 * Get Tailwind color classes for a severity level
 * @param {string} severity - Severity level (critical, high, medium, low, info)
 * @returns {Object} { bg: string, text: string, badge: string }
 */
export function getSeverityColor(severity) {
  const severityMap = {
    critical: {
      bg: 'bg-red-900',
      text: 'text-red-100',
      badge: 'bg-red-500 text-white',
      borderText: 'border-red-500 text-red-500',
      lightBg: 'bg-red-50',
    },
    high: {
      bg: 'bg-orange-900',
      text: 'text-orange-100',
      badge: 'bg-orange-500 text-white',
      borderText: 'border-orange-500 text-orange-500',
      lightBg: 'bg-orange-50',
    },
    medium: {
      bg: 'bg-yellow-900',
      text: 'text-yellow-100',
      badge: 'bg-yellow-500 text-gray-900',
      borderText: 'border-yellow-500 text-yellow-600',
      lightBg: 'bg-yellow-50',
    },
    low: {
      bg: 'bg-blue-900',
      text: 'text-blue-100',
      badge: 'bg-blue-400 text-white',
      borderText: 'border-blue-400 text-blue-400',
      lightBg: 'bg-blue-50',
    },
    info: {
      bg: 'bg-gray-700',
      text: 'text-gray-100',
      badge: 'bg-gray-400 text-gray-900',
      borderText: 'border-gray-400 text-gray-400',
      lightBg: 'bg-gray-50',
    },
  };

  return severityMap[severity?.toLowerCase()] || severityMap.info;
}

/**
 * Get chart color for a severity level (for Recharts)
 * @param {string} severity - Severity level
 * @returns {string} Hex color code
 */
export function getSeverityChartColor(severity) {
  const colorMap = {
    critical: '#ef4444', // red-500
    high: '#f97316',     // orange-500
    medium: '#eab308',   // yellow-500
    low: '#60a5fa',      // blue-400
    info: '#9ca3af',     // gray-400
  };

  return colorMap[severity?.toLowerCase()] || colorMap.info;
}

/**
 * Get severity order for sorting (critical=0, high=1, etc.)
 * @param {string} severity - Severity level
 * @returns {number} Sort order (lower = higher severity)
 */
export function getSeverityOrder(severity) {
  const orderMap = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
    info: 4,
  };

  return orderMap[severity?.toLowerCase()] ?? 5;
}

/**
 * Get human-readable severity label
 * @param {string} severity - Severity level
 * @returns {string} Capitalized severity label
 */
export function getSeverityLabel(severity) {
  const labelMap = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    info: 'Info',
  };

  return labelMap[severity?.toLowerCase()] || 'Unknown';
}
