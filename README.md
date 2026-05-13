# Salon CRM

A premium salon CRM with customer booking, admin dashboard, analytics, and staff management -- built with React 19, TypeScript, Tailwind CSS v4, and Vite.

## Features

- **Landing Page** -- Hero stats, services grid with category filter, testimonials, staff directory
- **Customer Dashboard** -- Stats cards, service history carousel with drag/swipe, upcoming appointments, booking modal (4-step flow)
- **Admin Dashboard** -- Revenue chart, customer database with search, appointment queue with complete/cancel, service recording, staff directory
- **Authentication** -- Role selector (Customer/Admin), demo credentials hint
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

The system flowchart illustrates how browser requests, page processes, databases, account creation, and display outputs interact within the Salon CRM. Customer accounts can be created from two entry points: website self-registration and admin panel.

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
    ADMIN_VIEW --> MANAGE_ADM[Admin Manages<br/>Revenue / Customers /<br/>Appointments / Services]
    CUSTOMER_VIEW --> MANAGE_CUST[Customer Browses<br/>Stats / History /<br/>Bookings / Profile]
    MANAGE_ADM --> STORE_ADM[(Persistent Data<br/>Database)]
    MANAGE_CUST --> STORE_CUST[(User Records<br/>Database)]
    STORE_ADM --> SEED_IN[(Preloaded Seed<br/>Data Database)]
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

    SEED_IN --> RETRIEVE[Retrieve and Assemble<br/>Formatted Data]
    RETRIEVE --> MERGE[Aggregate Admin and Customer Data]
    MERGE --> FINAL[/Final Page Output<br/>Displayed to User/]
    FINAL --> SYS_END([End])
```

## Process Flowchart

The process flowchart documents the step-by-step sequence of user tasks within the Salon CRM -- assuming the customer already has an account, from sign-in through role-based operations.

```mermaid
graph TD
    P_START([Start]) --> BROWSE[Browse Landing Page<br/>View Services and Staff]
    BROWSE --> BOOK{Book Now?}
    BOOK -->|No| BROWSE
    BOOK -->|Yes| LOGIN[Open Login Page]
    LOGIN --> ROLE[Select User Role<br/>Customer or Admin]
    ROLE --> EMAIL[Type Email Address]
    EMAIL --> CHECK{Email Provided?}
    CHECK -->|No| EMAIL
    CHECK -->|Yes| AUTH[Log User into System]
    AUTH --> IS_ADMIN{Is User<br/>Admin?}
    IS_ADMIN -->|Yes| ADMIN_DASH[Display Admin Dashboard]
    IS_ADMIN -->|No| CUST_DASH[Display Customer Dashboard]
    ADMIN_DASH --> ADMIN_OPS[Manage Revenue, Customers,<br/>Appointments, and Services]
    CUST_DASH --> CUST_OPS[Browse History,<br/>Book Appointment, View Profile]
    ADMIN_OPS --> CONT{Continue?}
    CUST_OPS --> CONT
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
