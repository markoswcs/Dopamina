import React from"react";

// ═══════════════════════════════════════════
// 🌾 PLANT SVGs (Mantidos e Melhorados)
// ═══════════════════════════════════════════
export const SeedSVGs = {
 wheat: () => (
 <svg viewBox="0 0 100 100"className="w-full h-full drop-">
 <path d="M50 90 L50 30"stroke="#EAB308"strokeWidth="6"strokeLinecap="round"fill="none"/>
 <path d="M50 80 Q60 60 50 30"stroke="#FDE047"strokeWidth="2"fill="none"/>
 <ellipse cx="50"cy="20"rx="6"ry="12"fill="#FACC15"/>
 <ellipse cx="40"cy="30"rx="5"ry="10"fill="#FACC15"transform="rotate(-30 40 30)"/>
 <ellipse cx="60"cy="30"rx="5"ry="10"fill="#FACC15"transform="rotate(30 60 30)"/>
 <ellipse cx="40"cy="45"rx="5"ry="10"fill="#FACC15"transform="rotate(-45 40 45)"/>
 <ellipse cx="60"cy="45"rx="5"ry="10"fill="#FACC15"transform="rotate(45 60 45)"/>
 <ellipse cx="45"cy="60"rx="4"ry="8"fill="#FACC15"transform="rotate(-60 45 60)"/>
 <ellipse cx="55"cy="60"rx="4"ry="8"fill="#FACC15"transform="rotate(60 55 60)"/>
 </svg>
 ),
 pumpkin: () => (
 <svg viewBox="0 0 100 100"className="w-full h-full drop-">
 <ellipse cx="50"cy="60"rx="35"ry="25"fill="#EA580C"/>
 <ellipse cx="35"cy="60"rx="15"ry="22"fill="#F97316"/>
 <ellipse cx="65"cy="60"rx="15"ry="22"fill="#F97316"/>
 <ellipse cx="50"cy="60"rx="15"ry="25"fill="#FB923C"/>
 <path d="M50 35 Q45 20 60 15"stroke="#16A34A"strokeWidth="6"fill="none"strokeLinecap="round"/>
 <path d="M50 35 Q30 40 20 50"stroke="#15803D"strokeWidth="3"fill="none"strokeLinecap="round"/>
 </svg>
 ),
 sunflower: () => (
 <svg viewBox="0 0 100 100"className="w-full h-full drop-">
 <path d="M50 50 L50 95"stroke="#16A34A"strokeWidth="6"strokeLinecap="round"/>
 <path d="M50 75 Q35 70 25 60"stroke="#16A34A"strokeWidth="4"fill="none"strokeLinecap="round"/>
 <path d="M50 85 Q65 80 75 70"stroke="#16A34A"strokeWidth="4"fill="none"strokeLinecap="round"/>
 {[0,45,90,135,180,225,270,315].map(deg => (
 <ellipse key={deg} cx="50"cy="20"rx="8"ry="20"fill="#FDE047"transform={`rotate(${deg} 50 40)`}/>
 ))}
 {[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map(deg => (
 <ellipse key={deg} cx="50"cy="25"rx="6"ry="15"fill="#FACC15"transform={`rotate(${deg} 50 40)`}/>
 ))}
 <circle cx="50"cy="40"r="16"fill="#713F12"/>
 <circle cx="50"cy="40"r="12"fill="#422006"stroke="#854D0E"strokeWidth="2"strokeDasharray="2 2"/>
 </svg>
 ),
 strawberry: () => (
 <svg viewBox="0 0 100 100"className="w-full h-full drop-">
 <path d="M50 90 Q30 70 35 40 Q50 30 65 40 Q70 70 50 90 Z"fill="#DC2626"/>
 <path d="M50 85 Q35 70 40 45 Q50 40 60 45 Q65 70 50 85 Z"fill="#EF4444"/>
 <path d="M50 35 L40 20 L50 25 L60 20 Z"fill="#16A34A"/>
 <path d="M50 35 L30 35 L45 30 Z"fill="#15803D"/>
 <path d="M50 35 L70 35 L55 30 Z"fill="#15803D"/>
 {[[45,50],[55,55],[50,65],[40,60],[60,65],[50,75],[45,80]].map((p,i) => (
 <circle key={i} cx={p[0]} cy={p[1]} r="1.5"fill="#FEF08A"/>
 ))}
 </svg>
 ),
 corn: () => (
 <svg viewBox="0 0 100 100"className="w-full h-full drop-">
 <path d="M50 95 L50 20"stroke="#15803D"strokeWidth="8"strokeLinecap="round"/>
 <path d="M50 80 Q20 50 30 20"stroke="#22C55E"strokeWidth="12"fill="none"strokeLinecap="round"/>
 <path d="M50 85 Q80 50 70 20"stroke="#16A34A"strokeWidth="12"fill="none"strokeLinecap="round"/>
 <rect x="42"y="25"width="16"height="40"rx="8"fill="#EAB308"/>
 <rect x="44"y="27"width="12"height="36"rx="6"fill="#FDE047"/>
 <path d="M44 32 L56 32 M44 38 L56 38 M44 44 L56 44 M44 50 L56 50 M44 56 L56 56"stroke="#CA8A04"strokeWidth="2"/>
 <line x1="50"y1="27"x2="50"y2="63"stroke="#CA8A04"strokeWidth="2"/>
 </svg>
 ),
 watermelon: () => (
 <svg viewBox="0 0 100 100"className="w-full h-full drop-">
 <ellipse cx="50"cy="65"rx="38"ry="28"fill="#14532D"/>
 <path d="M15 60 Q50 95 85 60"stroke="#15803D"strokeWidth="6"fill="none"/>
 <path d="M22 50 Q50 85 78 50"stroke="#15803D"strokeWidth="6"fill="none"/>
 <path d="M30 42 Q50 75 70 42"stroke="#15803D"strokeWidth="6"fill="none"/>
 <path d="M40 38 Q50 65 60 38"stroke="#15803D"strokeWidth="6"fill="none"/>
 <ellipse cx="50"cy="60"rx="8"ry="4"fill="#E2E8F0"opacity="0.3"transform="rotate(-15 50 60)"/>
 </svg>
 ),
 dopaFruit: () => (
 <svg viewBox="0 0 100 100"className="w-full h-full drop-">
 <circle cx="50"cy="60"r="30"fill="#6D28D9"/>
 <circle cx="50"cy="60"r="26"fill="#8B5CF6"/>
 <circle cx="40"cy="50"r="8"fill="#C4B5FD"opacity="0.5"/>
 <path d="M50 30 Q65 10 80 20"stroke="#4C1D95"strokeWidth="5"fill="none"strokeLinecap="round"/>
 <path d="M50 30 Q35 15 25 25"stroke="#4C1D95"strokeWidth="3"fill="none"strokeLinecap="round"/>
 <path d="M45 35 L55 35 L50 25 Z"fill="#16A34A"/>
 <circle cx="50"cy="60"r="5"fill="#FDE047"className="animate-pulse"/>
 <circle cx="50"cy="60"r="10"fill="none"stroke="#FDE047"strokeWidth="2"opacity="0.5"className="animate-ping"/>
 </svg>
 ),
 moneyTree: () => (
 <svg viewBox="0 0 100 100"className="w-full h-full drop-">
 <path d="M45 95 L45 50 L55 50 L55 95 Z"fill="#78350F"/>
 <path d="M50 60 L30 45 M50 70 L70 50"stroke="#78350F"strokeWidth="6"strokeLinecap="round"/>
 <circle cx="35"cy="40"r="18"fill="#059669"/><circle cx="65"cy="45"r="18"fill="#047857"/>
 <circle cx="50"cy="25"r="22"fill="#10B981"/>
 <circle cx="35"cy="40"r="14"fill="#34D399"/><circle cx="65"cy="45"r="14"fill="#34D399"/>
 <circle cx="50"cy="25"r="16"fill="#34D399"/>
 <text x="50"y="32"fontSize="20"fill="#064E3B"textAnchor="middle"fontWeight="bold"fontFamily="sans-serif">$</text>
 <text x="35"y="45"fontSize="14"fill="#064E3B"textAnchor="middle"fontWeight="bold"fontFamily="sans-serif">$</text>
 <text x="65"y="50"fontSize="14"fill="#064E3B"textAnchor="middle"fontWeight="bold"fontFamily="sans-serif">$</text>
 </svg>
 ),
 dragonFruit: () => (
 <svg viewBox="0 0 100 100"className="w-full h-full drop-">
 <ellipse cx="50"cy="60"rx="28"ry="35"fill="#BE185D"/>
 <ellipse cx="50"cy="60"rx="24"ry="30"fill="#E11D48"/>
 <path d="M22 60 Q10 50 15 35 Q25 45 28 50 Z"fill="#84CC16"/>
 <path d="M78 60 Q90 50 85 35 Q75 45 72 50 Z"fill="#84CC16"/>
 <path d="M26 40 Q15 25 25 15 Q35 25 35 30 Z"fill="#84CC16"/>
 <path d="M74 40 Q85 25 75 15 Q65 25 65 30 Z"fill="#84CC16"/>
 <path d="M50 25 Q50 5 60 10 Q55 20 50 25 Z"fill="#84CC16"/>
 <path d="M40 35 Q35 15 45 20 Q45 25 40 35 Z"fill="#A3E635"/>
 <path d="M60 35 Q65 15 55 20 Q55 25 60 35 Z"fill="#A3E635"/>
 </svg>
 ),
 goldenApple: () => (
 <svg viewBox="0 0 100 100"className="w-full h-full drop-">
 <path d="M50 85 C20 85, 15 30, 50 35 C85 30, 80 85, 50 85 Z"fill="#EAB308"/>
 <path d="M50 80 C25 80, 25 35, 50 40 C75 35, 75 80, 50 80 Z"fill="#FDE047"/>
 <path d="M50 35 Q55 10 65 15"stroke="#713F12"strokeWidth="5"fill="none"strokeLinecap="round"/>
 <path d="M50 35 Q40 20 30 25 Z"fill="#16A34A"/>
 <ellipse cx="35"cy="45"rx="6"ry="12"fill="#FEF08A"transform="rotate(-20 35 45)"/>
 <path d="M30 75 Q50 85 70 75"stroke="#CA8A04"strokeWidth="3"fill="none"/>
 </svg>
 )
};

// ═══════════════════════════════════════════
// 🎰 CASSINO-AGRO: SEEDS & WEIGHTS
// ═══════════════════════════════════════════
export const SLOT_SEEDS = [
 { id: 'wheat', name: 'Trigo', svg: SeedSVGs.wheat, baseValue: 10, weight: 150 },
 { id: 'pumpkin', name: 'Abóbora', svg: SeedSVGs.pumpkin, baseValue: 25, weight: 100 },
 { id: 'sunflower', name: 'Girassol', svg: SeedSVGs.sunflower, baseValue: 60, weight: 80 },
 { id: 'strawberry', name: 'Morango', svg: SeedSVGs.strawberry, baseValue: 120, weight: 60 },
 { id: 'corn', name: 'Milho', svg: SeedSVGs.corn, baseValue: 300, weight: 40 },
 { id: 'watermelon', name: 'Melancia', svg: SeedSVGs.watermelon, baseValue: 800, weight: 25 },
 { id: 'dopaFruit', name: 'Dopa-Fruta', svg: SeedSVGs.dopaFruit, baseValue: 2500, weight: 12 },
 { id: 'moneyTree', name: 'Árvore Dinheiro', svg: SeedSVGs.moneyTree, baseValue: 8000, weight: 5 },
 { id: 'dragonFruit', name: 'Fruta do Dragão', svg: SeedSVGs.dragonFruit, baseValue: 25000, weight: 2 },
 { id: 'goldenApple', name: 'Maçã Dourada', svg: SeedSVGs.goldenApple, baseValue: 100000, weight: 1 },
];

const totalWeight = SLOT_SEEDS.reduce((acc, s) => acc + s.weight, 0);

export const getRandomSeed = () => {
 let rand = Math.random() * totalWeight;
 for (let seed of SLOT_SEEDS) {
 if (rand < seed.weight) return seed;
 rand -= seed.weight;
 }
 return SLOT_SEEDS[0];
};

// ═══════════════════════════════════════════
// 🃏 POKER HAND EVALUATION
// ═══════════════════════════════════════════
export const evaluateHand = (plots) => {
 // plots is an array of 5 seed objects
 const counts = {};
 plots.forEach(p => { counts[p.id] = (counts[p.id] || 0) + 1; });
 
 const values = Object.values(counts).sort((a,b) => b - a); // e.g. [3, 2] for full house
 
 // Find highest base value among the most frequent crops
 let maxBaseVal = 0;
 for (const [id, count] of Object.entries(counts)) {
 if (count === values[0]) {
 const seed = SLOT_SEEDS.find(s => s.id === id);
 if (seed.baseValue > maxBaseVal) maxBaseVal = seed.baseValue;
 }
 }

 // Hand combinations
 if (values[0] === 5) {
 return { name:"QUINA DE OURO!", mult: 200, base: maxBaseVal, color:"from-yellow-400 to-amber-600"};
 }
 if (values[0] === 4) {
 return { name:"Quadra!", mult: 50, base: maxBaseVal, color:"from-fuchsia-500 to-purple-700"};
 }
 if (values[0] === 3 && values[1] === 2) {
 return { name:"Full House!", mult: 15, base: maxBaseVal, color:"from-blue-400 to-blue-700"};
 }
 if (values[0] === 3) {
 return { name:"Trinca!", mult: 5, base: maxBaseVal, color:"from-emerald-400 to-emerald-700"};
 }
 if (values[0] === 2 && values[1] === 2) {
 return { name:"Dois Pares", mult: 3, base: maxBaseVal, color:"from-orange-400 to-orange-700"};
 }
 if (values[0] === 2) {
 return { name:"Um Par", mult: 2, base: maxBaseVal, color:"from-zinc-400 to-zinc-600"};
 }
 
 return { name:"Carta Alta", mult: 1, base: maxBaseVal, color:"from-zinc-700 to-zinc-900"};
};

// ═══════════════════════════════════════════
// 🎵 SOUNDS (uses global AudioManager singleton)
// ═══════════════════════════════════════════
import { playFarmSpin, playFarmStop, playWinSmall, playWinBig as playWinBigSound, playFarmHold } from"../audioManager";

export const playFarmSound = (type) => {
 if (type === 'spin') playFarmSpin();
 else if (type === 'stop') playFarmStop();
 else if (type === 'win_small') playWinSmall();
 else if (type === 'win_big') playWinBigSound();
 else if (type === 'hold') playFarmHold();
};
