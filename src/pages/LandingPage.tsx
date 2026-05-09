import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Scissors, Sparkles, Star, ArrowRight, Quote } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import { useSalon } from '../context/SalonContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { serviceMenu, staff, categories } = useSalon();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredServices = activeCategory === 'All'
    ? serviceMenu : serviceMenu.filter(s => s.category === activeCategory);

  const testimonials = [
    { name: 'Amanda K.', text: 'Absolutely stunning results. The balayage transformed my hair completely.', rating: 5, service: 'Luxury Balayage' },
    { name: 'David R.', text: 'Best fade I\'ve ever had. Precision work at its finest.', rating: 5, service: 'Classic Fade' },
    { name: 'Sophia L.', text: 'The spa treatment was heavenly. I left feeling like a new person.', rating: 5, service: 'Deep Conditioning' },
    { name: 'Marcus J.', text: 'My wedding hair was perfect. Emma is a true artist.', rating: 5, service: 'Bridal Package' },
  ];

  const stats = [
    { value: '12K+', label: 'Happy Clients' },
    { value: '50+', label: 'Awards Won' },
    { value: '8', label: 'Master Stylists' },
    { value: '7+', label: 'Years Excellence' },
  ];

  return (
    <div className="layout-container" style={{ background: '#050505' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px', position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 30%, #1a1a2e 0%, #0a0a0a 50%, #050505 100%)'
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '10%', width: 300, height: 300,
          borderRadius: '50%', background: 'rgba(139,92,246,0.08)',
          filter: 'blur(80px)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400,
          borderRadius: '50%', background: 'rgba(217,70,239,0.06)',
          filter: 'blur(100px)', pointerEvents: 'none'
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', maxWidth: 900, position: 'relative', zIndex: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px',
              borderRadius: 100, background: 'rgba(139,92,246,0.1)',
              color: '#8b5cf6', fontSize: 13, fontWeight: 600, marginBottom: 28,
              border: '1px solid rgba(139,92,246,0.2)'
            }}
          >
            <Sparkles size={14} /> New: Summer Styling Sessions Now Open
          </motion.div>

          <h1 style={{
            fontSize: 'clamp(40px, 7vw, 76px)', fontWeight: 'bold', lineHeight: 1.05,
            marginBottom: 24, letterSpacing: '-0.02em'
          }}>
            Elevate Your{' '}
            <span className="premium-gradient-text">Beauty Experience</span>
          </h1>

          <p style={{
            color: 'var(--text-secondary)', fontSize: 'clamp(16px, 2vw, 20px)',
            maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.6
          }}>
            Discover the perfect blend of artistry and precision.
            Our master stylists bring your vision to life with cutting-edge techniques.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="premium-btn"
              style={{ padding: '16px 36px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}
              onClick={() => navigate('/login')}
            >
              Book Appointment <ArrowRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="glass"
              style={{
                padding: '16px 36px', fontSize: 16, color: 'white', cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)'
              }}
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Services
            </motion.button>
          </div>

          <div style={{
            display: 'flex', gap: 48, justifyContent: 'center', marginTop: 60,
            flexWrap: 'wrap'
          }}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div style={{ fontSize: 32, fontWeight: 'bold', color: '#8b5cf6' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Services */}
      <section id="services" style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
            borderRadius: 100, background: 'rgba(139,92,246,0.1)',
            color: '#8b5cf6', fontSize: 12, fontWeight: 600, marginBottom: 16
          }}>
            <Sparkles size={12} /> Premium Services
          </div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 42px)', fontWeight: 'bold', marginBottom: 16 }}>
            Curated Treatments
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
            From precision cuts to luxurious spa therapies -- every service designed for your unique beauty.
          </p>
        </motion.div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 40, flexWrap: 'wrap' }}>
          {(['All', ...categories] as string[]).map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              style={{
                padding: '8px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: activeCategory === c ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : 'rgba(255,255,255,0.05)',
                color: 'white', transition: 'all 0.2s'
              }}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
          {filteredServices.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} onBook={() => {
              navigate('/login');
            }} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 42px)', fontWeight: 'bold', marginBottom: 16 }}>
            What Our Clients Say
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Real experiences from our valued guests.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass"
              style={{ padding: 28, position: 'relative' }}
            >
              <Quote size={24} color="rgba(139,92,246,0.2)" style={{ position: 'absolute', top: 16, right: 20 }} />
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} color="#8b5cf6" fill="#8b5cf6" />
                ))}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                <div style={{ color: '#8b5cf6', fontSize: 12 }}>{t.service}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stylists */}
      <section style={{ padding: '100px 40px', background: 'radial-gradient(ellipse at center, #0f0f1a 0%, #050505 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 42px)', fontWeight: 'bold', marginBottom: 16 }}>
              Meet Our Artists
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              Award-winning stylists dedicated to your transformation.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
            {staff.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass"
                style={{ padding: 28, textAlign: 'center' }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', margin: '0 auto 16px',
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(217,70,239,0.2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 'bold', color: '#8b5cf6'
                }}>
                  {s.image}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{s.name}</h3>
                <p style={{ color: '#8b5cf6', fontSize: 13, marginBottom: 8 }}>{s.role}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.5 }}>{s.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 40px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 'bold', marginBottom: 16 }}>
            Ready for Your <span className="premium-gradient-text">Transformation</span>?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Book your appointment today and experience the Salon Premium difference.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="premium-btn"
            style={{ padding: '16px 40px', fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 8 }}
            onClick={() => navigate('/login')}
          >
            Book Now <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
