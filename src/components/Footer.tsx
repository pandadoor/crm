import { Scissors, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer style={{
      background: '#050505', borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '80px 40px 40px', position: 'relative'
    }}>
      <button onClick={scrollToTop}
        style={{
          position: 'absolute', top: -20, right: 40, width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(139,92,246,0.3)'
        }}>
        <ArrowUpRight size={18} color="white" />
      </button>

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Scissors size={20} color="#8b5cf6" />
            <span className="premium-gradient-text" style={{ fontSize: 20, fontWeight: 'bold' }}>Salon Premium</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
            Where artistry meets precision. Elevating your beauty experience since 2018.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {([
              { icon: MapPin, text: '123 Madison Ave, New York, NY 10016' },
              { icon: Phone, text: '+1 (212) 555-0189' },
              { icon: Mail, text: 'hello@salonpremium.com' },
            ] as const).map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <item.icon size={14} color="#8b5cf6" style={{ marginTop: 3 }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hours</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {([
              { day: 'Mon - Fri', hours: '9:00 AM - 8:00 PM' },
              { day: 'Saturday', hours: '10:00 AM - 6:00 PM' },
              { day: 'Sunday', hours: '11:00 AM - 5:00 PM' },
            ] as const).map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.day}</span>
                <span style={{ color: 'white', fontWeight: 500 }}>{item.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 1200, margin: '40px auto 0', paddingTop: 24,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          &copy; {new Date().getFullYear()} Salon Premium. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          {(['Privacy Policy', 'Terms of Service', 'Accessibility'] as const).map((item, i) => (
            <a key={i} href="#" style={{ color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none' }}>{item}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
