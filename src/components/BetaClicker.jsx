import React, { useState, useEffect } from"react";
import { MousePointerClick, AlertTriangle } from"lucide-react";

export default function BetaClicker({ onUpdateAura }) {
 const [clicks, setClicks] = useState(0);
 const [message, setMessage] = useState("Clique aqui para farmar Aura fácil!");
 const [messageColor, setMessageColor] = useState("text-gray-500");
 const [popups, setPopups] = useState([]);

 const handleClick = (e) => {
 if (window.triggerDopaParticles) window.triggerDopaParticles(e.clientX, e.clientY);
 
 setClicks(c => c + 1);
 onUpdateAura(1.0);
 
 // Add floating +1.0 text
 const id = Date.now();
 setPopups(prev => [...prev, { id, x: (Math.random() * 60) - 30, y: (Math.random() * 30) - 15, rot: (Math.random() * 30) - 15 }]);
 setTimeout(() => {
 setPopups(prev => prev.filter(p => p.id !== id));
 }, 1000);
 };

 useEffect(() => {
 if (clicks === 0) return;
 
 if (clicks === 10) {
 setMessage("Hm... para farmar aura não é fácil assim.");
 setMessageColor("text-yellow-600 dark:text-yellow-400");
 } else if (clicks === 30) {
 setMessage("Deixa de ser um BETA, vai plantar uma árvore na fazenda.");
 setMessageColor("text-orange-600 dark:text-orange-400 font-bold");
 } else if (clicks === 75) {
 setMessage("Você realmente vai ficar clicando aqui o dia todo? Que patético.");
 setMessageColor("text-red-500 font-bold");
 } else if (clicks === 150) {
 setMessage("Sua dopamina tá tão baixa que você virou um bot. Pare.");
 setMessageColor("text-red-600 dark:text-red-400 font-black italic");
 } else if (clicks === 300) {
 setMessage("OK, VOCÊ VENCEU. Você é o Alpha supremo do mouse. (Mas continua pobre).");
 setMessageColor("text-purple-600 dark:text-purple-400 font-black uppercase");
 }
 }, [clicks]);

 return (
 <div className="theme-card border theme-border p-6 rounded-3xl text-center relative overflow-hidden group">
 {/* Background decoration */}
 <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
 <MousePointerClick className="w-48 h-48"/>
 </div>
 
 <div className="relative z-10 flex flex-col items-center space-y-4">
 
 <div className="flex items-center gap-2">
 <AlertTriangle className={`w-5 h-5 ${clicks > 30 ? 'text-warning' : 'text-gray-400'} animate-pulse`} />
 <h3 className="font-display font-extrabold text-lg theme-text">Farm de Aura"Fácil"</h3>
 </div>
 
 <button
 onClick={handleClick}
 className="relative px-8 py-4 bg-theme-surface border-2 border-accent/30 rounded-2xl active:scale-90 transition-all hover:border-accent )] hover:-translate-y-1 overflow-hidden"
 >
 <div className="absolute inset-0 bg-accent/5 opacity-0 hover:opacity-100 transition-opacity"></div>
 <span className="font-display font-black text-xl text-accent flex items-center gap-2 relative z-10">
 <MousePointerClick className="w-6 h-6 animate-bounce"/> Clique para +1.0 Aura
 </span>
 
 {/* Floating numbers */}
 {popups.map(p => (
 <span 
 key={p.id}
 className="absolute left-1/2 top-1/2 font-black text-accent text-lg pointer-events-none transition-all duration-1000 ease-out z-20"
 style={{ 
 transform:`translate(calc(-50% + ${p.x}px), calc(-50% - 40px + ${p.y}px)) rotate(${p.rot}deg) scale(1.5)`,
 opacity: 0
 }}
 >
 +1.0
 </span>
 ))}
 </button>

 <div className="min-h-[3rem] flex items-center justify-center w-full px-4">
 <p className={`text-sm transition-colors duration-500 ${messageColor} text-balance`}>
 {message}
 </p>
 </div>
 
 {clicks > 0 && (
 <div className="text-[10px] theme-muted font-mono bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full">
 Total de Clicks: {clicks}
 </div>
 )}
 </div>
 </div>
 );
}
