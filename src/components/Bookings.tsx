import React, { useState, useEffect } from 'react';
import { Search, Trash2, ShieldCheck, HelpCircle, FileText, Calendar, Compass, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface BookingsProps {
  sessionBookings: any[];
}

export default function Bookings({ sessionBookings }: BookingsProps) {
  const shouldReduce = useReducedMotion();
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  
  const [cancelCode, setCancelCode] = useState('');
  const [cancelEmail, setCancelEmail] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancellingCode, setCancellingCode] = useState<string | null>(null);
  const [confirmCancelItem, setConfirmCancelItem] = useState<{ code: string; email: string } | null>(null);

  // Fetch all bookings from backend
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reservations');
      const data = await response.json();
      if (data.success) {
        // Sort by date descending
        const sorted = data.reservations.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setAllBookings(sorted);
      }
    } catch (err) {
      console.error("Failed to load reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [sessionBookings]);

  // Handle Lookup by code
  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupResult(null);
    if (!searchCode) return;

    const codeToSearch = searchCode.trim().toLowerCase();
    const emailToSearch = searchEmail.trim().toLowerCase();

    const found = allBookings.find(b => {
      const matchesCode = b.code.toLowerCase() === codeToSearch;
      const matchesEmail = !emailToSearch || b.email.toLowerCase() === emailToSearch;
      return matchesCode && matchesEmail;
    });

    if (found) {
      setLookupResult(found);
      setCancelError(null);
    } else {
      setCancelError("No matching reservation found. Please verify the code and email.");
    }
  };

  // Handle Cancel Reservation
  const handleCancel = async (code: string, email: string) => {
    setCancellingCode(code);
    setCancelError(null);
    setCancelSuccess(null);
    setConfirmCancelItem(null);

    try {
      const response = await fetch('/api/reservations/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, email })
      });
      const result = await response.json();

      if (result.success) {
        setCancelSuccess(`Reservation ${code} has been successfully cancelled.`);
        setLookupResult(null);
        // Refresh
        await fetchBookings();
      } else {
        setCancelError(result.error || "Failed to cancel reservation.");
      }
    } catch (err) {
      setCancelError("Server communication error.");
    } finally {
      setCancellingCode(null);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#050505]" id="bookings-view">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" id="bookings-header">
          <span className="font-mono text-xs text-amber-500/60 tracking-widest block mb-4">PORTAL DE GESTION</span>
          <h1 className="font-display text-4xl sm:text-6xl text-white tracking-[0.2em] uppercase font-light">
            My Bookings
          </h1>
          <p className="font-serif italic text-neutral-400 mt-4 text-sm sm:text-base leading-relaxed">
            Verify, query, or cancel active table placements inside the Maison Noir luxury dining registry.
          </p>
          <div className="h-[1px] w-12 bg-amber-500/40 mx-auto mt-8" />
        </div>

        {/* Info alerts */}
        {(cancelSuccess || cancelError) && (
          <div className="max-w-4xl mx-auto mb-8 space-y-4">
            {cancelSuccess && (
              <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 p-4 text-xs font-sans text-center">
                {cancelSuccess}
              </div>
            )}
            {cancelError && (
              <div className="bg-red-950/20 border border-red-500/20 text-red-400 p-4 text-xs font-sans text-center">
                {cancelError}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="bookings-layout">
          {/* Left Column: Lookup Form */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#080808] border border-white/5 p-6 sm:p-8 space-y-6">
              <h2 className="font-display text-xs tracking-[0.2em] text-amber-400 font-bold uppercase pb-3 border-b border-white/5">
                Retrieve Placement
              </h2>

              <form onSubmit={handleLookup} className="space-y-4">
                <div>
                  <label className="block font-mono text-[9px] text-neutral-400 tracking-widest uppercase mb-1.5">RESERVATION CODE *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. MN-7384-K"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-white/5 focus:border-amber-500/50 p-3 text-xs text-white placeholder-neutral-700 uppercase focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[9px] text-neutral-400 tracking-widest uppercase mb-1.5">EMAIL ADDRESS (OPTIONAL)</label>
                  <input
                    type="email"
                    placeholder="E.g. guest@maisonnoir.com"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-white/5 focus:border-amber-500/50 p-3 text-xs text-white placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white hover:bg-white/95 text-black text-[10px] tracking-widest font-bold uppercase py-3.5 transition-all duration-300 ease-out active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Lookup Reservation
                </button>
              </form>
            </div>

            {/* Display Lookup result if found */}
            <AnimatePresence mode="wait">
              {lookupResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#0c0c0c] border border-amber-500/30 p-6 space-y-5"
                  id="lookup-result-card"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[9px] text-amber-400 tracking-wider">RETRIEVED RECORD</span>
                      <h4 className="font-display text-sm text-white tracking-widest uppercase">{lookupResult.code}</h4>
                    </div>
                    <span className={`px-2 py-0.5 text-[8px] font-mono tracking-widest uppercase ${
                      lookupResult.status === 'confirmed' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {lookupResult.status}
                    </span>
                  </div>

                  <div className="space-y-3 font-sans text-xs text-neutral-400 border-t border-white/5 pt-4">
                    <p><strong className="text-white font-semibold">Guest:</strong> {lookupResult.name}</p>
                    <p><strong className="text-white font-semibold">Date:</strong> {lookupResult.date}</p>
                    <p><strong className="text-white font-semibold">Time:</strong> {lookupResult.time}</p>
                    <p><strong className="text-white font-semibold">Placements:</strong> {lookupResult.guests} Guest(s)</p>
                    <p><strong className="text-white font-semibold">Seating Seclusion:</strong> {lookupResult.seating}</p>
                    {lookupResult.specialRequests && (
                      <p><strong className="text-white font-semibold">Requests:</strong> "{lookupResult.specialRequests}"</p>
                    )}
                  </div>

                  {lookupResult.status === 'confirmed' && (
                    <button
                      onClick={() => setConfirmCancelItem({ code: lookupResult.code, email: lookupResult.email })}
                      disabled={cancellingCode === lookupResult.code}
                      className="w-full mt-2 bg-red-950/20 hover:bg-red-950/35 border border-red-500/20 text-red-400 text-[9px] tracking-widest uppercase font-semibold py-2.5 transition-all duration-300 ease-out active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{cancellingCode === lookupResult.code ? 'Cancelling...' : 'Cancel Reservation'}</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Seating Registry List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <h2 className="font-display text-xs tracking-widest text-white font-bold uppercase flex items-center space-x-2">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>Active Table Seating Registry</span>
              </h2>
              
              <button
                onClick={fetchBookings}
                className="p-1 text-neutral-500 hover:text-white transition-all duration-300 ease-out active:scale-90 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-sm"
                title="Refresh Registry"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1" id="bookings-registry-list">
              <AnimatePresence initial={false}>
                {allBookings.map((b, index) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
                    className="bg-[#080808] border border-white/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-all duration-300 hover:border-white/10"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-display text-sm font-bold tracking-widest text-white uppercase">{b.code}</span>
                        <span className={`px-2 py-0.5 text-[8px] font-mono tracking-widest uppercase ${
                          b.status === 'confirmed' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1.5 gap-x-6 text-[11px] font-sans text-neutral-400">
                        <p><strong className="text-neutral-500 font-mono">GUEST:</strong> <span className="text-neutral-200">{b.name}</span></p>
                        <p><strong className="text-neutral-500 font-mono">SEATS:</strong> <span className="text-neutral-200">{b.guests} Placement(s)</span></p>
                        <p><strong className="text-neutral-500 font-mono">VENUE:</strong> <span className="text-neutral-200">{b.seating}</span></p>
                        <p><strong className="text-neutral-500 font-mono">DATE:</strong> <span className="text-neutral-200">{b.date}</span></p>
                        <p><strong className="text-neutral-500 font-mono">TIME:</strong> <span className="text-neutral-200">{b.time}</span></p>
                      </div>
                    </div>

                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => setConfirmCancelItem({ code: b.code, email: b.email })}
                        disabled={cancellingCode === b.code}
                        className="bg-[#0d0d0d] hover:bg-red-950/15 border border-white/5 hover:border-red-500/20 text-neutral-500 hover:text-red-400 p-2 px-3.5 text-[9px] tracking-widest uppercase transition-all duration-300 ease-out active:scale-[0.97] shrink-0 cursor-pointer flex items-center space-x-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500/30"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{cancellingCode === b.code ? '...' : 'Cancel'}</span>
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {allBookings.length === 0 && (
                <div className="text-center py-16 bg-[#080808] border border-white/5">
                  <FileText className="w-8 h-8 text-neutral-700 mx-auto mb-4" />
                  <p className="font-serif italic text-neutral-500 text-sm">
                    No active table bookings have been secured yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Stateful Cancel Confirmation Modal */}
      <AnimatePresence>
        {confirmCancelItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            id="cancel-confirm-modal"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: shouldReduce ? 0 : 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: shouldReduce ? 0 : 15 }}
              transition={{ duration: shouldReduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0b0b0b] border border-red-500/30 max-w-md w-full p-8 space-y-6 relative shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
            >
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-red-500/80 tracking-widest uppercase block">DANGER ZONE</span>
                <h2 className="font-display text-xl text-white tracking-widest uppercase">CANCEL PLACEMENT?</h2>
                <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                  Are you absolutely certain you want to cancel the active dining table reservation <strong className="text-white font-mono">{confirmCancelItem.code}</strong>? This action is irreversible.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setConfirmCancelItem(null)}
                  className="w-full sm:w-1/2 bg-[#0c0c0c] hover:bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white font-display text-[10px] tracking-widest uppercase py-3.5 transition-all duration-300 ease-out active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
                >
                  Keep Table
                </button>
                <button
                  onClick={() => handleCancel(confirmCancelItem.code, confirmCancelItem.email)}
                  className="w-full sm:w-1/2 bg-red-600 hover:bg-red-500 text-white font-display text-[10px] tracking-widest uppercase py-3.5 transition-all duration-300 ease-out active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                >
                  Yes, Cancel Table
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
