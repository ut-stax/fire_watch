import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signUpWithEmail } from '../firebase/auth';
import { useAuth } from '../hooks/useAuth.jsx';
import { Alert, Box, IconButton, InputAdornment, TextField } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AuthSplitLayout } from '../components/auth/AuthSplitLayout';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [marketingOptIn, setMarketingOptIn] = useState(false);
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
    else if (password.length < 8) nextErrors.password = 'Use at least 8 characters.';
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleGoogle = async () => {
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
      await signUpWithEmail(email, password);
      navigate('/app');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('An account already exists for that email.');
      else if (err.code === 'auth/invalid-email') setError('Invalid email address.');
      else if (err.code === 'auth/weak-password') setError('Password is too weak.');
      else setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Create your account"
      subtitle="Get up and running in under 60 seconds and start monitoring sooner."
      googleLabel="Continue with Google"
      onGoogle={handleGoogle}
      onSubmit={handleSubmit}
      submitLabel="Create Account"
      loadingLabel="Creating account..."
      loading={loading}
      switchText="Already have an account?"
      switchLinkText="Sign in"
      switchTo="/login"
      marketingOptIn={marketingOptIn}
      onMarketingChange={setMarketingOptIn}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      <Box sx={{ position: 'relative', mb: 2 }}>
        <TextField
          id="signup-email"
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
        <TextField
          id="signup-password"
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
          autoComplete="new-password"
          placeholder="Choose a strong password"
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
