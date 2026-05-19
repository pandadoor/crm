import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSalon } from '../context/SalonContext';
import StatsCard from '../components/StatsCard';
import AuditLogView from '../components/AuditLogView';
import MaintenancePanel from '../components/MaintenancePanel';
import { Users, Scissors, Calendar, Bell, Plus, LogOut, Search, User, Check, X, Sparkles, UserPlus, Activity, Settings, Clock, ClipboardList } from 'lucide-react';
import type { Customer, ServiceHistoryItem, Appointment } from '../types';

function WalkInForm({ onBack }: { onBack: () => void }) {
  const { serviceMenu, staff, timeSlots, customers, createWalkIn } = useSalon();
  const [serviceId, setServiceId] = useState(0);
  const [stylistName, setStylistName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [success, setSuccess] = useState(false);

  const selectedService = serviceMenu.find(s => s.id === serviceId);

  const handleSubmit = (e: FormEvent) => {
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
        <div style={{
          width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px',
          background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Check size={36} color="#22c55e" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>Walk-In Booked!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Appointment confirmed and customer notified.</p>
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
          <button onClick={onBack}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>
            Back
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Customer Email</label>
              <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com" required style={{ fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Customer Name</label>
              <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)}
                placeholder="Walk-in Name" style={{ fontSize: 13 }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Service</label>
            <select value={serviceId} onChange={e => setServiceId(Number(e.target.value))} required style={{ fontSize: 13 }}>
              <option value="">Select a service</option>
              {serviceMenu.map(s => (
                <option key={s.id} value={s.id}>{s.name} — ${s.price}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Stylist</label>
            <select value={stylistName} onChange={e => setStylistName(e.target.value)} required style={{ fontSize: 13 }}>
              <option value="">Select stylist</option>
              {staff.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
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
                {timeSlots.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          {selectedService && (
            <div style={{ padding: 14, borderRadius: 10, background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.1)', fontSize: 13 }}>
              <strong style={{ color: '#22c55e' }}>${selectedService.price}</strong>
              <span style={{ color: 'var(--text-secondary)' }}> · {selectedService.duration}</span>
              <span style={{ color: 'var(--text-secondary)' }}> · {selectedService.category}</span>
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

function RecordServiceView({ categories, recordService, setView }: {
  categories: string[];
  recordService: (service: Omit<ServiceHistoryItem, 'id' | 'gradient'> & { gradient?: string }) => void;
  setView: (view: string) => void;
}) {
  const [customerEmail, setCustomerEmail] = useState('customer@example.com');
  const [serviceType, setServiceType] = useState('');
  const [stylist, setStylist] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('Hair');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    recordService({
      customerId: customerEmail,
      serviceType, stylist, duration, category,
      cost: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    } as unknown as Omit<ServiceHistoryItem, 'id' | 'gradient'> & { gradient?: string });
    setShowSuccess(true);
    setServiceType(''); setStylist(''); setDuration('');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="glass" style={{ padding: 32, maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: 18 }}>Record New Service</h2>
          <button onClick={() => setView('overview')}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>
            Back to Overview
          </button>
        </div>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              padding: 14, borderRadius: 10, marginBottom: 20,
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
              display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#22c55e'
            }}>
            <Check size={18} /> Service recorded and customer notified!
          </motion.div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Customer Email</label>
            <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)}
              placeholder="customer@example.com" required style={{ fontSize: 13 }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Service Type</label>
            <input type="text" placeholder="e.g. Balayage Refinement" required
              value={serviceType} onChange={e => setServiceType(e.target.value)} style={{ fontSize: 13 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Stylist</label>
              <input type="text" placeholder="Emma Rodriguez" required
                value={stylist} onChange={e => setStylist(e.target.value)} style={{ fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                style={{ fontSize: 13 }}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Duration</label>
            <input type="text" placeholder="45 min" required
              value={duration} onChange={e => setDuration(e.target.value)} style={{ fontSize: 13 }} />
          </div>
          <button type="submit" className="premium-btn" style={{ marginTop: 12, padding: 14, fontSize: 14 }}>
            Log Service & Notify Customer
          </button>
        </form>
      </div>
    </motion.div>
  );
}

function CreateCustomerModal({ onClose }: { onClose: () => void }) {
  const { registerCustomer } = useSalon();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = registerCustomer(name, email, phone);
    if (!ok) {
      setError('A customer with this email already exists.');
    } else {
      setSuccess(true);
      setTimeout(onClose, 1200);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)'
    }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="glass" style={{ padding: 32, width: '100%', maxWidth: 420 }}>
        {success ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <Check size={40} color="#22c55e" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 16, fontWeight: 600 }}>Customer Created!</p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 18, marginBottom: 24 }}>Create Customer Account</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Full Name</label>
                <input type="text" placeholder="e.g. Jane Doe" required
                  value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Email Address</label>
                <input type="email" placeholder="jane@example.com" required
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Phone Number</label>
                <input type="tel" placeholder="+1 (555) 000-0000" required
                  value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              {error && <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{error}</p>}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={onClose}
                  style={{
                    flex: 1, padding: 12, borderRadius: 10, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-secondary)', fontSize: 14
                  }}>
                  Cancel
                </button>
                <button type="submit" className="premium-btn" style={{ flex: 1, padding: 12, fontSize: 14 }}>
                  <UserPlus size={16} style={{ marginRight: 6 }} /> Create
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

function ApprovalQueue() {
  const { appointments, approveBooking, rejectBooking, customers } = useSalon();
  const pending = appointments.filter(a => a.status === 'pending');
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const getCustomerName = (email: string) => {
    const c = customers.find(c => c.email === email);
    return c ? c.name : email;
  };

  const handleConfirmReject = () => {
    if (rejectId && rejectReason.trim()) {
      rejectBooking(rejectId, rejectReason);
      setRejectId(null);
      setRejectReason('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="glass" style={{ padding: 28, border: '1px solid rgba(245,158,11,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={16} color="#f59e0b" />
          </div>
          <h2 style={{ fontSize: 18 }}>Pending Approvals</h2>
          <span style={{
            marginLeft: 'auto', padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600,
            background: pending.length > 0 ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.1)',
            color: pending.length > 0 ? '#f59e0b' : '#22c55e'
          }}>
            {pending.length} pending
          </span>
        </div>

        {pending.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
            <Sparkles size={32} style={{ opacity: 0.15, margin: '0 auto 10px', display: 'block' }} />
            No pending approvals. All clear!
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pending.map(apt => (
            <motion.div key={apt.id} layout
              style={{
                padding: '18px 20px', borderRadius: 12,
                background: 'rgba(245,158,11,0.02)', border: '1px solid rgba(245,158,11,0.1)',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Clock size={18} color="#f59e0b" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{apt.service}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {getCustomerName(apt.customerId)} · {apt.stylist}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, marginLeft: 46 }}>
                    {apt.date} at {apt.time} · {apt.duration} · ${apt.cost}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => approveBooking(apt.id)}
                    className="premium-btn"
                    style={{ padding: '8px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Check size={14} /> Approve
                  </button>
                  <button onClick={() => setRejectId(apt.id)}
                    style={{
                      padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                      color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                    }}>
                    <X size={14} /> Decline
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectId && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)'
        }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass" style={{ padding: 32, width: '100%', maxWidth: 420 }}>
            <h2 style={{ fontSize: 18, marginBottom: 8 }}>Decline Booking</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>
              Provide a reason for declining this booking. The customer will be notified.
            </p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Time slot no longer available..."
              rows={3} style={{ fontSize: 13, marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setRejectId(null)}
                style={{
                  flex: 1, padding: 12, borderRadius: 10, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text-secondary)', fontSize: 14
                }}>
                Cancel
              </button>
              <button onClick={handleConfirmReject} disabled={!rejectReason.trim()}
                className="premium-btn"
                style={{
                  flex: 1, padding: 12, fontSize: 14, opacity: rejectReason.trim() ? 1 : 0.35,
                  cursor: rejectReason.trim() ? 'pointer' : 'not-allowed',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)'
                }}>
                <X size={16} /> Decline
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { services, appointments, staff, customers, categories, recordService, completeAppointment, emailLog, currentUser, logout } = useSalon();
  const [view, setView] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeCustomers = customers.filter(c => c.status === 'Active').length;
  const pendingAppointments = appointments.filter(a => a.status === 'approved' || a.status === 'pending').length;

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const allAppointments = [...appointments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' };
      case 'approved': return { bg: 'rgba(34,197,94,0.1)', color: '#22c55e' };
      case 'rejected': return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' };
      case 'completed': return { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6' };
      case 'cancelled': return { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' };
      default: return { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' };
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Bell },
    { id: 'approvals', label: 'Approvals', icon: Clock },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'services', label: 'Services', icon: Scissors },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'walkin', label: 'Walk-In', icon: UserPlus },
    { id: 'audit', label: 'Audit Log', icon: Activity },
    { id: 'maintenance', label: 'Maintenance', icon: Settings },
  ];

  return (
    <>
      <div className="layout-container" style={{ padding: '24px 40px 60px', background: '#050505', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h1 className="premium-gradient-text" style={{ fontSize: 30, fontWeight: 'bold' }}>Admin Control Center</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                {currentUser && <>Signed in as <strong style={{ color: 'rgba(255,255,255,0.6)' }}>{currentUser}</strong></>}
                {' · '}Manage appointments, customers, and services
              </p>
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

          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setView(tab.id)}
                style={{
                  padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  background: view === tab.id ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : 'rgba(255,255,255,0.04)',
                  color: 'white', transition: 'all 0.2s'
                }}>
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {view === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
                <StatsCard title="Active Customers" value={activeCustomers} icon={Users} color="#8b5cf6" subtitle="Currently active" />
                <StatsCard title="Active Appointments" value={pendingAppointments} icon={Calendar} color="#ec4899" subtitle="Upcoming" />
                <StatsCard title="Pending Approval" value={appointments.filter(a => a.status === 'pending').length} icon={Clock} color="#f59e0b" subtitle="Awaiting review" />
                <StatsCard title="Total Services" value={services.length} icon={Scissors} color="#22c55e" subtitle="All time" />
              </div>

              <div className="glass" style={{ padding: 28, marginBottom: 24, border: '1px solid rgba(139,92,246,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell size={16} color="#8b5cf6" />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>Email Notification Log</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {emailLog.slice(0, 6).map((entry, idx) => (
                    <motion.div key={entry.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                      style={{
                        padding: '12px 14px', borderRadius: 10,
                        background: entry.type.includes('confirm') || entry.type.includes('approved') ? 'rgba(34,197,94,0.03)' :
                                  entry.type.includes('cancel') || entry.type.includes('rejected') ? 'rgba(239,68,68,0.03)' :
                                  entry.type.includes('pending') ? 'rgba(245,158,11,0.03)' : 'rgba(139,92,246,0.03)',
                        border: `1px solid ${
                          entry.type.includes('confirm') || entry.type.includes('approved') ? 'rgba(34,197,94,0.08)' :
                          entry.type.includes('cancel') || entry.type.includes('rejected') ? 'rgba(239,68,68,0.08)' :
                          entry.type.includes('pending') ? 'rgba(245,158,11,0.08)' : 'rgba(139,92,246,0.08)'
                        }`,
                        display: 'flex', gap: 10, alignItems: 'flex-start'
                      }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        background: entry.type.includes('confirm') || entry.type.includes('approved') ? 'rgba(34,197,94,0.1)' :
                                   entry.type.includes('cancel') || entry.type.includes('rejected') ? 'rgba(239,68,68,0.1)' :
                                   entry.type.includes('pending') ? 'rgba(245,158,11,0.1)' : 'rgba(139,92,246,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {entry.type.includes('confirm') || entry.type.includes('approved') ? <Check size={13} color="#22c55e" /> :
                         entry.type.includes('cancel') || entry.type.includes('rejected') ? <X size={13} color="#ef4444" /> :
                         <Bell size={13} color="#8b5cf6" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{entry.subject}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>
                          To: <strong style={{ color: 'rgba(255,255,255,0.6)' }}>{entry.to}</strong> · {new Date(entry.sentAt).toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {emailLog.length === 0 && (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
                      <Bell size={32} style={{ opacity: 0.15, margin: '0 auto 10px', display: 'block' }} />
                      No email notifications sent yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="glass" style={{ padding: 28, border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={16} color="#f59e0b" />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>Quick Actions</h3>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[
                    { id: 'services', label: 'Record Service', icon: Plus, color: '#8b5cf6' },
                    { id: 'walkin', label: 'Walk-In Booking', icon: UserPlus, color: '#22c55e' },
                    { id: 'approvals', label: 'Pending Approvals', icon: Clock, color: '#f59e0b' },
                    { id: 'customers', label: 'Customers', icon: Users, color: '#ec4899' },
                  ].map(action => (
                    <motion.button key={action.id} onClick={() => setView(action.id)}
                      whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      className="glass"
                      style={{
                        padding: '16px 24px', color: 'white', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 10, fontSize: 13,
                        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 12, transition: 'all 0.2s'
                      }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 8,
                        background: `${action.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <action.icon size={16} color={action.color} />
                      </div>
                      <span style={{ fontWeight: 500 }}>{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'approvals' && <ApprovalQueue />}

          {view === 'customers' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="glass" style={{ padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16 }}>
                  <h2 style={{ fontSize: 18, whiteSpace: 'nowrap' }}>Customer Database</h2>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                    <div style={{ position: 'relative', width: 240 }}>
                      <Search size={16} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-secondary)' }} />
                      <input type="text" placeholder="Search customers..."
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: 40, padding: '10px 14px 10px 40', fontSize: 13, width: '100%' }} />
                    </div>
                    <button onClick={() => setShowCreateModal(true)}
                      className="premium-btn"
                      style={{ padding: '10px 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                      <UserPlus size={16} /> Create Customer
                    </button>
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}>Customer</th>
                        <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}>Visits</th>
                        <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}>Most Frequent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map(c => {
                        const customerServiceCount = services.filter(s => s.customerId === c.email).length;
                        const topCategory = services.filter(s => s.customerId === c.email).reduce<Record<string, number>>((acc, s) => {
                          acc[s.category] = (acc[s.category] || 0) + 1;
                          return acc;
                        }, {});
                        const mostFreq = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
                        return (
                          <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '14px 12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                  width: 36, height: 36, borderRadius: 10,
                                  background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 14, fontWeight: 'bold', color: '#8b5cf6'
                                }}>
                                  {c.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <div style={{ fontSize: 14, fontWeight: 500 }}>{c.name}</div>
                                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '14px 12px' }}>
                              <span style={{
                                padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                                background: c.status === 'Active' ? 'rgba(34,197,94,0.1)' :
                                            c.status === 'At Risk' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                                color: c.status === 'Active' ? '#22c55e' :
                                       c.status === 'At Risk' ? '#f59e0b' : '#ef4444'
                              }}>
                                {c.status}
                              </span>
                            </td>
                            <td style={{ padding: '14px 12px', fontSize: 14 }}>{customerServiceCount}</td>
                            <td style={{ padding: '14px 12px', fontSize: 13 }}>{mostFreq}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'appointments' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="glass" style={{ padding: 28, border: '1px solid rgba(139,92,246,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(236,72,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={16} color="#ec4899" />
                  </div>
                  <h2 style={{ fontSize: 18 }}>Appointment Queue</h2>
                  <span style={{
                    marginLeft: 'auto', padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                    background: 'rgba(236,72,153,0.1)', color: '#ec4899'
                  }}>
                    {allAppointments.length} total
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {allAppointments.filter(a => a.status !== 'cancelled').map((apt, idx) => {
                    const sc = statusColor(apt.status);
                    return (
                      <motion.div key={apt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                        style={{
                          padding: '16px 20px', borderRadius: 12,
                          background: apt.status === 'pending' ? 'rgba(245,158,11,0.02)' :
                                     apt.status === 'approved' ? 'rgba(34,197,94,0.02)' : 'rgba(139,92,246,0.02)',
                          border: `1px solid ${
                            apt.status === 'pending' ? 'rgba(245,158,11,0.08)' :
                            apt.status === 'approved' ? 'rgba(34,197,94,0.08)' : 'rgba(139,92,246,0.08)'
                          }`,
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: apt.status === 'pending' ? 'rgba(245,158,11,0.1)' :
                                       apt.status === 'approved' ? 'rgba(34,197,94,0.1)' : 'rgba(139,92,246,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            {apt.status === 'pending' ? <Clock size={20} color="#f59e0b" /> :
                             apt.status === 'approved' ? <Check size={20} color="#22c55e" /> :
                             <Calendar size={20} color="#8b5cf6" />}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{apt.service}{apt.isWalkIn ? ' 🚶' : ''}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                              {apt.customerName || apt.customerId} · {apt.stylist}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 1 }}>
                              {apt.date} at {apt.time} · {apt.duration}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                            background: sc.bg, color: sc.color
                          }}>
                            {apt.status}
                          </span>
                          {apt.status === 'pending' && (
                            <button onClick={() => approveBooking(apt.id)}
                              className="premium-btn" style={{ padding: '6px 12px', fontSize: 11 }}>
                              Approve
                            </button>
                          )}
                          {(apt.status === 'approved') && (
                            <button onClick={() => completeAppointment(apt.id)}
                              className="premium-btn" style={{ padding: '6px 14px', fontSize: 11 }}>
                              Complete
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                  {allAppointments.filter(a => a.status !== 'cancelled').length === 0 && (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 20 }}>No appointments yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'services' && <RecordServiceView categories={categories} recordService={recordService} setView={setView} />}

          {view === 'staff' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="glass" style={{ padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontSize: 18 }}>Staff Directory</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {staff.map(s => {
                    const completedJobs = services.filter(sv => sv.stylist === s.name).length;
                    return (
                      <div key={s.id} className="glass" style={{ padding: 20, background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                          <div style={{
                            width: 48, height: 48, borderRadius: 12,
                            background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(217,70,239,0.15))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 18, fontWeight: 'bold', color: '#8b5cf6'
                          }}>
                            {s.image}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</div>
                            <div style={{ color: '#8b5cf6', fontSize: 13 }}>{s.role}</div>
                          </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 12 }}>{s.bio}</p>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                          {s.specialties.map(sp => (
                            <span key={sp} style={{
                              padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                              background: 'rgba(139,92,246,0.1)', color: '#8b5cf6'
                            }}>
                              {sp}
                            </span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)' }}>
                          <span>★ {s.rating}</span>
                          <span>{completedJobs} services completed</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'walkin' && <WalkInForm onBack={() => setView('overview')} />}
          {view === 'audit' && <AuditLogView />}
          {view === 'maintenance' && <MaintenancePanel />}
        </div>
      </div>
      {showCreateModal && <CreateCustomerModal onClose={() => setShowCreateModal(false)} />}
    </>
  );
}
