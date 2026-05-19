# Salon CRM

A salon CRM focused on scheduling, automated email notifications, and service history tracking -- built with React 19, TypeScript, Tailwind CSS v4, and Vite.

## Features

- **Landing Page** -- Services grid with category filter, staff directory, testimonials
- **Customer Dashboard** -- Service history timeline, upcoming appointments, booking wizard, email notification log
- **Admin Dashboard** -- Appointment queue with complete/cancel, customer database, service recording, staff directory, email notification feed
- **3-Role RBAC** -- Admin (full access), Staff (approvals + walk-in), Client (book & track)
- **Booking Approval Workflow** -- Web booking → pending → approve/reject with reason → customer notified
- **Walk-In Booking** -- Staff can book walk-ins, skip approval (auto-approved)
- **Audit Trail** -- Append-only activity log, searchable by action/email/date
- **Maintenance Panels** -- Admin CRUD for services, time slots, categories, staff
- **Authentication** -- Role selector (Admin/Staff/Client), self-registration, demo credentials
- **Automated Email Reachout** -- Email notifications on booking, approval, rejection, cancellation, completion
- **Service History** -- Timeline-style history view with category filters, expandable details
- **Account Creation** -- Self-registration from website or admin-panel creation
- **Responsive** -- Full mobile support with glassmorphism UI

## Stack

- React 19 + TypeScript
- Vite 8 + SWC
- Tailwind CSS v4 (`@tailwindcss/vite`) + `tw-animate-css`
- Framer Motion
- Lucide React icons
- React Router v7

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Demo Accounts

| Role     | Email                  | Password   |
|----------|------------------------|------------|
| Customer | customer@example.com   | any        |
| Staff    | staff@salon.com        | any        |
| Admin    | admin@salon.com        | any        |

## Scripts

| Command           | Description            |
|-------------------|------------------------|
| `npm run dev`     | Start dev server       |
| `npm run build`   | Production build       |
| `npm run preview` | Preview production     |
| `npm run lint`    | Run ESLint             |
| `tsc --noEmit`    | TypeScript check       |

## System Flowchart

The system flowchart illustrates the end-to-end request flow within the Salon CRM — from browser request through routing, authentication, role-based UI rendering, client-side data persistence via localStorage, and page output.

```mermaid
graph TD
    A([Browser Request]) --> B[Resolve URL Route]
    B --> C{Route Found?}
    C -->|No| D[Redirect to Home]
    D --> A
    C -->|Yes| E[Load Page Components]
    E --> F{Auth Required?}
    F -->|No| G[/Landing Page/]
    G --> Z([End])
    F -->|Yes| H[/Login Form/<br/>Role Selector/]
    H --> I{Credentials<br/>Provided?}
    I -->|No| H
    I -->|Yes| J[Authenticate User]
    J --> K{Role?}
    K -->|Admin| L[Admin Dashboard]
    K -->|Staff| S[Staff Dashboard]
    K -->|Client| M[Customer Dashboard]

    L --> L0{Admin Action}
    L0 -->|Overview| L1[Stats + Activity Feed]
    L0 -->|Approvals| L2[Pending Queue → Approve/Reject]
    L0 -->|Walk-In| L3[Walk-In Booking Form]
    L0 -->|Customers| L4[Customer Directory + Create]
    L0 -->|Appointments| L5[All Appointments Grid]
    L0 -->|Services| L6[Service History + Recording]
    L0 -->|Staff| L7[Staff Directory]
    L0 -->|Audit Log| L8[Searchable Activity Log]
    L0 -->|Maintenance| L9[CRUD: Services/Slots/Categories]
    L1 --> DB[(localStorage)]
    L2 --> DB
    L3 --> DB
    L4 --> DB
    L5 --> DB
    L8 --> DB
    L9 --> DB

    S --> S0{Staff Action}
    S0 -->|Overview| S1[Stats + Pending Alerts]
    S0 -->|Approvals| S2[Pending Queue → Approve/Reject]
    S0 -->|Walk-In| S3[Walk-In Booking Form]
    S0 -->|Schedule| S4[Today's Appointments + Complete]
    S1 --> DB
    S2 --> DB
    S3 --> DB
    S4 --> DB

    M --> C0{Customer Action}
    C0 -->|Stats| C1[Status Badges: Pending/Approved/Rejected]
    C0 -->|History| C2[Service Timeline with Filters]
    C0 -->|Book| C3[4-Step Booking → Status: Pending]
    C0 -->|Profile| C4[Edit Name/Phone]
    C1 --> DB
    C2 --> DB
    C3 --> DB
    C4 --> DB

    DB --> L_OUT[/Admin Dashboard/]
    DB --> S_OUT[/Staff Dashboard/]
    DB --> C_OUT[/Customer Dashboard/]
    L_OUT --> END([Session End])
    S_OUT --> END
    C_OUT --> END
```

