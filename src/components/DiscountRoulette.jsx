import React, { useState, useRef, useEffect } from"react";
import { createPortal } from"react-dom";
import { ArrowLeft, Heart, Volume2, VolumeX, FastForward, Zap, Star, ChevronDown, Settings, Lock, Coins, Search, Trophy, History, Shield, Info, Gift, Flame, Target, Crown, ShieldAlert, CheckCircle2, AlertTriangle, AlertCircle, TrendingUp, TrendingDown, ArrowRight, X, Loader2, Sparkles, Diamond, Medal } from"lucide-react";
import confetti from"canvas-confetti";
import { playHover as playHoverAM, playClick as playClickAM, playCSWinSynth, playRouletteTickCS, initAudio } from"../audioManager";
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { cs2Items } from '../data/cs2Items';

const CSGO_API_URL = 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/crates.json';

const rarities = {
 milspec: { name: 'Nível Militar', color: 'text-blue-500', hex: '#3b82f6', bg: 'from-blue-900 to-black', border: 'border-blue-600', glow: 'shadow-[0_0_10px_rgba(37,99,235,0.3)]' },
 restricted: { name: 'Restrito', color: 'text-purple-500', hex: '#a855f7', bg: 'from-purple-900 to-black', border: 'border-purple-600', glow: 'shadow-[0_0_15px_rgba(147,51,234,0.4)]' },
 classified: { name: 'Confidencial', color: 'text-pink-400', hex: '#f472b6', bg: 'from-pink-900 to-black', border: 'border-pink-500', glow: 'shadow-[0_0_20px_rgba(236,72,153,0.5)]' },
 covert: { name: 'Oculto', color: 'text-red-500', hex: '#ef4444', bg: 'from-red-900 to-black', border: 'border-red-600', glow: 'shadow-[0_0_30px_rgba(220,38,38,0.6)]' },
 gold: { name: 'Item Especial', color: 'text-yellow-400', hex: '#facc15', bg: 'from-yellow-700 to-black', border: 'border-yellow-400', glow: 'shadow-[0_0_40px_rgba(250,204,21,0.8)]' },
};

const ITEM_SIZE = 154; 

const GOLD_PLACEHOLDER = {
 id: 'gold-placeholder',
 name: '★ Rare Special Item ★',
 rarity: 'gold',
 icon: '★',
 image: '/images/rare_special_item.webp',
 price: 0,
 isPlaceholder: true
};

const getRandomItem = (caseItems) => {
 const rand = Math.random() * 100;
 let rarityStr = 'milspec';
 
 // Chances Reais Oficiais do CS:GO
 if (rand <= 0.256) rarityStr = 'gold'; // 0.256%
 else if (rand <= 0.895) rarityStr = 'covert'; // 0.639% (0.256 + 0.639)
 else if (rand <= 4.092) rarityStr = 'classified'; // 3.197% (0.895 + 3.197)
 else if (rand <= 20.077) rarityStr = 'restricted'; // 15.985% (4.092 + 15.985)
 else rarityStr = 'milspec'; // 79.923%

 let pool = caseItems.filter(i => i.rarity === rarityStr);
 if (pool.length === 0) pool = caseItems.filter(i => i.rarity === 'milspec');
 if (pool.length === 0) pool = caseItems; // Fallback extremo para evitar crash
 return pool[Math.floor(Math.random() * pool.length)];
};

let lastTickTime = 0;

const generateTrack = (winnerIndex, forcedWinner, caseItems) => {
 const track = [];
 for (let i = 0; i < 100; i++) {
 if (i === winnerIndex && forcedWinner) {
 track.push({ id: i, item: forcedWinner, rData: rarities[forcedWinner.rarity] });
 } else {
 const item = getRandomItem(caseItems);
 track.push({ id: i, item, rData: rarities[item.rarity] });
 }
 }
 return track;
};

const HexagonBg = ({ color, glow = true }) => (
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-[0.85]">
 {/* Outer Hexagon - faint and thin */}
 <svg viewBox="0 0 100 115"className="absolute w-[115%] h-[115%] z-0 opacity-30"style={{ color }}>
 <polygon points="50,2 98,28 98,87 50,113 2,87 2,28"fill="transparent"stroke="currentColor"strokeWidth="1"/>
 </svg>
 {/* Inner Hexagon - thick, bright, matching rarity */}
 <svg viewBox="0 0 100 115"className="absolute w-full h-full z-0 opacity-100"style={{ color }}>
 <polygon points="50,2 98,28 98,87 50,113 2,87 2,28"fill="currentColor"fillOpacity="0.05"stroke="currentColor"strokeWidth="2.5"style={glow ? {filter:`drop-shadow(0 0 6px ${color})`} : {}} />
 </svg>
 </div>
);

const HexagonSVG = ({ color, opacity ="0.1"}) => (
 <svg viewBox="0 0 100 115"className="absolute inset-0 w-full h-full z-0 drop-"style={{ color }}>
 <polygon points="50,2 98,28 98,87 50,113 2,87 2,28"fill="transparent"stroke="currentColor"strokeWidth="2"/>
 <polygon points="50,2 98,28 98,87 50,113 2,87 2,28"fill="currentColor"opacity={opacity} />
 </svg>
);

const HexButton = ({ children, active, onClick, title }) => (
 <button onClick={onClick} title={title} className="w-10 h-10 md:w-12 md:h-12 relative flex items-center justify-center text-zinc-400 hover:text-white transition-all group cursor-pointer hover:scale-110 active:scale-95 touch-manipulation">
 <svg viewBox="0 0 100 115"className={`absolute inset-0 w-full h-full transition-colors ${active ? 'text-zinc-600' : 'text-zinc-800 group-hover:text-zinc-700'}`}>
 <polygon points="50,2 98,28 98,87 50,113 2,87 2,28"fill="currentColor"stroke="rgba(255,255,255,0.1)"strokeWidth="2"/>
 </svg>
 <div className="relative z-10">{children}</div>
 </button>
);

