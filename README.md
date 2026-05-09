# Salon CRM

A premium salon CRM with customer booking, admin dashboard, analytics, and staff management — built with React 19, TypeScript, Tailwind CSS v4, and Vite.

## Features

- **Landing Page** — Hero stats, services grid with category filter, testimonials, staff directory
- **Customer Dashboard** — Stats cards, service history carousel with drag/swipe, upcoming appointments, booking modal (4-step flow)
- **Admin Dashboard** — Revenue chart, customer database with search, appointment queue with complete/cancel, service recording, staff directory
- **Authentication** — Role selector (Customer/Admin), demo credentials hint
- **Responsive** — Full mobile support with glassmorphism UI

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

### System Flowchart (C4 Level 2 -- Container)

```mermaid
graph TB
    subgraph Client["Client Layer (Browser)"]
        REACT["React 19 SPA<br/>TypeScript + Tailwind v4"]
        ROUTER["React Router v7<br/>Client-side Routing"]
        CONTEXT["SalonContext<br/>State Management"]
    end

    subgraph Gateway["API Gateway"]
        VITE["Vite 8 Dev Server<br/>or Nginx/CDN (Prod)"]
    end

    subgraph Services["Backend Services (Production)"]
        AUTH["Auth Service<br/>JWT / OAuth2"]
        BOOKING["Booking Service<br/>Appointment CRUD"]
        ANALYTICS["Analytics Service<br/>Revenue Reports"]
        NOTIFY["Notification Service<br/>Email / SMS"]
    end

    subgraph Storage["Data Layer"]
        DB[("PostgreSQL<br/>Primary Database")]
        CACHE[("Redis<br/>Session Cache")]
        FILESTORE[("S3 / Cloud Storage<br/>Images & Assets")]
    end

    REACT --> ROUTER
    ROUTER --> CONTEXT
    CONTEXT --> VITE
    VITE --> AUTH
    VITE --> BOOKING
    VITE --> ANALYTICS
    BOOKING --> DB
    ANALYTICS --> DB
    AUTH --> CACHE
    AUTH --> DB
    NOTIFY --> DB
    BOOKING --> NOTIFY
```

### Current Architecture (MVP -- Browser-Only with LocalStorage)

```mermaid
graph TB
    subgraph Browser["Browser (Single Page Application)"]
        REACT["React 19 + TypeScript"]
        ROUTER["React Router v7<br/>/  /login  /customer  /admin"]
        CONTEXT["SalonContext Provider"]
        COMP["Components<br/>Navbar, Footer, ServiceCard<br/>StatsCard, BookingModal"]
        PAGES["Pages<br/>LandingPage, Login<br/>CustomerDashboard, AdminDashboard"]
    end

    subgraph Storage["Client Storage"]
        LS[("localStorage<br/>salon_services<br/>salon_appointments")]
        MEM[("In-Memory State<br/>currentUser<br/>static seed data")]
    end

    REACT --> ROUTER
    ROUTER --> PAGES
    PAGES --> COMP
    COMP --> CONTEXT
    CONTEXT --> LS
    CONTEXT --> MEM

    style Storage fill:#1a1a2e,stroke:#8b5cf6
    style Browser fill:#0a0a0a,stroke:#8b5cf6
```

### Production Database Schema (ERD)

```mermaid
erDiagram
    customers ||--o{ appointments : "has"
    customers ||--o{ service_history : "receives"
    staff ||--o{ appointments : "assigned to"
    staff ||--o{ service_history : "performed"

    customers {
        int id PK
        varchar name
        varchar email
        varchar phone
        varchar password_hash
        varchar status
        timestamp join_date
        int total_visits
        decimal lifetime_value
        timestamp created_at
        timestamp updated_at
    }

    staff {
        int id PK
        varchar name
        varchar role
        decimal rating
        text[] specialties
        varchar image_url
        text bio
        timestamp created_at
    }

    appointments {
        int id PK
        int customer_id FK
        int staff_id FK
        varchar service_name
        varchar category
        decimal cost
        varchar duration
        date date
        time time
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    service_history {
        int id PK
        int appointment_id FK
        int customer_id FK
        int staff_id FK
        varchar service_type
        varchar category
        decimal cost
        varchar duration
        date date
        varchar gradient
        timestamp created_at
    }
```

