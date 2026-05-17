/**
 * useTimeRange hook
 * Provides global time range state for filtering events and alerts
 */

import { useState, useCallback, useMemo } from 'react';
import { subHours, subDays, formatISO } from 'date-fns';

const PRESETS = {
  'Last 1h': { from: (d) => subHours(d, 1), label: 'Last 1h' },
  'Last 6h': { from: (d) => subHours(d, 6), label: 'Last 6h' },
  'Last 24h': { from: (d) => subHours(d, 24), label: 'Last 24h' },
  'Last 7d': { from: (d) => subDays(d, 7), label: 'Last 7d' },
};

export function useTimeRange() {
  const [from, setFrom] = useState(() => subHours(new Date(), 24));
  const [to, setTo] = useState(() => new Date());
  const [activePreset, setActivePreset] = useState('Last 24h');

  const setPreset = useCallback((presetKey) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      const toDate = new Date();
      const fromDate = preset.from(toDate);
      setFrom(fromDate);
      setTo(toDate);
      setActivePreset(presetKey);
    }
  }, []);

  const setCustomRange = useCallback((fromDate, toDate) => {
    setFrom(fromDate);
    setTo(toDate);
    setActivePreset('Custom');
  }, []);

  const label = useMemo(() => {
    if (activePreset !== 'Custom') {
      return activePreset;
    }
    return `${formatISO(from, { representation: 'date' })} - ${formatISO(to, { representation: 'date' })}`;
  }, [activePreset, from, to]);

  return {
    from,
    to,
    label,
    activePreset,
    setPreset,
    setCustomRange,
  };
}