/**
 * Alert Detail Panel Component
 * Displays detailed information about a selected alert and its related events
 */

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getSeverityChartColor, getSeverityLabel } from '../../utils/severityColors';
import { Paper, Typography, Box, Skeleton } from '@mui/material';

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
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">
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
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Alert Details
      </Typography>

      {/* Alert Metadata */}
      <Box sx={{ mb: 4, pb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Rule
          </Typography>
          <Typography sx={{ fontWeight: 600 }}>{alert.rule_name}</Typography>
        </Box>

        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Severity
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                bgcolor: severityColor,
                color: 'common.white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {getSeverityLabel(alert.severity)}
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Source IP
          </Typography>
          <Typography sx={{ fontFamily: 'monospace' }}>{alert.source_ip}</Typography>
        </Box>

        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Triggered At
          </Typography>
          <Typography>{format(alertTime, 'MMM dd, yyyy HH:mm:ss')}</Typography>
        </Box>

        {alert.related_ids && alert.related_ids.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Related Events
            </Typography>
            <Typography>{alert.related_ids.length} event(s)</Typography>
          </Box>
        )}
      </Box>

      {/* Related Events */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Related Events
        </Typography>

        {eventsLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} variant="rounded" height={48} />
            ))}
          </Box>
        ) : relatedEvents.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 256, overflowY: 'auto' }}>
            {relatedEvents.map((event) => {
              const eventTime = event.timestamp?.toDate?.()
                ? event.timestamp.toDate()
                : new Date(event.timestamp);
              const eventSeverityColor = getSeverityChartColor(event.severity);

              return (
                <Paper key={event.id} sx={{ p: 2, bgcolor: 'grey.800' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {format(eventTime, 'HH:mm:ss')}
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: eventSeverityColor,
                        color: 'common.white',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                      }}
                    >
                      {event.severity.toUpperCase()}
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    <Box component="span" color="text.secondary">Type:</Box> {event.event_type.replace(/_/g, ' ')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    <Box component="span" color="text.secondary">IP:</Box> {event.source_ip}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" noWrap>
                    {event.message}
                  </Typography>
                </Paper>
              );
            })}
          </Box>
        ) : (
          <Typography color="text.secondary" variant="body2">
            No related events found
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
