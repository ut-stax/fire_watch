# 🔥 FireWatch SIEM

> **Enterprise-Grade Security Information & Event Management System**  
> A Browser-Based SIEM Dashboard Showcasing Real-Time Threat Detection & Analysis

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-v9-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)]()

---

## 📋 Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Phases](#project-phases)
- [Quick Start](#quick-start)
- [Setup Instructions](#setup-instructions)
- [Firebase Configuration](#firebase-configuration)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [How to Use](#how-to-use)
- [Correlation Rules](#correlation-rules)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

**FireWatch** is a zero-backend SIEM (Security Information & Event Management) system built entirely in the browser. It demonstrates enterprise-level security monitoring concepts while remaining learnable and portfolio-friendly.

### What Makes FireWatch Unique?

- **Zero Backend**: All processing happens in the browser using React and Firebase
- **Real-Time Analysis**: Events are correlated in real-time against threat patterns
- **Live Dashboard**: KPIs and metrics update automatically as new events arrive
- **Smart Alerting**: JavaScript-based correlation engine detects multi-event attack patterns
- **Production-Ready Security**: Firestore rules enforce data access controls for authenticated analysts only

Perfect for security professionals, DevOps engineers, and developers learning SIEM concepts.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- **Multi-Method Sign-In**: Google OAuth and Email/Password authentication
- **Session Persistence**: Secure session management across browser refreshes
- **Protected Routes**: All data pages require authentication
- **Role-Based Access**: Analyst-level permissions via Firestore rules

### 📊 Real-Time Dashboard
- **Live KPI Metrics**
  - Total events ingested
  - Critical alerts count
  - Unique source IPs
  - Events per hour trend
  
- **Three Interactive Charts**
  - 📈 **Event Timeline**: Hourly event distribution over 24 hours
  - 🥧 **Severity Breakdown**: Pie chart of event severity distribution
  - 📊 **Top Source IPs**: Bar chart of top 10 attacking IPs

- **Live Event Feed**: Real-time scrolling table of newest events (most recent first)

### 🚨 Correlation Engine
Automatic threat detection with **4 built-in rules**:

| Rule | Severity | Trigger | Window |
|------|----------|---------|--------|
| **Brute Force Detection** | 🔴 Critical | 5+ failed logins from same IP | 60 seconds |
| **Credential Stuffing** | 🟠 High | Failed login → successful login (same IP) | 300 seconds |
| **Port Scan Detection** | 🟠 High | 10+ distinct destination IPs from same source | 30 seconds |
| **Privilege Escalation** | 🔴 Critical | Failed login → privilege escalation (same IP) | 120 seconds |

### 🎬 Alert Management
- **Active Alerts Panel**: Unacknowledged alerts sorted by severity
- **One-Click Acknowledge**: Dismiss threats from the dashboard
- **Alert Detail View**: Inspect related events that triggered an alert
- **Alert History**: Searchable archive of all acknowledged alerts
- **Smart Deduplication**: Prevents alert fatigue with intelligent dedup windows

### 🔍 Log Explorer & Search
- **Real-Time Search**: Filter events by IP, type, or message instantly
- **Multi-Dimension Filters**: Narrow by severity, event type, and source IP
- **IP Pivot Investigation**: Click an IP to see all its events
- **Sortable Columns**: Sort by timestamp, IP, or severity
- **CSV Export**: Download filtered results for external analysis
- **Alert Pivot**: Link from alerts to related events

### ⏱️ Time Range Analysis
- **Preset Ranges**: Last 1h, 6h, 24h, 7d quick filters
- **Custom Date Picker**: Select exact from/to timestamps
- **Global Filter**: All charts and tables respond to time range changes
- **Trend Indicators**: Compare event rates across time windows

### 📥 Log Ingestion
Three flexible ingestion methods:

1. **Manual Entry Form**: Paste individual security events with full schema
2. **File Upload**: Bulk import via CSV or JSON files (supports arrays and objects)
3. **Fake Log Generator**: Generate realistic test events for demos and load testing
   - Burst mode: Generate 20 mixed attack events in rapid succession
   - Supports all event types with randomized IPs and timestamps

---

## 🛠️ Tech Stack

### Frontend
- **[React 18](https://react.dev)** - Modern UI component library
- **[Vite](https://vitejs.dev)** - Lightning-fast build tool and dev server
- **[React Router v6](https://reactrouter.com)** - Client-side routing
- **[Tailwind CSS v3](https://tailwindcss.com)** - Utility-first styling with dark mode
- **[Recharts](https://recharts.org)** - Composable charting library (Line, Pie, Bar)

### Backend & Data
- **[Firebase Firestore](https://firebase.google.com/docs/firestore)** - Real-time NoSQL database
- **[Firebase Authentication](https://firebase.google.com/docs/auth)** - Multi-provider auth
- **[Firebase Hosting](https://firebase.google.com/docs/hosting)** - Production deployment

### Utilities
- **[PapaParse](https://www.papaparse.com)** - CSV parsing
- **[date-fns](https://date-fns.org)** - Date manipulation and formatting

### Development Tools
- **[ESLint](https://eslint.org)** - Code quality
- **[PostCSS](https://postcss.org)** - CSS processing

---

## 📅 Project Phases

FireWatch was built in **10 sequential phases**, each fully scoped and independent:

| Phase | Name | Objective | Status |
|-------|------|-----------|--------|
| **1** | Project Scaffold & Firebase Setup | Initialize Vite+React, configure Firebase | ✅ Complete |
| **2** | Authentication System | Firebase Auth, protected routes, session management | ✅ Complete |
| **3** | Firestore Data Layer | Database schema, read/write helpers, security rules | ✅ Complete |
| **4** | Log Ingestion Module | Manual forms, file upload, fake log generator | ✅ Complete |
| **5** | Correlation Engine | JavaScript rule engine, alert generation | ✅ Complete |
| **6** | Real-Time Dashboard | KPI cards, charts, live event feed | ✅ Complete |
| **7** | Alert Management Panel | Active/history alerts, acknowledgment workflow | ✅ Complete |
| **8** | Log Explorer & Search | Full-text search, filtering, CSV export | ✅ Complete |
| **9** | Time Range Analysis | Preset/custom date ranges, global filtering | ✅ Complete |
| **10** | Polish, Testing & Deployment | UI consistency, security hardening, live deployment | ✅ Complete |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and npm 8+
- **Git**
- A **Firebase project** (free tier works great!)

### 5-Minute Setup

```bash
# 1. Clone the repository
git clone https://github.com/ut-stax/fire_watch.git
cd fire_watch/firewatch

# 2. Install dependencies
npm install

# 3. Configure Firebase (see Firebase Configuration section below)
# Update src/firebase/config.js with your Firebase credentials

# 4. Start development server
npm run dev

# 5. Open browser to http://localhost:5173
# Sign in with your test email or Google account
```

Done! The dashboard should now be running with real-time event streaming.

---

## 📚 Setup Instructions

### Full Setup Guide

#### Step 1: Clone and Install

```bash
git clone https://github.com/ut-stax/fire_watch.git
cd fire_watch/firewatch
npm install
```

#### Step 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Create a new project**
3. Name it `FireWatch` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click **Create project**

#### Step 3: Enable Firebase Services

**Firestore Database:**
- In left sidebar, click **Firestore Database**
- Click **Create database**
- Select **Start in test mode** (for development)
- Choose your region (closest to you recommended)
- Click **Create**

**Authentication:**
- In left sidebar, click **Authentication**
- Click **Get started**
- Enable **Google** (click Google, enable it, add your project email, save)
- Enable **Email/Password** (click Email/Password, enable it, save)

#### Step 4: Get Firebase Config

1. In Firebase Console, click the **gear icon** → **Project settings**
2. Scroll to **Your apps** section
3. Click the **Web app** icon (or create one if needed)
4. Copy the entire config object
5. Paste into `src/firebase/config.js` (see next section)

#### Step 5: Configure Your App

See the Firebase Configuration section below.

#### Step 6: Deploy Firestore Rules

```bash
# Install Firebase CLI globally (one time)
npm install -g firebase-tools

# Authenticate
firebase login

# Initialize Firebase in your project (if not done)
firebase init

# Deploy the security rules
firebase deploy --only firestore:rules
```

#### Step 7: Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔥 Firebase Configuration

### Configure Firestore Database

Update `src/firebase/config.js`:

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

### Firestore Collections Schema

**`events/` Collection**
```javascript
{
  timestamp: Timestamp,           // Time event occurred
  source_ip: string,              // Attacker IP
  dest_ip: string,                // Target IP (optional)
  event_type: string,             // Type: failed_login, port_scan, etc.
  severity: string,               // Level: critical, high, medium, low, info
  message: string,                // Human-readable description
  raw_log: string                 // Original log line
}
```

**`alerts/` Collection**
```javascript
{
  rule_name: string,              // Triggered rule ID
  severity: string,               // Alert severity
  source_ip: string,              // Attacking IP
  triggered_at: Timestamp,        // When alert fired
  related_ids: Array<string>,     // Event IDs that triggered alert
  acknowledged: boolean           // Analyst acknowledged this alert
}
```

### Security Rules

`firestore.rules` automatically enforces:
- Only authenticated users can read/write
- Event fields are validated on write
- Alerts can only be created by the system

---

## 📁 Project Structure

```
firewatch/
├── src/
│   ├── firebase/
│   │   ├── config.js           # Firebase initialization
│   │   ├── auth.js             # Authentication helpers
│   │   ├── events.js           # Event read/write functions
│   │   └── alerts.js           # Alert management functions
│   │
│   ├── hooks/
│   │   ├── useAuth.js          # Auth state management
│   │   ├── useEvents.js        # Real-time events stream
│   │   ├── useAlerts.js        # Real-time alerts stream
│   │   └── useTimeRange.js     # Time range state management
│   │
│   ├── correlation/
│   │   ├── rules.js            # Correlation rule definitions
│   │   └── engine.js           # Rule evaluation engine
│   │
│   ├── utils/
│   │   ├── normalizer.js       # Event field normalization
│   │   ├── fakeLogGenerator.js # Test event generator
│   │   └── severityColors.js   # Severity-to-color mapping
│   │
│   ├── components/
│   │   ├── Layout.jsx          # Main layout with sidebar
│   │   ├── ProtectedRoute.jsx  # Auth guard wrapper
│   │   ├── TimeRangeSelector.jsx # Time range picker
│   │   ├── ErrorBoundary.jsx   # Error boundary
│   │   │
│   │   ├── dashboard/          # Dashboard charts & metrics
│   │   ├── alerts/             # Alert management UI
│   │   ├── explorer/           # Log search & filter
│   │   └── ingestion/          # Log ingestion forms
│   │
│   ├── pages/
│   │   ├── Login.jsx           # Authentication page
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Alerts.jsx          # Alert management
│   │   ├── LogExplorer.jsx     # Log search page
│   │   └── LogIngestion.jsx    # Log ingestion page
│   │
│   ├── App.jsx                 # Root component with routing
│   ├── main.jsx                # React entry point
│   ├── index.css               # Global styles
│   └── theme.js                # Theme configuration
│
├── public/                      # Static assets
├── firebase.json               # Firebase config
├── firestore.rules             # Firestore security rules
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## 🧩 Core Components

### 🔐 Authentication Layer
- **`useAuth.js`**: Real-time auth state with loading indicator
- **`ProtectedRoute.jsx`**: Guards routes from unauthenticated access
- **`Login.jsx`**: Multi-provider sign-in page

### 📊 Data Layer
- **`useEvents.js`**: Streams all events in real-time
- **`useAlerts.js`**: Streams unacknowledged alerts
- **`useTimeRange.js`**: Manages global time range filter

### 🎯 Correlation Engine
- **`rules.js`**: Defines 4 threat detection rules
- **`engine.js`**: Evaluates rules against events
- **Auto-deduplicates**: Prevents alert fatigue with 10-minute dedup windows

### 📈 Dashboard Components
- **`MetricCard.jsx`**: KPI metric display
- **`EventFeedTable.jsx`**: Live event feed
- **`EventTimeline.jsx`**: Hourly event trend line chart
- **`SeverityPie.jsx`**: Event severity distribution
- **`TopIPsChart.jsx`**: Top 10 attacking IPs bar chart

### 🚨 Alert Management
- **`AlertCard.jsx`**: Individual alert display
- **`ActiveAlertsList.jsx`**: Unacknowledged alerts panel
- **`AlertDetail.jsx`**: Alert detail view with related events
- **`AlertHistory.jsx`**: Acknowledged alerts archive

### 🔍 Log Explorer
- **`SearchBar.jsx`**: Real-time event search
- **`FilterControls.jsx`**: Multi-dimension filtering
- **`EventsTable.jsx`**: Sortable, paginated events table

---

## 📖 How to Use

### Typical Analyst Workflow

#### 1. **Sign In**
- Click **Sign in with Google** or enter credentials
- Redirect to dashboard

#### 2. **Review Dashboard**
- Check KPI metrics at the top
- View event timeline and severity breakdown
- Scan live event feed for anomalies

#### 3. **Respond to Alerts**
- Navigate to **Alerts**
- Review active security alerts
- Click an alert to see related events
- Click **Acknowledge** to dismiss

#### 4. **Investigate Events**
- Go to **Log Explorer**
- Search by IP or event type
- Click an IP address to pivot and investigate
- Use time range selector to narrow investigation window
- Export CSV results for reporting

#### 5. **Ingest Logs** (Admins)
- Navigate to **Log Ingestion**
- Upload CSV/JSON files, or
- Manually enter individual events, or
- Click **Generate Burst** to load test data

#### 6. **Monitor with Time Ranges**
- Use preset buttons: Last 1h, Last 6h, Last 24h, Last 7d
- Or select custom from/to dates
- All charts and tables automatically filter

---

## 🎓 Correlation Rules Deep Dive

### Rule #1: Brute Force Detection 🔴 Critical

**Trigger**: 5+ failed login attempts from the same IP within 60 seconds

**Real-World Scenario**: 
```
10:05:00 - IP 192.168.1.100 → failed_login
10:05:15 - IP 192.168.1.100 → failed_login
10:05:30 - IP 192.168.1.100 → failed_login
10:05:45 - IP 192.168.1.100 → failed_login
10:06:00 - IP 192.168.1.100 → failed_login  ← ALERT TRIGGERED
```

**Response**: Block IP, force password reset, notify user

---

### Rule #2: Credential Stuffing 🟠 High

**Trigger**: Failed login followed by successful login from same IP within 300 seconds

**Real-World Scenario**: Attacker using leaked credentials that finally work

**Response**: Force MFA, audit account activity, rotate credentials

---

### Rule #3: Port Scan Detection 🟠 High

**Trigger**: Single IP contacts 10+ distinct destination IPs within 30 seconds

**Real-World Scenario**: Automated reconnaissance scanning network

**Response**: Rate-limit IP, alert network team, review firewall logs

---

### Rule #4: Privilege Escalation 🔴 Critical

**Trigger**: Failed login followed by privilege escalation event from same IP within 120 seconds

**Real-World Scenario**: Attacker gained access then tried to escalate privileges

**Response**: Isolate user account, audit privilege grants, investigate root cause

---

## 🌐 Deployment

### Deploy to Firebase Hosting

```bash
# 1. Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize Firebase (if not done)
firebase init

# 4. Build the production bundle
npm run build

# 5. Deploy to Firebase Hosting
firebase deploy

# Your app is now live! 🚀
```

### Post-Deployment Checklist

- ✅ Verify Firebase rules are deployed (`firebase deploy --only firestore:rules`)
- ✅ Test all auth methods in production
- ✅ Load test with fake log generator
- ✅ Verify alerts are generating correctly
- ✅ Test CSV export functionality
- ✅ Share public URL with team

---

## 🧪 Testing Checklist

Use this checklist to verify all features work:

### Authentication
- [ ] Google Sign-In works
- [ ] Email/Password sign-in works
- [ ] Session persists after refresh
- [ ] Logout clears session
- [ ] Unauthenticated users are redirected to login

### Dashboard
- [ ] KPI metrics show correct counts
- [ ] Event timeline displays hourly data
- [ ] Severity pie chart is proportional
- [ ] Top IPs bar chart ranks correctly
- [ ] Event feed updates in real-time

### Correlation Engine
- [ ] Generate 5+ brute force events → Critical alert appears
- [ ] Generate failed + successful login → High alert appears
- [ ] Generate 10+ port scan events → High alert appears
- [ ] Duplicate patterns don't create duplicate alerts

### Alert Management
- [ ] Active alerts display unacknowledged only
- [ ] Clicking alert shows related events
- [ ] Acknowledge removes from active panel
- [ ] Acknowledged alerts appear in history

### Log Explorer
- [ ] Search filters events in real-time
- [ ] Severity filter works
- [ ] Event type filter works
- [ ] IP filter works
- [ ] Clicking IP pivots investigation
- [ ] CSV export downloads valid file
- [ ] Sorting works on all columns

### Time Range
- [ ] Preset buttons change visible data
- [ ] Custom date picker works
- [ ] All pages respect time range
- [ ] Trend indicator shows correct direction

### Log Ingestion
- [ ] Manual form creates events
- [ ] CSV upload imports all rows
- [ ] JSON upload handles arrays
- [ ] Fake generator works
- [ ] Burst mode generates 20 events

---

## 📊 Performance Considerations

- **Real-Time Limits**: Currently streams last 200 events (configurable in `useEvents.js`)
- **Alert Deduplication**: 10-minute windows prevent alert fatigue
- **Pagination**: Log Explorer uses 50 events per page
- **Chart Binning**: Timeline aggregates events by hour

For production with millions of events, consider:
- Cloud Functions to pre-aggregate data
- Firestore sharding for high-write scenarios
- Cloud Tasks for batch alert processing

---

## 🐛 Troubleshooting

### Firebase Connection Issues

**Error**: `Firebase App not initialized`
- **Solution**: Verify `src/firebase/config.js` has correct credentials
- Run: `firebase init` in project root

**Error**: `Permission denied` on Firestore write
- **Solution**: Check Firestore security rules are deployed
- Run: `firebase deploy --only firestore:rules`

### Events Not Appearing

**Issue**: Generated events don't show in dashboard
- Verify time range includes event timestamp
- Check event severity is valid (critical, high, medium, low, info)
- Open Firebase Console → Firestore → events collection to verify document exists

### Alerts Not Firing

**Issue**: Correlation rules not triggering
- Verify events have correct event_type field
- Check time windows match rule definitions (see Correlation Rules section)
- Open browser console for any JavaScript errors

### Build Issues

**Error**: `npm run build` fails
- Delete `node_modules/` and `package-lock.json`
- Run `npm install`
- Run `npm run build` again

---

## 📈 Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│              Browser (React 18 + Vite)              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │           React Components (Pages)           │  │
│  │  Login │ Dashboard │ Alerts │ LogExplorer    │  │
│  └──────────────────────────────────────────────┘  │
│                        ▲                            │
│  ┌──────────────────────────────────────────────┐  │
│  │         Custom Hooks (Data Layer)            │  │
│  │  useAuth │ useEvents │ useAlerts │ useTime  │  │
│  └──────────────────────────────────────────────┘  │
│                        ▲                            │
│  ┌──────────────────────────────────────────────┐  │
│  │      Correlation Engine (JavaScript)         │  │
│  │  Evaluates rules on incoming events          │  │
│  └──────────────────────────────────────────────┘  │
│                        ▲                            │
└────────────────────────┼──────────────────────────┘
                         │
                    HTTP/REST
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
    ┌─────────────┐           ┌──────────────────┐
    │  Firebase   │           │  Firebase        │
    │  Auth       │           │  Firestore       │
    │             │           │                  │
    │ • Google    │           │  collections:    │
    │ • Email/PW  │           │  • events/       │
    └─────────────┘           │  • alerts/       │
                              └──────────────────┘
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Setup

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

Free to use, modify, and distribute for personal and commercial projects.

---

## 👨‍💻 About the Author

**FireWatch** was built as a **portfolio project** demonstrating:
- Full-stack SIEM concepts
- Real-time data streaming with Firestore
- React best practices (hooks, context, composition)
- JavaScript correlation engine design
- Security-first development (Firestore rules, auth)
- Modern frontend tooling (Vite, Tailwind, Recharts)

Perfect for learning enterprise security monitoring in a learnable, zero-backend environment.

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/ut-stax/fire_watch/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ut-stax/fire_watch/discussions)
- **Email**: [Create an issue](https://github.com/ut-stax/fire_watch/issues/new)

---

## 🌟 Acknowledgments

- **React** - Amazing component library
- **Firebase** - Seamless backend-as-a-service
- **Recharts** - Beautiful charting library
- **Tailwind CSS** - Modern utility-first styling
- **Vite** - Lightning-fast build tool

---

<div align="center">

**Made with ❤️ for security professionals & developers**

⭐ If this project helped you, please consider giving it a star!

[View on GitHub](https://github.com/ut-stax/fire_watch) • [Live Demo](https://firewatch-app.web.app)

</div>

---

*Last Updated: May 18, 2026 | FireWatch SIEM v1.0*