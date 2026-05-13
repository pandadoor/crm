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

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'At Risk';
  joinDate: string;
  totalVisits: number;
  lifetimeValue: number;
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
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface SalonContextType {
  services: ServiceHistoryItem[];
  categories: string[];
  recordService: (service: Omit<ServiceHistoryItem, 'id' | 'gradient'> & { gradient?: string }) => void;
  appointments: Appointment[];
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => boolean;
  cancelAppointment: (id: number) => void;
  completeAppointment: (id: number) => void;
  staff: StaffMember[];
  customers: Customer[];
  serviceMenu: ServiceMenuItem[];
  timeSlots: string[];
  currentUser: string | null;
  login: (email: string) => void;
  logout: () => void;
  registerCustomer: (name: string, email: string, phone: string) => boolean;
}
