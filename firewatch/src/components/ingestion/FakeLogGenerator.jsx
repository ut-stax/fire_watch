import { useState } from 'react';
import { addEvent } from '../../firebase/events';
import {
  generateFakeEvent,
  generateFakeEventBurst,
  generateBruteForceScenario,
  generatePortScanScenario,
} from '../../utils/fakeLogGenerator';
import { Paper, Typography, FormControl, InputLabel, Select, MenuItem, Button, Alert, Box, LinearProgress } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import BoltIcon from '@mui/icons-material/Bolt';
import RadarIcon from '@mui/icons-material/Radar';
import { surfaceSx } from '../dashboard/dashboardStyles';

const EVENT_TYPES = ['failed_login', 'successful_login', 'port_scan', 'privilege_escalation', 'info'];
const SCENARIOS = [
  { id: 'burst', label: '20 Mixed Events' },
  { id: 'brute_force', label: 'Brute Force Attack (5 events)' },
  { id: 'port_scan', label: 'Port Scan (10 events)' },
];

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
        message: `Generated and added 1 ${selectedType.replace(/_/g, ' ')} event`,
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (generateError) {
      console.error('Error generating event:', generateError);
      setError(generateError.message || 'Failed to generate event');
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

      for (let index = 0; index < fakeEvents.length; index++) {
        await addEvent(fakeEvents[index]);
        setProgress(Math.round(((index + 1) / fakeEvents.length) * 100));
      }

      setSuccess({
        count: 20,
        message: 'Generated and added 20 mixed events successfully',
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (burstError) {
      console.error('Error generating burst:', burstError);
      setError(burstError.message || 'Failed to generate burst');
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

      for (let index = 0; index < fakeEvents.length; index++) {
        await addEvent(fakeEvents[index]);
        setProgress(Math.round(((index + 1) / fakeEvents.length) * 100));
      }

      setSuccess({
        count: fakeEvents.length,
        message: `Generated and added ${fakeEvents.length} events for ${scenarioName} scenario`,
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (scenarioError) {
      console.error('Error generating scenario:', scenarioError);
      setError(scenarioError.message || 'Failed to generate scenario');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <Paper sx={{ ...surfaceSx, p: 3, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Fake Event Generator
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 0.5 }}>
            Generate realistic test events for demonstrations and testing
          </Typography>
        </Box>
        <Box sx={{ width: 40, height: 40, borderRadius: '9999px', display: 'grid', placeItems: 'center', bgcolor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
          <ScienceIcon sx={{ fontSize: 20 }} />
        </Box>
      </Box>

      <Typography sx={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', mb: 3 }}>
        Quickly populate the platform with realistic attack traffic and operational noise.
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
          {success.message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      {loading && progress > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Generating...</Typography>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-primary)' }}>{progress}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: '9999px', bgcolor: 'var(--color-neutral-plate)', '& .MuiLinearProgress-bar': { borderRadius: '9999px' } }}
          />
        </Box>
      )}

      <Box sx={{ display: 'grid', gap: 2.5 }}>
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '12px', borderColor: 'var(--color-border)', bgcolor: 'var(--color-row-hover)' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2 }}>
            <Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Generate Single Event
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 0.5 }}>
                Emit one deterministic event for quick validation.
              </Typography>
            </Box>
            <Box sx={{ width: 36, height: 36, borderRadius: '9999px', display: 'grid', placeItems: 'center', bgcolor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
              <BoltIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) auto' }, gap: 1.5, alignItems: 'end' }}>
            <FormControl fullWidth disabled={loading} sx={fieldSx}>
              <InputLabel>Event Type</InputLabel>
              <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} label="Event Type">
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
              sx={{
                whiteSpace: 'nowrap',
                minHeight: 48,
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                '&:hover': { bgcolor: 'var(--color-primary-dark)' },
              }}
            >
              {loading && progress === 0 ? 'Generating...' : 'Generate'}
            </Button>
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '12px', borderColor: 'var(--color-border)', bgcolor: 'var(--color-row-hover)' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2 }}>
            <Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Generate Bulk Events
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 0.5 }}>
                Simulate a burst or a targeted attack scenario.
              </Typography>
            </Box>
            <Box sx={{ width: 36, height: 36, borderRadius: '9999px', display: 'grid', placeItems: 'center', bgcolor: 'var(--severity-high-bg)', color: 'var(--severity-high-fg)' }}>
              <RadarIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gap: 1.25 }}>
            <Button
              onClick={handleGenerateBurst}
              disabled={loading}
              variant="contained"
              fullWidth
              sx={{
                minHeight: 48,
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                '&:hover': { bgcolor: 'var(--color-primary-dark)' },
              }}
            >
              {loading && progress > 0 ? `Generating... ${progress}%` : 'Generate 20 Mixed Events'}
            </Button>

            {SCENARIOS.slice(1).map((scenario) => (
              <Button
                key={scenario.id}
                onClick={() => handleGenerateScenario(scenario.id)}
                disabled={loading}
                variant="outlined"
                fullWidth
                sx={{
                  minHeight: 48,
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  bgcolor: 'var(--color-surface)',
                  '&:hover': { bgcolor: 'var(--color-row-hover)', borderColor: 'var(--color-border)' },
                }}
              >
                {loading && progress > 0 ? `Generating... ${progress}%` : scenario.label}
              </Button>
            ))}
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '12px', borderColor: 'var(--color-border)', bgcolor: 'var(--color-row-hover)' }}>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)', mb: 1 }}>
            About Fake Events
          </Typography>
          <Box sx={{ display: 'grid', gap: 1 }}>
            {[
              'Single events use the selected event type',
              'Mixed events include a random combination of all event types',
              'Scenario events simulate coordinated attack patterns',
              'All events have realistic randomized IPs and timestamps',
              'Events are normalized and validated before being added to Firestore',
            ].map((note) => (
              <Box key={note} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '9999px', mt: 1, bgcolor: 'var(--color-primary)' }} />
                <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{note}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Paper>
  );
}
