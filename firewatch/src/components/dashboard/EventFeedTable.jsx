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
  CircularProgress,
  Box,
} from '@mui/material';
import { pastelPills, surfaceSx } from './dashboardStyles';

const getSeverityColor = (severity) => {
  const colors = {
    critical: pastelPills.critical,
    high: pastelPills.high,
    medium: pastelPills.medium,
    low: pastelPills.low,
    info: pastelPills.info,
  };
  return colors[severity?.toLowerCase()] || colors.info;
};

export function EventFeedTable({ events = [], loading = false }) {
  if (loading) {
    return (
      <Paper sx={{ ...surfaceSx, p: 3 }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
          Live Event Feed
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mb: 2 }}>
          Latest security logs, sorted by recency
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  const displayEvents = events.slice(0, 50);

  return (
    <Paper sx={{ ...surfaceSx, overflow: 'hidden' }}>
      <TableContainer>
        <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: 'var(--color-neutral-plate)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border)', py: 1.5 }}>Time</TableCell>
              <TableCell sx={{ bgcolor: 'var(--color-neutral-plate)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border)', py: 1.5 }}>Source IP</TableCell>
              <TableCell sx={{ bgcolor: 'var(--color-neutral-plate)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border)', py: 1.5 }}>Type</TableCell>
              <TableCell sx={{ bgcolor: 'var(--color-neutral-plate)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border)', py: 1.5 }}>Severity</TableCell>
              <TableCell sx={{ bgcolor: 'var(--color-neutral-plate)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border)', py: 1.5 }}>Message</TableCell>
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
                  <TableRow
                    key={event.id}
                    hover
                    sx={{
                      '&:hover > td': { backgroundColor: 'var(--color-row-hover)' },
                      '& > td': {
                        minHeight: 48,
                        borderBottom: '1px solid var(--color-border)',
                        py: 1.5,
                        px: 2,
                        color: 'var(--color-text-primary)',
                      },
                    }}
                  >
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8125rem', fontFamily: 'JetBrains Mono, Fira Code, monospace' }}>{format(eventTime, 'HH:mm:ss')}</TableCell>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, Fira Code, monospace', fontSize: '0.8125rem' }}>{event.source_ip}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{event.event_type.replace(/_/g, ' ')}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          px: 1.25,
                          py: 0.5,
                          borderRadius: '9999px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                          bgcolor: severityStyle.bg,
                          color: severityStyle.fg,
                        }}
                      >
                        {event.severity?.toUpperCase()}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                      {event.message}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5, color: 'var(--color-text-muted)' }}>
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