## Process Flowchart

The process flowchart documents the step-by-step sequence of user tasks within the Salon CRM -- from browsing services through registration, booking, and history review.

```mermaid
graph TD
    START([Start]) --> LANDING[Browse Landing Page<br/>Services/Stylists/Testimonials]
    LANDING --> ROLE{User Role?}

    ROLE -->|Client| CLIENT_LOGIN[Login as Client]
    CLIENT_LOGIN --> BOOK[Start Booking]
    BOOK --> PICK_SVC[Select Service]
    PICK_SVC --> PICK_STYL[Choose Stylist]
    PICK_STYL --> PICK_DATE[Pick Date & Time]
    PICK_DATE --> CONFIRM[Review & Confirm]
    CONFIRM --> SAVED{Booked?}
    SAVED -->|No| CONFIRM
    SAVED -->|Yes| PENDING[Status: Pending]
    PENDING --> NOTIFY_PENDING[Email: Booking Received]
    NOTIFY_PENDING --> WAIT{Staff/Admin<br/>Approves?}
    WAIT -->|Approve| APPROVED[Status: Approved]
    APPROVED --> EMAIL_APPROVED[Email: Booking Confirmed]
    APPROVED --> SERVICE_DAY[Attend Appointment]
    SERVICE_DAY --> COMPLETE[Status: Completed]
    WAIT -->|Reject| REJECTED[Status: Rejected]
    REJECTED --> EMAIL_REJECTED[Email: Reason Provided]
    REJECTED --> BOOK

    ROLE -->|Staff| STAFF_LOGIN[Login as Staff]
    STAFF_LOGIN --> STAFF_VIEW{Staff Action}
    STAFF_VIEW -->|Approve/Reject| APPROVE_ACTION[Pending Queue]
    APPROVE_ACTION --> WAIT
    STAFF_VIEW -->|Walk-In| WALKIN[Walk-In Form]
    WALKIN --> AUTO_APPROVED[Auto-Approved]
    AUTO_APPROVED --> EMAIL_APPROVED
    STAFF_VIEW -->|Schedule| TODAY_VIEW[Today's Appointments]
    TODAY_VIEW --> COMPLETE

    ROLE -->|Admin| ADMIN_LOGIN[Login as Admin]
    ADMIN_LOGIN --> ADMIN_VIEW{Admin Action}
    ADMIN_VIEW -->|Approve/Reject| ADMIN_APPROVE[Pending Queue]
    ADMIN_APPROVE --> WAIT
    ADMIN_VIEW -->|Walk-In| ADMIN_WALKIN[Walk-In Form]
    ADMIN_WALKIN --> AUTO_APPROVED
    ADMIN_VIEW -->|Audit Log| AUDIT[Searchable Activity Log]
    ADMIN_VIEW -->|Maintenance| MAINT[CRUD: Services/Slots/Categories]
    AUDIT --> ADMIN_LOGIN
    MAINT --> ADMIN_LOGIN

    COMPLETE --> HISTORY[Browse Service History]
    HISTORY --> CONT{Continue?}
    CONT -->|Yes| LANDING
    CONT -->|No| END([End])
```

## Project Structure

```
src/
├── components/     # Shared components (Navbar, Footer, ServiceCard, StatsCard, AuditLogView, MaintenancePanel)
├── context/        # React context (SalonContext) — RBAC, audits, booking approval, maintenance CRUD
├── pages/          # Route pages (LandingPage, Login, CustomerDashboard, StaffDashboard, AdminDashboard)
├── types/          # TypeScript interfaces (UserRole, BookingStatus, AuditLogEntry, etc.)
└── vite-env.d.ts   # Vite type declarations
```
