import React, { useState, useRef } from "react";
import { PackageOpen, Gift, HelpCircle } from "lucide-react";
import { playTick as playTickSound, playWinBig, playLose } from "../audioManager";
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { cs2Items } from '../data/cs2Items';

export default function GachaBoxes({ currentAura, onUpdateAura, onToast }) {
  const { user, updateBalance } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winItem, setWinItem] = useState(null);
  
  // The visual "tape" of items
  const [tapeItems, setTapeItems] = useState([]);
  const tapeRef = useRef(null);
  
  const BOX_COST = 500;

  // Probabilidades (aprox) do CS2 real controladas pelo cs2Items

  const PRIZE_POOL = cs2Items;

  const getDynamicWeight = (item) => {
    const rLow = (item.rarity || '').toLowerCase();
    if (rLow.includes('consumer') || rLow.includes('industrial') || rLow.includes('base grade')) return 1000;
    if (rLow.includes('mil-spec') || rLow.includes('high grade')) return 200;
    if (rLow.includes('restricted') || rLow.includes('remarkable')) return 40;
    if (rLow.includes('classified') || rLow.includes('exotic')) return 8;
    if (rLow.includes('covert') || rLow.includes('extraordinary') || rLow.includes('master')) return 1;
    if (rLow.includes('contraband') || rLow.includes('gold')) return 0.1;
    return 10;
  };

  const generateTape = (winningItem) => {
    const items = [];
    // Pre-calculate total weight
    const totalWeight = PRIZE_POOL.reduce((sum, p) => sum + getDynamicWeight(p), 0);
    
    for (let i = 0; i < 50; i++) {
      const rand = Math.random() * totalWeight;
      let selected = PRIZE_POOL[0];
      let sum = 0;
      for (const p of PRIZE_POOL) {
        sum += getDynamicWeight(p);
        if (rand <= sum) { selected = p; break; }
      }
      items.push(selected);
    }
    items[45] = winningItem;
    return items;
  };

  const getWinner = () => {
    const totalWeight = PRIZE_POOL.reduce((sum, p) => sum + getDynamicWeight(p), 0);
    const rand = Math.random() * totalWeight;
    let sum = 0;
    for (const p of PRIZE_POOL) {
      sum += getDynamicWeight(p);
      if (rand <= sum) return p;
    }
    return PRIZE_POOL[0];
  };

  const playSound = (type) => {
    if (type === 'tick') playTickSound();
    else if (type === 'win') playWinBig();
    else if (type === 'lose') playLose();
  };

  const saveWinToDatabase = async (winner) => {
    if (!user) return;
    
    // Deduct cost and add winning value to balance
    const netBalanceChange = winner.value - BOX_COST;
    const newBalance = (user.coins || 0) + netBalanceChange;
    
    updateBalance(newBalance);
    onUpdateAura(netBalanceChange); // Keep legacy prop working

    // Update profiles table
    await supabase.from('profiles').update({ dopacoins: newBalance }).eq('id', user.id);

    if (winner.value > 0) {
      // Check if item exists in inventory
      const { data: existingItem } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id)
        .eq('item_name', winner.name)
        .single();

      if (existingItem) {
        await supabase.from('inventory').update({ count: existingItem.count + 1 }).eq('id', existingItem.id);
      } else {
        await supabase.from('inventory').insert({
          user_id: user.id,
          item_id: winner.id.toString(),
          item_name: winner.name,
          price: winner.price,
          count: 1,
          icon: winner.icon,
          rarity_color: winner.rarity_color
        });
      }
    }
  };

  const openBox = () => {
    const balance = user ? (user.coins || 0) : currentAura;
    
    if (!user) {
      if (onToast) onToast('Faça login para abrir caixas!');
      return;
    }

    if (balance < BOX_COST || isSpinning) {
      if (onToast) onToast('Dopas insuficientes!');
      return;
    }
    
    setIsSpinning(true);
    setWinItem(null);

    const winner = getWinner();
    const newTape = generateTape(winner);
    setTapeItems(newTape);

    if (tapeRef.current) {
      tapeRef.current.style.transition = 'none';
      tapeRef.current.style.transform = `translateX(0px)`;
    }

    void document.body.offsetHeight; // force reflow

    const ITEM_WIDTH = 136; 
    const targetX = -(45 * ITEM_WIDTH) + (window.innerWidth < 768 ? 100 : 250); 
    const offset = (Math.random() - 0.5) * 80;
    const finalX = targetX + offset;

    setTimeout(() => {
      if (tapeRef.current) {
        tapeRef.current.style.transition = 'transform 5s cubic-bezier(0.1, 0, 0, 1)';
        tapeRef.current.style.transform = `translateX(${finalX}px)`;
      }
      
      let ticks = 0;
      const tickInterval = setInterval(() => {
        playSound('tick');
        ticks++;
        if (ticks > 40) clearInterval(tickInterval);
      }, 100);

      setTimeout(async () => {
        setIsSpinning(false);
        setWinItem(winner);
        
        await saveWinToDatabase(winner);

        if (winner.value > 0) {
          playSound('win');
        } else {
          playSound('lose');
        }
      }, 5200);

    }, 50);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[var(--t-surface)]/50 backdrop-blur-xl rounded-[32px] overflow-hidden border border-[var(--t-border)] shadow-sm font-sans">
      
      <div className="bg-black/20 px-6 py-4 flex justify-between items-center border-b border-[var(--t-border)]">
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 p-2 rounded-xl border border-accent/20">
            <PackageOpen className="w-5 h-5 text-accent" />
          </div>
          <h2 className="font-display font-black text-xl text-white tracking-wider">CAIXA MISTÉRIO</h2>
        </div>
        <div className="text-[10px] font-bold text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/5 uppercase tracking-widest">
          Sorteio Justo
        </div>
      </div>

      <div className="p-6 md:p-8">
        
        {/* Roulette Window */}
        <div className="relative h-44 bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10 mb-8 shadow-inner">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-accent z-10 shadow-[0_0_20px_var(--color-accent)]"></div>
          
          <div className="absolute top-0 bottom-0 left-0 flex items-center gap-4 px-[50vw]" ref={tapeRef} style={{ willChange: 'transform' }}>
            {tapeItems.length > 0 ? tapeItems.map((item, idx) => (
              <div key={idx} className={`w-[120px] h-[120px] shrink-0 rounded-2xl border-b-4 flex flex-col items-center justify-center gap-2 ${item.color} shadow-sm backdrop-blur-md relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0"></div>
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-contain drop-shadow-lg z-10 hover:scale-110 transition-transform" loading="lazy" />
                ) : (
                  <span className="text-4xl drop-shadow-lg filter z-10">{item.icon}</span>
                )}
                <span className="text-[9px] font-black text-white/90 uppercase tracking-widest text-center px-1 drop-shadow-sm z-10 absolute bottom-2">{item.name.substring(0, 20)}</span>
              </div>
            )) : (
              [...Array(10)].map((_, idx) => (
                <div key={idx} className="w-[120px] h-[120px] shrink-0 rounded-2xl border-b-4 border-zinc-700 bg-zinc-800/30 flex items-center justify-center backdrop-blur-md">
                  <HelpCircle className="w-8 h-8 text-zinc-600" />
                </div>
              ))
            )}
          </div>
          
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10"></div>
        </div>

        {/* Win Result */}
        <div className="h-24 flex items-center justify-center mb-8">
          {winItem && (
            <div className={`px-10 py-4 rounded-3xl border flex items-center gap-5 animate-in zoom-in duration-300 ${winItem.value > 0 ? 'bg-emerald-900/20 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'bg-red-900/20 border-red-500/50'}`}>
              {winItem.image ? (
                <img src={winItem.image} alt={winItem.name} className="w-24 h-24 object-contain drop-shadow-xl" />
              ) : (
                <span className="text-4xl drop-shadow-xl">{winItem.icon}</span>
              )}
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Você tirou:</div>
                <div className={`font-black text-2xl tracking-tight ${winItem.value > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {winItem.name} {winItem.value > 0 ? `(+${winItem.value} Dopas)` : ''}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center">
          <button 
            onClick={openBox}
            disabled={isSpinning || (!user ? false : (user.coins || 0) < BOX_COST)}
            className={`flex items-center gap-3 px-12 py-5 rounded-full font-black text-xl uppercase tracking-widest transition-all duration-300
              ${isSpinning ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' 
              : (!user || (user.coins || 0) < BOX_COST) ? 'bg-red-500/10 text-red-500 cursor-not-allowed border border-red-500/20'
              : 'bg-accent hover:bg-accent-dark text-white shadow-lg shadow-accent/20 hover:-translate-y-1 hover:scale-105 active:scale-95'
              }
            `}
          >
            {isSpinning ? 'Abrindo...' : (
              <>
                <Gift className="w-6 h-6" /> Abrir Caixa ({BOX_COST})
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
