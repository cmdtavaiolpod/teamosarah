import React from 'react';

export const SpotifyPlayer: React.FC = () => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-[350px] shadow-2xl rounded-xl overflow-hidden border border-brand-gold/20 bg-black/80 backdrop-blur-xl">
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
  );
};
