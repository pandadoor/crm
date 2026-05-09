import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
  trend?: number;
}

export default function StatsCard({ title, value, icon: Icon, color, subtitle, trend }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass"
      style={{ padding: '24px', display: 'flex', gap: 20, alignItems: 'center' }}
    >
      <div style={{
        padding: 14, borderRadius: 14,
        background: `${color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon color={color} size={24} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 4 }}>{title}</p>
        <h3 style={{ fontSize: 26, fontWeight: 'bold', lineHeight: 1.2 }}>{value}</h3>
        {subtitle && (
          <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>{subtitle}</p>
        )}
      </div>
      {trend !== undefined && (
        <span style={{
          padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
          background: trend > 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
          color: trend > 0 ? '#22c55e' : '#ef4444'
        }}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </motion.div>
  );
}
