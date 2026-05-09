import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSalon } from '../context/SalonContext';
import StatsCard from '../components/StatsCard';
import BookingModal from '../components/BookingModal';
import { Calendar, User, DollarSign, Scissors, Sparkles, Filter, History, LogOut, Phone, Mail, CalendarCheck, MapPin, Clock3 } from 'lucide-react';
import type { ServiceHistoryItem } from '../types';

function ServiceHistoryCard({ services = [], visibleBehind = 2 }: { services: ServiceHistoryItem[]; visibleBehind?: number }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartRef = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  if (!services || services.length === 0) return (
    <div className="glass" style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
      <History size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
      <p>No service history yet. Book your first appointment!</p>
    </div>
  );

  const totalCards = services.length;

  const navigate = useCallback((newIndex: number) => {
    if (totalCards === 0) return;
    setActiveIndex((newIndex + totalCards) % totalCards);
  }, [totalCards]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (index !== activeIndex) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartRef.current = clientX;
    cardRefs.current[activeIndex]?.classList.add('is-dragging');
  };

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragOffset(clientX - dragStartRef.current);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    cardRefs.current[activeIndex]?.classList.remove('is-dragging');
    if (Math.abs(dragOffset) > 50) {
      navigate(activeIndex + (dragOffset < 0 ? 1 : -1));
    }
    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset, activeIndex, navigate]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <section style={{ width: '100%', maxWidth: 560, margin: '0 auto' }}>
      <style>{`
        .sc-card { position: absolute; top: 0; left: 0; right: 0; transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease; cursor: grab; }
        .sc-card.is-dragging { cursor: grabbing; transition: none; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.15); border: none; cursor: pointer; transition: all 0.3s; }
        .dot.active { background: #8b5cf6; width: 24px; border-radius: 4px; }
      `}</style>

      <div style={{ height: 380, position: 'relative' }}>
        {services.map((service, index) => {
          const displayOrder = (index - activeIndex + totalCards) % totalCards;
          const style: React.CSSProperties = {};

          if (displayOrder === 0) {
            style.transform = `translateX(${dragOffset}px)`;
            style.opacity = 1; style.zIndex = totalCards;
          } else if (displayOrder <= visibleBehind) {
            const scale = 1 - 0.05 * displayOrder;
            const translateY = -2 * displayOrder;
            style.transform = `scale(${scale}) translateY(${translateY}rem)`;
            style.opacity = 1 - 0.2 * displayOrder;
            style.zIndex = totalCards - displayOrder;
          } else {
            style.transform = 'scale(0)'; style.opacity = 0; style.zIndex = 0;
          }

          return (
            <div
              ref={el => { if (el) cardRefs.current[index] = el; }}
              key={service.id}
              className="sc-card"
              style={{
                ...style,
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                overflow: 'hidden'
              }}
              onMouseDown={(e) => handleDragStart(e, index)}
              onTouchStart={(e) => handleDragStart(e, index)}
            >
              <div style={{ padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <motion.div whileHover={{ scale: 1.05, rotate: 5 }}
                      style={{
                        width: 56, height: 56, borderRadius: 14,
                        background: service.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                      <Scissors size={28} color="white" />
                    </motion.div>
                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 'bold' }}>{service.serviceType}</h3>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Calendar size={13} /> {service.date}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="premium-gradient-text" style={{ fontSize: 24, fontWeight: 'bold' }}>
                      {currency.format(service.cost)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 2 }}>
                      <Scissors size={12} /> {service.duration}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div className="glass" style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      <User size={11} /> Stylist
                    </div>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>{service.stylist}</p>
                  </div>
                  <div className="glass" style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      <Scissors size={11} /> Category
                    </div>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>{service.category}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)', fontSize: 10, fontWeight: 700 }}>COMPLETED</span>
                    <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', fontSize: 10, fontWeight: 700 }}>PREMIUM</span>
                  </div>
                  <motion.button whileHover={{ x: 4 }}
                    style={{ background: 'none', border: 'none', color: '#8b5cf6', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    Details
                  </motion.button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 32 }}>
        {services.map((_, index) => (
          <button key={index} onClick={() => navigate(index)}
            className={`dot ${activeIndex === index ? 'active' : ''}`} />
        ))}
      </div>
    </section>
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
  const { services, appointments, categories, cancelAppointment } = useSalon();
  const [filter, setFilter] = useState('All');
  const [showBooking, setShowBooking] = useState(false);

  const filteredServices = services.filter(s =>
    s.customerId === 'customer@example.com' && (filter === 'All' || s.category === filter)
  );

  const totalSpent = filteredServices.reduce((sum, s) => sum + s.cost, 0);
  const customerAppointments = appointments.filter(a => a.customerId === 'customer@example.com');

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
          <StatsCard title="Total Services" value={filteredServices.length} icon={Scissors} color="#8b5cf6" trend={12} />
          <StatsCard title="Total Spent" value={`$${totalSpent}`} icon={DollarSign} color="#22c55e" />
          <StatsCard title="Upcoming" value={customerAppointments.filter(a => a.status === 'confirmed').length} icon={Calendar} color="#ec4899" />
          <StatsCard title="Loyalty Tier" value="Gold" icon={Sparkles} color="#f59e0b" subtitle="2 more visits to Platinum" />
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

              <ServiceHistoryCard services={filteredServices} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
