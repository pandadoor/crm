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

## System Flowchart

The system flowchart depicts the physical and logical architecture of the Salon CRM -- the SPA shell, route resolution, page components, shared UI library, central state provider, and persistence stores.

```mermaid
graph TD
    ENTRY(("Browser")) --> SPA["React 19 SPA<br/>Vite 8 + TypeScript + Tailwind v4"]
    SPA --> ROUTER["React Router v7<br/>Client-side Route Matcher"]
    ROUTER --> RESOLVE{"Route Match"}
    RESOLVE -->|"/"| LANDING["LandingPage<br/>Hero stats / Services grid /<br/>Testimonials / Staff cards / CTA"]
    RESOLVE -->|"/login"| LOGIN["LoginPage"]
    RESOLVE -->|"/customer"| CUSTOMER["CustomerDashboard"]
    RESOLVE -->|"/admin"| ADMIN["AdminDashboard"]
    RESOLVE -->|"*"| CATCHALL["Redirect to /"]

    CUSTOMER --> CTX["SalonContext<br/>Central State Provider"]
    ADMIN --> CTX
    CTX --> STORE[("localStorage<br/>key: salon_appointments<br/>key: salon_services")]
    CTX --> SEED[("Seed Data (Immutable)<br/>Staff[5] / Customer[6]<br/>ServiceMenuItem[12]<br/>TimeSlots[18]")]
    CTX --> UI["Shared UI Components"]
    UI --> NAV["Navbar"]
    UI --> FOOT["Footer"]
    UI --> SCARD["ServiceCard"]
    UI --> STATS["StatsCard"]
    UI --> MODAL["BookingModal"]
    NAV --> CTX
    SCARD --> ROUTER
    STATS --> CUSTOMER
    STATS --> ADMIN
    MODAL --> CTX

    LANDING --> SCARD
    ADMIN --> COMP["Admin Sub-components<br/>RevenueChart / CustomerTable /<br/>AppointmentQueue / RecordServiceView"]
    CUSTOMER --> COMP2["Customer Sub-components<br/>UpcomingAppointments /<br/>ServiceHistoryCarousel"]
    LANDING --> LINK{"Book Now clicked?"}
    LINK -->|Yes| LOGIN
    LINK -->|No| LANDING
```

## Process Flowchart

The process flowchart follows the linear step-by-step user journey through the application -- from entry to authentication, booking, appointment management, and service recording -- with all decision branches explicitly shown.

