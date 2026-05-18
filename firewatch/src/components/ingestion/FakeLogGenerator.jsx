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
import { Paper, Typography, FormControl, InputLabel, Select, MenuItem, Button, Alert, Box, LinearProgress } from '@mui/material';

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
        message: `Generated and added 1 \${selectedType.replace(/_/g, ' ')} event`,
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
        message: `Generated and added \${fakeEvents.length} events for \${scenarioName} scenario`,
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
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Fake Event Generator
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Generate realistic test events for demonstrations and testing
      </Typography>

      {/* Success Message */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success.message}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Progress Bar */}
      {loading && progress > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Generating...</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>{progress}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Single Event Generator */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generate Single Event
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                label="Event Type"
              >
                {EVENT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              onClick={handleGenerateSingle}
              disabled={loading}
              variant="contained"
              sx={{ whiteSpace: 'nowrap' }}
            >
              {loading && progress === 0 ? 'Generating...' : 'Generate'}
            </Button>
          </Box>
        </Paper>

        {/* Bulk Generators */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generate Bulk Events
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Burst Button */}
            <Button
              onClick={handleGenerateBurst}
              disabled={loading}
              variant="contained"
              fullWidth
            >
              {loading && progress > 0 ? `Generating... \${progress}%` : 'Generate 20 Mixed Events'}
            </Button>

            {/* Scenario Buttons */}
            {SCENARIOS.slice(1).map((scenario) => (
              <Button
                key={scenario.id}
                onClick={() => handleGenerateScenario(scenario.id)}
                disabled={loading}
                variant="contained"
                color="warning"
                fullWidth
              >
                {loading && progress > 0 ? `Generating... \${progress}%` : scenario.label}
              </Button>
            ))}
          </Box>
        </Paper>

        {/* Info Box */}
        <Paper variant="outlined" sx={{ p: 2.5 }}>
          <Typography variant="subtitle2" gutterBottom>
            About Fake Events
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            <Typography component="li" variant="body2" color="text.secondary">
              Single events use the selected event type
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Mixed events include a random combination of all event types
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Scenario events simulate coordinated attack patterns
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              All events have realistic randomized IPs and timestamps
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Events are normalized and validated before being added to Firestore
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Paper>
  );
}
