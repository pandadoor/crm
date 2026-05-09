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

The system flowchart illustrates how browser requests, page processes, databases, and display outputs interact within the Salon CRM.

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
    LOGIN --> USER_TYPES>User Types<br/>Email and Password]
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
    SEED_IN --> RETRIEVE[Retrieve and Assemble<br/>Formatted Data]
    RETRIEVE --> MERGE(("Merge Point"))
    MERGE --> FINAL[/Final Page Output<br/>Displayed to User/]
    FINAL --> SYS_END([End])
```

## Process Flowchart

The process flowchart documents the step-by-step sequence of user tasks within the Salon CRM -- from arrival through authentication, appointment booking, and service recording, with all decision branches explicitly labeled.

```mermaid
graph TD
    P_START([Start]) --> LOAD_APP{{Load Application<br/>Initialize Data}}
    LOAD_APP --> BROWSE_LP[Browse Landing Page<br/>View Services and Staff]
    BROWSE_LP --> BOOK_NOW{Book Now<br/>button clicked?}
    BOOK_NOW -->|Yes| GO_LOGIN[Open Login Page]
    BOOK_NOW -->|No| BROWSE_LP
    GO_LOGIN --> PICK_ROLE[Select User Role<br/>Customer or Admin]
    PICK_ROLE --> TYPE_EMAIL[Type Email<br/>Address into Form]
    TYPE_EMAIL --> INSPECT_LOGIN((Inspect<br/>Login Input))
    INSPECT_LOGIN --> EMAIL_OK{Email address<br/>provided?}
    EMAIL_OK -->|No| TYPE_EMAIL
    EMAIL_OK -->|Yes| AUTH_USER[Log User Into<br/>the System]
    AUTH_USER --> CHECK_ROLE{Is this the<br/>salon admin?}
    CHECK_ROLE -->|Yes| VIEW_ADMIN[Display Admin<br/>Dashboard Screen]
    CHECK_ROLE -->|No| VIEW_CUST[Display Customer<br/>Dashboard Screen]
    VIEW_ADMIN --> CHOOSE_TAB[Select Admin<br/>Function Tab]
    CHOOSE_TAB --> TAB_OVERVIEW{Tab is<br/>Overview?}
    TAB_OVERVIEW -->|Yes| SHOW_OVERVIEW[Display Revenue<br/>Metrics and Chart]
    TAB_OVERVIEW -->|No| TAB_CUSTOMERS{Tab is<br/>Customers?}
    TAB_CUSTOMERS -->|Yes| OPEN_CUSTOMERS[Open Customer<br/>Directory View]
    TAB_CUSTOMERS -->|No| TAB_APPOINTMENTS{Tab is<br/>Appointments?}
    TAB_APPOINTMENTS -->|Yes| OPEN_QUEUE[Open Appointment<br/>Queue View]
    TAB_APPOINTMENTS -->|No| TAB_SERVICES{Tab is<br/>Services?}
    TAB_SERVICES -->|Yes| OPEN_RECORD[Open Service<br/>Recording Form]
    TAB_SERVICES -->|No| TAB_STAFF{Tab is<br/>Staff?}
    TAB_STAFF -->|Yes| OPEN_STAFF[Open Staff<br/>Directory View]
    OPEN_CUSTOMERS --> TYPE_SEARCH[Type Customer<br/>Name or Email]
    TYPE_SEARCH --> FOUND_ANY{Matches<br/>found?}
    FOUND_ANY -->|No| TYPE_SEARCH
    FOUND_ANY -->|Yes| SHOW_TABLE[Display Matching<br/>Customer Rows]
    OPEN_QUEUE --> VIEW_APT[Review Appointment<br/>Details in Queue]
    VIEW_APT --> MARK_DONE{Mark this<br/>appointment done?}
    MARK_DONE -->|Yes| COMPLETE_IT[Set Appointment<br/>Status to Completed]
    MARK_DONE -.->|No| VIEW_APT
    OPEN_RECORD --> FILL_FORM[Fill Service Form<br/>Email / Type / Stylist /<br/>Category / Cost / Duration]
    FILL_FORM --> PICK_CAT{Choose service<br/>category}
    PICK_CAT --> CAT_HAIR[Hair]
    PICK_CAT --> CAT_COLOR[Color]
    PICK_CAT --> CAT_NAILS[Nails]
    PICK_CAT --> CAT_TREAT[Treatment]
    CAT_HAIR --> SEND_FORM[Submit the<br/>Service Form]
    CAT_COLOR --> SEND_FORM
    CAT_NAILS --> SEND_FORM
    CAT_TREAT --> SEND_FORM
    SEND_FORM --> INSPECT_FORM((Inspect<br/>Form Fields))
    INSPECT_FORM --> ALL_FILLED{All fields<br/>completed?}
    ALL_FILLED -->|No| FILL_FORM
    ALL_FILLED -->|Yes| SAVE_SVC_REC[Save Service Record<br/>and Assign Category Color]
    SAVE_SVC_REC --> SHOW_TOAST[Display Success<br/>Notification Message]
    SHOW_TOAST --> CLEAR_FORM[Clear the<br/>Form Fields]
    CLEAR_FORM --> RECORD_MORE{Record another<br/>service?}
    RECORD_MORE -->|Yes| FILL_FORM
    RECORD_MORE -.->|No| ADMIN_JUNCTION
    SHOW_OVERVIEW --> ADMIN_JUNCTION((Admin<br/>Junction))
    SHOW_TABLE --> ADMIN_JUNCTION
    OPEN_STAFF --> ADMIN_JUNCTION
    COMPLETE_IT --> ADMIN_JUNCTION
    ADMIN_JUNCTION --> DO_MORE_ADM{Perform another<br/>admin action?}
    DO_MORE_ADM -->|Yes| CHOOSE_TAB
    DO_MORE_ADM -->|No| PROCEED

    VIEW_CUST --> SHOW_STATS[Display Four<br/>Stats Cards]
    SHOW_STATS --> HAS_APT{Upcoming<br/>appointments exist?}
    HAS_APT -->|No| SHOW_NONE[Display Empty<br/>Appointment Message]
    HAS_APT -->|Yes| SHOW_CARDS[Display Appointment<br/>Cards with Cancel Button]
    SHOW_CARDS --> HIT_CANCEL{Cancel an<br/>appointment?}
    HIT_CANCEL -->|Yes| ASK_CONFIRM{User confirms<br/>cancellation?}
    ASK_CONFIRM -->|Yes| DO_CANCEL_IT[Cancel the<br/>Selected Appointment]
    ASK_CONFIRM -->|No| SHOW_CARDS
    HIT_CANCEL -->|No| VIEW_HIST{View service<br/>history now?}
    VIEW_HIST -->|No| SHOW_CARDS
    VIEW_HIST -->|Yes| ASK_FILTER{Filter by<br/>category?}
    ASK_FILTER -->|Show All| SHOW_ALL_HIST[Display Full<br/>Service History]
    ASK_FILTER -->|By Category| SHOW_FILT_HIST[Display Filtered<br/>Service History]
    SHOW_ALL_HIST --> SWIPE_CARDS[Scroll through<br/>History Cards]
    SHOW_FILT_HIST --> SWIPE_CARDS
    SWIPE_CARDS --> READ_CARD[Read Card Details<br/>Service Type / Cost /<br/>Stylist / Date / Duration]
    READ_CARD --> CLICK_BOOK{Click + New<br/>to book?}
    CLICK_BOOK -->|No| SWIPE_CARDS
    CLICK_BOOK -->|Yes| OPEN_WIZARD[Open Booking<br/>Wizard Modal]
    OPEN_WIZARD --> STEP_ONE[Step 1 of 4<br/>Pick a Service Type]
    STEP_ONE --> SVC_PICKED{Service<br/>selected?}
    SVC_PICKED -->|No| STEP_ONE
    SVC_PICKED -->|Yes| STEP_TWO[Step 2 of 4<br/>Pick a Stylist]
    STEP_TWO --> STYL_PICKED{Stylist<br/>selected?}
    STYL_PICKED -->|No| STEP_TWO
    STYL_PICKED -->|Yes| STEP_THREE[Step 3 of 4<br/>Pick Date and Time]
    STEP_THREE --> SLOT_PICKED{Date and time<br/>selected?}
    SLOT_PICKED -->|No| STEP_THREE
    SLOT_PICKED -->|Yes| STEP_FOUR[Step 4 of 4<br/>Review Full Summary]
    STEP_FOUR --> HIT_CONFIRM{Confirmed the<br/>booking?}
    HIT_CONFIRM -->|No| HIT_BACK{Go back to<br/>previous step?}
    HIT_BACK -->|Yes| STEP_ONE
    HIT_BACK -->|No| STEP_FOUR
    HIT_CONFIRM -->|Yes| SAVE_BOOKING[Save Appointment<br/>as Confirmed]
    SAVE_BOOKING --> INSPECT_BOOK((Inspect<br/>Booking Result))
    INSPECT_BOOK --> PLAY_ANIM[Play Success<br/>Animation on Screen]
    SHOW_NONE --> PLAY_ANIM
    DO_CANCEL_IT --> PLAY_ANIM
    PLAY_ANIM --> CLOSE_WIZARD[Close Booking<br/>Modal Window]
    CLOSE_WIZARD --> CUSTOMER_JUNCTION((Customer<br/>Junction))
    PROCEED --> CUSTOMER_JUNCTION
    CUSTOMER_JUNCTION --> ASK_CONTINUE{Continue using<br/>the application?}
    ASK_CONTINUE -->|Yes| BROWSE_LP
    ASK_CONTINUE -.->|No| P_END([End])
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
