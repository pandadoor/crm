import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check, Clock, User, Scissors, Sparkles, CalendarDays, Star } from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import type { ServiceMenuItem } from '../types';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  preselectedService: ServiceMenuItem | null;
}

const stepLabels = ['Service', 'Stylist', 'Date & Time', 'Confirm'];

export default function BookingModal({ open, onClose, preselectedService }: BookingModalProps) {
  const { serviceMenu, staff, timeSlots, bookAppointment, categories } = useSalon();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceMenuItem | null>(preselectedService);
  const [selectedStylist, setSelectedStylist] = useState<typeof staff[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [filterCat, setFilterCat] = useState('All');
  const [direction, setDirection] = useState(0);

  const today = new Date();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const filteredServices = filterCat === 'All'
    ? serviceMenu
    : serviceMenu.filter(s => s.category === filterCat);

  const handleDateSelect = (day: number) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  const handleConfirm = () => {
    if (!selectedService || !selectedStylist || !selectedDate || !selectedTime) return;
    bookAppointment({
      service: selectedService.name,
      stylist: selectedStylist.name,
      date: selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: selectedTime,
      cost: selectedService.price,
      duration: selectedService.duration,
      category: selectedService.category,
      customerId: 'customer@example.com'
    });
    setConfirmed(true);
    setTimeout(() => { onClose(); resetForm(); }, 2500);
  };

  const resetForm = () => {
    setStep(1); setSelectedService(null); setSelectedStylist(null);
    setSelectedDate(null); setSelectedTime(null); setConfirmed(false); setDirection(0);
  };

  const canGoNext = () => {
    if (step === 1) return selectedService;
    if (step === 2) return selectedStylist;
    if (step === 3) return selectedDate && selectedTime;
    return false;
  };

  const goNext = () => { if (canGoNext()) { setDirection(1); setStep(s => s + 1); } };
  const goBack = () => { if (step > 1) { setDirection(-1); setStep(s => s - 1); } };

  const getDateStr = (d: Date | null) => {
    if (!d) return '';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const pageVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  const catGradients: Record<string, string> = {
    Hair: 'linear-gradient(135deg, #667eea, #764ba2)',
    Color: 'linear-gradient(135deg, #f093fb, #f5576c)',
    Treatment: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    Nails: 'linear-gradient(135deg, #43e97b, #38f9d7)',
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20
          }}
          onClick={(e) => { if (e.target === e.currentTarget) { onClose(); resetForm(); } }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            className="glass"
            style={{
              width: '100%', maxWidth: 600, maxHeight: '88vh', overflow: 'auto',
              padding: 36, position: 'relative',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <button onClick={() => { onClose(); resetForm(); }}
              style={{
                position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: 10,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--text-secondary)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', zIndex: 10
              }}>
              <X size={15} />
            </button>

            {confirmed ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ textAlign: 'center', padding: '50px 20px' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))',
                    margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid rgba(34,197,94,0.3)'
                  }}>
                  <Check size={36} color="#22c55e" />
                </motion.div>
                <h2 style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 8 }}>Booking Confirmed!</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
                  {selectedService?.name} with <strong style={{ color: 'white' }}>{selectedStylist?.name}</strong>
                </p>
                <p style={{ color: '#8b5cf6', fontSize: 14, marginTop: 4 }}>
                  {getDateStr(selectedDate)} at {selectedTime}
                </p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5 }}
                  style={{
                    height: 2, borderRadius: 1, marginTop: 24,
                    background: 'linear-gradient(90deg, #8b5cf6, #d946ef)'
                  }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 8 }}>Redirecting to dashboard...</p>
              </motion.div>
            ) : (
              <>
                {/* Step Indicator */}
                <div style={{ display: 'flex', gap: 0, marginBottom: 32, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 6 }}>
                  {stepLabels.map((label, i) => {
                    const s = i + 1;
                    const isActive = step === s;
                    const isDone = step > s;
                    return (
                      <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: isActive ? 'rgba(139,92,246,0.1)' : 'transparent' }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700,
                          background: isDone ? '#22c55e' : isActive ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : 'rgba(255,255,255,0.1)',
                          color: 'white', flexShrink: 0
                        }}>
                          {isDone ? <Check size={12} /> : s}
                        </div>
                        <span style={{
                          fontSize: 12, fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap',
                          color: isActive ? 'white' : 'var(--text-secondary)', display: 'none'
                        }}>{label}</span>
                      </div>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    {step === 1 && (
                      <div>
                        <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4 }}>Choose a Service</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>What would you like us to do today?</p>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
                          {(['All', ...categories] as string[]).map(c => (
                            <button key={c} onClick={() => setFilterCat(c)}
                              style={{
                                padding: '7px 16px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                background: filterCat === c ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : 'rgba(255,255,255,0.05)',
                                color: 'white', boxShadow: filterCat === c ? '0 4px 12px rgba(139,92,246,0.3)' : 'none'
                              }}>
                              {c}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {filteredServices.map(s => {
                            const sel = selectedService?.id === s.id;
                            return (
                              <motion.button key={s.id} onClick={() => setSelectedService(s)}
                                whileHover={{ x: 4 }} whileTap={{ scale: 0.99 }}
                                style={{
                                  padding: '16px 18px', borderRadius: 14, textAlign: 'left',
                                  border: `1px solid ${sel ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.05)'}`,
                                  background: sel ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)',
                                  color: 'white', cursor: 'pointer',
                                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                  transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                  <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: catGradients[s.category] || 'rgba(139,92,246,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                  }}>
                                    <Scissors size={20} color="white" />
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>
                                      <span style={{
                                        padding: '1px 6px', borderRadius: 3, fontSize: 10, fontWeight: 600,
                                        background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', marginRight: 6
                                      }}>{s.category}</span>
                                      {s.duration}
                                    </div>
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ color: '#8b5cf6', fontWeight: 'bold', fontSize: 16 }}>${s.price}</div>
                                </div>
                                {sel && <div style={{
                                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                                  background: 'linear-gradient(180deg, #8b5cf6, #d946ef)'
                                }} />}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4 }}>Choose Your Stylist</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>
                          {selectedService ? `Specialists for ${selectedService.name}` : 'Select a stylist'}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {staff.map(s => {
                            const available = selectedService ? s.specialties.includes(selectedService.category) : true;
                            const sel = selectedStylist?.id === s.id;
                            return (
                              <motion.button key={s.id} onClick={() => available && setSelectedStylist(s)}
                                disabled={!available}
                                whileHover={available ? { x: 4, scale: 1.005 } : {}}
                                whileTap={available ? { scale: 0.99 } : {}}
                                style={{
                                  padding: '16px 18px', borderRadius: 14, textAlign: 'left',
                                  border: `1px solid ${sel ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.05)'}`,
                                  background: sel ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)',
                                  color: 'white', cursor: available ? 'pointer' : 'not-allowed',
                                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                  opacity: available ? 1 : 0.35, transition: 'all 0.2s',
                                  position: 'relative', overflow: 'hidden'
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                  <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(217,70,239,0.2))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: 16, color: '#8b5cf6'
                                  }}>
                                    {s.image}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 1 }}>
                                      {s.role}
                                    </div>
                                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} size={10} fill={i < Math.floor(s.rating) ? '#f59e0b' : 'none'}
                                          color={i < Math.floor(s.rating) ? '#f59e0b' : 'rgba(255,255,255,0.15)'} />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                {available && (
                                  <span style={{
                                    padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                                    background: sel ? 'rgba(139,92,246,0.2)' : 'rgba(34,197,94,0.1)',
                                    color: sel ? '#8b5cf6' : '#22c55e'
                                  }}>
                                    {sel ? 'Selected' : 'Available'}
                                  </span>
                                )}
                                {sel && <div style={{
                                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                                  background: 'linear-gradient(180deg, #8b5cf6, #d946ef)'
                                }} />}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4 }}>Pick Date & Time</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>
                          {selectedService?.name} &middot; {selectedStylist?.name}
                        </p>

                        <div className="glass" style={{ padding: 20, borderRadius: 14, background: 'rgba(255,255,255,0.02)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); }}
                              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer', padding: 8, borderRadius: 8 }}>
                              <ChevronLeft size={16} />
                            </motion.button>
                            <span style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <CalendarDays size={16} color="#8b5cf6" /> {MONTHS[currentMonth]} {currentYear}
                            </span>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); }}
                              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer', padding: 8, borderRadius: 8 }}>
                              <ChevronRight size={16} />
                            </motion.button>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 16 }}>
                            {DAYS.map(d => (
                              <div key={d} style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-secondary)', padding: 4, fontWeight: 600 }}>{d}</div>
                            ))}
                            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                              const day = i + 1;
                              const d = new Date(currentYear, currentMonth, day);
                              const isPast = d < new Date(new Date().toDateString());
                              const isSelected = selectedDate && selectedDate.getTime() === d.getTime();
                              const isToday = d.getTime() === new Date(new Date().toDateString()).getTime();
                              return (
                                <motion.button key={day} onClick={() => !isPast && handleDateSelect(day)}
                                  disabled={isPast} whileHover={!isPast ? { scale: 1.15 } : {}}
                                  style={{
                                    padding: '8px 0', borderRadius: 10, border: 'none', cursor: isPast ? 'not-allowed' : 'pointer',
                                    background: isSelected ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : isToday ? 'rgba(139,92,246,0.12)' : 'transparent',
                                    color: isPast ? 'rgba(255,255,255,0.15)' : 'white',
                                    fontSize: 13, fontWeight: isSelected ? 700 : isToday ? 600 : 400,
                                    opacity: isPast ? 0.3 : 1
                                  }}>
                                  {day}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {selectedDate && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 16 }}>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Clock size={13} /> Available times for <strong style={{ color: 'white' }}>{getDateStr(selectedDate)}</strong>
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                              {timeSlots.map(t => {
                                const [h, m] = t.split(':');
                                const hour = parseInt(h);
                                const display = `${hour > 12 ? hour - 12 : hour}:${m} ${hour < 12 ? 'AM' : 'PM'}`;
                                const sel = selectedTime === display;
                                return (
                                  <motion.button key={t} onClick={() => setSelectedTime(display)}
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    style={{
                                      padding: '10px 4px', borderRadius: 10, fontSize: 12,
                                      border: `1px solid ${sel ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.06)'}`,
                                      background: sel ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.02)',
                                      color: sel ? '#8b5cf6' : 'white',
                                      cursor: 'pointer', fontWeight: sel ? 600 : 400
                                    }}>
                                    {display}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {step === 4 && (
                      <div>
                        <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Confirm Your Booking</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {[
                            { icon: Scissors, label: 'Service', value: selectedService?.name, sub: `$${selectedService?.price} · ${selectedService?.duration}`, color: '#8b5cf6' },
                            { icon: User, label: 'Stylist', value: selectedStylist?.name, sub: selectedStylist?.role, color: '#8b5cf6' },
                            { icon: Clock, label: 'Date & Time', value: getDateStr(selectedDate), sub: selectedTime || '', color: '#8b5cf6' },
                          ].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                              className="glass"
                              style={{
                                padding: '16px 18px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14,
                                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)'
                              }}>
                              <div style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                              }}>
                                <item.icon size={18} color={item.color} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                                <div style={{ fontSize: 15, fontWeight: 600, marginTop: 1 }}>{item.value}</div>
                                {item.sub && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>{item.sub}</div>}
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <div style={{ marginTop: 20, padding: 14, borderRadius: 10, background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.08)', fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Sparkles size={14} color="#8b5cf6" />
                          A confirmation email will be sent to your registered email address.
                        </div>

                        <motion.button
                          onClick={handleConfirm}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="premium-btn"
                          style={{ marginTop: 24, width: '100%', padding: '15px', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        >
                          <Check size={20} /> Confirm Booking
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
                  <button onClick={goBack}
                    style={{
                      padding: '10px 22px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)', color: 'white', cursor: 'pointer', fontSize: 13,
                      display: 'flex', alignItems: 'center', gap: 6, opacity: step === 1 ? 0 : 1,
                      pointerEvents: step === 1 ? 'none' : 'auto', transition: 'all 0.2s'
                    }}>
                    <ChevronLeft size={14} /> Back
                  </button>
                  {step < 4 && (
                    <button onClick={goNext}
                      disabled={!canGoNext()}
                      className="premium-btn"
                      style={{
                        padding: '10px 24px', fontSize: 13, opacity: canGoNext() ? 1 : 0.35,
                        cursor: canGoNext() ? 'pointer' : 'not-allowed',
                        display: 'flex', alignItems: 'center', gap: 6
                      }}>
                      Continue <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
