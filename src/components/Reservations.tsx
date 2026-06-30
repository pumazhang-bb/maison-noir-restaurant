import React, { useState } from 'react';
import { Calendar, Users, Info, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { ActiveSection } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ReservationsProps {
  onReservationComplete: (booking: any) => void;
  setCurrentSection: (section: ActiveSection) => void;
}

export default function Reservations({ onReservationComplete, setCurrentSection }: ReservationsProps) {
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState('2');
  const [seating, setSeating] = useState<'Main Dining Room' | "Chef's Counter" | 'Private Salon'>('Main Dining Room');
  const [specialRequests, setSpecialRequests] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<any | null>(null);

  const timeOptions = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
  const guestOptions = ["1", "2", "3", "4", "5", "6", "8", "10", "12"];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !email || !phone || !date || !time) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          date,
          time,
          guests: Number(guests),
          seating,
          specialRequests
        })
      });

      const result = await response.json();
      if (result.success) {
        setSuccessBooking(result.reservation);
        onReservationComplete(result.reservation);
        // Clear inputs
        setName('');
        setEmail('');
        setPhone('');
        setDate('');
        setSpecialRequests('');
      } else {
        setError(result.error || "Failed to secure reservation. Please try again.");
      }
    } catch (err: any) {
      setError("Server connection failure. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#050505]" id="reservations-view">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" id="reservations-header">
          <span className="font-mono text-xs text-amber-500/60 tracking-widest block mb-4">SECURE YOUR PLACE</span>
          <h1 className="font-display text-4xl sm:text-6xl text-white tracking-[0.2em] uppercase font-light">
            Reservations
          </h1>
          <p className="font-serif italic text-neutral-400 mt-4 text-sm sm:text-base leading-relaxed">
            The dining ritual of Maison Noir is reserved exclusively for guests with confirmed placements. Select your evening parameters below.
          </p>
          <div className="h-[1px] w-12 bg-amber-500/40 mx-auto mt-8" />
        </div>

        {successBooking ? (
          /* Success Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#080808] border border-amber-500/30 p-8 sm:p-12 space-y-8 text-center"
            id="booking-success-panel"
          >
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-amber-400 animate-bounce" />
            </div>

            <div className="space-y-3">
              <span className="font-mono text-[10px] text-amber-500 tracking-[0.3em] uppercase block">PLACEMENT CONFIRMED</span>
              <h2 className="font-display text-2xl sm:text-3xl text-white tracking-widest uppercase">TABLE SECURED</h2>
              <p className="font-mono text-2xl text-amber-400 font-bold tracking-[0.1em] py-3 px-6 bg-amber-950/20 border border-amber-500/10 inline-block">
                {successBooking.code}
              </p>
              <p className="text-xs text-neutral-500 font-sans max-w-md mx-auto">
                Please save this unique confirmation code. You can cancel or verify your booking parameters under the "My Bookings" portal.
              </p>
            </div>

            <div className="border-t border-white/5 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left max-w-2xl mx-auto font-sans text-xs">
              <div>
                <span className="text-neutral-500 block font-mono text-[9px] uppercase">GUEST(S)</span>
                <span className="text-white font-medium">{successBooking.guests} Placement(s)</span>
              </div>
              <div>
                <span className="text-neutral-500 block font-mono text-[9px] uppercase">VENUE</span>
                <span className="text-white font-medium">{successBooking.seating}</span>
              </div>
              <div>
                <span className="text-neutral-500 block font-mono text-[9px] uppercase">DATE</span>
                <span className="text-white font-medium">{successBooking.date}</span>
              </div>
              <div>
                <span className="text-neutral-500 block font-mono text-[9px] uppercase">TIME</span>
                <span className="text-white font-medium">{successBooking.time}</span>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setSuccessBooking(null)}
                className="bg-[#0c0c0c] border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white font-display text-xs tracking-widest uppercase px-8 py-3 transition-all duration-300 ease-out active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Book Another Table
              </button>
              <button
                onClick={() => setCurrentSection('bookings')}
                className="bg-white hover:bg-white/95 text-black font-display text-xs tracking-widest uppercase px-8 py-3 font-semibold transition-all duration-300 ease-out active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Go to My Bookings
              </button>
            </div>
          </motion.div>
        ) : (
          /* Seating Reservation Form */
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleBooking} 
            className="space-y-12 bg-[#080808] border border-white/5 p-8 sm:p-12" 
            id="reservation-form"
          >
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-950/20 border border-red-500/20 text-red-400 p-4 text-xs font-sans text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Step 1: The Details */}
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-2 flex items-center justify-between">
                <span className="font-display text-sm tracking-[0.15em] text-amber-400 font-semibold uppercase">01 — The Details</span>
                <Calendar className="w-4 h-4 text-amber-500/50" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 tracking-widest uppercase mb-2">DATE *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-white/5 focus:border-amber-500/50 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-300 [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 tracking-widest uppercase mb-2">TIME *</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-white/5 focus:border-amber-500/50 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-300"
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 tracking-widest uppercase mb-2">GUESTS *</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-white/5 focus:border-amber-500/50 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-300"
                  >
                    {guestOptions.map((g) => (
                      <option key={g} value={g}>{g} Guest{Number(g) > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seating venue custom cards */}
              <div>
                <label className="block font-mono text-[10px] text-neutral-400 tracking-widest uppercase mb-3">SEATING ENVIRONMENT *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Option 1: Main Room */}
                  <button
                    type="button"
                    onClick={() => setSeating('Main Dining Room')}
                    className={`p-5 border text-left flex flex-col justify-between h-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                      seating === 'Main Dining Room'
                        ? 'bg-amber-500/[0.03] border-amber-500/60'
                        : 'bg-[#0c0c0c] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <h4 className="font-display text-xs text-white tracking-widest uppercase font-bold">Main Dining Room</h4>
                      <p className="text-[10px] text-neutral-500 font-sans mt-2 leading-relaxed">
                        Surrounded by our dramatic fiber-optic starlight constellations and volcanic textures.
                      </p>
                    </div>
                    <span className="font-mono text-[9px] text-amber-500 font-semibold uppercase">CLASSIC REVERIE</span>
                  </button>

                  {/* Option 2: Chef's Counter */}
                  <button
                    type="button"
                    onClick={() => setSeating("Chef's Counter")}
                    className={`p-5 border text-left flex flex-col justify-between h-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                      seating === "Chef's Counter"
                        ? 'bg-amber-500/[0.03] border-amber-500/60'
                        : 'bg-[#0c0c0c] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <h4 className="font-display text-xs text-white tracking-widest uppercase font-bold">Chef's Counter</h4>
                      <p className="text-[10px] text-neutral-500 font-sans mt-2 leading-relaxed">
                        8 seats directly facing the flame workshop. Highly conversational.
                      </p>
                    </div>
                    <span className="font-mono text-[9px] text-amber-500 font-semibold uppercase">INTERACTIVE SEATS</span>
                  </button>

                  {/* Option 3: Private Salon */}
                  <button
                    type="button"
                    onClick={() => setSeating('Private Salon')}
                    className={`p-5 border text-left flex flex-col justify-between h-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                      seating === 'Private Salon'
                        ? 'bg-amber-500/[0.03] border-amber-500/60'
                        : 'bg-[#0c0c0c] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <h4 className="font-display text-xs text-white tracking-widest uppercase font-bold">Private Salon</h4>
                      <p className="text-[10px] text-neutral-500 font-sans mt-2 leading-relaxed">
                        Bespoke quiet room for customized curation, with dedicated Sommelier.
                      </p>
                    </div>
                    <span className="font-mono text-[9px] text-amber-500 font-semibold uppercase">BESPOKE PRIVATE</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Contact Information */}
            <div className="space-y-6 pt-6 border-t border-white/5">
              <div className="border-b border-white/5 pb-2 flex items-center justify-between">
                <span className="font-display text-sm tracking-[0.15em] text-amber-400 font-semibold uppercase">02 — Contact Information</span>
                <Users className="w-4 h-4 text-amber-500/50" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 tracking-widest uppercase mb-2">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Julien Renard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-white/5 focus:border-amber-500/50 p-3 text-xs text-white placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 tracking-widest uppercase mb-2">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    placeholder="E.g. chef@maisonnoir.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-white/5 focus:border-amber-500/50 p-3 text-xs text-white placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 tracking-widest uppercase mb-2">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    placeholder="E.g. +33 1 23 45 67 89"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-white/5 focus:border-amber-500/50 p-3 text-xs text-white placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Special Requests */}
            <div className="space-y-6 pt-6 border-t border-white/5">
              <div>
                <label className="block font-mono text-[10px] text-neutral-400 tracking-widest uppercase mb-2">
                  SPECIAL REQUESTS, ALLERGIES OR CELEBRATIONS (OPTIONAL)
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about food allergies, dietary choices, or celebration milestones..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-[#0c0c0c] border border-white/5 focus:border-amber-500/50 p-4 text-xs text-white placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-300 resize-none"
                />
              </div>

              {/* Policy agreement */}
              <div className="bg-amber-950/10 border border-amber-500/10 p-4 flex items-start space-x-3 text-neutral-400 text-[11px] leading-relaxed">
                <Info className="w-4 h-4 text-amber-500/60 shrink-0 mt-0.5" />
                <span>
                  By clicking Confirm, you agree to our policies. Cancellations must be submitted at least 24 hours prior to the reservation. Late arrivals exceeding 15 minutes may forfeit their guaranteed placement.
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 disabled:bg-neutral-800 disabled:text-neutral-500 text-black px-12 py-4 font-display text-xs tracking-[0.25em] uppercase font-bold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] cursor-pointer flex items-center justify-center space-x-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                id="confirm-booking-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black animate-pulse" />
                    <span>Confirm Reservation</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
}