### Authentication Flow (Sequence)

```mermaid
sequenceDiagram
    participant Browser
    participant Router as React Router
    participant Context as SalonContext
    participant Store as localStorage

    Browser->>Router: GET /login
    Router->>Browser: Render Login Page
    Browser->>Browser: Select Role (Customer/Admin)
    Browser->>Browser: Enter Email + Password
    Browser->>Context: login(email)
    Context->>Store: setCurrentUser(email)
    Context->>Router: Navigate to /customer or /admin
    Router->>Browser: Render Protected Dashboard

    Browser->>Context: logout()
    Context->>Store: clear currentUser
    Context->>Router: Navigate to /login
    Router->>Browser: Render Login Page
```

### Booking Process (Sequence)

```mermaid
sequenceDiagram
    actor User
    participant Modal as BookingModal
    participant Context as SalonContext
    participant Store as localStorage

    User->>Modal: Click "Book Now"
    Modal->>Modal: Step 1: Select Service (filtered by category)
    User->>Modal: Pick service
    Modal->>Modal: Step 2: Select Stylist (filtered by specialty)
    User->>Modal: Pick stylist
    Modal->>Modal: Step 3: Pick Date + Time (calendar + time slots)
    User->>Modal: Select date and time
    Modal->>Modal: Step 4: Review + Confirm
    User->>Modal: Confirm Booking
    Modal->>Context: bookAppointment({service, stylist, date, time, cost, ...})
    Context->>Context: Generate id (Date.now), status=confirmed, createdAt
    Context->>Store: localStorage.setItem(salon_appointments, ...)
    Context->>Modal: Return true
    Modal->>Modal: Show confirmation animation (checkmark)
    Modal->>Modal: 2-second timeout
    Modal->>User: Close modal
```

### Appointment Lifecycle (State Diagram)

```mermaid
stateDiagram-v2
    [*] --> Confirmed: Customer books via 4-step modal
    Confirmed --> Completed: Admin clicks "Complete"
    Confirmed --> Cancelled: Customer clicks "Cancel"
    Completed --> [*]: Archived (service history)
    Cancelled --> [*]: Archived
```

### Service Recording Flow (Admin)

```mermaid
sequenceDiagram
    actor Admin
    participant Form as RecordServiceView
    participant Context as SalonContext
    participant Store as localStorage

    Admin->>Form: Navigate to Services tab
    Admin->>Form: Fill customer email
    Admin->>Form: Enter service type, stylist, cost, duration, category
    Admin->>Form: Submit form
    Form->>Context: recordService(formData)
    Context->>Context: Generate id (Date.now)
    Context->>Context: Assign gradient by category
    Context->>Context: Prepend to services array
    Context->>Store: localStorage.setItem(salon_services, ...)
    Context->>Form: Success
    Form->>Admin: Green toast notification (3s)
    Form->>Form: Reset form fields
```

### Routing Map

```mermaid
graph LR
    ROOT["/"] --> LANDING["LandingPage<br/>Hero, Services, Staff, CTA"]
    LOGIN["/login"] --> LOGINPG["LoginPage<br/>Role Select, Auth Form"]
    CUST["/customer"] --> CDASH["CustomerDashboard<br/>Stats, History, Booking"]
    ADMIN["/admin"] --> ADASH["AdminDashboard<br/>Analytics, Queue, Staff"]
    CATCH["*"] --> REDIR["Navigate to /"]

    style ROOT fill:#1a1a2e,stroke:#8b5cf6
    style LOGIN fill:#1a1a2e,stroke:#8b5cf6
    style CUST fill:#1a1a2e,stroke:#8b5cf6
    style ADMIN fill:#1a1a2e,stroke:#8b5cf6
    style CATCH fill:#1a1a2e,stroke:#ef4444
```

```
src/
├── components/     # Shared components (Navbar, Footer, ServiceCard, etc.)
├── context/        # React context (SalonContext)
├── pages/          # Route pages (LandingPage, Login, CustomerDashboard, AdminDashboard)
├── types/          # TypeScript interfaces
└── vite-env.d.ts   # Vite type declarations
```
