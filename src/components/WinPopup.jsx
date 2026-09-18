import React, { useEffect, useState } from"react";
import { X, Sparkles, Gift, Flame } from"lucide-react";

// Custom CSS Confetti Component
const Confetti = () => {
 const colors = ['#E85D3A', '#FFD700', '#60A5FA', '#EC4899', '#34D399'];
 const pieces = Array.from({ length: 50 }).map((_, i) => ({
 id: i,
 left:`${Math.random() * 100}%`,
 animationDuration:`${Math.random() * 3 + 2}s`,
 animationDelay:`${Math.random() * 1}s`,
 backgroundColor: colors[Math.floor(Math.random() * colors.length)],
 size:`${Math.random() * 10 + 5}px`,
 type: Math.random() > 0.5 ? 'circle' : 'square',
 rotation: Math.random() * 360,
 }));

 return (
 <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
 <style>{`
 @keyframes confetti-fall {
 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
 }
`}</style>
 {pieces.map(p => (
 <div
 key={p.id}
 className="absolute top-0"
 style={{
 left: p.left,
 width: p.size,
 height: p.size,
 backgroundColor: p.backgroundColor,
 borderRadius: p.type === 'circle' ? '50%' : '2px',
 transform:`rotate(${p.rotation}deg)`,
 animation:`confetti-fall ${p.animationDuration} linear ${p.animationDelay} forwards`,
 boxShadow:`0 0 10px ${p.backgroundColor}80`,
 }}
 />
 ))}
 </div>
 );
};

export default function WinPopup({ prize, onClose }) {
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
 if (prize) {
 // Trigger a small delay to start animations smoothly
 setTimeout(() => setMounted(true), 50);
 } else {
 setMounted(false);
 }
 }, [prize]);

 if (!prize) return null;

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300">
 
 {/* Background Radial Glow */}
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
 <div className="w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-accent/30 rounded-full blur-[100px] animate-pulse"></div>
 </div>

 <Confetti />

 <div className={`relative bg-gradient-to-b from-white to-gray-50 dark:from-[#222228] dark:to-[#18181C] p-8 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(232,93,58,0.3)] max-w-sm w-[90%] text-center border border-accent/30 transition-all duration-500 transform ${mounted ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10'}`}>
 
 {/* Skip button */}
 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer bg-black/5 dark:bg-white/10 p-2 rounded-full z-10 hover:rotate-90 duration-300">
 <X className="w-5 h-5"/>
 </button>

 {/* Icon Header */}
 <div className="mb-6 relative inline-block">
 <div className="absolute inset-0 bg-accent blur-xl opacity-60 animate-pulse scale-150"></div>
 <div className="bg-gradient-to-br from-accent to-accent-dark p-5 rounded-2xl relative rotate-3 hover:rotate-0 transition-transform duration-300">
 {prize.type === 'aura' ? (
 <Flame className="w-16 h-16 text-white animate-pulse"/>
 ) : (
 <Gift className="w-16 h-16 text-white animate-bounce"/>
 )}
 <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-yellow-300 animate-spin-slow"/>
 </div>
 </div>

 {/* Title */}
 <h2 className="font-display font-black text-3xl md:text-4xl mb-2 uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent via-yellow-500 to-accent animate-gradient-x"style={{ backgroundSize: '200% auto' }}>
 Você Ganhou!
 </h2>
 
 <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-medium">
 A sorte está ao seu lado no DopaShop ✨
 </p>

 {/* Prize Box */}
 <div className="relative overflow-hidden bg-white dark:bg-black/40 border-2 border-accent/40 rounded-2xl p-6 mb-8 transform hover:scale-[1.03] transition-transform duration-300 group">
 {/* Shine effect over the box */}
 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"/>
 
 <div className={`font-display font-black text-4xl md:text-5xl ${prize.type === 'aura' ? 'text-accent' : 'text-success'} mb-2 drop-`}>
 {prize.type === 'aura' ?`+${prize.auraAmount}`: prize.code}
 </div>
 <div className="text-gray-700 dark:text-gray-200 font-extrabold text-lg uppercase tracking-wide">
 {prize.label}
 </div>
 </div>

 {/* Action Button */}
 <button onClick={onClose} className="group relative w-full py-4 bg-accent hover:bg-accent-dark text-white font-display font-bold text-lg rounded-xl uppercase tracking-wider shadow-[0_10px_20px_rgba(232,93,58,0.4)] )] transition-all active:scale-95 cursor-pointer overflow-hidden">
 <span className="relative z-10 flex items-center justify-center gap-2">
 Resgatar Prêmio <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform"/>
 </span>
 <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"/>
 </button>
 </div>

 <style>{`
 @keyframes shimmer {
 100% { transform: translateX(100%); }
 }
 @keyframes gradient-x {
 0%, 100% { background-position: 0% 50%; }
 50% { background-position: 100% 50%; }
 }
 .animate-gradient-x {
 animation: gradient-x 3s ease infinite;
 }
`}</style>
 </div>
 );
}
