import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Gift, X, Sparkles } from 'lucide-react';
import { cs2Items } from '../data/cs2Items';

// Helper para sortear item com base em raridade
function drawItem() {
  const weightedItems = cs2Items.map(item => {
    let w = 10;
    const r = (item.rarity || '').toLowerCase();
    if (r.includes('consumer') || r.includes('industrial') || r.includes('base grade')) w = 1000;
    else if (r.includes('mil-spec') || r.includes('high grade')) w = 200;
    else if (r.includes('restricted') || r.includes('remarkable')) w = 40;
    else if (r.includes('classified') || r.includes('exotic')) w = 8;
    else if (r.includes('covert') || r.includes('extraordinary') || r.includes('master')) w = 1;
    else if (r.includes('contraband')) w = 0.1;
    return { ...item, _weight: w };
  });

  const total = weightedItems.reduce((s, i) => s + i._weight, 0);
  let rand = Math.random() * total;
  for (const item of weightedItems) {
    if (rand <= item._weight) return item;
    rand -= item._weight;
  }
  return weightedItems[Math.floor(Math.random() * weightedItems.length)];
}

// Helper para salvar item no inventário via Supabase
async function saveItemToInventory(userId, wonItem) {
  console.log('[DailyCaseModal] Salvando item no inventário:', wonItem.name, 'para user:', userId);
  
  // Tenta verificar se já existe
  const { data: existing, error: selErr } = await supabase
    .from('inventory')
    .select('id, count')
    .eq('user_id', userId)
    .eq('item_name', wonItem.name)
    .maybeSingle(); // usa maybeSingle para não dar erro se não encontrar

  if (selErr) {
    console.error('[DailyCaseModal] Erro ao verificar inventory existente:', selErr);
  }

  if (existing) {
    console.log('[DailyCaseModal] Item existe, incrementando count:', existing.id);
    const { error: updErr } = await supabase
      .from('inventory')
      .update({ count: (existing.count || 1) + 1 })
      .eq('id', existing.id);
    if (updErr) {
      console.error('[DailyCaseModal] Erro ao incrementar count:', updErr);
      return { success: false, error: updErr };
    }
    return { success: true };
  } else {
    console.log('[DailyCaseModal] Novo item, inserindo...');
    const { data: insertedData, error: insErr } = await supabase
      .from('inventory')
      .insert({
        user_id: userId,
        item_id: wonItem.id ? wonItem.id.toString() : `daily-${Date.now()}`,
        item_name: wonItem.name,
        price: wonItem.price || 1,
        count: 1,
        icon: wonItem.icon || '📦',
        rarity_color: wonItem.rarity_color || '#4b69ff',
        image: wonItem.image || null
      })
      .select();

    if (insErr) {
      console.error('[DailyCaseModal] Erro ao inserir item:', insErr);
      return { success: false, error: insErr };
    }
    console.log('[DailyCaseModal] Item inserido com sucesso:', insertedData);
    return { success: true };
  }
}

