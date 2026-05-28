import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { signInWithEmail, signInWithGoogle } from '../firebase/auth';
import { useAuth } from '../hooks/useAuth.jsx';
import { Alert, Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AuthSplitLayout } from '../components/auth/AuthSplitLayout';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/app');
    return null;
  }

  const validate = () => {
    const nextErrors = {};
    if (!email) nextErrors.email = 'Email is required.';
    else if (!emailPattern.test(email)) nextErrors.email = 'Enter a valid email address.';
    if (!password) nextErrors.password = 'Password is required.';
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      navigate('/app');
    } catch (err) {
      if (err.code === 'auth/user-not-found') setError('User not found. Please check your email.');
      else if (err.code === 'auth/wrong-password') setError('Incorrect password. Please try again.');
      else if (err.code === 'auth/invalid-email') setError('Invalid email address.');
      else setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Welcome back"
      subtitle="Pick up right where you left off and get back into your FireWatch workspace in under 60 seconds."
      googleLabel="Continue with Google"
      onGoogle={handleGoogleSignIn}
      onSubmit={handleSubmit}
      submitLabel="Sign In"
      loadingLabel="Signing in..."
      loading={loading}
      switchText="Don't have an account?"
      switchLinkText="Create one"
      switchTo="/signup"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      <Box sx={{ position: 'relative', mb: 2 }}>
        <TextField
          id="login-email"
          type="email"
          label="Email address"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (fieldErrors.email) setFieldErrors((current) => ({ ...current, email: '' }));
          }}
          disabled={loading}
          fullWidth
          required
          autoComplete="email"
          placeholder="you@example.com"
          error={Boolean(fieldErrors.email)}
          helperText={fieldErrors.email || ' '}
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 48,
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#024ad8',
                boxShadow: '0 0 0 3px rgba(2,74,216,0.15)',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
            '& .MuiInputBase-input': { py: 1.5 },
            '& .MuiFormHelperText-root': { mx: 0, mt: 0.75, fontSize: '0.74rem' },
          }}
        />
      </Box>

      <Box sx={{ position: 'relative', mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.8 }}>
          <Box
            component="a"
            href="mailto:support@firewatch.app"
            sx={{ fontSize: '0.82rem', color: '#024ad8', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Forgot password?
          </Box>
        </Box>
        <TextField
          id="login-password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (fieldErrors.password) setFieldErrors((current) => ({ ...current, password: '' }));
          }}
          disabled={loading}
          fullWidth
          required
          autoComplete="current-password"
          placeholder="••••••••"
          error={Boolean(fieldErrors.password)}
          helperText={fieldErrors.password || ' '}
          slotProps={{
            input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((current) => !current)}
                  edge="end"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  sx={{ color: '#6b7280' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
            },
          }}
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 48,
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#024ad8',
                boxShadow: '0 0 0 3px rgba(2,74,216,0.15)',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
            '& .MuiInputBase-input': { py: 1.5 },
            '& .MuiFormHelperText-root': { mx: 0, mt: 0.75, fontSize: '0.74rem' },
          }}
        />
      </Box>
    </AuthSplitLayout>
  );
}