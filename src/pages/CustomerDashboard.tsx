import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSalon } from '../context/SalonContext';
import StatsCard from '../components/StatsCard';
import BookingModal from '../components/BookingModal';
import { Calendar, User, Scissors, Sparkles, Filter, History, LogOut, Phone, Mail, CalendarCheck, MapPin, Clock3, Bell } from 'lucide-react';
import type { ServiceHistoryItem } from '../types';

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

function UpcomingAppointments({ onCancel, onBook }: { onCancel: (id: number) => void; onBook: () => void }) {
  const { appointments } = useSalon();
  const customerAppointments = appointments.filter(a => a.status === 'confirmed' && a.customerId === 'customer@example.com');

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
      {customerAppointments.slice(0, 3).map(apt => (
        <motion.div key={apt.id} whileHover={{ x: 4 }}
          className="glass"
          style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Calendar size={18} color="#8b5cf6" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{apt.service}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <Clock3 size={11} /> {apt.date} at {apt.time}
              </div>
            </div>
          </div>
          <button onClick={() => onCancel(apt.id)}
            style={{
              padding: '6px 12px', borderRadius: 6,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#ef4444', fontSize: 11, cursor: 'pointer', fontWeight: 600
            }}>
            Cancel
          </button>
        </motion.div>
      ))}
    </div>
  );
}

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { services, appointments, categories, cancelAppointment, emailLog } = useSalon();
  const [filter, setFilter] = useState('All');
  const [showBooking, setShowBooking] = useState(false);

  const filteredServices = services.filter(s =>
    s.customerId === 'customer@example.com' && (filter === 'All' || s.category === filter)
  );

  const customerAppointments = appointments.filter(a => a.customerId === 'customer@example.com');
  const myEmails = emailLog.filter(e => e.to === 'customer@example.com');

  const handleCancel = (id: number) => {
    if (window.confirm('Cancel this appointment?')) {
      cancelAppointment(id);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="layout-container" style={{ padding: '24px 40px 60px', background: '#050505', minHeight: '100vh' }}>
      {mounted && <BookingModal open={showBooking} onClose={() => setShowBooking(false)} preselectedService={null} />}

      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 className="premium-gradient-text" style={{ fontSize: 32, fontWeight: 'bold' }}>Welcome back, Alex</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Your beauty journey, beautifully tracked.</p>
          </div>
          <button onClick={() => navigate('/login')}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-secondary)', padding: '10px 20px', borderRadius: 10,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13
            }}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
          <StatsCard title="Total Services" value={filteredServices.length} icon={Scissors} color="#8b5cf6" subtitle="Lifetime visits" />
          <StatsCard title="Upcoming" value={customerAppointments.filter(a => a.status === 'confirmed').length} icon={Calendar} color="#ec4899" subtitle="Confirmed appointments" />
          <StatsCard title="Loyalty Tier" value="Gold" icon={Sparkles} color="#f59e0b" subtitle="2 more visits to Platinum" />
          <StatsCard title="Notifications" value={myEmails.length} icon={Bell} color="#22c55e" subtitle="Email updates sent" />
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 32, alignItems: 'start' }}>
          {/* Sidebar - Profile & Upcoming */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="glass" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', margin: '0 auto 12px',
                background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 'bold', color: 'white'
              }}>
                AJ
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 'bold' }}>Alex Johnson</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>Member since Jan 2023</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
                {([
                  { icon: Mail, text: 'customer@example.com' },
                  { icon: Phone, text: '+1 (555) 123-4567' },
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
                  <CalendarCheck size={16} color="#8b5cf6" /> Upcoming
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
          </div>

          {/* Main Panel */}
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
