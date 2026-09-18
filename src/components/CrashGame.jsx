import React, { useState, useEffect, useRef } from"react";
import { Rocket, AlertOctagon, CheckCircle2, RotateCcw, Flame, Sliders, ArrowUpRight, Coins } from"lucide-react";
import { playCrash, playCashout, playCrashTick } from"../audioManager";
import { io } from"socket.io-client";

const DopaCoinIcon = ({ className ="w-4 h-4"}) => (
 <svg viewBox="0 0 100 100"className={className}>
 <defs>
 <linearGradient id="dopaCoinGrad"x1="0%"y1="0%"x2="0%"y2="100%">
 <stop offset="0%"stopColor="#ffb03a"/>
 <stop offset="100%"stopColor="#f57c00"/>
 </linearGradient>
 <filter id="dopaCoinShadow"x="-20%"y="-20%"width="140%"height="140%">
 <feDropShadow dx="0"dy="2"stdDeviation="1.5"floodOpacity="0.3"/>
 </filter>
 </defs>
 <circle cx="50"cy="50"r="46"fill="url(#dopaCoinGrad)"stroke="#e65c00"strokeWidth="4"/>
 <circle cx="50"cy="50"r="38"fill="none"stroke="#d45100"strokeWidth="1.5"opacity="0.6"/>
 <path d="M 36 32 L 58 32 C 80 32 80 68 58 68 L 39 68 L 45 52 L 36 52 Z M 47 42 L 57 42 C 70 42 70 58 57 58 L 52 58 L 55 52 L 47 52 Z"fill="#fff5e6"fillRule="evenodd"filter="url(#dopaCoinShadow)"/>
 </svg>
);

const socket = io("http://localhost:3001");

