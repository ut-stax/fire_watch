/**
 * Time Range Selector Component
 * Preset buttons and custom date range picker for filtering data
 */

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Popover,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';

const PRESETS = ['Last 1h', 'Last 6h', 'Last 24h', 'Last 7d'];

export function TimeRangeSelector({ timeRange, onTimeRangeChange }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePresetClick = (preset) => {
    if (preset) {
      onTimeRangeChange.setPreset(preset);
    }
  };

  const handleCustomClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const from = new Date(formData.get('from'));
    const to = new Date(formData.get('to'));
    if (!isNaN(from) && !isNaN(to)) {
      onTimeRangeChange.setCustomRange(from, to);
    }
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <ToggleButtonGroup
        exclusive
        value={timeRange.activePreset}
        onChange={(_, value) => handlePresetClick(value)}
        size="small"
        sx={{
          display: 'inline-flex',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'var(--color-surface)',
          '& .MuiToggleButtonGroup-grouped': {
            border: 'none',
            borderRadius: 0,
            px: 1.25,
            minHeight: 36,
            color: 'var(--color-text-muted)',
            textTransform: 'none',
            fontSize: '0.8125rem',
            fontWeight: 500,
            backgroundColor: 'transparent',
            '&:not(:last-of-type)': {
              borderRight: '1px solid var(--color-border)',
            },
            '&.Mui-selected': {
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-surface)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              '&:hover': {
                backgroundColor: 'var(--color-surface)',
              },
            },
            '&:hover': {
              backgroundColor: 'var(--color-row-hover)',
            },
          },
        }}
      >
        {PRESETS.map((preset) => (
          <ToggleButton
            key={preset}
            value={preset}
          >
            {preset}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <IconButton
        onClick={handleCustomClick}
        color={timeRange.activePreset === 'Custom' ? 'primary' : 'default'}
        sx={{ border: '1px solid var(--color-border)', borderRadius: '8px', bgcolor: 'var(--color-surface)' }}
      >
        <DateRangeIcon />
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Box
          component="form"
          onSubmit={handleCustomSubmit}
          sx={{ p: 3, width: 300, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'var(--color-surface)' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box component="span" fontWeight={600}>
              Custom Range
            </Box>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <TextField
            name="from"
            type="datetime-local"
            label="From"
            size="small"
            defaultValue={format(timeRange.from, "yyyy-MM-dd'T'HH:mm")}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="to"
            type="datetime-local"
            label="To"
            size="small"
            defaultValue={format(timeRange.to, "yyyy-MM-dd'T'HH:mm")}
            InputLabelProps={{ shrink: true }}
          />

          <Button type="submit" variant="contained" fullWidth>
            Apply
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}