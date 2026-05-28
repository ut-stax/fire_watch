import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getSeverityChartColor, getSeverityLabel } from '../../utils/severityColors';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton, Alert, Box } from '@mui/material';
import { surfaceSx, pastelPills } from '../dashboard/dashboardStyles';

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
      <Paper sx={{ ...surfaceSx, p: 3 }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          Alert History
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 0.5, mb: 2 }}>
          Previously acknowledged alerts
        </Typography>
        <TableContainer>
          <Table size="small" sx={{ minWidth: 720 }}>
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
    <Paper sx={{ ...surfaceSx, overflow: 'hidden' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid var(--color-border)' }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Alert History</Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 0.5 }}>
          {alerts.length} acknowledged alert(s)
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ m: 2, borderRadius: '12px' }}>
          Error loading history: {error}
        </Alert>
      )}

      {alerts.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography sx={{ color: 'var(--color-text-muted)' }}>No acknowledged alerts yet</Typography>
        </Box>
      ) : (
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 720, '& .MuiTableCell-root': { borderBottomColor: 'var(--color-border)' } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'var(--color-neutral-plate)', color: 'var(--color-text-primary)' }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'var(--color-neutral-plate)', color: 'var(--color-text-primary)' }}>Rule</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'var(--color-neutral-plate)', color: 'var(--color-text-primary)' }}>Severity</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'var(--color-neutral-plate)', color: 'var(--color-text-primary)' }}>Source IP</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map((alert) => {
                const alertTime = alert.triggered_at?.toDate?.()
                  ? alert.triggered_at.toDate()
                  : new Date(alert.triggered_at);
                const severityColor = getSeverityChartColor(alert.severity);
                const severityToken = pastelPills?.[alert.severity?.toLowerCase()] || { bg: severityColor, fg: 'white' };

                return (
                  <TableRow key={alert.id} hover sx={{ '&:hover > td': { backgroundColor: 'var(--color-row-hover)' } }}>
                    <TableCell sx={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap', fontFamily: 'JetBrains Mono, monospace' }}>
                      {format(alertTime, 'MMM dd, HH:mm:ss')}
                    </TableCell>
                    <TableCell sx={{ color: 'var(--color-text-primary)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {alert.rule_name}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          bgcolor: severityToken.bg,
                          color: severityToken.fg,
                          px: 1,
                          py: 0.25,
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          display: 'inline-block',
                        }}
                      >
                        {getSeverityLabel(alert.severity)}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'var(--color-text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
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