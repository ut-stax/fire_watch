**FireWatch SIEM  |  Product Requirements Document**	v1.0  |  Confidential

**FireWatch**

Security Information & Event Management System

| **PRODUCT REQUIREMENTS DOCUMENT** Version 1.0  │  AI-Agent Optimized Edition |
| --- |

| **Document Type** | Product Requirements Document |
| --- | --- |
| **Project** | FireWatch SIEM |
| **Version** | 1.0 |
| **Total Phases** | 10 |
| **Stack** | React 18 + Firebase + Tailwind |
| **Optimized For** | AI Agent Execution |

# **1. Document Purpose & Usage Guide**

This Product Requirements Document (PRD) breaks the entire FireWatch SIEM project into 10 self-contained, sequentially executable phases. It is specifically structured for AI agent execution — each phase is fully independent, clearly scoped, and carries all necessary context so the agent does not need to reference previous phases or hold extended memory.

## **1.1 How to Use This PRD**

To work on any phase, instruct the AI agent with:

| ***"Read the PRD and start working on the next phase."*** |
| --- |

## **1.2 Conventions Used**

- Each phase has: a Goal, Scope, Task Table, Expected Outcomes, and Acceptance Criteria.

- Tasks within each phase are ordered — complete them top-to-bottom.

- Phases are designed to have minimal dependencies on prior phase implementation details.

- File paths and component names are standardized across all phases for consistency.

- All code targets React 18, Firebase SDK v9 (modular), and Tailwind CSS v3.

## **1.3 Project Summary**

FireWatch is a browser-based SIEM dashboard with zero traditional backend. It uses Firebase Firestore for real-time data, Firebase Auth for analyst authentication, and React for all UI and business logic. Security events are ingested, correlated against rule patterns, and displayed on a live-updating dashboard. The project is portfolio-grade and demonstrates enterprise SIEM concepts at a learnable scale.

## **1.4 AI Agent Requirements**

The AI agent must use a Python virtual environment (`venv`) for all development and dependency management tasks. Before installing any Python packages or running any Python-based tooling, the agent must create and activate a `venv` using `python -m venv venv` and install all dependencies within it. This ensures reproducibility, prevents system-level package conflicts, and maintains a clean and isolated development environment throughout all phases.

# **2. Phase Overview & Roadmap**

The project is divided into 10 phases progressing from environment setup through deployment. Each phase builds on the previous phase's output files.

| **Phase** | **Name** | **Objective** | **Est. Time** | **Complexity** |
| --- | --- | --- | --- | --- |
| **1** | **Project Scaffold & Firebase Setup** | Initialize Vite+React project, install all dependencies, configure Firebase, set up routing skeleton | 2–3 hrs | **Low** |
| **2** | **Authentication System** | Implement Firebase Auth with Google and email/password login, protected routes, and session persistence | 2–3 hrs | **Low** |
| **3** | **Firestore Data Layer** | Define Firestore schema, write all read/write helper functions, and configure security rules | 3–4 hrs | **Medium** |
| **4** | **Log Ingestion Module** | Build manual entry form, CSV/JSON file upload, and the fake log generator utility | 4–5 hrs | **Medium** |
| **5** | **Correlation Engine** | Implement JavaScript-based rule engine that auto-detects attack patterns and writes alerts | 4–6 hrs | **High** |
| **6** | **Real-Time Dashboard** | Build main dashboard with live event feed, KPI metrics, and three chart types using Recharts | 4–5 hrs | **Medium** |
| **7** | **Alert Management Panel** | Build alert panel with severity sorting, acknowledge workflow, and alert history view | 3–4 hrs | **Medium** |
| **8** | **Log Explorer & Search** | Build full-text search, filter controls, IP pivot investigation, and CSV export | 4–5 hrs | **Medium** |
| **9** | **Time Range Analysis** | Add preset and custom time range selector that filters all charts, tables, and metrics live | 2–3 hrs | **Medium** |
| **10** | **Polish, Testing & Deployment** | UI consistency pass, Firestore security rules hardening, Firebase Hosting deployment | 3–4 hrs | **Low** |

# **3. Phase 1 — Project Scaffold & Firebase Setup**

| **PHASE 1  Project Scaffold & Firebase Setup** |
| --- |
| **Est. Time** | 2–3 hours | **Complexity** | **Low** |

## **3.1 Goal**

Create the complete project foundation: a Vite + React application with all required dependencies installed, a working Firebase project configured, React Router routing skeleton in place, and a Tailwind CSS dark theme applied globally. At the end of this phase the app should boot, show a placeholder home page, and successfully connect to Firestore.

## **3.2 Scope**

- Initialize the Vite project and install all npm dependencies in a single pass.

- Create the Firebase project (Firestore + Auth) and paste the config.

- Set up React Router with placeholder route components.

- Configure Tailwind CSS with a custom dark color palette.

- Verify Firestore connectivity with a test read/write.

## **3.3 Tasks**

