import { motion } from 'framer-motion';
import { Clock, Star } from 'lucide-react';
import type { ServiceMenuItem } from '../types';

interface ServiceCardProps {
  service: ServiceMenuItem;
  index: number;
  onBook?: (service: ServiceMenuItem) => void;
}

export default function ServiceCard({ service, index, onBook }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="glass"
      style={{ padding: '28px', textAlign: 'left', cursor: 'default' }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(217,70,239,0.15))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
      }}>
        <Star size={22} color="#8b5cf6" />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{service.name}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, marginBottom: 20, minHeight: 40 }}>
        {service.desc}
      </p>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <span style={{ fontSize: 22, fontWeight: 'bold', color: '#8b5cf6' }}>
          ${service.price}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={13} /> {service.duration}
        </span>
      </div>
      {onBook && (
        <button onClick={() => onBook(service)}
          style={{
            marginTop: 16, width: '100%', padding: '10px', borderRadius: 8,
            border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.1)',
            color: '#8b5cf6', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => (e.target as HTMLButtonElement).style.background = 'rgba(139,92,246,0.2)'}
          onMouseLeave={e => (e.target as HTMLButtonElement).style.background = 'rgba(139,92,246,0.1)'}
        >
          Book Now
        </button>
      )}
    </motion.div>
  );
}
