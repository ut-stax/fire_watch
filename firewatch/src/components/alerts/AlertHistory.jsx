/**
 * Alert History Component
 * Displays previously acknowledged alerts in a table format
 */

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getSeverityChartColor, getSeverityLabel } from '../../utils/severityColors';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton, Alert, Box } from '@mui/material';

export function AlertHistory({ timeRange }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query with time range filters
        const constraints = [
          where('acknowledged', '==', true),
          orderBy('triggered_at', 'desc'),
        ];

        if (timeRange?.from) {
          constraints.push(where('triggered_at', '>=', timeRange.from));
        }
        if (timeRange?.to) {
          constraints.push(where('triggered_at', '<=', timeRange.to));
        }

        const alertsQuery = query(collection(db, 'alerts'), ...constraints);
        const snapshot = await getDocs(alertsQuery);
        const alertsList = [];

        snapshot.forEach((doc) => {
          alertsList.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setAlerts(alertsList);
      } catch (err) {
        console.error('Error fetching alert history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [timeRange]);

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Alert History
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}><Skeleton variant="text" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Alert History</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {alerts.length} acknowledged alert(s)
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          Error loading history: {error}
        </Alert>
      )}

      {alerts.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No acknowledged alerts yet</Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rule</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Severity</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Source IP</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map((alert) => {
                const alertTime = alert.triggered_at?.toDate?.()
                  ? alert.triggered_at.toDate()
                  : new Date(alert.triggered_at);
                const severityColor = getSeverityChartColor(alert.severity);

                return (
                  <TableRow key={alert.id} hover>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                      {format(alertTime, 'MMM dd, HH:mm:ss')}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {alert.rule_name}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          bgcolor: severityColor,
                          color: 'common.white',
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          display: 'inline-block',
                        }}
                      >
                        {getSeverityLabel(alert.severity)}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {alert.source_ip}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}