| **#** | **Task** | **Description** | **Output / Deliverable** |
| --- | --- | --- | --- |
| **T1.1** | **Scaffold Vite Project** | Run: npm create vite@latest firewatch -- --template react. Enter project directory. | Project directory created, npm run dev boots successfully |
| **T1.2** | **Install All Dependencies** | npm install firebase recharts tailwindcss @tailwindcss/vite react-router-dom date-fns papaparse | package.json lists all dependencies |
| **T1.3** | **Configure Tailwind** | Add @tailwindcss/vite plugin to vite.config.js. Create tailwind.config.js with dark-mode: 'class'. Add @import 'tailwindcss' to index.css. | Tailwind utility classes work in App.jsx |
| **T1.4** | **Create Firebase Project** | Create project at firebase.google.com. Enable Firestore (test mode). Enable Authentication. Copy the SDK config object. | Firebase console shows project created |
| **T1.5** | **Create Firebase Config File** | Create src/firebase/config.js. Paste config, call initializeApp(). Export db (getFirestore) and auth (getAuth). | No console errors on import |
| **T1.6** | **Create Folder Structure** | Create: src/pages/, src/components/, src/firebase/, src/correlation/, src/utils/, src/hooks/ | All directories exist |
| **T1.7** | **Create Route Skeleton** | In App.jsx configure BrowserRouter with routes: / (Dashboard), /logs (LogExplorer), /alerts (Alerts), /login (Login). Each route renders a placeholder page component. | Navigating to each path shows placeholder text |
| **T1.8** | **Global Layout Component** | Create src/components/Layout.jsx with dark sidebar nav (links to Dashboard, Logs, Alerts) and main content area slot. | Sidebar renders on all routes except /login |
| **T1.9** | **Firestore Connectivity Test** | In Dashboard.jsx temporarily write a test document to Firestore on mount and read it back. Log result to console. | Console shows successful read/write. Remove test code after verification. |

## **3.4 Expected Outcomes & Acceptance Criteria**

| **Expected Outcomes** | **Acceptance Criteria** |
| --- | --- |
| App boots without errors on npm run dev | Browser shows no red error overlay; console is clean |
| Routing works for all four paths | Navigating to /, /logs, /alerts, /login renders different placeholder content |
| Tailwind dark classes render correctly | Background is dark, text is light via Tailwind utility classes |
| Firebase config is loaded | No 'Firebase App not initialized' errors in console |
| Firestore test read/write succeeds | Console log shows the test document data returned from Firestore |

## **3.5 File Outputs**

- src/firebase/config.js

- src/pages/Dashboard.jsx, LogExplorer.jsx, Alerts.jsx, Login.jsx (placeholders)

- src/components/Layout.jsx

- tailwind.config.js, vite.config.js (updated)

# **4. Phase 2 — Authentication System**

| **PHASE 2  Authentication System** |
| --- |
| **Est. Time** | 2–3 hours | **Complexity** | **Low** |

## **4.1 Goal**

Implement a complete authentication system using Firebase Auth. Analysts must be able to sign in via Google or email/password, maintain their session across browser refreshes, and be redirected to the Login page when unauthenticated. All data routes must be protected.

## **4.2 Scope**

- Firebase Auth configuration for Google Sign-In and Email/Password providers.

- Login page UI with both sign-in methods.

- Custom useAuth React hook with onAuthStateChanged listener.

- ProtectedRoute wrapper component for authenticated-only pages.

- Logout functionality accessible from the sidebar.

## **4.3 Tasks**

| **#** | **Task** | **Description** | **Output / Deliverable** |
| --- | --- | --- | --- |
| **T2.1** | **Enable Auth Providers** | In Firebase Console, enable Google Sign-In and Email/Password providers under Authentication > Sign-in method. | Both providers show as Enabled in console |
| **T2.2** | **Auth Helper Functions** | Create src/firebase/auth.js. Export: signInWithGoogle() using GoogleAuthProvider, signInWithEmail(email, pass), signOut(), onAuthChange(callback). | Functions are importable with no errors |
| **T2.3** | **useAuth Hook** | Create src/hooks/useAuth.js. Use onAuthStateChanged to track user state. Export { user, loading }. Set loading=true until first auth state is known. | Hook returns user object after sign-in |
| **T2.4** | **Login Page UI** | Build src/pages/Login.jsx with: FireWatch logo/title, Google Sign-In button, email+password fields, Sign In button, error message display area. Dark theme. | Login page renders at /login |
| **T2.5** | **Connect Auth to Login Page** | Wire Google button to signInWithGoogle(). Wire form submit to signInWithEmail(). On success navigate to /. On error display error.message. | Signing in redirects to dashboard |
| **T2.6** | **ProtectedRoute Component** | Create src/components/ProtectedRoute.jsx. Use useAuth hook. If loading show spinner. If no user redirect to /login. Else render children. | Visiting / without auth redirects to /login |
| **T2.7** | **Wrap Routes in ProtectedRoute** | In App.jsx wrap Dashboard, LogExplorer, and Alerts routes with ProtectedRoute. | All app routes redirect to /login when signed out |
| **T2.8** | **Logout Button** | Add logout button to Layout.jsx sidebar. Call signOut() from auth.js. On logout navigate to /login. | Clicking logout clears session and redirects |
| **T2.9** | **Session Persistence** | Verify Firebase SDK default persistence (LOCAL). Confirm user stays logged in after browser refresh. | After refresh, user is still authenticated |

## **4.4 Expected Outcomes & Acceptance Criteria**

| **Expected Outcomes** | **Acceptance Criteria** |
| --- | --- |
| Google Sign-In works | Clicking Google button opens popup and signs user in |
| Email/Password sign-in works | Valid credentials authenticate; invalid credentials show error |
| Protected routes redirect unauthenticated users | Accessing /logs without auth redirects to /login |
| Session persists across refresh | Refreshing browser while logged in keeps user on dashboard |
| Logout clears session | After logout, navigating to / redirects to /login |

## **4.5 File Outputs**

- src/firebase/auth.js

- src/hooks/useAuth.js

- src/pages/Login.jsx (complete)

- src/components/ProtectedRoute.jsx

- src/components/Layout.jsx (updated with logout)

# **5. Phase 3 — Firestore Data Layer**

| **PHASE 3  Firestore Data Layer** |
| --- |
| **Est. Time** | 3–4 hours | **Complexity** | **Medium** |

## **5.1 Goal**

Define and implement the complete Firestore data layer. This phase produces all database helper functions for reading and writing events and alerts, the two custom React hooks that stream live data, and the Firestore security rules that restrict access to authenticated analysts only. No UI is built in this phase — only data infrastructure.

## **5.2 Scope**

- Firestore collection schema finalization for events/ and alerts/.

