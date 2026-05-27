import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpWithEmail } from '../firebase/auth';
import { useAuth } from '../hooks/useAuth.jsx';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Container,
} from '@mui/material';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/app');
    return null;
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
              Create your FireWatch account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start monitoring logs and alerts in seconds.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSignup}>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              fullWidth
              margin="normal"
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              fullWidth
              margin="normal"
              required
              autoComplete="new-password"
              placeholder="Choose a strong password"
            />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ mt: 2, py: 1.5 }}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
