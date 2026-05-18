# FireWatch SIEM

Enterprise-Grade Security Information & Event Management System - A browser-based SIEM dashboard showcasing real-time threat detection and analysis.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-v9-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## About

FireWatch is a zero-backend SIEM system built entirely in the browser. It demonstrates enterprise-level security monitoring concepts while remaining learnable and portfolio-friendly. All processing happens in React and Firebase with no traditional backend required.

## Key Features

- **Real-Time Dashboard**: Live KPI metrics, event timeline, severity breakdown, and top IPs chart
- **Authentication**: Google OAuth and Email/Password sign-in with session persistence
- **Correlation Engine**: JavaScript-based rule engine detecting brute force, credential stuffing, port scans, and privilege escalation
- **Alert Management**: Active alerts with one-click acknowledgment and full alert history
- **Log Explorer**: Real-time search, multi-dimension filtering, IP pivot investigation, and CSV export
- **Time Range Analysis**: Preset and custom date range filters applied globally
- **Log Ingestion**: Manual entry form, CSV/JSON file upload, and fake log generator for testing

## Tech Stack

**Frontend**: React 18, Vite, React Router, Tailwind CSS, Recharts
**Backend**: Firebase Firestore, Firebase Auth, Firebase Hosting
**Utilities**: PapaParse (CSV), date-fns (dates), ESLint, PostCSS

## Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- Firebase account (free tier works)

### Setup

```bash
# 1. Clone and enter directory
git clone https://github.com/ut-stax/fire_watch.git
cd fire_watch/firewatch

# 2. Install dependencies
npm install

# 3. Configure Firebase credentials in src/firebase/config.js

# 4. Start development server
npm run dev

# 5. Open http://localhost:5173 and sign in
```

## Firebase Setup

1. Create project at [firebase.google.com](https://firebase.google.com)
2. Enable **Firestore Database** (test mode for development)
3. Enable **Authentication** - Google and Email/Password providers
4. Get Firebase config from Project Settings and paste into `src/firebase/config.js`
5. Deploy Firestore rules: `firebase deploy --only firestore:rules`

### Firebase Config

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

## Firestore Schema

**events/** - Security events
```
timestamp, source_ip, dest_ip, event_type, severity, message, raw_log
```

**alerts/** - Generated alerts
```
rule_name, severity, source_ip, triggered_at, related_ids, acknowledged
```

## Correlation Rules

| Rule | Severity | Trigger | Window |
|------|----------|---------|--------|
| Brute Force | Critical | 5+ failed logins from same IP | 60s |
| Credential Stuffing | High | Failed login then success from same IP | 300s |
| Port Scan | High | 10+ distinct destination IPs from same source | 30s |
| Privilege Escalation | Critical | Failed login then privilege escalation from same IP | 120s |

## Project Structure

```
src/
├── firebase/          # Firebase initialization, auth, events, alerts
├── hooks/             # useAuth, useEvents, useAlerts, useTimeRange
├── correlation/       # rules.js and engine.js for threat detection
├── utils/             # normalizer, fakeLogGenerator, severityColors
├── components/        # Layout, ProtectedRoute, dashboard, alerts, explorer, ingestion
├── pages/             # Login, Dashboard, Alerts, LogExplorer, LogIngestion
├── App.jsx           # Root component with routing
└── index.css         # Global styles
```

## How to Use

1. **Sign In** - Use Google OAuth or email/password
2. **Review Dashboard** - Check KPIs, event timeline, severity pie chart
3. **Respond to Alerts** - Navigate to Alerts, click to view details, acknowledge
4. **Investigate Events** - Go to Log Explorer, search/filter, pivot on IPs, export CSV
5. **Ingest Logs** - Manual entry, CSV/JSON upload, or generate fake events
6. **Filter by Time** - Use presets (Last 1h/6h/24h/7d) or custom date range

## Deployment

```bash
# Build for production
npm run build

# Install Firebase CLI
npm install -g firebase-tools

# Login and deploy
firebase login
firebase deploy
```

Your app will be live at: `https://[projectId].web.app`

## Testing Checklist

- [ ] Google and Email sign-in work
- [ ] Session persists after refresh
- [ ] Dashboard metrics are accurate
- [ ] Generate 5+ brute force events triggers Critical alert
- [ ] Acknowledge removes alert from active list
- [ ] Search and filters work in Log Explorer
- [ ] CSV export downloads correctly
- [ ] Time range filters all data
- [ ] All pages load without errors

## Troubleshooting

**Firebase App not initialized**
- Verify credentials in `src/firebase/config.js`
- Run `firebase init` in project root

**Permission denied on Firestore**
- Deploy security rules: `firebase deploy --only firestore:rules`

**Events not appearing**
- Check time range includes event timestamp
- Verify event has valid severity (critical, high, medium, low, info)
- Check Firebase Console Firestore collection

**Alerts not firing**
- Verify event_type field matches rule definitions
- Check time windows in rules.js
- Open browser console for errors

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open a Pull Request

## License

MIT License - Free to use, modify, and distribute

## Support

- Issues: [GitHub Issues](https://github.com/ut-stax/fire_watch/issues)
- Discussions: [GitHub Discussions](https://github.com/ut-stax/fire_watch/discussions)

---

Built with React + Firebase | Portfolio Project | Production-Ready SIEM System
