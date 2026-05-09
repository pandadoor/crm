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

## System and Process Flowchart

The following unified flowchart captures the complete Salon CRM -- from the user entering the application through routing, authentication, booking, appointment lifecycle, service recording, and data persistence.

```mermaid
graph TD
    ENTRY(("User Entry")) --> SPA["React 19 SPA<br/>Vite 8 | TypeScript | Tailwind v4"]

    SPA --> ROUTER["React Router v7<br/>Client-side Route Matching"]
    ROUTER --> ROUTE{"Route Match?"}

    ROUTE -->|"/"| LANDING["LandingPage<br/>Hero stats | Services grid |<br/>Testimonials | Staff cards | CTA"]
    ROUTE -->|"/login"| LOGINPAGE["LoginPage"]

    ROUTE -->|"/customer"| CUSTDASH["CustomerDashboard"]
    ROUTE -->|"/admin"| ADMINDASH["AdminDashboard"]
    ROUTE -->|"*"| REDIRECT["Redirect to /"]
    REDIRECT --> ROUTER

    LANDING --> SVCGRID["Services grid with category filter"]
    SVCGRID --> LGBOOK{"Clicks Book Now?"}
    LGBOOK -->|Yes| LOGINPAGE
    LGBOOK -->|No| LANDING

    LOGINPAGE --> ROLESELECT{"Select Role"}
    ROLESELECT -->|Customer| CUSTFORM["Show customer login form"]
    ROLESELECT -->|Admin| ADMINFORM["Show admin login form"]
    CUSTFORM --> SUBMIT["Enter email + password<br/>Submit form"]
    ADMINFORM --> SUBMIT
    SUBMIT --> VALID{"Fields filled?"}
    VALID -->|No| SUBMIT
    VALID -->|Yes| AUTH["login(email)<br/>setCurrentUser(email)"]
    AUTH --> ROLE{"email == admin@salon.com<br/>or role == admin?"}
    ROLE -->|Yes| NAVADMIN["Navigate to /admin"]
    ROLE -->|No| NAVCUST["Navigate to /customer"]

    NAVCUST --> CUSTDASH
    NAVADMIN --> ADMINDASH

    CUSTDASH --> CTX["SalonContext<br/>Central State Provider"]
    ADMINDASH --> CTX

    CTX --> STATS["StatsCard x4<br/>Services | Spent | Upcoming | Loyalty"]
    CTX --> PROFILE["Profile Sidebar<br/>Avatar | Contact | Member since"]
    CTX --> UPCOMING["Upcoming Appointments Section"]

    UPCOMING --> LISTUP{"Appointments exist?"}
    LISTUP -->|No| EMPTYUP["Empty state:<br/>No upcoming + Book Now CTA"]
    LISTUP -->|Yes| APTCARD["Appointment cards x3<br/>Service | Date | Time | Cancel btn"]
    APTCARD --> CANCEL{"Cancel clicked?"}
    CANCEL -->|Yes| CONFIRMCANCEL{"Confirm dialog?"}
    CONFIRMCANCEL -->|Yes| DOCANCEL["cancelAppointment(id)<br/>status = cancelled"]
    CONFIRMCANCEL -->|No| APTCARD
    DOCANCEL --> PERSIST

    CTX --> HISTORY["Service History Section"]
    HISTORY --> FILTER{"Category filter?"}
    FILTER -->|All| ALLHIST["Show all customer services"]
    FILTER -->|Specific| FILTHIST["Show filtered services"]
    ALLHIST --> STACKED["Stacked card carousel<br/>Drag/swipe to navigate<br/>Up to 2 cards visible behind"]
    FILTHIST --> STACKED
    STACKED --> DRAG{"User drags?"}
    DRAG -->|Yes| OFFSET{"Offset > 50px?"}
    OFFSET -->|Yes| NEXTCARD["Navigate to next card"]
    OFFSET -->|No| SNAP["Snap back to current"]
    NEXTCARD --> STACKED
    SNAP --> STACKED
    DRAG -->|No| IDLE["Display current card<br/>Service type | Cost | Stylist |<br/>Category | Date | Duration"]

    CTX --> BOOKTRIGGER{"Clicks + New or Book Now?"}
    BOOKTRIGGER -->|Yes| BOOKINGMODAL["Open BookingModal"]

    BOOKINGMODAL --> STEP1["Step 1: Choose Service<br/>Category filter tabs<br/>Service list with price + duration"]
    STEP1 --> SVCCHK{"Service selected?"}
    SVCCHK -->|No| STEP1
    SVCCHK -->|Yes| STEP2["Step 2: Choose Stylist<br/>Filtered by specialty match<br/>Rating | Role | Availability"]
    STEP2 --> STYLCHK{"Stylist selected?"}
    STYLCHK -->|No| STEP2
    STYLCHK -->|Yes| STEP3["Step 3: Pick Date & Time<br/>Calendar navigation (month/year)<br/>Past dates disabled | Today highlight<br/>Time slots grid (18 slots)"]
    STEP3 --> DTCHK{"Date + Time selected?"}
    DTCHK -->|No| STEP3
    DTCHK -->|Yes| STEP4["Step 4: Review & Confirm<br/>Service | Stylist | Date | Time | Cost"]
    STEP4 --> CONFIRM{"Confirm clicked?"}
    CONFIRM -->|No| BACK{"Back clicked?"}
    BACK -->|Yes| PREVSTEP["Go to previous step"]
    PREVSTEP --> STEP1
    PREVSTEP --> STEP2
    PREVSTEP --> STEP3
    BACK -->|No| STEP4
    CONFIRM -->|Yes| BOOK["bookAppointment()<br/>id = Date.now()<br/>status = confirmed<br/>createdAt = ISO timestamp"]
    BOOK --> PERSIST[("localStorage<br/>salon_appointments stored<br/>salon_services stored")]
    PERSIST --> SUCCESS["Show success animation<br/>Checkmark + booking details"]
    SUCCESS --> TIMEOUT["2-second timeout"]
    TIMEOUT --> CLOSEMODAL["Close modal + reset form"]
    CLOSEMODAL --> CUSTDASH

    CTX --> APPOINTMENTDB((("Appointments State<br/>Array<Appointment>")))

    APPOINTMENTDB --> LIFECYCLE{"Status transitions"}
    LIFECYCLE -->|confirmed| CONFIRMED["Confirmed Appointment<br/>customerId | service | stylist |<br/>date | time | cost | duration"]
    CONFIRMED --> ADMINCOMPLETE{"Admin clicks Complete?"}
    ADMINCOMPLETE -->|Yes| COMPLETED["Completed Appointment<br/>status = completed"]
    ADMINCOMPLETE -->|No| CUSTCANCEL{"Customer clicks Cancel?"}
    CUSTCANCEL -->|Yes| CANCELLED["Cancelled Appointment<br/>status = cancelled"]
    CUSTCANCEL -->|No| CONFIRMED
    COMPLETED --> RECORDSVC["recordService() triggered"]
    CANCELLED --> ARCHIVE[("Archived<br/>Status preserved in state")]

    RECORDSVC --> ADDRECORD["Add to services[]<br/>id = Date.now()<br/>gradient = category color"]
    ADDRECORD --> PERSIST

    ADMINDASH --> ADMINCTX["SalonContext"]
    ADMINCTX --> ADMINTABS{"Admin Tab Selection"}
    ADMINTABS -->|Overview| OVERVIEW["Overview Dashboard"]
    ADMINTABS -->|Customers| CUSTOMERS["Customer Database"]
    ADMINTABS -->|Appointments| APPTAB["Appointment Queue"]
    ADMINTABS -->|Services| RECORDSVCTAB["Record New Service Form"]
    ADMINTABS -->|Staff| STAFFTAB["Staff Directory"]

    OVERVIEW --> REVENUE["StatsCard x4<br/>Active Customers | Total Revenue |<br/>Pending Appointments | Services"]
    OVERVIEW --> CHART["Monthly Revenue Chart<br/>12-month bar chart<br/>Current month highlighted (purple)"]
    OVERVIEW --> ACTIVITY["Recent Activity Feed<br/>Last 5 appointments<br/>Status icons per row"]
    OVERVIEW --> QUICKACTIONS["Quick Actions buttons<br/>Record Service | Customers | Appointments"]

    CUSTOMERS --> SEARCHBAR{"Search query?"}
    SEARCHBAR -->|Yes| FILTERCUST["Filter customers by name/email"]
    SEARCHBAR -->|No| ALLCUST["Show all 6 customers"]
    ALLCUST --> CUSTOMERTABLE["Table: Name | Status | Visits |<br/>LTV | Most Frequent | View btn"]
    FILTERCUST --> CUSTOMERTABLE
    CUSTOMERTABLE --> STATUSBADGE{"Status badge color"}
    STATUSBADGE -->|Active| GREEN["Green badge"]
    STATUSBADGE -->|At Risk| YELLOW["Yellow badge"]
    STATUSBADGE -->|Inactive| RED["Red badge"]

    APPTAB --> APPTLIST["List all non-cancelled appointments"]
    APPTLIST --> APTROW["Appointment row<br/>Service | Customer | Stylist |<br/>Date | Time | Duration | Status"]
    APTROW --> APTACTION{"Status == confirmed?"}
    APTACTION -->|Yes| COMPLETEBTN["Complete button"]
    APTACTION -->|No| READONLY["Read-only completed status"]
    COMPLETEBTN --> DOCOMPLETE["completeAppointment(id)"]
    DOCOMPLETE --> RECORDSVC
    DOCOMPLETE --> PERSIST

    RECORDSVCTAB --> SVCFORM["Service Recording Form"]
    SVCFORM --> SVCFIELDS["Fields: email | service type |<br/>stylist | category | cost | duration"]
    SVCFIELDS --> SVCSELECT{"Category dropdown"}
    SVCSELECT --> HAIR["Hair"]
    SVCSELECT --> COLOR["Color"]
    SVCSELECT --> NAILS["Nails"]
    SVCSELECT --> TREATMENT["Treatment"]
    SVCSELECT --> SVCSBMIT{"Submit?"}
    SVCSBMIT -->|Yes| SVCFORMVALID{"All fields filled?"}
    SVCFORMVALID -->|No| SVCFIELDS
    SVCFORMVALID -->|Yes| DOSVC["recordService(formData)<br/>cost parsed to float"]
    DOSVC --> GENGRAD["Gradient auto-assigned:<br/>Hair = purple<br/>Color = pink<br/>Treatment = blue<br/>Nails = green"]
    GENGRAD --> PREPENDSVC["Prepend to services[]"]
    PREPENDSVC --> PERSIST
    PREPENDSVC --> TOASTGREEN["Green success toast (3 seconds)"]
    TOASTGREEN --> SVCRESET["Reset form fields"]
    SVCRESET --> SVCFIELDS
    SVCSBMIT -->|No| SVCFIELDS

    STAFFTAB --> STAFFGRID["Staff card grid<br/>Image | Name | Role | Bio |<br/>Specialties tags | Rating | Jobs"]
    STAFFGRID --> STAFFSTATS["Per staff: completed jobs count<br/>filtered from services[]"]

    CTX --> SEEDDATA((("Seed Data (Static)<br/>StaffMember[] x5<br/>Customer[] x6<br/>ServiceMenuItem[] x12<br/>TimeSlots[] x18<br/>Categories[] x4<br/>Gradients map")))
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