export default function DiscountRoulette({ coinBalance, onUpdateCoins, onNavigateToUpgrade, onToast }) {
 const { user } = useAuth();
 const [tab, setTab] = useState('cases'); // 'cases' | 'inventory'
 const [view, setView] = useState('selector'); // 'selector' | 'opener'

 const [activeCase, setActiveCase] = useState(null);
 const [tracks, setTracks] = useState([]);
 const [searchQuery, setSearchQuery] = useState("");
 const [inventory, setInventory] = useState([]);
 
 const [spinning, setSpinning] = useState(false);
 const [finished, setFinished] = useState(false);
 const [offsets, setOffsets] = useState([]);
 const [winnerIndices, setWinnerIndices] = useState([]);
 const [results, setResults] = useState([]);
 const [showPopup, setShowPopup] = useState(false);
 const [openCount, setOpenCount] = useState(1);
 const [trackDurations, setTrackDurations] = useState([]);
 const [muted, setMuted] = useState(false);
 const [autoOpen, setAutoOpen] = useState(false);
 const autoOpenRef = useRef(false);
 const multiplierRef = useRef(1.00);
 const isHandlingEndRef = useRef(false);
 const rafRef = useRef(null);
 const [forceGold, setForceGold] = useState(false);
 const [autoOpenTrigger, setAutoOpenTrigger] = useState(0);
 const [favoriteCases, setFavoriteCases] = useState(() => {
 try { return JSON.parse(localStorage.getItem('dopashop_fav_cases')) || []; } catch { return []; }
 });
 const [vaultFilter, setVaultFilter] = useState('recent');
 const [isFilterOpen, setIsFilterOpen] = useState(false);
 
 const containerRefs = useRef([]);

 const [casesData, setCasesData] = useState([]);
 const [loadingCases, setLoadingCases] = useState(true);

 // Gold Spin State
 const [pendingGoldSpins, setPendingGoldSpins] = useState([]);
 const [finalWinners, setFinalWinners] = useState([]);
 const [goldRouletteActive, setGoldRouletteActive] = useState(false);
 const [goldTrack, setGoldTrack] = useState([]);
 const [goldOffset, setGoldOffset] = useState(0);
 const [goldSpinning, setGoldSpinning] = useState(false);
 const [goldWinnerIndex, setGoldWinnerIndex] = useState(0);
 const goldContainerRef = useRef(null);

 const getCasePrice = (c, count) => {
 if (!c) return 0;
 return c.price * count;
 };

 useEffect(() => {
 // Preload da imagem do rare special item para evitar delay (piscar)
 const img = new Image();
 img.src = '/images/rare_special_item.webp';

 // Auto-clear do cache do inventário (cookie) para limpar lag acumulado antigo
 if (localStorage.getItem('force_reset_done_v2') !== 'true') {
 localStorage.removeItem('dopashop_inventory');
 localStorage.setItem('force_reset_done_v2', 'true');
 }

 fetch(CSGO_API_URL)
 .then(res => res.json())
 .then(data => {
 const famousCapsules = ["Sticker Capsule","Sticker Capsule 2","EMS Katowice 2014 Challengers","EMS Katowice 2014 Legends"];
 const cases = data.filter(c => (c.type === 'Case' || famousCapsules.includes(c.name)) && c.contains && c.contains.length > 0);
 
 const transformedCases = cases.map(c => {
 
 // Preços balanceados para a economia de Dopas
 const priceMap = {
"Kilowatt": 25.00,
"Fracture": 30.00,
"Revolution": 35.00,
"Recoil": 40.00,
"Snakebite": 50.00,
"Danger Zone": 75.00,
"Dreams & Nightmares": 90.00,
"Prisma 2": 120.00,
"Shattered Web": 150.00,
"Phoenix": 180.00,
"Broken Fang": 250.00,
"Breakout": 300.00,
"Spectrum": 350.00,
"Huntsman": 450.00,
"Riptide": 600.00,
"Weapon Case 3": 800.00,
"Weapon Case 2": 1000.00,
"Hydra": 1250.00,
"Bravo": 1500.00,
"Sticker Capsule": 15.00,
"Sticker Capsule 2": 150.00,
"EMS Katowice 2014 Challengers": 5000.00,
"EMS Katowice 2014 Legends": 5000.00,
 };
 
 let casePrice = c.type === 'Sticker Capsule' ? 15.00 : 45.00; // Fallback
 if (c.name ==="CS:GO Weapon Case") {
 casePrice = 2500.00; // Item lendário, custa todo o saldo inicial
 } else {
 for (const [key, val] of Object.entries(priceMap)) {
 if (c.name.includes(key)) {
 casePrice = val;
 break;
 }
 }
 }

 const mapRarity = (item) => {
 if (!item.rarity) return 'milspec';
 if (item.rarity.color === '#eb4b4b') return 'covert';
 if (item.rarity.color === '#d32ce6') return 'classified';
 if (item.rarity.color === '#8847ff') return 'restricted';
 if (item.rarity.color === '#4b69ff') return 'milspec';
 return 'milspec';
 };

 const parseItem = (item, isRare = false) => {
  let r = isRare ? 'gold' : mapRarity(item);
  
  // Buscar o item real no banco de dados sincronizado
  let realItem = null;
  if (cs2Items && cs2Items.length > 0) {
    // Tenta correspondência exata primeiro
    realItem = cs2Items.find(i => i.name === item.name);
    // CSGO-API normalmente passa só o nome da arma sem o desgaste (ex: AK-47 | Redline), vamos puxar a versão Field-Tested ou a primeira que bater
    if (!realItem && item.name.includes('|')) {
      realItem = cs2Items.find(i => i.name.includes(item.name) && i.name.includes('(Field-Tested)'));
    }
    // Fallback: qualquer versão da skin
    if (!realItem) {
      realItem = cs2Items.find(i => i.name.includes(item.name));
    }
  }

  let price = 0;
  const defaultPrices = [110, 165, 220, 330, 440];
  const isDefaultPrice = realItem && defaultPrices.includes(realItem.price);
  
  if (realItem && realItem.price && !isDefaultPrice && realItem.price > 500) {
    price = realItem.price;
  } else {
    // Usar fallback de preço dinâmico baseado na raridade e preço da caixa
    let hash = 0;
    for (let ch = 0; ch < item.name.length; ch++) hash = item.name.charCodeAt(ch) + ((hash << 5) - hash);
    const variation = (Math.abs(hash) % 1000) / 1000;
    
    if(r === 'milspec') price = casePrice * (0.15 + variation * 0.20);
    else if(r === 'restricted') price = casePrice * (0.6 + variation * 0.4);
    else if(r === 'classified') price = casePrice * (2.5 + variation * 2.5);
    else if(r === 'covert') price = casePrice * (10.0 + variation * 10.0);
    else if(r === 'gold') price = casePrice * (50.0 + variation * 100.0);
    else price = casePrice * 0.5;
  }

  return {
  id: realItem ? realItem.id : (item.id ||`rare-${item.name.replace(/\s/g, '-')}`),
  rarity: r,
  name: realItem ? realItem.name : item.name,
  icon: isRare ? '🔪' : (item.name.includes('AWP') || item.name.includes('SSG') ? '🔭' : (item.name.includes('Gloves') || item.name.includes('Hand Wraps') ? '🧤' : '🔫')),
  price: parseFloat(price.toFixed(2)),
  image: realItem ? (realItem.image || item.image) : item.image
  };
  };

 let allItems = [];
 if(c.contains) {
 allItems = [...allItems, ...c.contains.map(i => parseItem(i, false))];
 }
 let realRareItems = [];
 if(c.contains_rare) {
 realRareItems = c.contains_rare.map(i => parseItem(i, true));
 if (realRareItems.length > 0) {
 // Add exactly one placeholder so the main roulette sees it as the 'gold' rarity item
 allItems.push(GOLD_PLACEHOLDER);
 }
 }

 return {
 id: c.id,
 name: c.name,
 image: c.image,
 price: casePrice,
 items: allItems,
 real_rare_items: realRareItems
 };
 });
 
 setCasesData([...transformedCases.reverse()]);
 setLoadingCases(false);
 })
 .catch(err => {
 console.error("Erro ao carregar caixas da API:", err);
 setLoadingCases(false);
 });
 }, []);

 const fetchInventory = async () => {
 if (!user) return;
 const { data, error } = await supabase.from('inventory').select('*').eq('user_id', user.id);
 if (!error && data) setInventory(data);
 };

 useEffect(() => {
 fetchInventory();
 }, [tab, showPopup, user]);

 useEffect(() => {
 const doInit = () => initAudio();
 window.addEventListener('click', doInit, { once: true });
 window.addEventListener('touchstart', doInit, { once: true });
 return () => {
 window.removeEventListener('click', doInit);
 window.removeEventListener('touchstart', doInit);
 };
 }, []);

 useEffect(() => {
 autoOpenRef.current = autoOpen;
 }, [autoOpen]);

 // Auto-open effect: triggers openCase with fresh state
 useEffect(() => {
 if (autoOpenTrigger > 0) {
 openCase();
 }
 }, [autoOpenTrigger]);

 useEffect(() => {
 const handleKeyDown = (e) => {
 if (e.key === 'F9') {
 setForceGold(true);
 console.log("F9 Cheat Activated: Next spin will be GOLD!");
 }
 };
 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, []);

 const playTick = () => {
 if (muted) return;
 const now = performance.now();
 // Throttle to 35ms to prevent audio clipping when 5 cases spin at once
 if (now - lastTickTime < 35) return; 
 lastTickTime = now;
 
 playRouletteTickCS();
 };

 const playWinSound = (rarity) => {
 if (muted) return;
 
 // Synth layer per rarity (uses global AudioManager)
 playCSWinSynth(rarity);
 };

 const playAcceptSound = () => {
 if (muted) return;
 playClickAM();
 };

 const playHoverSound = () => {
 if (muted) return;
 playHoverAM();
 };

 const playClickSound = () => {
 if (muted) return;
 playClickAM();
 };

 const sellItemNow = async () => {
 if (!results || results.length === 0 || !user) return;
 const currentResults = [...results];
 setResults([]);
 let totalSold = 0;
 for (const res of currentResults) {
 const item = res.item;
 totalSold += item.price || 0;
 // Find the matching inventory row
 const { data: rows } = await supabase.from('inventory').select('*').eq('user_id', user.id).eq('item_name', item.name).limit(1);
 if (rows && rows.length > 0) {
 const row = rows[0];
 if (row.count > 1) await supabase.from('inventory').update({ count: row.count - 1 }).eq('id', row.id);
 else await supabase.from('inventory').delete().eq('id', row.id);
 }
 }
 if (totalSold > 0 && onUpdateCoins) onUpdateCoins(totalSold);
 playAcceptSound();
 fetchInventory();
 setShowPopup(false);
 setFinished(false);
 };

 const sellInventoryItem = async (item) => {
 if (!user) return;
 if (item.count > 1) {
 await supabase.from('inventory').update({ count: item.count - 1 }).eq('id', item.id);
 } else {
 await supabase.from('inventory').delete().eq('id', item.id);
 }
 if (onUpdateCoins) onUpdateCoins(item.price || 0);
 fetchInventory();
 };

  const toggleLockItem = async (item) => {
    if (!user || !item?.id) return;
    playClickSound();
    const newLock = !item.locked;
    setInventory(prev => prev.map(i => i.id === item.id ? { ...i, locked: newLock, is_locked: newLock } : i));
    await supabase.from('inventory').update({ is_locked: newLock }).eq('id', item.id);
  };

 const sellAllItems = async () => {
 if (!user || inventory.length === 0) return;
 const total = inventory.reduce((sum, i) => sum + ((i.price || 0) * (i.count || 1)), 0);
 const ids = inventory.map(i => i.id);
 await supabase.from('inventory').delete().in('id', ids);
 if (onUpdateCoins) onUpdateCoins(total);
 playAcceptSound();
 setInventory([]);
 };

 const handleSelectCase = (c) => {
 playClickSound();
 setActiveCase(c);
 setTracks([generateTrack(0, null, c.items).slice(0, 20)]);
 setOffsets([0]);
 setView('opener');
 };

  const openCase = async () => {
  if (!activeCase || spinning) return;
  if (!user) {
   if (onToast) onToast({ title: '🔒 Login Necessário', message: 'Você precisa entrar na sua conta para abrir caixas!' });
   return;
  }
 if (coinBalance < getCasePrice(activeCase, openCount)) {
  if (onToast) onToast({ title: '💰 Saldo Insuficiente', message: 'Você precisa de mais Dopas!' });
  return;
 }
 
 isHandlingEndRef.current = false;
 if (onUpdateCoins) onUpdateCoins(-getCasePrice(activeCase, openCount));
 
 // Update cases_opened stat
 const { data: profile } = await supabase.from('profiles').select('cases_opened').eq('id', user.id).single();
 if (profile) {
   await supabase.from('profiles').update({ cases_opened: (profile.cases_opened || 0) + openCount }).eq('id', user.id);
 }
 
 setResults([]);
 
 // CRÍTICO: Não ative 'spinning' ainda, caso contrário o reset para offset 0 vai ser animado em 6.5s (o que causa o bug de"roleta travada/voltando")
 setSpinning(false); 
 setFinished(false);
 setResults([]);
 setShowPopup(false);
 setPendingGoldSpins([]);
 setFinalWinners([]);



 const newTracks = [];
 const newIndices = [];
 const newOffsets = [];
 
 const goldPool = activeCase.items.filter(i => i.rarity === 'gold');
 const forcedWinner = forceGold && goldPool.length > 0 ? goldPool[Math.floor(Math.random() * goldPool.length)] : null;
 if (forceGold) setForceGold(false);

 for (let i = 0; i < openCount; i++) {
 const newWinnerIndex = 75 + Math.floor(Math.random() * 15);
 newIndices.push(newWinnerIndex);
 
 // Each track rolls its own independent winner
 const winnerItem = forcedWinner || getRandomItem(activeCase.items);
 newTracks.push(generateTrack(newWinnerIndex, winnerItem, activeCase.items));
 newOffsets.push(0);
 }

 // Staggered durations so each track stops at a different time
 const baseDuration = 6.5;
 const newDurations = [];
 for (let i = 0; i < openCount; i++) {
 newDurations.push(baseDuration + (i * 0.8) + (Math.random() * 0.4));
 }
 setTrackDurations(newDurations);

 setWinnerIndices(newIndices);
 setTracks(newTracks);
 setOffsets(newOffsets);

 // Usa double requestAnimationFrame para garantir que o CSS aplique o reset (transition: none)
 // antes de adicionar a animação novamente, evitando que a roleta deslize para trás.
 requestAnimationFrame(() => {
 requestAnimationFrame(() => {
 if (!containerRefs.current[0]) return;
 
 setSpinning(true);

 const targetOffsets = newIndices.map(wIndex => {
 const randomStopOffset = Math.floor(Math.random() * 140) - 70;
 return -((wIndex * ITEM_SIZE) + randomStopOffset);
 });
 setOffsets(targetOffsets);

 // Safety timeout to trigger handleSpinEnd in case transitionEnd fails (e.g. tab unfocused)
 const maxDuration = Math.max(...newDurations);
 setTimeout(() => {
 if (spinning && !finished) {
 handleSpinEnd(); 
 }
 }, (maxDuration * 1000) + 1000);

 let currentItemIndex = 0;
 let animationFrameId;

 const checkPosition = () => {
 const mainContainer = containerRefs.current[openCount - 1];
 if (!mainContainer) return;
 const style = window.getComputedStyle(mainContainer);
 let currentPos = 0;
 const match3d = style.transform.match(/matrix3d\((.+)\)/);
 if (match3d) {
 const values = match3d[1].split(', ');
 currentPos = Math.abs(parseFloat(values[12]));
 } else {
 const match2d = style.transform.match(/matrix\((.+)\)/);
 if (match2d) {
 const values = match2d[1].split(', ');
 currentPos = Math.abs(parseFloat(values[4]));
 }
 }

 const index = Math.floor((currentPos + (ITEM_SIZE/2)) / ITEM_SIZE);
 
 if (index > currentItemIndex) {
 currentItemIndex = index;
 playTick();
 }
 
 if (mainContainer.dataset.spinning === 'true') {
 animationFrameId = requestAnimationFrame(checkPosition);
 }
 };
 
 containerRefs.current[openCount - 1].dataset.spinning = 'true';
 animationFrameId = requestAnimationFrame(checkPosition);
 });
 });
 };

 const handleSpinEnd = (e) => {
 const isGoldSpin = pendingGoldSpins.length > 0;
 const targetIdx = isGoldSpin ? pendingGoldSpins[0].trackIndex : (openCount - 1);
 const targetRef = containerRefs.current[targetIdx];
 
 // Ignore transitionEnd events from child elements
 if (e && e.target !== targetRef) return;
 if (e && e.propertyName && e.propertyName !== 'transform') return;
  if (targetRef) targetRef.dataset.spinning = 'false';
  
  if (isHandlingEndRef.current) return;
  isHandlingEndRef.current = true;

  if (isGoldSpin) {
  // Do NOT set spinning to false here, keep it true so the user can't click 'Girar' during the 3s delay
  const currentGold = pendingGoldSpins[0];
 const trackIdx = currentGold.trackIndex;
 
 const actualWinner = tracks[trackIdx][winnerIndices[trackIdx]];
 playWinSound('gold');
 if (typeof confetti !== 'undefined') confetti({ particleCount: 400, spread: 160, origin: { y: 0.5 }, zIndex: 99999 });
 
 const updatedWinners = [...finalWinners];
 updatedWinners[trackIdx] = JSON.parse(JSON.stringify(actualWinner));
 
 const remainingGolds = pendingGoldSpins.slice(1);
  setPendingGoldSpins(remainingGolds);
  setFinalWinners(updatedWinners);
  
  setTimeout(() => {
    isHandlingEndRef.current = false;
    startNextGoldSpin(remainingGolds, updatedWinners);
  }, 3000);
  return;
  }

  // Normal spin end
  setFinished(true);
  setSpinning(false);

 const winners = [];
 const golds = [];
 for(let i = 0; i < openCount; i++){
 if(tracks[i] && tracks[i][winnerIndices[i]]) {
 const w = JSON.parse(JSON.stringify(tracks[i][winnerIndices[i]]));
 winners.push(w);
 if (w.item.isPlaceholder) {
 golds.push({ ...w, trackIndex: i });
 }
 }
 }
  if (winners.length === 0) {
    isHandlingEndRef.current = false;
    return;
  }
  
  if (golds.length > 0) {
  setFinalWinners(winners);
  setPendingGoldSpins(golds);
  setFinished(false); // We are not fully finished yet!
  isHandlingEndRef.current = false;
  startNextGoldSpin(golds, winners);
  } else {
  isHandlingEndRef.current = false;
  finalizeResults(winners);
  }
  };

 const startNextGoldSpin = (pendingGolds, currentFinalWinners) => {
 if (pendingGolds.length === 0) {
 setFinished(true);
 finalizeResults(currentFinalWinners);
 return;
 }
 
 const currentGold = pendingGolds[0];
 const trackIdx = currentGold.trackIndex;
 
 const pool = activeCase.real_rare_items && activeCase.real_rare_items.length > 0 ? activeCase.real_rare_items : activeCase.items;
 const wIndex = 75 + Math.floor(Math.random() * 15);
 const wItem = pool[Math.floor(Math.random() * pool.length)];
 
 const track = [];
 for (let i = 0; i < 100; i++) {
 if (i === wIndex) track.push({ id: i, item: wItem, rData: rarities['gold'] });
 else track.push({ id: i, item: pool[Math.floor(Math.random() * pool.length)], rData: rarities['gold'] });
 }
 
 setTracks(prev => {
 const newTracks = [...prev];
 newTracks[trackIdx] = track;
 return newTracks;
 });
 
 setOffsets(prev => {
 const newOffsets = [...prev];
 newOffsets[trackIdx] = 0;
 return newOffsets;
 });
 
 setWinnerIndices(prev => {
 const newIndices = [...prev];
 newIndices[trackIdx] = wIndex;
 return newIndices;
 });
 
 setTrackDurations(prev => {
 const newDurations = [...prev];
 newDurations[trackIdx] = 6.5; 
 return newDurations;
 });
 
 setSpinning(false);
 
 requestAnimationFrame(() => {
 requestAnimationFrame(() => {
 setSpinning(true);
 const randomStopOffset = Math.floor(Math.random() * 140) - 70;
 setOffsets(prev => {
 const newOffsets = [...prev];
 newOffsets[trackIdx] = -((wIndex * ITEM_SIZE) + randomStopOffset);
 return newOffsets;
 });
 playWinSound('gold');
 
 // Safety timeout
 setTimeout(() => {
 if (spinning && !finished) handleSpinEnd();
 }, 8000);
 
 let currentItemIndex = 0;
 let animationFrameId;
 const checkPosition = () => {
 const mainContainer = containerRefs.current[trackIdx];
 if (!mainContainer) return;
 const style = window.getComputedStyle(mainContainer);
 let currentPos = 0;
 const match3d = style.transform.match(/matrix3d\((.+)\)/);
 if (match3d) {
 const values = match3d[1].split(', ');
 currentPos = Math.abs(parseFloat(values[12]));
 } else {
 const match2d = style.transform.match(/matrix\((.+)\)/);
 if (match2d) {
 const values = match2d[1].split(', ');
 currentPos = Math.abs(parseFloat(values[4]));
 }
 }
 const index = Math.floor((currentPos + (ITEM_SIZE/2)) / ITEM_SIZE);
 if (index > currentItemIndex) {
 currentItemIndex = index;
 playTick();
 }
 if (mainContainer.dataset.spinning === 'true') {
 animationFrameId = requestAnimationFrame(checkPosition);
 }
 };
 containerRefs.current[trackIdx].dataset.spinning = 'true';
 animationFrameId = requestAnimationFrame(checkPosition);
 
 }); 
 });
 };


 const saveWinnersToSupabase = async (winners) => {
 if (!user) return;
 for (const winner of winners) {
  const item = winner.item || winner;
  if (!item || !item.name) continue;
  const rarityMap = { milspec: '#4b69ff', restricted: '#8847ff', classified: '#d32ce6', covert: '#eb4b4b', gold: '#e4ae39' };
  const rHex = rarityMap[item.rarity] || '#4b69ff';
  
  // Check if item exists (usando maybeSingle para evitar erro quando não existe)
  const { data: existing, error: selErr } = await supabase
   .from('inventory')
   .select('id, count')
   .eq('user_id', user.id)
   .eq('item_name', item.name)
   .maybeSingle();

  if (selErr) {
   console.error('[DiscountRoulette] Erro ao verificar item existente:', selErr);
   if (onToast) onToast({ title: '❌ Erro no Banco', message: 'Falha ao buscar item: ' + selErr.message });
  }
  
  if (existing) {
   const { error: updErr } = await supabase
    .from('inventory')
    .update({ count: (existing.count || 1) + 1 })
    .eq('id', existing.id);
   if (updErr) {
     console.error('[DiscountRoulette] Erro ao atualizar count:', updErr);
     if (onToast) onToast({ title: '❌ Erro no Banco', message: 'Falha ao atualizar count: ' + updErr.message });
   }
  } else {
   const { error: insErr } = await supabase.from('inventory').insert({
    user_id: user.id,
    item_id: item.id ? item.id.toString() : `case-${Date.now()}`,
    item_name: item.name,
    price: item.price || 0,
    count: 1,
    icon: item.icon || '🔫',
    rarity_color: rHex,
    image: item.image || null
   });
   if (insErr) {
     console.error('[DiscountRoulette] Erro ao inserir item:', insErr);
     if (onToast) onToast({ title: '❌ Erro no Banco', message: 'Falha ao salvar item: ' + insErr.message });
   }
  }
 }
 fetchInventory();
};

 const finalizeResults = (winners) => {
 setResults(winners);
 setSpinning(false);
 
 const bestRarity = winners.some(w => w.item.rarity === 'gold') ? 'gold' : 
 winners.some(w => w.item.rarity === 'covert') ? 'covert' : 
 winners.some(w => w.item.rarity === 'classified') ? 'classified' : 
 winners.some(w => w.item.rarity === 'restricted') ? 'restricted' : 'milspec';

 playWinSound(bestRarity);

 if (bestRarity === 'covert' || bestRarity === 'gold') {
 confetti({ particleCount: 400, spread: 160, origin: { y: 0.6 }, zIndex: 9999 });
 } else if (bestRarity === 'classified') {
 confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, zIndex: 9999 });
 }

 saveWinnersToSupabase(winners).then(() => {
 if (onToast) {
 onToast({
 title: '🎁 Item Ganho!',
 message: `${winners.length} item(s) guardado(s) no cofre!`,
 image: winners[0]?.item?.image,
 icon: winners[0]?.item?.icon
 });
 }
 });
 
 // AUTO OPEN LOGIC
 if (autoOpenRef.current) {
 playAcceptSound();
 setTimeout(() => {
 if (coinBalance >= getCasePrice(activeCase, openCount)) {
 setResults([]);
 setFinished(false);
 setTimeout(() => setAutoOpenTrigger(prev => prev + 1), 100);
 } else {
 setAutoOpen(false);
 setResults(winners);
 setShowPopup(true);
 }
 }, 1500);
 }
 };

 const toggleFavoriteCase = (caseId) => {
 setFavoriteCases(prev => {
 const next = prev.includes(caseId) ? prev.filter(id => id !== caseId) : [...prev, caseId];
 localStorage.setItem('dopashop_fav_cases', JSON.stringify(next));
 return next;
 });
 };

 return (
 <div className="flex flex-col items-center font-sans bg-transparent relative overflow-hidden pb-12 w-[100vw] -ml-[50vw] left-1/2 md:w-full md:max-w-6xl md:ml-0 md:left-auto md:rounded-2xl">
 
 {/* HEADER TABS - CLEAN & ELEGANT */}
 <div className="w-full border-b border-white/5 px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between z-10 mb-6 bg-transparent gap-4 relative">
 <div className="flex items-center gap-4 relative z-10">
 <h2 className="text-xl font-medium text-zinc-200 tracking-wide flex items-center gap-2">
 CAIXAS CS
 </h2>
 </div>
 
 <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
 {user && (
 <div className="flex bg-zinc-900/50 rounded-2xl p-1.5 border border-white/5 backdrop-blur-sm gap-1">
 <div className="py-1.5 px-3 rounded-xl flex items-center gap-3">
 <span className="text-accent font-bold text-[10px] bg-accent/10 px-2 py-0.5 rounded-md uppercase">DOPAS</span>
 <div className="text-sm font-semibold text-zinc-100">{coinBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
 </div>
 <div className="w-[1px] bg-white/5 my-2"></div>
 <div className="py-1.5 px-3 rounded-xl flex items-center gap-3">
 <span className="text-zinc-400 font-bold text-[10px] bg-white/5 px-2 py-0.5 rounded-md uppercase">COFRE</span>
 <div className="text-sm font-semibold text-zinc-100">{inventory.reduce((sum, item) => sum + ((item?.price || 0) * (item?.count || 1)), 0).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} Dopas</div>
 </div>
 </div>
 )}

 {/* Navigation Buttons */}
 <div className="flex bg-[#121212] p-1 rounded-xl border border-white/5">
 <button 
 onClick={() => { if (!spinning) { setTab('cases'); playClickSound(); } }}
 onMouseEnter={playHoverSound}
 disabled={spinning}
 className={`px-6 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${tab === 'cases' ? 'bg-accent/10 text-accent border border-accent/20' : 'text-zinc-500 hover:text-accent border border-transparent'} ${spinning ? 'opacity-40 cursor-not-allowed' : ''}`}
 >
 Abrir Caixas
 </button>
 <button 
 onClick={() => { if (!spinning) { setTab('inventory'); playClickSound(); } }}
 onMouseEnter={playHoverSound}
 disabled={spinning}
 className={`px-6 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${tab === 'inventory' ? 'bg-accent/10 text-accent border border-accent/20' : 'text-zinc-500 hover:text-accent border border-transparent'} ${spinning ? 'opacity-40 cursor-not-allowed' : ''}`}
 >
 Meu Cofre
 <span className={`px-2 py-0.5 rounded-full text-[9px] ${tab === 'inventory' ? 'bg-accent text-white' : 'bg-white/5 text-zinc-400'}`}>
 {inventory.reduce((a, b) => a + (b.count || 1), 0)}
 </span>
 </button>
 </div>
 </div>
 </div>

 {/* --- INVENTORY TAB --- */}
 {tab === 'inventory' && (
 <div className="w-full px-4 md:px-8 min-h-[500px]">
 {/* INVENTORY SUMMARY & ACTIONS */}
 <div className="flex flex-col md:flex-row md:items-center justify-between bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 md:p-8 mb-8 gap-6">
 <div className="flex flex-col">
 <h3 className="text-zinc-500 text-[11px] font-semibold uppercase tracking-widest mb-1">Total em itens</h3>
 <div className="flex items-center gap-1.5">
 <span className="text-white text-3xl md:text-4xl font-black tracking-tight">
 {inventory.reduce((sum, item) => sum + ((item?.price || 0) * (item?.count || 1)), 0).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
 </span>
 <span className="text-accent text-xl font-black">Dopas</span>
 </div>
 </div>
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative">
 <div className="relative">
 <button 
 onClick={() => setIsFilterOpen(!isFilterOpen)}
 className="flex items-center justify-between gap-2 bg-black/40 border border-white/10 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl px-4 py-4 sm:py-3.5 w-44 outline-none hover:border-accent/50 hover:bg-black/60 transition-all"
 >
 {vaultFilter === 'recent' ? 'Mais Recentes' : vaultFilter === 'price-desc' ? 'Maior Valor' : vaultFilter === 'price-asc' ? 'Menor Valor' : 'Raridade'}
 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFilterOpen ? 'rotate-180 text-accent' : 'text-zinc-500'}`} />
 </button>
 
 {isFilterOpen && (
 <>
 <div className="fixed inset-0 z-40"onClick={() => setIsFilterOpen(false)}></div>
 <div className="absolute top-full mt-2 left-0 w-full bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-black/50 z-50 flex flex-col py-1.5 backdrop-blur-md">
 {[['recent', 'Mais Recentes'], ['price-desc', 'Maior Valor'], ['price-asc', 'Menor Valor'], ['rarity', 'Raridade']].map(([val, label]) => (
 <button 
 key={val}
 onClick={() => { setVaultFilter(val); setIsFilterOpen(false); }}
 className={`text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${vaultFilter === val ? 'text-accent bg-accent/10 border-l-2 border-accent pl-3' : 'text-zinc-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}`}
 >
 {label}
 </button>
 ))}
 </div>
 </>
 )}
 </div>
 
 <button 
 onClick={sellAllItems}
 disabled={inventory.length === 0}
 className="group relative px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl overflow-hidden font-bold uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent hover:border-accent )] active:scale-[0.98]"
 >
 <span className="relative z-10 text-sm">Vender Tudo</span>
 </button>
 </div>
 </div>
 
 {inventory.length === 0 ? (
 <div className="w-full flex flex-col items-start justify-center py-20 px-8 border-l-2 border-zinc-800 mt-4 relative overflow-hidden">
 <div className="absolute top-0 right-0 text-[120px] font-black text-white/5 leading-none translate-x-1/4 -translate-y-1/4 pointer-events-none">00</div>
 <h3 className="text-3xl md:text-5xl font-black text-zinc-400 uppercase tracking-tighter mb-2">Vault Empty</h3>
 <p className="text-zinc-600 font-medium uppercase tracking-widest text-xs md:text-sm">Initiate sequences to acquire digital assets.</p>
 </div>
 ) : (
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 animate-fade-in-up pb-12">
 {(() => {
 const sorted = [...inventory];
 if (vaultFilter === 'price-desc') sorted.sort((a, b) => b.price - a.price);
 else if (vaultFilter === 'price-asc') sorted.sort((a, b) => a.price - b.price);
 else if (vaultFilter === 'rarity') {
 const rOrd = { 'gold': 5, 'covert': 4, 'classified': 3, 'restricted': 2, 'milspec': 1 };
 sorted.sort((a, b) => (rOrd[b.rarity] || 0) - (rOrd[a.rarity] || 0));
 } else {
 sorted.reverse();
 }
 return sorted;
 })().map((item, idx) => {
 // Supabase schema: item_name, rarity_color (hex string like '#eb4b4b')
 const itemName = item.item_name || item.name || 'Item Desconhecido';
 const rHex = item.rarity_color || rarities[item.rarity]?.hex || '#4b69ff';
 const rData = { hex: rHex };
 const count = item.count || 1;
 const itemPrice = Number(item.price) || 0;
 const sellValue = itemPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
 // Try to find the image from cs2Items
 const itemImage = item.image;
 return (
 <div key={`${item.id}-${idx}`} className="group relative bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05] rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.1] hover: overflow-hidden flex flex-col h-full"style={{ animationDelay:`${idx * 20}ms`, animationFillMode: 'both' }}>
 
 {/* Top Badge & Count */}
 <div className="flex justify-end items-start p-2 z-30 absolute top-0 right-0 w-full">
 <div className="flex items-center gap-1.5 ml-auto">
 {count > 1 && (
 <div className="text-[10px] font-bold px-2 py-0.5 bg-white/10 text-white rounded-md">
 x{count}
 </div>
 )}
 </div>
 </div>

 {/* Weapon Image */}
 <div className="w-full flex items-center justify-center p-4 relative"style={{ aspectRatio: '4/3' }}>
 {/* Subtle rarity glow behind item */}
 <div className="absolute inset-0 opacity-15 blur-[25px] scale-110 rounded-full"style={{ backgroundColor: rHex }}></div>
 
 {itemImage ? (
 <img loading="lazy"decoding="async"src={itemImage} alt={itemName} className="relative z-10 w-[110%] h-[110%] scale-125 object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] group-hover:scale-[1.4] group-hover:-translate-y-2 transition-all duration-500 ease-out"/>
 ) : item.icon && !item.icon.includes('http') ? (
 <span className="relative z-10 text-7xl drop- group-hover:scale-110 transition-transform duration-500 ease-out">{item.icon}</span>
 ) : (
 <span className="relative z-10 text-6xl group-hover:scale-110 transition-transform duration-500 ease-out">🔫</span>
 )}
 </div>

 {/* Item Info */}
 <div className="px-3 pb-3 pt-1 flex flex-col z-30 mt-auto">
 <p className="text-[9px] font-semibold text-zinc-500 uppercase tracking-widest truncate">{itemName.split('|')[0]?.trim() || 'Item'}</p>
 <p className="text-xs md:text-[13px] font-bold text-white leading-tight mt-0.5 line-clamp-2 min-h-[32px]">{itemName.split('|')[1]?.trim() || itemName}</p>
 <div className="text-[11px] font-black text-emerald-400 mt-1">{itemPrice.toFixed(2)} Dopas</div>
 </div>
 
 {/* Bottom Rarity Line */}
 <div className="h-[2px] w-full mt-auto"style={{ backgroundColor: rHex, opacity: 0.8 }}></div>

 {/* Soft Hover Action Overlay */}
 <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-40 flex flex-col items-center justify-center p-3 gap-2">
 <div className="flex flex-col items-center justify-center w-full px-2 mb-1">
 <span className="text-[13px] sm:text-sm font-black text-emerald-400 text-center whitespace-nowrap tracking-tighter leading-none">{sellValue}</span>
 <span className="text-emerald-500 font-bold text-[9px] tracking-widest uppercase mt-1">Dopas</span>
 </div>
 <div className="flex flex-col gap-1.5 w-full">
 <button 
 onClick={(e) => { e.stopPropagation(); if(onNavigateToUpgrade) onNavigateToUpgrade({...item, name: itemName}); }}
 className="w-full bg-blue-500/10 hover:bg-blue-500 border border-blue-500/50 hover:border-blue-400 text-blue-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider py-1.5 transition-all active:scale-95"
 >
 Upgrade
 </button>
 <button 
 onClick={(e) => { e.stopPropagation(); sellInventoryItem(item); }}
 disabled={item.locked}
 className="w-full bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/50 hover:border-emerald-400 text-emerald-400 hover:text-white disabled:opacity-30 disabled:hover:bg-emerald-500/10 disabled:hover:text-emerald-400 disabled:hover:border-emerald-500/50 rounded-lg text-[10px] font-bold uppercase tracking-wider py-1.5 transition-all active:scale-95 disabled:cursor-not-allowed"
 >
 Vender
 </button>
 <button 
 onClick={(e) => { e.stopPropagation(); toggleLockItem(item); }}
 className="w-full bg-zinc-500/10 hover:bg-zinc-500 border border-zinc-500/50 hover:border-zinc-400 text-zinc-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider py-1.5 transition-all active:scale-95"
 >
 {item.locked ? 'Destrancar' : 'Trancar'}
 </button>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>
 )}

 {/* --- VIEW: SELECTOR --- */}
 {tab === 'cases' && view === 'selector' && (
 <div className="w-full px-4 md:px-8">
 <div className="mb-8 flex justify-center">
 <div className="relative w-full max-w-lg">
 <input 
 type="text"
 placeholder="Pesquisar caixa..."
 value={searchQuery}
 onChange={e => setSearchQuery(e.target.value)}
 className="w-full bg-zinc-900/50 border border-white/10 text-white text-sm rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors backdrop-blur-sm"
 />
 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50">🔍</span>
 </div>
 </div>

 {loadingCases ? (
 <div className="flex flex-col items-center justify-center py-32">
 <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
 <p className="mt-6 text-zinc-400 font-bold">Carregando Mercado da Steam...</p>
 </div>
 ) : (
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 animate-fade-in-up pb-8 max-h-[700px] overflow-y-auto no-scrollbar">
 {casesData.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
 <div 
 key={c.id} 
 onClick={() => handleSelectCase(c)}
 onMouseEnter={playHoverSound}
 className="flex flex-col items-center cursor-pointer group bg-transparent border border-white/10 rounded-xl hover:border-accent/40 hover:bg-accent/5 transition-all relative overflow-hidden pt-5 )] h-full"
 >
 {/* Top Name (Fixed height for alignment) */}
 <div className="h-10 flex items-center justify-center w-full px-2 mb-2">
 <h3 className="text-xs md:text-sm font-medium text-zinc-200 text-center line-clamp-2 group-hover:text-accent transition-colors">{c.name}</h3>
 </div>
 
 {/* Image */}
 <div className="h-24 md:h-32 w-full flex items-center justify-center p-2 mb-2 relative mt-auto">
 <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 rounded-full blur-[25px] transition-opacity"></div>
 <img loading="lazy"decoding="async"src={c.image} alt={c.name} className="max-h-full object-contain group-hover:scale-110 transition-transform filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)] relative z-10"/>
 </div>
 
 {/* Bottom Price Tag (Trapezoid - Themed) */}
 <div className="w-full flex justify-center mt-auto">
 <div 
 className="w-[85%] h-8 bg-accent/80 flex items-center justify-center text-[11px] md:text-xs font-semibold text-white transition-colors group-hover:bg-accent"
 style={{ clipPath: 'polygon(15px 0, calc(100% - 15px) 0, 100% 100%, 0 100%)' }}
 >
 {c.price.toLocaleString('pt-BR')} Dopas
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {/* --- VIEW: OPENER --- */}
 {tab === 'cases' && view === 'opener' && activeCase && (
 <div className="w-full relative flex flex-col items-center animate-fade-in-up">
 <div className="w-full flex flex-col items-center pb-24">
 
 {/* PREMIUM HEADER */}
 <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 bg-gradient-to-b from-[#0f1115] to-transparent border-b border-white/5 z-20 relative w-full">
 <div className="flex items-center justify-between w-full md:w-auto">
 <div className="flex items-center gap-3 md:gap-4">
 <button onClick={() => { if (!spinning) setView('selector') }} disabled={spinning} className={`p-2 md:p-3 bg-white/5 rounded-xl transition-all ${spinning ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'}`}>
 <ArrowLeft className="w-5 h-5 md:w-6 md:h-6"/>
 </button>
 <div className="flex flex-col">
 <span className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest">Abrindo</span>
 <h2 className="text-base md:text-2xl font-black text-white truncate max-w-[180px] md:max-w-none">{activeCase?.name}</h2>
 </div>
 </div>
 <div className="flex flex-col items-end md:hidden">
 <span className="text-emerald-400 text-sm font-black drop-">{activeCase.price.toFixed(2)} Dopas</span>
 </div>
 </div>
 
 <div className="hidden md:flex items-center gap-6">
 <div className="flex flex-col items-end">
 <span className="text-emerald-400 text-xl font-black drop-">{activeCase.price.toFixed(2)} Dopas</span>
 </div>
 </div>
 </div>

 {/* FULL-WIDTH ROULETTE TRACKS */}
 <div className={`w-full bg-[#0a0c10] border-y border-white/5 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] overflow-hidden relative mt-8 flex flex-col`} style={{ height: openCount > 1 ?`${openCount * 140}px`: '220px' }}>
 
 {/* Dynamic Center Indicator & Edge Fades */}
 <>
 {/* Vertical center line */}
 <div className="absolute top-0 bottom-0 left-1/2 w-[2px] -ml-[1px] bg-accent z-30 shadow-[0_0_20px_rgba(232,93,58,0.8)] pointer-events-none"/>
 {/* Top and Bottom glowing triangles */}
 <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-[0_5px_5px_rgba(232,93,58,0.8)]"><div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-accent"/></div>
 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-[0_-5px_5px_rgba(232,93,58,0.8)]"><div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-accent"/></div>
 
 {/* Horizontal Fades */}
 <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#0a0c10] via-[#0a0c10]/80 to-transparent z-20 pointer-events-none"/>
 <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#0a0c10] via-[#0a0c10]/80 to-transparent z-20 pointer-events-none"/>
 </>
 
 {tracks.map((trackArr, trackIdx) => (
 <div key={trackIdx} className="relative shrink-0 overflow-hidden flex-1"style={{ width: '100%', borderBottom: trackIdx < openCount - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
 <div 
 ref={el => containerRefs.current[trackIdx] = el} 
 onTransitionEnd={trackIdx === openCount - 1 ? handleSpinEnd : null} 
 className="absolute top-0 bottom-0 left-0 right-0 flex flex-row items-center justify-start w-full h-full"
 style={{ 
 transform:`translate3d(${offsets[trackIdx]}px, 0, 0)`, 
 transition: spinning ?`transform ${trackDurations[trackIdx] || 6.5}s cubic-bezier(0.15, 0.85, 0.15, 1)`: 'none', 
 paddingLeft:`calc(50% - ${ITEM_SIZE/2}px)`,
 willChange: 'transform' 
 }}
 >
 {trackArr.map((t, i) => {
 const parts = t.item.name.split('|');
 const skinName = parts[1]?.trim();
 const weaponName = parts[0]?.trim();
 const isWinner = finished && i === winnerIndices[trackIdx];
 const itemH = openCount > 1 ? 'h-[90%]' : 'h-[85%]';
 return (
 <div 
 key={`${t.id}-${i}`} 
 className={`shrink-0 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#1b1e24] to-[#0f1115] border overflow-hidden w-[150px] ${itemH} mx-[2px] ${isWinner ? 'border-2 z-50' : 'border-white/[0.02]'} rounded-md`}
 style={isWinner ? {
 borderColor: t.rData.hex,
 transform: 'perspective(600px) rotateY(-4deg) scale(1.15)',
 boxShadow:`0 0 40px ${t.rData.hex}60, 0 20px 60px rgba(0,0,0,0.8), inset 0 0 30px ${t.rData.hex}15`,
 transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.6s ease-out, border-color 0.3s ease',
 } : {
 opacity: finished ? 0.3 : 1,
 transition: 'opacity 0.5s ease',
 }}
 >
 {/* Classic CS Rarity Bottom Line */}
 <div className="absolute bottom-0 left-0 right-0 h-[4px]"style={{ backgroundColor: t.rData.hex, boxShadow: isWinner ?`0 0 20px ${t.rData.hex}, 0 0 40px ${t.rData.hex}80`:`0 0 10px ${t.rData.hex}`}}></div>
 
 {/* Winner top glow line */}
 {isWinner && <div className="absolute top-0 left-0 right-0 h-[3px]"style={{ backgroundColor: t.rData.hex, boxShadow:`0 0 15px ${t.rData.hex}`}}></div>}
 
 <div className={`relative w-full flex-1 flex items-center justify-center ${openCount > 1 ? 'mt-1' : 'mt-4'}`}>
 <div className={`absolute inset-0 blur-[20px] ${isWinner ? 'opacity-40' : 'opacity-20'}`} style={{ backgroundColor: t.rData.hex }}></div>
 
 {t.item.image ? (
 <img loading="lazy"decoding="async"src={t.item.image} alt={t.item.name} className={`relative z-10 w-[85%] max-w-[85%] object-contain ${isWinner ? 'drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] scale-110 transition-transform duration-1000' : spinning ? '' : 'drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] scale-110 transition-transform duration-500'}`} />
 ) : (
 <span className="relative z-10 text-3xl md:text-5xl drop-">{t.item.icon}</span>
 )}
 </div>
 
 {openCount === 1 && (
 <div className="w-full flex flex-col items-center pb-3 px-2 z-10">
 <span className="text-[11px] md:text-[12px] font-bold truncate w-full text-center text-white">{weaponName}</span>
 <span className="text-[9px] md:text-[10px] font-medium truncate w-full text-center mt-0.5"style={{ color: t.rData.hex }}>{skinName || '★'}</span>
 </div>
 )}
 </div>
 )
 })}
 </div>
 </div>
 ))}
 </div>

 {/* INLINE WINNER RESULTS */}
 {finished && results.length > 0 && (
 <div className="w-full px-4 mt-6 flex flex-col items-center animate-fade-in-up">
 <div className="w-full max-w-md bg-[#111]/90 border border-white/10 rounded-2xl p-4 flex flex-col items-center relative overflow-hidden">
 
 {/* Actions: Vender | Upgrade | Cofre | Abrir Novamente */}
 <div className="flex flex-row items-center justify-center gap-2 w-full flex-wrap">
 <button 
 onClick={sellItemNow}
 className="flex-1 bg-accent hover:bg-accent/80 text-white px-3 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all text-[11px] md:text-xs active:scale-[0.97]"
 >
 Vender • {results.reduce((a,b)=>a+b.item.price,0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} Dopas
 </button>
 <button 
 onClick={() => { playAcceptSound(); setResults([]); setFinished(false); }}
 className="bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all border border-white/10 hover:border-white/20 text-[11px] md:text-xs whitespace-nowrap active:scale-[0.97]"
 >
 Cofre
 </button>
 <button 
 onClick={() => { playAcceptSound(); openCase(); }}
 disabled={coinBalance < getCasePrice(activeCase, openCount)}
 className={`flex-1 bg-white/5 hover:bg-accent/20 text-accent px-3 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all border border-accent/30 hover:border-accent/60 text-[11px] md:text-xs ${coinBalance < getCasePrice(activeCase, openCount) ? 'opacity-40 cursor-not-allowed' : 'active:scale-[0.97]'}`}
 >
 Abrir Novamente
 </button>
 </div>
 </div>
 </div>
 )}


 {/* PREMIUM ACTION BLOCK */}
 {(!finished || results.length === 0) && (
 <div className="w-full px-4 mt-8 mb-12 flex flex-col items-center animate-fade-in-up">
 <div className="w-full max-w-md bg-white/5 dark:bg-[#111]/80 backdrop-blur-xl p-5 rounded-3xl border border-white/5 relative overflow-hidden">
 {/* Background Glow */}
 <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-accent/10 blur-[60px] rounded-full pointer-events-none"></div>
 
 {/* Hexagon controls */}
 <div className="flex justify-between items-center mb-6 w-full relative z-10 px-2">
 {/* Placeholder to keep center items aligned */}
 <div className="w-10 h-10 md:w-12 md:h-12 hidden md:block"></div>
 <div className="flex gap-2">
 {[1, 2, 3].map(n => (
 <HexButton key={n} active={openCount === n} onClick={() => setOpenCount(n)} title={`Abrir ${n} caixa${n > 1 ? 's' : ''}`}>
 <span className={`text-[15px] font-black ${openCount === n ? 'text-white' : 'text-zinc-500'}`}>{n}</span>
 </HexButton>
 ))}
 </div>
 <HexButton active={!muted} onClick={() => setMuted(prev => !prev)} title={muted ? 'Ativar som' : 'Mutar som'}>
 {muted ? <VolumeX className="w-5 h-5 md:w-4 md:h-4 text-red-500"/> : <Volume2 className="w-5 h-5 md:w-4 md:h-4 text-white"/>}
 </HexButton>
 </div>
 
 {/* The Main Button */}
 <div className="flex justify-center gap-3">
 <button 
 id="auto-spin-trigger"
 onClick={() => openCase()} 
 disabled={spinning || coinBalance < getCasePrice(activeCase, openCount)}
 className={`relative overflow-hidden group bg-accent text-white font-bold uppercase tracking-wider px-10 md:px-14 py-4 md:py-5 rounded-2xl transition-all ${spinning || coinBalance < getCasePrice(activeCase, openCount) ? 'opacity-40 cursor-not-allowed scale-95' : 'hover:brightness-110 )] active:scale-[0.97]'}`}
 style={{ boxShadow: !(spinning || coinBalance < getCasePrice(activeCase, openCount)) ? '0 4px 25px rgba(232,93,58,0.35)' : 'none' }}
 >
 <span className="relative z-10 text-sm md:text-base whitespace-nowrap">
 {spinning ? 'Abrindo...' :`${getCasePrice(activeCase, openCount).toLocaleString('pt-BR')} Dopas`}
 </span>
 <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-white/15 skew-x-12"></div>
 </button>
 <button 
 onClick={() => setAutoOpen(!autoOpen)}
 disabled={!autoOpen && spinning}
 className={`px-5 md:px-7 py-4 md:py-5 rounded-2xl font-bold uppercase tracking-wider transition-all whitespace-nowrap ${!autoOpen && spinning ? 'opacity-40 cursor-not-allowed' : ''} ${autoOpen ? 'bg-accent text-white shadow-[0_4px_20px_rgba(232,93,58,0.4)] animate-pulse' : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-white'}`}
 >
 <span className="text-sm md:text-base">Auto {autoOpen ? 'ON' : 'OFF'}</span>
 </button>
 </div>
 </div>
 </div>
 )}

 {/* CONTENTS GRID */}
 <div className="w-full max-w-6xl flex flex-col mt-4 px-2 mb-16">
 <h3 className="text-[18px] md:text-2xl font-black text-white mb-8 md:text-center tracking-wide">Conteúdo da caixa</h3>
 
 <div className="flex flex-wrap justify-center gap-4 md:gap-5 pb-6">
 {(() => {
 const nonGolds = activeCase.items.filter(i => i.rarity !== 'gold');
 const hasGold = activeCase.items.some(i => i.rarity === 'gold');
 const displayItems = hasGold ? [...nonGolds, GOLD_PLACEHOLDER] : nonGolds;
 
 return displayItems.sort((a, b) => {
 const rarityWeight = { gold: 5, covert: 4, classified: 3, restricted: 2, milspec: 1 };
 const weightDiff = (rarityWeight[b.rarity] || 0) - (rarityWeight[a.rarity] || 0);
 return weightDiff !== 0 ? weightDiff : b.price - a.price;
 }).map((item, idx) => {
 const rData = rarities[item.rarity];
 const isGold = item.rarity === 'gold';
 
 // Real CS:GO odds mapping
 const CSGO_BASE_ODDS = {
 milspec: 79.923,
 restricted: 15.985,
 classified: 3.197,
 covert: 0.639,
 gold: 0.256
 };
 
 // For gold, it's the combined probability. For others, it's divided by count.
 let realProb = CSGO_BASE_ODDS[item.rarity];
 if (!isGold) {
 const countInRarity = activeCase.items.filter(i => i.rarity === item.rarity).length || 1;
 realProb = realProb / countInRarity;
 }

 const nameParts = item.name.split('|');
 const weaponName = nameParts[0]?.trim();
 const skinName = nameParts[1]?.trim();

 return (
 <div 
 key={`${item.id}-${idx}`}
 onMouseEnter={playHoverSound}
 className="w-[145px] md:w-[170px] aspect-[3/4.1] rounded-2xl overflow-hidden flex flex-col items-center relative border border-white/[0.04] bg-[#0f131a]/80 backdrop-blur-md group hover:bg-[#141924] hover:border-white/10 transition-all duration-300 cursor-pointer hover: hover:-translate-y-1"
 >
 {/* Sleek Top Rarity Line */}
 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[3px] rounded-b-md z-20 transition-all duration-500 group-hover:w-20"style={{ backgroundColor: rData.hex, boxShadow:`0 2px 10px ${rData.hex}`}}></div>
 
 {/* Info Icon */}
 <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[9px] text-zinc-400 font-black z-30 transition-colors group-hover:bg-white/10 group-hover:text-white">i</div>
 
 {/* Percentage */}
 <div className="absolute top-3 right-3 text-[10px] text-zinc-400 font-bold z-30 tracking-wider">{realProb.toFixed(3)}%</div>

 {/* Image Area with Radial Glow */}
 <div className="flex-1 w-full flex items-center justify-center relative z-10 mt-8 mb-2">
 {isGold ? (
 <img loading="lazy"decoding="async"src="/rare_special.webp"alt="Rare Special Item"className="w-[85%] max-h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(250,204,21,0.3)] group-hover:scale-110 transition-transform duration-500"/>
 ) : (
 <>
 <div className="absolute inset-0 m-auto w-24 h-24 opacity-30 blur-[25px] rounded-full mix-blend-screen transition-opacity duration-500 group-hover:opacity-50"style={{ backgroundColor: rData.hex }}></div>
 {item.image ? (
 <img loading="lazy"decoding="async"src={item.image} alt={item.name} className="w-[90%] max-h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"/>
 ) : (
 <span className="text-4xl relative z-10 drop- group-hover:scale-110 transition-transform duration-500">{item.icon}</span>
 )}
 </>
 )}
 </div>

 {/* Split Item Name (Weapon | Skin) */}
 <div className="w-full flex flex-col items-center justify-end relative z-10 pb-4 px-2 h-14">
 {isGold ? (
 <p className="text-[11px] md:text-[13px] font-black text-white truncate drop- tracking-wide">★ Rare Special Item ★</p>
 ) : (
 <>
 <p className="text-[11px] md:text-[13px] font-bold text-white truncate drop- w-full text-center">{weaponName}</p>
 {skinName && (
 <p className="text-[10px] md:text-[11px] font-medium text-zinc-400 truncate w-full text-center mt-0.5 group-hover:text-zinc-300 transition-colors">{skinName}</p>
 )}
 </>
 )}
 </div>
 </div>
 )
 });
 })()}
 </div>
 </div>

 {/* REMOVED COMPACT MODAL WINNER POPUP */}

 </div>
 </div>
 )}

 </div>
 );
}
