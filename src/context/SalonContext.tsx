import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { StaffMember, Customer, ServiceMenuItem, Appointment, ServiceHistoryItem, SalonContextType, EmailNotification, UserRole, AuditLogEntry, AuditAction } from '../types';

const SalonContext = createContext<SalonContextType | null>(null);

export const useSalon = (): SalonContextType => {
  const ctx = useContext(SalonContext);
  if (!ctx) throw new Error('useSalon must be used within SalonProvider');
  return ctx;
};

const STAFF: StaffMember[] = [
  { id: 1, name: 'Emma Rodriguez', role: 'Master Stylist', rating: 4.9, specialties: ['Hair', 'Color'], image: 'ER', bio: '15 years of editorial styling experience' },
  { id: 2, name: 'Michael Chen', role: 'Color Specialist', rating: 4.8, specialties: ['Color', 'Treatment'], image: 'MC', bio: 'Balayage and color correction expert' },
  { id: 3, name: 'Sophie Laurent', role: 'Nail Artist', rating: 4.9, specialties: ['Nails'], image: 'SL', bio: 'Award-winning nail design' },
  { id: 4, name: 'James Wilson', role: 'Barber', rating: 4.7, specialties: ['Hair'], image: 'JW', bio: 'Precision cuts and classic grooming' },
  { id: 5, name: 'Aisha Patel', role: 'Spa Therapist', rating: 4.9, specialties: ['Treatment', 'Nails'], image: 'AP', bio: 'Holistic wellness and nail artistry' },
];

const CUSTOMERS: Customer[] = [
  { id: 1, name: 'Alex Johnson', email: 'customer@example.com', phone: '+1 (555) 123-4567', status: 'Active', joinDate: 'Jan 2023', totalVisits: 24 },
  { id: 2, name: 'Maria Garcia', email: 'maria@example.com', phone: '+1 (555) 234-5678', status: 'Active', joinDate: 'Mar 2023', totalVisits: 18 },
  { id: 3, name: 'James Smith', email: 'james@example.com', phone: '+1 (555) 345-6789', status: 'Active', joinDate: 'Jun 2023', totalVisits: 12 },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+1 (555) 456-7890', status: 'Inactive', joinDate: 'Feb 2023', totalVisits: 6 },
  { id: 5, name: 'David Kim', email: 'david@example.com', phone: '+1 (555) 567-8901', status: 'Active', joinDate: 'Sep 2023', totalVisits: 9 },
  { id: 6, name: 'Emily Davis', email: 'emily@example.com', phone: '+1 (555) 678-9012', status: 'At Risk', joinDate: 'Apr 2023', totalVisits: 4 },
];

