import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { keyframes } from '@mui/system';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SecurityIcon from '@mui/icons-material/Security';
import BoltIcon from '@mui/icons-material/Bolt';
import HubIcon from '@mui/icons-material/Hub';
import InsightsIcon from '@mui/icons-material/Insights';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';

const PRIMARY_CTA = 'Get Started Free';

const trustLogos = ['Acme Security', 'NorthGrid', 'PulseOps', 'CloudBarrier', 'SentryLake'];

const pains = [
  'Alert storms bury high-risk events under repetitive noise.',
  'Analysts waste cycles rebuilding context across disconnected tools.',
  'Critical decisions slow down when incident timelines are fragmented.',
];

const zPatternRows = [
  {
    title: 'Before FireWatch',
    subtitle: 'Triage takes hours',
    body: 'Signals live in separate tabs, incident history is incomplete, and handoffs create delay.',
    metric: '4.3h average triage',
    reverse: false,
  },
  {
    title: 'With FireWatch',
    subtitle: 'One focused response loop',
    body: 'Ingest, correlate, and close from one workflow so every analyst sees the same truth faster.',
    metric: '2x faster investigations',
    reverse: true,
  },
];

const bentoBlocks = [
  {
    title: 'Unified Event Explorer',
    body: 'Find suspicious behavior in minutes, not tabs, with one searchable timeline.',
    icon: <TravelExploreIcon />,
  },
  {
    title: 'Live Signal Health',
    body: '96.4% signal quality this week.',
    icon: <InsightsIcon />,
  },
  {
    title: 'Alert Correlation',
    body: 'Group related events automatically and cut repetitive triage steps.',
    icon: <HubIcon />,
  },
  {
    title: 'Timeline-first Analysis',
    body: 'Understand blast radius quickly with a clean event sequence from first trigger to closure.',
    icon: <PlaylistAddCheckCircleIcon />,
  },
  {
    title: 'Flexible Ingestion',
    body: 'Start with manual entries or file uploads and scale into stream-friendly pipelines.',
    icon: <BoltIcon />,
  },
];

const demoStates = [
  {
    id: 'detect',
    label: 'Detect',
    headline: 'Spot high-risk patterns fast',
    detail: 'Filter by source, severity, and host in one motion while FireWatch highlights anomaly clusters.',
  },
  {
    id: 'investigate',
    label: 'Investigate',
    headline: 'Reconstruct the timeline instantly',
    detail: 'Open correlated alerts and move through a unified chronology instead of piecing context together manually.',
  },
  {
    id: 'resolve',
    label: 'Resolve',
    headline: 'Close incidents with confidence',
    detail: 'Use role-aware triage workflows to assign, document, and close incidents with a complete audit trail.',
  },
];

const testimonials = [
  {
    name: 'Maya Tran',
    role: 'Security Lead, NorthGrid',
    quote: 'FireWatch reduced our first-response time by 47% and saved us about 12 analyst hours every week.',
    image: 'https://i.pravatar.cc/160?img=47',
  },
  {
    name: 'Jordan Patel',
    role: 'SOC Manager, Acme Security',
    quote: 'Our team now closes priority incidents 2x faster because context is already organized when alerts arrive.',
    image: 'https://i.pravatar.cc/160?img=13',
  },
  {
    name: 'Renee Alvarez',
    role: 'Infrastructure Director, PulseOps',
    quote: 'We cut noisy escalations by 38% in one quarter and finally standardized triage across shifts.',
    image: 'https://i.pravatar.cc/160?img=56',
  },
];

const faqs = [
  {
    q: 'How much does FireWatch cost to start?',
    a: 'You can start with a free account, onboard your first workflow, and scale when your team needs deeper automation.',
  },
  {
    q: 'Can I cancel at any time?',
    a: 'Yes. There are no lock-in contracts for standard plans, and your team can export records before cancellation.',
  },
  {
    q: 'How quickly can we onboard?',
    a: 'Most teams ingest first logs and complete a guided triage flow in under 30 minutes.',
  },
  {
    q: 'Is the platform secure enough for production?',
    a: 'FireWatch supports encrypted ingestion, role-aware workflows, and audit-friendly incident history for production use.',
  },
  {
    q: 'Do I need to sign up to view the product demo?',
    a: 'No. The interactive tour on this page is open so you can validate the experience before creating an account.',
  },
];

const riseIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ticker = keyframes`
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-50%);
  }
`;

