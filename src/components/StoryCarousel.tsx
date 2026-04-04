import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Loader2 } from 'lucide-react';
import { Moment } from '../types';

interface StoryCarouselProps {
  moments: Moment[];
  selectedIndex: number | null;
  isPreparing: boolean;
  direction: number;
  onClose: () => void;
  onPaginate: (direction: number) => void;
}

export const StoryCarousel: React.FC<StoryCarouselProps> = ({
  moments,
  selectedIndex,
  isPreparing,
  direction,
  onClose,
  onPaginate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') onPaginate(1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') onPaginate(-1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onPaginate, onClose]);

  useEffect(() => {
    if (selectedIndex === null || isPreparing) return;
    
    const timer = setInterval(() => {
      onPaginate(1);
    }, 3000);
    
    return () => clearInterval(timer);
  }, [selectedIndex, isPreparing, onPaginate]);

  return (
    <AnimatePresence>
      {isPreparing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center text-brand-gold"
        >
          <Loader2 className="w-10 h-10 animate-spin" />
        </motion.div>
      )}

      {selectedIndex !== null && !isPreparing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center"
        >
          {/* Story Container */}
          <div className="relative w-[96vw] md:w-auto md:h-[88vh] max-w-[800px] aspect-[3/4] rounded-[1.2rem] md:rounded-[2rem] overflow-hidden bg-zinc-900 flex items-center justify-center shadow-2xl">
            
            {/* Story Progress Bar (Single) */}
            <div className="absolute top-4 inset-x-4 z-[220] h-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300 ease-out"
                style={{ width: `${((selectedIndex + 1) / moments.length) * 100}%` }}
              />
            </div>

            {/* Close Button */}
            <button onClick={onClose} className="absolute top-8 right-4 z-[220] text-white drop-shadow-md p-2 bg-black/20 rounded-full backdrop-blur-sm">
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Areas (Invisible, for tapping like stories) */}
            <div className="absolute inset-x-0 top-0 h-1/2 z-[210] cursor-pointer" onClick={(e) => { e.stopPropagation(); onPaginate(-1); }} />
            <div className="absolute inset-x-0 bottom-0 h-1/2 z-[210] cursor-pointer" onClick={(e) => { e.stopPropagation(); onPaginate(1); }} />

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ perspective: 1200 }}>
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={selectedIndex}
                  src={moments[selectedIndex].url}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({ 
                      x: dir > 0 ? '-100%' : '100%',
                      y: dir > 0 ? '100%' : '-100%', 
                      rotate: dir > 0 ? -15 : 15,
                      scale: 0.4,
                      opacity: 0,
                      zIndex: 0,
                    }),
                    center: { 
                      zIndex: 1, 
                      x: 0,
                      y: 0, 
                      rotate: 0,
                      scale: 1,
                      opacity: 1,
                    },
                    exit: (dir: number) => ({ 
                      zIndex: 0, 
                      x: dir > 0 ? '100%' : '-100%',
                      y: dir > 0 ? '-100%' : '100%', 
                      rotate: dir > 0 ? 15 : -15,
                      scale: 0.4,
                      opacity: 0,
                    })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset }) => {
                    const swipe = offset.y;
                    if (swipe > 50) {
                      onPaginate(1);
                    } else if (swipe < -50) {
                      onPaginate(-1);
                    }
                  }}
                  className="absolute inset-0 w-full h-full object-cover select-none cursor-grab active:cursor-grabbing"
                  draggable={false}
                />
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
