import React from 'react';
import { ChevronRight, Star, Clock, MapPin, Award, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface HomeProps {
  onNavigate: (section: 'home' | 'menu' | 'reservations' | 'bookings') => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [imagesLoaded, setImagesLoaded] = React.useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion();

  // Elegant luxury easing presets - refined for ultra-calm, cinematic flow with reduced motion fallback
  const fadeInUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
        delayChildren: 0.05
      }
    }
  };

  return (
    <div className="relative pt-20 select-none antialiased" id="home-view">
      {/* Cinematic Hero Section */}
      <section className="relative h-[92vh] flex items-center justify-center overflow-hidden" id="hero-section">
        <div className="absolute inset-0 z-0 bg-neutral-950">
          <div className={`absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 transition-opacity duration-[1500ms] z-10 ${imagesLoaded['hero'] ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCATUhJ3bSgY6VwbjF1P9zxNs6Pz_Nb4xKTNKswPxc7gS5fEAWs4RlVs6F8WC3O9EpdgDT5NDFdVjHzYomMYtWpgINb9_pcp8x79X38xBUCu0ItGqOwuCJBLRL4HprajWerBtcJqGnDhS78glfJXVTi-9h2lYyS21TYWTl4BnRqDYwKQnaQmn9MP37_RekeGTRlmjHbRixR2kFpo9A4Ae6ZTNUOZe8TOKVCqzqsrHjBicwAH5wnyLE1q7ugRrm8VJNQKydPYoO4E1nJ"
            alt="Maison Noir Culinary Theater"
            onLoad={() => setImagesLoaded(prev => ({ ...prev, hero: true }))}
            width="1920"
            height="1080"
            className={`w-full h-full object-cover brightness-[0.22] contrast-[1.08] transition-all duration-[2500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              imagesLoaded['hero'] ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.05]'
            }`}
            referrerPolicy="no-referrer"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/70 z-10" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.p variants={fadeInUp} className="font-sans text-xs tracking-[0.55em] text-amber-400 font-semibold uppercase">
              Now Open — Paris VIII
            </motion.p>
            <motion.h1 variants={fadeInUp} className="font-display text-4xl sm:text-7xl lg:text-8xl tracking-[0.25em] text-white font-extralight leading-none">
              MAISON NOIR
            </motion.h1>
            <motion.p variants={fadeInUp} className="font-serif italic text-lg sm:text-2xl text-neutral-400 font-light max-w-2xl mx-auto">
              "The Art of Modern Gastronomy"
            </motion.p>
            
            <motion.div variants={fadeInUp} className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
              <button
                onClick={() => onNavigate('reservations')}
                className="w-full sm:w-auto bg-white hover:bg-white/95 text-black px-10 py-4 font-display text-xs tracking-[0.25em] uppercase font-bold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                id="hero-reserve-btn"
                aria-label="Book a table now"
              >
                Secure Your Table
              </button>
              <button
                onClick={() => onNavigate('menu')}
                className="w-full sm:w-auto border border-white/15 hover:border-white/30 text-white bg-black/40 hover:bg-white/[0.04] backdrop-blur-sm px-10 py-4 font-display text-xs tracking-[0.25em] uppercase transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                id="hero-menu-btn"
                aria-label="View seasonal culinary collection"
              >
                The Collection
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating details banner */}
        <div className="absolute bottom-10 left-0 w-full z-10 hidden lg:block">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="max-w-7xl mx-auto px-12 flex justify-between text-neutral-500 font-mono text-[10px] tracking-widest"
          >
            <div className="flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-amber-500/60" />
              <span>WED — SUN / 18:00 — 23:30</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-amber-500/60" />
              <span>14 RUE DE LA PAIX, PARIS</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-3.5 h-3.5 text-amber-500/60" />
              <span>3 MICHELIN STARS PHILOSOPHY</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 01: The Atmosphere */}
      <section className="py-24 lg:py-36 bg-[#050505] border-t border-white/5 relative" id="atmosphere-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.span variants={fadeInUp} className="font-mono text-xs text-amber-500/60 tracking-widest block mb-4">01 — THE ATMOSPHERE</motion.span>
            <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-5xl text-white tracking-[0.2em] uppercase font-light leading-tight mb-8">
              A Symphony of <br />
              <span className="text-neutral-500 italic font-serif">Shadows & Light</span>
            </motion.h2>
            <motion.div variants={fadeInUp} className="space-y-6 text-neutral-400 font-sans font-light leading-relaxed text-sm sm:text-base">
              <p>
                Maison Noir is more than a restaurant; it is a meticulously choreographed culinary theatre where the environment itself plays a primary role. Built entirely with textured black volcanic stone, rich smoked oak, and hand-cast obsidian.
              </p>
              <p>
                Every table sits beneath custom-engineered fiber optic constellations, designed to isolate your private party in beautiful illumination while keeping the rest of the world cast in mysterious, relaxing darkness. Here, silence, taste, and sensory intuition reign supreme.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10 grid grid-cols-2 gap-8 pt-8 border-t border-white/5 font-display text-xs tracking-widest uppercase">
              <div>
                <h3 className="text-white font-medium mb-1">Obsidian Seating</h3>
                <p className="text-neutral-500 font-sans text-[11px] tracking-normal lowercase">chilled black stone slab designs</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">8 Seat Counter</h3>
                <p className="text-neutral-500 font-sans text-[11px] tracking-normal lowercase">intimate front-row interaction</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative group overflow-hidden bg-neutral-950"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-neutral-950 via-amber-950/15 to-neutral-950 animate-pulse transition-opacity duration-[1000ms] z-10 ${imagesLoaded['dining'] ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
            <div className="absolute inset-0 bg-amber-500/5 mix-blend-color opacity-50 group-hover:opacity-0 transition-opacity duration-1000 z-10 pointer-events-none" />
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnLZHs24riHGkb4-jkTNFh-x-HDsS25UJZU2_FCJzfBn0NjhHbGk-9JHkcBw-WGUCgQxUKEgExOa8zRI6NAe1FH0iwukxec108J3hqjFM_hH6RheTq8Q9ECDNSWbVRhsWYx0X6kAkyo1Ylwod2G__Lt4ha-pQPJldxMh1BRKnAwj6FuSHWZ6t2nD16jSOq3xGHa52qQek0ADoU0ujqeZtrv6udQAF1OJwoGSxV-LZHLRljwmTpSMUZlUjsKVo895cMKTFOGJs4MLRO"
              alt="Maison Noir Dim Dining Room"
              onLoad={() => setImagesLoaded(prev => ({ ...prev, dining: true }))}
              width="800"
              height="600"
              className={`w-full aspect-[4/3] object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                imagesLoaded['dining'] ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03]'
              } group-hover:scale-[1.02]`}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b border-r border-amber-500/20 pointer-events-none hidden sm:block z-10" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 02: Culinary Masterpieces */}
      <section className="py-24 lg:py-36 bg-[#090909] border-t border-white/5" id="masterpieces-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <motion.span variants={fadeInUp} className="font-mono text-xs text-amber-500/60 tracking-widest block mb-4">02 — THE SIGNATURES</motion.span>
            <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-5xl text-white tracking-[0.2em] uppercase font-light">
              Culinary Masterpieces
            </motion.h2>
            <motion.div variants={fadeInUp} className="h-[1px] w-16 bg-amber-500/30 mx-auto mt-6" />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {/* Masterpiece 1: Scallops */}
            <motion.div
              variants={fadeInUp}
              className="group bg-[#080808] border border-white/[0.04] overflow-hidden transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-amber-500/25 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(245,158,11,0.02)]"
            >
              <div className="relative h-72 overflow-hidden bg-neutral-950">
                <div className={`absolute inset-0 bg-gradient-to-br from-neutral-950 via-amber-950/20 to-neutral-950 animate-pulse transition-opacity duration-[1000ms] ${imagesLoaded['coquilles'] ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDnnTr-Yms3nZFPq7b-8bDvGrFlORQMz24FUtt9Qwle-lFqefRqgbEnkeSK0UuUJ2CxvsyBmtGm_1-RRNsxBAc_i6UIyhJJKJ9OaAMTW65dYCwE_u4_OcITrpbRRpHaGJQ-6Tf-1-IJjKWqEnkWeQBk3u8--wxWMooArmyVp2cWjJk-b-HUAxDLHpawY4aTUWkOlvXWJopV6s_WuZOqmHXLihLCfPHB3V_kosxCxQZCQi595Kem65YvTNMY80qnxXsHQGzfXhHNeBt"
                  alt="Coquilles"
                  onLoad={() => setImagesLoaded(prev => ({ ...prev, coquilles: true }))}
                  width="600"
                  height="450"
                  className={`w-full h-full object-cover grayscale brightness-[0.85] contrast-[1.05] transition-all duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    imagesLoaded['coquilles'] ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  } group-hover:grayscale-0 group-hover:scale-[1.025] group-hover:brightness-100`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute top-5 left-5 bg-black/80 backdrop-blur-md border border-white/10 px-3.5 py-1.5 font-mono text-[9px] text-amber-400 tracking-[0.2em] uppercase transition-all duration-700 group-hover:border-amber-500/30 group-hover:text-amber-300">
                  COURSE I
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-display text-lg text-white tracking-[0.15em] uppercase mb-2 group-hover:text-amber-200 transition-colors duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                  Coquilles & Caviar
                </h3>
                <p className="text-xs text-neutral-500 font-serif italic mb-4 tracking-wide group-hover:text-neutral-400 transition-colors duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                  Hokkaido scallops, Baerii caviar infusion, saltwort
                </p>
                <p className="text-sm text-neutral-400/90 font-light leading-relaxed line-clamp-3 group-hover:text-neutral-300 transition-colors duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                  Sourced raw and styled with delicate seaweed gel, edible gold accents, and a chilled champagne-mignonette base to create a complex oceanic landscape.
                </p>
              </div>
            </motion.div>

            {/* Masterpiece 2: Truffle Risotto */}
            <motion.div
              variants={fadeInUp}
              className="group bg-[#080808] border border-white/[0.04] overflow-hidden transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-amber-500/25 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(245,158,11,0.02)]"
            >
              <div className="relative h-72 overflow-hidden bg-neutral-950">
                <div className={`absolute inset-0 bg-gradient-to-br from-neutral-950 via-amber-950/20 to-neutral-950 animate-pulse transition-opacity duration-[1000ms] ${imagesLoaded['risotto'] ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO7An5YyLrdIAyTdxPy83JGMavGDfr_yNIoHRToBZojYnM3-K0nJmzALN-0CiYxfrgPq1DE2EDocC2iWs66uCw1gYI-JDokmX5bAVRL57VLyk53EfVZzSReNo6YEIpM1s9D4CJsKwpmRjoliOt7L-58lNoFyI49JzzJWPMoqsm6rICGba1MJw9rjV7aZT5X_b8GylZcwRFsNW75S8A7HHjC7PK0OuSosLuu6KCwQ2R-ZGLfsbeOrrJnjmGL-Ndp9ZVg1IfpM-gX4sE"
                  alt="Truffle Risotto"
                  onLoad={() => setImagesLoaded(prev => ({ ...prev, risotto: true }))}
                  width="600"
                  height="450"
                  className={`w-full h-full object-cover grayscale brightness-[0.85] contrast-[1.05] transition-all duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    imagesLoaded['risotto'] ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  } group-hover:grayscale-0 group-hover:scale-[1.025] group-hover:brightness-100`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute top-5 left-5 bg-black/80 backdrop-blur-md border border-white/10 px-3.5 py-1.5 font-mono text-[9px] text-amber-400 tracking-[0.2em] uppercase transition-all duration-700 group-hover:border-amber-500/30 group-hover:text-amber-300">
                  COURSE III
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-display text-lg text-white tracking-[0.15em] uppercase mb-2 group-hover:text-amber-200 transition-colors duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                  Truffle Infused Risotto
                </h3>
                <p className="text-xs text-neutral-500 font-serif italic mb-4 tracking-wide group-hover:text-neutral-400 transition-colors duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                  Acquerello rice, aged Parmigiano, black autumn truffles
                </p>
                <p className="text-sm text-neutral-400/90 font-light leading-relaxed line-clamp-3 group-hover:text-neutral-300 transition-colors duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                  Slow-simmered in gold leaf broth, folded with luxurious cheese cream and topped with fresh shaved black winter truffle scales.
                </p>
              </div>
            </motion.div>

            {/* Masterpiece 3: Wagyu A5 */}
            <motion.div
              variants={fadeInUp}
              className="group bg-[#080808] border border-white/[0.04] overflow-hidden transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-amber-500/25 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(245,158,11,0.02)]"
            >
              <div className="relative h-72 overflow-hidden bg-neutral-950">
                <div className={`absolute inset-0 bg-gradient-to-br from-neutral-950 via-amber-950/20 to-neutral-950 animate-pulse transition-opacity duration-[1000ms] ${imagesLoaded['wagyu'] ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV4Gss0FrhK6D9MD6rFOUzNnxX1fh-5GOIdNCshyDJUmaeQKmmiYlQNlA4LXjE3EuowE8Vaaq68-Eu3xWjM_btqUqHjbNfUzHoreZYZP8v31S5MJHl3sLDyhvKZhTVGtsZcJU2LdHVDEsOqVWwatWWNYAD7T6vPG8Ulo3qS9NIzeVzW51tGbOqMTUF0PNtk2NzDSGxbS_DyFqVG45Mv01LPRQWrJz4w9Zp1-BK5DearMvkFvJb2SAa_DWseUkCr32eD3muKghWKj57"
                  alt="Wagyu A5 Filet"
                  onLoad={() => setImagesLoaded(prev => ({ ...prev, wagyu: true }))}
                  width="600"
                  height="450"
                  className={`w-full h-full object-cover grayscale brightness-[0.85] contrast-[1.05] transition-all duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    imagesLoaded['wagyu'] ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  } group-hover:grayscale-0 group-hover:scale-[1.025] group-hover:brightness-100`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute top-5 left-5 bg-black/80 backdrop-blur-md border border-white/10 px-3.5 py-1.5 font-mono text-[9px] text-amber-400 tracking-[0.2em] uppercase transition-all duration-700 group-hover:border-amber-500/30 group-hover:text-amber-300">
                  COURSE V
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-display text-lg text-white tracking-[0.15em] uppercase mb-2 group-hover:text-amber-200 transition-colors duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                  Wagyu A5 Filet
                </h3>
                <p className="text-xs text-neutral-500 font-serif italic mb-4 tracking-wide group-hover:text-neutral-400 transition-colors duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                  Binchotan seared beef, parsnip mousse, natural jus
                </p>
                <p className="text-sm text-neutral-400/90 font-light leading-relaxed line-clamp-3 group-hover:text-neutral-300 transition-colors duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                  Highly marbled Japanese A5 beef tenderloin, lightly charred over pure hardwood embers for an incredibly tender, melt-in-your-mouth experience.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('menu')}
              className="inline-flex items-center space-x-2 text-amber-400 hover:text-white font-display text-xs tracking-widest uppercase transition-all duration-300 ease-out group cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
            >
              <span>Explore The Full Seasonal Menu</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 03: The Visionary (Executive Chef Julien Renard) */}
      <section className="py-24 lg:py-36 bg-[#050505] border-t border-white/5 relative overflow-hidden" id="chef-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16 lg:gap-24 items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative group"
          >
            {/* Elegant double offset border frame for editorial feel */}
            <div className="absolute inset-0 border border-amber-500/10 -translate-x-3 -translate-y-3 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-[1200ms] ease-out pointer-events-none" />
            <div className="absolute inset-0 border border-white/5 translate-x-3 translate-y-3 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-[1200ms] ease-out pointer-events-none" />
            
            <div className="relative overflow-hidden bg-neutral-950 border border-white/10 aspect-[3/4]">
              <div className={`absolute inset-0 bg-gradient-to-br from-neutral-950 via-amber-950/20 to-neutral-950 animate-pulse transition-opacity duration-[1000ms] ${imagesLoaded['chef'] ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVNd1Q0ZMUbkLkDpr-HQLL2jC9VEV7Hi74pkg5w16bwFheyMGtLOGsJ22WGXAta3UDCCNu8aptf77bOT30xmC-p4etLvsuZIJSCPXrpUPyGBCKNRRAb9lapXLki-6uwLeDF-aQgSSs18MMTB5lEOmKiGfyh4b3l344nffUk80NMehfnese9GhTRbphSkNPemMSu-e5srEQuLvNINImuPiPGkIci2ShVPWJhgsVfHuBYY9V3gwddDI2rjHf1DR7vlS5FMp3z9tsum3n"
                alt="Executive Chef Julien Renard"
                onLoad={() => setImagesLoaded(prev => ({ ...prev, chef: true }))}
                width="600"
                height="800"
                className={`w-full h-full object-cover grayscale brightness-[0.8] transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  imagesLoaded['chef'] ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                } group-hover:grayscale-0 group-hover:scale-[1.02] group-hover:brightness-100`}
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <motion.span variants={fadeInUp} className="font-mono text-xs text-amber-500/60 tracking-widest block mb-4">03 — THE VISIONARY</motion.span>
            <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-5xl text-white tracking-[0.2em] uppercase font-light leading-none mb-3">
              Julien Renard
            </motion.h2>
            <motion.p variants={fadeInUp} className="font-sans text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-8">
              Executive Chef & Culinary Architect
            </motion.p>

            <motion.div variants={staggerContainer} className="space-y-6 text-neutral-400 font-sans font-light leading-relaxed text-sm sm:text-base">
              <motion.p variants={fadeInUp} className="italic font-serif text-lg text-neutral-300 leading-relaxed border-l border-amber-500/20 pl-6 my-6">
                "We do not cook to satisfy hunger; we cook to challenge expectation, trigger memory, and create a dialogue through contrast."
              </motion.p>
              <motion.p variants={fadeInUp}>
                Trained in the classical Michelin temples of Paris, Chef Julien Renard spent a decade stripping away unnecessary decoration to discover what he terms "Minimalist Intensity". 
              </motion.p>
              <motion.p variants={fadeInUp}>
                By selecting only two or three focal ingredients for each dish and subjecting them to extreme heat variations and pure hardwood smoke, he coaxes out highly concentrated flavor profiles that are both intensely modern and reassuringly ancestral.
              </motion.p>
            </motion.div>

            {/* Chef signature PNG */}
            <motion.div variants={fadeInUp} className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase block mb-1">APPROVED SIGNATURE</span>
                <span className="font-display text-sm text-neutral-300 tracking-widest">J. Renard</span>
              </div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpqMn3owP_rAEOgCbLLCD68-glEzExsD--Vo0YeIdayL2Y8PB7N3winf5MVr3w9V1S4uG3FEFvA4LrsgjNYfGy-B3NgLp5J4OFv5aF1Vj8Y7J914TZa0Mpv10X0MEVDEdxYAyPNaxi5eOjfbKyeyZxaKY3x4Jm80AbQI-czkBNJLhI75XlUM_bpmtZ4jBO67HH5zK7J0WhztW8Z-O0mzR2lUomesduZKuDEAUidCVcZ4YXKYt7UQloudkzPiqJuIor0lolVCFnWk10"
                alt="Chef Julien Renard Signature"
                width="160"
                height="64"
                className="h-16 w-auto opacity-70 filter brightness-150 contrast-120 hover:opacity-100 transition-opacity duration-500"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Guest Testimonial Section */}
      <section className="py-24 bg-[#090909] border-t border-b border-white/5 overflow-hidden" id="testimonial-section">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <div className="flex justify-center space-x-1.5 text-amber-500 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-500" />
            ))}
          </div>
          <blockquote className="font-serif italic text-lg sm:text-2xl text-neutral-200 leading-relaxed mb-6">
            "The A5 Wagyu filet served over white birch coals was a masterclass in textures. When paired with the 1996 left-bank Bordeaux and the absolute dark obsidian focus of our table, it became an unforgettable, almost meditative dining ritual."
          </blockquote>
          <cite className="font-display text-xs tracking-[0.25em] text-neutral-500 uppercase not-italic font-semibold">
            — THE MICHELIN GUIDE REVIEW
          </cite>
        </motion.div>
      </section>

      {/* Booking CTA Section */}
      <section className="py-24 lg:py-32 bg-[#050505] relative flex items-center justify-center overflow-hidden animate-none" id="cta-section">
        <div className="absolute inset-0 z-0 opacity-15 bg-neutral-950">
          <div className={`absolute inset-0 bg-neutral-950 transition-opacity duration-[1200ms] z-10 ${imagesLoaded['cta'] ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
          <motion.img
            initial={{ scale: 1.05, opacity: 0 }}
            animate={imagesLoaded['cta'] ? { scale: 1, opacity: 1 } : { scale: 1.05, opacity: 0 }}
            transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsq-OnSoWAdGFlDQUd5XdQFl7AC5edxiknU570RvyZKjwQmJUJ4UEK-f56MFgpCWVInkQix4ttLOjRMwnKwbnh4dzLi7s7Ym_CTrb5BoMFgrUZO-CE4FZLvG8vEcE-mKNukvJ51ixWHSkMtFZwb7hT1KTkz_mrC9Qews-U_Mj2RU72IvD_UGvPxyLUbiHBVZHIjRH3SJKAILC5Z5GCnxDwi-enZVgifYBWzdK2kjYg5pw-NFkaRf44OGP3uJUC2X0c0fPiaU0gIbnw"
            alt="Maison Noir Cinematic Table Setting"
            onLoad={() => setImagesLoaded(prev => ({ ...prev, cta: true }))}
            width="1920"
            height="1080"
            className="w-full h-full object-cover brightness-[0.7] contrast-[1.1]"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          <span className="font-mono text-xs text-amber-400 tracking-[0.3em] uppercase block">THE REVERIE AWAITS</span>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-white tracking-[0.2em] uppercase font-light">
            Secure Your Place
          </h2>
          <p className="text-neutral-400 font-sans font-light text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Due to our extreme visual design parameters and limited seating configurations, reservations are strictly required and often fill weeks in advance.
          </p>
          
          <button
            onClick={() => onNavigate('reservations')}
            className="inline-flex items-center bg-white hover:bg-white/95 text-black px-12 py-5 font-display text-xs tracking-[0.25em] uppercase font-bold transition-all duration-300 ease-out active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            id="cta-reserve-btn"
          >
            Request Seating Reservation
          </button>
        </div>
      </section>
    </div>
  );
}
