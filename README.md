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

The system flowchart illustrates the hierarchical module structure of the Salon CRM — showing how features are organized into system modules, sub-modules, and data storage components.

```mermaid
graph TD
    CRM["Salon CRM System"] --> UI["User Interface Module"]
    CRM --> AUTH["Authentication Module"]
    CRM --> CUSTOMER["Customer Module"]
    CRM --> ADMIN["Admin Module"]
    CRM --> EMAIL["Email Notification System"]
    CRM --> DATA["Data Storage Layer"]

    UI --> LP["Landing Page"]
    UI --> LG["Login Page"]
    UI --> REG["Registration Page"]
    UI --> DASH["Dashboard"]

    AUTH --> AL["Login Processing"]
    AUTH --> AR["Registration Processing"]
    AUTH --> AUTH_DB[(User Accounts<br/>Database)]

    CUSTOMER --> BW["Booking Wizard"]
    CUSTOMER --> SH["Service History"]
    CUSTOMER --> PM["Profile Management"]
    BW --> BS["Select Service"]
    BW --> BST["Choose Stylist"]
    BW --> BDT["Pick Date / Time"]
    BW --> BC["Confirm Booking"]

    ADMIN --> AQ["Appointment Queue"]
    ADMIN --> CM["Customer Management"]
    ADMIN --> SR["Service Recording"]
    ADMIN --> SD["Staff Directory"]
    ADMIN --> CCA["Create Customer Account"]

    EMAIL --> ECR["Booking Confirmation"]
    EMAIL --> ECN["Cancellation Notice"]
    EMAIL --> ECP["Completion Notice"]

    DATA --> DB_A[(Appointments<br/>Database)]
    DATA --> DB_C[(Customers<br/>Database)]
    DATA --> DB_S[(Service History<br/>Database)]
    DATA --> DB_E[(Email Log<br/>Database)]
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
