# Salon CRM v2 — Booking Approval, RBAC, Audit Trail & Maintenance

## Overview
Upgrade the existing Salon CRM SPA (React 19 + TypeScript + Vite + Tailwind v4) with:
- Booking approval workflow (Pending → Approve/Reject)
- Walk-in client handling (skip approval)
- RBAC with 3 roles: Admin, Staff, Client
- Immutable audit trail / activity log
- Maintenance panel for look-up tables (services, time slots, staff, categories)

## Architecture
- **Pattern**: Single-page React SPA, localStorage persistence (no backend)
- **No new dependencies** — uses existing React Router, Framer Motion, Lucide, Tailwind
- All state changes flow through `SalonContext` which persists to localStorage

## Authentication & RBAC
- **Login page**: 3-way role selector (Admin / Staff / Client)
- **Admin**: Full access — all tabs, system maintenance, audit log
- **Staff**: Limited admin — booking queue, walk-in form, customer lookup. No maintenance/audit access
- **Client**: Own dashboard — book, view history, see booking status
- **Auth guard**: `useSalon()` context provides `currentUser`, `currentUserRole`, `isAdmin`, `isStaff` helpers
- **Demo accounts**:
  - `admin@salon.com` → Admin
  - `staff@salon.com` → Staff
  - `customer@example.com` → Client

## Booking & Walk-In Workflow
### Web Booking Flow
1. Client books via BookingModal → status = `pending`
2. `sendEmailNotification('booking_pending', adminEmail)` alerts admin
3. Admin/Staff dashboard shows "Pending Approvals" queue
4. Admin clicks Approve → status = `approved`, client notified
5. Admin clicks Reject → status = `rejected`, client notified with reason

### Walk-In Flow
1. Admin/Staff opens "Walk-In Booking" form
2. Fills service, stylist, date/time, customer info
3. Status = `approved` directly (skips approval), client notified

### Appointment Statuses
`pending | approved | rejected | completed | cancelled`

## Audit Trail / Activity Log
- **Storage**: `auditLog[]` in localStorage, immutable (append-only)
- **Schema**: `{ id, timestamp, user, userRole, action, details, entityType, entityId }`
- **Actions tracked**: login, logout, create_customer, book_appointment, approve_booking, reject_booking, cancel_appointment, complete_appointment, record_service, walk_in_booking, update_config
- **UI**: Admin-only tab, searchable/filterable table, reverse-chronological, read-only

## Maintenance (Look-up Tables)
- **Admin-only** panel for CRUD on:
  - **Services**: name, price, duration, category, description
  - **Time Slots**: time strings
  - **Staff**: name, role, specialties, bio
  - **Categories**: category names
- **Persistence**: Directly mutates context state → localStorage sync

## Routes
| Route | Page | Access |
|-------|------|--------|
| `/` | LandingPage | Public |
| `/login` | Login | Public |
| `/customer` | CustomerDashboard | Client |
| `/staff` | StaffDashboard | Staff |
| `/admin` | AdminDashboard | Admin |

## UI Changes
- **AdminDashboard**: New tabs — Overview, Appointments (approval queue), Customers, Services, Staff, Audit Log, Maintenance, Walk-In Booking
- **StaffDashboard**: Appointments queue, walk-in form, customer lookup (no maintenance/audit)
- **CustomerDashboard**: Booking status badges (pending/approved/rejected), "Pending Approval" notice
- **BookingModal**: Submission shows "pending" confirmation instead of "confirmed"
