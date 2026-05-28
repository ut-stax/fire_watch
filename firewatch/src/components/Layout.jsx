import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useEvents } from '../hooks/useEvents.jsx';
import { signOut } from '../firebase/auth';
import {
  Avatar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';

const desktopSidebarWidth = 260;
const compactSidebarWidth = 64;

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isCompact = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const [profileAnchor, setProfileAnchor] = useState(null);

  useEvents(200);

  const navItems = useMemo(
    () => [
      { text: 'Dashboard', icon: DashboardIcon, path: '/app' },
      { text: 'Log Explorer', icon: SearchIcon, path: '/app/logs' },
      { text: 'Alerts', icon: WarningIcon, path: '/app/alerts' },
      { text: 'Log Ingestion', icon: UploadFileIcon, path: '/app/ingest' },
    ],
    []
  );

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileOpen = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/') {
    return children;
  }

  const sidebarWidth = isCompact ? compactSidebarWidth : desktopSidebarWidth;
  const activeIndex = Math.max(0, navItems.findIndex((item) => isActive(item.path)));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--color-canvas)', color: 'var(--color-text-primary)' }}>
      {!isMobile && (
        <Box
          component="aside"
          sx={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            width: sidebarWidth,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'var(--color-sidebar-bg)',
            borderRight: '1px solid var(--color-border)',
            transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            zIndex: 30,
          }}
        >
          <Box sx={{ px: isCompact ? 1.5 : 2.25, pt: 2.5, pb: 1.5 }}>
            <StackBrand compact={isCompact} />
          </Box>

          <List sx={{ px: 1, pt: 1, flexGrow: 1 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <Tooltip title={isCompact ? item.text : ''} placement="right" arrow disableHoverListener={!isCompact}>
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      selected={active}
                      sx={{
                        minHeight: 44,
                        px: isCompact ? 1.5 : 2,
                        justifyContent: isCompact ? 'center' : 'flex-start',
                        borderRadius: '8px',
                        color: 'var(--color-text-primary)',
                        position: 'relative',
                        '&::before': active
                          ? {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: 6,
                              bottom: 6,
                              width: 3,
                              borderRadius: '9999px',
                              backgroundColor: 'var(--color-primary)',
                            }
                          : { content: 'none' },
                        '&.Mui-selected': {
                          backgroundColor: 'var(--color-neutral-plate)',
                        },
                        '&.Mui-selected:hover, &:hover': {
                          backgroundColor: 'var(--color-row-hover)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: isCompact ? 'auto' : 36, color: active ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                        <Icon fontSize="small" />
                      </ListItemIcon>
                      {!isCompact && <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>

          <Box sx={{ mt: 'auto', px: isCompact ? 1.5 : 2.25, pb: 2.5 }}>
            <Divider sx={{ mb: 2, borderColor: 'var(--color-border)' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isCompact ? 'center' : 'flex-start', gap: 1 }}>
              <Button
                onClick={handleProfileOpen}
                sx={{
                  p: 0,
                  minWidth: 0,
                  borderRadius: '9999px',
                  textTransform: 'none',
                  color: 'var(--color-text-primary)',
                }}
                aria-label="Open account settings"
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                  }}
                >
                  {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'F'}
                </Avatar>
              </Button>
              {!isCompact && (
                <Button
                  onClick={handleLogout}
                  variant="text"
                  startIcon={<LogoutIcon fontSize="small" />}
                  sx={{
                    minHeight: 28,
                    px: 0,
                    color: 'var(--color-text-muted)',
                    textTransform: 'none',
                    fontWeight: 500,
                    justifyContent: 'flex-start',
                    '&:hover': { color: 'var(--color-text-primary)', backgroundColor: 'transparent' },
                  }}
                >
                  Log out
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      )}

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slotProps={{ paper: { sx: { borderRadius: '12px', border: '1px solid var(--color-border)', mt: 1 } } }}
      >
        <MenuItem disabled sx={{ opacity: 1 }}>
          <Box>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Account
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {user?.email || user?.displayName || 'FireWatch user'}
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfileClose}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          Account settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          Log out
        </MenuItem>
      </Menu>

      {isMobile && (
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40,
            borderTop: '1px solid var(--color-border)',
            bgcolor: 'var(--color-header-blur-bg)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <BottomNavigation
            value={activeIndex}
            showLabels
            sx={{
              backgroundColor: 'transparent',
              height: 64,
              '& .MuiBottomNavigationAction-root': {
                minWidth: 0,
                color: 'var(--color-text-muted)',
                fontSize: '0.6875rem',
              },
              '& .Mui-selected': {
                color: 'var(--color-primary) !important',
              },
            }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <BottomNavigationAction
                  key={item.text}
                  component={Link}
                  to={item.path}
                  label={item.text}
                  icon={<Icon fontSize="small" />}
                />
              );
            })}
          </BottomNavigation>
        </Paper>
      )}

      <Box
        component="main"
        sx={{
          ml: { xs: 0, sm: `${compactSidebarWidth}px`, lg: `${desktopSidebarWidth}px` },
          display: 'flex',
          justifyContent: 'center',
          minHeight: '100vh',
          pt: 3,
          pb: { xs: 10, sm: 3 },
          px: { xs: 2, sm: 3, lg: 4 },
          minWidth: 0,
          overflowX: 'hidden',
          transition: 'margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '1040px', mx: 'auto', minWidth: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

function StackBrand({ compact }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minHeight: 40, justifyContent: compact ? 'center' : 'flex-start' }}>
      <Avatar sx={{ width: 34, height: 34, bgcolor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
        <SecurityIcon sx={{ fontSize: 20 }} />
      </Avatar>
      {!compact && (
        <Box>
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, lineHeight: 1, color: 'var(--color-text-primary)' }}>
            FireWatch
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', mt: 0.5 }}>
            Security Operations
          </Typography>
        </Box>
      )}
    </Box>
  );
}