- Write helper functions: addEvent(), addAlert(), acknowledgeAlert(), getEvents(), getAlerts().

- Real-time hooks: useEvents() and useAlerts() using onSnapshot().

- Firestore security rules: authenticated reads/writes only.

## **5.3 Firestore Schema Reference**

| **Collection** | **Field** | **Type & Description** |
| --- | --- | --- |
| **events/** | **timestamp** | Firestore Timestamp — time the event occurred |
|  | **source_ip** | String — IP address that generated the event |
|  | **dest_ip** | String — destination IP (optional, empty string if N/A) |
|  | **event_type** | String — one of: failed_login, port_scan, privilege_escalation, successful_login, info |
|  | **severity** | String — one of: critical, high, medium, low, info |
|  | **message** | String — human-readable description |
|  | **raw_log** | String — original unparsed log line |
| **alerts/** | **rule_name** | String — identifier of the triggered correlation rule |
|  | **severity** | String — severity level of the triggered rule |
|  | **source_ip** | String — IP involved in the detected pattern |
|  | **triggered_at** | Firestore Timestamp — when alert was generated |
|  | **related_ids** | Array<String> — event document IDs that triggered the alert |
|  | **acknowledged** | Boolean — false until analyst marks as reviewed |

## **5.4 Tasks**

| **#** | **Task** | **Description** | **Output / Deliverable** |
| --- | --- | --- | --- |
| **T3.1** | **Event Write Function** | Create src/firebase/events.js. Export addEvent(eventData) — normalizes fields, adds a server timestamp, writes to events/ collection. Return the new document ID. | addEvent() writes to Firestore without error |
| **T3.2** | **Alert Write Function** | Create src/firebase/alerts.js. Export addAlert(alertData). Export acknowledgeAlert(alertId) — updates acknowledged: true on the document. | addAlert() and acknowledgeAlert() work correctly |
| **T3.3** | **Query Functions** | In events.js export getRecentEvents(limitN) — returns last N events ordered by timestamp desc. In alerts.js export getUnacknowledgedAlerts() — returns alerts where acknowledged==false. | Query functions return data arrays |
| **T3.4** | **useEvents Hook** | Create src/hooks/useEvents.js. Use onSnapshot on events/ collection ordered by timestamp desc, limited to 200. Return { events, loading, error }. | Hook streams new events to components in real time |
| **T3.5** | **useAlerts Hook** | Create src/hooks/useAlerts.js. Use onSnapshot on alerts/ collection where acknowledged==false, ordered by triggered_at desc. Return { alerts, loading, error }. | Hook streams unacknowledged alerts in real time |
| **T3.6** | **Firestore Security Rules** | In firestore.rules: allow read, write on events/ and alerts/ only if request.auth != null. Deploy rules via Firebase CLI or console. | Unauthenticated requests to Firestore are rejected with permission-denied |
| **T3.7** | **Data Normalizer Utility** | Create src/utils/normalizer.js. Export normalizeEvent(rawData) — maps arbitrary input fields to the standard schema. Missing fields default to empty string or 'info'. | normalizeEvent() handles missing fields gracefully |

## **5.5 Expected Outcomes & Acceptance Criteria**

| **Expected Outcomes** | **Acceptance Criteria** |
| --- | --- |
| Events can be written to Firestore | addEvent() call creates a document visible in Firebase console |
| Alerts can be written and acknowledged | addAlert() creates alert; acknowledgeAlert() sets acknowledged=true |
| useEvents streams live data | Adding a document in Firebase console appears in hook data within 2 seconds |
| useAlerts streams unacknowledged alerts | Acknowledged alerts disappear from hook data immediately |
| Security rules block unauthenticated access | REST API call without auth token returns 403 |

## **5.6 File Outputs**

- src/firebase/events.js

- src/firebase/alerts.js

- src/hooks/useEvents.js

- src/hooks/useAlerts.js

- src/utils/normalizer.js

- firestore.rules (updated)

# **6. Phase 4 — Log Ingestion Module**

| **PHASE 4  Log Ingestion Module** |
| --- |
| **Est. Time** | 4–5 hours | **Complexity** | **Medium** |

## **6.1 Goal**

Build the three log ingestion methods: a manual entry form for pasting individual log lines, a file upload handler for CSV and JSON bulk imports, and a fake log generator that produces realistic security events for testing and demonstrations. All three methods must normalize input and write to Firestore via the Phase 3 helper functions.

## **6.2 Scope**

- ManualEntryForm component with controlled fields for all schema fields.

- FileUpload component supporting CSV (via PapaParse) and JSON files.

- FakeLogGenerator utility with configurable event types and burst mode.

- All ingestion paths call normalizeEvent() then addEvent().

## **6.3 Tasks**

| **#** | **Task** | **Description** | **Output / Deliverable** |
| --- | --- | --- | --- |
| **T4.1** | **Manual Entry Form UI** | Create src/components/ingestion/ManualEntryForm.jsx. Fields: source_ip, dest_ip (optional), event_type (select), severity (select), message, raw_log (textarea). Submit button. | Form renders with all fields |
| **T4.2** | **Manual Entry Submit Logic** | On submit: validate required fields (source_ip, event_type, severity, message). Call normalizeEvent() then addEvent(). Show success toast or error message. Reset form. | Submitting form writes event to Firestore |
| **T4.3** | **CSV File Upload** | Create src/components/ingestion/FileUpload.jsx. Accept .csv and .json files via input[type=file]. Parse CSV with PapaParse. Map each row through normalizeEvent() then batch-write with addEvent(). | Uploading a 10-row CSV writes 10 events |
| **T4.4** | **JSON File Upload** | In FileUpload.jsx handle .json files. Support both a single event object and an array. Parse, normalize, write each event. Show count of imported events. | Uploading a JSON array of 5 events writes 5 documents |
| **T4.5** | **Fake Log Generator** | Create src/utils/fakeLogGenerator.js. Export generateFakeEvent(type) supporting: brute_force_attempt, port_scan, privilege_escalation, successful_login, info. Returns a valid normalized event object with realistic random IPs and timestamps. | generateFakeEvent() returns valid event objects for all types |
| **T4.6** | **Generator UI Controls** | Create src/components/ingestion/FakeLogGenerator.jsx. Buttons: Generate Single Event (dropdown of types), Generate Burst (writes 20 mixed events rapidly). Calls generateFakeEvent() and addEvent(). | Clicking Generate Single writes one event; Burst writes 20 |
| **T4.7** | **Ingestion Page Assembly** | Update src/pages/LogIngestion.jsx (add to router). Render all three components with clear section headers. Add route /ingest to App.jsx and sidebar nav. | Navigating to /ingest shows all three ingestion components |
| **T4.8** | **Upload Progress & Feedback** | Show progress indicator during file upload. Show 'Imported X events successfully' or specific error messages. Disable submit/upload button during processing. | User gets clear feedback on import status |

## **6.4 Expected Outcomes & Acceptance Criteria**

| **Expected Outcomes** | **Acceptance Criteria** |
| --- | --- |
| Manual form writes events to Firestore | Submitted event appears in Firebase console events/ collection |
| CSV upload writes all rows | 20-row CSV produces 20 Firestore documents |
| JSON upload handles both object and array | Both formats import without error |
| Fake log generator produces valid events | Generated events pass normalizeEvent() without undefined fields |
| Burst generator writes 20 events | Firebase console shows 20 new documents after burst |

## **6.5 File Outputs**

- src/pages/LogIngestion.jsx

- src/components/ingestion/ManualEntryForm.jsx

- src/components/ingestion/FileUpload.jsx

- src/components/ingestion/FakeLogGenerator.jsx

- src/utils/fakeLogGenerator.js

# **7. Phase 5 — Correlation Engine**

| **PHASE 5  Correlation Engine** |
| --- |
| **Est. Time** | 4–6 hours | **Complexity** | **High** |

## **7.1 Goal**

Implement the JavaScript-based correlation rule engine. This is the most complex component of FireWatch. Rules analyze incoming events in real time and automatically generate alerts when multi-event attack patterns are detected. The engine runs in the browser, triggered by the useEvents hook whenever new events arrive.

## **7.2 Scope**

- Rule definition schema as JavaScript configuration objects.

- Correlation engine runner that evaluates all rules against new events.

- Four built-in rules: brute force, credential stuffing, port scan, privilege escalation.

- Engine writes alerts to Firestore via addAlert() when a rule fires.

- Deduplication to prevent identical alerts from firing repeatedly.

## **7.3 Correlation Rules Reference**

| **Rule Name** | **Severity** | **Trigger Condition** | **Window** |
| --- | --- | --- | --- |
| **brute_force_detection** | **Critical** | 5+ failed_login events from the same source_ip | 60 seconds |
| **credential_stuffing** | **High** | failed_login followed by successful_login from same source_ip | 300 seconds |
| **port_scan_detection** | **High** | 10+ distinct dest_ip or dest_port values from same source_ip | 30 seconds |
| **privilege_escalation** | **Critical** | failed_login followed by privilege_escalation event type from same user/IP | 120 seconds |

## **7.4 Tasks**

| **#** | **Task** | **Description** | **Output / Deliverable** |
| --- | --- | --- | --- |
| **T5.1** | **Rule Definition Schema** | Create src/correlation/rules.js. Define each rule as an object: { id, name, severity, description, evaluate(events, newEvent) }. evaluate() returns { triggered: bool, relatedIds: [] }. | Rules are importable array of objects |
| **T5.2** | **Brute Force Rule** | Implement brute_force_detection.evaluate(). Filter events to failed_login from newEvent.source_ip within 60s window. If count >= 5, return triggered=true with matching event IDs. | Rule fires after 5 failed logins from same IP in 60s |
| **T5.3** | **Credential Stuffing Rule** | Implement credential_stuffing.evaluate(). Find failed_login from same IP within 300s before a successful_login. Return triggered=true if pattern found. | Rule fires on failed login followed by success from same IP |
| **T5.4** | **Port Scan Rule** | Implement port_scan_detection.evaluate(). Count distinct dest_ip values in events from same source_ip within 30s. If distinct count >= 10, trigger. | Rule fires when same IP hits 10+ distinct destinations |
| **T5.5** | **Privilege Escalation Rule** | Implement privilege_escalation.evaluate(). Find failed_login followed by event_type privilege_escalation from same source_ip within 120s. | Rule fires on failed_login then privilege_escalation pattern |
| **T5.6** | **Engine Runner** | Create src/correlation/engine.js. Export runCorrelationEngine(allEvents, newEvent). Iterates through all rules, calls evaluate(), calls addAlert() for triggered rules. | Engine function processes new events against all rules |
| **T5.7** | **Alert Deduplication** | Before calling addAlert(), check Firestore for an existing unacknowledged alert with the same rule_name and source_ip created within the last 10 minutes. Skip if duplicate found. | Same attack pattern does not produce duplicate alerts |
| **T5.8** | **Hook Integration** | In useEvents hook, after receiving new events via onSnapshot, call runCorrelationEngine() for each new event that has arrived since last snapshot. | New events automatically trigger rule evaluation |
| **T5.9** | **Engine Test via Fake Generator** | Using the Phase 4 fake generator, trigger burst mode with brute_force_attempt type. Verify a Critical alert appears in the alerts/ collection within seconds. | Burst of failed logins produces a Critical alert in Firestore |

## **7.5 Expected Outcomes & Acceptance Criteria**

| **Expected Outcomes** | **Acceptance Criteria** |
| --- | --- |
| Brute force rule fires correctly | 5+ failed logins from same IP in 60s produces Critical alert |
| Credential stuffing rule fires | Failed login then success from same IP produces High alert |
| Port scan rule fires | 10 distinct destinations from same IP in 30s produces High alert |
| Privilege escalation rule fires | failed_login then privilege_escalation from same IP produces Critical alert |
| No duplicate alerts generated | Repeated triggers produce only one alert per 10-minute dedup window |

## **7.6 File Outputs**

- src/correlation/rules.js

- src/correlation/engine.js

- src/hooks/useEvents.js (updated with engine call)

# **8. Phase 6 — Real-Time Dashboard**

| **PHASE 6  Real-Time Dashboard** |
| --- |
| **Est. Time** | 4–5 hours | **Complexity** | **Medium** |

## **8.1 Goal**

Build the main dashboard page that a security analyst sees upon login. The dashboard must display live-updating KPI metrics, a scrolling event feed, and three Recharts visualizations — all driven by the useEvents and useAlerts hooks from Phase 3. Data updates in real time with no manual refresh.

## **8.2 Scope**

- KPI metric cards: total events, critical alerts, unique IPs, events/hour.

- Live event feed table (newest first, auto-scrolling).

- Event timeline line chart — event count per hour for last 24 hours.

- Severity breakdown pie chart — distribution across all five severity levels.

- Top source IPs bar chart — top 10 IPs by event count.

## **8.3 Tasks**

| **#** | **Task** | **Description** | **Output / Deliverable** |
| --- | --- | --- | --- |
| **T6.1** | **Dashboard Layout Grid** | Update src/pages/Dashboard.jsx. Use CSS Grid: top row KPI cards, middle row charts (timeline + pie), bottom section event feed + top IPs bar chart. | Dashboard layout renders without overflow |
| **T6.2** | **KPI Metric Cards** | Create src/components/dashboard/MetricCard.jsx. Props: title, value, icon, colorClass. Render four cards: Total Events (count), Critical Alerts (unacknowledged), Unique IPs (distinct source_ip count), Events/hr (last 60 min). | Four KPI cards display correct computed values |
| **T6.3** | **Live Event Feed Table** | Create src/components/dashboard/EventFeedTable.jsx. Columns: Time, Source IP, Type, Severity, Message. Severity shown as colored badge. Last 50 events. Newest at top. | New events appear at top without page refresh |
| **T6.4** | **Severity Color System** | Create src/utils/severityColors.js. Export getSeverityColor(severity) returning Tailwind class names: critical=red-500, high=orange-500, medium=yellow-500, low=blue-400, info=gray-400. | All severity badges use consistent colors |
| **T6.5** | **Event Timeline Chart** | Create src/components/dashboard/EventTimeline.jsx. Use Recharts LineChart. X-axis: hours (0–23). Y-axis: event count. Data computed from events grouped by hour. Updates when useEvents data changes. | Line chart shows event distribution across 24 hours |
| **T6.6** | **Severity Pie Chart** | Create src/components/dashboard/SeverityPie.jsx. Use Recharts PieChart. One slice per severity level. Legend shows count and percentage. Colors match severity color system. | Pie chart segments match event severity distribution |
| **T6.7** | **Top Source IPs Chart** | Create src/components/dashboard/TopIPsChart.jsx. Use Recharts BarChart. Top 10 source IPs by event count on Y-axis, IP on X-axis. Horizontal layout for readability. | Bar chart shows up to 10 IPs in descending order |
| **T6.8** | **Dashboard Data Wiring** | In Dashboard.jsx import useEvents and useAlerts. Compute all derived values (KPIs, chart data, feed table data) via useMemo. Pass to child components as props. | All dashboard components re-render when new events arrive |
| **T6.9** | **Loading States** | Show skeleton loader or spinner in each chart/table while useEvents loading=true. Hide on data arrival. | Initial load shows loading indicators, then data |

## **8.4 Expected Outcomes & Acceptance Criteria**

| **Expected Outcomes** | **Acceptance Criteria** |
| --- | --- |
| KPI cards show correct computed values | Total events matches Firestore document count; critical alerts matches unacknowledged count |
| Event feed updates live | Using fake generator, new events appear in feed within 2 seconds |
| Timeline chart reflects real data | Chart hours with generated events show non-zero counts |
| Pie chart proportions are accurate | Slice sizes match event severity distribution visually |
| Bar chart ranks IPs correctly | IP with most events appears as tallest bar |

## **8.5 File Outputs**

- src/pages/Dashboard.jsx (complete)

- src/components/dashboard/MetricCard.jsx

- src/components/dashboard/EventFeedTable.jsx

- src/components/dashboard/EventTimeline.jsx

- src/components/dashboard/SeverityPie.jsx

- src/components/dashboard/TopIPsChart.jsx

- src/utils/severityColors.js

# **9. Phase 7 — Alert Management Panel**

| **PHASE 7  Alert Management Panel** |
| --- |
| **Est. Time** | 3–4 hours | **Complexity** | **Medium** |

## **9.1 Goal**

Build the dedicated Alerts page where analysts triage active security alerts. Alerts are sorted by severity and recency, can be acknowledged with a single click, and the full alert history remains accessible even after acknowledgment. Clicking an alert shows the related log events that triggered it.

## **9.2 Scope**

- Active alerts panel: unacknowledged alerts sorted by severity then time.

- Alert detail drawer/modal: shows alert metadata and related event list.

- Acknowledge workflow: one-click dismiss moves alert to history.

- Alert history panel: searchable list of all acknowledged alerts.

## **9.3 Tasks**

| **#** | **Task** | **Description** | **Output / Deliverable** |
| --- | --- | --- | --- |
| **T7.1** | **Alerts Page Layout** | Update src/pages/Alerts.jsx. Split layout: left column Active Alerts, right column Alert Detail (or placeholder). Below: History section. | Alerts page renders two-column layout |
| **T7.2** | **AlertCard Component** | Create src/components/alerts/AlertCard.jsx. Props: alert object. Display: severity badge, rule_name, source_ip, triggered_at (formatted), Acknowledge button. | AlertCard renders all fields correctly |
| **T7.3** | **Active Alerts List** | Create src/components/alerts/ActiveAlertsList.jsx. Use useAlerts hook. Sort alerts: Critical first, then High, then by triggered_at desc. Render AlertCard for each. | Alerts appear sorted by severity |
| **T7.4** | **Acknowledge Action** | Acknowledge button in AlertCard calls acknowledgeAlert(alert.id) from Phase 3. Alert disappears from active list immediately (optimistic update via hook). | Clicking Acknowledge removes alert from active panel within 1 second |
| **T7.5** | **Alert Detail Panel** | Create src/components/alerts/AlertDetail.jsx. Shown when analyst clicks an alert card. Displays: rule description, severity, source_ip, triggered_at, list of related events fetched by their IDs. | Clicking alert shows related events in detail panel |
| **T7.6** | **Related Events Fetch** | In AlertDetail.jsx fetch the event documents listed in alert.related_ids from Firestore. Display each as a mini event row (timestamp, type, message). | Related events load and display in detail panel |
| **T7.7** | **Alert History Section** | Create src/components/alerts/AlertHistory.jsx. Query Firestore for acknowledged=true alerts ordered by triggered_at desc, limited to 100. Show in a read-only table. | History section shows previously acknowledged alerts |
| **T7.8** | **Empty State Handling** | When active alerts list is empty, show: green checkmark icon + 'No active alerts — environment is clear.' message. | Empty state renders when no unacknowledged alerts exist |

## **9.4 Expected Outcomes & Acceptance Criteria**

| **Expected Outcomes** | **Acceptance Criteria** |
| --- | --- |
| Active alerts load and sort correctly | Critical alerts always appear above High alerts |
| Acknowledge removes alert from active list | Acknowledged alert disappears from panel; appears in history |
| Alert detail shows related events | Clicking an alert loads and displays the triggering log events |
| Alert history persists acknowledged alerts | Previously acknowledged alerts remain visible in history |
| Empty state renders when no active alerts | Clear environment message shown when all alerts are acknowledged |

## **9.5 File Outputs**

- src/pages/Alerts.jsx (complete)

- src/components/alerts/AlertCard.jsx

- src/components/alerts/ActiveAlertsList.jsx

- src/components/alerts/AlertDetail.jsx

- src/components/alerts/AlertHistory.jsx

# **10. Phase 8 — Log Explorer & Search**

| **PHASE 8  Log Explorer & Search** |
| --- |
| **Est. Time** | 4–5 hours | **Complexity** | **Medium** |

## **10.1 Goal**

Build the Log Explorer page that allows analysts to search, filter, and investigate all ingested events. This page supports full-text search across key fields, multi-dimension filtering, IP pivot investigation (click an IP to see all its events), and CSV export of any filtered result set.

## **10.2 Scope**

- Search bar: real-time client-side filtering across source_ip, event_type, message.

- Filter controls: severity, event_type, source_ip (dropdown populated from data).

- Paginated events table with sortable columns.

- IP pivot: clicking a source_ip in the table auto-filters to that IP.

- CSV export of current filtered and searched results.

## **10.3 Tasks**

| **#** | **Task** | **Description** | **Output / Deliverable** |
| --- | --- | --- | --- |
| **T8.1** | **Log Explorer Layout** | Update src/pages/LogExplorer.jsx. Top: search bar + filter controls row. Middle: results count + export button. Bottom: events table. | Page layout renders correctly |
| **T8.2** | **Search Bar Component** | Create src/components/explorer/SearchBar.jsx. Controlled input. On change, filter the events array from useEvents by checking if source_ip, event_type, or message includes the search string (case-insensitive). | Typing in search bar filters visible rows live |
| **T8.3** | **Filter Controls** | Create src/components/explorer/FilterControls.jsx. Dropdowns: Severity (all levels + All), Event Type (all types + All), Source IP (unique IPs from data + All). Apply filters cumulatively with search. | Selecting filters narrows displayed results |
| **T8.4** | **Events Table Component** | Create src/components/explorer/EventsTable.jsx. Columns: Timestamp, Source IP (clickable), Dest IP, Type, Severity (badge), Message. Show 50 rows per page with prev/next pagination. | Table renders paginated events with correct columns |
| **T8.5** | **Column Sort** | Clicking column headers (Timestamp, Source IP, Severity) toggles ascending/descending sort. Visual sort indicator (arrow icon) shows current sort column and direction. | Clicking Timestamp header sorts rows chronologically |
| **T8.6** | **IP Pivot on Click** | Clicking a source_ip cell in the table sets the Source IP filter dropdown to that IP value, effectively showing only events from that IP. Show a clear 'Filtering by IP: X.X.X.X' label. | Clicking an IP address filters table to that IP's events |
| **T8.7** | **CSV Export** | Export button triggers download of current filtered+searched events as a CSV file. Use native browser Blob API. Filename: firewatch-logs-YYYY-MM-DD.csv. Columns match table columns. | Clicking Export downloads a valid CSV file |
| **T8.8** | **Results Count** | Display 'Showing X of Y events' above the table where X = filtered count and Y = total event count. | Result count updates as filters are applied |
| **T8.9** | **Alert Pivot Integration** | Accept an optional alertId URL query parameter (?alertId=xxx). When present, pre-fetch the alert's related_ids and pre-filter the table to only show those events. | Navigating from alert detail to /logs?alertId=X shows related events |

## **10.4 Expected Outcomes & Acceptance Criteria**

| **Expected Outcomes** | **Acceptance Criteria** |
| --- | --- |
| Search filters events in real time | Typing '192.168' shows only events with that string in source_ip/message |
| Filters work cumulatively | Selecting severity=Critical AND event_type=failed_login shows only matching events |
| IP pivot works on click | Clicking a source_ip cell applies that IP as a filter |
| CSV export produces valid file | Exported CSV opens in Excel/Sheets with correct columns |
| Alert pivot shows related events | Navigating from alert detail pre-filters table to alert's events |

## **10.5 File Outputs**

- src/pages/LogExplorer.jsx (complete)

- src/components/explorer/SearchBar.jsx

- src/components/explorer/FilterControls.jsx

- src/components/explorer/EventsTable.jsx

# **11. Phase 9 — Time Range Analysis**

| **PHASE 9  Time Range Analysis** |
| --- |
| **Est. Time** | 2–3 hours | **Complexity** | **Medium** |

## **11.1 Goal**

Add a global time range selector that filters all dashboard charts, KPI metrics, and event tables to the selected window. The selector must support preset ranges and a custom date range picker. All components must respond instantly when the time range changes without requiring a page reload.

## **11.2 Scope**

- TimeRangeSelector component with preset buttons and custom date inputs.

- useTimeRange hook that provides current range to all consuming components.

- Update Dashboard, LogExplorer, and Alerts pages to filter by active time range.

- Event rate trend indicator (increasing / decreasing vs. previous window).

## **11.3 Tasks**

| **#** | **Task** | **Description** | **Output / Deliverable** |
| --- | --- | --- | --- |
| **T9.1** | **TimeRangeSelector Component** | Create src/components/TimeRangeSelector.jsx. Preset buttons: Last 1h, Last 6h, Last 24h, Last 7d. Custom: date-from and date-to inputs (type=datetime-local). Highlight active preset. | Clicking a preset updates the selected range visually |
| **T9.2** | **useTimeRange Hook** | Create src/hooks/useTimeRange.js. Stores { from: Date, to: Date } in state. Default: last 24 hours. Exposes setPreset(label) and setCustomRange(from, to). Returns { from, to, label }. | Hook returns correct Date objects for each preset |
| **T9.3** | **Place Selector in Layout** | Add TimeRangeSelector to the Layout.jsx header bar so it is visible on Dashboard, LogExplorer, and Alerts without needing to add it per-page. | Selector is visible on all authenticated pages |
| **T9.4** | **Filter Events by Range** | In useEvents hook, add a timeRange parameter. Filter the onSnapshot results client-side to only include events where timestamp is within from–to. Return filtered array. | Changing time range updates event count in real time |
| **T9.5** | **Dashboard Charts Respond** | Pass filtered events to all dashboard chart components. Charts recompute data derived from the filtered events whenever time range changes. | Timeline chart shows only events in the selected window |
| **T9.6** | **LogExplorer Responds** | Events table in LogExplorer respects active time range filter in addition to search and dropdown filters. | Table event count matches selected time window |
| **T9.7** | **Alerts Respond** | Alert history section filters by triggered_at within selected time range. | Alert history shows only alerts from selected period |
| **T9.8** | **Trend Indicator** | In Dashboard KPI area, show an event rate trend badge: compare event count in current window to the previous equal-length window. Display up/down arrow with percentage change. | Trend badge shows correct percentage with arrow direction |

## **11.4 Expected Outcomes & Acceptance Criteria**

| **Expected Outcomes** | **Acceptance Criteria** |
| --- | --- |
| Preset buttons change the time range | Clicking 'Last 1h' shows only events from the past hour across all views |
| Custom range picker works | Setting a custom from/to date filters data to that exact window |
| All dashboard components respond | Charts, KPIs, and feed table all update when range changes |
| Log Explorer respects time range | Events table filtered by both time range and search/filter controls |
| Trend indicator is accurate | Trend percentage matches ratio of current-window to previous-window event count |

## **11.5 File Outputs**

- src/components/TimeRangeSelector.jsx

- src/hooks/useTimeRange.js

- src/hooks/useEvents.js (updated with timeRange param)

- src/components/Layout.jsx (updated with selector)

# **12. Phase 10 — Polish, Testing & Deployment**

| **PHASE 10  Polish, Testing & Deployment** |
| --- |
| **Est. Time** | 3–4 hours | **Complexity** | **Low** |

## **12.1 Goal**

Finalize the project for portfolio presentation. This phase covers UI consistency improvements, hardening Firestore security rules for production, running a functional end-to-end test using the fake log generator, and deploying the application to Firebase Hosting with a public URL.

## **12.2 Scope**

- UI consistency pass: spacing, typography, color uniformity across all pages.

- Firestore security rules: production-ready (restrict writes to event schema only).

- End-to-end functional test using the fake log generator.

- Firebase Hosting deployment: public URL ready to share.

- README.md with setup instructions and feature overview.

## **12.3 Tasks**

| **#** | **Task** | **Description** | **Output / Deliverable** |
| --- | --- | --- | --- |
| **T10.1** | **UI Consistency Audit** | Review all pages for: consistent padding/margin (use Tailwind spacing scale), consistent font sizes (use defined scale), correct severity colors everywhere, no raw inline styles. | All pages use consistent Tailwind utility classes |
| **T10.2** | **Responsive Sidebar** | Ensure Layout sidebar collapses to icon-only mode on narrow viewports (< 1024px). Add a hamburger toggle button. | Sidebar is usable on a 1024px width browser window |
| **T10.3** | **Error Boundary** | Wrap Dashboard, LogExplorer, and Alerts in a React ErrorBoundary component. Show a friendly error card instead of blank white page on unhandled errors. | Throwing an error in Dashboard renders error card not blank screen |
| **T10.4** | **Harden Firestore Rules** | Update firestore.rules to: validate required event fields on write (source_ip, event_type, severity must exist and be strings). Block writes that don't match schema. | Malformed write attempts are rejected by Firestore rules |
| **T10.5** | **End-to-End Test** | Manual test sequence: (1) Sign in, (2) Generate burst of brute_force events, (3) Verify alert appears, (4) Acknowledge alert, (5) Verify it moves to history, (6) Search in Log Explorer, (7) Change time range, (8) Export CSV. | All 8 steps complete without errors |
| **T10.6** | **Install Firebase CLI** | npm install -g firebase-tools. Run firebase login. Run firebase init hosting (select public: dist, single-page: yes). Run npm run build. Run firebase deploy. | Firebase deploy outputs a live .web.app URL |
| **T10.7** | **Verify Live Deployment** | Open the deployed URL in an incognito browser. Sign in, generate events, verify dashboard updates, verify all routes work. | All features work identically on the deployed URL |
| **T10.8** | **Write README.md** | Create README.md in project root. Sections: Project Overview, Features, Tech Stack, Quick Start (setup steps), Firebase Setup Guide, Screenshots placeholder, License (MIT). | README.md is complete and clear for a new developer |
| **T10.9** | **Final GitHub Push** | git add -A. git commit -m 'feat: complete FireWatch SIEM v1.0'. git push origin main. Verify repo is public. | GitHub repo is public with all files committed |

## **12.4 Expected Outcomes & Acceptance Criteria**

| **Expected Outcomes** | **Acceptance Criteria** |
| --- | --- |
| UI is visually consistent | No obvious padding/color inconsistencies between pages |
| Firestore rules block malformed writes | Write attempt missing severity field is rejected |
| End-to-end test passes all 8 steps | Full analyst workflow completes without console errors |
| App is live on Firebase Hosting | Public .web.app URL loads and all features work |
| README is complete | A developer can set up the project from README alone |

## **12.5 File Outputs**

- firestore.rules (production version)

- .firebaserc, firebase.json (hosting config)

- README.md

- dist/ (production build — not committed to git)

# **13. Appendix — Quick Reference**

## **13.1 Complete File Map**

| **File Path** | **Phase** | **Purpose** |
| --- | --- | --- |
| **src/firebase/config.js** | 1 | Firebase initialization and exports |
| **src/firebase/auth.js** | 2 | Auth helper functions |
| **src/firebase/events.js** | 3 | Firestore event read/write helpers |
| **src/firebase/alerts.js** | 3 | Firestore alert read/write/acknowledge helpers |
| **src/hooks/useAuth.js** | 2 | Auth state listener hook |
| **src/hooks/useEvents.js** | 3+5+9 | Real-time events stream hook |
| **src/hooks/useAlerts.js** | 3 | Real-time alerts stream hook |
| **src/hooks/useTimeRange.js** | 9 | Global time range state hook |
| **src/correlation/rules.js** | 5 | Correlation rule definitions |
| **src/correlation/engine.js** | 5 | Rule engine runner |
| **src/utils/normalizer.js** | 3 | Event field normalization |
| **src/utils/fakeLogGenerator.js** | 4 | Realistic fake event generator |
| **src/utils/severityColors.js** | 6 | Severity-to-color mapping |
| **src/pages/Login.jsx** | 2 | Login page |
| **src/pages/Dashboard.jsx** | 6 | Main dashboard |
| **src/pages/LogIngestion.jsx** | 4 | Log ingestion page |
| **src/pages/LogExplorer.jsx** | 8 | Log search and filter page |
| **src/pages/Alerts.jsx** | 7 | Alert management page |
| **src/components/Layout.jsx** | 1+9 | Global layout with sidebar and nav |
| **src/components/ProtectedRoute.jsx** | 2 | Auth guard for routes |
| **src/components/TimeRangeSelector.jsx** | 9 | Global time range picker |
| **firestore.rules** | 3+10 | Firestore security rules |
| **README.md** | 10 | Project documentation |

## **13.2 Dependency Reference**

| **Package** | **Version** | **Usage** |
| --- | --- | --- |
| **react** | 18.x | UI library — all components |
| **vite** | 5.x | Build tool and dev server |
| **firebase** | 10.x (SDK v9) | Firestore, Auth, Hosting |
| **recharts** | 2.x | Line chart, PieChart, BarChart on dashboard |
| **tailwindcss** | 3.x | All styling via utility classes |
| **react-router-dom** | 6.x | Client-side routing |
| **papaparse** | 5.x | CSV file parsing in FileUpload |
| **date-fns** | 3.x | Date formatting and time window calculations |

## **13.3 Inter-Phase Dependency Summary**

| **Phase** | **Depends On** | **Notes** |
| --- | --- | --- |
| **Phase 1** | None | Pure setup — no code dependencies |
| **Phase 2** | Phase 1 | Requires Firebase config from Phase 1 |
| **Phase 3** | Phase 1, 2 | Requires auth for Firestore rules; Firebase config |
| **Phase 4** | Phase 3 | Uses addEvent() and normalizeEvent() from Phase 3 |
| **Phase 5** | Phase 3, 4 | Uses addAlert() from Phase 3; tested with Phase 4 generator |
| **Phase 6** | Phase 3, 5 | Uses useEvents, useAlerts hooks; alerts from Phase 5 |
| **Phase 7** | Phase 3, 5 | Uses useAlerts hook and acknowledgeAlert() from Phase 3 |
| **Phase 8** | Phase 3, 4 | Uses useEvents hook; pivots to alert detail from Phase 7 |
| **Phase 9** | Phases 3, 6, 7, 8 | Wraps all data-displaying pages with time filter |
| **Phase 10** | All phases | Final polish and deployment — no new components |

FireWatch SIEM  —  Product Requirements Document  —  v1.0

Built with React + Firebase  |  Portfolio Project  |  10 Phases  |  AI-Agent Optimized
