import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scissors, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/#services', label: 'Services' },
    { to: '/login', label: 'Portal' },
  ];

  return (
    <nav style={{
      padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)'
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Scissors size={18} color="white" />
        </div>
        <span className="premium-gradient-text" style={{ fontSize: '20px', fontWeight: 'bold' }}>Salon Premium</span>
      </Link>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {links.map(link => (
            <Link key={link.to} to={link.to}
              style={{
                color: location.pathname === link.to ? 'white' : 'var(--text-secondary)',
                textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                transition: 'color 0.2s', position: 'relative'
              }}
            >
              {link.label.split('/')[0].replace('#', '')}
              {location.pathname === link.to && (
                <div style={{ position: 'absolute', bottom: -4, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #8b5cf6, #d946ef)', borderRadius: 1 }} />
              )}
            </Link>
          ))}
        </div>
        <Link to="/login" className="premium-btn"
          style={{ padding: '8px 20px', fontSize: '13px', textDecoration: 'none' }}>
          Client Portal
        </Link>
      </div>

      <button onClick={() => setOpen(!open)}
        style={{ display: 'none', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        className="mobile-menu-btn">
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
    </nav>
  );
}
