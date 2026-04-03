import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Music, Camera, Heart, Share2, Cake, Play, Pause } from 'lucide-react';
import confetti from 'canvas-confetti';
import SpecialMessage from './SpecialMessage';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Moment } from '../types';
import EnvelopeOverlay from './EnvelopeOverlay';

export default function Home() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMoments();
  }, []);

  useEffect(() => {
    if (!isEnvelopeOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isEnvelopeOpen]);

  const handleReveal = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
    }
  };

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpen(true);
    
    // Initial sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.play().catch(e => console.log("Audio play blocked:", e));

    // Initial confetti blast
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D8B4FE', '#A855F7', '#FFFFFF']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D8B4FE', '#A855F7', '#FFFFFF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const fetchMoments = async () => {
    if (!supabase) return;
    
    const { data, error } = await supabase
      .from('moments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) {
      console.error('Error fetching moments:', error);
    } else {
      setMoments(data || []);
    }
  };

  const triggerConfetti = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.play().catch(e => console.log("Audio play blocked:", e));

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors: ['#D8B4FE', '#A855F7', '#FFFFFF'] };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleShare = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.play().catch(e => console.log("Audio play blocked:", e));

    if (navigator.share) {
      navigator.share({
        title: "Feliz Aniversário Sarah!",
        text: `Fiz uma surpresa especial para o seu aniversário!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  return (
    <div className="min-h-screen bg-black selection:bg-purple-500/30 relative overflow-x-hidden text-white">
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/music/preview/mixkit-romantic-acoustic-guitar-and-piano-606.mp3"
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <EnvelopeOverlay isOpen={isEnvelopeOpen} onOpen={handleOpenEnvelope} onReveal={handleReveal} />
      
      {/* Floating Confetti Button */}
      <button
        onClick={triggerConfetti}
        className="fixed bottom-8 right-8 z-50 group flex items-center justify-center w-16 h-16 bg-purple-300 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95"
      >
        <span className="text-3xl">🎉</span>
        <div className="absolute inset-0 rounded-full border-2 border-purple-300 animate-ping opacity-20" />
      </button>

      {/* Hero Section */}
      <header className="relative h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center"
          >
            <Cake className="w-14 h-14 text-purple-300 mb-8 animate-float" />
            <span className="text-[12px] uppercase tracking-[0.6em] text-purple-300/80 font-medium">
              Hoje é o seu dia
            </span>
            <h1 className="serif text-6xl md:text-8xl mt-4 text-purple-300 font-light tracking-tight leading-none">
              Feliz Aniversário<br />
              <span className="block mt-2">Sarah!</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-4 w-full max-w-[200px]">
              <div className="h-px flex-1 bg-purple-300/20" />
              <Heart className="w-4 h-4 fill-purple-300 text-purple-300" />
              <div className="h-px flex-1 bg-purple-300/20" />
            </div>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-purple-300 hover:text-white transition-colors"
            >
              <Share2 className="w-3 h-3" />
              Compartilhar Celebração
            </button>
          </motion.div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-24 space-y-32 relative z-10">
        <SpecialMessage />

        <section className="space-y-12">
          <div className="text-center">
            <h2 className="serif text-4xl mb-3">Trilha Sonora</h2>
            <p className="text-brand-gold text-xs uppercase tracking-[0.3em]">Uma música para celebrar</p>
          </div>
          <div className="max-w-md mx-auto bg-zinc-900/80 border border-purple-500/20 p-6 rounded-3xl flex items-center gap-6 shadow-xl">
            <button
              onClick={togglePlay}
              className="w-14 h-14 shrink-0 bg-purple-500 rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg shadow-purple-500/20"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
            <div className="flex-1">
              <h3 className="text-purple-200 font-medium text-lg">Nossa Música</h3>
              <p className="text-purple-300/60 text-sm">Acoustic Romance</p>
            </div>
            {isPlaying && (
              <div className="flex gap-1.5 items-end h-8">
                <motion.div animate={{ height: ["20%", "80%", "20%"] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} className="w-1.5 bg-purple-400 rounded-full" />
                <motion.div animate={{ height: ["40%", "100%", "40%"] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="w-1.5 bg-purple-400 rounded-full" />
                <motion.div animate={{ height: ["30%", "70%", "30%"] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} className="w-1.5 bg-purple-400 rounded-full" />
              </div>
            )}
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center">
            <h2 className="serif text-4xl mb-3">Galeria</h2>
            <p className="text-brand-gold text-xs uppercase tracking-[0.3em]">Momentos especiais capturados</p>
          </div>

          {!supabase && (
            <div className="bg-brand-wine/20 border border-brand-wine/30 p-6 rounded-3xl text-center max-w-2xl mx-auto">
              <p className="text-brand-gold text-sm">
                As configurações do banco de dados estão faltando. Por favor, configure as variáveis de ambiente no menu Settings.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moments.length > 0 ? (
              moments.slice(0, 8).map((moment, index) => (
                <div 
                  key={moment.id} 
                  className={`aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg ${index % 2 !== 0 ? 'translate-y-8' : ''}`}
                >
                  <img 
                    src={moment.url} 
                    alt={moment.title || `Moment ${index + 1}`} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                </div>
              ))
            ) : (
              // Fallback static images if no moments in Supabase
              <>
                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800" alt="Moment 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800'; }} />
                </div>
                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg translate-y-8">
                  <img src="https://images.unsplash.com/photo-1516589174184-c685266e4871?auto=format&fit=crop&q=80&w=2000" alt="Moment 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800'; }} />
                </div>
                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=800" alt="Moment 3" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800'; }} />
                </div>
                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg translate-y-8">
                  <img src="https://images.unsplash.com/photo-1516970739312-08b075784b71?auto=format&fit=crop&q=80&w=800" alt="Moment 4" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800'; }} />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center pt-12">
            <button 
              onClick={() => navigate('/galeria')}
              className="px-8 py-3 rounded-full border border-brand-gold text-brand-gold text-[10px] uppercase tracking-[0.3em] hover:bg-brand-gold hover:text-black transition-all duration-300"
            >
              Ver Tudo
            </button>
          </div>
        </section>

        <footer className="text-center pt-32 border-t border-brand-gold/10">
          <div className="flex justify-center gap-8 mb-10">
            <Music className="w-6 h-6 text-brand-gold/40" />
            <Camera className="w-6 h-6 text-brand-gold/40" />
            <Heart className="w-6 h-6 text-brand-gold/40" />
          </div>
          <h2 className="serif text-4xl text-brand-gold mb-4">Parabéns, Sarah!</h2>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 mt-6 max-w-xs mx-auto leading-loose">
            Que este novo ciclo seja repleto de luz, amor e muitas alegrias. Você merece o mundo!
          </p>
          <div className="mt-12">
            <button 
              onClick={() => navigate('/admin')}
              className="text-[9px] uppercase tracking-[0.4em] text-gray-600 hover:text-brand-gold transition-colors"
            >
              Admin
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
