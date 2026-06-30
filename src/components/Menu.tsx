import React, { useState, useMemo } from 'react';
import { Search, Info, HelpCircle, Utensils, Sparkles } from 'lucide-react';
import { MenuItem } from '../types';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface MenuProps {
  onAskChef: (question: string) => void;
}

const MENU_ITEMS: MenuItem[] = [
  // Appetizers
  {
    id: 'app-1',
    name: 'Oysters & Mignonette',
    description: 'Fine de Claire No. 2, champagne-infused vinegar mignonette, sea ice crystals.',
    price: 48,
    category: 'appetizer',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9qA0NYZ3-TBZRF68wWajW6vuIHCfzLIcKI8RimQb60JTs94uOs94if3mWn43rUpRl4qr2dMEcNyS9cKRkl2uzJbA3QnrMMKnHhPhEIsLgerW75V2olN-UCnGcHKUjsHgNode3OJf3YGemMJJ5klevKjuYrGZ7JbOu81N2cqbEK-DgYwCSJdj96w02kly_SAk3ONSEZQPOm_IXDEumH152iHFK34bNYMwpLbYKi944QUjXX-TfTlhxOX_FiKsCKp2DFO-OK0f-f4bV',
    tag: 'Chilled',
    details: {
      allergens: ['Molluscs', 'Sulfites'],
      pairing: 'Blanc de Blancs Champagne',
      origin: 'Brittany Coast, France'
    }
  },
  {
    id: 'app-2',
    name: 'Wagyu Beef Tartare',
    description: 'Binchotan cured egg yolk, toasted wild mustard seeds, shaved black Périgord truffles.',
    price: 65,
    category: 'appetizer',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsq-OnSoWAdGFlDQUd5XdQFl7AC5edxiknU570RvyZKjwQmJUJ4UEK-f56MFgpCWVInkQix4ttLOjRMwnKwbnh4dzLi7s7Ym_CTrb5BoMFgrUZO-CE4FZLvG8vEcE-mKNukvJ51ixWHSkMtFZwb7hT1KTkz_mrC9Qews-U_Mj2RU72IvD_UGvPxyLUbiHBVZHIjRH3SJKAILC5Z5GCnxDwi-enZVgifYBWzdK2kjYg5pw-NFkaRf44OGP3uJUC2X0c0fPiaU0gIbnw',
    tag: 'Signature',
    details: {
      allergens: ['Eggs', 'Mustard'],
      pairing: 'Savigny-lès-Beaune Burgundy',
      origin: 'Kagoshima Prefecture, Japan'
    }
  },
  {
    id: 'app-3',
    name: 'White Asparagus',
    description: 'Steamed in saline broth, creamy hollandaise foam, toasted pine nut dust, bronze fennel.',
    price: 44,
    category: 'appetizer',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDnnTr-Yms3nZFPq7b-8bDvGrFlORQMz24FUtt9Qwle-lFqefRqgbEnkeSK0UuUJ2CxvsyBmtGm_1-RRNsxBAc_i6UIyhJJKJ9OaAMTW65dYCwE_u4_OcITrpbRRpHaGJQ-6Tf-1-IJjKWqEnkWeQBk3u8--wxWMooArmyVp2cWjJk-b-HUAxDLHpawY4aTUWkOlvXWJopV6s_WuZOqmHXLihLCfPHB3V_kosxCxQZCQi595Kem65YvTNMY80qnxXsHQGzfXhHNeBt',
    tag: 'Seasonal',
    details: {
      allergens: ['Nuts', 'Eggs'],
      pairing: 'Pouilly-Fumé Sauvignon Blanc',
      origin: 'Loire Valley, France'
    }
  },
  // Mains
  {
    id: 'main-1',
    name: 'Lobster Thermidor',
    description: 'Native blue lobster poached in wild cognac cream, topped with Gruyère crust & fine herbs.',
    price: 95,
    category: 'main',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCATUhJ3bSgY6VwbjF1P9zxNs6Pz_Nb4xKTNKswPxc7gS5fEAWs4RlVs6F8WC3O9EpdgDT5NDFdVjHzYomMYtWpgINb9_pcp8x79X38xBUCu0ItGqOwuCJBLRL4HprajWerBtcJqGnDhS78glfJXVTi-9h2lYyS21TYWTl4BnRqDYwKQnaQmn9MP37_RekeGTRlmjHbRixR2kFpo9A4Ae6ZTNUOZe8TOKVCqzqsrHjBicwAH5wnyLE1q7ugRrm8VJNQKydPYoO4E1nJ',
    tag: 'Classic Royal',
    details: {
      allergens: ['Crustaceans', 'Dairy', 'Gluten'],
      pairing: 'Puligny-Montrachet Chardonnay',
      origin: 'Brittany Peninsula'
    }
  },
  {
    id: 'main-2',
    name: 'Dry-Aged Duck Breast',
    description: '21-day dry-aged duck, spiced mountain honey glaze, roasted organic fig, parsnip emulsion.',
    price: 88,
    category: 'main',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCphjS_IibU73u9vMXtOZG60b-m7K9OKzeczwJkdrozq0s9Rz0Pxn8M6XRXRn4g18gpzMutk1t5jGFucwjWBBzfd_q1MCStvi8BD-HxpV-zdhSwuIhNRGiaAplqmkqVIrPVqV7wWPGmeV-yFE5FzW7hVHCyeWm4_shhkixDtDzI1WLCqilNe52X8Rz5oiw6hgmbIq9AuwdpgCclQykLT6IdejDGWNprF61OQxs3u9Xzah_ddD03tCFaO4RpZvAVWs_yeIddow4sAtCn',
    tag: 'Rich',
    details: {
      allergens: ['Sulfites'],
      pairing: 'Gevrey-Chambertin Pinot Noir',
      origin: 'Challans, France'
    }
  },
  {
    id: 'main-3',
    name: 'Venison Wellington',
    description: 'Bespoke puff pastry, wild forest mushroom duxelles, red currant reduction, winter berries.',
    price: 110,
    category: 'main',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuxOO1YDQpqfG8-xF5FPdrOV7t96Au9jOPU1ZclSHZicbSvEpTn5NaoBf2hh8JkdeN-jyo72l3l1wlBQCtOwwGm2yflKafFihvZKqxq7tQdFwzk9HNOl4MhoP_hR16leSrdQ7Odx0oAh77gMSKWpJ4cc_T7WZmPvE_OxcW4cAqdwQzwKqC2s6nAJ2pQBRFhF_sQay_TE8UqhdTpas0EOUO_Wa-G956x_NjSkK3ag32kJgRneKmp0cf-X4fav4ZLlu0BePlng1KJ-KF',
    tag: 'Chef Absolute',
    details: {
      allergens: ['Gluten', 'Eggs', 'Dairy'],
      pairing: 'Margaux Bordeaux Red',
      origin: 'Alsace Forests, France'
    }
  },
  {
    id: 'main-4',
    name: 'Truffle-Infused Risotto',
    description: 'Aged Acquerello carnaroli rice, 36-month Parmigiano-Reggiano, fresh black autumn truffle shavings.',
    price: 75,
    category: 'main',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO7An5YyLrdIAyTdxPy83JGMavGDfr_yNIoHRToBZojYnM3-K0nJmzALN-0CiYxfrgPq1DE2EDocC2iWs66uCw1gYI-JDokmX5bAVRL57VLyk53EfVZzSReNo6YEIpM1s9D4CJsKwpmRjoliOt7L-58lNoFyI49JzzJWPMoqsm6rICGba1MJw9rjV7aZT5X_b8GylZcwRFsNW75S8A7HHjC7PK0OuSosLuu6KCwQ2R-ZGLfsbeOrrJnjmGL-Ndp9ZVg1IfpM-gX4sE',
    tag: 'Course III',
    details: {
      allergens: ['Dairy'],
      pairing: 'Barolo Nebbiolo',
      origin: 'Vercelli Plains, Italy'
    }
  },
  {
    id: 'main-5',
    name: 'Wagyu A5 Filet',
    description: 'Charred over premium binchotan wood, parsnip mousse, natural bone marrow reduction.',
    price: 135,
    category: 'main',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV4Gss0FrhK6D9MD6rFOUzNnxX1fh-5GOIdNCshyDJUmaeQKmmiYlQNlA4LXjE3EuowE8Vaaq68-Eu3xWjM_btqUqHjbNfUzHoreZYZP8v31S5MJHl3sLDyhvKZhTVGtsZcJU2LdHVDEsOqVWwatWWNYAD7T6vPG8Ulo3qS9NIzeVzW51tGbOqMTUF0PNtk2NzDSGxbS_DyFqVG45Mv01LPRQWrJz4w9Zp1-BK5DearMvkFvJb2SAa_DWseUkCr32eD3muKghWKj57',
    tag: 'Course V',
    details: {
      allergens: ['Dairy', 'Sulfites'],
      pairing: 'Pauillac Cabernet Sauvignon',
      origin: 'Miyazaki, Japan'
    }
  },
  // Desserts
  {
    id: 'des-1',
    name: 'Gold Leaf Ganache',
    description: 'Grand Cru Madagascar chocolate ganache, edible gold leaves, Brittany Fleur de Sel, hazelnut soil.',
    price: 38,
    category: 'dessert',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDll-tfp4AMUzjKalVN5Kwn9-Iurybwa_WbpDOxmNkxJwwL7md5Vm0UqP1dSh16DxuSeLqsmUI61Gwmik5RqzpxHVZb--F1P9T2nVITjQS9Dii2zv8ea7z1ylp08J3FA_Ubdx0YLdSsglKZT1-fUkcYTIZ8w5zQBpOTmodHVemKB1LaoVSo2g0DwOGTrg3NJu00-3gqYxs3K9oa8OcwbsBemrPcopaC9lnoGU0zo9yWY1Kn409gqX2tgboGUVkC4XVHs0iDVqGaIkU5',
    tag: 'Opulent',
    details: {
      allergens: ['Nuts', 'Dairy', 'Soy'],
      pairing: 'Sauternes Dessert Wine',
      origin: 'Sambirano Valley'
    }
  },
  {
    id: 'des-2',
    name: 'Tahitian Vanilla Soufflé',
    description: 'Light-as-air baked soufflé, warm Grand Marnier drizzle, chilled Madagascar vanilla bean ice cream.',
    price: 35,
    category: 'dessert',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWIJqItTEgAMH134Dt7fggJ7jOga-0tdpD8HNvOnmkqSb0MX_4QWFXrw6l9eRIy7ZLO3o8CIvdyk2YAUlGihGgRKsN-2sSFkvFJ9S55mnZ3aAdKiGTc5FS7MKCXxAyVfreMxYefEmEf-onJ10TH6U4L20fLL9-cN6vYQQHKJhm_kkip-2CN63bMVabdbjn9O7CPRtdrELmh_LIYuNx39avlmOO4ZBdC7ivcObQYrcU3Bf8XqdhkGF3UQO1MknqMWW9twXIisypgIxn',
    tag: 'Baked Fresh',
    details: {
      allergens: ['Eggs', 'Dairy', 'Gluten'],
      pairing: 'Tawny Port 20 Year',
      origin: 'French Polynesia'
    }
  },
  // Wine Pairings
  {
    id: 'wine-1',
    name: "Sommelier's Flight",
    description: 'A bespoke multi-course arrangement aligning rare white and red vintages curated specifically to your order.',
    price: 120,
    category: 'wine',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCATUhJ3bSgY6VwbjF1P9zxNs6Pz_Nb4xKTNKswPxc7gS5fEAWs4RlVs6F8WC3O9EpdgDT5NDFdVjHzYomMYtWpgINb9_pcp8x79X38xBUCu0ItGqOwuCJBLRL4HprajWerBtcJqGnDhS78glfJXVTi-9h2lYyS21TYWTl4BnRqDYwKQnaQmn9MP37_RekeGTRlmjHbRixR2kFpo9A4Ae6ZTNUOZe8TOKVCqzqsrHjBicwAH5wnyLE1q7ugRrm8VJNQKydPYoO4E1nJ',
    tag: 'Per Guest',
    details: {
      allergens: ['Sulfites'],
      pairing: 'Bespoke alignment',
      origin: 'Global Rare Cellars'
    }
  },
  {
    id: 'wine-2',
    name: 'Prestige Bordeaux Pour',
    description: 'Premium red pairings hailing strictly from classified growths of Bordeaux left bank châteaux.',
    price: 250,
    category: 'wine',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsq-OnSoWAdGFlDQUd5XdQFl7AC5edxiknU570RvyZKjwQmJUJ4UEK-f56MFgpCWVInkQix4ttLOjRMwnKwbnh4dzLi7s7Ym_CTrb5BoMFgrUZO-CE4FZLvG8vEcE-mKNukvJ51ixWHSkMtFZwb7hT1KTkz_mrC9Qews-U_Mj2RU72IvD_UGvPxyLUbiHBVZHIjRH3SJKAILC5Z5GCnxDwi-enZVgifYBWzdK2kjYg5pw-NFkaRf44OGP3uJUC2X0c0fPiaU0gIbnw',
    tag: 'Per Guest',
    details: {
      allergens: ['Sulfites'],
      pairing: 'Rich Meats & Truffles',
      origin: 'Bordeaux, France'
    }
  }
];

