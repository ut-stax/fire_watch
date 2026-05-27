import { createTheme } from '@mui/material/styles';

const designTokens = {
  colors: {
    primary: '#024ad8',
    primaryBright: '#296ef9',
    primaryDeep: '#0e3191',
    primarySoft: '#c9e0fc',
    onPrimary: '#ffffff',
    ink: '#1a1a1a',
    inkDeep: '#000000',
    canvas: '#ffffff',
    cloud: '#f7f7f7',
    fog: '#e8e8e8',
    steel: '#c2c2c2',
    error: '#b3262b',
  },
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: designTokens.colors.primary,
      light: designTokens.colors.primaryBright,
      dark: designTokens.colors.primaryDeep,
      contrastText: designTokens.colors.onPrimary,
    },
    background: {
      default: designTokens.colors.canvas,
      paper: designTokens.colors.canvas,
    },
    text: {
      primary: designTokens.colors.ink,
    },
    error: { main: designTokens.colors.error },
  },
  typography: {
    fontFamily: "Manrope, Arial, sans-serif",
    h1: {
      fontSize: '4.5rem',
      fontWeight: 500,
      lineHeight: 1,
    },
    h2: {
      fontSize: '3.5rem',
      fontWeight: 500,
      lineHeight: 1,
    },
    h3: {
      fontSize: '2.75rem',
      fontWeight: 500,
      lineHeight: 1,
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1,
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
      textTransform: 'uppercase',
      fontWeight: 600,
      letterSpacing: '0.7px',
    },
  },
  shape: {
    borderRadius: 4, // default for buttons/inputs
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
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
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(26,26,26,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export { designTokens };
export default theme;