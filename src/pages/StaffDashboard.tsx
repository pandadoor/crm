import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSalon } from '../context/SalonContext';
import StatsCard from '../components/StatsCard';
import { Calendar, Users, LogOut, Check, X, Clock, Search, Sparkles, ClipboardList, Bell, Scissors, UserPlus, AlertTriangle } from 'lucide-react';

function WalkInForm({ onBack }: { onBack: () => void }) {
  const { serviceMenu, staff, timeSlots, createWalkIn } = useSalon();
  const [serviceId, setServiceId] = useState(0);
  const [stylistName, setStylistName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [success, setSuccess] = useState(false);

  const selectedService = serviceMenu.find(s => s.id === serviceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !stylistName || !customerEmail || !time) return;
    const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    createWalkIn({
      service: selectedService.name,
      stylist: stylistName,
      date: formattedDate,
      time,
      cost: selectedService.price,
      duration: selectedService.duration,
      category: selectedService.category,
      customerId: customerEmail,
      customerName: customerName || undefined,
    });
    setSuccess(true);
    setTimeout(() => { setSuccess(false); onBack(); }, 2000);
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="glass" style={{ padding: 60, textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={36} color="#22c55e" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>Walk-In Booked!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Appointment confirmed.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="glass" style={{ padding: 32, maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClipboardList size={20} color="#22c55e" /> Walk-In Booking
          </h2>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>Back</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Customer Email</label>
              <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="customer@example.com" required style={{ fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Customer Name</label>
              <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Walk-in Name" style={{ fontSize: 13 }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Service</label>
            <select value={serviceId} onChange={e => setServiceId(Number(e.target.value))} required style={{ fontSize: 13 }}>
              <option value="">Select a service</option>
              {serviceMenu.map(s => <option key={s.id} value={s.id}>{s.name} â€” ${s.price}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Stylist</label>
            <select value={stylistName} onChange={e => setStylistName(e.target.value)} required style={{ fontSize: 13 }}>
              <option value="">Select stylist</option>
              {staff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Time</label>
              <select value={time} onChange={e => setTime(e.target.value)} required style={{ fontSize: 13 }}>
                <option value="">Select time</option>
                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          {selectedService && (
            <div style={{ padding: 14, borderRadius: 10, background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.1)', fontSize: 13 }}>
              <strong style={{ color: '#22c55e' }}>${selectedService.price}</strong>
              <span style={{ color: 'var(--text-secondary)' }}> Â· {selectedService.duration}</span>
              <span style={{ color: 'var(--text-secondary)' }}> Â· {selectedService.category}</span>
            </div>
          )}
          <button type="submit" className="premium-btn" style={{ marginTop: 8, padding: 14, fontSize: 14 }}>
            <ClipboardList size={18} /> Confirm Walk-In Booking
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { appointments, customers, approveBooking, rejectBooking, completeAppointment, emailLog, currentUser, logout, services } = useSalon();
  const [view, setView] = useState('overview');
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const pending = appointments.filter(a => a.status === 'pending');
  const todayAppts = appointments.filter(a => a.status === 'approved');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleConfirmReject = () => {
    if (rejectId && rejectReason.trim()) {
      rejectBooking(rejectId, rejectReason);
      setRejectId(null);
      setRejectReason('');
    }
  };

  const getCustomerName = (email: string) => {
    const c = customers.find(c => c.email === email);
    return c ? c.name : email;
  };

  return (
    <div className="layout-container" style={{ padding: '24px 40px 60px', background: '#050505', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 className="premium-gradient-text" style={{ fontSize: 30, fontWeight: 'bold' }}>Staff Portal</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {currentUser && <>Signed in as <strong style={{ color: 'rgba(255,255,255,0.6)' }}>{currentUser}</strong></>}
              {' Â· '}Manage bookings and walk-ins
            </p>
          </div>
          <button onClick={handleLogout}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {([
            { id: 'overview', label: 'Overview', icon: Bell },
            { id: 'approvals', label: 'Approvals', icon: Clock },
            { id: 'walkin', label: 'Walk-In', icon: UserPlus },
            { id: 'schedule', label: 'Schedule', icon: Calendar },
          ] as const).map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)}
              style={{
                padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                background: view === tab.id ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(255,255,255,0.04)',
                color: 'white', transition: 'all 0.2s'
              }}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {view === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              <StatsCard title="Pending Approval" value={pending.length} icon={Clock} color="#f59e0b" subtitle="Awaiting review" />
              <StatsCard title="Today's Appointments" value={todayAppts.length} icon={Calendar} color="#22c55e" subtitle="Approved" />
              <StatsCard title="Total Customers" value={customers.length} icon={Users} color="#8b5cf6" subtitle="In system" />
              <StatsCard title="Services Done" value={services.length} icon={Scissors} color="#ec4899" subtitle="All time" />
            </div>

            {pending.length > 0 && (
              <div className="glass" style={{ padding: 24, marginBottom: 24, border: '1px solid rgba(245,158,11,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <AlertTriangle size={18} color="#f59e0b" />
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>Action Needed</h3>
                  <span style={{
                    marginLeft: 'auto', padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                    background: 'rgba(245,158,11,0.15)', color: '#f59e0b'
                  }}>
                    {pending.length} pending
                  </span>
                </div>
                {pending.slice(0, 3).map(apt => (
                  <div key={apt.id} style={{
                    padding: '12px 16px', borderRadius: 10, marginBottom: 8,
                    background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.08)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{apt.service} â€” {getCustomerName(apt.customerId)}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{apt.date} at {apt.time}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => approveBooking(apt.id)}
                        style={{ padding: '6px 12px', borderRadius: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                        <Check size={12} style={{ marginRight: 2 }} /> Approve
                      </button>
                      <button onClick={() => { setRejectId(apt.id); setRejectReason(''); }}
                        style={{ padding: '6px 12px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                        <X size={12} style={{ marginRight: 2 }} /> Decline
                      </button>
                    </div>
                  </div>
                ))}
                {pending.length > 3 && (
                  <button onClick={() => setView('approvals')}
                    style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', fontSize: 13, marginTop: 8 }}>
                    View all {pending.length} pending
                  </button>
                )}
              </div>
            )}

            <div className="glass" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={16} color="#8b5cf6" /> Recent Activity
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {emailLog.slice(0, 5).map((entry, idx) => (
                  <div key={entry.id} style={{
                    padding: '10px 14px', borderRadius: 8, fontSize: 12,
                    background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                    display: 'flex', gap: 8, alignItems: 'flex-start'
                  }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bell size={12} color="#8b5cf6" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{entry.subject}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>To: {entry.to} Â· {new Date(entry.sentAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                {emailLog.length === 0 && (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 16 }}>No recent activity.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {view === 'approvals' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass" style={{ padding: 28, border: '1px solid rgba(245,158,11,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={16} color="#f59e0b" />
                </div>
                <h2 style={{ fontSize: 18 }}>Pending Approvals</h2>
                <span style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: pending.length > 0 ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.1)', color: pending.length > 0 ? '#f59e0b' : '#22c55e' }}>
                  {pending.length} pending
                </span>
              </div>
              {pending.length === 0 && (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
                  <Sparkles size={32} style={{ opacity: 0.15, margin: '0 auto 10px', display: 'block' }} />
                  No pending approvals.
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pending.map(apt => (
                  <motion.div key={apt.id} layout style={{ padding: '18px 20px', borderRadius: 12, background: 'rgba(245,158,11,0.02)', border: '1px solid rgba(245,158,11,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Clock size={18} color="#f59e0b" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{apt.service}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{getCustomerName(apt.customerId)} Â· {apt.stylist}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, marginLeft: 46 }}>
                          {apt.date} at {apt.time} Â· {apt.duration}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => approveBooking(apt.id)} className="premium-btn" style={{ padding: '8px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                          <Check size={14} /> Approve
                        </button>
                        <button onClick={() => { setRejectId(apt.id); setRejectReason(''); }}
                          style={{ padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <X size={14} /> Decline
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {view === 'walkin' && <WalkInForm onBack={() => setView('overview')} />}

        {view === 'schedule' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={16} color="#8b5cf6" />
                </div>
                <h2 style={{ fontSize: 18 }}>Today's Schedule</h2>
                <span style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                  {todayAppts.length} appointments
                </span>
              </div>
              {todayAppts.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 20, fontSize: 13 }}>No appointments scheduled for today.</p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {todayAppts.slice().sort((a, b) => a.time.localeCompare(b.time)).map(apt => (
                  <div key={apt.id} style={{
                    padding: '16px 20px', borderRadius: 12,
                    background: apt.isWalkIn ? 'rgba(34,197,94,0.02)' : 'rgba(139,92,246,0.02)',
                    border: `1px solid ${apt.isWalkIn ? 'rgba(34,197,94,0.1)' : 'rgba(139,92,246,0.08)'}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: apt.isWalkIn ? 'rgba(34,197,94,0.1)' : 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar size={20} color={apt.isWalkIn ? '#22c55e' : '#8b5cf6'} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{apt.service}{apt.isWalkIn ? ' ðŸš¶' : ''}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{getCustomerName(apt.customerId)} Â· {apt.stylist}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{apt.date} at {apt.time} Â· {apt.duration}</div>
                      </div>
                    </div>
                    <button onClick={() => completeAppointment(apt.id)}
                      className="premium-btn" style={{ padding: '8px 16px', fontSize: 12, background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                      <Check size={14} /> Complete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass" style={{ padding: 32, width: '100%', maxWidth: 420 }}>
            <h2 style={{ fontSize: 18, marginBottom: 8 }}>Decline Booking</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>Provide a reason. The customer will be notified.</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g. Time slot no longer available..." rows={3} style={{ fontSize: 13, marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setRejectId(null)} style={{ flex: 1, padding: 12, borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', fontSize: 14 }}>Cancel</button>
              <button onClick={handleConfirmReject} disabled={!rejectReason.trim()}
                style={{ flex: 1, padding: 12, borderRadius: 10, cursor: rejectReason.trim() ? 'pointer' : 'not-allowed', background: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none', color: 'white', fontWeight: 600, fontSize: 14, opacity: rejectReason.trim() ? 1 : 0.35 }}>
                <X size={16} style={{ marginRight: 4 }} /> Decline
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
