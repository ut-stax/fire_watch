import { useState } from 'react';
import { addEvent } from '../../firebase/events';
import { normalizeEvent, validateEvent } from '../../utils/normalizer';
import { Paper, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Button, Alert, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { surfaceSx } from '../dashboard/dashboardStyles';

const EVENT_TYPES = ['failed_login', 'successful_login', 'port_scan', 'privilege_escalation', 'info'];
const SEVERITY_LEVELS = ['critical', 'high', 'medium', 'low', 'info'];

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    bgcolor: 'var(--color-surface)',
    '& fieldset': { borderColor: 'var(--color-border)' },
    '&:hover fieldset': { borderColor: 'var(--color-text-muted)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
  },
  '& .MuiInputLabel-root': {
    color: 'var(--color-text-muted)',
  },
  '& .MuiInputBase-input': {
    color: 'var(--color-text-primary)',
  },
};

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
      if (!formData.source_ip.trim()) throw new Error('Source IP is required');
      if (!formData.event_type) throw new Error('Event type is required');
      if (!formData.severity) throw new Error('Severity is required');
      if (!formData.message.trim()) throw new Error('Message is required');

      const normalizedEvent = normalizeEvent(formData);
      const validation = validateEvent(normalizedEvent);

      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      await addEvent(normalizedEvent);

      setSuccess(true);
      setFormData({
        source_ip: '',
        dest_ip: '',
        event_type: 'failed_login',
        severity: 'medium',
        message: '',
        raw_log: '',
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (submitError) {
      console.error('Error submitting event:', submitError);
      setError(submitError.message || 'Failed to submit event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ ...surfaceSx, p: 3, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Manual Event Entry
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 0.5 }}>
            Enter a single security event manually
          </Typography>
        </Box>
        <Box sx={{ width: 40, height: 40, borderRadius: '9999px', display: 'grid', placeItems: 'center', bgcolor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
          <AddCircleIcon sx={{ fontSize: 20 }} />
        </Box>
      </Box>

      <Typography sx={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', mb: 3 }}>
        Use this form when you need to add a precise incident with curated fields and validation.
      </Typography>

      <form onSubmit={handleSubmit}>
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
            Event added successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Source IP *"
          name="source_ip"
          value={formData.source_ip}
          onChange={handleChange}
          placeholder="e.g., 192.168.1.100"
          disabled={loading}
          sx={{ mb: 2.5, ...fieldSx }}
        />

        <TextField
          fullWidth
          label="Destination IP (optional)"
          name="dest_ip"
          value={formData.dest_ip}
          onChange={handleChange}
          placeholder="e.g., 10.0.0.1"
          disabled={loading}
          sx={{ mb: 2.5, ...fieldSx }}
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2.5 }}>
          <FormControl fullWidth disabled={loading} sx={fieldSx}>
            <InputLabel>Event Type *</InputLabel>
            <Select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              label="Event Type *"
            >
              {EVENT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={loading} sx={fieldSx}>
            <InputLabel>Severity *</InputLabel>
            <Select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              label="Severity *"
            >
              {SEVERITY_LEVELS.map((level) => (
                <MenuItem key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          label="Message *"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="e.g., Failed login attempt from suspicious IP"
          multiline
          rows={3}
          disabled={loading}
          sx={{ mb: 2.5, ...fieldSx }}
        />

        <TextField
          fullWidth
          label="Raw Log (optional)"
          name="raw_log"
          value={formData.raw_log}
          onChange={handleChange}
          placeholder="e.g., [2024-01-15 14:32:10] Failed password for admin from 192.168.1.100 port 54321"
          multiline
          rows={3}
          disabled={loading}
          sx={{ mb: 3, ...fieldSx }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          size="large"
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            minHeight: 48,
            '&:hover': { bgcolor: 'var(--color-primary-dark)' },
          }}
        >
          {loading ? 'Submitting...' : 'Add Event'}
        </Button>
      </form>
    </Paper>
  );
}
