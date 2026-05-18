/**
 * TimeRange Context
 * Provides global time range state to all components
 */

import { createContext, useContext } from 'react';

const TimeRangeContext = createContext(null);

export function useGlobalTimeRange() {
  return useContext(TimeRangeContext);
}

export { TimeRangeContext };