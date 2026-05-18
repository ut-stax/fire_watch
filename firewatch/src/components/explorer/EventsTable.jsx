/**
 * Events Table Component
 * Paginated table with sortable columns and clickable IP pivot
 */

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import { getSeverityChartColor, getSeverityLabel } from '../../utils/severityColors';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

export function EventsTable({ events, onIPClick, rowsPerPage = 50 }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (aVal === undefined || aVal === null) aVal = '';
      if (bVal === undefined || bVal === null) bVal = '';

      if (sortConfig.key === 'timestamp' || sortConfig.key === 'triggered_at') {
        const aTime = aVal?.toDate?.() ? aVal.toDate().getTime() : new Date(aVal).getTime();
        const bTime = bVal?.toDate?.() ? bVal.toDate().getTime() : new Date(bVal).getTime();
        return sortConfig.direction === 'asc' ? aTime - bTime : bTime - aTime;
      }

      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [events, sortConfig]);

  const totalPages = Math.ceil(sortedEvents.length / rowsPerPage);

  const paginatedEvents = useMemo(() => {
    const start = currentPage * rowsPerPage;
    return sortedEvents.slice(start, start + rowsPerPage);
  }, [sortedEvents, currentPage, rowsPerPage]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
    setCurrentPage(0);
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <UnfoldMoreIcon sx={{ fontSize: 16, opacity: 0.3 }} />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUpwardIcon sx={{ fontSize: 16 }} /> 
      : <ArrowDownwardIcon sx={{ fontSize: 16 }} />;
  };

  const handleIPClick = (ip) => {
    if (onIPClick) {
      onIPClick(ip);
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell 
                onClick={() => handleSort('timestamp')}
                sx={{ cursor: 'pointer', fontWeight: 600 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Time <SortIcon columnKey="timestamp" />
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => handleSort('source_ip')}
                sx={{ cursor: 'pointer', fontWeight: 600 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Source IP <SortIcon columnKey="source_ip" />
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Dest IP</TableCell>
              <TableCell 
                onClick={() => handleSort('event_type')}
                sx={{ cursor: 'pointer', fontWeight: 600 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Type <SortIcon columnKey="event_type" />
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => handleSort('severity')}
                sx={{ cursor: 'pointer', fontWeight: 600 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Severity <SortIcon columnKey="severity" />
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No events match the current filters
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedEvents.map((event) => {
                const eventTime = event.timestamp?.toDate?.()
                  ? event.timestamp.toDate()
                  : new Date(event.timestamp);
                const severityColor = getSeverityChartColor(event.severity);

                return (
                  <TableRow key={event.id} hover>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                      {format(eventTime, 'MMM dd, HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <Box
                        component="button"
                        onClick={() => handleIPClick(event.source_ip)}
                        sx={{
                          color: 'primary.main',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          '&:hover': { color: 'primary.light' },
                          p: 0,
                          border: 'none',
                          background: 'none',
                        }}
                      >
                        {event.source_ip}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {event.dest_ip || '-'}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                      {event.event_type?.replace(/_/g, ' ') || '-'}
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
                        {getSeverityLabel(event.severity)}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                      <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {event.message || '-'}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <TablePagination
          component="div"
          count={sortedEvents.length}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
          labelDisplayedRows={() => `Page \${currentPage + 1} of \${totalPages}`}
          sx={{ borderTop: 1, borderColor: 'divider' }}
        />
      )}
    </Paper>
  );
}
