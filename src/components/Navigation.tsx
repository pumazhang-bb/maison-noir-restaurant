import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { ActiveSection } from '../types';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface NavigationProps {
  currentSection: ActiveSection;
  setCurrentSection: (section: ActiveSection) => void;
  onOpenConcierge: () => void;
}

export default function Navigation({ currentSection, setCurrentSection, onOpenConcierge }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'The Atmosphere' },
    { id: 'menu', label: 'Seasonal Menu' },
    { id: 'reservations', label: 'Book Table' },
    { id: 'bookings', label: 'My Bookings' }
  ] as const;

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 antialiased transition-all duration-500 ease-out ${
        isScrolled 
          ? 'bg-[#050505]/95 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_15px_50px_-20px_rgba(0,0,0,0.95)]' 
          : 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 shadow-none'
      }`} 
      id="main-nav"
    >
      <div className={`max-w-7xl mx-auto px-6 lg:px-12 transition-all duration-500 ease-out ${
        isScrolled ? 'h-16' : 'h-20'
      } flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]`}>
        {/* Brand Logo */}
        <button
          onClick={() => setCurrentSection('home')}
          className="flex flex-col items-start cursor-pointer group text-left focus:outline-none active:scale-[0.985] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-1 focus-visible:ring-amber-500/30 focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded-sm md:justify-self-start"
          id="nav-logo-btn"
          aria-label="Maison Noir Logo Home"
        >
          <span className="font-display text-base lg:text-lg tracking-[0.3em] lg:tracking-[0.35em] text-white font-semibold group-hover:text-amber-400 group-focus:text-amber-400 transition-colors duration-500">
            MAISON NOIR
          </span>
          <span className="font-sans text-[7px] lg:text-[8px] tracking-[0.35em] lg:tracking-[0.4em] text-neutral-500 font-medium group-hover:text-neutral-400 transition-colors duration-500 mt-0.5">
            AN ODE TO GASTRONOMY
          </span>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center justify-center justify-self-center space-x-6 lg:space-x-10 xl:space-x-12" id="desktop-nav-links">
          {navItems.map((item) => {
            const shouldReduce = useReducedMotion();
            return (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`font-display text-[10px] lg:text-xs tracking-[0.25em] uppercase transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative py-2 cursor-pointer focus-visible:outline-none focus-visible:text-amber-400 focus-visible:ring-1 focus-visible:ring-amber-500/20 rounded-sm px-1.5 active:scale-[0.98] ${
                  currentSection === item.id
                    ? 'text-amber-400 font-medium'
                    : 'text-neutral-400 hover:text-white after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-neutral-500/40 hover:after:w-full after:transition-all after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)]'
                }`}
                id={`nav-link-${item.id}`}
                aria-label={`Navigate to ${item.label}`}
              >
                <span className="relative z-10">{item.label}</span>
                {currentSection === item.id && (
                  <motion.span
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-amber-400"
                    transition={{ duration: shouldReduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button: AI Concierge */}
        <div className="hidden md:flex items-center justify-self-end">
          <button
            onClick={onOpenConcierge}
            className="group/btn flex items-center space-x-2 bg-amber-950/10 hover:bg-amber-950/20 border border-amber-500/20 hover:border-amber-500/40 text-amber-300 hover:text-amber-100 px-4.5 py-2 rounded-none text-[9px] lg:text-[10px] font-display tracking-[0.2em] uppercase transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            id="nav-ai-concierge-btn"
            aria-label="Open Chef's Concierge Chat"
          >
            <Sparkles className="w-3 h-3 text-amber-400/80 group-hover/btn:scale-110 group-hover/btn:text-amber-300 transition-all duration-300" />
            <span className="font-semibold">Chef's Concierge</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={onOpenConcierge}
            className="p-2 text-amber-400 hover:text-amber-300 active:scale-90 transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 rounded-sm"
            aria-label="Open Chef Concierge"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-neutral-400 hover:text-white active:scale-95 transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-sm"
            id="mobile-menu-toggle"
            aria-label="Toggle Mobile Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-[#070707] border-b border-white/5 px-6 py-6 space-y-4 overflow-hidden"
            id="mobile-menu-drawer"
          >
            <div className="flex flex-col space-y-3.5">
              {navItems.map((item, idx) => (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.id}
                  onClick={() => {
                    setCurrentSection(item.id);
                    setIsOpen(false);
                  }}
                  className={`text-left font-display text-sm tracking-[0.2em] uppercase py-2 border-b border-white/5 cursor-pointer transition-all duration-300 ease-out active:translate-x-1 focus-visible:outline-none focus-visible:text-amber-400 focus-visible:ring-1 focus-visible:ring-amber-500/20 rounded-sm ${
                    currentSection === item.id ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                  id={`mobile-nav-link-${item.id}`}
                >
                  {item.label}
                </motion.button>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                onClick={() => {
                  setIsOpen(false);
                  onOpenConcierge();
                }}
                className="flex items-center justify-center space-x-2 w-full py-3 bg-amber-950/10 border border-amber-500/20 text-amber-300 hover:text-amber-200 hover:border-amber-500/40 text-xs font-display tracking-widest uppercase rounded-none transition-all duration-300 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 cursor-pointer"
                id="mobile-nav-concierge"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Chef's Concierge</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
