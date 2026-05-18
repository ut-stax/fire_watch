/**
 * Log Ingestion Page
 * Main page for ingesting events through multiple methods
 */

import { ManualEntryForm } from '../components/ingestion/ManualEntryForm';
import { FileUpload } from '../components/ingestion/FileUpload';
import { FakeLogGenerator } from '../components/ingestion/FakeLogGenerator';
import { Paper, Typography, Box, Alert } from '@mui/material';

export function LogIngestion() {
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h3" gutterBottom>
          Log Ingestion
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Import security events through multiple ingestion methods
        </Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        Use any of the methods below to populate the system with security events.
        Events are normalized, validated, and stored in Firestore automatically.
      </Alert>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 3,
        }}
      >
        <Box>
          <ManualEntryForm />
        </Box>
        <Box>
          <FakeLogGenerator />
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FileUpload />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          How to Use
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.primary" gutterBottom>
              Manual Entry
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter individual security events by filling out a form. Ideal for
              single, ad-hoc event entries or testing specific scenarios.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.primary" gutterBottom>
              File Upload
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload CSV or JSON files containing multiple events. Supports bulk
              imports with automatic field normalization and validation.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.primary" gutterBottom>
              Fake Generator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generate realistic test events for demonstrations. Includes prebuilt
              attack scenarios like brute force and port scans.
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Event Types Reference
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
            gap: 2,
          }}
        >
          <Box>
            <Typography color="warning.main" fontWeight={600}>
              failed_login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Login attempt denied
            </Typography>
          </Box>
          <Box>
            <Typography color="success.main" fontWeight={600}>
              successful_login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              User successfully authenticated
            </Typography>
          </Box>
          <Box>
            <Typography color="warning.dark" fontWeight={600}>
              port_scan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Network scan detected
            </Typography>
          </Box>
          <Box>
            <Typography color="error" fontWeight={600}>
              privilege_escalation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Unauthorized privilege attempt
            </Typography>
          </Box>
          <Box>
            <Typography color="info.main" fontWeight={600}>
              info
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Informational event
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Severity Levels
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
            gap: 2,
          }}
        >
          <Box>
            <Typography color="error" fontWeight={600}>
              Critical
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Immediate action required
            </Typography>
          </Box>
          <Box>
            <Typography color="warning.main" fontWeight={600}>
              High
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Urgent attention needed
            </Typography>
          </Box>
          <Box>
            <Typography color="warning.light" fontWeight={600}>
              Medium
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Needs investigation
            </Typography>
          </Box>
          <Box>
            <Typography color="info.main" fontWeight={600}>
              Low
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitor and track
            </Typography>
          </Box>
          <Box>
            <Typography color="text.secondary" fontWeight={600}>
              Info
            </Typography>
            <Typography variant="body2" color="text.secondary">
              General information
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}