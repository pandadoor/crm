# Salon CRM

A premium salon CRM with customer booking, admin dashboard, analytics, and staff management -- built with React 19, TypeScript, Tailwind CSS v4, and Vite.

## Features

- **Landing Page** -- Hero stats, services grid with category filter, testimonials, staff directory
- **Customer Dashboard** -- Stats cards, service history carousel with drag/swipe, upcoming appointments, booking modal (4-step flow)
- **Admin Dashboard** -- Revenue chart, customer database with search, appointment queue with complete/cancel, service recording, staff directory
- **Authentication** -- Role selector (Customer/Admin), demo credentials hint
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

## System Architecture

### System Flowchart (Production Target)

```mermaid
graph TD
    START(("User"))
    START --> SPA["React 19 SPA<br/>TypeScript + Tailwind v4"]
    SPA --> ROUTER["React Router v7<br/>Client Routing"]
    ROUTER --> PAGES{"Route Match"}
    PAGES -->|"/"| LANDING["LandingPage"]
    PAGES -->|"/login"| LOGIN["LoginPage"]
    PAGES -->|"/customer"| CUST["CustomerDashboard"]
    PAGES -->|"/admin"| ADMIN["AdminDashboard"]
    LOGIN --> AUTH["Auth: login(email)"]
    AUTH --> NAV{Role?}
    NAV -->|Customer| NAVCUST["Navigate /customer"]
    NAV -->|Admin| NAVADMIN["Navigate /admin"]
    CUST --> CONTEXT["SalonContext"]
    ADMIN --> CONTEXT
    CONTEXT --> STORE[("localStorage<br/>Persist State")]
    CONTEXT --> SEED[("In-Memory<br/>Seed Data")]
```

### Authentication Flowchart

```mermaid
graph TD
    START(("Visitor")) --> LOGINPG["Open /login"]
    LOGINPG --> SELECT{"Select Role"}
    SELECT -->|Customer| CUSTFORM["Show Customer Form"]
    SELECT -->|Admin| ADMINFORM["Show Admin Form"]
    CUSTFORM --> FILL["Enter email + password"]
    ADMINFORM --> FILL
    FILL --> SUBMIT["Submit form"]
    SUBMIT --> CHECK{Valid?}
    CHECK -->|Yes| LOGIN["login(email)<br/>setCurrentUser(email)"]
    CHECK -->|No| ERROR["Show error"]
    ERROR --> FILL
    LOGIN --> DECIDE{"email == admin@salon.com<br/>or role == admin?"}
    DECIDE -->|Yes| GOTODASH["Navigate /admin"]
    DECIDE -->|No| GOTOCUST["Navigate /customer"]
    GOTODASH --> DASH(("Admin Dashboard"))
    GOTOCUST --> CUSTDASH(("Customer Dashboard"))
```

### Booking Process Flowchart

```mermaid
graph TD
    START(("Customer")) --> OPEN["Open BookingModal"]
    OPEN --> STEP1["Step 1: Choose Service<br/>Filter by category"]
    STEP1 --> PICKED{"Service selected?"}
    PICKED -->|No| STEP1
    PICKED -->|Yes| STEP2["Step 2: Choose Stylist<br/>Filtered by specialty"]
    STEP2 --> STYLED{"Stylist selected?"}
    STYLED -->|No| STEP2
    STYLED -->|Yes| STEP3["Step 3: Pick Date & Time<br/>Calendar + time slots"]
    STEP3 --> DTSET{"Date + Time selected?"}
    DTSET -->|No| STEP3
    DTSET -->|Yes| STEP4["Step 4: Review & Confirm"]
    STEP4 --> CONFIRM{"User clicks Confirm?"}
    CONFIRM -->|No| BACK{"Click Back?"}
    BACK -->|Yes| PREV["Go to previous step"]
    BACK -->|No| STEP4
    CONFIRM -->|Yes| BOOK["bookAppointment()<br/>id = Date.now()<br/>status = confirmed"]
    BOOK --> STORE[("localStorage<br/>salon_appointments")]
    STORE --> DONE["Show success animation"]
    DONE --> TIMEOUT["Wait 2 seconds"]
    TIMEOUT --> CLOSE["Close modal"]
    CLOSE --> END(("Dashboard"))
```

### Appointment Lifecycle Flowchart

```mermaid
graph TD
    START(("Booking Submitted")) --> CONFIRMED["Confirmed<br/>status = confirmed"]
    CONFIRMED --> CANCEL{"Customer cancels?"}
    CANCEL -->|Yes| CANCELED["Cancelled<br/>status = cancelled"]
    CANCEL -->|No| COMPLETE{"Admin completes?"}
    COMPLETE -->|Yes| COMPLETED["Completed<br/>status = completed"]
    COMPLETE -->|No| CONFIRMED
    COMPLETED --> RECORD["recordService()<br/>creates service history entry"]
    CANCELED --> ENDARC(("Archived"))
    COMPLETED --> ENDARC
    RECORD --> ENDHIST(("Service History"))
```

### Service Recording Flowchart (Admin)

```mermaid
graph TD
    START(("Admin")) --> TAB["Click Services tab"]
    TAB --> FORM["Load RecordServiceView"]
    FORM --> CUST["Enter customer email"]
    CUST --> TYPE["Enter service type"]
    TYPE --> STYL["Enter stylist name"]
    STYL --> CAT["Select category']
    CAT --> COST["Enter cost']
    COST --> DUR["Enter duration"]
    DUR --> SUBMIT{"Submit form?"}
    SUBMIT -->|No| FORM
    SUBMIT -->|Yes| VALIDATE{"All fields valid?"}
    VALIDATE -->|No| FORM
    VALIDATE -->|Yes| RECORD["recordService(formData)"]
    RECORD --> GENID["Generate id = Date.now()"]
    GENID --> GRADIENT["Assign gradient by category"]
    GRADIENT --> PREPEND["Prepend to services[]"]
    PREPEND --> PERSIST[("localStorage<br/>salon_services")]
    PERSIST --> TOAST["Show green success toast"]
    TOAST --> RESET["Reset form fields"]
    RESET --> WAIT["Wait 3 seconds"]
    WAIT --> END(("Ready for next entry"))
```

### Routing Flowchart

```mermaid
graph TD
    START(("Browser Request")) --> ROUTER["React Router v7"]
    ROUTER --> MATCH{"Match route"}
    MATCH -->|"/"| LANDING["LandingPage<br/>Hero, Services, Staff, CTA, Footer"]
    MATCH -->|"/login"| LOGIN["LoginPage<br/>Role selector, Auth form"]
    MATCH -->|"/customer"| CUST["CustomerDashboard<br/>Stats, History carousel, Booking"]
    MATCH -->|"/admin"| ADMIN["AdminDashboard<br/>Analytics, Queue, Customers, Staff"]
    MATCH -->|"*"| CATCH["Navigate to /"]
    LANDING --> RENDER(("Render Page"))
    LOGIN --> RENDER
    CUST --> RENDER
    ADMIN --> RENDER
    CATCH --> ROUTER
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
