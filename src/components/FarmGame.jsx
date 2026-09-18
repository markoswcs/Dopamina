import React, { useState, useEffect, useRef } from"react";
import { Sparkles, Sprout, DollarSign, Lock, RotateCcw, Play, CheckCircle2 } from"lucide-react";
import { 
 SLOT_SEEDS, getRandomSeed, evaluateHand, playFarmSound
} from"./farmConstants";

export default function FarmGame({ currentAura, onUpdateAura }) {
 // Game States: IDLE, SPINNING, HOLDING
 const [gameState, setGameState] = useState('IDLE');
 
 // 5 Plots (Reels)
 const [plots, setPlots] = useState([
 { id: 0, seed: null, hold: false, spinning: false },
 { id: 1, seed: null, hold: false, spinning: false },
 { id: 2, seed: null, hold: false, spinning: false },
 { id: 3, seed: null, hold: false, spinning: false },
 { id: 4, seed: null, hold: false, spinning: false },
 ]);

 const [lastWin, setLastWin] = useState(null);
 
 // Ref for spinning interval
 const spinInterval = useRef(null);

 const SPIN_COST = 100;
 const RESPIN_COST = 50;

 // Visual spinning effect
 useEffect(() => {
 if (gameState === 'SPINNING') {
 spinInterval.current = setInterval(() => {
 playFarmSound('spin');
 setPlots(prev => prev.map(p => {
 if (p.spinning) {
 return { ...p, seed: getRandomSeed() };
 }
 return p;
 }));
 }, 50); // fast spin
 } else {
 if (spinInterval.current) clearInterval(spinInterval.current);
 }
 return () => { if (spinInterval.current) clearInterval(spinInterval.current); };
 }, [gameState]);

 const handleInitialSpin = () => {
 if (currentAura < SPIN_COST) return;
 onUpdateAura(-SPIN_COST);
 setLastWin(null);
 setGameState('SPINNING');
 
 // Set all to spinning
 setPlots(prev => prev.map(p => ({ ...p, hold: false, spinning: true, seed: getRandomSeed() })));

 // Stop reels one by one
 setTimeout(() => stopReel(0), 500);
 setTimeout(() => stopReel(1), 700);
 setTimeout(() => stopReel(2), 900);
 setTimeout(() => stopReel(3), 1100);
 setTimeout(() => { stopReel(4); setGameState('HOLDING'); }, 1300);
 };

 const handleReSpin = () => {
 if (currentAura < RESPIN_COST) return;
 
 // Check if any is un-held
 const anyUnheld = plots.some(p => !p.hold);
 if (!anyUnheld) {
 handleHarvest(); // Just harvest if all held
 return;
 }

 onUpdateAura(-RESPIN_COST);
 setGameState('SPINNING');
 
 // Spin only unheld
 setPlots(prev => prev.map(p => p.hold ? p : { ...p, spinning: true }));

 let delay = 500;
 plots.forEach((p, idx) => {
 if (!p.hold) {
 setTimeout(() => stopReel(idx), delay);
 delay += 200;
 }
 });

 setTimeout(() => {
 setGameState('IDLE');
 handleHarvest(); // Auto harvest after respin
 }, delay + 200);
 };

 const stopReel = (idx) => {
 playFarmSound('stop');
 setPlots(prev => prev.map((p, i) => i === idx ? { ...p, spinning: false, seed: getRandomSeed() } : p));
 };

 const toggleHold = (idx) => {
 if (gameState !== 'HOLDING') return;
 playFarmSound('hold');
 setPlots(prev => prev.map((p, i) => i === idx ? { ...p, hold: !p.hold } : p));
 };

 const handleHarvest = () => {
 setGameState('IDLE');
 
 // Extract actual seed objects
 const currentSeeds = plots.map(p => p.seed).filter(Boolean);
 if (currentSeeds.length < 5) return;

 const result = evaluateHand(currentSeeds);
 const payout = result.mult * result.base;
 
 if (payout > 0) {
 if (result.mult >= 15) playFarmSound('win_big');
 else playFarmSound('win_small');
 
 onUpdateAura(payout);
 setLastWin({ ...result, payout });
 
 // Trigger particles
 if (window.triggerDopaParticles) {
 const farmEl = document.getElementById('dopa-slots-farm');
 if (farmEl) {
 const rect = farmEl.getBoundingClientRect();
 window.triggerDopaParticles(rect.left + rect.width/2, rect.top + rect.height/2);
 }
 }
 }
 
 // Reset holds
 setPlots(prev => prev.map(p => ({ ...p, hold: false })));
 };

 return (
 <div id="dopa-slots-farm"className="relative w-full rounded-3xl overflow-hidden border-4 border-[#8B4513] select-none bg-[#1C1917] p-4 md:p-6 pb-8">
 
 {/* Las Vegas Style Marquee Header */}
 <div className="absolute top-0 left-0 right-0 h-8 flex justify-around items-center px-4 bg-[#451A03] border-b-4 border-[#78350F]">
 {[...Array(15)].map((_, i) => (
 <div key={i} className={`w-3 h-3 rounded-full bg-[#FDE047] shadow-[0_0_8px_#FACC15] ${i%2===0?'animate-pulse':''}`}></div>
 ))}
 </div>

 <div className="text-center mt-6 mb-6">
 <h2 className="font-display font-black text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-[#FDE047] to-[#D97706] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] uppercase tracking-wider"style={{ WebkitTextStroke: '1px #78350F' }}>
 Cassino-Agro
 </h2>
 <p className="text-[#A8A29E] font-bold text-xs uppercase tracking-[0.2em] mt-1">Plante. Gire. Fique Rico.</p>
 </div>

 {/* Win Banner */}
 <div className="h-20 flex items-center justify-center mb-6">
 {lastWin ? (
 <div className={`w-full max-w-sm mx-auto bg-gradient-to-r ${lastWin.color} rounded-2xl p-1 border-2 border-white/20 shadow-[0_0_20px_rgba(250,204,21,0.4)] animate-scale-in`}>
 <div className="bg-black/40 rounded-xl p-3 text-center backdrop-blur-sm">
 <h3 className="font-display font-black text-xl text-white uppercase tracking-wider">{lastWin.name}</h3>
 <div className="font-display font-black text-3xl text-[#FDE047] drop-">+{lastWin.payout.toLocaleString()} Aura</div>
 </div>
 </div>
 ) : (
 <div className="text-center">
 <div className="text-[#57534E] font-black text-lg">Gire para plantar!</div>
 </div>
 )}
 </div>

 {/* Slots / Plots */}
 <div className="grid grid-cols-5 gap-1.5 md:gap-3 max-w-2xl mx-auto">
 {plots.map((plot, idx) => {
 const Svg = plot.seed ? plot.seed.svg : null;
 
 return (
 <div key={plot.id} className="flex flex-col items-center">
 
 {/* Hold Indicator */}
 <div className={`h-6 mb-2 flex items-center justify-center transition-opacity ${plot.hold ? 'opacity-100' : 'opacity-0'}`}>
 <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Regado</span>
 </div>

 {/* Slot Box */}
 <button
 disabled={gameState !== 'HOLDING'}
 onClick={() => toggleHold(idx)}
 className={`w-full aspect-[3/4] relative rounded-xl border-4 transition-all duration-200 overflow-hidden 
 ${plot.hold ? 'border-blue-400 bg-blue-900/30' : 'border-[#78350F] bg-[#292524]'}
 ${gameState === 'HOLDING' && !plot.hold ? 'hover:border-yellow-600 cursor-pointer hover:bg-[#44403C]' : ''}
 ${gameState === 'SPINNING' && plot.spinning ? 'animate-reel-spin border-[#D97706]' : ''}
`}
 style={{ borderBottomWidth: '6px' }}
 >
 
 {/* Background dirt texture */}
 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiM0NTEBMDMiPjwvcmVjdD48cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzU3NTM0RSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjMiPjwvcGF0aD48L3N2Zz4=')] opacity-50"></div>

 <div className="absolute inset-0 flex items-center justify-center p-2 md:p-3">
 {plot.spinning ? (
 <div className="w-full h-full opacity-30 blur-[2px] scale-150 transition-all">
 {Svg && <Svg />}
 </div>
 ) : plot.seed ? (
 <div className="w-full h-full drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] animate-plot-pop">
 <Svg />
 </div>
 ) : (
 <Sprout className="w-10 h-10 text-[#57534E]"/>
 )}
 </div>

 {/* Glass reflection */}
 <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-lg"></div>
 </button>

 </div>
 )
 })}
 </div>

 {/* Control Panel */}
 <div className="max-w-2xl mx-auto mt-8 flex flex-col md:flex-row gap-4 justify-center items-center bg-[#292524] p-4 rounded-2xl border-2 border-[#44403C]">
 
 {/* Step 1: Initial Spin */}
 {(gameState === 'IDLE' || gameState === 'SPINNING') && (
 <button 
 onClick={handleInitialSpin}
 disabled={gameState === 'SPINNING' || currentAura < SPIN_COST}
 className={`w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-display font-black text-lg uppercase tracking-wider transition-all border-b-4 active:border-b-0 active:translate-y-1
 ${gameState === 'SPINNING' ? 'bg-gray-600 text-gray-400 border-gray-700' 
 : currentAura < SPIN_COST ? 'bg-red-900/50 text-red-500 border-red-900' 
 : 'bg-gradient-to-b from-[#22C55E] to-[#16A34A] text-white border-[#14532D] shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:scale-105'
 }
`}
 >
 {gameState === 'SPINNING' ? (
 <>Girando...</>
 ) : (
 <>
 <RotateCcw className="w-6 h-6"/> Plantar ({SPIN_COST})
 </>
 )}
 </button>
 )}

 {/* Step 2: Hold & ReSpin/Harvest */}
 {gameState === 'HOLDING' && (
 <div className="flex gap-3 w-full animate-fade-in-up">
 <button 
 onClick={handleReSpin}
 disabled={currentAura < RESPIN_COST}
 className={`flex-1 flex flex-col items-center justify-center px-4 py-3 rounded-xl font-display font-black uppercase transition-all border-b-4 active:border-b-0 active:translate-y-1
 ${currentAura < RESPIN_COST ? 'bg-red-900/50 text-red-500 border-red-900' 
 : 'bg-gradient-to-b from-[#0EA5E9] to-[#0284C7] text-white border-[#075985] '
 }
`}
 >
 <span className="flex items-center gap-2 text-lg"><RotateCcw className="w-5 h-5"/> Re-Plantar</span>
 <span className="text-[10px] text-sky-200">({RESPIN_COST} Aura)</span>
 </button>

 <button 
 onClick={handleHarvest}
 className="flex-1 flex flex-col items-center justify-center px-4 py-3 rounded-xl font-display font-black uppercase transition-all border-b-4 active:border-b-0 active:translate-y-1 bg-gradient-to-b from-[#FDE047] to-[#EAB308] text-[#713F12] border-[#A16207] shadow-[0_0_15px_rgba(250,204,21,0.5)] hover:scale-105"
 >
 <span className="flex items-center gap-2 text-lg"><CheckCircle2 className="w-5 h-5"/> Colher Agora</span>
 <span className="text-[10px] text-[#854D0E]">(Ficar com a mão)</span>
 </button>
 </div>
 )}

 </div>
 
 {/* Payout Table Helper */}
 <div className="max-w-xl mx-auto mt-6 text-center text-[#A8A29E] text-[10px] font-bold uppercase tracking-widest flex flex-wrap justify-center gap-x-4 gap-y-2 opacity-60 hover:opacity-100 transition-opacity">
 <span>Par: 2x</span>
 <span>Trinca: 5x</span>
 <span>Full House: 15x</span>
 <span>Quadra: 50x</span>
 <span className="text-[#FDE047]">Quina: 200x</span>
 </div>

 </div>
 );
}
