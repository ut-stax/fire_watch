# FireWatch SIEM

FireWatch is a browser-based Security Information & Event Management (SIEM) dashboard focused on real-time event monitoring, fast investigation, and lightweight alert triage. It ships with ingestion tools to populate test data and a correlation engine to detect common attack patterns.

This repository contains a demo-ready UI built with React, Material UI, and Firebase for data/auth, and a small rules engine to generate alerts from incoming events.

Key goals
- Real-time visibility into security events
- Fast investigation with search, filters and CSV export
- Lightweight alert triage with acknowledge/history
- Easy local testing via fake event generator

---

## What's included
- Dashboard with KPI tiles, timeline and charts
- Log Explorer: full-text search, filters, CSV export
- Alerts: active alerts list, detail pane, history
- Log Ingestion: manual entry, file upload and fake generator
- Auth: Google Sign-in + Email/Password (Firebase)

---

## Quick start (local)

Prerequisites
- Node.js 18+
- Firebase account (for Firestore + Auth)

Steps

1. Clone the repo and install dependencies

```bash
git clone <repo-url>
cd firewatch
npm install
```

2. Add Firebase config
- Create a Firebase project and enable Firestore and Authentication (Google + Email/Password).
- Copy your project's Firebase config into `src/firebase/config.js`. Example:

```js
// src/firebase/config.js
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "...",
  appId: "...",
};
```

3. Run the dev server

```bash
cd firewatch
npm run dev
# open http://localhost:5174
```

4. Use demo credentials (local demo only)
- The login page shows demo credentials for quick testing.

---

## Build & deploy

```bash
npm run build
# If using Firebase Hosting
firebase deploy --only hosting
```

---

## Project layout (high level)

```
src/
├─ components/       # UI components and small widgets
├─ pages/            # Route-level pages (Dashboard, Login, Alerts, etc.)
├─ firebase/         # Firebase helpers (auth, events, alerts, config)
├─ hooks/            # Custom React hooks (useEvents, useAlerts, useAuth)
├─ contexts/         # App-wide contexts (TimeRange)
├─ correlation/      # Simple rules engine for alerting
└─ public/           # Static assets (illustrations, chevrons)
```

---

## Firebase notes
- Firestore: used for events and alerts collections. Start in test mode during development, then tighten security rules before production.
- Authentication: enable Google and Email/Password under Firebase Console → Authentication.
- The repo contains `firestore.rules` for example rules — review them before deploying.

---

## Development tips
- The app uses a token-based design system (see `src/index.css`) — change colors/radii there to rebrand.
- The MUI theme lives in `src/theme.js` for quick typography and palette changes.
- To add synthetic events for demos, use the Log Ingestion → Fake Generator page.

---

## Contributing
- Open an issue to propose changes or report bugs.
- Fork and submit a PR for code changes; keep changes focused and include screenshots where relevant.

---

## Troubleshooting
- Port conflict: Vite will attempt the next available port; check terminal output for the correct URL.
- Firebase auth errors: ensure authorized domains include `localhost` in Firebase Console.

---

## License
MIT