/**
 * Event Feed Table Component
 * Displays recent events in a table format with severity badges
 */

import { format } from 'date-fns';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  CircularProgress,
  Box,
} from '@mui/material';

const getSeverityColor = (severity) => {
  const colors = {
    critical: { bg: 'error.main', color: 'error.contrastText' },
    high: { bg: 'warning.main', color: 'warning.contrastText' },
    medium: { bg: 'info.main', color: 'info.contrastText' },
    low: { bg: 'primary.main', color: 'primary.contrastText' },
    info: { bg: 'grey.500', color: 'common.white' },
  };
  return colors[severity?.toLowerCase()] || colors.info;
};

export function EventFeedTable({ events = [], loading = false }) {
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Live Event Feed
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  const displayEvents = events.slice(0, 50);

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Source IP</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayEvents.length > 0 ? (
              displayEvents.map((event) => {
                const severityStyle = getSeverityColor(event.severity);
                const eventTime = event.timestamp?.toDate?.()
                  ? event.timestamp.toDate()
                  : new Date(event.timestamp);

                return (
                  <TableRow key={event.id} hover>
                    <TableCell>{format(eventTime, 'HH:mm:ss')}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {event.source_ip}
                    </TableCell>
                    <TableCell>{event.event_type.replace(/_/g, ' ')}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: 12,
                          fontWeight: 600,
                          bgcolor: severityStyle.bg,
                          color: severityStyle.color,
                        }}
                      >
                        {event.severity?.toUpperCase()}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }} noWrap>
                      {event.message}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No events yet. Generate some to see them appear here.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}