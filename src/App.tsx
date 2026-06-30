import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Menu from './components/Menu';
import Reservations from './components/Reservations';
import Bookings from './components/Bookings';
import Concierge from './components/Concierge';
import Footer from './components/Footer';
import { ActiveSection } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentSection, setCurrentSection] = useState<ActiveSection>('home');
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [conciergeMessage, setConciergeMessage] = useState<string | null>(null);
  const [sessionBookings, setSessionBookings] = useState<any[]>([]);

  // Function to open concierge with a seeded message
  const handleAskChef = (question: string) => {
    setConciergeMessage(question);
    setIsConciergeOpen(true);
  };

  // When reservation is submitted, append to session tracker
  const handleReservationComplete = (newBooking: any) => {
    setSessionBookings((prev) => [newBooking, ...prev]);
  };

  const renderActiveSection = () => {
    switch (currentSection) {
      case 'home':
        return <Home onNavigate={setCurrentSection} />;
      case 'menu':
        return <Menu onAskChef={handleAskChef} />;
      case 'reservations':
        return (
          <Reservations
            onReservationComplete={handleReservationComplete}
            setCurrentSection={setCurrentSection}
          />
        );
      case 'bookings':
        return <Bookings sessionBookings={sessionBookings} />;
      default:
        return <Home onNavigate={setCurrentSection} />;
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-neutral-200 flex flex-col relative selection:bg-amber-500/20 selection:text-amber-300 overflow-x-hidden" id="app-root">
      
      {/* Navigation */}
      <Navigation
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        onOpenConcierge={() => {
          setConciergeMessage(null);
          setIsConciergeOpen(true);
        }}
      />

      {/* Main Content Area with elegant fade transition */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            id="main-content-transition"
          >
            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentSection} />

      {/* Chat Concierge Sidebar Drawer */}
      <Concierge
        isOpen={isConciergeOpen}
        onClose={() => {
          setIsConciergeOpen(false);
          setConciergeMessage(null);
        }}
        initialMessage={conciergeMessage}
      />
    </div>
  );
}
