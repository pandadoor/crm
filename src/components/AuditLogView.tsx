import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, User, Clock, Filter, Activity } from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import type { AuditAction } from '../types';

const ACTION_LABELS: Record<AuditAction, string> = {
  login: 'Login',
  logout: 'Logout',
  create_customer: 'Customer Created',
  book_appointment: 'Booking Requested',
  approve_booking: 'Booking Approved',
  reject_booking: 'Booking Rejected',
  cancel_appointment: 'Appointment Cancelled',
  complete_appointment: 'Appointment Completed',
  record_service: 'Service Recorded',
  walk_in_booking: 'Walk-In Booking',
  update_service: 'Service Menu Updated',
  update_time_slot: 'Time Slots Updated',
  update_staff: 'Staff Updated',
  update_category: 'Categories Updated',
  create_service: 'Service Created',
  delete_service: 'Service Deleted',
};

export default function AuditLogView() {
  const { auditLog } = useSalon();
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('All');

  const uniqueActions = [...new Set(auditLog.map(e => e.action))] as AuditAction[];

  const filtered = auditLog.filter(e => {
    const matchesSearch = search === '' ||
      e.user.toLowerCase().includes(search.toLowerCase()) ||
      e.details.toLowerCase().includes(search.toLowerCase());
    const matchesAction = filterAction === 'All' || e.action === filterAction;
    return matchesSearch && matchesAction;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="glass" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={16} color="#8b5cf6" />
          </div>
          <h2 style={{ fontSize: 18 }}>Audit Trail</h2>
          <span style={{
            marginLeft: 'auto', padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600,
            background: 'rgba(139,92,246,0.1)', color: '#8b5cf6'
          }}>
            {filtered.length} entries
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Search user or details..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 40, padding: '10px 14px 10px 40', fontSize: 13, width: '100%' }} />
          </div>
          <div style={{ position: 'relative', minWidth: 160 }}>
            <Filter size={16} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-secondary)', zIndex: 1 }} />
            <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
              style={{ paddingLeft: 40, fontSize: 13, width: '100%' }}>
              <option value="All">All Actions</option>
              {uniqueActions.map(a => (
                <option key={a} value={a}>{ACTION_LABELS[a]}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
              <Activity size={32} style={{ opacity: 0.15, margin: '0 auto 10px', display: 'block' }} />
              No activity entries found.
            </div>
          )}
          {filtered.map((entry, idx) => (
            <motion.div key={entry.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.02 }}
              style={{
                padding: '12px 16px', borderRadius: 10, fontSize: 13,
                background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.03)',
                display: 'flex', alignItems: 'center', gap: 12
              }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: entry.userRole === 'admin' ? 'rgba(139,92,246,0.1)' :
                           entry.userRole === 'staff' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {entry.userRole === 'admin' ? <Shield size={14} color="#8b5cf6" /> :
                 entry.userRole === 'staff' ? <User size={14} color="#22c55e" /> :
                 <User size={14} color="#f59e0b" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: 12 }}>{entry.user}</strong>
                  <span style={{
                    padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                    background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)'
                  }}>
                    {entry.userRole}
                  </span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                    background: entry.action.includes('approve') ? 'rgba(34,197,94,0.1)' :
                               entry.action.includes('reject') || entry.action.includes('delete') ? 'rgba(239,68,68,0.1)' :
                               'rgba(139,92,246,0.1)',
                    color: entry.action.includes('approve') ? '#22c55e' :
                           entry.action.includes('reject') || entry.action.includes('delete') ? '#ef4444' :
                           '#8b5cf6'
                  }}>
                    {ACTION_LABELS[entry.action]}
                  </span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>
                  {entry.details}
                </div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: 11, marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={10} /> {new Date(entry.timestamp).toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