export default function CrashGame({ coinBalance, onUpdateCoins }) {
 const [gameState, setGameState] = useState("idle"); // idle | playing | crashed
 const [cashedOut, setCashedOut] = useState(false);
 const [multiplier, setMultiplier] = useState(1.00);
 const [bet, setBet] = useState(100);
 const [autoCashout, setAutoCashout] = useState('');
 const [history, setHistory] = useState([
 { id: 1, mult: 1.45 }, { id: 2, mult: 2.80 }, { id: 3, mult: 1.12 },
 { id: 4, mult: 14.50 }, { id: 5, mult: 3.20 }, { id: 6, mult: 1.95 }
 ]);
 const [winAmount, setWinAmount] = useState(0);

 const multiplierRef = useRef(1.00);
 const rafRef = useRef(null);
 const pathRef = useRef(null);
 const strokeRef = useRef(null);
 const rocketRef = useRef(null);
 const rocketInnerRef = useRef(null);

 const playSound = (type) => {
 if (type === 'tick') playCrashTick(multiplierRef.current);
 else if (type === 'crash') playCrash();
 else if (type === 'cashout') playCashout();
 };

 useEffect(() => {
 socket.on('game_state', (data) => {
 setGameState(data.state);
 setMultiplier(data.multiplier);
 multiplierRef.current = data.multiplier;
 });

 socket.on('game_start', () => {
 setGameState('playing');
 setMultiplier(1.0);
 multiplierRef.current = 1.0;
 setCashedOut(false);
 setWinAmount(0);
 });

 socket.on('multiplier_update', (data) => {
 setMultiplier(data.multiplier);
 multiplierRef.current = data.multiplier;
 if (Math.random() > 0.85) playSound('tick');
 });

 socket.on('game_crashed', (data) => {
 setGameState('crashed');
 setMultiplier(data.multiplier);
 multiplierRef.current = data.multiplier;
 playSound('crash');
 addToHistory(data.multiplier);
 });

 socket.on('game_reset', () => {
 setGameState('idle');
 });

 socket.on('auto_cashout', (data) => {
 setCashedOut(true);
 setWinAmount(data.winAmount);
 onUpdateCoins(data.winAmount);
 playSound('cashout');
 });

 socket.on('cashout_success', (data) => {
 setCashedOut(true);
 setWinAmount(data.winAmount);
 onUpdateCoins(data.winAmount);
 playSound('cashout');
 });

 socket.on('bet_accepted', () => {
 onUpdateCoins(-bet);
 });

 socket.on('bet_error', (msg) => {
 alert(msg);
 });

 return () => {
 socket.off('game_state');
 socket.off('game_start');
 socket.off('multiplier_update');
 socket.off('game_crashed');
 socket.off('game_reset');
 socket.off('auto_cashout');
 socket.off('cashout_success');
 socket.off('bet_accepted');
 socket.off('bet_error');
 };
 }, [bet, onUpdateCoins]);

 // Animation Loop for Graph
 useEffect(() => {
 if (gameState !== 'playing') {
 if (rafRef.current) cancelAnimationFrame(rafRef.current);
 return;
 }
 
 let startTime = performance.now();
 const updateGame = (time) => {
  const elapsed = time - startTime;
  const mult = multiplierRef.current;
  // Curve mapping for visual aesthetics
  const xPos = Math.min(92, (elapsed / 40) ** 0.75);
  const yPos = Math.min(82, ((mult - 1) ** 0.85) * 25);
 
 // Direct DOM manipulation to avoid 60fps React re-renders (Fix lag)
 if (pathRef.current && strokeRef.current) {
   const pathD = `M 0 280 Q ${xPos * 6} 280 ${xPos * 6.5} ${280 - yPos * 3.2} L ${xPos * 6.5} 280 Z`;
   const strokeD = `M 0 280 Q ${xPos * 6} 280 ${xPos * 6.5} ${280 - yPos * 3.2}`;
   pathRef.current.setAttribute('d', pathD);
   strokeRef.current.setAttribute('d', strokeD);
 }
 if (rocketRef.current) {
   rocketRef.current.style.bottom = `${yPos}%`;
   rocketRef.current.style.left = `${xPos}%`;
 }
 if (rocketInnerRef.current) {
   const rocketAngle = Math.min(75, 20 + yPos * 0.7);
   rocketInnerRef.current.style.transform = `rotate(${rocketAngle}deg)`;
 }
 
 rafRef.current = requestAnimationFrame(updateGame);
 };
 rafRef.current = requestAnimationFrame(updateGame);
 return () => cancelAnimationFrame(rafRef.current);
 }, [gameState]);

  const startGame = () => {
  if (bet < 1) {
    alert("A aposta mínima é 1 Dopa!");
    return;
  }
  if (coinBalance < bet) {
    alert("Saldo insuficiente! Você não tem Dopas suficientes para essa aposta.");
    return;
  }
  
  // In a real app, userId would come from context/auth
  const userData = JSON.parse(localStorage.getItem("dopashop_user")) || {};
  socket.emit('place_bet', { bet, autoCashout: autoCashout ? parseFloat(autoCashout) : 0, userId: userData.id || 1 });
  };

  const cashOut = () => {
  if (gameState !=="playing"|| cashedOut) return;
  // Optimistic UI update for instant feedback
  setCashedOut(true);
  socket.emit('manual_cashout');
  };

 const addToHistory = (mult) => {
 setHistory(prev => [{ id: Date.now(), mult }, ...prev].slice(0, 10));
 };

 // Initial static paths
 const pathD = `M 0 280 Q 0 280 0 280 L 0 280 Z`;
 const strokeD = `M 0 280 Q 0 280 0 280`;

 return (
 <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 select-none">
 
 {/* Header Bar */}
 <div className="bg-zinc-950 px-6 py-4 flex flex-wrap justify-between items-center border-b border-white/5 gap-3">
 <div className="flex items-center gap-2.5">
 <Rocket className="w-5 h-5 text-accent"/>
 <h2 className="font-black text-lg text-white tracking-wider font-display uppercase leading-none">Foguetinho</h2>
 </div>

 {/* History Pills */}
 <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
 {history.map((h) => (
 <span 
 key={h.id} 
 className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0 border transition-all ${
 h.mult >= 2.0 
 ? 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30' 
 : 'bg-white/5 text-zinc-400 border-white/5'
 }`}
 >
 {h.mult.toFixed(2)}x
 </span>
 ))}
 </div>
 </div>

 {/* Arena Canvas Area */}
 <div className="relative h-72 md:h-96 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
 
 {/* Minimalist Subtle Grid */}
 <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px]"></div>

 {/* SVG Graph Curve */}
 {(gameState === 'playing' || gameState === 'crashed') && (
 <div className="absolute inset-0 pointer-events-none z-10">
 <svg viewBox="0 0 600 280"preserveAspectRatio="none"className="w-full h-full">
 <defs>
 <linearGradient id="minimalistCurveGrad"x1="0"y1="0"x2="0"y2="1">
 <stop offset="0%"stopColor={gameState === 'crashed' ? '#ef4444' : '#d946ef'} stopOpacity="0.25"/>
 <stop offset="100%"stopColor={gameState === 'crashed' ? '#ef4444' : '#d946ef'} stopOpacity="0.0"/>
 </linearGradient>
 </defs>
 <path ref={pathRef} d={pathD} fill="url(#minimalistCurveGrad)"/>
 <path ref={strokeRef} d={strokeD} fill="none"stroke={gameState === 'crashed' ? '#ef4444' : '#d946ef'} strokeWidth="3"strokeLinecap="round"/>
 </svg>
 </div>
 )}

 {/* Rocket Icon */}
 {(gameState === 'playing' || gameState === 'crashed') && (
 <div 
 ref={rocketRef}
 className="absolute z-30 transition-all duration-75 ease-linear pointer-events-none"
 style={{ 
 bottom: '0%',
 left: '0%',
 transform: 'translate(-50%, 50%)'
 }}
 >
 <div className="relative">
 <div ref={rocketInnerRef} className={`relative z-10 ${gameState === 'crashed' ? 'grayscale opacity-50' : ''}`} style={{ transform: 'rotate(20deg)'}}>
 <Rocket className="w-12 h-12 md:w-16 md:h-16 text-fuchsia-500 drop-shadow-[0_0_20px_rgba(217,70,239,0.5)]"/>
 </div>
 {gameState === 'crashed' && (
 <div className="absolute inset-0 flex items-center justify-center z-40">
 <span className="text-5xl">💥</span>
 </div>
 )}
 </div>
 </div>
 )}

 {/* Multiplier Display */}
 <div className="relative z-20 text-center flex flex-col items-center">
 <div className={`font-black text-6xl md:text-8xl tabular-nums tracking-tighter transition-all font-display ${
 gameState === 'crashed' 
 ? 'text-red-500' 
 : cashedOut 
 ? 'text-emerald-400' 
 : 'text-white'
 }`}>
 {multiplier.toFixed(2)}x
 </div>
 
 {gameState === 'crashed' && (
 <div className="mt-3 flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-1.5 rounded-full text-red-400 font-bold uppercase tracking-wider text-xs md:text-sm">
 <AlertOctagon className="w-4 h-4"/>
 <span>Explodiu em {multiplier.toFixed(2)}x</span>
 </div>
 )}
 
 {cashedOut && (
 <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-5 py-2 rounded-2xl text-emerald-400 font-bold uppercase tracking-wider text-xs md:text-sm">
 <CheckCircle2 className="w-4 h-4 text-emerald-400"/>
 <span>Retirado • +{Math.floor(winAmount).toLocaleString('pt-BR')} Dopas</span>
 </div>
 )}
 
 {gameState === 'idle' && (
 <span className="mt-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Aguardando Aposta</span>
 )}
 </div>
 </div>

 {/* Control Panel */}
 <div className="bg-zinc-950 p-6 flex flex-col md:flex-row gap-4 border-t border-white/5 relative z-10 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
 
 {/* Bet Amount */}
 <div className="flex-[3] bg-zinc-900 rounded-2xl p-4 border border-white/5 flex flex-col gap-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
 <div className="flex justify-between items-center px-1">
 <label className="text-[11px] md:text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
 Valor da Aposta
 </label>
 <span className="text-[10px] md:text-[11px] font-bold text-zinc-400 bg-white/5 px-2.5 py-1 rounded-lg">
 Saldo: <span className="text-white">{coinBalance.toFixed(2)}</span>
 </span>
 </div>

 <div className="flex items-center bg-[#09090b] rounded-xl border border-white/10 p-1.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all">
 <div className="pl-2 md:pl-3 pr-2 flex items-center justify-center">
 <DopaCoinIcon className="w-4 h-4 md:w-5 md:h-5 drop-"/>
 </div>
 <input 
 type="number"
 value={bet} 
 onChange={(e) => setBet(Math.max(1, Number(e.target.value)))}
 disabled={gameState === 'playing'}
 className="w-full min-w-[120px] bg-transparent text-white font-black text-base md:text-lg px-2 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
 />
 <div className="flex gap-1 md:gap-1.5 pr-1 shrink-0">
 <button onClick={() => setBet(Math.max(1, Math.floor(bet / 2)))} disabled={gameState === 'playing'} className="bg-zinc-800 hover:bg-zinc-700 text-[10px] md:text-xs font-black text-zinc-300 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors cursor-pointer active:scale-95 disabled:opacity-50">½</button>
 <button onClick={() => setBet(Math.floor(bet * 2))} disabled={gameState === 'playing'} className="bg-zinc-800 hover:bg-zinc-700 text-[10px] md:text-xs font-black text-zinc-300 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors cursor-pointer active:scale-95 disabled:opacity-50">2x</button>
 <button onClick={() => setBet(Math.floor(coinBalance))} disabled={gameState === 'playing'} className="bg-accent/20 hover:bg-accent text-[10px] md:text-[11px] font-black text-accent hover:text-white px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-accent/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50">MAX</button>
 </div>
 </div>
 </div>

 {/* Auto Cashout */}
 <div className="flex-1 bg-zinc-900 rounded-2xl p-4 border border-white/5 flex flex-col justify-between shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
 <label className="text-[11px] md:text-xs font-black text-zinc-500 uppercase tracking-widest px-1">
 Auto Retirar
 </label>
 <div className="flex items-center bg-[#09090b] rounded-xl border border-white/10 p-2 mt-2 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
 <span className="text-[11px] md:text-xs font-bold text-zinc-600 pl-2 md:pl-3">Alvo:</span>
 <input 
 type="number"
 placeholder="2.00"
 value={autoCashout}
 onChange={(e) => setAutoCashout(e.target.value)}
 disabled={gameState === 'playing'}
 className="w-full min-w-0 bg-transparent text-white font-black text-base md:text-lg px-2 text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
 />
 <div className="pr-2 md:pr-3 flex items-center justify-center">
 <span className="text-xs md:text-sm font-black text-emerald-500">x</span>
 </div>
 </div>
 </div>

 {/* Action Button */}
 <div className="flex-[1.2] flex items-stretch">
 {gameState === 'idle' || gameState === 'crashed' ? (
 <button 
 onClick={startGame}
 disabled={coinBalance < bet || bet < 1}
 className={`w-full rounded-2xl font-black text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
 coinBalance < bet 
 ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700/50' 
 : 'bg-gradient-to-t from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] border border-orange-300/30 active:scale-95'
 }`}
 >
 {gameState === 'crashed' ? (
 <>
 <RotateCcw className="w-5 h-5 drop-"/>
 <span className="drop-">Tentar Novamente</span>
 </>
 ) : (
 <>
 <Rocket className="w-5 h-5 drop-"/>
 <span className="drop-">Apostar</span>
 </>
 )}
 </button>
 ) : (
 <button 
 onClick={() => cashOut()}
 disabled={cashedOut}
 className={`w-full rounded-2xl font-black text-lg uppercase tracking-wider transition-all flex flex-col items-center justify-center cursor-pointer ${
 cashedOut 
 ? 'bg-emerald-950 text-emerald-500 border border-emerald-500/30 cursor-not-allowed' 
 : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 active:scale-95'
 }`}
 >
 {cashedOut ? (
 <span className="text-xs font-bold">Aguardando...</span>
 ) : (
 <>
 <span className="text-base">Retirar</span>
 <span className="text-xs text-emerald-100 font-medium flex items-center justify-center gap-1">
 <DopaCoinIcon className="w-3 h-3 opacity-80"/>
 {Math.floor(bet * multiplier).toLocaleString('pt-BR')} Dopas
 </span>
 </>
 )}
 </button>
 )}
 </div>

 </div>
 </div>
 );
}
