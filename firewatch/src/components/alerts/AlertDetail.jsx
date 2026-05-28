import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getSeverityChartColor, getSeverityLabel } from '../../utils/severityColors';
import { Paper, Typography, Box, Skeleton } from '@mui/material';
import { surfaceSx, pastelPills } from '../dashboard/dashboardStyles';

export function AlertDetail({ alert = null }) {
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Fetch related events when alert changes
  useEffect(() => {
    if (!alert || !alert.related_ids || alert.related_ids.length === 0) {
      return;
    }

    const fetchRelatedEvents = async () => {
      setEventsLoading(true);
      try {
        const events = [];
        for (const eventId of alert.related_ids) {
          try {
            const eventRef = doc(db, 'events', eventId);
            const eventSnap = await getDoc(eventRef);
            if (eventSnap.exists()) {
              events.push({
                id: eventSnap.id,
                ...eventSnap.data(),
              });
            }
          } catch (err) {
            console.error(`Error fetching event \${eventId}:`, err);
          }
        }
        setRelatedEvents(events);
      } catch (error) {
        console.error('Error fetching related events:', error);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchRelatedEvents();
  }, [alert]);

  if (!alert) {
    return (
      <Paper sx={{ ...surfaceSx, p: 6, textAlign: 'center', minHeight: 360, display: 'grid', placeItems: 'center' }}>
        <Typography sx={{ color: 'var(--color-text-muted)' }}>
          Select an alert to view details
        </Typography>
      </Paper>
    );
  }

  const severityColor = getSeverityChartColor(alert.severity);
  const alertTime = alert.triggered_at?.toDate?.()
    ? alert.triggered_at.toDate()
    : new Date(alert.triggered_at);

  return (
    <Paper sx={{ ...surfaceSx, p: 3, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Alert Details
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 0.5 }}>
            Investigation context for the selected alert
          </Typography>
        </Box>
        <Box sx={{ px: 1.25, py: 0.5, borderRadius: '9999px', bgcolor: 'var(--color-neutral-plate)', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
          {alert.acknowledged ? 'Acknowledged' : 'Open'}
        </Box>
      </Box>

      {/* Alert Metadata */}
      <Box sx={{ mb: 3.5, pb: 3, borderBottom: '1px solid var(--color-border)' }}>
        <Box sx={{ mb: 2.25 }}>
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Rule
          </Typography>
          <Typography sx={{ fontWeight: 700, color: 'var(--color-text-primary)', wordBreak: 'break-word' }}>{alert.rule_name}</Typography>
        </Box>

        <Box sx={{ mb: 2.25 }}>
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Severity
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                bgcolor: pastelPills?.[alert.severity?.toLowerCase()]?.bg || severityColor,
                color: 'common.white',
                px: 1,
                py: 0.5,
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {getSeverityLabel(alert.severity)}
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 2.25 }}>
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Source IP
          </Typography>
          <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--color-text-primary)' }}>{alert.source_ip}</Typography>
        </Box>

        <Box sx={{ mb: 2.25 }}>
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Triggered At
          </Typography>
          <Typography sx={{ color: 'var(--color-text-primary)' }}>{format(alertTime, 'MMM dd, yyyy HH:mm:ss')}</Typography>
        </Box>

        {alert.related_ids && alert.related_ids.length > 0 && (
          <Box>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Related Events
            </Typography>
            <Typography sx={{ color: 'var(--color-text-primary)' }}>{alert.related_ids.length} event(s)</Typography>
          </Box>
        )}
      </Box>

      {/* Related Events */}
      <Box>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', mb: 0.75 }}>
          Related Events
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mb: 2 }}>
          Events tied to the selected alert rule
        </Typography>

        {eventsLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} variant="rounded" height={48} />
            ))}
          </Box>
        ) : relatedEvents.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, maxHeight: 320, overflowY: 'auto', pr: 0.5 }}>
            {relatedEvents.map((event) => {
              const eventTime = event.timestamp?.toDate?.()
                ? event.timestamp.toDate()
                : new Date(event.timestamp);
              const eventSeverityColor = getSeverityChartColor(event.severity);

              const eventSeverityToken = pastelPills?.[event.severity?.toLowerCase()] || { bg: eventSeverityColor, fg: 'white' };

              return (
                <Paper key={event.id} sx={{ ...surfaceSx, p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 1 }}>
                    <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {format(eventTime, 'HH:mm:ss')}
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: eventSeverityToken.bg,
                        color: eventSeverityToken.fg,
                        px: 1,
                        py: 0.25,
                        borderRadius: '9999px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                      }}
                    >
                      {event.severity.toUpperCase()}
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mb: 0.5 }}>
                    Type: <Box component="span" sx={{ color: 'var(--color-text-primary)' }}>{event.event_type.replace(/_/g, ' ')}</Box>
                  </Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mb: 0.5 }}>
                    IP: <Box component="span" sx={{ color: 'var(--color-text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{event.source_ip}</Box>
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }} noWrap>
                    {event.message}
                  </Typography>
                </Paper>
              );
            })}
          </Box>
        ) : (
          <Typography sx={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            No related events found
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
