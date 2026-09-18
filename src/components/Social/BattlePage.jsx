import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Swords, Copy, Check, Loader2, Bot, Users } from 'lucide-react';
import { cs2Items } from '../../data/cs2Items';

const BOTS = [
  { id: 'bot0', name: '🤖 BotZero', botWinChance: 55, label: '45% de vitória (o bot tem 55% de chance)' },
  { id: 'bot1', name: '🦆 PatoGamer', botWinChance: 52, label: '48% de vitória' },
  { id: 'bot2', name: '🐢 TartarugaLenta', botWinChance: 50, label: '50/50' },
  { id: 'bot3', name: '🦊 RaposaMalandra', botWinChance: 48, label: '52% de vitória' },
  { id: 'bot4', name: '🐉 DragãoDoCS', botWinChance: 45, label: '55% de vitória' },
  { id: 'bot5', name: '💀 CaçadorLendário', botWinChance: 60, label: '60% de vitória (mais difícil)' }
];

export default function BattlePage({ onToast }) {
  const { user, updateBalance } = useAuth();
  
  const urlParams = new URLSearchParams(window.location.search);
  const joinBattleId = urlParams.get('battle');

  const [playMode, setPlayMode] = useState('bot'); // 'bot' or 'online'
  const [battleState, setBattleState] = useState(joinBattleId ? 'waiting_to_join' : 'create'); 
  const [battleId, setBattleId] = useState(joinBattleId || null);
  const [entryFee, setEntryFee] = useState(100);
  const [selectedCase, setSelectedCase] = useState('Caixa Dopamina');
  const [selectedBot, setSelectedBot] = useState(BOTS[0]);
  
  const [host, setHost] = useState(null);
  const [guest, setGuest] = useState(null);
  const [winnerId, setWinnerId] = useState(null);
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [hostItem, setHostItem] = useState(null);
  const [guestItem, setGuestItem] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const cases = ['Caixa Dopamina', 'Kilowatt Case', 'Legendary Box', 'Starter Pack'];

  useEffect(() => {
    if (joinBattleId) {
      setPlayMode('online');
    }
  }, [joinBattleId]);

  useEffect(() => {
    if (!battleId || playMode === 'bot') return;

    const fetchBattle = async () => {
      const { data, error } = await supabase
        .from('battles')
        .select('*, host:profiles!battles_host_id_fkey(id, username), guest:profiles!battles_guest_id_fkey(id, username)')
        .eq('id', battleId)
        .single();
        
      if (data) updateLocalStateFromDb(data);
    };

    fetchBattle();

    const sub = supabase
      .channel(`battle_${battleId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'battles', filter: `id=eq.${battleId}` }, (payload) => {
        fetchBattle();
      })
      .subscribe();

    return () => sub.unsubscribe();
  }, [battleId, playMode]);

  const updateLocalStateFromDb = (dbBattle) => {
    setHost({ id: dbBattle.host.id, name: dbBattle.host.username, avatar: 'https://i.pravatar.cc/150?u='+dbBattle.host.id });
    if (dbBattle.guest) {
      setGuest({ id: dbBattle.guest.id, name: dbBattle.guest.username, avatar: 'https://i.pravatar.cc/150?u='+dbBattle.guest.id });
    }
    
    if (dbBattle.status === 'active' && battleState !== 'active' && battleState !== 'finished') {
      startOnlineBattleAnimation(dbBattle);
    }
  };

  const startOnlineBattleAnimation = (dbBattle) => {
    setBattleState('active');
    setCountdown(3);
    
    let currentCount = 3;
    const interval = setInterval(() => {
      currentCount--;
      if (currentCount > 0) {
        setCountdown(currentCount);
      } else {
        clearInterval(interval);
        setCountdown(null);
      }
    }, 1000);

    setTimeout(async () => {
      if (user && user.id === dbBattle.host_id) {
        const item1 = cs2Items[Math.floor(Math.random() * cs2Items.length)];
        const item2 = cs2Items[Math.floor(Math.random() * cs2Items.length)];
        
        const winId = item1.price >= item2.price ? dbBattle.host_id : dbBattle.guest_id;
        
        await supabase.from('battles').update({
          status: 'finished',
          winner_id: winId
        }).eq('id', dbBattle.id);
        
        setHostItem({ name: item1.name, value: item1.price, image: item1.image });
        setGuestItem({ name: item2.name, value: item2.price, image: item2.image });
        setWinnerId(winId);
        setBattleState('finished');
        
        const profit = winId === user.id ? (dbBattle.entry_fee * 2) : 0;
        updateBalance((user.coins || 0) + profit);
        
      } else {
        setTimeout(async () => {
          const { data } = await supabase.from('battles').select('*').eq('id', dbBattle.id).single();
          if (data && data.winner_id) {
            const fakeItem1 = cs2Items[Math.floor(Math.random() * cs2Items.length)];
            const fakeItem2 = cs2Items[Math.floor(Math.random() * cs2Items.length)];
            
            if (data.winner_id === dbBattle.host_id) {
              setHostItem({ name: fakeItem1.name, value: Math.max(fakeItem1.price, fakeItem2.price), image: fakeItem1.image });
              setGuestItem({ name: fakeItem2.name, value: Math.min(fakeItem1.price, fakeItem2.price), image: fakeItem2.image });
            } else {
              setHostItem({ name: fakeItem1.name, value: Math.min(fakeItem1.price, fakeItem2.price), image: fakeItem1.image });
              setGuestItem({ name: fakeItem2.name, value: Math.max(fakeItem1.price, fakeItem2.price), image: fakeItem2.image });
            }
            
            setWinnerId(data.winner_id);
            setBattleState('finished');
            const profit = data.winner_id === user.id ? (dbBattle.entry_fee * 2) : 0;
            updateBalance((user.coins || 0) + profit);
          }
        }, 1000);
      }
    }, 3000);
  };

  const handleCreateOnline = async () => {
    if (!user || (user.coins || 0) < entryFee) {
      if(onToast) onToast('Dopas insuficientes!');
      return;
    }

    updateBalance((user.coins || 0) - entryFee);

    const { data, error } = await supabase.from('battles').insert({
      host_id: user.id,
      entry_fee: entryFee,
      status: 'waiting'
    }).select().single();

    if (!error && data) {
      setBattleId(data.id);
      setInviteLink(`${window.location.origin}?battle=${data.id}`);
      setBattleState('waiting');
      setHost({ id: user.id, name: user.user_metadata?.username || 'Você', avatar: 'https://i.pravatar.cc/150?u='+user.id });
    }
  };

  const handleJoinOnline = async () => {
    if (!user || (user.coins || 0) < entryFee) {
      if(onToast) onToast('Dopas insuficientes para entrar nesta batalha!');
      return;
    }

    const { data: dbBattle } = await supabase.from('battles').select('*').eq('id', battleId).single();
    
    if (dbBattle && dbBattle.status === 'waiting') {
      updateBalance((user.coins || 0) - entryFee);
      
      await supabase.from('battles').update({
        guest_id: user.id,
        status: 'active'
      }).eq('id', battleId);
      
      if(onToast) onToast('Entrou na Batalha!');
    } else {
      if(onToast) onToast('Esta batalha não está mais disponível.');
    }
  };

  const startBotBattle = () => {
    if (!user || (user.coins || 0) < entryFee) {
      if(onToast) onToast('Dopas insuficientes!');
      return;
    }

    updateBalance((user.coins || 0) - entryFee);

    setHost({ id: user.id, name: user.user_metadata?.username || 'Você', avatar: 'https://i.pravatar.cc/150?u='+user.id });
    setGuest({ id: selectedBot.id, name: selectedBot.name, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + selectedBot.id });
    
    setBattleState('active');
    setCountdown(3);
    
    let currentCount = 3;
    const interval = setInterval(() => {
      currentCount--;
      if (currentCount > 0) {
        setCountdown(currentCount);
      } else {
        clearInterval(interval);
        setCountdown(null);
      }
    }, 1000);

    setTimeout(() => {
      const botRoll = Math.random() * 100;
      const botWins = botRoll <= selectedBot.botWinChance;

      let item1 = cs2Items[Math.floor(Math.random() * cs2Items.length)];
      let item2 = cs2Items[Math.floor(Math.random() * cs2Items.length)];
      
      // Ensure prices match the outcome
      if (botWins) {
        if (item1.price > item2.price) {
          const temp = item1;
          item1 = item2;
          item2 = temp;
        }
      } else {
        if (item1.price < item2.price) {
          const temp = item1;
          item1 = item2;
          item2 = temp;
        }
      }

      setHostItem({ name: item1.name, value: item1.price, image: item1.image });
      setGuestItem({ name: item2.name, value: item2.price, image: item2.image });
      
      const winId = botWins ? selectedBot.id : user.id;
      setWinnerId(winId);
      setBattleState('finished');
      
      if (!botWins) {
        updateBalance((user.coins || 0) + entryFee * 2);
      }
    }, 3000);
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    if(onToast) onToast('Link copiado! Envie para o seu amigo.');
    setTimeout(() => setCopied(false), 2000);
  };

  const isHost = user && host && user.id === host.id;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 min-h-[80vh] flex flex-col items-center">
      
      {/* Create State */}
      {battleState === 'create' && (
        <div className="w-full max-w-xl bg-[var(--t-surface)]/80 backdrop-blur-xl border border-[var(--t-border)] rounded-3xl p-8 flex flex-col gap-6 shadow-2xl">
          <div className="text-center">
            <h1 className="text-3xl font-display font-black text-white mb-2 flex items-center justify-center gap-3">
              <Swords className="w-8 h-8 text-accent" />
              Batalha de <span className="text-accent">Caixas</span>
            </h1>
            <p className="text-[var(--t-muted)] text-sm font-semibold">Tudo ou nada. Escolha seu modo.</p>
          </div>

          <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
            <button
              onClick={() => setPlayMode('bot')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${playMode === 'bot' ? 'bg-accent text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
            >
              <Bot className="w-4 h-4" /> Bot (Offline)
            </button>
            <button
              onClick={() => setPlayMode('online')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${playMode === 'online' ? 'bg-accent text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
            >
              <Users className="w-4 h-4" /> Online (PvP)
            </button>
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--t-muted)] mb-3">Selecione a Caixa</label>
            <div className="grid grid-cols-2 gap-3">
              {cases.map(c => (
                <button 
                  key={c}
                  onClick={() => setSelectedCase(c)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all duration-300 ${selectedCase === c ? 'bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(var(--color-accent),0.2)]' : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/20'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {playMode === 'bot' && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--t-muted)] mb-3">Escolha o Bot</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {BOTS.map(bot => (
                  <button 
                    key={bot.id}
                    onClick={() => setSelectedBot(bot)}
                    className={`p-3 rounded-xl border flex flex-col items-start transition-all duration-300 ${selectedBot.id === bot.id ? 'bg-accent/10 border-accent shadow-[0_0_15px_rgba(var(--color-accent),0.2)]' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                  >
                    <span className={`text-sm font-bold ${selectedBot.id === bot.id ? 'text-accent' : 'text-white'}`}>{bot.name}</span>
                    <span className="text-[10px] font-semibold text-zinc-500 mt-1">{bot.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--t-muted)] mb-3">Aposta (Dopas)</label>
            <input 
              type="number"
              value={entryFee}
              onChange={(e) => setEntryFee(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-accent/50 text-xl font-black transition-colors"
            />
          </div>
          
          <button 
            onClick={playMode === 'bot' ? startBotBattle : handleCreateOnline}
            className="w-full py-4 mt-2 bg-accent hover:bg-opacity-80 text-white rounded-xl font-black text-lg uppercase tracking-widest shadow-lg shadow-accent/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
          >
            <Swords className="w-5 h-5" /> {playMode === 'bot' ? 'Batalhar contra Bot' : 'Criar Arena Online'}
          </button>
        </div>
      )}

      {battleState === 'waiting_to_join' && (
        <div className="w-full max-w-lg bg-[var(--t-surface)] p-8 rounded-3xl border border-[var(--t-border)] text-center shadow-2xl">
          <Swords className="w-16 h-16 text-accent mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-black text-white mb-2">Você foi desafiado!</h2>
          <p className="text-zinc-400 mb-8">Prepare suas Dopas e enfrente o host na Batalha de Caixas.</p>
          <button onClick={handleJoinOnline} className="w-full py-4 bg-accent text-white font-black text-lg uppercase rounded-xl hover:bg-opacity-80 transition-all">
            Aceitar Batalha
          </button>
        </div>
      )}

      {/* Room State */}
      {(battleState === 'waiting' || battleState === 'active' || battleState === 'finished') && (
        <div className="w-full flex flex-col items-center">
          
          {/* Header Info */}
          <div className="mb-12 text-center bg-[var(--t-surface)]/50 backdrop-blur-md border border-[var(--t-border)] px-8 py-4 rounded-3xl inline-block shadow-sm">
            <h2 className="text-2xl font-display font-black text-white mb-2">{selectedCase}</h2>
            <div className="inline-flex items-center gap-2 bg-black/40 border border-white/5 px-4 py-1.5 rounded-full text-zinc-300 font-semibold text-sm">
              <span className="uppercase text-[10px] tracking-widest text-zinc-500">Pote Total:</span>
              <span className="text-accent font-black">{entryFee * 2} 💎</span>
            </div>
          </div>

          {/* VS Arena */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 w-full max-w-5xl">
            
            {/* Challenger (Host) */}
            <div className={`flex flex-col items-center gap-6 transition-all duration-700 ${battleState === 'finished' && winnerId === host?.id ? 'scale-110 drop-shadow-[0_0_30px_rgba(var(--color-accent),0.4)]' : ''}`}>
              <div className="relative">
                <img loading="lazy" decoding="async" src={host?.avatar || 'https://via.placeholder.com/150'} className={`w-32 h-32 md:w-44 md:h-44 rounded-full border-[6px] ${battleState === 'finished' && winnerId === host?.id ? 'border-accent' : 'border-white/10'} object-cover bg-black/40 shadow-xl`} alt="P1"/>
                {battleState === 'finished' && winnerId === host?.id && <div className="absolute -top-6 -right-6 text-6xl drop-shadow-xl animate-bounce">👑</div>}
              </div>
              <h3 className="text-xl font-bold text-white bg-black/40 px-4 py-1 rounded-full border border-white/5">{host?.name || 'Aguardando...'}</h3>
              
              {/* Item Slot */}
              <div className="w-56 h-56 bg-black/40 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center overflow-hidden relative backdrop-blur-sm p-4">
                {battleState === 'finished' && hostItem ? (
                  <div className="animate-in zoom-in duration-500 flex flex-col items-center justify-center text-center w-full h-full">
                    <img loading="lazy" decoding="async" src={hostItem.image} alt={hostItem.name} className="w-32 h-32 object-contain mb-3 drop-shadow-lg"/>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider line-clamp-2 leading-tight">{hostItem.name}</span>
                    <span className="text-lg font-black text-accent mt-2">{hostItem.value.toLocaleString('pt-BR')} 💎</span>
                  </div>
                ) : (
                  <span className={`text-5xl ${battleState === 'active' ? 'animate-pulse' : 'opacity-30'}`}>📦</span>
                )}
              </div>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center">
              {countdown !== null ? (
                <div className="text-7xl font-display font-black text-accent animate-ping my-4 md:my-0">
                  {countdown}
                </div>
              ) : (
                <div className="text-4xl md:text-6xl font-display font-black text-white/10 my-4 md:my-0 italic">
                  VS
                </div>
              )}
            </div>

            {/* Opponent (Guest) */}
            <div className={`flex flex-col items-center gap-6 transition-all duration-700 ${battleState === 'finished' && winnerId === guest?.id ? 'scale-110 drop-shadow-[0_0_30px_rgba(var(--color-accent),0.4)]' : ''}`}>
              <div className="relative">
                <div className={`w-32 h-32 md:w-44 md:h-44 rounded-full border-[6px] ${battleState === 'finished' && winnerId === guest?.id ? 'border-accent' : 'border-white/10'} overflow-hidden bg-black/40 shadow-xl flex items-center justify-center`}>
                  {guest ? (
                     <img loading="lazy" decoding="async" src={guest.avatar} className="w-full h-full object-cover" alt="P2"/>
                  ) : (
                    <Loader2 className="w-10 h-10 text-zinc-600 animate-spin" />
                  )}
                </div>
                {battleState === 'finished' && winnerId === guest?.id && <div className="absolute -top-6 -right-6 text-6xl drop-shadow-xl animate-bounce">👑</div>}
              </div>
              <h3 className="text-xl font-bold text-white bg-black/40 px-4 py-1 rounded-full border border-white/5">{guest?.name || 'Aguardando oponente...'}</h3>
              
              {/* Item Slot */}
              <div className="w-56 h-56 bg-black/40 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center overflow-hidden relative backdrop-blur-sm p-4">
                {battleState === 'finished' && guestItem ? (
                  <div className="animate-in zoom-in duration-500 flex flex-col items-center justify-center text-center w-full h-full">
                    <img loading="lazy" decoding="async" src={guestItem.image} alt={guestItem.name} className="w-32 h-32 object-contain mb-3 drop-shadow-lg"/>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider line-clamp-2 leading-tight">{guestItem.name}</span>
                    <span className="text-lg font-black text-accent mt-2">{guestItem.value.toLocaleString('pt-BR')} 💎</span>
                  </div>
                ) : (
                  <span className={`text-5xl ${battleState === 'active' ? 'animate-pulse' : 'opacity-30'}`}>📦</span>
                )}
              </div>
            </div>

          </div>

          {/* Status / Controls */}
          <div className="mt-16 w-full max-w-lg flex flex-col items-center text-center">
            {battleState === 'waiting' && isHost && playMode === 'online' && (
              <div className="w-full bg-[var(--t-surface)] p-8 rounded-3xl border border-[var(--t-border)] shadow-xl">
                <h4 className="text-lg font-bold text-white mb-6 flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                  Aguardando Desafiante...
                </h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--t-muted)] mb-3">Link de Convite da Arena</p>
                <div className="flex gap-2">
                  <input type="text" readOnly value={inviteLink} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-zinc-300 text-sm font-mono focus:outline-none"/>
                  <button onClick={copyInvite} className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-bold transition-colors border border-white/10 flex items-center gap-2">
                    {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {battleState === 'active' && countdown === null && (
              <h3 className="text-3xl font-display font-black text-accent animate-pulse tracking-widest">ABRINDO CAIXAS...</h3>
            )}

            {battleState === 'finished' && (
              <div className="animate-in slide-in-from-bottom-8 duration-500 w-full bg-[var(--t-surface)]/90 backdrop-blur-2xl p-8 rounded-3xl border border-[var(--t-border)] shadow-2xl">
                {winnerId === user?.id ? (
                  <>
                    <h3 className="text-5xl font-display font-black text-accent mb-3 drop-shadow-[0_0_15px_rgba(var(--color-accent),0.4)]">VITÓRIA!</h3>
                    <p className="text-white text-lg font-medium">Você levou o pote inteiro de <strong className="text-accent font-black text-xl">{entryFee * 2} Dopas</strong>!</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-5xl font-display font-black text-red-500 mb-3 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]">DERROTA</h3>
                    <p className="text-zinc-300 text-lg font-medium">O adversário levou a melhor. Tente novamente.</p>
                  </>
                )}
                
                <button 
                  onClick={() => { setBattleState('create'); setBattleId(null); setWinnerId(null); setHost(null); setGuest(null); setHostItem(null); setGuestItem(null); }}
                  className="mt-8 px-10 py-4 bg-white hover:bg-zinc-200 text-black rounded-full font-black uppercase tracking-widest transition-transform hover:-translate-y-1 shadow-lg"
                >
                  Jogar Novamente
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
