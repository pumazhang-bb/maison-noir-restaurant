import React from 'react';
import { Calendar, MapPin, Phone, Mail, Award, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: 'home' | 'menu' | 'reservations' | 'bookings') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#050505] border-t border-white/5 py-16 sm:py-24 text-neutral-400 font-sans" id="main-footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-16 border-b border-white/5">
        
        {/* Brand Column */}
        <div className="space-y-5">
          <div className="flex flex-col space-y-1">
            <span className="font-display text-lg tracking-[0.35em] text-white font-semibold">MAISON NOIR</span>
            <span className="font-sans text-[8px] tracking-[0.4em] text-neutral-500 font-medium">AN ODE TO GASTRONOMY</span>
          </div>
          <p className="font-serif italic text-xs leading-relaxed text-neutral-500 tracking-wide">
            "A synchronized theater where fire, shadow, volcanic stone, and sensory intuition craft unforgettable modern masterpieces."
          </p>
          <div className="flex items-center space-x-2 text-amber-500/60">
            <Award className="w-4 h-4 text-amber-500/50" />
            <span className="font-mono text-[9px] tracking-[0.18em] uppercase">3 MICHELIN STAR PRINCIPLES</span>
          </div>
        </div>

        {/* Hour Column */}
        <div className="space-y-5">
          <h3 className="font-display text-xs text-white tracking-[0.2em] uppercase font-bold">HOURS</h3>
          <div className="space-y-3 text-xs font-light">
            <div className="flex items-center space-x-2.5">
              <Clock className="w-3.5 h-3.5 text-amber-500/40 shrink-0" />
              <span className="text-neutral-300">Wednesday — Sunday</span>
            </div>
            <p className="pl-6 text-neutral-500">Dinner Only: 18:00 — 23:30</p>
            <p className="pl-6 text-amber-500/70 font-mono text-[9px] tracking-widest uppercase">Strictly Reservation Only</p>
          </div>
        </div>

        {/* Location Column */}
        <div className="space-y-5">
          <h3 className="font-display text-xs text-white tracking-[0.2em] uppercase font-bold">LOCATION</h3>
          <div className="space-y-3 text-xs font-light">
            <div className="flex items-start space-x-2.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500/40 shrink-0 mt-0.5" />
              <span className="text-neutral-300 leading-relaxed">14 Rue de la Paix, Paris, 75002, France</span>
            </div>
            <p className="pl-6 text-neutral-500 leading-relaxed">Volcanic front facade opposite Place Vendôme.</p>
          </div>
        </div>

        {/* Navigation & Contact Column */}
        <div className="space-y-5">
          <h3 className="font-display text-xs text-white tracking-[0.2em] uppercase font-bold">CONTACT</h3>
          <div className="space-y-3 text-xs font-light">
            <div className="flex items-center space-x-2.5">
              <Phone className="w-3.5 h-3.5 text-amber-500/40 shrink-0" />
              <a 
                href="tel:+33142685300" 
                className="text-neutral-300 hover:text-amber-300 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 rounded px-1 -mx-1"
              >
                +33 1 42 68 53 00
              </a>
            </div>
            <div className="flex items-center space-x-2.5">
              <Mail className="w-3.5 h-3.5 text-amber-500/40 shrink-0" />
              <a 
                href="mailto:curator@maisonnoir.com" 
                className="text-neutral-300 hover:text-amber-300 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 rounded px-1 -mx-1"
              >
                curator@maisonnoir.com
              </a>
            </div>

            <div className="pt-3 flex items-center space-x-6">
              <button
                onClick={() => onNavigate('reservations')}
                className="relative pb-1 text-amber-400 text-[10px] tracking-widest font-display uppercase hover:text-white transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 rounded px-1 -mx-1 cursor-pointer"
              >
                Book Now
              </button>
              <button
                onClick={() => onNavigate('menu')}
                className="relative pb-1 text-neutral-400 text-[10px] tracking-widest font-display uppercase hover:text-white transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded px-1 -mx-1 cursor-pointer"
              >
                The Collection
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-[9px] font-mono tracking-[0.2em] text-neutral-600 gap-4">
        <p className="hover:text-neutral-500 transition-colors duration-300">© {new Date().getFullYear()} MAISON NOIR. ALL RIGHTS RESERVED.</p>
        <p className="hover:text-neutral-500 transition-colors duration-300 select-none">CRAFTED UNDER MINIMALIST INTENSITY DIRECTIVES</p>
      </div>
    </footer>
  );
}
