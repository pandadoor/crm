import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSalon } from '../context/SalonContext';
import StatsCard from '../components/StatsCard';
import BookingModal from '../components/BookingModal';
import { Calendar, User, Scissors, Sparkles, Filter, History, LogOut, Phone, Mail, CalendarCheck, MapPin, Clock3, Bell, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { ServiceHistoryItem, Appointment } from '../types';

function ServiceHistoryTimeline({ services = [] }: { services: ServiceHistoryItem[] }) {
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  if (!services || services.length === 0) return (
    <div className="glass" style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
      <History size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
      <p>No service history yet. Book your first appointment!</p>
    </div>
  );

  return (
    <div style={{ position: 'relative', paddingLeft: 32 }}>
      <div style={{
        position: 'absolute', left: 11, top: 8, bottom: 8, width: 2,
        background: 'linear-gradient(180deg, rgba(139,92,246,0.4), rgba(217,70,239,0.1))',
        borderRadius: 1
      }} />
      <AnimatePresence>
        {services.map((service, idx) => {
          const isExpanded = expandedId === service.id;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              style={{ position: 'relative', marginBottom: 16 }}
            >
              <div style={{
                position: 'absolute', left: -27, top: 20, width: 12, height: 12,
                borderRadius: '50%', border: '2px solid rgba(139,92,246,0.5)',
                background: service.gradient || '#8b5cf6',
                boxShadow: '0 0 8px rgba(139,92,246,0.3)',
                zIndex: 1
              }} />
              <div
                onClick={() => setExpandedId(isExpanded ? null : service.id)}
                className="glass"
                style={{
                  padding: 18, borderRadius: 12, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={11} /> {service.date}
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>{service.serviceType}</h4>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <User size={11} /> {service.stylist}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                        background: 'rgba(139,92,246,0.1)', color: '#8b5cf6'
                      }}>
                        {service.category}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock3 size={10} /> {service.duration}
                      </span>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <Sparkles size={14} color="var(--text-secondary)" style={{ opacity: 0.4 }} />
                  </motion.div>
                </div>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <div><span style={{ color: 'white', fontWeight: 500 }}>Service:</span> {service.serviceType}</div>
                      <div><span style={{ color: 'white', fontWeight: 500 }}>Duration:</span> {service.duration}</div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function AppointmentBadge({ status }: { status: Appointment['status'] }) {
  const config = {
    pending: { icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Pending Approval' },
    approved: { icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', label: 'Approved' },
    rejected: { icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Declined' },
    completed: { icon: CheckCircle, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', label: 'Completed' },
    cancelled: { icon: XCircle, color: '#6b7280', bg: 'rgba(107,114,128,0.1)', label: 'Cancelled' },
  };
  const c = config[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
      background: c.bg, color: c.color
    }}>
      <c.icon size={12} /> {c.label}
    </span>
  );
}

function UpcomingAppointments({ onCancel, onBook }: { onCancel: (id: number) => void; onBook: () => void }) {
  const { appointments } = useSalon();
  const customerAppointments = appointments.filter(a =>
    a.customerId === 'customer@example.com' &&
    (a.status === 'pending' || a.status === 'approved')
  );

  if (customerAppointments.length === 0) return (
    <div className="glass" style={{ padding: 32, textAlign: 'center' }}>
      <CalendarCheck size={36} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>No upcoming appointments</p>
      <button onClick={onBook} className="premium-btn" style={{ padding: '10px 24px', fontSize: 13 }}>
        Book Now
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {customerAppointments.slice(0, 5).map(apt => (
        <motion.div key={apt.id} whileHover={{ x: 4 }}
          className="glass"
          style={{
            padding: 16, background: 'rgba(255,255,255,0.02)',
            border: apt.status === 'pending' ? '1px solid rgba(245,158,11,0.2)' :
                    apt.status === 'approved' ? '1px solid rgba(34,197,94,0.15)' :
                    '1px solid rgba(255,255,255,0.06)'
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: apt.status === 'pending' ? 'rgba(245,158,11,0.1)' : 'rgba(139,92,246,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {apt.status === 'pending' ? <Clock size={18} color="#f59e0b" /> :
                 apt.status === 'approved' ? <CheckCircle size={18} color="#22c55e" /> :
                 <Calendar size={18} color="#8b5cf6" />}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{apt.service}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Clock3 size={11} /> {apt.date} at {apt.time}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <AppointmentBadge status={apt.status} />
              {apt.status === 'pending' && (
                <button onClick={() => onCancel(apt.id)}
                  style={{
                    padding: '6px 12px', borderRadius: 6,
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                    color: '#ef4444', fontSize: 11, cursor: 'pointer', fontWeight: 600
                  }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
          {apt.status === 'pending' && (
            <div style={{
              marginTop: 10, padding: '8px 12px', borderRadius: 8,
              background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)',
              fontSize: 12, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6
            }}>
              <AlertTriangle size={12} />
              Awaiting approval — we'll notify you once confirmed
            </div>
          )}
          {apt.status === 'approved' && apt.isWalkIn && (
            <div style={{
              marginTop: 10, padding: '8px 12px', borderRadius: 8,
              background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.1)',
              fontSize: 12, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 6
            }}>
              <CheckCircle size={12} /> Walk-in appointment
            </div>
          )}
          {apt.status !== 'pending' && (
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button onClick={() => onCancel(apt.id)}
                style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 11,
                  background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)',
                  color: '#ef4444', cursor: 'pointer', fontWeight: 500
                }}>
                Cancel
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { services, appointments, categories, cancelAppointment, emailLog, currentUser, logout } = useSalon();
  const [filter, setFilter] = useState('All');
  const [showBooking, setShowBooking] = useState(false);

  const userEmail = currentUser || 'customer@example.com';

  const filteredServices = services.filter(s =>
    s.customerId === userEmail && (filter === 'All' || s.category === filter)
  );

  const customerAppointments = appointments.filter(a => a.customerId === userEmail);
  const myEmails = emailLog.filter(e => e.to === userEmail);

  const handleCancel = (id: number) => {
    if (window.confirm('Cancel this appointment?')) {
      cancelAppointment(id);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="layout-container" style={{ padding: '24px 40px 60px', background: '#050505', minHeight: '100vh' }}>
      {mounted && <BookingModal open={showBooking} onClose={() => setShowBooking(false)} preselectedService={null} />}

      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 className="premium-gradient-text" style={{ fontSize: 32, fontWeight: 'bold' }}>Welcome back</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Your beauty journey, beautifully tracked.</p>
          </div>
          <button onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-secondary)', padding: '10px 20px', borderRadius: 10,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13
            }}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
          <StatsCard title="Total Services" value={filteredServices.length} icon={Scissors} color="#8b5cf6" subtitle="All time" />
          <StatsCard title="Upcoming" value={customerAppointments.filter(a => a.status === 'approved' || a.status === 'pending').length} icon={Calendar} color="#ec4899" subtitle="Appointments" />
          <StatsCard title="Pending" value={customerAppointments.filter(a => a.status === 'pending').length} icon={Clock} color="#f59e0b" subtitle="Awaiting approval" />
          <StatsCard title="Notifications" value={myEmails.length} icon={Bell} color="#22c55e" subtitle="Email updates" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 32, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="glass" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', margin: '0 auto 12px',
                background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 'bold', color: 'white'
              }}>
                {userEmail.substring(0, 2).toUpperCase()}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 'bold' }}>Account</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>{userEmail}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
                {([
                  { icon: Mail, text: userEmail },
                  { icon: MapPin, text: 'New York, NY' },
                ] as const).map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>
                    <item.icon size={13} color="#8b5cf6" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarCheck size={16} color="#8b5cf6" /> My Appointments
                </h4>
                <button onClick={() => setShowBooking(true)}
                  style={{
                    padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: 'rgba(139,92,246,0.1)', border: 'none', color: '#8b5cf6', cursor: 'pointer'
                  }}>
                  + New
                </button>
              </div>
              <UpcomingAppointments onCancel={handleCancel} onBook={() => setShowBooking(true)} />
            </div>

            {customerAppointments.filter(a => a.status === 'rejected').length > 0 && (
              <div className="glass" style={{ padding: 20, border: '1px solid rgba(239,68,68,0.15)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, color: '#ef4444' }}>
                  <XCircle size={16} /> Declined Bookings
                </h4>
                {customerAppointments.filter(a => a.status === 'rejected').map(apt => (
                  <div key={apt.id} style={{
                    padding: 10, borderRadius: 8, marginBottom: 8, fontSize: 12,
                    background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.08)'
                  }}>
                    <div style={{ fontWeight: 500 }}>{apt.service} — {apt.date}</div>
                    {apt.rejectionReason && (
                      <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
                        Reason: {apt.rejectionReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="glass" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <History size={22} color="#8b5cf6" />
                  <h2 style={{ fontSize: 20 }}>Service History</h2>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Filter size={14} color="var(--text-secondary)" />
                  <select value={filter} onChange={(e) => setFilter(e.target.value)}
                    className="glass"
                    style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, background: 'rgba(5,5,5,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <option value="All">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <ServiceHistoryTimeline services={filteredServices} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
