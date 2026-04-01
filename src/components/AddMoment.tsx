import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Camera, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddMoment: React.FC = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!supabase) {
      setMessage('Erro: Supabase não configurado. Verifique as variáveis de ambiente.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('moments')
        .insert([{ 
          url, 
          title, 
          caption, 
          type: 'image', 
          created_at: new Date().toISOString() 
        }]);

      if (error) throw error;

      setMessage('Momento adicionado com sucesso! ✨');
      setUrl('');
      setCaption('');
    } catch (err: any) {
      setMessage(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-zinc-900/50 p-8 rounded-[2rem] border border-brand-gold/20 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-brand-gold hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <Camera className="w-8 h-8 text-brand-gold" />
          <div className="w-6" />
        </div>

        <div className="text-center space-y-2">
          <h1 className="serif text-3xl">Novo Momento</h1>
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.2em]">Adicione uma nova memória</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-2">Título do Momento</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Viagem para a Praia"
              className="w-full bg-black/50 border border-brand-gold/20 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-2">URL da Imagem</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
              className="w-full bg-black/50 border border-brand-gold/20 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-2">Legenda (Opcional)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Um momento especial..."
              className="w-full bg-black/50 border border-brand-gold/20 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold text-black font-medium py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Adicionando...' : (
              <>
                <Send className="w-4 h-4" />
                <span>Adicionar Momento</span>
              </>
            )}
          </button>

          {message && (
            <p className={`text-center text-xs ${message.includes('Erro') ? 'text-red-400' : 'text-brand-gold'}`}>
              {message}
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
};
