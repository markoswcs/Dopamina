import React, { useState, useEffect, useCallback } from 'react';
import { Package, Search, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { playSellSound } from '../audioManager';
import { cs2Items } from '../data/cs2Items';

export default function Inventory({ onUpdateCoins, onNavigateToUpgrade, onToast }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchInventory = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Inventory] Erro ao buscar inventário:', error);
        if (onToast) onToast({ title: '❌ Erro', message: 'Não foi possível carregar o inventário.' });
      } else {
        setItems(data || []);
      }
    } catch (e) {
      console.error('[Inventory] Erro inesperado:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  // Fetch inicial
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel(`inventory_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('[Inventory] Mudança em tempo real:', payload.eventType);
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, fetchInventory]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInventory();
  };

  const toggleLockItem = async (itemToLock) => {
    if (!user) return;
    const newLockState = !itemToLock.is_locked;
    
    setItems(prev => prev.map(i => i.id === itemToLock.id ? { ...i, is_locked: newLockState } : i));
    
    const { error } = await supabase
      .from('inventory')
      .update({ is_locked: newLockState })
      .eq('id', itemToLock.id)
      .eq('user_id', user.id);
      
    if (error) {
      console.error('[Inventory] Erro ao alterar tranca:', error);
      fetchInventory();
    } else if (onToast) {
      onToast(newLockState ? '🔒 Item trancado!' : '🔓 Item destrancado!');
    }
  };

  const sellItem = async (itemToSell) => {
    if (!user) return;
    if (itemToSell.is_locked) {
      if (onToast) onToast('🔒 Item trancado! Destranque-o para vender.');
      return;
    }
    playSellSound?.();

    // Optimistic update
    if (itemToSell.count > 1) {
      setItems(prev => prev.map(i => i.id === itemToSell.id ? { ...i, count: i.count - 1 } : i));
    } else {
      setItems(prev => prev.filter(i => i.id !== itemToSell.id));
    }

    const revenue = Number(itemToSell.price) || 0;
    if (onUpdateCoins) onUpdateCoins(revenue);

    // Persistir no banco
    if (itemToSell.count > 1) {
      const { error } = await supabase
        .from('inventory')
        .update({ count: itemToSell.count - 1 })
        .eq('id', itemToSell.id)
        .eq('user_id', user.id);
      if (error) {
        console.error('[Inventory] Erro ao atualizar count:', error);
        fetchInventory(); // Reverter optimistic update
      }
    } else {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', itemToSell.id)
        .eq('user_id', user.id);
      if (error) {
        console.error('[Inventory] Erro ao deletar item:', error);
        fetchInventory();
      }
    }
  };

  const sellAll = async (itemToSell) => {
    if (!user) return;
    if (itemToSell.is_locked) {
      if (onToast) onToast('🔒 Item trancado! Destranque-o para vender.');
      return;
    }
    playSellSound?.();

    const totalRevenue = (Number(itemToSell.price) || 0) * (itemToSell.count || 1);
    setItems(prev => prev.filter(i => i.id !== itemToSell.id));
    if (onUpdateCoins) onUpdateCoins(totalRevenue);

    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', itemToSell.id)
      .eq('user_id', user.id);

    if (error) {
      console.error('[Inventory] Erro ao vender todos:', error);
      fetchInventory();
    }
  };

  const filteredItems = items.filter(i =>
    (i.item_name || i.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest">Carregando Inventário...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-[var(--t-surface)] rounded-3xl border border-[var(--t-border)] max-w-sm mx-auto">
        <Package className="w-16 h-16 mb-4 text-[var(--t-muted)] opacity-50" />
        <h3 className="text-xl font-display font-black text-white">Faça login</h3>
        <p className="text-sm text-center px-8 mt-2 text-[var(--t-muted)]">Entre na sua conta para ver seu inventário.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--t-surface)]/80 backdrop-blur-xl p-5 rounded-3xl border border-[var(--t-border)] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-black text-white leading-none mb-1">INVENTÁRIO</h2>
            <span className="text-[10px] font-bold text-[var(--t-muted)] uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
              {items.reduce((acc, curr) => acc + (curr.count || 1), 0)} Itens Totais
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            title="Atualizar inventário"
          >
            <RefreshCw className={`w-4 h-4 text-zinc-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center bg-black/40 border border-white/10 rounded-full px-4 py-2.5 w-full md:w-56 focus-within:border-accent/50 transition-colors">
            <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Buscar no inventário..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none w-full placeholder:text-zinc-600"
            />
          </div>
        </div>
      </div>

      {/* Grid de Itens */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[var(--t-surface)] rounded-3xl border border-[var(--t-border)]">
          <Package className="w-16 h-16 mb-4 text-[var(--t-muted)] opacity-50" />
          <h3 className="text-xl font-display font-black text-white">
            {search ? 'Nenhum item encontrado' : 'Inventário Vazio'}
          </h3>
          <p className="text-sm text-center px-8 mt-2 text-[var(--t-muted)]">
            {search ? 'Tente outro nome.' : 'Abra caixas ou batalhe para conseguir itens.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[650px] overflow-y-auto no-scrollbar pb-10 px-1">
          {filteredItems.map(item => {
            const itemName = item.item_name || item.name || 'Item Desconhecido';
            const itemPrice = Number(item.price) || 0;
            const itemCount = item.count || 1;

            // Buscar imagem do cs2Items se não estiver salva
            const dbRef = cs2Items.find(x => x.name === itemName);
            const image = item.image || dbRef?.image || null;

            // Cor de raridade - pode ser hex ou classe tailwind
            let rarityHex = '#4b69ff'; // azul padrão
            if (item.rarity_color) {
              if (item.rarity_color.startsWith('#')) {
                rarityHex = item.rarity_color;
              } else {
                // Mapear de hex para cor visual
                if (item.rarity_color.includes('red') || item.rarity_color.includes('eb4b4b')) rarityHex = '#eb4b4b';
                else if (item.rarity_color.includes('pink') || item.rarity_color.includes('d32ce6')) rarityHex = '#d32ce6';
                else if (item.rarity_color.includes('purple') || item.rarity_color.includes('8847ff')) rarityHex = '#8847ff';
                else if (item.rarity_color.includes('yellow') || item.rarity_color.includes('e4ae39')) rarityHex = '#e4ae39';
                else if (item.rarity_color.includes('blue') || item.rarity_color.includes('4b69ff')) rarityHex = '#4b69ff';
              }
            } else if (dbRef?.rarity_color) {
              rarityHex = dbRef.rarity_color.startsWith('#') ? dbRef.rarity_color : rarityHex;
            }

            return (
              <div
                key={item.id}
                className="group relative aspect-[3/4] flex flex-col justify-between items-center overflow-hidden rounded-[24px] border border-white/10 transition-all duration-300 hover:scale-[1.02] bg-[var(--t-surface)] backdrop-blur-md"
                style={{ borderColor: `${rarityHex}40` }}
              >
                {/* Glow fundo */}
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none blur-2xl"
                  style={{ backgroundColor: rarityHex }}
                />

                {/* Linha inferior de raridade */}
                <div
                  className="absolute bottom-0 left-0 w-full h-[3px] z-20"
                  style={{ backgroundColor: rarityHex }}
                />

                {/* Badge Preço */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[9px] font-black tracking-widest text-white/90 bg-black/60 backdrop-blur-md border border-white/10 z-20 shadow-sm">
                  D$ {itemPrice.toFixed(2)}
                </div>

                {/* Badge Quantidade ou Lock */}
                <div className="absolute top-3 right-3 flex items-center gap-1 z-20">
                  {item.is_locked && (
                    <div className="bg-amber-500/90 text-black px-1.5 py-0.5 rounded-md text-[10px] font-black shadow-sm" title="Item Trancado">
                      🔒
                    </div>
                  )}
                  {itemCount > 1 && (
                    <div className="bg-black/80 px-2 py-1 rounded-md text-[10px] font-black text-white border border-white/10 shadow-sm">
                      x{itemCount}
                    </div>
                  )}
                </div>

                {/* Ícone ou Imagem */}
                <div className="flex-1 flex items-center justify-center w-full z-10 relative px-4">
                  {image ? (
                    <img
                      src={image}
                      alt={itemName}
                      className="w-full max-w-[120px] object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span
                      className="text-5xl group-hover:scale-110 transition-transform duration-500"
                      style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))' }}
                    >
                      {item.icon || '📦'}
                    </span>
                  )}
                </div>

                {/* Nome */}
                <div className="relative z-10 w-full text-center pb-5 px-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-8">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider leading-tight text-zinc-200 line-clamp-2">
                    {itemName.split('|')[1]?.trim() || itemName}
                  </h4>
                  <p className="text-[9px] text-zinc-500 mt-0.5">
                    {itemName.split('|')[0]?.trim()}
                  </p>
                </div>

                {/* Ações no Hover */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 p-4">
                  <button
                    onClick={() => toggleLockItem(item)}
                    className={`w-full py-2.5 rounded-xl text-[10px] font-bold uppercase transition-colors flex items-center justify-center gap-1.5 border shadow-sm ${
                      item.is_locked 
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500 hover:text-white' 
                        : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    {item.is_locked ? '🔓 Destrancar' : '🔒 Trancar'}
                  </button>

                  {onNavigateToUpgrade && !item.is_locked && (
                    <button
                      onClick={() => onNavigateToUpgrade({ ...item, name: itemName })}
                      className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span className="text-accent text-sm">⚡</span> Upgrade
                    </button>
                  )}
                  <div className="flex flex-col gap-2 w-full mt-1">
                    <button
                      onClick={() => sellItem(item)}
                      disabled={item.is_locked}
                      className={`w-full py-2.5 rounded-xl text-[10px] font-bold uppercase transition-colors border ${
                        item.is_locked 
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-600 cursor-not-allowed' 
                          : 'bg-red-500/10 border-red-500/30 hover:bg-red-500 hover:border-red-500 text-red-400 hover:text-white'
                      }`}
                    >
                      Vender 1 — D$ {itemPrice.toFixed(2)}
                    </button>
                    {itemCount > 1 && (
                      <button
                        onClick={() => sellAll(item)}
                        className="w-full py-2.5 bg-red-500/20 border border-red-500/50 hover:bg-red-600 hover:border-red-600 text-red-300 hover:text-white rounded-xl text-[10px] font-bold uppercase transition-colors"
                      >
                        Vender Todos — D$ {(itemPrice * itemCount).toFixed(2)}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
