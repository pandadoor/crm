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

The system flowchart illustrates the overall architecture of the Salon CRM — showing how users, processes, system modules, databases, and outputs interact to deliver scheduling, email notifications, and service history tracking. The system supports two account creation paths: website self-registration and admin-panel creation.

```mermaid
graph TD
    %% ── USER MODULE ──
    subgraph USER_INTERFACE["User Interface"]
        UI_START([Start])
        UI_BROWSE[Browse Landing Page]
        UI_LOGIN[/Display Login Form/]
        UI_REG[/Display Registration Form/]
        UI_DASH[/Display Dashboard/]
    end

    subgraph AUTH["Authentication"]
        AUTH_LOGIN[Process Login Credentials]
        AUTH_REG[Register New User]
        AUTH_CHECK{Valid Credentials?}
        AUTH_ROLE{Admin or<br/>Customer?}
        AUTH_STORE[(User Accounts<br/>Database)]
    end

    subgraph CUSTOMER_MODULE["Customer Module"]
        CUST_BOOK[Booking Wizard]
        CUST_SVC[Select Service]
        CUST_STYL[Choose Stylist]
        CUST_DATE[Pick Date / Time]
        CUST_CONFIRM[Confirm Booking]
        CUST_HIST[View Service History]
        CUST_PROFILE[Manage Profile]
    end

    subgraph ADMIN_MODULE["Admin Module"]
        ADM_QUEUE[Manage Appointment Queue]
        ADM_CUSTOMERS[Manage Customer Database]
        ADM_SERVICES[Record Services]
        ADM_STAFF[Manage Staff Directory]
        ADM_CREATE[Create Customer Account]
    end

    subgraph EMAIL["Email Notification System"]
        EMAIL_CONFIRM[[Send Booking Confirmation]]
        EMAIL_CANCEL[[Send Cancellation Notice]]
        EMAIL_COMPLETE[[Send Completion Notice]]
    end

    subgraph DATA["Data Storage"]
        DB_APPTS[(Appointments<br/>Database)]
        DB_CUSTOMERS[(Customers<br/>Database)]
        DB_SERVICES[(Service History<br/>Database)]
        DB_EMAIL[(Email Log<br/>Database)]
    end

    %% ── MAIN SYSTEM FLOW ──
    UI_START --> UI_BROWSE
    UI_BROWSE --> UI_LOGIN
    UI_LOGIN --> AUTH_LOGIN
    AUTH_LOGIN --> AUTH_CHECK
    AUTH_CHECK -->|No| UI_REG
    AUTH_CHECK -->|Yes| AUTH_ROLE
    UI_REG --> AUTH_REG
    AUTH_REG --> AUTH_STORE
    AUTH_REG --> UI_DASH
    AUTH_STORE --> AUTH_REG

    %% ── CUSTOMER PATH ──
    AUTH_ROLE -->|Customer| CUST_BOOK
    CUST_BOOK --> CUST_SVC
    CUST_SVC --> CUST_STYL
    CUST_STYL --> CUST_DATE
    CUST_DATE --> CUST_CONFIRM
    CUST_CONFIRM --> DB_APPTS
    CUST_CONFIRM --> EMAIL_CONFIRM
    EMAIL_CONFIRM --> DB_EMAIL
    DB_APPTS --> CUST_HIST
    CUST_HIST --> DB_SERVICES
    CUST_HIST --> CUST_PROFILE

    %% ── ADMIN PATH ──
    AUTH_ROLE -->|Admin| ADM_QUEUE
    ADM_QUEUE --> DB_APPTS
    ADM_QUEUE --> ADM_CUSTOMERS
    ADM_CUSTOMERS --> DB_CUSTOMERS
    ADM_CUSTOMERS --> ADM_SERVICES
    ADM_SERVICES --> DB_SERVICES
    ADM_SERVICES --> EMAIL_COMPLETE
    EMAIL_COMPLETE --> DB_EMAIL
    ADM_CUSTOMERS --> ADM_STAFF
    ADM_CUSTOMERS --> ADM_CREATE
    ADM_CREATE --> DB_CUSTOMERS

    %% ── FEEDBACK LOOPS ──
    DB_SERVICES --> CUST_HIST
    DB_APPTS --> ADM_QUEUE
    DB_CUSTOMERS --> ADM_CUSTOMERS
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
