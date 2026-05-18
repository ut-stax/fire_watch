/**
 * File Upload Component
 * Handles CSV and JSON file uploads for bulk event ingestion
 */

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { addEvent } from '../../firebase/events';
import { normalizeEvent, validateEvent } from '../../utils/normalizer';
import { Paper, Typography, TextField, LinearProgress, Alert, Box, Button } from '@mui/material';

export function FileUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    setProgress(0);

    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (fileExtension === 'csv') {
        await handleCSVFile(file);
      } else if (fileExtension === 'json') {
        await handleJSONFile(file);
      } else {
        throw new Error('Only CSV and JSON files are supported');
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err.message || 'Failed to process file');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const data = results.data;

            if (!Array.isArray(data) || data.length === 0) {
              throw new Error('CSV file is empty or invalid format');
            }

            // Process each row
            let successCount = 0;
            const totalCount = data.length;

            for (let i = 0; i < data.length; i++) {
              try {
                const row = data[i];

                // Normalize and validate
                const normalizedEvent = normalizeEvent(row);
                const validation = validateEvent(normalizedEvent);

                if (!validation.valid) {
                  console.warn(`Row \${i + 1} validation failed:`, validation.errors);
                  continue;
                }

                // Add to Firestore
                await addEvent(normalizedEvent);
                successCount++;

                // Update progress
                setProgress(Math.round(((i + 1) / totalCount) * 100));
              } catch (rowError) {
                console.warn(`Error processing row \${i + 1}:`, rowError);
              }
            }

            if (successCount === 0) {
              throw new Error('No valid events found in CSV file');
            }

            setSuccess({
              count: successCount,
              total: totalCount,
              message: `Imported \${successCount} of \${totalCount} events successfully`,
            });

            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(null), 5000);

            resolve();
          } catch (err) {
            reject(err);
          }
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: \${error.message}`));
        },
      });
    });
  };

  const handleJSONFile = async (file) => {
    const fileContent = await file.text();

    try {
      const parsed = JSON.parse(fileContent);

      // Handle both single object and array of objects
      let events = Array.isArray(parsed) ? parsed : [parsed];

      if (events.length === 0) {
        throw new Error('JSON file contains no events');
      }

      // Process each event
      let successCount = 0;
      const totalCount = events.length;

      for (let i = 0; i < events.length; i++) {
        try {
          const event = events[i];

          // Normalize and validate
          const normalizedEvent = normalizeEvent(event);
          const validation = validateEvent(normalizedEvent);

          if (!validation.valid) {
            console.warn(`Event \${i + 1} validation failed:`, validation.errors);
            continue;
          }

          // Add to Firestore
          await addEvent(normalizedEvent);
          successCount++;

          // Update progress
          setProgress(Math.round(((i + 1) / totalCount) * 100));
        } catch (eventError) {
          console.warn(`Error processing event \${i + 1}:`, eventError);
        }
      }

      if (successCount === 0) {
        throw new Error('No valid events found in JSON file');
      }

      setSuccess({
        count: successCount,
        total: totalCount,
        message: `Imported \${successCount} of \${totalCount} events successfully`,
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      throw err;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        File Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Upload CSV or JSON files to import multiple events at once
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

      {/* File Input */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          component="label"
          disabled={loading}
        >
          Choose File
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleFileSelect}
            disabled={loading}
            hidden
          />
        </Button>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          Supported formats: CSV (with headers), JSON (array or single object)
        </Typography>
      </Box>

      {/* Progress Bar */}
      {loading && progress > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Importing...</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>{progress}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}

      {/* Example CSV Format */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          CSV Example:
        </Typography>
        <Box component="pre" sx={{ fontSize: '0.7rem', overflow: 'auto', bgcolor: 'grey.900', p: 1.5, borderRadius: 1 }}>
{`source_ip,dest_ip,event_type,severity,message
192.168.1.100,,failed_login,high,Failed login from suspicious IP
10.0.0.5,10.0.1.20,port_scan,high,Port scan detected
203.0.113.10,,privilege_escalation,critical,Unauthorized sudo access`}
        </Box>
      </Paper>

      {/* Example JSON Format */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          JSON Example:
        </Typography>
        <Box component="pre" sx={{ fontSize: '0.7rem', overflow: 'auto', bgcolor: 'grey.900', p: 1.5, borderRadius: 1 }}>
{`[
  {
    "source_ip": "192.168.1.100",
    "event_type": "failed_login",
    "severity": "high",
    "message": "Failed login attempt"
  },
  {
    "source_ip": "10.0.0.5",
    "dest_ip": "10.0.1.20",
    "event_type": "port_scan",
    "severity": "high",
    "message": "Port scan detected"
  }
]`}
        </Box>
      </Paper>
    </Paper>
  );
}