export default function Landing() {
  const [demoState, setDemoState] = useState(demoStates[0]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fbff',
        color: '#101828',
        '--fw-primary': '#024ad8',
        '--fw-ink': '#101828',
        '--fw-accent': '#f78332',
        backgroundImage:
          'radial-gradient(circle at 12% -4%, rgba(2,74,216,0.14), transparent 32%), radial-gradient(circle at 84% 14%, rgba(247,131,50,0.14), transparent 30%)',
      }}
    >
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          width: '100vw',
          ml: 'calc(50% - 50vw)',
          height: '64px',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(248,251,255,0.85)',
          borderBottom: '1px solid rgba(16,24,40,0.07)',
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            px: { xs: 2, sm: 3, md: 5, lg: 7 },
            columnGap: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ minHeight: 40, flexShrink: 0, justifySelf: 'start' }}
          >
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'var(--fw-primary)' }}>
              <SecurityIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography sx={{ fontWeight: 800, letterSpacing: 0.2, lineHeight: 1, display: 'flex', alignItems: 'center', height: 34 }}>
              FireWatch
            </Typography>
          </Stack>

          <Button
            component={RouterLink}
            to="/signup"
            variant="contained"
            sx={{
              borderRadius: '10px',
              height: 38,
              minHeight: 38,
              px: { xs: 1.5, sm: 2.1 },
              py: 0,
              whiteSpace: 'nowrap',
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 700,
              lineHeight: 1,
              justifySelf: 'end',
              bgcolor: 'var(--fw-primary)',
              boxShadow: '0 3px 8px rgba(2,74,216,0.14)',
              '&:hover': { bgcolor: '#0e3191' },
            }}
          >
            {PRIMARY_CTA}
          </Button>
        </Box>
      </Box>

      <Box component="main">
        <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 8 }, pb: { xs: 7, md: 11 } }}>
          <Grid container spacing={{ xs: 4.5, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={2.2} sx={{ animation: `${riseIn} 0.7s ease-out both` }}>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: 'clamp(2rem, 6vw, 4rem)',
                    lineHeight: 1.03,
                    fontWeight: 900,
                    maxWidth: 580,
                  }}
                >
                  Resolve incidents faster with less stress.
                </Typography>
                <Typography sx={{ color: 'rgba(16,24,40,0.82)', fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.68, maxWidth: 590 }}>
                  FireWatch unifies ingestion, correlation, and triage so your team can move from noisy logs to confident action.
                  You spend less time hunting context and more time closing the right incidents.
                </Typography>
                <Box>
                  <Button
                    component={RouterLink}
                    to="/signup"
                    variant="contained"
                    size="large"
                    sx={{
                      minHeight: 52,
                      borderRadius: '10px',
                      px: 3.2,
                      bgcolor: 'var(--fw-primary)',
                      '&:hover': { bgcolor: '#0e3191' },
                    }}
                  >
                    {PRIMARY_CTA}
                  </Button>
                  <Typography sx={{ mt: 1.1, color: 'rgba(16,24,40,0.65)', fontSize: '0.92rem' }}>No credit card required</Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '18px',
                  p: { xs: 2, sm: 2.8 },
                  border: '1px solid rgba(16,24,40,0.08)',
                  background: 'linear-gradient(145deg, #ffffff 0%, #eef4ff 100%)',
                  animation: `${riseIn} 0.8s ease-out 0.12s both`,
                  boxShadow: '0 24px 54px rgba(2, 74, 216, 0.16)',
                }}
              >
                <Stack spacing={1.3}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', borderColor: 'rgba(2,74,216,0.26)' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ fontWeight: 800 }}>Live Event Stream</Typography>
                      <Typography sx={{ color: '#027a48', fontWeight: 700, fontSize: '0.78rem' }}>ACTIVE</Typography>
                    </Stack>
                    <Typography sx={{ color: 'rgba(16,24,40,0.74)', mt: 0.7, fontSize: '0.9rem' }}>
                      Source: firewall-gateway-3 | Severity: high | Host: prod-api-us2
                    </Typography>
                  </Paper>
                  <Grid container spacing={1.3}>
                    <Grid item xs={6}>
                      <Paper variant="outlined" sx={{ p: 1.8, borderRadius: '12px', height: '100%' }}>
                        <Typography sx={{ color: '#475467', fontSize: '0.78rem' }}>Correlated alerts</Typography>
                        <Typography sx={{ fontWeight: 800, mt: 0.5 }}>14 grouped</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper variant="outlined" sx={{ p: 1.8, borderRadius: '12px', height: '100%' }}>
                        <Typography sx={{ color: '#475467', fontSize: '0.78rem' }}>Mean response</Typography>
                        <Typography sx={{ fontWeight: 800, mt: 0.5 }}>-47% this month</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
                    alt="FireWatch dashboard interface preview"
                    loading="eager"
                    sx={{
                      width: '100%',
                      borderRadius: '12px',
                      border: '1px solid rgba(16,24,40,0.1)',
                      objectFit: 'cover',
                      aspectRatio: '16 / 9',
                    }}
                  />
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Container maxWidth="lg" sx={{ pb: { xs: 7, md: 10 } }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              p: { xs: 2.2, md: 3 },
              border: '1px solid rgba(16,24,40,0.08)',
              overflow: 'hidden',
              mb: { xs: 6, md: 8 },
            }}
          >
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              {trustLogos.map((logo) => (
                <Typography key={logo} sx={{ opacity: 0.58, fontWeight: 800, letterSpacing: 1.1, color: '#101828' }}>
                  {logo}
                </Typography>
              ))}
            </Box>
            <Box sx={{ display: { xs: 'block', md: 'none' }, whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <Box sx={{ display: 'inline-flex', gap: 4, animation: `${ticker} 18s linear infinite`, pr: 4 }}>
                {[...trustLogos, ...trustLogos].map((logo, idx) => (
                  <Typography key={`${logo}-${idx}`} sx={{ opacity: 0.56, fontWeight: 800, letterSpacing: 0.9 }}>
                    {logo}
                  </Typography>
                ))}
              </Box>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mt: 2.2 }}>
              <Typography sx={{ color: 'var(--fw-accent)', fontSize: '1.2rem', letterSpacing: 2 }}>★★★★★</Typography>
              <Typography sx={{ color: '#344054' }}>Trusted by 10,000+ security teams and incident responders.</Typography>
            </Stack>
          </Paper>

          <Stack spacing={6} sx={{ mb: { xs: 6, md: 9 } }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 'clamp(1.7rem, 4.2vw, 2.8rem)', lineHeight: 1.14, mb: 1.5 }}>
                Alerts keep growing. Analyst time does not.
              </Typography>
              <Stack spacing={1.1}>
                {pains.map((pain) => (
                  <Typography key={pain} sx={{ color: '#344054', fontSize: '1rem', lineHeight: 1.68 }}>
                    • {pain}
                  </Typography>
                ))}
              </Stack>
            </Box>

            {zPatternRows.map((row, idx) => (
              <Grid container spacing={3.2} alignItems="center" key={row.title} sx={{ flexDirection: row.reverse ? { md: 'row-reverse' } : undefined }}>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ color: '#0e3191', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.75rem' }}>
                    {row.title}
                  </Typography>
                  <Typography sx={{ fontSize: 'clamp(1.4rem, 3.4vw, 2.2rem)', lineHeight: 1.2, fontWeight: 800, mt: 1, mb: 1.3 }}>
                    {row.subtitle}
                  </Typography>
                  <Typography sx={{ color: '#344054', lineHeight: 1.67, fontSize: '1rem', mb: 1.6 }}>{row.body}</Typography>
                  <Typography sx={{ color: idx === 0 ? '#b42318' : '#027a48', fontWeight: 800 }}>{row.metric}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: '16px',
                      border: '1px solid rgba(16,24,40,0.1)',
                      p: 2.2,
                      background: idx === 0 ? 'linear-gradient(150deg, #fff5f5 0%, #ffffff 100%)' : 'linear-gradient(150deg, #effaf4 0%, #ffffff 100%)',
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        idx === 0
                          ? 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
                          : 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80'
                      }
                      alt={idx === 0 ? 'Fragmented and noisy security monitoring environment' : 'Focused FireWatch triage workflow interface'}
                      loading="lazy"
                      sx={{ width: '100%', borderRadius: '12px', objectFit: 'cover', aspectRatio: '16 / 9' }}
                    />
                  </Paper>
                </Grid>
              </Grid>
            ))}
          </Stack>

          <Box sx={{ mb: { xs: 6, md: 9 } }}>
            <Typography sx={{ fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', mb: 2.2 }}>
              The outcomes your team feels every day.
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1.35fr 1fr' },
                gridTemplateRows: { md: 'auto auto' },
                gap: 2,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '16px',
                  border: '1px solid rgba(16,24,40,0.1)',
                  gridRow: { md: '1 / 3' },
                  background: 'linear-gradient(160deg, #ffffff 0%, #ecf3ff 100%)',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'rgba(2,74,216,0.15)', color: 'var(--fw-primary)' }}>
                    {bentoBlocks[0].icon}
                  </Avatar>
                  <Typography sx={{ fontWeight: 800 }}>{bentoBlocks[0].title}</Typography>
                </Stack>
                <Typography sx={{ color: '#344054', mt: 1.1, mb: 2 }}>{bentoBlocks[0].body}</Typography>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80"
                  alt="FireWatch unified event explorer screenshot"
                  loading="lazy"
                  sx={{ width: '100%', borderRadius: '12px', objectFit: 'cover', aspectRatio: '16 / 9' }}
                />
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '16px',
                  border: '1px solid rgba(16,24,40,0.1)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #fff3e8 100%)',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'rgba(247,131,50,0.16)', color: 'var(--fw-accent)' }}>
                    {bentoBlocks[1].icon}
                  </Avatar>
                  <Typography sx={{ fontWeight: 800 }}>{bentoBlocks[1].title}</Typography>
                </Stack>
                <Typography sx={{ color: '#344054', mt: 1.2 }}>{bentoBlocks[1].body}</Typography>
              </Paper>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, gridColumn: { md: '1 / 3' } }}>
                {bentoBlocks.slice(2).map((item) => (
                  <Paper key={item.title} elevation={0} sx={{ p: 2.2, borderRadius: '16px', border: '1px solid rgba(16,24,40,0.1)' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 30, height: 30, bgcolor: 'rgba(2,74,216,0.14)', color: 'var(--fw-primary)' }}>{item.icon}</Avatar>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.96rem' }}>{item.title}</Typography>
                    </Stack>
                    <Typography sx={{ color: '#344054', fontSize: '0.93rem', mt: 1 }}>{item.body}</Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Box>

          <Paper elevation={0} sx={{ p: { xs: 2.3, md: 3.2 }, borderRadius: '16px', border: '1px solid rgba(16,24,40,0.1)', mb: { xs: 6, md: 9 } }}>
            <Typography sx={{ fontWeight: 800, fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', mb: 1.2 }}>
              Explore FireWatch in 30 seconds
            </Typography>
            <Typography sx={{ color: '#344054', lineHeight: 1.66, mb: 2.2 }}>
              No signup needed. Click through the workflow and see exactly how your team goes from raw logs to resolved incidents.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              {demoStates.map((state) => (
                <Button
                  key={state.id}
                  variant={demoState.id === state.id ? 'contained' : 'outlined'}
                  onClick={() => setDemoState(state)}
                  sx={{ borderRadius: '999px', minHeight: 42 }}
                >
                  {state.label}
                </Button>
              ))}
            </Stack>
            <Paper elevation={0} sx={{ p: 2.2, borderRadius: '14px', border: '1px solid rgba(2,74,216,0.22)', background: '#f6faff' }}>
              <Typography sx={{ fontWeight: 800 }}>{demoState.headline}</Typography>
              <Typography sx={{ color: '#344054', mt: 1 }}>{demoState.detail}</Typography>
            </Paper>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              size="large"
              sx={{
                mt: 2.4,
                minHeight: 52,
                borderRadius: '10px',
                px: 3.2,
                bgcolor: 'var(--fw-primary)',
                '&:hover': { bgcolor: '#0e3191' },
              }}
            >
              {PRIMARY_CTA}
            </Button>
          </Paper>

          <Box sx={{ mb: { xs: 6, md: 9 } }}>
            <Typography sx={{ fontWeight: 800, fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', mb: 2.1 }}>Teams that switched to FireWatch</Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: 'repeat(3, 85%)', md: 'repeat(3, 1fr)' },
                overflowX: { xs: 'auto', md: 'visible' },
                scrollSnapType: { xs: 'x mandatory', md: 'none' },
                pb: { xs: 1, md: 0 },
              }}
            >
              {testimonials.map((item, idx) => (
                <Paper
                  key={item.name}
                  elevation={0}
                  sx={{
                    p: '32px',
                    borderRadius: '14px',
                    border: '1px solid rgba(16,24,40,0.1)',
                    boxShadow: '0 10px 24px rgba(16,24,40,0.06)',
                    minWidth: 0,
                    scrollSnapAlign: 'start',
                    animation: `${riseIn} 0.55s ease-out ${idx * 0.09}s both`,
                  }}
                >
                  <Stack direction="row" spacing={1.4} alignItems="center" sx={{ mb: 1.6 }}>
                    <Avatar src={item.image} alt={`${item.name} headshot`} imgProps={{ loading: 'lazy' }} sx={{ width: 56, height: 56 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 800 }}>{item.name}</Typography>
                      <Typography sx={{ color: '#475467', fontSize: '0.89rem' }}>{item.role}</Typography>
                    </Box>
                  </Stack>
                  <Typography sx={{ color: '#1d2939', lineHeight: 1.67 }}>{item.quote}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          <Paper
            elevation={0}
            sx={{
              mb: { xs: 6, md: 9 },
              px: { xs: 2.2, md: 3.4 },
              py: { xs: 2.6, md: 3.6 },
              maxWidth: 600,
              mx: 'auto',
              borderRadius: '16px',
              background: 'linear-gradient(150deg, #0e3191 0%, #024ad8 64%, #296ef9 100%)',
              color: '#ffffff',
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)', mb: 0.8 }}>Start your first workflow</Typography>
            <Typography sx={{ opacity: 0.9, mb: 2.3, lineHeight: 1.65 }}>
              Keep it simple. Share a few details and launch your FireWatch workspace today.
            </Typography>
            <Stack spacing={1.4}>
              <TextField
                label="Work email"
                variant="filled"
                fullWidth
                InputProps={{ disableUnderline: true }}
                sx={{
                  '& .MuiFilledInput-root': { minHeight: 48, bgcolor: '#ffffff', borderRadius: '10px' },
                }}
              />
              <TextField
                label="Full name"
                variant="filled"
                fullWidth
                InputProps={{ disableUnderline: true }}
                sx={{
                  '& .MuiFilledInput-root': { minHeight: 48, bgcolor: '#ffffff', borderRadius: '10px' },
                }}
              />
              <TextField
                label="Team size"
                variant="filled"
                fullWidth
                InputProps={{ disableUnderline: true }}
                sx={{
                  '& .MuiFilledInput-root': { minHeight: 48, bgcolor: '#ffffff', borderRadius: '10px' },
                }}
              />
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                size="large"
                sx={{
                  minHeight: 52,
                  borderRadius: '10px',
                  px: 3.2,
                  bgcolor: 'var(--fw-primary)',
                  '&:hover': { bgcolor: '#0e3191' },
                }}
              >
                {PRIMARY_CTA}
              </Button>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button variant="outlined" sx={{ minHeight: 48, borderColor: 'rgba(255,255,255,0.6)', color: '#ffffff' }}>
                  Continue with Google
                </Button>
                <Button variant="outlined" sx={{ minHeight: 48, borderColor: 'rgba(255,255,255,0.6)', color: '#ffffff' }}>
                  Continue with Apple
                </Button>
              </Stack>
              <Typography sx={{ fontSize: '0.82rem', opacity: 0.9 }}>We never share your data.</Typography>
            </Stack>
          </Paper>

          <Box sx={{ maxWidth: 800, mx: 'auto', mb: { xs: 6, md: 8 } }}>
            <Typography sx={{ fontWeight: 800, fontSize: 'clamp(1.4rem, 3.2vw, 2rem)', mb: 1.5 }}>Questions before you decide?</Typography>
            {faqs.map((faq, index) => (
              <Accordion
                key={faq.q}
                disableGutters
                elevation={0}
                defaultExpanded={index === 0}
                sx={{
                  mb: 1,
                  borderRadius: '12px !important',
                  border: '1px solid rgba(16,24,40,0.12)',
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: '#344054', lineHeight: 1.67 }}>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
            <Typography sx={{ mt: 1.4, color: '#475467' }}>
              Still have questions?{' '}
              <Box component="a" href="mailto:support@firewatch.app" sx={{ color: 'var(--fw-primary)', fontWeight: 700 }}>
                Chat with us
              </Box>
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box component="footer" sx={{ borderTop: '1px solid rgba(16,24,40,0.09)', py: 3.2, backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={2.4} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <Typography sx={{ fontSize: '0.78rem', color: '#667085' }}>
                © {new Date().getFullYear()} FireWatch. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography sx={{ fontSize: '0.8rem', color: '#667085' }}>Security and Privacy</Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <Box component="a" href="#" sx={{ fontSize: '0.8rem', color: '#667085', textDecoration: 'none' }}>
                Cookie preferences
              </Box>
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <Stack direction="row" spacing={1.6} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                <Box component="a" href="#" sx={{ fontSize: '0.8rem', color: '#667085', textDecoration: 'none' }}>
                  Privacy policy
                </Box>
                <Box component="a" href="#" sx={{ fontSize: '0.8rem', color: '#667085', textDecoration: 'none' }}>
                  Terms
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