const ALL_SERVICES: ServiceHistoryItem[] = [
  { id: 1, customerId: 'customer@example.com', serviceType: 'Premium Haircut & Style', date: 'March 15, 2024', stylist: 'Emma Rodriguez', cost: 85, duration: '45 min', category: 'Hair', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 2, customerId: 'customer@example.com', serviceType: 'Balayage Color Treatment', date: 'February 28, 2024', stylist: 'Michael Chen', cost: 245, duration: '3 hours', category: 'Color', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 3, customerId: 'maria@example.com', serviceType: 'Gel Manicure Set', date: 'March 10, 2024', stylist: 'Sophie Laurent', cost: 65, duration: '60 min', category: 'Nails', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: 4, customerId: 'customer@example.com', serviceType: 'Deep Scalp Treatment', date: 'January 20, 2024', stylist: 'Aisha Patel', cost: 95, duration: '75 min', category: 'Treatment', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 5, customerId: 'james@example.com', serviceType: 'Classic Fade & Beard Trim', date: 'March 5, 2024', stylist: 'James Wilson', cost: 55, duration: '30 min', category: 'Hair', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 6, customerId: 'customer@example.com', serviceType: 'Keratin Smoothing Treatment', date: 'December 10, 2023', stylist: 'Michael Chen', cost: 180, duration: '2.5 hours', category: 'Treatment', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 7, customerId: 'sarah@example.com', serviceType: 'Luxury Pedicure', date: 'February 14, 2024', stylist: 'Sophie Laurent', cost: 75, duration: '50 min', category: 'Nails', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: 8, customerId: 'customer@example.com', serviceType: 'Platinum Blonde Color', date: 'November 5, 2023', stylist: 'Emma Rodriguez', cost: 280, duration: '4 hours', category: 'Color', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
];

const SERVICE_MENU: ServiceMenuItem[] = [
  { id: 1, name: 'Signature Haircut', price: 85, duration: '45 min', category: 'Hair', desc: 'Precision cutting tailored to your face shape.' },
  { id: 2, name: 'Luxury Balayage', price: 245, duration: '3 hours', category: 'Color', desc: 'Hand-painted, sun-kissed dimension.' },
  { id: 3, name: 'Gel Manicure', price: 65, duration: '60 min', category: 'Nails', desc: 'Long-lasting glossy perfection.' },
  { id: 4, name: 'Deep Conditioning', price: 95, duration: '75 min', category: 'Treatment', desc: 'Intensive moisture repair.' },
  { id: 5, name: 'Blowout & Style', price: 55, duration: '30 min', category: 'Hair', desc: 'Sleek or voluminous -- your call.' },
  { id: 6, name: 'Full Color & Highlights', price: 180, duration: '2.5 hours', category: 'Color', desc: 'Custom multi-tonal brilliance.' },
  { id: 7, name: 'Luxury Pedicure', price: 75, duration: '50 min', category: 'Nails', desc: 'Total foot rejuvenation.' },
  { id: 8, name: 'Scalp & Hair Therapy', price: 110, duration: '90 min', category: 'Treatment', desc: 'Clinical-grade scalp wellness.' },
  { id: 9, name: 'Classic Fade', price: 45, duration: '30 min', category: 'Hair', desc: 'Sharp, clean, precise.' },
  { id: 10, name: 'Bridal Package', price: 350, duration: '4 hours', category: 'Hair', desc: 'Full bridal hair & makeup.' },
  { id: 11, name: 'Nail Art Design', price: 85, duration: '75 min', category: 'Nails', desc: 'Custom hand-painted nail art.' },
  { id: 12, name: 'Aromatherapy Facial', price: 120, duration: '60 min', category: 'Treatment', desc: 'Organic, calming facial experience.' },
];

const TIME_SLOTS: string[] = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

const CATEGORIES: string[] = ['Hair', 'Color', 'Treatment', 'Nails'];

interface GradientMap {
  [key: string]: string;
}

const GRADIENTS: GradientMap = {
  Hair: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  Color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  Treatment: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  Nails: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
};

const ADMIN_EMAIL = 'admin@salon.com';

function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function generateAuditEntry(user: string, userRole: UserRole, action: AuditAction, details: string, entityType?: string, entityId?: string | number): AuditLogEntry {
  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    user,
    userRole,
    action,
    details,
    entityType,
    entityId,
  };
}

interface SalonProviderProps {
  children: ReactNode;
}

