import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

export default function SpecialMessage() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative py-20 px-8 bg-brand-wine text-white rounded-[3rem] overflow-hidden"
    >
      <Quote className="absolute top-8 left-8 w-12 h-12 text-brand-gold/20" />
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        <h2 className="serif text-4xl md:text-5xl italic">Parabéns, Meu Amor!</h2>
        <p className="serif text-2xl md:text-3xl leading-relaxed font-light">
          "Feliz aniversário, amor! 🥰 Sou muito grato e feliz por ter uma mulher incrível ao meu lado. Que seu dia seja maravilhoso e cheio de coisas boas te amo muito minha linda! ✨🎈"
        </p>
        <div className="pt-6">
          <span className="text-[14px] uppercase tracking-[0.5em] text-brand-gold">Com todo o meu amor e carinho</span>
        </div>
      </div>
      <Quote className="absolute bottom-8 right-8 w-12 h-12 text-brand-gold/20 rotate-180" />
    </motion.section>
  );
}
