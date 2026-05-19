export type UserRole = 'admin' | 'staff' | 'client';

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export type AuditAction =
  | 'login' | 'logout' | 'create_customer'
  | 'book_appointment' | 'approve_booking' | 'reject_booking'
  | 'cancel_appointment' | 'complete_appointment'
  | 'record_service' | 'walk_in_booking'
  | 'update_service' | 'update_time_slot' | 'update_staff' | 'update_category'
  | 'create_service' | 'delete_service';

export interface AuditLogEntry {
  id: number;
  timestamp: string;
  user: string;
  userRole: UserRole;
  action: AuditAction;
  details: string;
  entityType?: string;
  entityId?: string | number;
}

export interface ServiceHistoryItem {
  id: string | number;
  customerId: string;
  serviceType: string;
  date: string;
  stylist: string;
  cost: number;
  duration: string;
  category: string;
  gradient: string;
}

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  rating: number;
  specialties: string[];
  image: string;
  bio: string;
}

export interface EmailNotification {
  id: number;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
  type: 'booking_pending' | 'booking_approved' | 'booking_rejected' | 'booking_confirmed' | 'booking_cancelled' | 'booking_completed' | 'service_recorded' | 'reminder';
  appointmentId?: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'At Risk';
  joinDate: string;
  totalVisits: number;
}

export interface ServiceMenuItem {
  id: number;
  name: string;
  price: number;
  duration: string;
  category: string;
  desc: string;
}

export interface Appointment {
  id: number;
  service: string;
  stylist: string;
  date: string;
  time: string;
  cost: number;
  duration: string;
  category: string;
  customerId: string;
  customerName?: string;
  status: BookingStatus;
  rejectionReason?: string;
  isWalkIn?: boolean;
  createdAt: string;
}

export interface SystemConfig {
  services: ServiceMenuItem[];
  timeSlots: string[];
  staff: StaffMember[];
  categories: string[];
}

export interface SalonContextType {
  services: ServiceHistoryItem[];
  categories: string[];
  recordService: (service: Omit<ServiceHistoryItem, 'id' | 'gradient'> & { gradient?: string }) => void;
  appointments: Appointment[];
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => boolean;
  cancelAppointment: (id: number) => void;
  completeAppointment: (id: number) => void;
  approveBooking: (id: number) => void;
  rejectBooking: (id: number, reason: string) => void;
  createWalkIn: (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => void;
  staff: StaffMember[];
  customers: Customer[];
  serviceMenu: ServiceMenuItem[];
  timeSlots: string[];
  currentUser: string | null;
  currentUserRole: UserRole | null;
  isAdmin: boolean;
  isStaff: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  registerCustomer: (name: string, email: string, phone: string) => boolean;
  emailLog: EmailNotification[];
  sendEmailNotification: (type: EmailNotification['type'], to: string, appointmentId?: number) => void;
  auditLog: AuditLogEntry[];
  updateServiceMenu: (services: ServiceMenuItem[]) => void;
  updateTimeSlots: (slots: string[]) => void;
  updateStaffList: (staffList: StaffMember[]) => void;
  updateCategories: (cats: string[]) => void;
  addServiceMenuItem: (item: Omit<ServiceMenuItem, 'id'>) => void;
  deleteServiceMenuItem: (id: number) => void;
}