export const SalonProvider = ({ children }: SalonProviderProps) => {
  const [services, setServices] = useState<ServiceHistoryItem[]>(() => {
    const saved = localStorage.getItem('salon_services');
    return saved ? JSON.parse(saved) : ALL_SERVICES;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('salon_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('salon_customers');
    return saved ? JSON.parse(saved) : CUSTOMERS;
  });

  const [emailLog, setEmailLog] = useState<EmailNotification[]>(() => {
    const saved = localStorage.getItem('salon_email_log');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('salon_audit_log');
    return saved ? JSON.parse(saved) : [];
  });

  const [serviceMenu, setServiceMenu] = useState<ServiceMenuItem[]>(() => {
    const saved = localStorage.getItem('salon_service_menu');
    return saved ? JSON.parse(saved) : SERVICE_MENU;
  });

  const [timeSlots, setTimeSlots] = useState<string[]>(() => {
    const saved = localStorage.getItem('salon_time_slots');
    return saved ? JSON.parse(saved) : TIME_SLOTS;
  });

  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('salon_staff_list');
    return saved ? JSON.parse(saved) : STAFF;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('salon_categories');
    return saved ? JSON.parse(saved) : CATEGORIES;
  });

  useEffect(() => { localStorage.setItem('salon_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('salon_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('salon_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('salon_email_log', JSON.stringify(emailLog)); }, [emailLog]);
  useEffect(() => { localStorage.setItem('salon_audit_log', JSON.stringify(auditLog)); }, [auditLog]);
  useEffect(() => { localStorage.setItem('salon_service_menu', JSON.stringify(serviceMenu)); }, [serviceMenu]);
  useEffect(() => { localStorage.setItem('salon_time_slots', JSON.stringify(timeSlots)); }, [timeSlots]);
  useEffect(() => { localStorage.setItem('salon_staff_list', JSON.stringify(staffList)); }, [staffList]);
  useEffect(() => { localStorage.setItem('salon_categories', JSON.stringify(categories)); }, [categories]);

  const addAuditEntry = useCallback((action: AuditAction, details: string, entityType?: string, entityId?: string | number) => {
    const entry = generateAuditEntry(currentUser || 'system', currentUserRole || 'client', action, details, entityType, entityId);
    setAuditLog(prev => [entry, ...prev]);
  }, [currentUser, currentUserRole]);

  const recordService = useCallback((newService: Omit<ServiceHistoryItem, 'id' | 'gradient'> & { gradient?: string }) => {
    setServices(prev => [{
      ...newService,
      id: generateId(),
      gradient: newService.gradient || GRADIENTS[newService.category] || GRADIENTS.Hair
    } as ServiceHistoryItem, ...prev]);
    addAuditEntry('record_service', `Service "${newService.serviceType}" recorded for ${newService.customerId}`, 'service', newService.customerId);
  }, [addAuditEntry]);

  const sendEmailNotification = useCallback((type: EmailNotification['type'], to: string, appointmentId?: number) => {
    const subjectMap: Record<string, string> = {
      booking_pending: 'New Booking Request - Pending Approval',
      booking_approved: 'Your Appointment has been Approved',
      booking_rejected: 'Appointment Request Declined',
      booking_confirmed: 'Your Appointment is Confirmed',
      booking_cancelled: 'Appointment Cancelled',
      booking_completed: 'Appointment Completed - Thank You!',
      service_recorded: 'New Service Added to Your History',
      reminder: 'Reminder: Upcoming Appointment Tomorrow',
    };
    const bodyMap: Record<string, string> = {
      booking_pending: 'A new booking request requires your review. Please log in to approve or decline.',
      booking_approved: 'Great news! Your appointment request has been approved. We look forward to seeing you!',
      booking_rejected: 'Unfortunately, your appointment request has been declined. Please try booking a different time or service.',
      booking_confirmed: 'Your appointment has been confirmed. We look forward to seeing you at the salon!',
      booking_cancelled: 'Your appointment has been cancelled as requested. If you need to reschedule, please book again.',
      booking_completed: 'Thank you for visiting! Your appointment has been completed. We hope to see you again soon.',
      service_recorded: 'A new service has been added to your history. You can view it in your dashboard.',
      reminder: 'This is a friendly reminder of your upcoming appointment tomorrow. See you soon!',
    };
    setEmailLog(prev => [{
      id: generateId(),
      to,
      subject: subjectMap[type],
      body: bodyMap[type],
      sentAt: new Date().toISOString(),
      type,
      appointmentId,
    }, ...prev]);
  }, []);

  const bookAppointment = useCallback((appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => {
    const id = generateId();
    setAppointments(prev => [{
      ...appointment,
      id,
      status: 'pending',
      createdAt: new Date().toISOString()
    } as Appointment, ...prev]);
    sendEmailNotification('booking_pending', ADMIN_EMAIL, id);
    addAuditEntry('book_appointment', `Booking: ${appointment.service} for ${appointment.customerId} on ${appointment.date}`, 'appointment', id);
    return true;
  }, [sendEmailNotification, addAuditEntry]);

  const cancelAppointment = useCallback((id: number) => {
    const apt = appointments.find(a => a.id === id);
    setAppointments(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'cancelled' as const } : a
    ));
    if (apt) {
      sendEmailNotification('booking_cancelled', apt.customerId, id);
      addAuditEntry('cancel_appointment', `Appointment #${id} cancelled: ${apt.service}`, 'appointment', id);
    }
  }, [appointments, sendEmailNotification, addAuditEntry]);

  const completeAppointment = useCallback((id: number) => {
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      const service = serviceMenu.find(s => s.name === apt.service);
      recordService({
        customerId: apt.customerId,
        serviceType: apt.service,
        stylist: apt.stylist,
        cost: apt.cost,
        duration: apt.duration,
        category: apt.category,
        date: apt.date
      });
      sendEmailNotification('booking_completed', apt.customerId, id);
    }
    setAppointments(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'completed' as const } : a
    ));
    addAuditEntry('complete_appointment', `Appointment #${id} marked completed`, 'appointment', id);
  }, [appointments, serviceMenu, recordService, sendEmailNotification, addAuditEntry]);

  const approveBooking = useCallback((id: number) => {
    setAppointments(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'approved' as const } : a
    ));
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      sendEmailNotification('booking_approved', apt.customerId, id);
      addAuditEntry('approve_booking', `Appointment #${id} approved: ${apt.service} for ${apt.customerId}`, 'appointment', id);
    }
  }, [appointments, sendEmailNotification, addAuditEntry]);

  const rejectBooking = useCallback((id: number, reason: string) => {
    setAppointments(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'rejected' as const, rejectionReason: reason } : a
    ));
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      sendEmailNotification('booking_rejected', apt.customerId, id);
      addAuditEntry('reject_booking', `Appointment #${id} rejected: ${reason}`, 'appointment', id);
    }
  }, [appointments, sendEmailNotification, addAuditEntry]);

  const createWalkIn = useCallback((appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => {
    const id = generateId();
    setAppointments(prev => [{
      ...appointment,
      id,
      status: 'approved',
      isWalkIn: true,
      createdAt: new Date().toISOString()
    } as Appointment, ...prev]);
    sendEmailNotification('booking_confirmed', appointment.customerId, id);
    addAuditEntry('walk_in_booking', `Walk-in: ${appointment.service} for ${appointment.customerName || appointment.customerId}`, 'appointment', id);
  }, [sendEmailNotification, addAuditEntry]);

  const login = useCallback((email: string, role: UserRole) => {
    setCurrentUser(email);
    setCurrentUserRole(role);
    addAuditEntry('login', `User ${email} logged in as ${role}`);
  }, [addAuditEntry]);

  const logout = useCallback(() => {
    if (currentUser) {
      addAuditEntry('logout', `User ${currentUser} logged out`);
    }
    setCurrentUser(null);
    setCurrentUserRole(null);
  }, [currentUser, addAuditEntry]);

  const registerCustomer = useCallback((name: string, email: string, phone: string): boolean => {
    if (customers.some(c => c.email === email)) return false;
    const newCustomer: Customer = {
      id: generateId(),
      name,
      email,
      phone,
      status: 'Active',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      totalVisits: 0,
    };
    setCustomers(prev => [...prev, newCustomer]);
    setCurrentUser(email);
    setCurrentUserRole('client');
    addAuditEntry('create_customer', `Customer created: ${name} (${email})`, 'customer', email);
    return true;
  }, [customers, addAuditEntry]);

  const updateServiceMenu = useCallback((services: ServiceMenuItem[]) => {
    setServiceMenu(services);
    addAuditEntry('update_service', 'Service menu updated');
  }, [addAuditEntry]);

  const updateTimeSlots = useCallback((slots: string[]) => {
    setTimeSlots(slots);
    addAuditEntry('update_time_slot', `Time slots updated: ${slots.length} slots`);
  }, [addAuditEntry]);

  const updateStaffList = useCallback((staffList: StaffMember[]) => {
    setStaffList(staffList);
    addAuditEntry('update_staff', `Staff list updated: ${staffList.length} members`);
  }, [addAuditEntry]);

  const updateCategories = useCallback((cats: string[]) => {
    setCategories(cats);
    addAuditEntry('update_category', `Categories updated: ${cats.join(', ')}`);
  }, [addAuditEntry]);

  const addServiceMenuItem = useCallback((item: Omit<ServiceMenuItem, 'id'>) => {
    const newItem = { ...item, id: generateId() };
    setServiceMenu(prev => [...prev, newItem]);
    addAuditEntry('create_service', `Service created: ${item.name}`);
  }, [addAuditEntry]);

  const deleteServiceMenuItem = useCallback((id: number) => {
    const item = serviceMenu.find(s => s.id === id);
    setServiceMenu(prev => prev.filter(s => s.id !== id));
    if (item) {
      addAuditEntry('delete_service', `Service deleted: ${item.name}`);
    }
  }, [serviceMenu, addAuditEntry]);

  return (
    <SalonContext.Provider value={{
      services, categories, recordService,
      appointments, bookAppointment, cancelAppointment, completeAppointment,
      approveBooking, rejectBooking, createWalkIn,
      staff: staffList, customers,
      serviceMenu, timeSlots,
      currentUser, currentUserRole,
      isAdmin: currentUserRole === 'admin',
      isStaff: currentUserRole === 'staff' || currentUserRole === 'admin',
      login, logout, registerCustomer,
      emailLog, sendEmailNotification,
      auditLog,
      updateServiceMenu, updateTimeSlots, updateStaffList, updateCategories,
      addServiceMenuItem, deleteServiceMenuItem,
    }}>
      {children}
    </SalonContext.Provider>
  );
};
