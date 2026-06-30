import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface ConciergeProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string | null;
}

export default function Concierge({ isOpen, onClose, initialMessage }: ConciergeProps) {
  const shouldReduce = useReducedMotion();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Greetings. I am Julien Renard, your Executive Chef at Maison Noir. Speak to me of seasonal sourcing, delicate wine pairings, or seating seclusion. How may I elevate your evening?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState<number>(0);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [lastPrompt, setLastPrompt] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle external initialization questions (e.g. Discuss Pairing)
  useEffect(() => {
    if (initialMessage && isOpen) {
      handleSend(initialMessage);
    }
  }, [initialMessage, isOpen]);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleRetryClick = () => {
    if (lastPrompt) {
      handleSend(lastPrompt);
    }
  };

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    setError(null);
    setInputText('');
    setLastPrompt(trimmed);

    // Append user message if it's not a retry of the same message that's already at the tail
    let updatedHistory = [...messages];
    const lastMsg = messages[messages.length - 1];
    const isRetry = lastMsg && lastMsg.role === 'user' && lastMsg.text === trimmed;

    if (!isRetry) {
      const userMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'user',
        text: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      updatedHistory = [...messages, userMsg];
      setMessages(updatedHistory);
    }

    setLoading(true);

    const historyForApi = updatedHistory.map(m => ({ role: m.role, text: m.text }));
    let success = false;
    let modelResponseText = '';
    let attempt = 1;

    const executeRequestWithTimeout = async (currentAttempt: number): Promise<string> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 20000); // 20-second timeout handling

      try {
        setLoadingStatus(
          currentAttempt === 1
            ? "JULIEN RENARD IS REFLECTING..."
            : `RE-CONNECTING TO CHEF (ATTEMPT ${currentAttempt} OF 3)...`
        );

        const response = await fetch('/api/concierge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: historyForApi }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || "Chef request not successful");
        }

        return data.text;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    };

    while (attempt <= 3) {
      try {
        modelResponseText = await executeRequestWithTimeout(attempt);
        success = true;
        break;
      } catch (err) {
        console.warn(`Attempt ${attempt} failed:`, err);
        if (attempt < 3) {
          const backoffMs = attempt === 1 ? 2000 : 4000; // Exponential backoff: 2s, then 4s
          let secondsLeft = backoffMs / 1000;
          while (secondsLeft > 0) {
            setLoadingStatus(`KITCHEN BUSY. RETRYING IN ${secondsLeft.toFixed(1)}S...`);
            await delay(100);
            secondsLeft -= 0.1;
          }
          attempt++;
        } else {
          break;
        }
      }
    }

    if (success) {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          role: 'model',
          text: modelResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setError(null);
    } else {
      setError("Julien Renard is momentarily unavailable.");
      
      // Friendly fallback message from the Maison Noir Concierge
      setMessages(prev => [
        ...prev,
        {
          id: 'fallback-' + Math.random().toString(36).substring(2, 9),
          role: 'model',
          text: "Maison Noir Concierge:\n\nWhile Chef Julien's digital liaison is briefly at rest, our hosting team is delighted to guide your selection. Tonight, we recommend exploring our signature **Aged Venison Wellington** and **Truffled Langoustine** within the **Menu** collection.\n\nShould you wish to secure your private table or specify culinary requirements, please request an invitation under the **Reservations** tab. We await your presence with anticipation.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }

    setLoading(false);
    setLoadingStatus('');
  };

  const sampleQuestions = [
    "What wine pairs with the Venison Wellington?",
    "Which appetizers are gluten-free?",
    "Recommend a venue for an anniversary.",
    "Describe your 'Minimalist Intensity' philosophy."
  ];

  // Helper to safely display Chef responses with basic line break formatting
  const formatChefText = (text: string) => {
    return text.split('\n').map((paragraph, index) => {
      if (!paragraph.trim()) return <div key={index} className="h-2" />;
      
      // Simple markdown bold formatting **word**
      let parts: React.ReactNode[] = [paragraph];
      const boldRegex = /\*\*(.*?)\*\*/g;
      const matches = [...paragraph.matchAll(boldRegex)];
      
      if (matches.length > 0) {
        const renderParts: React.ReactNode[] = [];
        let lastIndex = 0;
        matches.forEach((match, mIdx) => {
          const matchIndex = match.index ?? 0;
          if (matchIndex > lastIndex) {
            renderParts.push(paragraph.substring(lastIndex, matchIndex));
          }
          renderParts.push(<strong key={mIdx} className="text-amber-400 font-bold">{match[1]}</strong>);
          lastIndex = matchIndex + match[0].length;
        });
        if (lastIndex < paragraph.length) {
          renderParts.push(paragraph.substring(lastIndex));
        }
        parts = renderParts;
      }

      // If it looks like a bullet point
      if (paragraph.trim().startsWith('*') || paragraph.trim().startsWith('-')) {
        return (
          <p key={index} className="pl-4 relative text-neutral-300 text-xs sm:text-sm font-sans font-light leading-relaxed my-1">
            <span className="absolute left-0 text-amber-500">•</span>
            {parts}
          </p>
        );
      }

      return (
        <p key={index} className="text-neutral-300 text-xs sm:text-sm font-sans font-light leading-relaxed mb-3">
          {parts}
        </p>
      );
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-xs"
          id="ai-concierge-panel"
        >
          {/* Drawer Container */}
          <motion.div
            initial={{ x: shouldReduce ? 0 : '100%', opacity: shouldReduce ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: shouldReduce ? 0 : '100%', opacity: shouldReduce ? 0 : 1 }}
            transition={{ duration: shouldReduce ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg bg-[#070707] border-l border-white/5 h-full flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a]">
              <div className="flex items-center space-x-3.5">
                <div className="relative">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVNd1Q0ZMUbkLkDpr-HQLL2jC9VEV7Hi74pkg5w16bwFheyMGtLOGsJ22WGXAta3UDCCNu8aptf77bOT30xmC-p4etLvsuZIJSCPXrpUPyGBCKNRRAb9lapXLki-6uwLeDF-aQgSSs18MMTB5lEOmKiGfyh4b3l344nffUk80NMehfnese9GhTRbphSkNPemMSu-e5srEQuLvNINImuPiPGkIci2ShVPWJhgsVfHuBYY9V3gwddDI2rjHf1DR7vlS5FMp3z9tsum3n"
                    alt="Chef Julien Renard portrait"
                    className="w-10 h-10 object-cover rounded-none grayscale border border-amber-500/20"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-amber-500 border-2 border-[#070707] rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display text-xs tracking-widest text-white uppercase font-bold">Julien Renard AI</h3>
                  <p className="font-sans text-[9px] text-neutral-500 tracking-wider uppercase font-semibold">Chef's Concierge</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-neutral-500 hover:text-white transition-all duration-300 ease-out active:scale-90 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-sm"
                id="close-concierge-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" id="chat-feed-box">
              
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  id={`chat-bubble-${msg.id}`}
                >
                  <div className="flex items-center space-x-2 mb-1.5 font-mono text-[9px] text-neutral-500 tracking-wider uppercase">
                    <span>{msg.role === 'user' ? 'GUEST' : 'CHEF JULIEN RENARD'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className={`p-4 max-w-[85%] border ${
                    msg.role === 'user'
                      ? 'bg-neutral-900 border-white/5 text-white'
                      : 'bg-amber-950/10 border-amber-500/10 text-neutral-300'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="text-xs sm:text-sm font-sans font-light leading-relaxed">{msg.text}</p>
                    ) : (
                      formatChefText(msg.text)
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Loading Indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-start"
                  id="chat-typing-indicator"
                >
                  <div className="flex items-center space-x-2 mb-1.5 font-mono text-[9px] text-neutral-500 tracking-widest uppercase">
                    <span>{loadingStatus || 'CHEF RENARD IS TYPING...'}</span>
                  </div>
                  <div className="bg-amber-950/5 border border-amber-500/5 p-4 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-200" />
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-300" />
                  </div>
                </motion.div>
              )}

              {/* Refined Luxury Hospitality Error & Retry */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: shouldReduce ? 0 : 0.4 }}
                    className="p-5 bg-amber-950/5 border border-amber-500/10 text-neutral-300 text-xs font-sans space-y-4"
                    id="concierge-error-fallback"
                  >
                    <div className="flex items-start space-x-3.5">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="space-y-1.5">
                        <p className="font-display text-[10px] tracking-[0.2em] text-white uppercase font-bold">
                          A Culinary Intermission
                        </p>
                        <p className="font-sans font-light leading-relaxed text-neutral-400">
                          Julien Renard is momentarily unavailable.<br />
                          Our concierge is preparing your personalized dining experience.<br />
                          Please try again in a few moments.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end pt-3 border-t border-white/5">
                      <button
                        type="button"
                        onClick={handleRetryClick}
                        className="bg-amber-400 hover:bg-amber-300 text-black px-4 py-2 font-display text-[9px] tracking-widest uppercase font-bold transition-all duration-300 ease-out active:scale-95 cursor-pointer focus-visible:outline-none"
                      >
                        Try Again
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Quick Chips */}
            <div className="px-6 py-3 border-t border-white/5 bg-[#090909]">
              <span className="font-mono text-[8px] text-neutral-500 tracking-widest uppercase block mb-2 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-amber-500" />
                <span>Consulting Prompts</span>
              </span>
              <div className="flex flex-wrap gap-2" id="concierge-chips">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    disabled={loading}
                    onClick={() => handleSend(q)}
                    className="text-[10px] tracking-normal text-left font-sans text-neutral-400 hover:text-amber-300 bg-[#121212] hover:bg-amber-950/10 border border-white/5 hover:border-amber-500/20 p-2 py-1.5 transition-all duration-300 ease-out cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/30 rounded-sm"
                    id={`chip-${idx}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Inputs */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
              className="p-6 border-t border-white/5 bg-[#0a0a0a] flex items-center space-x-3"
              id="concierge-input-form"
            >
              <input
                type="text"
                disabled={loading}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Address Chef Renard..."
                className="flex-1 bg-[#050505] border border-white/5 p-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-300"
                id="chat-text-input"
              />
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="p-3 bg-amber-400 hover:bg-amber-300 disabled:bg-neutral-900 disabled:text-neutral-700 text-black cursor-pointer transition-all duration-300 ease-out active:scale-[0.93] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                id="chat-send-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
