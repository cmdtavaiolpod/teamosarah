import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Camera, ArrowLeft, Send, Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddMoment: React.FC = () => {
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (uploadType === 'file' && file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (uploadType === 'link' && url) {
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, [file, url, uploadType]);

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
      let finalUrl = url;

      if (uploadType === 'file' && file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('moments')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error('Erro ao fazer upload da imagem. Certifique-se de ter criado um bucket público chamado "moments" no Supabase Storage.');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('moments')
          .getPublicUrl(filePath);

        finalUrl = publicUrl;
      } else if (uploadType === 'link' && !url) {
        throw new Error('Por favor, insira a URL da imagem.');
      } else if (uploadType === 'file' && !file) {
        throw new Error('Por favor, selecione uma imagem.');
      }

      const { error } = await supabase
        .from('moments')
        .insert([{ 
          url: finalUrl, 
          title, 
          caption, 
          type: 'image', 
          created_at: new Date().toISOString() 
        }]);

      if (error) throw error;

      setMessage('Momento adicionado com sucesso! ✨');
      setUrl('');
      setFile(null);
      setTitle('');
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

          <div className="space-y-4">
            <div className="flex bg-black/50 p-1 rounded-2xl border border-brand-gold/20">
              <button
                type="button"
                onClick={() => setUploadType('file')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs uppercase tracking-widest transition-colors ${
                  uploadType === 'file' ? 'bg-brand-gold text-black font-medium' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                Dispositivo
              </button>
              <button
                type="button"
                onClick={() => setUploadType('link')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs uppercase tracking-widest transition-colors ${
                  uploadType === 'link' ? 'bg-brand-gold text-black font-medium' : 'text-gray-400 hover:text-white'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                Link
              </button>
            </div>

            {uploadType === 'file' ? (
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-2">Selecione a Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full bg-black/50 border border-brand-gold/20 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-brand-gold file:text-black hover:file:bg-white file:transition-colors"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-2">URL da Imagem</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://exemplo.com/foto.jpg"
                  className="w-full bg-black/50 border border-brand-gold/20 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>
            )}

            {/* Image Preview */}
            {preview && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="relative h-48 w-full rounded-2xl overflow-hidden border border-brand-gold/20 bg-black/50 flex items-center justify-center mt-4"
              >
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-w-full max-h-full object-contain"
                  onError={() => {
                    if (uploadType === 'link') {
                      setPreview(null);
                      setMessage('Erro: A URL da imagem parece ser inválida.');
                    }
                  }}
                />
              </motion.div>
            )}
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