export default function Menu({ onAskChef }: MenuProps) {
  const shouldReduce = useReducedMotion();
  const [activeTab, setActiveTab] = useState<'all' | 'appetizer' | 'main' | 'dessert' | 'wine'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesTab = activeTab === 'all' || item.category === activeTab;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.details?.origin && item.details.origin.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#050505]" id="menu-view">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" id="menu-header">
          <span className="font-mono text-xs text-amber-500/60 tracking-widest block mb-4">THE SEASONAL SELECTION</span>
          <h1 className="font-display text-4xl sm:text-6xl text-white tracking-[0.2em] uppercase font-light">
            Seasonal Menu
          </h1>
          <p className="font-serif italic text-neutral-400 mt-4 text-sm sm:text-base leading-relaxed">
            An evolving, poetic canvas structured around the finest ingredients harvested this week. Subject to subtle, daily adaptations by Chef Julien Renard.
          </p>
          <div className="h-[1px] w-12 bg-amber-500/40 mx-auto mt-8" />
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-10 border-b border-white/5 mb-12">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3" id="menu-tabs">
            {(['all', 'appetizer', 'main', 'dessert', 'wine'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`relative font-display text-[10px] tracking-[0.2em] uppercase px-5 py-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.96] ${
                  activeTab === category
                    ? 'border-amber-500/60 text-amber-300 font-semibold'
                    : 'border-white/5 hover:border-white/20 text-neutral-400 hover:text-white'
                }`}
                id={`tab-${category}`}
                aria-label={`Filter by ${category}`}
              >
                <span className="relative z-10">{category === 'all' ? 'All Masterpieces' : `${category}s`}</span>
                {activeTab === category && (
                  <motion.span
                    layoutId="activeMenuTab"
                    className="absolute inset-0 bg-amber-950/20"
                    transition={{ duration: shouldReduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-amber-400 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ingredients, origin..."
              className="w-full bg-[#0c0c0c] border border-white/5 focus:border-amber-500/50 pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-500/35 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/15 focus:shadow-[0_0_20px_rgba(245,158,11,0.05)]"
              id="menu-search-input"
              aria-label="Search items"
            />
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12" id="menu-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col sm:flex-row bg-[#080808] border border-white/5 hover:border-amber-500/20 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              id={`menu-item-${item.id}`}
            >
              {/* Picture */}
              <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden min-h-40 bg-neutral-950">
                <div className={`absolute inset-0 bg-gradient-to-br from-neutral-950 via-amber-950/15 to-neutral-950 animate-pulse transition-opacity duration-[1000ms] z-10 ${imagesLoaded[item.id] ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
                <img
                  src={item.image}
                  alt={item.name}
                  onLoad={() => setImagesLoaded(prev => ({ ...prev, [item.id]: true }))}
                  className={`w-full h-full object-cover grayscale brightness-[0.85] contrast-[1.05] group-hover:grayscale-0 transition-all duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    imagesLoaded[item.id] ? 'opacity-100 scale-100' : 'opacity-0 scale-103'
                  } group-hover:scale-[1.02] group-hover:brightness-100`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                {item.tag && (
                  <span className="absolute top-3 left-3 bg-black/90 text-amber-400 font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 border border-amber-500/10 z-20">
                    {item.tag}
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display text-base sm:text-lg text-white tracking-widest uppercase group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h3>
                    <span className="font-display text-base text-amber-400/90 ml-4 font-light">
                      ${item.price}
                    </span>
                  </div>

                  <p className="text-neutral-400 font-sans font-light text-xs sm:text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                    className="flex items-center space-x-1.5 text-[10px] tracking-widest uppercase text-neutral-500 hover:text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.96] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-sm"
                    id={`details-btn-${item.id}`}
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{selectedItem?.id === item.id ? 'Close Details' : 'View Elements'}</span>
                  </button>

                  <button
                    onClick={() => onAskChef(`Hello Chef Renard. Can you share the culinary concept, preparation details, and recommended wine alignment for your legendary "${item.name}"?`)}
                    className="flex items-center space-x-1.5 bg-[#0e0e0e] hover:bg-amber-950/25 border border-white/5 hover:border-amber-500/30 text-amber-400/90 hover:text-amber-300 px-3 py-1.5 text-[9px] tracking-widest uppercase transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.96] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 rounded-sm"
                    id={`ask-chef-btn-${item.id}`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Discuss with Chef</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-20 bg-[#090909] border border-white/5">
              <Utensils className="w-8 h-8 text-neutral-600 mx-auto mb-4" />
              <p className="font-serif italic text-neutral-400 text-sm">
                No items align with your active parameters.
              </p>
              <button
                onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                className="mt-4 font-display text-[10px] tracking-widest uppercase text-amber-400 underline hover:text-white transition-all duration-300 ease-out active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 rounded-sm px-1.5"
              >
                Reset Parameters
              </button>
            </div>
          )}
        </div>

        {/* Selected Item Elements Panel Drawer/Modal overlay */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
              id="item-details-modal"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: shouldReduce ? 0 : 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: shouldReduce ? 0 : 15 }}
                transition={{ duration: shouldReduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#0b0b0b] border border-amber-500/20 max-w-md w-full p-8 space-y-6 relative rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              >
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 text-neutral-500 hover:text-white font-mono text-[10px] tracking-widest uppercase transition-all duration-300 ease-out active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-sm px-1"
                  aria-label="Close details"
                >
                  CLOSE [X]
                </button>

                <div className="space-y-2">
                  <span className="font-mono text-[9px] text-amber-500/60 tracking-widest uppercase block">CURATED ELEMENTARY VALUES</span>
                  <h3 className="font-display text-xl text-white tracking-widest uppercase">{selectedItem.name}</h3>
                  <p className="font-serif italic text-xs text-neutral-400">{selectedItem.description}</p>
                </div>

                <div className="space-y-4 border-t border-white/5 pt-4">
                  {selectedItem.details?.origin && (
                    <div>
                      <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase block">PROVENANCE / ORIGIN</span>
                      <span className="text-xs text-white font-light">{selectedItem.details.origin}</span>
                    </div>
                  )}

                  {selectedItem.details?.pairing && (
                    <div>
                      <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase block">RECOMMENDED PAIRING</span>
                      <span className="text-xs text-amber-400 font-light">{selectedItem.details.pairing}</span>
                    </div>
                  )}

                  {selectedItem.details?.allergens && selectedItem.details.allergens.length > 0 && (
                    <div>
                      <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase block">ALLERGENS PRESENT</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedItem.details.allergens.map((alg) => (
                          <span key={alg} className="bg-neutral-900 border border-white/5 text-[9px] text-neutral-400 px-2 py-0.5">
                            {alg}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      const item = selectedItem;
                      setSelectedItem(null);
                      onAskChef(`Hello Chef Renard. Can you tell me about the sourcing provenance of ingredients and dietary considerations for your exquisite "${item.name}"?`);
                    }}
                    className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-display tracking-widest uppercase py-3.5 transition-all duration-300 ease-out active:scale-[0.985] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50"
                  >
                    Ask Chef About Sourcing
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
