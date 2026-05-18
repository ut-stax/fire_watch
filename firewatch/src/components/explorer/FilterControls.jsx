/**
 * Filter Controls Component
 * Severity, event type, and source IP dropdown filters
 */

import { useMemo } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

const SEVERITY_LEVELS = ['All', 'Critical', 'High', 'Medium', 'Low', 'Info'];
const EVENT_TYPES = ['All', 'failed_login', 'port_scan', 'privilege_escalation', 'successful_login', 'info'];

export function FilterControls({ events, filters, onFilterChange }) {
  const uniqueIPs = useMemo(() => {
    const ips = new Set(['All']);
    events.forEach((event) => {
      if (event.source_ip) {
        ips.add(event.source_ip);
      }
    });
    return Array.from(ips).sort();
  }, [events]);

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Severity</InputLabel>
        <Select
          value={filters.severity || 'All'}
          onChange={(e) => onFilterChange('severity', e.target.value)}
          label="Severity"
        >
          {SEVERITY_LEVELS.map((level) => (
            <MenuItem key={level} value={level}>
              {level === 'All' ? 'All Severities' : level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Event Type</InputLabel>
        <Select
          value={filters.eventType || 'All'}
          onChange={(e) => onFilterChange('eventType', e.target.value)}
          label="Event Type"
        >
          {EVENT_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type === 'All' ? 'All Event Types' : type.replace(/_/g, ' ')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Source IP</InputLabel>
        <Select
          value={filters.sourceIP || 'All'}
          onChange={(e) => onFilterChange('sourceIP', e.target.value)}
          label="Source IP"
        >
          {uniqueIPs.map((ip) => (
            <MenuItem key={ip} value={ip}>
              {ip === 'All' ? 'All IPs' : ip}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}