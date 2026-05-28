import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { addEvent } from '../../firebase/events';
import { normalizeEvent, validateEvent } from '../../utils/normalizer';
import { Paper, Typography, LinearProgress, Alert, Box, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { surfaceSx } from '../dashboard/dashboardStyles';

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
                  console.warn(`Row ${i + 1} validation failed:`, validation.errors);
                  continue;
                }

                // Add to Firestore
                await addEvent(normalizedEvent);
                successCount++;

                // Update progress
                setProgress(Math.round(((i + 1) / totalCount) * 100));
              } catch (rowError) {
                console.warn(`Error processing row ${i + 1}:`, rowError);
              }
            }

            if (successCount === 0) {
              throw new Error('No valid events found in CSV file');
            }

            setSuccess({
              count: successCount,
              total: totalCount,
              message: `Imported ${successCount} of ${totalCount} events successfully`,
            });

            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(null), 5000);

            resolve();
          } catch (err) {
            reject(err);
          }
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        },
      });
    });
  };

  const handleJSONFile = async (file) => {
    const fileContent = await file.text();

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
          console.warn(`Event ${i + 1} validation failed:`, validation.errors);
          continue;
        }

        // Add to Firestore
        await addEvent(normalizedEvent);
        successCount++;

        // Update progress
        setProgress(Math.round(((i + 1) / totalCount) * 100));
      } catch (eventError) {
        console.warn(`Error processing event ${i + 1}:`, eventError);
      }
    }

    if (successCount === 0) {
      throw new Error('No valid events found in JSON file');
    }

    setSuccess({
      count: successCount,
      total: totalCount,
      message: `Imported ${successCount} of ${totalCount} events successfully`,
    });

    // Clear success message after 5 seconds
    setTimeout(() => setSuccess(null), 5000);
  };

  return (
    <Paper sx={{ ...surfaceSx, p: 3, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            File Upload
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 0.5 }}>
            Upload CSV or JSON files to import multiple events at once
          </Typography>
        </Box>
        <Box sx={{ width: 40, height: 40, borderRadius: '9999px', display: 'grid', placeItems: 'center', bgcolor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
          <CloudUploadIcon sx={{ fontSize: 20 }} />
        </Box>
      </Box>

      <Typography sx={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', mb: 3 }}>
        Bulk imports are normalized and validated row by row before they reach Firestore.
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

      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box>
          <Button
            variant="contained"
            component="label"
            disabled={loading}
            startIcon={<UploadFileIcon />}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              minHeight: 48,
              px: 2.5,
              '&:hover': { bgcolor: 'var(--color-primary-dark)' },
            }}
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
          <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 1 }}>
            Supported formats: CSV with headers, JSON array, or a single JSON object
          </Typography>
        </Box>

        {loading && progress > 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Importing...</Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-primary)' }}>{progress}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: '9999px', bgcolor: 'var(--color-neutral-plate)', '& .MuiLinearProgress-bar': { borderRadius: '9999px' } }} />
          </Box>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '12px', borderColor: 'var(--color-border)', bgcolor: 'var(--color-row-hover)' }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)', mb: 1 }}>
              CSV Example
            </Typography>
            <Box component="pre" sx={{ m: 0, fontSize: '0.75rem', overflow: 'auto', bgcolor: 'var(--color-surface)', p: 1.5, borderRadius: '10px', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
{`source_ip,dest_ip,event_type,severity,message
192.168.1.100,,failed_login,high,Failed login from suspicious IP
10.0.0.5,10.0.1.20,port_scan,high,Port scan detected
203.0.113.10,,privilege_escalation,critical,Unauthorized sudo access`}
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '12px', borderColor: 'var(--color-border)', bgcolor: 'var(--color-row-hover)' }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)', mb: 1 }}>
              JSON Example
            </Typography>
            <Box component="pre" sx={{ m: 0, fontSize: '0.75rem', overflow: 'auto', bgcolor: 'var(--color-surface)', p: 1.5, borderRadius: '10px', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
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
        </Box>
      </Box>
    </Paper>
  );
}
