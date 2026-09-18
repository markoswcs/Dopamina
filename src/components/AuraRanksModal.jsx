import React, { useEffect } from"react";
import { X, Trophy, Lock, Paintbrush, CheckCircle } from"lucide-react";
import { pixRanks } from"../productsData";

export default function AuraRanksModal({ isOpen, onClose, totalSpent, activeTheme, onSelectTheme }) {
 // Prevent body scroll when modal is open
 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = '';
 }
 return () => {
 document.body.style.overflow = '';
 };
 }, [isOpen]);

 if (!isOpen) return null;

 const isDefaultThemeActive = !activeTheme;

 return (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up"onClick={onClose} style={{ animationDuration: '0.2s' }}>
 <div className="theme-card border theme-border w-full max-w-md rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"onClick={e => e.stopPropagation()}>
 <div className="flex justify-between items-center p-4 border-b theme-border theme-surface">
 <div className="flex items-center gap-2">
 <Trophy className="text-[#32BCAD] w-5 h-5"/>
 <h2 className="font-display font-bold text-sm theme-text">Ranks de Pix</h2>
 </div>
 <button onClick={onClose} className="theme-muted hover:theme-text cursor-pointer transition-colors"><X className="w-5 h-5"/></button>
 </div>

 <div className="flex-1 overflow-y-auto p-4 space-y-4">
 <p className="text-xs theme-text-secondary text-center">Abra mais caixas para gastar Pix e subir de rank!</p>
 
 <div className="flex justify-center mb-2">
 <button
 onClick={() => onSelectTheme(null)}
 className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${isDefaultThemeActive ? 'bg-[#32BCAD] text-white ' : 'theme-surface border theme-border theme-text hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer'}`}
 >
 {isDefaultThemeActive ? <CheckCircle className="w-3.5 h-3.5"/> : <Paintbrush className="w-3.5 h-3.5"/>}
 Tema Padrão
 </button>
 </div>

 <div className="space-y-3">
 {pixRanks.map((rank, i) => {
 const isUnlocked = totalSpent >= rank.min;
 const isCurrent = totalSpent >= rank.min && (i === pixRanks.length - 1 || totalSpent < pixRanks[i+1].min);
 const isThemeActive = activeTheme && activeTheme.accent === rank.theme.accent;
 
 // Delay for staggered animation
 const animDelay =`${i * 0.05}s`;

 return (
 <div 
 key={i} 
 className={`relative rounded-xl overflow-hidden border animate-fade-in-up ${isCurrent ? 'border-[#32BCAD] shadow-[0_0_15px_rgba(50,188,173,0.3)] scale-[1.02]' : 'theme-border'} transition-all duration-300`}
 style={{ animationDelay: animDelay, animationFillMode: 'both' }}
 >
 
 {/* Background Gradient */}
 <div className="absolute inset-0 z-0 overflow-hidden">
 <div className={`absolute inset-0 transition-all duration-700 ${!isUnlocked ? 'grayscale opacity-30 blur-[2px]' : 'opacity-90 hover:scale-105 hover:opacity-100'}`} style={{ background: rank.gradient }} />
 <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"/>
 </div>

 <div className="relative z-10 p-4 flex items-center gap-4">
 <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-white/10 backdrop-blur-md border border-white/20">
 {isUnlocked ? rank.emoji : <Lock className="w-5 h-5 text-white/50"/>}
 </div>
 
 <div className="flex-1">
 <div className="flex items-center gap-2">
 <h4 className="font-display font-bold text-sm text-white">{rank.name}</h4>
 {isCurrent && <span className="text-[9px] bg-[#32BCAD] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">Atual</span>}
 </div>
 <p className="text-[10px] text-white/70">
 {i === pixRanks.length - 1 ?`${rank.min}+ Dopas gastos`:`${rank.min} Dopas - ${pixRanks[i+1].min - 1} Dopas gastos`}
 </p>
 </div>
 
 {/* Theme Select Button */}
 {isUnlocked && (
 <button
 onClick={() => onSelectTheme(rank.theme)}
 className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
 isThemeActive 
 ? 'bg-white/20 border-white/50 text-white ' 
 : 'bg-black/40 border-white/20 text-white/80 hover:bg-black/60 hover:text-white'
 }`}
 >
 {isThemeActive ? (
 <><CheckCircle className="w-3 h-3"/> Usando</>
 ) : (
 <><Paintbrush className="w-3 h-3"/> Usar Tema</>
 )}
 </button>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>
 </div>
 );
}
