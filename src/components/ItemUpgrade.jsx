import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Zap, Crosshair, ArrowRight, ShieldCheck, Info, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { playHover as playHoverAM, playClick as playClickAM, playUpgradeWin, playUpgradeFail, playUpgradeTick } from '../audioManager';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { cs2Items } from '../data/cs2Items';
import { cheapItems } from '../data/cheapItems';

const rarities = {
 milspec: { name: 'Nível Militar', color: 'text-blue-500', hex: '#3b82f6', bg: 'from-blue-900 to-black', border: 'border-blue-600', glow: 'shadow-[0_0_10px_rgba(37,99,235,0.3)]' },
 restricted: { name: 'Restrito', color: 'text-purple-500', hex: '#a855f7', bg: 'from-purple-900 to-black', border: 'border-purple-600', glow: 'shadow-[0_0_15px_rgba(147,51,234,0.4)]' },
 classified: { name: 'Confidencial', color: 'text-pink-400', hex: '#f472b6', bg: 'from-pink-900 to-black', border: 'border-pink-500', glow: 'shadow-[0_0_20px_rgba(236,72,153,0.5)]' },
 covert: { name: 'Oculto', color: 'text-red-500', hex: '#ef4444', bg: 'from-red-900 to-black', border: 'border-red-600', glow: 'shadow-[0_0_30px_rgba(220,38,38,0.6)]' },
 gold: { name: 'Item Especial', color: 'text-yellow-400', hex: '#facc15', bg: 'from-yellow-700 to-black', border: 'border-yellow-400', glow: 'shadow-[0_0_40px_rgba(250,204,21,0.8)]' },
};

const DEFAULT_TARGETS = cs2Items.filter(i => i.price >= 50 && i.price <= 5000).slice(0, 8);

