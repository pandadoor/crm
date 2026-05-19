import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Settings, Plus, X, Save, Trash2, Edit3, DollarSign, Clock } from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import type { ServiceMenuItem } from '../types';

export default function MaintenancePanel() {
  const { serviceMenu, timeSlots, staff, categories, addServiceMenuItem, deleteServiceMenuItem, updateTimeSlots, updateCategories, updateStaffList } = useSalon();
  const [tab, setTab] = useState('services');
  const [showNewService, setShowNewService] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: 0, duration: '', category: '', desc: '' });
  const [newSlot, setNewSlot] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const handleAddService = (e: FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.price) return;
    addServiceMenuItem(newService as Omit<ServiceMenuItem, 'id'>);
    setNewService({ name: '', price: 0, duration: '', category: '', desc: '' });
    setShowNewService(false);
  };

  const handleAddSlot = () => {
    if (!newSlot.trim()) return;
    if (timeSlots.includes(newSlot.trim())) return;
    updateTimeSlots([...timeSlots, newSlot.trim()].sort());
    setNewSlot('');
  };

  const handleRemoveSlot = (slot: string) => {
    updateTimeSlots(timeSlots.filter(s => s !== slot));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) return;
    updateCategories([...categories, newCategory.trim()]);
    setNewCategory('');
  };

  const handleRemoveCategory = (cat: string) => {
    updateCategories(categories.filter(c => c !== cat));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="glass" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={16} color="#f59e0b" />
          </div>
          <h2 style={{ fontSize: 18 }}>System Maintenance</h2>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {([
            { id: 'services', label: 'Services' },
            { id: 'timeSlots', label: 'Time Slots' },
            { id: 'categories', label: 'Categories' },
            { id: 'staff', label: 'Staff' },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                border: 'none', cursor: 'pointer',
                background: tab === t.id ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : 'rgba(255,255,255,0.04)',
                color: 'white', transition: 'all 0.2s'
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Services */}
        {tab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{serviceMenu.length} services</span>
              <button onClick={() => setShowNewService(true)} className="premium-btn"
                style={{ padding: '8px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Plus size={14} /> Add Service
              </button>
            </div>

            {showNewService && (
              <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                onSubmit={handleAddService}
                style={{ padding: 20, borderRadius: 12, background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.1)', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input type="text" placeholder="Service name" value={newService.name}
                    onChange={e => setNewService({ ...newService, name: e.target.value })} required />
                  <input type="number" placeholder="Price" value={newService.price || ''}
                    onChange={e => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input type="text" placeholder="Duration (e.g. 45 min)" value={newService.duration}
                    onChange={e => setNewService({ ...newService, duration: e.target.value })} />
                  <select value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <textarea placeholder="Description" value={newService.desc}
                  onChange={e => setNewService({ ...newService, desc: e.target.value })} rows={2} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" className="premium-btn" style={{ padding: '10px 20px', fontSize: 13 }}>
                    <Save size={14} /> Save Service
                  </button>
                  <button type="button" onClick={() => setShowNewService(false)}
                    style={{ padding: '10px 20px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {serviceMenu.map(s => (
                <div key={s.id}
                  style={{
                    padding: '12px 16px', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <DollarSign size={16} color="#8b5cf6" />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                        <span>${s.price}</span>
                        <span><Clock size={10} style={{ display: 'inline' }} /> {s.duration}</span>
                        <span style={{ color: '#8b5cf6' }}>{s.category}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteServiceMenuItem(s.id)}
                    style={{
                      padding: '6px 10px', borderRadius: 6, background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer', fontSize: 11
                    }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Slots */}
        {tab === 'timeSlots' && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              {timeSlots.length} time slots configured
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input type="text" placeholder="e.g. 18:00" value={newSlot}
                onChange={e => setNewSlot(e.target.value)}
                style={{ maxWidth: 200, fontSize: 13 }}
                onKeyDown={e => e.key === 'Enter' && handleAddSlot()} />
              <button onClick={handleAddSlot} className="premium-btn"
                style={{ padding: '8px 16px', fontSize: 12 }}>
                <Plus size={14} /> Add
              </button>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {timeSlots.map(slot => (
                <div key={slot}
                  style={{
                    padding: '8px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'
                  }}>
                  <span style={{ fontSize: 13 }}>{slot}</span>
                  <button onClick={() => handleRemoveSlot(slot)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, display: 'flex' }}>
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {tab === 'categories' && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              {categories.length} categories
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input type="text" placeholder="e.g. Makeup" value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                style={{ maxWidth: 200, fontSize: 13 }}
                onKeyDown={e => e.key === 'Enter' && handleAddCategory()} />
              <button onClick={handleAddCategory} className="premium-btn"
                style={{ padding: '8px 16px', fontSize: 12 }}>
                <Plus size={14} /> Add
              </button>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <div key={cat}
                  style={{
                    padding: '8px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)'
                  }}>
                  <span style={{ fontSize: 13, color: '#8b5cf6' }}>{cat}</span>
                  <button onClick={() => handleRemoveCategory(cat)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, display: 'flex' }}>
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff (read-only reference) */}
        {tab === 'staff' && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              {staff.length} staff members
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {staff.map(s => (
                <div key={s.id}
                  style={{
                    padding: '14px 16px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 14,
                    background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)'
                  }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(217,70,239,0.15))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: 14, color: '#8b5cf6'
                  }}>
                    {s.image}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.role} · ★ {s.rating}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                      {s.specialties.map(sp => (
                        <span key={sp} style={{
                          padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 600,
                          background: 'rgba(139,92,246,0.08)', color: '#8b5cf6'
                        }}>
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
