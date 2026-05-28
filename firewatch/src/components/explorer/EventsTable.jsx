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
import { surfaceSx } from '../dashboard/dashboardStyles';

function SortIcon({ columnKey, sortKey, sortDirection }) {
  if (sortKey !== columnKey) {
    return <UnfoldMoreIcon sx={{ fontSize: 16, opacity: 0.3 }} />;
  }

  return sortDirection === 'asc' ? (
    <ArrowUpwardIcon sx={{ fontSize: 16 }} />
  ) : (
    <ArrowDownwardIcon sx={{ fontSize: 16 }} />
  );
}

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

  const handleIPClick = (ip) => {
    if (onIPClick) {
      onIPClick(ip);
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Paper sx={{ ...surfaceSx, overflow: 'hidden' }}>
      <Box sx={{ px: { xs: 2, sm: 2.5 }, pt: 2.5, pb: 1 }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          Event Results
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', mt: 0.5 }}>
          Sort any column or click an IP address to pivot the explorer
        </Typography>
      </Box>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 980, '& .MuiTableCell-root': { borderBottomColor: 'var(--color-border)' } }}>
          <TableHead>
            <TableRow>
              <TableCell 
                onClick={() => handleSort('timestamp')}
                sx={{ cursor: 'pointer', fontWeight: 700, bgcolor: 'var(--color-neutral-plate)', color: 'var(--color-text-primary)', position: 'sticky', top: 0, zIndex: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Time <SortIcon columnKey="timestamp" sortKey={sortConfig.key} sortDirection={sortConfig.direction} />
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => handleSort('source_ip')}
                sx={{ cursor: 'pointer', fontWeight: 700, bgcolor: 'var(--color-neutral-plate)', color: 'var(--color-text-primary)', position: 'sticky', top: 0, zIndex: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Source IP <SortIcon columnKey="source_ip" sortKey={sortConfig.key} sortDirection={sortConfig.direction} />
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'var(--color-neutral-plate)', color: 'var(--color-text-primary)', position: 'sticky', top: 0, zIndex: 1 }}>Dest IP</TableCell>
              <TableCell 
                onClick={() => handleSort('event_type')}
                sx={{ cursor: 'pointer', fontWeight: 700, bgcolor: 'var(--color-neutral-plate)', color: 'var(--color-text-primary)', position: 'sticky', top: 0, zIndex: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Type <SortIcon columnKey="event_type" sortKey={sortConfig.key} sortDirection={sortConfig.direction} />
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => handleSort('severity')}
                sx={{ cursor: 'pointer', fontWeight: 700, bgcolor: 'var(--color-neutral-plate)', color: 'var(--color-text-primary)', position: 'sticky', top: 0, zIndex: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Severity <SortIcon columnKey="severity" sortKey={sortConfig.key} sortDirection={sortConfig.direction} />
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'var(--color-neutral-plate)', color: 'var(--color-text-primary)', position: 'sticky', top: 0, zIndex: 1 }}>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography sx={{ color: 'var(--color-text-muted)' }}>
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
                  <TableRow
                    key={event.id}
                    hover
                    sx={{
                      '&:hover > td': { backgroundColor: 'var(--color-row-hover)' },
                      '& > td': { py: 1.5, px: 2, color: 'var(--color-text-primary)' },
                    }}
                  >
                    <TableCell sx={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap', fontFamily: 'JetBrains Mono, monospace' }}>
                      {format(eventTime, 'MMM dd, HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <Box
                        component="button"
                        onClick={() => handleIPClick(event.source_ip)}
                        sx={{
                          color: 'var(--color-primary)',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          '&:hover': { color: 'var(--color-primary-dark)' },
                          p: 0,
                          border: 'none',
                          background: 'none',
                        }}
                      >
                        {event.source_ip}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'var(--color-text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
                      {event.dest_ip || '-'}
                    </TableCell>
                    <TableCell sx={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'capitalize' }}>
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
                    <TableCell sx={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                      <Box sx={{ maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
          labelDisplayedRows={() => `Page ${currentPage + 1} of ${totalPages}`}
          sx={{ borderTop: '1px solid var(--color-border)', bgcolor: 'var(--color-neutral-plate)' }}
        />
      )}
    </Paper>
  );
}
