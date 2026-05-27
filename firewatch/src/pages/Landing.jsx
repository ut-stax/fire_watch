import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper } from '@mui/material';

export default function Landing() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 4 }}>
      <Container maxWidth="lg">
        <Paper sx={{ position: 'relative', borderRadius: 4, p: { xs: 4, md: 8 }, display: 'flex', gap: 4, alignItems: 'center', bgcolor: 'background.paper', overflow: 'visible' }}>
          <Box sx={{ position: 'absolute', left: -40, top: 24, display: { xs: 'none', md: 'block' } }}>
            <img src="/assets/chevron-left.svg" alt="" style={{ height: 180 }} />
          </Box>
          <Box sx={{ position: 'absolute', right: -40, bottom: 24, display: { xs: 'none', md: 'block' } }}>
            <img src="/assets/chevron-right.svg" alt="" style={{ height: 180 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h2" component="h1" fontWeight={700} gutterBottom>
              FireWatch — Fast, focused security monitoring
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Ingest logs, detect threats, and respond with confidence — built for engineers and analysts.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button component={RouterLink} to="/login" variant="contained" size="large">
                Sign in
              </Button>
              <Button component={RouterLink} to="/signup" variant="outlined" size="large">
                Create account
              </Button>
            </Box>
          </Box>

          <Box sx={{ width: 420, display: { xs: 'none', md: 'block' } }}>
            <img src="/assets/illustration-analytics.svg" alt="analytics illustration" style={{ width: '100%', borderRadius: 12 }} />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
