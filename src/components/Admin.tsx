import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Trash2, Plus, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Moment } from '../types';

const Admin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1104') {
      setIsAuthorized(true);
      fetchMoments();
    } else {
      alert('Senha incorreta!');
    }
  };

  const fetchMoments = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('moments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Momentos buscados:', data);
      setMoments(data || []);
    } catch (error) {
      console.error('Error fetching moments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    console.log('Botão de excluir clicado para ID:', id);
    
    try {
      setLoading(true);
      // Usamos .select() para confirmar se a linha foi realmente deletada
      const { data, error } = await supabase
        .from('moments')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error('Erro Supabase ao excluir:', error);
        alert(`Erro do Banco: ${error.message}`);
        return;
      }
      
      if (!data || data.length === 0) {
        console.warn('Nenhuma linha foi deletada. Verifique as políticas de RLS no Supabase.');
        alert('O banco de dados não permitiu a exclusão. Verifique se as políticas de segurança (RLS) do Supabase permitem "DELETE" para usuários anônimos.');
        return;
      }
      
      console.log('Sucesso ao excluir. Dados retornados:', data);
      
      // Atualiza o estado local removendo o item
      setMoments(prev => prev.filter(m => m.id !== id));
      alert('Momento removido com sucesso! ✨');
    } catch (err: any) {
      console.error('Erro inesperado ao excluir:', err);
      alert(`Erro inesperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-zinc-900/50 p-8 rounded-[2rem] border border-brand-gold/20 backdrop-blur-xl text-center space-y-8"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-brand-gold" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="serif text-3xl">Área Restrita</h1>
            <p className="text-brand-gold text-[10px] uppercase tracking-[0.2em]">Insira a senha para acessar</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full bg-black/50 border border-brand-gold/20 rounded-2xl px-4 py-3 text-center focus:outline-none focus:border-brand-gold transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-brand-gold text-black font-medium py-3 rounded-2xl hover:bg-white transition-colors"
            >
              Acessar
            </button>
          </form>
          <button onClick={() => navigate('/')} className="text-gray-500 text-xs hover:text-white transition-colors">
            Voltar para o Início
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-brand-gold" />
            </button>
            <div>
              <h1 className="serif text-4xl">Painel Admin</h1>
              <p className="text-brand-gold text-[10px] uppercase tracking-[0.2em]">Gerencie os momentos da Sarah</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/adicionar')}
            className="flex items-center justify-center gap-2 bg-brand-gold text-black px-6 py-3 rounded-2xl font-medium hover:bg-white transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Adicionar Novo</span>
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {moments.map((moment) => (
              <div key={moment.id} className="group relative bg-zinc-900/30 rounded-3xl overflow-hidden border border-white/5 hover:border-brand-gold/30 transition-all">
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={moment.url} 
                    alt={moment.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium truncate">{moment.title}</h3>
                    <p className="text-[10px] text-gray-500 truncate">{moment.caption || 'Sem legenda'}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(moment.id)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {moments.length === 0 && !loading && (
          <div className="text-center py-20 space-y-4">
            <p className="text-gray-500">Nenhum momento encontrado.</p>
            <button
              onClick={() => navigate('/adicionar')}
              className="text-brand-gold hover:underline"
            >
              Adicionar o primeiro momento
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
