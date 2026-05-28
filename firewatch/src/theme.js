import { createTheme } from '@mui/material/styles';

const designTokens = {
  colors: {
    primary: '#2563eb',
    primaryDeep: '#1d4ed8',
    primarySoft: '#dbeafe',
    onPrimary: '#ffffff',
    ink: '#18181b',
    canvas: '#ffffff',
    surface: '#ffffff',
    border: '#e4e4e7',
    muted: '#71717a',
    error: '#991b1b',
  },
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: designTokens.colors.primary,
      dark: designTokens.colors.primaryDeep,
      contrastText: designTokens.colors.onPrimary,
    },
    background: {
      default: designTokens.colors.canvas,
      paper: designTokens.colors.surface,
    },
    text: {
      primary: designTokens.colors.ink,
      secondary: designTokens.colors.muted,
    },
    error: { main: designTokens.colors.error },
  },
  typography: {
    fontFamily: "Inter, Geist Sans, Plus Jakarta Sans, Arial, sans-serif",
    h1: {
      fontSize: '4.5rem',
      fontWeight: 700,
      lineHeight: 1.02,
    },
    h2: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.04,
    },
    h3: {
      fontSize: '2.75rem',
      fontWeight: 700,
      lineHeight: 1.05,
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.08,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        containedPrimary: {
          backgroundColor: designTokens.colors.primary,
          color: designTokens.colors.onPrimary,
          '&:hover': {
            backgroundColor: designTokens.colors.primaryDeep,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
        },
      },
    },
  },
});

export { designTokens };
export default theme;