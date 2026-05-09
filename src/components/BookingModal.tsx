import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check, Clock, User, Scissors } from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import type { ServiceMenuItem } from '../types';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  preselectedService: ServiceMenuItem | null;
}

export default function BookingModal({ open, onClose, preselectedService }: BookingModalProps) {
  const { serviceMenu, staff, timeSlots, bookAppointment, categories } = useSalon();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceMenuItem | null>(preselectedService);
  const [selectedStylist, setSelectedStylist] = useState<{ id: number; name: string; role: string; rating: number; specialties: string[]; image: string; bio: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [filterCat, setFilterCat] = useState('All');

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
    setTimeout(() => { onClose(); resetForm(); }, 2000);
  };

  const resetForm = () => {
    setStep(1); setSelectedService(null); setSelectedStylist(null);
    setSelectedDate(null); setSelectedTime(null); setConfirmed(false);
  };

  const canGoNext = () => {
    if (step === 1) return selectedService;
    if (step === 2) return selectedStylist;
    if (step === 3) return selectedDate && selectedTime;
    return false;
  };

  const getDateStr = (d: Date | null) => {
    if (!d) return '';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
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
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20
          }}
          onClick={(e) => { if (e.target === e.currentTarget) { onClose(); resetForm(); } }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass"
            style={{
              width: '100%', maxWidth: 560, maxHeight: '85vh', overflow: 'auto',
              padding: 32, position: 'relative'
            }}
          >
            <button onClick={() => { onClose(); resetForm(); }}
              style={{
                position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 8,
                background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
              <X size={16} />
            </button>

            {confirmed ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(34,197,94,0.15)', margin: '0 auto 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Check size={32} color="#22c55e" />
                </div>
                <h2 style={{ fontSize: 24, marginBottom: 8 }}>Booking Confirmed!</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                  {selectedService?.name} with {selectedStylist?.name} on {getDateStr(selectedDate)} at {selectedTime}
                </p>
                <p style={{ color: '#8b5cf6', fontSize: 13, marginTop: 16 }}>Redirecting to dashboard...</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 8, marginBottom: 28, justifyContent: 'center' }}>
                  {[1, 2, 3, 4].map(s => (
                    <div key={s} style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: step === s ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : step > s ? '#22c55e' : 'rgba(255,255,255,0.15)',
                      transition: 'all 0.3s'
                    }} />
                  ))}
                </div>

                {step === 1 && (
                  <div>
                    <h2 style={{ fontSize: 22, marginBottom: 4 }}>Choose a Service</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>What would you like us to do today?</p>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                      {(['All', ...categories] as string[]).map(c => (
                        <button key={c} onClick={() => setFilterCat(c)}
                          style={{
                            padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                            border: 'none', cursor: 'pointer',
                            background: filterCat === c ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : 'rgba(255,255,255,0.06)',
                            color: 'white'
                          }}>
                          {c}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {filteredServices.map(s => (
                        <button key={s.id} onClick={() => setSelectedService(s)}
                          style={{
                            padding: '14px 16px', borderRadius: 12, textAlign: 'left',
                            border: `1px solid ${selectedService?.id === s.id ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.06)'}`,
                            background: selectedService?.id === s.id ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)',
                            color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            transition: 'all 0.2s'
                          }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>
                              {s.category} &middot; {s.duration}
                            </div>
                          </div>
                          <span style={{ color: '#8b5cf6', fontWeight: 'bold', fontSize: 16 }}>${s.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 style={{ fontSize: 22, marginBottom: 4 }}>Choose Your Stylist</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>Select a specialist for your {selectedService?.name}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {staff.map(s => {
                        const available = selectedService ? s.specialties.includes(selectedService.category) : true;
                        return (
                          <button key={s.id} onClick={() => available && setSelectedStylist(s)}
                            disabled={!available}
                            style={{
                              padding: '14px 16px', borderRadius: 12, textAlign: 'left',
                              border: `1px solid ${selectedStylist?.id === s.id ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.06)'}`,
                              background: selectedStylist?.id === s.id ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)',
                              color: 'white', cursor: available ? 'pointer' : 'not-allowed',
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              opacity: available ? 1 : 0.4
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(217,70,239,0.2))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14
                              }}>
                                {s.image}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{s.role} &middot; {'★'.repeat(Math.floor(s.rating))}</div>
                              </div>
                            </div>
                            {available && (
                              <span style={{ fontSize: 12, color: selectedStylist?.id === s.id ? '#8b5cf6' : 'var(--text-secondary)' }}>
                                {selectedStylist?.id === s.id ? 'Selected' : 'Available'}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 style={{ fontSize: 22, marginBottom: 4 }}>Pick Date & Time</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>
                      {selectedService?.name} with {selectedStylist?.name}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else setCurrentMonth(currentMonth - 1); }}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 8 }}>
                        <ChevronLeft size={18} />
                      </button>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{MONTHS[currentMonth]} {currentYear}</span>
                      <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else setCurrentMonth(currentMonth + 1); }}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 8 }}>
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 12 }}>
                      {DAYS.map(d => (
                        <div key={d} style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-secondary)', padding: 4 }}>{d}</div>
                      ))}
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const d = new Date(currentYear, currentMonth, day);
                        const isPast = d < new Date(new Date().toDateString());
                        const isSelected = selectedDate && selectedDate.getTime() === d.getTime();
                        const isToday = d.getTime() === new Date(new Date().toDateString()).getTime();
                        return (
                          <button key={day} onClick={() => !isPast && handleDateSelect(day)}
                            disabled={isPast}
                            style={{
                              padding: 8, borderRadius: 8, border: 'none', cursor: isPast ? 'not-allowed' : 'pointer',
                              background: isSelected ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : isToday ? 'rgba(139,92,246,0.15)' : 'transparent',
                              color: isPast ? 'rgba(255,255,255,0.2)' : 'white',
                              fontSize: 13, fontWeight: isSelected ? 700 : 400,
                              opacity: isPast ? 0.3 : 1
                            }}>
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    {selectedDate && (
                      <div style={{ marginTop: 16 }}>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                          Available Times for {getDateStr(selectedDate)}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                          {timeSlots.map(t => {
                            const [h, m] = t.split(':');
                            const hour = parseInt(h);
                            const isAM = hour < 12;
                            const display = `${hour > 12 ? hour - 12 : hour}:${m} ${isAM ? 'AM' : 'PM'}`;
                            return (
                              <button key={t} onClick={() => setSelectedTime(display)}
                                style={{
                                  padding: '8px 4px', borderRadius: 8, fontSize: 12,
                                  border: `1px solid ${selectedTime === display ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                                  background: selectedTime === display ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.02)',
                                  color: selectedTime === display ? '#8b5cf6' : 'white',
                                  cursor: 'pointer', fontWeight: selectedTime === display ? 600 : 400
                                }}>
                                {display}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h2 style={{ fontSize: 22, marginBottom: 20 }}>Confirm Your Booking</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div className="glass" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)' }}>
                        <Scissors size={18} color="#8b5cf6" />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedService?.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>${selectedService?.price} &middot; {selectedService?.duration}</div>
                        </div>
                      </div>
                      <div className="glass" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)' }}>
                        <User size={18} color="#8b5cf6" />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedStylist?.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{selectedStylist?.role}</div>
                        </div>
                      </div>
                      <div className="glass" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)' }}>
                        <Clock size={18} color="#8b5cf6" />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{getDateStr(selectedDate)}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>at {selectedTime}</div>
                        </div>
                      </div>
                    </div>
                    <button onClick={handleConfirm} className="premium-btn"
                      style={{ marginTop: 24, width: '100%', padding: '14px', fontSize: 16 }}>
                      Confirm Booking
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                  <button onClick={() => { if (step > 1) setStep(step - 1); }}
                    style={{
                      padding: '10px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                      background: 'transparent', color: 'white', cursor: 'pointer', fontSize: 13
                    }}>
                    {step === 1 ? 'Cancel' : 'Back'}
                  </button>
                  {step < 4 && (
                    <button onClick={() => canGoNext() && setStep(step + 1)}
                      disabled={!canGoNext()}
                      className="premium-btn"
                      style={{
                        padding: '10px 24px', fontSize: 13, opacity: canGoNext() ? 1 : 0.4,
                        cursor: canGoNext() ? 'pointer' : 'not-allowed'
                      }}>
                      Continue
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
