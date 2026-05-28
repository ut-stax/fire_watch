<div align="center">

<img src="[https://raw.githubusercontent.com/firewatch-siem/firewatch/main/public/logo.svg](https://chatgpt.com/backend-api/estuary/content?id=file_000000005cf47230ab591200d8318845&ts=494431&p=fs&cid=1&sig=2ef0f1340d916bf6c0106fcfef484d9bad9d22317c0cbebf7a48035b0357b96c&v=0)" alt="FireWatch SIEM" width="120" height="120">

# FireWatch SIEM

FireWatch is a browser-based Security Information & Event Management (SIEM) dashboard focused on real-time event monitoring, fast investigation, and lightweight alert triage.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Material UI](https://img.shields.io/badge/Material--UI-9-007FFF?logo=mui&logoColor=white)](https://mui.com)

</div>

## Features

- **Real-time Dashboard** — KPI tiles, event timeline, and interactive charts
- **Log Explorer** — Full-text search, advanced filters, CSV export
- **Alert Management** — Active alerts list, detail view, acknowledgment history
- **Log Ingestion** — Manual entry, file upload, and fake event generator for testing
- **Authentication** — Google Sign-in and Email/Password via Firebase Auth

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [React 19](https://react.dev) |
| **Build Tool** | [Vite 8](https://vitejs.dev) |
| **UI Library** | [Material UI 9](https://mui.com) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss) + CSS Tokens |
| **Charts** | [Chart.js 4](https://www.chartjs.org) + [Recharts 3](https://recharts.org) |
| **Backend** | [Firebase](https://firebase.google.com) (Firestore, Auth) |
| **Routing** | [React Router 7](https://reactrouter.com) |
| **CSV Parsing** | [PapaParse 5](https://www.papaparse.com) |
| **Date Utils** | [date-fns 4](https://date-fns.org) |
| **Font** | [Roboto (Fontsource)](https://fontsource.org) |
| **Icons** | [MUI Icons](https://mui.com/icons) |

**Dev Tools**
- ESLint + React Hooks Plugin
- React Refresh

## Quick Start

### Prerequisites
- Node.js 18+
- Firebase project with Firestore and Authentication enabled

### Installation

```bash
git clone <repo-url>
cd firewatch
npm install
```

### Configuration

Create `src/firebase/config.js`:

```js
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "...",
  appId: "...",
};
```

### Development

```bash
npm run dev
# Open http://localhost:5174
```

### Build

```bash
npm run build
# firebase deploy --only hosting
```

## Project Structure

```
src/
├─ components/       # UI components and widgets
├─ pages/            # Route-level pages (Dashboard, Login, Alerts, etc.)
├─ firebase/         # Firebase helpers (auth, events, alerts, config)
├─ hooks/            # Custom React hooks
├─ contexts/         # App-wide contexts (TimeRange)
├─ correlation/      # Rules engine for alerting
├─ utils/            # Utility functions
└─ public/           # Static assets
```

## License

MIT License © FireWatch SIEM

---

<div align="center">
Built with modern web technologies for enterprise-grade security monitoring.
</div>
