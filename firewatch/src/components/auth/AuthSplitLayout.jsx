import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
  Typography,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import GoogleIcon from '@mui/icons-material/Google';
import heroImage from '../../assets/hero.png';

export function AuthSplitLayout({
  title,
  subtitle,
  googleLabel,
  onGoogle,
  onSubmit,
  submitLabel,
  loadingLabel,
  loading,
  switchText,
  switchLinkText,
  switchTo,
  marketingOptIn,
  onMarketingChange,
  children,
}) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        bgcolor: '#ffffff',
      }}
    >
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: '#ffffff',
          px: { xs: 3, sm: 5, md: 8 },
          pt: { xs: 3, sm: 4 },
          pb: { xs: 3, sm: 4 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, alignSelf: 'flex-start', minHeight: 40 }} aria-label="FireWatch brand">
          <Avatar sx={{ width: 34, height: 34, bgcolor: '#024ad8' }}>
            <SecurityIcon sx={{ fontSize: 20 }} />
          </Avatar>
          <Typography sx={{ fontWeight: 800, letterSpacing: 0.2, lineHeight: 1 }}>FireWatch</Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: { xs: 4, md: 6 } }}>
          <Box sx={{ width: '100%', maxWidth: 440, mx: 'auto' }}>
            <Typography
              component="h1"
              sx={{
                fontSize: 'clamp(1.8rem, 3vw, 2rem)',
                fontWeight: 800,
                lineHeight: 1.18,
                mb: 1,
                color: '#111827',
              }}
            >
              {title}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#6b7280', mb: 3.5, lineHeight: 1.6 }}>{subtitle}</Typography>

            <Button
              onClick={onGoogle}
              disabled={loading}
              fullWidth
              type="button"
              startIcon={<GoogleIcon />}
              sx={{
                minHeight: 50,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                color: '#111827',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                },
              }}
            >
              {googleLabel}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, my: 2.4 }}>
              <Box sx={{ flex: 1, height: 1, backgroundColor: 'rgba(209,213,219,0.4)' }} />
              <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 500 }}>or continue with email</Typography>
              <Box sx={{ flex: 1, height: 1, backgroundColor: 'rgba(209,213,219,0.4)' }} />
            </Box>

            <Box component="form" onSubmit={onSubmit} noValidate>
              {children}

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  minHeight: 50,
                  mt: 1.8,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 700,
                  color: '#ffffff',
                  backgroundColor: '#024ad8',
                  transition: 'filter 0.18s ease, transform 0.1s ease',
                  '&:hover': {
                    filter: 'brightness(1.08)',
                    backgroundColor: '#024ad8',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={18} sx={{ color: '#ffffff' }} />
                    <Box component="span">{loadingLabel}</Box>
                  </Box>
                ) : (
                  submitLabel
                )}
              </Button>
            </Box>

            <Typography sx={{ mt: 1.8, textAlign: 'center', fontSize: '0.86rem', color: '#6b7280' }}>
              {switchText}{' '}
              <Box
                component={RouterLink}
                to={switchTo}
                sx={{
                  color: '#024ad8',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {switchLinkText}
              </Box>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%', maxWidth: 440, mx: 'auto' }}>
          {typeof marketingOptIn === 'boolean' && (
            <FormControlLabel
              sx={{ mb: 0.5 }}
              control={
                <Checkbox
                  checked={marketingOptIn}
                  onChange={(event) => onMarketingChange?.(event.target.checked)}
                  size="small"
                  sx={{ color: '#9ca3af' }}
                />
              }
              label={<Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>Send me product updates and security tips by email</Typography>}
            />
          )}

          <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', lineHeight: 1.55 }}>
            By continuing, you agree to our{' '}
            <Box
              component="a"
              href="/terms"
              sx={{
                color: '#6b7280',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Terms of Service
            </Box>{' '}
            and{' '}
            <Box
              component="a"
              href="/privacy"
              sx={{
                color: '#6b7280',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Privacy Policy
            </Box>
            .
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          minHeight: '100vh',
          background: 'linear-gradient(160deg, #0f172a 0%, #111827 55%, #1f2937 100%)',
          p: { md: 5, lg: 7 },
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(41,110,249,0.34) 0%, rgba(41,110,249,0) 70%)',
          }}
        />

        <Paper
          elevation={0}
          sx={{
            width: 'min(100%, 620px)',
            borderRadius: '18px',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'linear-gradient(180deg, rgba(17,24,39,0.92) 0%, rgba(17,24,39,0.8) 100%)',
            p: 2.2,
            boxShadow: '0 30px 80px rgba(2,12,27,0.45)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Box sx={{ display: 'grid', gap: 1.4 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.2 }}>
              <Paper elevation={0} sx={{ p: 1.4, borderRadius: '10px', bgcolor: 'rgba(2,74,216,0.16)' }}>
                <Typography sx={{ color: '#93c5fd', fontSize: '0.72rem' }}>Correlated Alerts</Typography>
                <Typography sx={{ color: '#ffffff', fontWeight: 800, mt: 0.3 }}>124</Typography>
              </Paper>
              <Paper elevation={0} sx={{ p: 1.4, borderRadius: '10px', bgcolor: 'rgba(34,197,94,0.16)' }}>
                <Typography sx={{ color: '#86efac', fontSize: '0.72rem' }}>Mean Response</Typography>
                <Typography sx={{ color: '#ffffff', fontWeight: 800, mt: 0.3 }}>-47%</Typography>
              </Paper>
            </Box>

            <Box
              component="img"
              src={heroImage}
              alt="FireWatch dashboard preview"
              loading="lazy"
              sx={{
                width: '100%',
                borderRadius: '12px',
                border: '1px solid rgba(148,163,184,0.3)',
                backgroundColor: '#0b1220',
              }}
            />

            <Typography sx={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
              "Teams using FireWatch close incidents 2x faster by keeping ingestion, context, and triage in one workspace."
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
