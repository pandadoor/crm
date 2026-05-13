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

The system flowchart illustrates how browser requests, page processes, databases, email notifications, account creation, and display outputs interact within the Salon CRM. Customer accounts can be created from two entry points: website self-registration and admin panel.

```mermaid
graph TD
    SYS_START([Start]) --> REQ_IN[/Browser Sends URL Request/]
    REQ_IN --> RESOLVE[Resolve URL to Matching Route]
    RESOLVE --> FOUND{Route match<br/>found?}
    FOUND -->|Yes| LOAD[Load Page Components]
    FOUND -->|No| HOME_REDIR[Redirect to Home Page]
    HOME_REDIR --> RESOLVE
    LOAD --> CHECK_AUTH{Page requires<br/>login?}
    CHECK_AUTH -->|No| PUBLIC[/Landing Page<br/>Displayed to User/]
    CHECK_AUTH -->|Yes| LOGIN[/Login Form<br/>Displayed to User/]
    LOGIN --> USER_TYPES[/User Types<br/>Email and Password\]
    USER_TYPES --> INSPECT_LOGIN((Route<br/>Connector))
    INSPECT_LOGIN --> FILLED{Email field<br/>filled?}
    FILLED -->|No| USER_TYPES
    FILLED -->|Yes| LOG_USER_IN[Log User Into<br/>the System]
    LOG_USER_IN --> ADMIN_YES{Is user the<br/>salon admin?}
    ADMIN_YES -->|Yes| ADMIN_DASH[[Admin Dashboard<br/>Subprocess]]
    ADMIN_YES -->|No| CUSTOMER_DASH[[Customer Dashboard<br/>Subprocess]]
    ADMIN_DASH --> ADMIN_TOOLS[Run Admin<br/>Operations]
    CUSTOMER_DASH --> CUSTOMER_TOOLS[Run Customer<br/>Operations]
    ADMIN_TOOLS --> ADMIN_VIEW[/Admin Dashboard<br/>Displayed on Screen/]
    CUSTOMER_TOOLS --> CUSTOMER_VIEW[/Customer Dashboard<br/>Displayed on Screen/]
    ADMIN_VIEW --> MANAGE_ADM[Admin Manages<br/>Appointments / Customers /<br/>Services / Staff]
    CUSTOMER_VIEW --> MANAGE_CUST[Customer Browses<br/>History / Bookings /<br/>Profile]
    MANAGE_ADM --> EMAIL_ADM{{Send Email<br/>Notification}}
    MANAGE_CUST --> EMAIL_CUST{{Send Email<br/>Notification}}
    EMAIL_ADM --> LOG_ADM[(Email Log<br/>Database)]
    EMAIL_CUST --> LOG_CUST[(Email Log<br/>Database)]
    EMAIL_ADM --> STORE_ADM[(Persistent Data<br/>Database)]
    EMAIL_CUST --> STORE_CUST[(User Records<br/>Database)]
    LOG_ADM --> SEED_IN[(Preloaded Seed<br/>Data Database)]
    LOG_CUST --> SEED_IN
    STORE_ADM --> SEED_IN
    STORE_CUST --> SEED_IN

    LOGIN --> NEW_USER{New user?}
    NEW_USER -->|Yes| REG_FORM[/Registration Form<br/>Displayed to User/]
    NEW_USER -->|No| USER_TYPES
    REG_FORM --> REG_INPUT[/User Enters<br/>Name Email Phone\]
    REG_INPUT --> REG_SAVE[Create Customer<br/>Account Record]
    REG_SAVE --> REG_STORE[(Customer Database)]
    REG_SAVE --> AUTO_LOGIN[Auto-Login and<br/>Redirect to Dashboard]
    AUTO_LOGIN --> CUSTOMER_DASH

    ADMIN_DASH --> CREATE_CUST[Admin Opens<br/>Create Customer Form]
    CREATE_CUST --> ADMIN_REG[/Admin Fills<br/>Name Email Phone\]
    ADMIN_REG --> ADMIN_SAVE[Create Customer<br/>Account Record]
    ADMIN_SAVE --> REG_STORE
    ADMIN_SAVE --> ADMIN_DASH

    RETRIEVE[Retrieve and Assemble<br/>Formatted Data]
    RETRIEVE --> MERGE[Aggregate Admin and Customer Data]
    MERGE --> FINAL[/Final Page Output<br/>Displayed to User/]
    FINAL --> SYS_END([End])
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