export default function DailyCaseModal({ isOpen, onClose, onItemWon }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [boxState1, setBoxState1] = useState('idle');
  const [boxState2, setBoxState2] = useState('idle');
  const [item1, setItem1] = useState(null);
  const [item2, setItem2] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (!isOpen || !user) return;
    let mounted = true;
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('daily_cases')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        let canClaim = true;
        let nextClaim = null;

        if (data && data.last_opened_at) {
          const lastOpened = new Date(data.last_opened_at);
          const diffMs = Date.now() - lastOpened.getTime();
          if (diffMs < 24 * 60 * 60 * 1000) {
            canClaim = false;
            nextClaim = new Date(lastOpened.getTime() + 24 * 60 * 60 * 1000);
          }
        }

        if (mounted) {
          setStatus({
            cases_remaining: canClaim ? 2 : 0,
            next_claim_at: nextClaim,
            current_streak: data?.current_streak || 0
          });
          if (!canClaim) { setBoxState1('closed'); setBoxState2('closed'); }
          else { setBoxState1('idle'); setBoxState2('idle'); }
          setLoading(false);
        }
      } catch (err) {
        console.error('[DailyCaseModal] Erro ao buscar status:', err);
        if (mounted) setLoading(false);
      }
    };
    fetchStatus();
    return () => { mounted = false; };
  }, [isOpen, user]);

  useEffect(() => {
    if (!status?.next_claim_at || status.cases_remaining > 0) return;
    const interval = setInterval(() => {
      const diff = new Date(status.next_claim_at) - new Date();
      if (diff <= 0) { setTimeLeft('Disponível agora!'); clearInterval(interval); return; }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const handleOpenBox = async (boxNum) => {
    if (boxNum === 1 && boxState1 !== 'idle') return;
    if (boxNum === 2 && boxState2 !== 'idle') return;
    if (!user) { alert('Você precisa estar logado!'); return; }

    const setBoxState = boxNum === 1 ? setBoxState1 : setBoxState2;
    const setItem = boxNum === 1 ? setItem1 : setItem2;
    setSaveError(null);

    try {
      setBoxState('opening');
      
      // Sortear item
      const wonItem = drawItem();
      console.log('[DailyCaseModal] Item sorteado:', wonItem.name, wonItem.price);

      await new Promise(r => setTimeout(r, 800));

      // Registrar que abriu a caixa hoje
      const { error: upsertErr } = await supabase
        .from('daily_cases')
        .upsert(
          { user_id: user.id, last_opened_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );

      if (upsertErr) {
        console.error('[DailyCaseModal] Erro ao registrar daily_case:', upsertErr);
        // Não bloquear o fluxo por causa disso, continua
      }

      // Salvar item no inventário
      const saveResult = await saveItemToInventory(user.id, wonItem);
      if (!saveResult.success) {
        console.error('[DailyCaseModal] Falha ao salvar item:', saveResult.error);
        setSaveError(saveResult.error?.message || 'Erro ao salvar item');
      }

      setItem(wonItem);
      setBoxState('result');
      if (onItemWon) onItemWon(wonItem);

      setTimeout(() => {
        setBoxState('closed');
        setStatus(prev => prev ? ({
          ...prev,
          cases_remaining: Math.max(0, (prev.cases_remaining || 1) - 1),
          next_claim_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }) : prev);
      }, 3000);
    } catch (err) {
      console.error('[DailyCaseModal] Erro inesperado:', err);
      setBoxState('idle');
      setSaveError(err.message);
    }
  };

  if (!isOpen) return null;

  const streak = status?.current_streak || 0;
  const isGoldBorder = streak >= 10;
  const casesRemaining = status?.cases_remaining ?? 2;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`relative w-full max-w-md bg-[#0f1117] rounded-3xl border-2 ${isGoldBorder ? 'border-yellow-500/60' : 'border-white/10'} p-6 flex flex-col items-center gap-5 shadow-2xl`}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center">
            <Gift className="w-7 h-7 text-accent" />
          </div>
          <h2 className="text-xl font-black text-white tracking-wide">CAIXA DIÁRIA</h2>
          {saveError && (
            <div className="text-red-400 text-xs bg-red-900/30 border border-red-500/30 rounded-lg px-3 py-1 text-center max-w-[300px]">
              ⚠️ {saveError}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 py-8">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-zinc-400 text-sm">Verificando...</span>
          </div>
        )}

        {/* Esgotado */}
        {!loading && casesRemaining === 0 && (
          <div className="flex flex-col items-center gap-3 py-6">
            <span className="text-5xl">🔒</span>
            <p className="text-zinc-300 font-bold text-center">Você já abriu suas caixas hoje!</p>
            <p className="text-zinc-500 text-sm text-center">Próxima caixa disponível em:</p>
            <div className="font-mono text-2xl font-black text-accent">{timeLeft}</div>
          </div>
        )}

        {/* Caixas */}
        {!loading && casesRemaining > 0 && (
          <div className="flex gap-5 justify-center w-full">
            {[1, 2].map(boxNum => {
              const boxState = boxNum === 1 ? boxState1 : boxState2;
              const item = boxNum === 1 ? item1 : item2;

              return (
                <div key={boxNum} className="flex flex-col items-center gap-3 flex-1">
                  <div
                    onClick={() => handleOpenBox(boxNum)}
                    className={`w-full aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 relative overflow-hidden
                      ${boxState === 'idle' ? 'border-white/20 bg-white/5 hover:border-accent/60 hover:bg-accent/10 hover:scale-105 active:scale-95' : ''}
                      ${boxState === 'opening' ? 'border-accent/60 bg-accent/10 animate-pulse' : ''}
                      ${boxState === 'result' ? 'border-green-500/60 bg-green-900/20' : ''}
                      ${boxState === 'closed' ? 'border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {boxState === 'idle' && (
                      <>
                        <span className="text-4xl">🎁</span>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Caixa {boxNum}</span>
                        <span className="text-[10px] text-accent font-bold">CLIQUE PARA ABRIR</span>
                      </>
                    )}
                    {boxState === 'opening' && (
                      <>
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-accent font-bold">Abrindo...</span>
                      </>
                    )}
                    {boxState === 'result' && item && (
                      <>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-contain drop-shadow-lg" />
                        ) : (
                          <span className="text-4xl">🎉</span>
                        )}
                        <span className="text-[10px] text-green-400 font-bold text-center px-1 line-clamp-2">{item.name?.split('|')[1]?.trim() || item.name}</span>
                        <span className="text-[9px] text-zinc-400">D$ {(item.price || 0).toFixed(2)}</span>
                      </>
                    )}
                    {boxState === 'closed' && (
                      <>
                        <span className="text-4xl opacity-30">🎁</span>
                        <span className="text-xs text-zinc-600 font-bold">Aberta</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Streak info */}
        {streak > 0 && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Sparkles className="w-3 h-3 text-yellow-500" />
            <span>Sequência: <span className="text-yellow-400 font-bold">{streak} dias</span></span>
          </div>
        )}
      </div>
    </div>
  );
}