```mermaid
graph TD
    START(("User Arrives")) --> PAGE{"Which page?"}
    PAGE -->|Landing| LBROWSE["Browse services & staff"]
    LBROWSE --> LACT{"Clicks Book Now?"}
    LACT -->|Yes| LPAGE["Navigate to /login"]
    LACT -->|No| LBROWSE
    PAGE -->|Login| LSELECT{"Select role"}
    LSELECT -->|Customer| CFORM["Show customer form"]
    LSELECT -->|Admin| AFORM["Show admin form"]
    CFORM --> ENTER["Enter email + password"]
    AFORM --> ENTER
    ENTER --> SUBMIT["Click Login button"]
    SUBMIT --> FVALID{"Email empty?"}
    FVALID -->|Yes| ENTER
    FVALID -->|No| LOGIN_OP["login(email)"]
    LOGIN_OP --> ROLE{"email == admin@salon.com<br/>or role == admin?"}
    ROLE -->|Yes| GOTOADMIN["Navigate to /admin"]
    ROLE -->|No| GOTOCUST["Navigate to /customer"]
    GOTOADMIN --> ADASH(("Admin Dashboard"))
    GOTOCUST --> CDASH(("Customer Dashboard"))

    CDASH --> CSTATS["View stats cards<br/>Services / Spent / Upcoming / Loyalty"]
    CSTATS --> UAPTS{"Appointments exist?"}
    UAPTS -->|No| SHOWEMPTY["Show 'No upcoming' + CTA"]
    UAPTS -->|Yes| SHOWCARDS["Show appointment cards<br/>Service / Date / Time / Cancel btn"]
    SHOWCARDS --> CANCEL{"Cancel clicked?"}
    CANCEL -->|Yes| DIALOG{"Confirm cancellation?"}
    DIALOG -->|Yes| DOCANCEL["cancelAppointment(id)<br/>status = cancelled"]
    DIALOG -->|No| SHOWCARDS
    CANCEL -->|No| NEXT{"View history?"}
    NEXT -->|Yes| FILTER{"Filter by category?"}
    FILTER -->|All| ALLHIST["Show all services"]
    FILTER -->|Specific| FILTHIST["Show filtered services"]
    ALLHIST --> DRAG{"User drags card?"}
    FILTHIST --> DRAG
    DRAG -->|Yes| OFFSET{"Offset > 50px?"}
    OFFSET -->|Yes| NEXTCARD["Show next card"]
    OFFSET -->|No| SNAPBACK["Snap to current"]
    NEXTCARD --> DRAG
    SNAPBACK --> DRAG
    DRAG -->|No| DISPLAY["Show card details<br/>Type / Cost / Stylist / Date / Duration"]
    DISPLAY --> BOOKACT{"Click + New?"}
    BOOKACT -->|Yes| BOOKING["Open Booking Modal"]
    BOOKING --> S1["Step 1: Choose Service<br/>Category tabs + service list"]
    S1 --> S1CHK{"Service selected?"}
    S1CHK -->|No| S1
    S1CHK -->|Yes| S2["Step 2: Choose Stylist<br/>Filtered by specialty"]
    S2 --> S2CHK{"Stylist selected?"}
    S2CHK -->|No| S2
    S2CHK -->|Yes| S3["Step 3: Pick Date & Time<br/>Calendar + time slot grid"]
    S3 --> S3CHK{"Date & time selected?"}
    S3CHK -->|No| S3
    S3CHK -->|Yes| S4["Step 4: Review & Confirm<br/>Service / Stylist / Date / Cost"]
    S4 --> CONFIRM{"Confirm?"}
    CONFIRM -->|No| BACK{"Back?"}
    BACK -->|Yes| S1
    BACK -->|No| S4
    CONFIRM -->|Yes| BOOKOP["bookAppointment()<br/>status = confirmed"]
    BOOKOP --> WRITE[("Write to localStorage<br/>salon_appointments")]
    WRITE --> ANIM["Show success animation"]
    ANIM --> CLOSE["Close modal after 2s"]
    CLOSE --> CDASH

    ADASH --> TABS{"Select admin tab"}
    TABS -->|Overview| OV["Overview dashboard"]
    TABS -->|Customers| CUSTAB["Customer database"]
    TABS -->|Appointments| APPTAB["Appointment queue"]
    TABS -->|Services| SVCTAB["Record service form"]
    TABS -->|Staff| STFTAB["Staff directory"]
    OV --> OVSTATS["Stats: Active / Revenue / Pending / Services"]
    OV --> OVCHART["Monthly revenue bar chart"]
    OV --> OVFEED["Recent activity feed (5 items)"]
    OV --> OVACT["Quick action buttons"]
    CUSTAB --> CSEARCH{"Search query?"}
    CSEARCH -->|Yes| CFILTER["Filter customers"]
    CSEARCH -->|No| CSHOW["Show all 6 customers"]
    CFILTER --> CTABLE["Table: Name / Status / Visits / LTV"]
    CSHOW --> CTABLE
    CTABLE --> BADGE{"Status?"}
    BADGE -->|Active| BGREEN["Green badge"]
    BADGE -->|At Risk| BYELLOW["Yellow badge"]
    BADGE -->|Inactive| BRED["Red badge"]
    APPTAB --> ALIST["List confirmed appointments"]
    ALIST --> AROW["Appointment row<br/>Service / Customer / Stylist / Date"]
    AROW --> ACOMP{"Complete?"}
    ACOMP -->|Yes| DOCOMP["completeAppointment(id)"]
    ACOMP -->|No| AROW
    DOCOMP --> ACOMPLETE["Status = completed"]
    ACOMPLETE --> ARECORD["recordService() triggered"]
    ARECORD --> WRITE2[("Write to localStorage<br/>salon_services")]
    SVCTAB --> SFORM["Fill form: email / type /<br/>stylist / category / cost / duration"]
    SFORM --> SCATEGORY{"Category?"}
    SCATEGORY --> HAIR["Hair"]
    SCATEGORY --> COLOR["Color"]
    SCATEGORY --> NAILS["Nails"]
    SCATEGORY --> TREAT["Treatment"]
    SCATEGORY --> SSBMIT{"Submit?"}
    SSBMIT -->|No| SFORM
    SSBMIT -->|Yes| SVALID{"All fields valid?"}
    SVALID -->|No| SFORM
    SVALID -->|Yes| RECORDOP["recordService(formData)"]
    RECORDOP --> GRADIENT["Assign gradient by category"]
    GRADIENT --> PREPEND["Prepend to services[]"]
    PREPEND --> WRITE2
    PREPEND --> TOAST["Show green toast"]
    TOAST --> SRESET["Reset form"]
    SRESET --> SFORM
    STFTAB --> SGRID["Staff card grid<br/>Image / Name / Role / Bio /<br/>Specialties / Rating / Job count"]
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
