import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { StaffMember, Customer, ServiceMenuItem, Appointment, ServiceHistoryItem, SalonContextType } from '../types';

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
  { id: 1, name: 'Alex Johnson', email: 'customer@example.com', phone: '+1 (555) 123-4567', status: 'Active', joinDate: 'Jan 2023', totalVisits: 24, lifetimeValue: 5840 },
  { id: 2, name: 'Maria Garcia', email: 'maria@example.com', phone: '+1 (555) 234-5678', status: 'Active', joinDate: 'Mar 2023', totalVisits: 18, lifetimeValue: 4200 },
  { id: 3, name: 'James Smith', email: 'james@example.com', phone: '+1 (555) 345-6789', status: 'Active', joinDate: 'Jun 2023', totalVisits: 12, lifetimeValue: 2100 },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+1 (555) 456-7890', status: 'Inactive', joinDate: 'Feb 2023', totalVisits: 6, lifetimeValue: 980 },
  { id: 5, name: 'David Kim', email: 'david@example.com', phone: '+1 (555) 567-8901', status: 'Active', joinDate: 'Sep 2023', totalVisits: 9, lifetimeValue: 1750 },
  { id: 6, name: 'Emily Davis', email: 'emily@example.com', phone: '+1 (555) 678-9012', status: 'At Risk', joinDate: 'Apr 2023', totalVisits: 4, lifetimeValue: 620 },
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

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('salon_customers');
    return saved ? JSON.parse(saved) : CUSTOMERS;
  });

  useEffect(() => {
    localStorage.setItem('salon_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('salon_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('salon_customers', JSON.stringify(customers));
  }, [customers]);

  const recordService = (newService: Omit<ServiceHistoryItem, 'id' | 'gradient'> & { gradient?: string }) => {
    setServices(prev => [{
      ...newService,
      id: Date.now(),
      gradient: newService.gradient || GRADIENTS[newService.category] || GRADIENTS.Hair
    } as ServiceHistoryItem, ...prev]);
  };

  const bookAppointment = (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => {
    setAppointments(prev => [{
      ...appointment,
      id: Date.now(),
      status: 'confirmed',
      createdAt: new Date().toISOString()
    } as Appointment, ...prev]);
    return true;
  };

  const cancelAppointment = (id: number) => {
    setAppointments(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'cancelled' as const } : a
    ));
  };

  const completeAppointment = (id: number) => {
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      const service = SERVICE_MENU.find(s => s.name === apt.service);
      recordService({
        customerId: apt.customerId,
        serviceType: apt.service,
        stylist: apt.stylist,
        cost: apt.cost,
        duration: apt.duration,
        category: apt.category,
        date: apt.date
      });
    }
    setAppointments(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'completed' as const } : a
    ));
  };

  const login = (email: string) => {
    setCurrentUser(email);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerCustomer = (name: string, email: string, phone: string): boolean => {
    if (customers.some(c => c.email === email)) return false;
    const newCustomer: Customer = {
      id: Date.now(),
      name,
      email,
      phone,
      status: 'Active',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      totalVisits: 0,
      lifetimeValue: 0,
    };
    setCustomers(prev => [...prev, newCustomer]);
    setCurrentUser(email);
    return true;
  };

  return (
    <SalonContext.Provider value={{
      services, categories: CATEGORIES, recordService,
      appointments, bookAppointment, cancelAppointment, completeAppointment,
      staff: STAFF, customers,
      serviceMenu: SERVICE_MENU, timeSlots: TIME_SLOTS,
      currentUser, login, logout, registerCustomer
    }}>
      {children}
    </SalonContext.Provider>
  );
};