export default function ItemUpgrade({ preselectedItem, onClearPreselect, onToast }) {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [targetItems, setTargetItems] = useState(DEFAULT_TARGETS);
  const [selectedSources, setSelectedSources] = useState(preselectedItem ? [{...preselectedItem, uid: 'pre-0', count: 1}] : []);
  const [selectedTargets, setSelectedTargets] = useState([]);
  
  const [invSearch, setInvSearch] = useState('');
  const [targetSearch, setTargetSearch] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [activeMultiplier, setActiveMultiplier] = useState(1.5);
  const [visibleCount, setVisibleCount] = useState(150);
  const [rollDirection, setRollDirection] = useState('under'); // 'under' or 'over'
  
  const [spinning, setSpinning] = useState(false);
  const [resultRotation, setResultRotation] = useState(0);
  
  const sourceValue = selectedSources.reduce((acc, item) => acc + Number(item.price || 0), 0);
  const targetValue = selectedTargets.reduce((acc, item) => acc + Number(item.price || 0), 0);
  // Fórmula correta com 5% de house edge, cap máx 90%, mín 0.5%
  const rawChance = targetValue > 0 ? (sourceValue / targetValue) * 100 * 0.95 : 0;
  const chance = Math.min(90, Math.max(rawChance > 0 ? 0.5 : 0, rawChance));

  const playHover = () => playHoverAM();
  const playClick = () => playClickAM();

  const fetchInventory = async () => {
    if (!user) return;
    const { data, error } = await supabase.from('inventory').select('*').eq('user_id', user.id);
    if (!error && data) {
      let flatInv = [];
      data.forEach((item, idx) => {
        const count = item.count || 1;
        for (let c = 0; c < count; c++) {
          flatInv.push({ 
            ...item, 
            uid: `inv-${item.id}-${idx}-${c}`,
            count: 1
          });
        }
      });
      setInventory(flatInv);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [user, preselectedItem]);

  // Fetch full catalog for upgrade targets once
  useEffect(() => {
    const sortedTargets = [...cs2Items, ...cheapItems].sort((a,b) => b.price - a.price);
    setTargetItems(sortedTargets);
  }, []);

 // Auto-select target item when source items or target pool changes
 useEffect(() => {
 if (selectedSources.length > 0 && targetItems.length > 0) {
 const currentSourceVal = selectedSources.reduce((acc, item) => acc + Number(item.price || 0), 0);
 if (currentSourceVal > 0) {
      const desiredTargetVal = currentSourceVal * activeMultiplier;
      let bestTarget = null;
      let minDiff = Infinity;
      targetItems.forEach(item => {
        if (item.price > currentSourceVal) {
          const diff = Math.abs(item.price - desiredTargetVal);
          if (diff < minDiff) {
            minDiff = diff;
            bestTarget = item;
          }
        }
      });

      if (bestTarget) {
        setSelectedTargets([bestTarget]);
      } else {
        setSelectedTargets([]);
      }
    }
  }
 }, [selectedSources, targetItems, activeMultiplier]);

  const handleMultiplierClick = (mult) => {
  playClick();
  if (activeMultiplier === mult) {
    setActiveMultiplier(null);
  } else {
    setActiveMultiplier(mult);
  }
  if (selectedSources.length === 0) return;
  };

  const handleUpgrade = async () => {
    if (selectedSources.length === 0 || selectedTargets.length === 0 || spinning) return;
    if (sourceValue < 0.90) {
      if (onToast) onToast("O valor mínimo do upgrade é D$0.90","error");
      return;
    }
    playClick();
    setSpinning(true);
    const roll = Math.random() * 100;
    const win = rollDirection === 'under' ? roll <= chance : roll >= (100 - chance);
    
    // Supabase Backend Logic
    if (user) {
      for (const srcItem of selectedSources) {
        let realDbId = null;
        
        if (srcItem.uid && srcItem.uid.startsWith('inv-')) {
          const withoutPrefix = srcItem.uid.replace('inv-', '');
          realDbId = withoutPrefix.substring(0, 36);
        } else if (srcItem.id) {
          realDbId = srcItem.id;
        }

        if (!realDbId) {
          console.error('[ItemUpgrade] Não foi possível identificar o ID do item:', srcItem);
          continue;
        }

        const { data: dbItem } = await supabase.from('inventory').select('id, count').eq('id', realDbId).eq('user_id', user.id).single();
        
        if (dbItem) {
          if (dbItem.count > 1) {
            await supabase.from('inventory').update({ count: dbItem.count - 1 }).eq('id', realDbId);
          } else {
            await supabase.from('inventory').delete().eq('id', realDbId);
          }
        }
      }
      
      if (win) {
        for (const tgItem of selectedTargets) {
          const rarityHex = tgItem.rarity_color?.startsWith('#') ? tgItem.rarity_color : '#4b69ff';
          const { error: insErr } = await supabase.from('inventory').insert({
            user_id: user.id,
            item_id: tgItem.id ? tgItem.id.toString() : `upgrade-${Date.now()}`,
            item_name: tgItem.name,
            price: tgItem.price || 0,
            count: 1,
            icon: tgItem.icon || '🔫',
            rarity_color: rarityHex,
            image: tgItem.image || null
          });
          if (insErr) console.error('[ItemUpgrade] Erro ao inserir item ganho:', insErr);
        }
      }
    }

    
    const baseSpins = 360 * 15;
    const finalDegree = (roll / 100) * 360;
    setTimeout(() => {
      setResultRotation(prev => {
        const currentAngle = prev % 360;
        let diff = finalDegree - currentAngle;
        if (diff < 0) diff += 360;
        return prev + baseSpins + diff;
      });
    }, 50);
 
 let tickCount = 0;
 const maxTicks = 35;
 const tickInterval = setInterval(() => {
 if (tickCount >= maxTicks) {
 clearInterval(tickInterval);
 return;
 }
 playUpgradeTick(tickCount / maxTicks);
 tickCount++;
 }, 150 + (tickCount * 5));

 setTimeout(() => {
 clearInterval(tickInterval);
 setSpinning(false);
 
 if (win) {
 playUpgradeWin();
 if(onToast) onToast("Upgrade com Sucesso!","success");
 } else {
 playUpgradeFail();
 if(onToast) onToast("Falha no Upgrade.","error");
 }
 
 fetchInventory();
 setSelectedSources([]);
 setSelectedTargets([]);
 if (onClearPreselect) onClearPreselect();
 
 }, 5500);
 };

 const filteredInv = inventory.filter(i => (i.item_name || i.name || '').toLowerCase().includes(invSearch.toLowerCase()));
  let filteredTargets = targetItems.filter(i => {
  let matches = i.name.toLowerCase().includes(targetSearch.toLowerCase());
  if (minPriceFilter && i.price < parseFloat(minPriceFilter)) matches = false;
  if (priceFilter && i.price > parseFloat(priceFilter)) matches = false;
  if (sourceValue > 0 && i.price <= sourceValue) matches = false;
  return matches;
  });

 if (sourceValue > 0 && activeMultiplier) {
 const idealTarget = sourceValue * activeMultiplier;
 filteredTargets.sort((a, b) => {
 return Math.abs(a.price - idealTarget) - Math.abs(b.price - idealTarget);
 });
 }

 return (
 <div className="w-full max-w-[1600px] mx-auto flex flex-col items-center min-h-[800px] pb-12 animate-fade-in-up gap-4 mt-8">
 
 {/* --- MAIN BANNER ARENA --- */}
 <div 
 className="w-full theme-surface border theme-border p-4 md:p-8 flex flex-col xl:flex-row justify-between items-center relative overflow-hidden transition-colors rounded-3xl"
 style={{ minHeight: '280px' }}
 >
 {/* Subtle background glow for accent */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-accent)]/5 rounded-full blur-[100px] pointer-events-none"></div>

 {/* LEFT: User Items Showcase */}
 <div className="flex-1 w-full xl:w-[350px] flex flex-col items-center justify-center p-4 relative z-10">
 {selectedSources.length > 0 ? (
 <div className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedSources([])}>
 <div className="flex flex-wrap justify-center gap-1 mb-4 max-h-[140px] overflow-hidden">
  {selectedSources.map((si, idx) => {
    const sName = String(si.item_name || si.name || 'Item Desconhecido');
    const dbRef = cs2Items.find(x => x.name === sName);
    const sImage = dbRef?.image || si.image;
    return (
      <img loading="lazy" decoding="async" key={idx} src={sImage} alt={sName} className="h-14 md:h-16 object-contain drop-shadow hover:scale-110 transition-transform"/>
    );
  })}
  </div>
  <span className="theme-text font-bold text-sm mb-1">Seus Itens</span>
 <div className="bg-[var(--t-bg)] border theme-border px-4 py-1.5 rounded flex items-center gap-2">
 <span className="theme-text font-black">D${sourceValue.toFixed(2)}</span>
 </div>
 </div>
 ) : (
 <div className="flex flex-col items-center opacity-60">
 <div className="w-16 h-16 rounded-full border-2 border-dashed theme-border flex items-center justify-center mb-4 transition-colors">
 <svg className="w-6 h-6 theme-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
 </div>
 <span className="theme-text font-bold text-sm tracking-wide">Selecione os seus itens</span>
 <span className="theme-muted text-xs mt-1">Itens para upgrade</span>
 </div>
 )}
 </div>

 {/* CENTER: The Roulette */}
 <div className="flex-shrink-0 relative flex flex-col items-center justify-center min-h-[300px] z-20">
 <div className="relative w-56 h-56 md:w-[280px] md:h-[280px] flex items-center justify-center rounded-full bg-[var(--t-bg)]/30 backdrop-blur-md border border-[var(--t-border)]">
 
 {/* Ring Base */}
 <div className="absolute inset-4 rounded-full border border-[var(--t-border)] opacity-30"></div>
 
 {/* Spinning Wheel (Tracks + Chance Ring) */}
 <div className="absolute w-[80%] aspect-square z-10 pointer-events-none" style={{ transform:`rotate(-${resultRotation}deg)`, transition: spinning ? 'transform 5.5s cubic-bezier(0.05, 0.95, 0.1, 1)' : 'none', willChange: 'transform' }}>
   <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
     <circle cx="50" cy="50" r="46" fill="transparent" stroke="var(--t-border)" strokeWidth="1"/>
   </svg>

   {/* Win Chance Ring (Accent color) */}
   {selectedSources.length > 0 && selectedTargets.length > 0 && (
   <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
     <circle 
       cx="50" cy="50" r="46" fill="transparent" stroke="var(--color-accent)" strokeWidth="3"
       strokeDasharray={`${(chance / 100) * 289} 289`} 
       strokeDashoffset={rollDirection === 'over' ? -((100 - chance) / 100) * 289 : 0}
       strokeLinecap="round"
       className="transition-all duration-1000 ease-out"
     />
   </svg>
   )}
 </div>

 {/* Static Pointer */}
 <div className="absolute w-[80%] aspect-square z-20 pointer-events-none">
   <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-[var(--color-accent)] rotate-180 drop-shadow"></div>
 </div>

 {/* Center Content */}
 <div className="flex flex-col items-center justify-center z-30 text-center mt-2">
 <span className="text-3xl md:text-5xl font-black theme-text tracking-tighter">
 {chance.toFixed(2)}<span className="text-lg md:text-2xl text-[var(--color-accent)] ml-1">%</span>
 </span>
 <span className="text-[10px] md:text-xs font-semibold theme-muted mt-1 uppercase tracking-wider">Probabilidade</span>
 </div>
 </div>
 </div>

 {/* RIGHT: Target Items Showcase */}
 <div className="flex-1 w-full xl:w-[350px] flex flex-col items-center justify-center p-4 relative z-10">
 {selectedTargets.length > 0 ? (
 <div className="flex flex-col items-center cursor-pointer" onClick={() => !spinning && setSelectedTargets([])}>
 <div className="flex flex-wrap justify-center gap-1 mb-4 max-h-[140px] overflow-hidden">
 {selectedTargets.map((ti, idx) => (
 <img loading="lazy" decoding="async" key={idx} src={ti.image} alt={ti.name} className="h-14 md:h-16 object-contain drop-shadow hover:scale-110 transition-transform"/>
 ))}
 </div>
 <span className="theme-text font-bold text-sm mb-1">Seus Alvos</span>
 <div className="bg-[var(--t-bg)] border theme-border px-4 py-1.5 rounded flex items-center gap-2">
 <span className="theme-text font-black">{targetValue.toFixed(2)} Dopas</span>
 <span className="theme-muted text-xs font-bold">{(targetValue / (sourceValue || 1)).toFixed(2)}x</span>
 </div>
 </div>
 ) : (
 <div className="flex flex-col items-center opacity-60">
 <div className="w-16 h-16 rounded-full border-2 border-dashed theme-border flex items-center justify-center mb-4 transition-colors">
 <svg className="w-6 h-6 theme-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
 </div>
 <span className="theme-text font-bold text-sm tracking-wide">Selecione itens</span>
 <span className="theme-muted text-xs mt-1">Que pretende obter</span>
 </div>
 )}
 </div>

 </div>

 {/* --- CONTROLS ROW --- */}
 <div className="w-full max-w-[900px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 mt-2 z-20">
 {/* Direction Toggle */}
 <div className="flex-1 flex justify-center md:justify-start">
 <button 
 onClick={() => { playClick(); setRollDirection(r => r === 'under' ? 'over' : 'under'); }}
 className="group w-10 h-10 flex items-center justify-center rounded-full bg-[var(--t-surface)] border border-[var(--t-border)] theme-text hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:bg-[var(--t-bg)] transition-all cursor-pointer hover:shadow active:scale-95"
 title={`Modo Atual: Roll ${rollDirection === 'under' ? 'Under (Esquerda)' : 'Over (Direita)'}`}
 >
 <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500"/>
 </button>
 </div>

 {/* UPGRADE BUTTON */}
 <div className="flex-shrink-0 flex items-center justify-center gap-4">
 <div className="flex items-center text-[var(--color-accent)] opacity-40">
 <ChevronLeft className="w-4 h-4"/><ChevronLeft className="w-5 h-5 -ml-3"/><ChevronLeft className="w-6 h-6 -ml-4"/>
 </div>
 <button
 onClick={handleUpgrade}
 disabled={spinning || selectedSources.length === 0 || selectedTargets.length === 0 || chance <= 0}
 className="px-8 py-3 bg-[var(--t-surface)] hover:bg-[var(--t-bg)] border border-[var(--t-border)] hover:border-[var(--color-accent)] theme-text font-bold tracking-wide hover:shadow disabled:opacity-50 transition-all uppercase text-sm group relative overflow-hidden active:scale-95"
 >
 <div className="absolute inset-0 bg-[var(--color-accent)]/10 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
 <span className="relative z-10 transition-colors group-hover:text-[var(--color-accent)]">{spinning ? 'PROCESSANDO' : 'FAZER UPGRADE'}</span>
 </button>
 <div className="flex items-center text-[var(--color-accent)] opacity-40">
 <ChevronRight className="w-6 h-6"/><ChevronRight className="w-5 h-5 -ml-4"/><ChevronRight className="w-4 h-4 -ml-3"/>
 </div>
 </div>

 {/* Multipliers */}
 <div className="flex-1 flex flex-wrap justify-center md:justify-end gap-2">
 {[1.2, 1.5, 2, 5, 10].map(mult => (
 <button 
 key={mult}
 onClick={() => handleMultiplierClick(mult)}
 onMouseEnter={playHover}
 disabled={spinning}
 className={`w-12 h-10 flex items-center justify-center text-xs font-black transition-all rounded-[4px] border
 ${activeMultiplier === mult ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]' : 'bg-[var(--t-surface)] border-[var(--t-border)] theme-text hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]'}`}
 >
 {mult}x
 </button>
 ))}
 </div>
 </div>

 {/* --- PANELS (BOTTOM) --- */}
 <div className="w-full flex flex-col lg:flex-row gap-3 mt-8">
 
 {/* SOURCE PANEL */}
 <div className="w-full lg:w-1/2 theme-surface border theme-border rounded-xl flex flex-col h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
 {/* Panel Header */}
 <div className="flex items-center justify-between px-4 py-3 border-b theme-border shrink-0">
 <h3 className="text-sm font-bold theme-text tracking-wide">Seu Inventário <span className="theme-muted font-normal ml-1">({inventory.length})</span></h3>
 </div>
 {/* Search */}
 <div className="px-3 pt-3 pb-2 shrink-0">
 <div className="relative">
 <input type="text" placeholder="Pesquisar item..." value={invSearch} onChange={(e) => setInvSearch(e.target.value)}
 className="w-full theme-bg border theme-border theme-text rounded-md h-9 pl-8 pr-3 text-xs outline-none focus:border-[var(--color-accent)] transition-colors"/>
 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 theme-muted"/>
 </div>
 </div>
 {/* Grid */}
 <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-3">
 <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
 {filteredInv.map((item, idx) => {
 const isSelected = selectedSources.some(i => i.uid === item.uid);
 const itemName = String(item.item_name || item.name || 'Item Desconhecido');
 const dbRef = cs2Items.find(x => x.name === itemName);
 const itemImage = dbRef?.image || item.image;
 const rColor = item.rarity_color || dbRef?.rarity_color || 'border-blue-500 bg-blue-900/20 text-blue-400';
 const rHex = rColor.includes('red') ? '#ef4444' : rColor.includes('pink') ? '#f472b6' : rColor.includes('purple') ? '#a855f7' : rColor.includes('yellow') ? '#facc15' : rColor.startsWith('#') ? rColor : '#3b82f6';
 const itemPrice = Number(item.price) || 0;
 const shortName = itemName.split('|')[1]?.trim() || itemName;
 
 return (
 <div key={`inv-${item.uid}-${idx}`} onClick={() => { 
 playClick(); 
 setSelectedSources(prev => prev.find(i => i.uid === item.uid) ? prev.filter(i => i.uid !== item.uid) : [...prev, item]);
 if (onClearPreselect) onClearPreselect(); 
 }} onMouseEnter={playHover}
 className={`group relative rounded-xl cursor-pointer transition-all duration-300 overflow-hidden border
 ${isSelected 
 ? 'bg-zinc-800/80 ' 
 : 'bg-zinc-900/40 border-white/5 hover:border-white/10 hover:bg-zinc-800/60 hover:-translate-y-1 hover:shadow'}
`}
 style={isSelected ? { borderColor: rHex, boxShadow:`0 0 15px ${rHex}33`} : {}}
 >
 
 {isSelected && (
 <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center z-30" style={{ backgroundColor: rHex }}>
 <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
 </div>
 )}

 {/* Subtle radial background glow */}
 <div className="absolute inset-0 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-300" style={{ background:`radial-gradient(circle at 50% 40%, ${rHex} 0%, transparent 70%)`}}></div>

 {/* Bottom rarity accent */}
 <div className="absolute bottom-0 left-0 w-full h-[3px] transition-all duration-300" style={{ backgroundColor: rHex, boxShadow:`0 -2px 10px ${rHex}80`}}></div>

 {/* Image */}
 <div className="w-full px-4 pt-5 pb-1 flex items-center justify-center relative z-10" style={{ aspectRatio: '4/3' }}>
 <img loading="lazy" decoding="async" src={itemImage} alt={itemName} className="w-[110%] h-[110%] scale-125 object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] group-hover:scale-[1.4] group-hover:-rotate-3 group-hover:-translate-y-2 transition-all duration-300 ease-out"/>
 </div>

 {/* Info */}
 <div className="px-3 pb-3 text-center relative z-10">
 <p className="text-[10.5px] font-semibold text-zinc-400 line-clamp-2 leading-tight min-h-[28px] flex items-center justify-center">{shortName}</p>
 <p className="text-xs font-black tracking-wide mt-0.5 drop-shadow" style={{ color: rHex }}>D$ {itemPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* TARGET PANEL */}
 <div className="w-full lg:w-1/2 theme-surface border theme-border rounded-xl flex flex-col h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
 {/* Panel Header */}
 <div className="flex items-center justify-between px-4 py-3 border-b theme-border shrink-0">
 <h3 className="text-sm font-bold theme-text tracking-wide">Itens para obter <span className="theme-muted font-normal ml-1">({filteredTargets.length})</span></h3>
 </div>
 {/* Search + Filters */}
 <div className="px-3 pt-3 pb-2 shrink-0 flex flex-col sm:flex-row gap-2">
 <div className="relative flex-1">
 <input type="text" placeholder="Pesquisar alvo..." value={targetSearch} onChange={(e) => setTargetSearch(e.target.value)}
 className="w-full theme-bg border theme-border theme-text rounded-md h-9 pl-8 pr-3 text-xs outline-none focus:border-[var(--color-accent)] transition-colors"/>
 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 theme-muted"/>
 </div>
 <div className="flex gap-2">
 <input type="text" inputMode="decimal" placeholder="D$ Mín" value={minPriceFilter} onChange={(e) => setMinPriceFilter(e.target.value)} className="w-20 sm:w-24 theme-bg border theme-border theme-text rounded-md h-9 px-2.5 text-xs outline-none focus:border-[var(--color-accent)] text-center"/>
 <input type="text" inputMode="decimal" placeholder="D$ Máx" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="w-20 sm:w-24 theme-bg border theme-border theme-text rounded-md h-9 px-2.5 text-xs outline-none focus:border-[var(--color-accent)] text-center"/>
 </div>
 </div>
 {/* Grid */}
 <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-3">
 <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
 {filteredTargets.slice(0, visibleCount).map((item, idx) => {
 const isSelected = selectedTargets.some(i => i.id === item.id);
 const rData = rarities[item.rarity?.toLowerCase()] || rarities['milspec'];
 const itemName = String(item.name || 'Item Desconhecido');
 const itemPrice = Number(item.price) || 0;
 const shortName = itemName.split('|')[1]?.trim() || itemName;
 
 return (
 <div key={`target-${item.id}-${idx}`} onClick={() => { 
 playClick(); 
 setActiveMultiplier(null);
 setSelectedTargets(prev => prev.find(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item]);
 }} onMouseEnter={playHover}
 className={`group relative rounded-xl cursor-pointer transition-all duration-300 overflow-hidden border
 ${isSelected 
 ? 'bg-zinc-800/80 ' 
 : 'bg-zinc-900/40 border-white/5 hover:border-white/10 hover:bg-zinc-800/60 hover:-translate-y-1 hover:shadow'}
`}
 style={isSelected ? { borderColor: rData.hex, boxShadow:`0 0 15px ${rData.hex}33`} : {}}
 >
 
 {isSelected && (
 <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center z-30" style={{ backgroundColor: rData.hex }}>
 <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
 </div>
 )}

 {/* Subtle radial background glow */}
 <div className="absolute inset-0 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-300" style={{ background:`radial-gradient(circle at 50% 40%, ${rData.hex} 0%, transparent 70%)`}}></div>

 {/* Bottom rarity accent */}
 <div className="absolute bottom-0 left-0 w-full h-[3px] transition-all duration-300" style={{ backgroundColor: rData.hex, boxShadow:`0 -2px 10px ${rData.hex}80`}}></div>

 {/* Image */}
 <div className="w-full px-4 pt-5 pb-1 flex items-center justify-center relative z-10" style={{ aspectRatio: '4/3' }}>
 <img loading="lazy" decoding="async" src={item.image} alt={itemName} className="w-[110%] h-[110%] scale-125 object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] group-hover:scale-[1.4] group-hover:-rotate-3 group-hover:-translate-y-2 transition-all duration-300 ease-out"/>
 </div>

 {/* Info */}
 <div className="px-3 pb-3 text-center relative z-10">
 <p className="text-[10.5px] font-semibold text-zinc-400 line-clamp-2 leading-tight min-h-[28px] flex items-center justify-center">{shortName}</p>
 <p className="text-xs font-black tracking-wide mt-0.5 drop-shadow" style={{ color: rData.hex }}>D$ {itemPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 {visibleCount < filteredTargets.length && (
    <div className="w-full flex justify-center mt-4 mb-2">
      <button 
        onClick={() => setVisibleCount(prev => prev + 150)}
        className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold transition-colors"
      >
        CARREGAR MAIS ITENS
      </button>
    </div>
  )}
 </div>

 </div>
 </div>
 );
}
