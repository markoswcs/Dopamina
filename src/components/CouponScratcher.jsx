import React, { useRef, useEffect, useState } from"react";
import { Copy, Check, Gift, Clock, Sparkles } from"lucide-react";

// The prize pool has discounts, auras and items
const PRIZE_POOL = [
 { code: 'BEMVINDO10', label:"10% de Desconto", type: 'coupon' },
 { code: 'AURA100', label:"+100 Aura", type: 'aura', amount: 100 },
 { code: 'AURA50', label:"+50 Aura", type: 'aura', amount: 50 },
 { code: 'FRETEZERO', label:"Frete Grátis", type: 'coupon' },
 { code: 'AURA500', label:"Jackpot: +500 Aura", type: 'aura', amount: 500 },
 { code: 'ITEM_TRIGO', label:"Semente de Trigo", type: 'item' },
 { code: 'GAMER15', label:"15% OFF", type: 'coupon' }
];

const GRADIENTS = [["#E85D3A","#F5A623"], ["#3B82F6","#06B6D4"], ["#EC4899","#8B5CF6"], ["#2D9F6F","#FBBF24"]];

function ScratchCard({ index, onReveal, onRemove }) {
 const canvasRef = useRef(null);
 const isDrawingRef = useRef(false);
 const [revealed, setRevealed] = useState(false);
 const [fullyCleared, setFullyCleared] = useState(false);
 const [copied, setCopied] = useState(false);
 
 // Assign a random prize to this card
 const [prize] = useState(() => PRIZE_POOL[Math.floor(Math.random() * PRIZE_POOL.length)]);
 const grad = GRADIENTS[index % GRADIENTS.length];

 useEffect(() => {
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext("2d");
 canvas.width = canvas.offsetWidth;
 canvas.height = canvas.offsetHeight;
 const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
 g.addColorStop(0, grad[0]); g.addColorStop(1, grad[1]);
 ctx.fillStyle = g;
 if (ctx.roundRect) { ctx.roundRect(0, 0, canvas.width, canvas.height, 12); ctx.fill(); }
 else { ctx.fillRect(0, 0, canvas.width, canvas.height); }
 
 // Create the scratchable surface pattern
 ctx.fillStyle ="#FFFFFF"; 
 ctx.font ="bold 13px 'DM Sans', sans-serif"; 
 ctx.textAlign ="center"; 
 ctx.textBaseline ="middle";
 ctx.fillText("✨ RASPE AQUI ✨", canvas.width/2, canvas.height/2 - 6);
 ctx.font ="10px 'DM Sans', sans-serif"; 
 ctx.fillText(`Cartela DopaGames`, canvas.width/2, canvas.height/2 + 12);
 }, [index, grad]);

 const getPos = (e) => {
 const r = canvasRef.current.getBoundingClientRect();
 const cx = e.touches ? e.touches[0].clientX : e.clientX;
 const cy = e.touches ? e.touches[0].clientY : e.clientY;
 return { x: cx - r.left, y: cy - r.top };
 };

 const draw = (e) => {
 if (!isDrawingRef.current || fullyCleared) return;
 const ctx = canvasRef.current.getContext("2d");
 const p = getPos(e);
 ctx.globalCompositeOperation ="destination-out";
 ctx.beginPath(); ctx.arc(p.x, p.y, 20, 0, Math.PI * 2); ctx.fill();
 
 if (window.triggerDopaParticles && Math.random() > 0.8) {
 const cx = e.touches ? e.touches[0].clientX : e.clientX;
 const cy = e.touches ? e.touches[0].clientY : e.clientY;
 window.triggerDopaParticles(cx, cy);
 }
 
 checkScratch();
 };

 const checkScratch = () => {
 const c = canvasRef.current; const ctx = c.getContext("2d");
 const d = ctx.getImageData(0, 0, c.width, c.height);
 let cleared = 0; for (let i = 3; i < d.data.length; i += 4) { if (d.data[i] === 0) cleared++; }
 const percentage = (cleared / (c.width * c.height)) * 100;
 
 if (percentage > 40 && !revealed) { 
 setRevealed(true); 
 if (onReveal) onReveal(prize); 
 }
 
 if (percentage > 90 && !fullyCleared) {
 setFullyCleared(true);
 }
 };

 const copyCode = () => { navigator.clipboard.writeText(prize.code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

 return (
 <div className="theme-card border theme-border p-3 rounded-xl relative group">
 
 {/* Delete button appears after revealed */}
 {revealed && (
 <button onClick={() => onRemove(index)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-30">
 ✕
 </button>
 )}

 <div className="relative w-full h-24 rounded-lg overflow-hidden theme-surface border theme-border flex items-center justify-center">
 
 {/* Hidden Content */}
 <div className="absolute inset-0 flex flex-col justify-center items-center z-0">
 {prize.type === 'aura' ? (
 <div className="font-display font-extrabold text-2xl tracking-widest text-accent animate-bounce-in flex items-center gap-2">
 <Sparkles className="w-5 h-5"/> +{prize.amount}
 </div>
 ) : (
 <div className="font-display font-extrabold text-xl tracking-widest"style={{color:grad[0]}}>{prize.code}</div>
 )}
 
 <div className="text-[10px] theme-text-secondary mt-0.5 font-bold uppercase">{prize.label}</div>
 
 {prize.type === 'coupon' && (
 <button onClick={copyCode} className="mt-1.5 py-0.5 px-3 bg-accent/10 text-accent rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer z-20">
 {copied ? <><Check className="w-2.5 h-2.5"/>Copiado!</> : <><Copy className="w-2.5 h-2.5"/>Copiar Cupom</>}
 </button>
 )}
 </div>

 {/* Scratch Surface */}
 {!fullyCleared && (
 <canvas ref={canvasRef}
 onMouseDown={()=>(isDrawingRef.current=true)} onMouseUp={()=>(isDrawingRef.current=false)} onMouseLeave={()=>(isDrawingRef.current=false)} onMouseMove={draw}
 onTouchStart={()=>(isDrawingRef.current=true)} onTouchEnd={()=>(isDrawingRef.current=false)} onTouchMove={draw}
 className={`absolute inset-0 w-full h-full cursor-crosshair touch-none transition-opacity duration-1000 ${fullyCleared ? 'opacity-0' : 'opacity-100'} z-10`}
 />
 )}
 </div>
 <p className="text-[9px] theme-muted mt-1.5 text-center font-semibold">
 {revealed ?"Prêmio resgatado! 🎉":"Raspe com o dedo ou mouse"}
 </p>
 </div>
 );
}

const MAX_CARDS = 3;
const RECHARGE_TIME_MS = 3 * 60 * 1000; // 3 minutes

export default function CouponScratcher({ onCouponReveal, currentAura, onUpdateAura, onWinItem }) {
 const [cards, setCards] = useState([]);
 const [timeToNext, setTimeToNext] = useState(0);

 // Initialize state from localstorage
 useEffect(() => {
 try {
 const saved = localStorage.getItem("dopashop_scratcher_state");
 if (saved) {
 const parsed = JSON.parse(saved);
 setCards(parsed.cards || []);
 } else {
 // Give 3 free cards on first ever visit
 setCards([{id: 1}, {id: 2}, {id: 3}]);
 localStorage.setItem("dopashop_scratcher_state", JSON.stringify({
 cards: [{id: 1}, {id: 2}, {id: 3}],
 lastGeneratedAt: Date.now()
 }));
 }
 } catch(e) {}
 }, []);

 // Cooldown timer loop
 useEffect(() => {
 const timer = setInterval(() => {
 try {
 const saved = JSON.parse(localStorage.getItem("dopashop_scratcher_state"));
 if (!saved) return;
 
 let { cards: savedCards, lastGeneratedAt } = saved;
 
 if (savedCards.length < MAX_CARDS) {
 const timeElapsed = Date.now() - lastGeneratedAt;
 
 if (timeElapsed >= RECHARGE_TIME_MS) {
 // Generate a new card
 savedCards.push({ id: Date.now() });
 lastGeneratedAt = Date.now();
 
 // Save back
 const newState = { cards: savedCards, lastGeneratedAt };
 localStorage.setItem("dopashop_scratcher_state", JSON.stringify(newState));
 setCards(savedCards);
 setTimeToNext(RECHARGE_TIME_MS);
 } else {
 setTimeToNext(RECHARGE_TIME_MS - timeElapsed);
 }
 } else {
 // Full
 setTimeToNext(0);
 }
 } catch (e) {}
 }, 1000);
 
 return () => clearInterval(timer);
 }, []);

 const handleReveal = (prize) => {
 if (prize.type === 'aura') {
 onUpdateAura(prize.amount);
 } else if (prize.type === 'coupon') {
 if (onCouponReveal) onCouponReveal(prize.code);
 } else if (prize.type === 'item') {
 if (onWinItem) onWinItem(prize);
 }
 };

 const removeCard = (idxToRemove) => {
 const newCards = cards.filter((_, i) => i !== idxToRemove);
 setCards(newCards);
 
 const saved = JSON.parse(localStorage.getItem("dopashop_scratcher_state"));
 // If we were at max capacity, start the timer now
 if (saved.cards.length === MAX_CARDS) {
 saved.lastGeneratedAt = Date.now();
 }
 saved.cards = newCards;
 localStorage.setItem("dopashop_scratcher_state", JSON.stringify(saved));
 };

 function formatTime(ms) {
 if (ms <= 0) return"00:00";
 const totalSeconds = Math.floor(ms / 1000);
 const m = Math.floor(totalSeconds / 60);
 const s = totalSeconds % 60;
 return`${m}:${s.toString().padStart(2, '0')}`;
 }

 return (
 <div className="w-full space-y-4">
 <div className="flex items-center justify-between">
 <h3 className="font-display font-bold text-sm theme-text flex items-center gap-2">
 <Gift className="w-4 h-4 text-accent"/> 
 Suas Cartelas ({cards.length}/{MAX_CARDS})
 </h3>
 
 <div className="text-[10px] font-bold theme-text-secondary flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full">
 {cards.length < MAX_CARDS ? (
 <>
 <Clock className="w-3 h-3 text-accent"/>
 <span>Nova cartela em {formatTime(timeToNext)}</span>
 </>
 ) : (
 <span className="text-success">Você tem o máximo de cartelas!</span>
 )}
 </div>
 </div>
 
 {cards.length === 0 ? (
 <div className="text-center py-12 border border-dashed theme-border theme-surface rounded-2xl">
 <Gift className="w-10 h-10 theme-muted mx-auto mb-3 opacity-50"/>
 <p className="text-sm font-semibold theme-text-secondary">Nenhuma cartela disponível.</p>
 <p className="text-[10px] theme-muted mt-1">Volte mais tarde para raspar mais!</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {cards.map((card, i) => (
 <ScratchCard key={card.id} index={i} onReveal={handleReveal} onRemove={() => removeCard(i)} />
 ))}
 </div>
 )}
 </div>
 );
}
