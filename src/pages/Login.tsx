import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, Sparkles, ShieldCheck, Scissors, ArrowLeft, UserPlus, Mail, Phone } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regError, setRegError] = useState('');
  const navigate = useNavigate();
  const { login, registerCustomer } = useSalon();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    login(email);
    if (role === 'admin' || email === 'admin@salon.com') {
      navigate('/admin');
    } else {
      navigate('/customer');
    }
  };

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    setRegError('');
    const success = registerCustomer(regName, regEmail, regPhone);
    if (success) {
      navigate('/customer');
    } else {
      setRegError('An account with this email already exists.');
    }
  };

  return (
    <div className="layout-container" style={{
      justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
      background: 'radial-gradient(ellipse at top right, #1a1a2e, #0a0a0a)',
      padding: 20, position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: '10%', right: '20%', width: 200, height: 200,
        borderRadius: '50%', background: 'rgba(139,92,246,0.06)',
        filter: 'blur(60px)', pointerEvents: 'none'
      }} />

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        style={{
          position: 'absolute', top: 24, left: 24,
          background: 'none', border: 'none', color: 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          fontSize: 14, zIndex: 10
        }}
      >
        <ArrowLeft size={16} /> Back to Home
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass"
        style={{
          padding: 40, width: '100%', maxWidth: 420,
          display: 'flex', flexDirection: 'column', gap: 28,
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          position: 'relative', zIndex: 1
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(217,70,239,0.15))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Scissors size={28} color="#8b5cf6" />
          </div>
          <div className="premium-gradient-text" style={{ fontSize: 28, fontWeight: 'bold' }}>
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 14 }}>
            {isRegistering ? 'Join our salon community today' : 'Sign in to your salon portal'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {([
            { id: 'customer', label: 'Customer', icon: User },
            { id: 'admin', label: 'Admin', icon: ShieldCheck },
          ] as const).map(r => (
            <button key={r.id} onClick={() => setRole(r.id)}
              style={{
                flex: 1, padding: '12px', borderRadius: 10, cursor: 'pointer',
                border: `1px solid ${role === r.id ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.06)'}`,
                background: role === r.id ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)',
                color: 'white', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s'
              }}>
              <r.icon size={16} color={role === r.id ? '#8b5cf6' : 'var(--text-secondary)'} />
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-secondary)' }} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: 42, padding: '14px 14px 14px 42' }}
              required
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-secondary)' }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: 42, padding: '14px 14px 14px 42' }}
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="premium-btn"
            style={{
              padding: 14, fontSize: 15, marginTop: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            <LogIn size={18} />
            {role === 'admin' ? 'Access Admin Portal' : 'Enter Customer Dashboard'}
          </motion.button>
        </form>

        {isRegistering ? (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-secondary)' }} />
              <input type="text" placeholder="Full Name" value={regName}
                onChange={e => setRegName(e.target.value)}
                style={{ paddingLeft: 42, padding: '14px 14px 14px 42' }} required />
            </div>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-secondary)' }} />
              <input type="email" placeholder="Email Address" value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                style={{ paddingLeft: 42, padding: '14px 14px 14px 42' }} required />
            </div>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-secondary)' }} />
              <input type="tel" placeholder="Phone Number" value={regPhone}
                onChange={e => setRegPhone(e.target.value)}
                style={{ paddingLeft: 42, padding: '14px 14px 14px 42' }} required />
            </div>
            {regError && (
              <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{regError}</p>
            )}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              type="submit" className="premium-btn"
              style={{ padding: 14, fontSize: 15, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <UserPlus size={18} /> Create Account & Enter Dashboard
            </motion.button>
            <button type="button" onClick={() => setIsRegistering(false)}
              style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', fontSize: 13, textAlign: 'center' }}>
              Already have an account? Sign in
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-secondary)' }} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: 42, padding: '14px 14px 14px 42' }}
                  required
                />
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-secondary)' }} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: 42, padding: '14px 14px 14px 42' }}
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="premium-btn"
                style={{
                  padding: 14, fontSize: 15, marginTop: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}
              >
                <LogIn size={18} />
                {role === 'admin' ? 'Access Admin Portal' : 'Enter Customer Dashboard'}
              </motion.button>
            </form>

            <div style={{
              padding: 16, borderRadius: 12,
              background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.1)',
              fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6
            }}>
              <strong style={{ color: '#8b5cf6' }}>Demo Accounts:</strong><br />
              Customer: <strong>customer@example.com</strong> | Admin: <strong>admin@salon.com</strong><br />
              <span style={{ fontSize: 11 }}>(Any password works)</span>
            </div>

            <button onClick={() => setIsRegistering(true)}
              style={{
                background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer',
                fontSize: 13, textAlign: 'center', padding: 0
              }}>
              <UserPlus size={14} style={{ marginRight: 6, display: 'inline' }} />
              New customer? Create an account
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
