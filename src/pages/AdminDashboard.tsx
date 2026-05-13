import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSalon } from '../context/SalonContext';
import StatsCard from '../components/StatsCard';
import { Users, Scissors, Calendar, Bell, Plus, LogOut, Search, Star, User, Check, X, Sparkles, UserPlus } from 'lucide-react';
import type { Customer, ServiceHistoryItem } from '../types';

interface RecordServiceViewProps {
  categories: string[];
  recordService: (service: Omit<ServiceHistoryItem, 'id' | 'gradient'> & { gradient?: string }) => void;
  setView: (view: string) => void;
}

function RecordServiceView({ categories, recordService, setView }: RecordServiceViewProps) {
  const [formData, setFormData] = useState({
    customerId: 'customer@example.com',
    serviceType: '',
    stylist: '',
    duration: '',
    category: 'Hair',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  });

  const [customerEmail, setCustomerEmail] = useState('customer@example.com');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    recordService({ ...formData, cost: 0, customerId: customerEmail } as unknown as Omit<ServiceHistoryItem, 'id' | 'gradient'> & { gradient?: string });
    setShowSuccess(true);
    setFormData({
      customerId: customerEmail,
      serviceType: '', stylist: '', duration: '', category: 'Hair',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    });
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
              value={formData.serviceType} onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
              style={{ fontSize: 13 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Stylist</label>
              <input type="text" placeholder="Emma Rodriguez" required
                value={formData.stylist} onChange={e => setFormData({ ...formData, stylist: e.target.value })}
                style={{ fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Category</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="glass" style={{ width: '100%', padding: '12px', background: 'rgba(5,5,5,0.5)', color: 'white', borderRadius: 8, fontSize: 13 }}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Duration</label>
              <input type="text" placeholder="45 min" required
                value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })}
                style={{ fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>Category</label>
              <input type="text" placeholder="45 min" required
                value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })}
                style={{ fontSize: 13 }} />
            </div>
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
  const { registerCustomer, customers } = useSalon();
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
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                  Full Name
                </label>
                <input type="text" placeholder="e.g. Jane Doe" required
                  value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                  Email Address
                </label>
                <input type="email" placeholder="jane@example.com" required
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                  Phone Number
                </label>
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { services, appointments, staff, customers, categories, recordService, completeAppointment, emailLog } = useSalon();
  const [view, setView] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeCustomers = customers.filter(c => c.status === 'Active').length;
  const pendingAppointments = appointments.filter(a => a.status === 'confirmed').length;

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <div className="layout-container" style={{ padding: '24px 40px 60px', background: '#050505', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 className="premium-gradient-text" style={{ fontSize: 30, fontWeight: 'bold' }}>Admin Control Center</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Centralized intelligence for your salon operations.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={() => navigate('/login')}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-secondary)', padding: '10px 20px', borderRadius: 10,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13
              }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {([
            { id: 'overview', label: 'Overview', icon: Bell },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'services', label: 'Services', icon: Scissors },
            { id: 'staff', label: 'Staff', icon: Star },
          ] as const).map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)}
              style={{
                padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                background: view === tab.id ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : 'rgba(255,255,255,0.04)',
                color: 'white', transition: 'all 0.2s'
              }}>
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {view === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              <StatsCard title="Active Customers" value={activeCustomers} icon={Users} color="#8b5cf6" subtitle="Currently active" />
              <StatsCard title="Pending Appointments" value={pendingAppointments} icon={Calendar} color="#ec4899" subtitle="Awaiting service" />
            </div>

            {/* Recent Activity */}
            <div className="glass" style={{ padding: 28, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Recent Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {emailLog.slice(0, 6).map(entry => (
                  <div key={entry.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: entry.type === 'booking_confirmed' ? 'rgba(34,197,94,0.1)' : entry.type === 'booking_cancelled' ? 'rgba(239,68,68,0.1)' : 'rgba(139,92,246,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {entry.type === 'booking_confirmed' ? <Check size={14} color="#22c55e" /> :
                       entry.type === 'booking_cancelled' ? <X size={14} color="#ef4444" /> : <Bell size={14} color="#8b5cf6" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{entry.subject}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>To: {entry.to} &middot; {new Date(entry.sentAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                {emailLog.length === 0 && (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: 13 }}>No email notifications sent yet.</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h3>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <button onClick={() => setView('services')} className="glass" style={{ padding: '14px 24px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Plus size={16} color="#8b5cf6" /> Record New Service
                </button>
                <button onClick={() => setView('customers')} className="glass" style={{ padding: '14px 24px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Users size={16} color="#8b5cf6" /> Manage Customers
                </button>
                <button onClick={() => setView('appointments')} className="glass" style={{ padding: '14px 24px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Calendar size={16} color="#8b5cf6" /> View Appointments
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Customers */}
        {view === 'customers' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16 }}>
                <h2 style={{ fontSize: 18, whiteSpace: 'nowrap' }}>Customer Database</h2>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                  <div style={{ position: 'relative', width: 240 }}>
                    <Search size={16} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-secondary)' }} />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: 40, padding: '10px 14px 10px 40', fontSize: 13, width: '100%' }}
                    />
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
                      <th style={{ padding: '12px' }}></th>
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
                          <td style={{ padding: '14px 12px' }}>
                            <button style={{
                              background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', fontSize: 13, fontWeight: 500
                            }}>
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Appointments */}
        {view === 'appointments' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 18, marginBottom: 20 }}>Appointment Queue</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {appointments.filter(a => a.status !== 'cancelled').map(apt => (
                  <div key={apt.id} style={{
                    padding: 20, borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: apt.status === 'confirmed' ? 'rgba(34,197,94,0.1)' : 'rgba(139,92,246,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {apt.status === 'confirmed' ? <Calendar size={20} color="#22c55e" /> : <Check size={20} color="#8b5cf6" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{apt.service}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                          {apt.customerId} &middot; {apt.stylist}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>
                          {apt.date} at {apt.time} &middot; {apt.duration}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                        background: apt.status === 'confirmed' ? 'rgba(34,197,94,0.1)' : 'rgba(139,92,246,0.1)',
                        color: apt.status === 'confirmed' ? '#22c55e' : '#8b5cf6'
                      }}>
                        {apt.status}
                      </span>
                      {apt.status === 'confirmed' && (
                        <button onClick={() => completeAppointment(apt.id)}
                          className="premium-btn"
                          style={{ padding: '6px 14px', fontSize: 11 }}>
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {appointments.filter(a => a.status !== 'cancelled').length === 0 && (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 20 }}>No appointments yet.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Services / Record */}
        {view === 'services' && <RecordServiceView categories={categories} recordService={recordService} setView={setView} />}

        {/* Staff */}
        {view === 'staff' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 18 }}>Staff Directory</h2>
                <button className="premium-btn" style={{ padding: '10px 20px', fontSize: 13 }}>
                  <Plus size={16} style={{ marginRight: 6 }} /> Add Staff
                </button>
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
      </div>
    </div>
      {showCreateModal && <CreateCustomerModal onClose={() => setShowCreateModal(false)} />}
    </>
  );
}
