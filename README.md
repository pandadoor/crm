# Salon CRM

A salon CRM focused on scheduling, automated email notifications, and service history tracking -- built with React 19, TypeScript, Tailwind CSS v4, and Vite.

## Features

- **Landing Page** -- Services grid with category filter, staff directory, testimonials
- **Customer Dashboard** -- Service history timeline, upcoming appointments, booking wizard, email notification log
- **Admin Dashboard** -- Appointment queue with complete/cancel, customer database, service recording, staff directory, email notification feed
- **Authentication** -- Role selector (Customer/Admin), self-registration, demo credentials
- **Automated Email Reachout** -- Email notifications sent on booking, cancellation, completion, and reminders
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
    A([🌐 Browser Request]) --> B[Resolve URL Route]
    B --> C{Route Found?}
    C -->|No| D[Redirect to Home]
    D --> A
    C -->|Yes| E[Load Page Components]
    E --> F{Auth Required?}
    F -->|No| G[/Landing Page<br/>Displayed to User/]
    G --> Z([End])
    F -->|Yes| H[/Login Form<br/>Displayed/]
    H --> I{Email &<br/>Password Provided?}
    I -->|No| H
    I -->|Yes| J[Authenticate User<br/>Select Role]
    J --> K{Is Admin?}
    K -->|Yes| L[Admin Dashboard]
    K -->|No| M[Customer Dashboard]

    L --> N[Admin Operations]
    N --> O{Admin Action}
    O -->|View Revenue| O1[Revenue Metrics]
    O -->|Manage Customers| O2[Customer Directory]
    O -->|View Appointments| O3[Appointment Queue]
    O -->|Record Service| O4[Service Recording Form]
    O1 --> P1[(localStorage:<br/>appointments, customers,<br/>services, emailLog)]
    O2 --> P1
    O3 --> P1
    O4 --> P1

    M --> Q[Customer Operations]
    Q --> R{Customer Action}
    R -->|View Stats| R1[Stats Cards]
    R -->|View History| R2[Service History]
    R -->|Book Appointment| R3[4-Step Booking Wizard]
    R -->|Edit Profile| R4[Profile Management]
    R1 --> P2[(localStorage:<br/>appointments, customers,<br/>services, emailLog)]
    R2 --> P2
    R3 --> P2
    R4 --> P2

    P1 --> S[/Admin Dashboard<br/>Rendered/]
    P2 --> T[/Customer Dashboard<br/>Rendered/]
    S --> U([Session End])
    T --> U
```

## Process Flowchart

The process flowchart documents the step-by-step sequence of user tasks within the Salon CRM -- from browsing services through registration, booking, and history review.

```mermaid
graph TD
    P_START([Start]) --> BROWSE[Browse Landing Page<br/>View Services and Staff]
    BROWSE --> REGISTER[Register / Create Account]
    REGISTER --> EXISTS{Account<br/>Exists?}
    EXISTS -->|No| CREATE_ACCT[Fill Registration Form<br/>Name / Email / Phone]
    CREATE_ACCT --> SAVE_ACCT[Save Customer Record]
    SAVE_ACCT --> LOGIN[Log into System]
    EXISTS -->|Yes| LOGIN
    LOGIN --> BOOK[Start Booking Process]
    BOOK --> PICK_SVC[Select Service Type]
    PICK_SVC --> PICK_STYL[Choose Stylist]
    PICK_STYL --> PICK_DATE[Pick Date and Time]
    PICK_DATE --> CONFIRM[Review and Confirm<br/>Booking Details]
    CONFIRM --> SAVED{Booking<br/>Saved?}
    SAVED -->|No| CONFIRM
    SAVED -->|Yes| SEND_EMAIL[Send Confirmation<br/>Email Notification]
    SEND_EMAIL --> HISTORY[Browse Service History]
    HISTORY --> VIEW_HIST[View Past Appointments<br/>and Service Records]
    VIEW_HIST --> CONT{Continue?}
    CONT -->|Yes| BROWSE
    CONT -->|No| P_END([End])
```

## Project Structure

```
src/
├── components/     # Shared components (Navbar, Footer, ServiceCard, etc.)
├── context/        # React context (SalonContext)
├── pages/          # Route pages (LandingPage, Login, CustomerDashboard, AdminDashboard)
├── types/          # TypeScript interfaces
└── vite-env.d.ts   # Vite type declarations
```
