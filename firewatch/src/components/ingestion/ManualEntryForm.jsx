/**
 * Manual Entry Form Component
 * Allows analysts to manually enter individual log events
 */

import { useState } from 'react';
import { addEvent } from '../../firebase/events';
import { normalizeEvent, validateEvent } from '../../utils/normalizer';
import { Paper, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Button, Alert, Box } from '@mui/material';

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
        throw new Error(`Validation failed: \${validation.errors.join(', ')}`);
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
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Manual Event Entry
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter a single security event manually
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Success Message */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Event added successfully!
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Source IP */}
        <TextField
          fullWidth
          label="Source IP *"
          name="source_ip"
          value={formData.source_ip}
          onChange={handleChange}
          placeholder="e.g., 192.168.1.100"
          disabled={loading}
          sx={{ mb: 3 }}
        />

        {/* Destination IP */}
        <TextField
          fullWidth
          label="Destination IP (optional)"
          name="dest_ip"
          value={formData.dest_ip}
          onChange={handleChange}
          placeholder="e.g., 10.0.0.1"
          disabled={loading}
          sx={{ mb: 3 }}
        />

        {/* Event Type and Severity */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
          <FormControl fullWidth disabled={loading}>
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

          <FormControl fullWidth disabled={loading}>
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

        {/* Message */}
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
          sx={{ mb: 3 }}
        />

        {/* Raw Log */}
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
          sx={{ mb: 3 }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          size="large"
        >
          {loading ? 'Submitting...' : 'Add Event'}
        </Button>
      </form>
    </Paper>
  );
}
