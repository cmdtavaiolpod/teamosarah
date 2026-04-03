import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ChevronUp } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EnvelopeOverlayProps {
  isOpen: boolean;
  onOpen: () => void;
}

const EnvelopeOverlay: React.FC<EnvelopeOverlayProps> = ({ isOpen, onOpen }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleReveal = () => {
    setIsAnimating(true);
    
    // Confetti from the envelope
    setTimeout(() => {
      const duration = 2000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 90,
          spread: 80,
          origin: { x: 0.5, y: 0.6 },
          colors: ['#D8B4FE', '#A855F7', '#FFFFFF', '#FCD34D'],
          zIndex: 1000,
          startVelocity: 45
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }, 400);

    // Call onOpen after the animation sequence finishes
    setTimeout(() => {
      onOpen();
    }, 4000); // 4 seconds to read the card before fading out
  };

  const handleDragEnd = (e: any, info: any) => {
    if (isAnimating) return;
    // Se arrastou para cima mais de 40px ou com velocidade rápida
    if (info.offset.y < -40 || info.velocity.y < -200) {
      handleReveal();
    }
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[800px] h-[800px] bg-brand-wine rounded-full blur-[150px] opacity-20"></div>
          </div>

          {/* Text above envelope */}
          <motion.div 
            className="mb-12 text-center z-40 px-4 relative pointer-events-none"
            animate={isAnimating ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="serif text-4xl md:text-5xl text-brand-gold mb-4 tracking-tight">Um presente está escondido aqui...</h2>
            <p className="text-brand-gold/60 text-xs md:text-sm uppercase tracking-[0.2em] mb-8">Arraste o envelope para cima para abrir</p>
            
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="flex justify-center text-brand-gold/80"
            >
              <ChevronUp className="w-8 h-8" />
            </motion.div>
          </motion.div>

          {/* Envelope Container */}
          <motion.div 
            className="relative w-[340px] h-[220px] md:w-[520px] md:h-[320px] drop-shadow-2xl cursor-grab active:cursor-grabbing"
            drag={!isAnimating ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* Back of envelope (Inside) */}
            <div className="absolute inset-0 bg-[#e4e4e7] rounded-2xl shadow-inner overflow-hidden">
              <div className="absolute inset-0 opacity-50 bg-gradient-to-b from-black/20 to-transparent"></div>
            </div>
            
            {/* Card inside */}
            <motion.div 
              className="absolute left-6 right-6 bottom-6 top-6 bg-gradient-to-b from-zinc-900 to-black rounded-xl shadow-2xl flex flex-col items-center justify-center p-6 text-center z-10 border border-brand-gold/20"
              initial={{ y: 0 }}
              animate={isAnimating ? { y: -200 } : { y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent opacity-50"></div>
              <h2 className="serif text-3xl md:text-4xl text-white mb-2">Para Sarah</h2>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-gold mb-6">Feliz Aniversário</p>
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center border border-brand-gold/20">
                <Heart className="w-5 h-5 text-brand-gold fill-brand-gold animate-pulse" />
              </div>
            </motion.div>

            {/* Envelope Flaps (SVG) */}
            <svg width="100%" height="100%" viewBox="0 0 520 320" preserveAspectRatio="none" className="absolute inset-0 z-20 pointer-events-none overflow-visible">
              <defs>
                <linearGradient id="grad-left" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient id="grad-right" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient id="grad-bottom" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#f1f5f9" />
                </linearGradient>
                <filter id="shadow-side" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodOpacity="0.08" floodColor="#000" />
                </filter>
                <filter id="shadow-bottom" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="-4" stdDeviation="6" floodOpacity="0.12" floodColor="#000" />
                </filter>
              </defs>
              
              {/* Left Flap */}
              <polygon points="0,0 260,160 0,320" fill="url(#grad-left)" stroke="url(#grad-left)" strokeWidth="10" strokeLinejoin="round" filter="url(#shadow-side)" />
              
              {/* Right Flap */}
              <polygon points="520,0 260,160 520,320" fill="url(#grad-right)" stroke="url(#grad-right)" strokeWidth="10" strokeLinejoin="round" filter="url(#shadow-side)" />
              
              {/* Bottom Flap */}
              <polygon points="0,320 260,150 520,320" fill="url(#grad-bottom)" stroke="url(#grad-bottom)" strokeWidth="10" strokeLinejoin="round" filter="url(#shadow-bottom)" />
            </svg>

            {/* Top flap */}
            <motion.div 
              className="absolute inset-0 origin-top"
              initial={{ rotateX: 0, zIndex: 30 }}
              animate={isAnimating ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 30 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <svg width="100%" height="100%" viewBox="0 0 520 320" preserveAspectRatio="none" className="absolute inset-0 overflow-visible">
                <defs>
                  <linearGradient id="grad-top" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#f1f5f9" />
                  </linearGradient>
                  <filter id="shadow-top" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.15" floodColor="#000" />
                  </filter>
                </defs>
                <polygon points="0,0 520,0 260,170" fill="url(#grad-top)" stroke="url(#grad-top)" strokeWidth="10" strokeLinejoin="round" filter="url(#shadow-top)" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnvelopeOverlay;
