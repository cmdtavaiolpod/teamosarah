import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Moment } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Gallery() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMoments();
  }, []);

  const fetchMoments = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('moments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMoments(data || []);
    } catch (error) {
      console.error('Error fetching moments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black selection:bg-brand-gold/30 p-6 md:p-12 text-white">
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-24">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 text-brand-gold hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[12px] uppercase tracking-[0.3em] font-medium">Voltar</span>
        </button>
        
        <div className="text-center">
          <h1 className="serif text-5xl md:text-7xl text-brand-gold">Galeria da Sarah</h1>
          <p className="text-brand-gold/60 text-[12px] uppercase tracking-[0.4em] mt-4">Cada momento, uma história</p>
        </div>

        <div className="w-20 hidden md:block" />
      </header>

      <main className="max-w-6xl mx-auto">
        {!supabase && (
          <div className="bg-brand-wine/20 border border-brand-wine/30 p-6 rounded-3xl text-center mb-12">
            <p className="text-brand-gold text-sm">
              As configurações do banco de dados estão faltando. Por favor, configure as variáveis de ambiente no menu Settings.
            </p>
          </div>
        )}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-brand-gold text-[10px] uppercase tracking-widest">Carregando memórias...</p>
          </div>
        ) : moments.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {moments.map((moment) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="break-inside-avoid group relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <img 
                  src={moment.url} 
                  alt={moment.title} 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                  <h3 className="serif text-2xl mb-2">{moment.title}</h3>
                  <p className="text-xs text-white/80 leading-relaxed">{moment.caption}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-brand-gold fill-brand-gold" />
                    <span className="text-[10px] uppercase tracking-widest text-brand-gold">Eternizado</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 space-y-6">
            <div className="flex justify-center">
              <Heart className="w-12 h-12 text-brand-gold/20" />
            </div>
            <p className="text-brand-gold/60 text-sm italic">Nenhuma memória adicionada ainda.</p>
            <button 
              onClick={() => navigate('/adicionar')}
              className="px-8 py-3 rounded-full bg-brand-gold text-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all"
            >
              Adicionar Primeiro Momento
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto mt-32 pt-12 border-t border-brand-gold/10 text-center pb-32">
        <p className="text-brand-gold/40 text-[10px] uppercase tracking-[0.3em]">Feito com amor para você</p>
        <div className="mt-8">
          <button 
            onClick={() => navigate('/admin')}
            className="text-[9px] uppercase tracking-[0.4em] text-gray-800 hover:text-brand-gold transition-colors"
          >
            Admin
          </button>
        </div>
      </footer>

      {/* Floating Spotify Player */}
      <div className="fixed bottom-6 right-6 z-50 w-[300px] md:w-[350px] shadow-2xl rounded-xl overflow-hidden border border-brand-gold/20 bg-black/80 backdrop-blur-xl">
        <iframe 
          style={{ borderRadius: '12px' }} 
          src="https://open.spotify.com/embed/track/3ydmNkAyYq0AKtG8sTfE9P?utm_source=generator&theme=0" 
          width="100%" 
          height="80" 
          frameBorder="0" 
          allowFullScreen 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
