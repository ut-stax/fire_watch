# FireWatch SIEM

A browser-based Security Information & Event Management (SIEM) dashboard built with React, Firebase, and Tailwind CSS.

## Features

- **Real-time Event Monitoring**: Live dashboard with streaming security events
- **Correlation Engine**: Automatic detection of attack patterns (brute force, port scans, privilege escalation)
- **Alert Management**: Triage and acknowledge security alerts
- **Log Explorer**: Search, filter, and investigate events with full-text search
- **Time Range Analysis**: Filter data by preset or custom time ranges
- **Log Ingestion**: Manual entry, CSV/JSON import, and fake log generator

## Tech Stack

- **React 18** - UI library
- **Firebase** - Firestore (database), Auth (authentication), Hosting
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Vite** - Build tool

## Quick Start

### Prerequisites

- Node.js 18+
- Firebase account

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd firewatch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Firestore (in test mode initially)
   - Enable Authentication (Google and Email/Password providers)
   - Copy your Firebase config to `src/firebase/config.js`

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Firebase Setup Guide

1. Create a new project in the Firebase Console
2. Enable Firestore Database (Start in test mode for development)
3. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable Google Sign-In
   - Enable Email/Password provider
4. Add a web app to get your Firebase config object
5. Deploy Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Project Structure

```
src/
├── components/
│   ├── alerts/           # Alert management components
│   ├── dashboard/        # Dashboard charts and metrics
│   ├── explorer/         # Log explorer components
│   ├── ingestion/        # Log ingestion components
│   └── Layout.jsx        # Main layout with sidebar
├── contexts/
│   └── TimeRangeContext.jsx  # Global time range context
├── firebase/
│   ├── auth.js           # Authentication helpers
│   ├── config.js         # Firebase configuration
│   ├── events.js         # Events collection helpers
│   └── alerts.js         # Alerts collection helpers
├── hooks/
│   ├── useAuth.js        # Authentication hook
│   ├── useEvents.js      # Events stream hook
│   ├── useAlerts.js      # Alerts stream hook
│   └── useTimeRange.js   # Time range hook
├── pages/
│   ├── Dashboard.jsx     # Main dashboard
│   ├── LogExplorer.jsx   # Event search & investigation
│   ├── Alerts.jsx        # Alert management
│   ├── Login.jsx         # Authentication page
│   └── LogIngestion.jsx  # Log import page
├── utils/
│   ├── severityColors.js # Severity styling utilities
│   └── fakeLogGenerator.js # Test data generator
└── correlation/
    ├── engine.js         # Correlation engine runner
    └── rules.js          # Detection rules
```

## Deployment

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize hosting: `firebase init hosting`
4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## License

MIT