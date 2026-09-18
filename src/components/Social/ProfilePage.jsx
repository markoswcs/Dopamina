import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Edit2, Check, X, Calendar, 
  Zap, TrendingUp, 
  Users, Swords, Trophy, Target, Star, Plus, Trash2, Sparkles, Link, Gift, Package
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = ({ userId, onNavigate }) => {
  const { user } = useAuth();
  const isOwnProfile = user?.id === userId;

  const [profile, setProfile] = useState({
    username: 'Jogador',
    bio: 'Sem biografia.',
    wins: 0,
    losses: 0,
    streak: 0,
    xp: 0,
    level: 1,
    total_spent: 0,
    showcase_items: [],
    created_at: new Date().toISOString(),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', bio: '' });
  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState('showcase');

  // Showcase states
  const [showcaseItems, setShowcaseItems] = useState([]); // resolved items for display
  const [showPicker, setShowPicker] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [savingShowcase, setSavingShowcase] = useState(false);

  // Referral states
  const [referralCount, setReferralCount] = useState(0);
  const [hasPendingReferral, setHasPendingReferral] = useState(false);
  const [claimingReward, setClaimingReward] = useState(false);
  const [referralMessage, setReferralMessage] = useState('');
  

  const [copiedTag, setCopiedTag] = useState(false);

  const fileInputRef = useRef(null);
  const MAX_SHOWCASE = 6;

  useEffect(() => {
    if (!userId) return;
    fetchProfile();
    if (isOwnProfile) fetchReferralInfo();
    const localAvatar = localStorage.getItem(`avatar_${userId}`);
    if (localAvatar) setAvatar(localAvatar);

  }, [userId, isOwnProfile]);

  const handleCopyTag = () => {
    navigator.clipboard.writeText(`${profile.username}#${userId.substring(0, 8)}`);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  const fetchReferralInfo = async () => {
    // Verifies if there is a pending referral
    const { data: pending } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_id', userId)
      .eq('status', 'pending')
      .maybeSingle();
    
    if (pending) setHasPendingReferral(true);

    // Counts completed referrals in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count } = await supabase
      .from('referrals')
      .select('id', { count: 'exact' })
      .eq('referrer_id', userId)
      .eq('status', 'completed')
      .gte('created_at', sevenDaysAgo.toISOString());
    
    setReferralCount(count || 0);
  };

  const handleClaimReward = async () => {
    setClaimingReward(true);
    setReferralMessage('');
    const { data, error } = await supabase.rpc('claim_referral_reward');
    setClaimingReward(false);
    if (error) {
      setReferralMessage('Erro ao resgatar: ' + error.message);
    } else {
      setReferralMessage(data); // "SUCESSO" or error message from RPC
      if (data === 'SUCESSO') {
        setHasPendingReferral(false);
        // Force balance update
        window.dispatchEvent(new Event('updateBalance'));
      }
    }
  };

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('username, bio, wins, losses, streak, xp, level, total_spent, showcase_items, created_at, avatar_url, cases_opened')
        .eq('id', userId)
        .single();

      if (data) {
        const showcaseIds = data.showcase_items || [];
        setProfile({
          username: data.username || 'Jogador',
          bio: data.bio || 'Sem biografia.',
          wins: data.wins || 0,
          losses: data.losses || 0,
          streak: data.streak || 0,
          xp: data.xp || 0,
          level: data.level || 1,
          total_spent: Number(data.total_spent) || 0,
          cases_opened: data.cases_opened || 0,
          showcase_items: showcaseIds,
          created_at: data.created_at || new Date().toISOString(),
        });
        setEditForm({ username: data.username || 'Jogador', bio: data.bio || 'Sem biografia.' });
        if (data.avatar_url && !localStorage.getItem(`avatar_${userId}`)) setAvatar(data.avatar_url);

        // Fetch the actual showcase items from inventory
        if (showcaseIds.length > 0) {
          const { data: items } = await supabase
            .from('inventory')
            .select('id, item_name, price, image, rarity_color, icon')
            .in('id', showcaseIds);
          // Preserve showcase order
          const ordered = showcaseIds.map(id => items?.find(i => i.id === id)).filter(Boolean);
          setShowcaseItems(ordered);
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openPicker = async () => {
    if (!isOwnProfile) return;
    const { data } = await supabase
      .from('inventory')
      .select('id, item_name, price, image, rarity_color, icon')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    setInventoryItems(data || []);
    setShowPicker(true);
  };

  const toggleShowcaseItem = (item) => {
    const currentIds = showcaseItems.map(i => i.id);
    if (currentIds.includes(item.id)) {
      setShowcaseItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      if (showcaseItems.length >= MAX_SHOWCASE) return;
      setShowcaseItems(prev => [...prev, item]);
    }
  };

  const saveShowcase = async () => {
    setSavingShowcase(true);
    const ids = showcaseItems.map(i => i.id);
    await supabase.from('profiles').update({ showcase_items: ids }).eq('id', userId);
    setProfile(prev => ({ ...prev, showcase_items: ids }));
    setShowPicker(false);
    setSavingShowcase(false);
  };

  const removeFromShowcase = async (itemId) => {
    const newItems = showcaseItems.filter(i => i.id !== itemId);
    setShowcaseItems(newItems);
    const ids = newItems.map(i => i.id);
    await supabase.from('profiles').update({ showcase_items: ids }).eq('id', userId);
    setProfile(prev => ({ ...prev, showcase_items: ids }));
  };

  const handleSaveProfile = async () => {
    try {
      setProfile(prev => ({ ...prev, ...editForm }));
      setIsEditing(false);
      await supabase.from('profiles').update({ username: editForm.username, bio: editForm.bio }).eq('id', userId);
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX = 400;
        let { width, height } = img;
        if (width > height) { if (width > MAX) { height *= MAX / width; width = MAX; } }
        else { if (height > MAX) { width *= MAX / height; height = MAX; } }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setAvatar(dataUrl);
        localStorage.setItem(`avatar_${userId}`, dataUrl);
        await supabase.from('profiles').update({ avatar_url: dataUrl }).eq('id', userId);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const winRate = profile.wins + profile.losses > 0
    ? Math.round((profile.wins / (profile.wins + profile.losses)) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full p-8 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--color-accent, #00ff88)' }}></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen text-white pb-20">
      {/* Banner */}
      <div className="h-48 w-full relative overflow-hidden rounded-b-3xl shadow-lg"
           style={{ background: 'linear-gradient(135deg, rgba(30,30,30,1) 0%, var(--color-accent, #00ff88) 100%)', opacity: 0.8 }}>
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>
      </div>

      <div className="px-6 max-w-6xl mx-auto w-full -mt-20 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/50 shadow-2xl">
          
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 bg-zinc-800 shadow-xl" style={{ borderColor: 'var(--color-accent, #00ff88)' }}>
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold" style={{ color: 'var(--color-accent, #00ff88)' }}>
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {isOwnProfile && (
              <button onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-zinc-800 rounded-full border border-zinc-700 hover:bg-zinc-700 transition-colors shadow-lg cursor-pointer">
                <Camera size={18} style={{ color: 'var(--color-accent, #00ff88)' }} />
              </button>
            )}
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
            
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                 style={{ backgroundColor: 'var(--color-accent, #00ff88)', color: '#000' }}>
              Lvl {profile.level}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 w-full">
            {isEditing ? (
              <div className="space-y-3">
                <input type="text" value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 w-full text-white focus:outline-none"
                  placeholder="Nome de Usuário" />
                <textarea value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 w-full text-white text-sm focus:outline-none resize-none h-20"
                  placeholder="Sua biografia" />
                <div className="flex gap-2">
                  <button onClick={handleSaveProfile} className="flex items-center gap-1 px-4 py-2 rounded-lg text-black font-medium transition-all" style={{ backgroundColor: 'var(--color-accent, #00ff88)' }}>
                    <Check size={16} /> Salvar
                  </button>
                  <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white font-medium transition-all">
                    <X size={16} /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">{profile.username}</h1>
                    <div className="mt-2 flex items-center gap-2">
                      <button 
                        onClick={handleCopyTag}
                        title="Copiar Tag de Amigo"
                        className="text-[10px] flex items-center gap-1 font-mono font-bold tracking-widest text-zinc-500 hover:text-white bg-white/5 border border-white/10 hover:border-white/30 px-2 py-1 rounded-md uppercase transition-colors"
                      >
                        ID: {userId.substring(0, 8)} 
                        {copiedTag ? <Check size={12} className="text-[var(--color-accent)]" /> : <Link size={12} />}
                      </button>
                    </div>
                    <p className="text-zinc-400 mt-2 max-w-md line-clamp-2">{profile.bio}</p>
                  </div>
                  {isOwnProfile && (
                    <button onClick={() => setIsEditing(true)}
                      className="p-2 text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700 rounded-full transition-colors">
                      <Edit2 size={18} />
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>Membro desde {new Date(profile.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--color-accent, #00ff88)' }}>
                    <Zap size={14} />
                    <span>{profile.total_spent.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Dopas gastos</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          <StatCard icon={<Trophy />} label="Vitórias"  value={profile.wins}          color="text-green-400" />
          <StatCard icon={<Target />} label="Derrotas"  value={profile.losses}         color="text-red-400" />
          <StatCard icon={<Zap />}    label="Win Rate"  value={`${winRate}%`}          color="text-yellow-400" />
          <StatCard icon={<Package />} label="Caixas" value={profile.cases_opened || 0} color="text-purple-400" />
          <StatCard icon={<TrendingUp />} label="Streak" value={`${profile.streak}🔥`} color="text-orange-400" />
        </div>

        {/* Tabs */}
        <div className="mt-10">
          <div className="flex space-x-1 border-b border-zinc-800 overflow-x-auto no-scrollbar">
            <TabButton active={activeTab === 'showcase'} onClick={() => setActiveTab('showcase')} icon={<Star size={18} />}   label="Vitrine" />
            <TabButton active={activeTab === 'battles'}  onClick={() => setActiveTab('battles')}  icon={<Swords size={18} />} label="Batalhas" />

            {isOwnProfile && <TabButton active={activeTab === 'referrals'} onClick={() => setActiveTab('referrals')} icon={<Gift size={18} />} label="Convites" />}
          </div>

          <div className="py-6">

            {/* ─── CONVITES (REFERRALS) ─── */}
            {activeTab === 'referrals' && isOwnProfile && (
              <div className="max-w-2xl mx-auto space-y-6">
                
                {/* Banner de Resgate */}
                {hasPendingReferral && (
                  <div className="bg-gradient-to-r from-accent/20 to-transparent border border-accent/30 rounded-3xl p-6 flex flex-col items-center text-center">
                    <Gift className="w-12 h-12 text-accent mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Você foi convidado!</h2>
                    <p className="text-zinc-300 text-sm mb-6 max-w-md">
                      Para resgatar seus 500 Dopas bônus, você precisa confirmar seu endereço de e-mail no painel. Depois disso, clique no botão abaixo.
                    </p>
                    <button 
                      onClick={handleClaimReward}
                      disabled={claimingReward}
                      className="px-6 py-3 bg-accent text-black font-bold rounded-xl hover:bg-white transition-colors disabled:opacity-50"
                    >
                      {claimingReward ? 'Verificando...' : 'Resgatar 500 Dopas'}
                    </button>
                    {referralMessage && (
                      <p className={`mt-4 text-sm font-bold ${referralMessage === 'SUCESSO' ? 'text-accent' : 'text-red-400'}`}>
                        {referralMessage === 'SUCESSO' ? '+500 Dopas Adicionados!' : referralMessage}
                      </p>
                    )}
                  </div>
                )}

                {/* Área do Divulgador */}
                <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                      <Link size={24} className="text-zinc-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Convide & Ganhe</h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        Compartilhe seu link exclusivo. Quando um amigo se cadastrar e confirmar o e-mail, ambos ganham 500 Dopas.
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Seu Link de Convite</p>
                      <p className="text-sm text-zinc-300 font-mono truncate">{`${window.location.origin}/?ref=${profile.username}-${userId.substring(0, 8)}`}</p>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/?ref=${profile.username}-${userId.substring(0, 8)}`);
                        alert('Link copiado!');
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors"
                    >
                      Copiar
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-400">Usos Completados esta Semana</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-black text-white">{referralCount}</span>
                        <span className="text-zinc-500 font-bold">/ 3</span>
                      </div>
                    </div>
                    {referralCount >= 3 && (
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-full border border-orange-500/20">
                        Limite Atingido
                      </span>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* ─── VITRINE ─── */}
            {activeTab === 'showcase' && (
              <div>
                {/* Header da Vitrine */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-yellow-400" />
                    <span className="text-sm font-bold text-zinc-300 uppercase tracking-widest">
                      Vitrine de Destaque
                    </span>
                    <span className="text-xs text-zinc-600 font-medium">
                      {showcaseItems.length}/{MAX_SHOWCASE}
                    </span>
                  </div>
                  {isOwnProfile && (
                    <button
                      onClick={openPicker}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300"
                    >
                      <Plus size={14} /> Editar Vitrine
                    </button>
                  )}
                </div>

                {showcaseItems.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {showcaseItems.map((item, idx) => {
                      const rarityHex = item.rarity_color?.startsWith('#') ? item.rarity_color : '#4b69ff';
                      return (
                        <div
                          key={item.id}
                          className="relative group rounded-3xl border overflow-hidden bg-zinc-900/60 backdrop-blur-sm shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
                          style={{ borderColor: rarityHex + '55' }}
                        >
                          {/* Glow de fundo */}
                          <div className="absolute inset-0 opacity-10 pointer-events-none"
                               style={{ background: `radial-gradient(circle at 50% 40%, ${rarityHex}, transparent 70%)` }} />

                          {/* Linha de raridade no topo */}
                          <div className="absolute top-0 left-0 w-full h-[2px]" style={{ backgroundColor: rarityHex }} />

                          {/* Badge de posição */}
                          <div className="absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg border border-white/10"
                               style={{ backgroundColor: rarityHex + '33', color: rarityHex }}>
                            #{idx + 1}
                          </div>

                          {/* Botão remover (só dono) */}
                          {isOwnProfile && (
                            <button
                              onClick={() => removeFromShowcase(item.id)}
                              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80 z-10"
                            >
                              <X size={13} className="text-white" />
                            </button>
                          )}

                          {/* Imagem do item */}
                          <div className="flex items-center justify-center pt-8 pb-4 px-6 min-h-[160px]">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.item_name}
                                className="w-full max-w-[130px] object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-6xl group-hover:scale-110 transition-transform duration-500">
                                {item.icon || '📦'}
                              </span>
                            )}
                          </div>

                          {/* Nome e Preço */}
                          <div className="px-4 pb-4 text-center">
                            <p className="text-[11px] font-black uppercase tracking-wider text-zinc-200 line-clamp-1 leading-tight">
                              {item.item_name?.split('|')[1]?.trim() || item.item_name}
                            </p>
                            <p className="text-[9px] text-zinc-500 mt-0.5 line-clamp-1">
                              {item.item_name?.split('|')[0]?.trim()}
                            </p>
                            <div className="mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-black border"
                                 style={{ backgroundColor: rarityHex + '18', borderColor: rarityHex + '44', color: rarityHex }}>
                              D$ {Number(item.price || 0).toFixed(2)}
                            </div>
                          </div>

                          {/* Linha de raridade na base */}
                          <div className="absolute bottom-0 left-0 w-full h-[2px]" style={{ backgroundColor: rarityHex }} />
                        </div>
                      );
                    })}

                    {/* Slot vazio para o dono adicionar */}
                    {isOwnProfile && showcaseItems.length < MAX_SHOWCASE && (
                      <button
                        onClick={openPicker}
                        className="relative rounded-3xl border-2 border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900/30 hover:bg-zinc-800/30 transition-all duration-300 flex flex-col items-center justify-center min-h-[240px] gap-3 group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 group-hover:bg-zinc-700 transition-colors flex items-center justify-center">
                          <Plus size={22} className="text-zinc-500 group-hover:text-zinc-300" />
                        </div>
                        <span className="text-xs font-bold text-zinc-600 group-hover:text-zinc-400 uppercase tracking-wider">
                          Adicionar Item
                        </span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    {isOwnProfile ? (
                      <button
                        onClick={openPicker}
                        className="w-full rounded-3xl border-2 border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900/30 hover:bg-zinc-800/30 transition-all duration-300 flex flex-col items-center justify-center py-16 gap-4 group"
                      >
                        <div className="w-16 h-16 rounded-3xl bg-zinc-800 group-hover:bg-zinc-700 transition-colors flex items-center justify-center">
                          <Sparkles size={28} className="text-zinc-500 group-hover:text-yellow-400 transition-colors" />
                        </div>
                        <div className="text-center">
                          <p className="text-base font-black text-zinc-400 group-hover:text-zinc-200 transition-colors">Montar Vitrine</p>
                          <p className="text-xs text-zinc-600 mt-1">Escolha até {MAX_SHOWCASE} itens do seu inventário para exibir aqui</p>
                        </div>
                      </button>
                    ) : (
                      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center backdrop-blur-sm">
                        <Sparkles size={48} className="mx-auto text-zinc-600 mb-4" />
                        <h3 className="text-xl font-bold text-zinc-300 mb-2">Vitrine Vazia</h3>
                        <p className="text-zinc-500">Este jogador ainda não adicionou itens em destaque.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'battles' && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center backdrop-blur-sm">
                <Swords size={48} className="mx-auto text-zinc-600 mb-4" />
                <h3 className="text-xl font-bold text-zinc-300 mb-2">Sem Histórico</h3>
                <p className="text-zinc-500">Jogue algumas partidas para ver seu histórico de batalhas aqui.</p>
              </div>
            )}
            

          </div>
        </div>
      </div>

      {/* ─── MODAL SELETOR DE ITENS ─── */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header do modal */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <div>
                <h2 className="text-lg font-black text-white">Escolher Itens para Vitrine</h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {showcaseItems.length}/{MAX_SHOWCASE} selecionados — clique para adicionar ou remover
                </p>
              </div>
              <button onClick={() => setShowPicker(false)}
                className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Lista de itens do inventário */}
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {inventoryItems.length === 0 ? (
                <div className="text-center py-10 text-zinc-500">
                  <p className="text-sm">Seu inventário está vazio.</p>
                  <p className="text-xs mt-1">Abra caixas para conseguir itens!</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {inventoryItems.map(item => {
                    const rarityHex = item.rarity_color?.startsWith('#') ? item.rarity_color : '#4b69ff';
                    const isSelected = showcaseItems.some(s => s.id === item.id);
                    const isFull = showcaseItems.length >= MAX_SHOWCASE && !isSelected;
                    return (
                      <button
                        key={item.id}
                        onClick={() => !isFull && toggleShowcaseItem(item)}
                        disabled={isFull}
                        className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-200 flex flex-col items-center justify-center aspect-square p-2
                          ${isSelected ? 'scale-95 opacity-100' : isFull ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100 hover:scale-105'}
                        `}
                        style={{ borderColor: isSelected ? rarityHex : rarityHex + '44', backgroundColor: isSelected ? rarityHex + '22' : 'transparent' }}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black z-10"
                               style={{ backgroundColor: rarityHex, color: '#000' }}>
                            ✓
                          </div>
                        )}
                        {item.image ? (
                          <img src={item.image} alt={item.item_name} className="w-4/5 h-4/5 object-contain" loading="lazy" />
                        ) : (
                          <span className="text-3xl">{item.icon || '📦'}</span>
                        )}
                        <p className="text-[8px] font-bold text-zinc-400 text-center leading-tight mt-1 truncate w-full">
                          {item.item_name?.split('|')[1]?.trim() || item.item_name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer do modal */}
            <div className="p-5 border-t border-zinc-800 flex items-center justify-between gap-3">
              <p className="text-xs text-zinc-500">{MAX_SHOWCASE - showcaseItems.length} slots restantes</p>
              <div className="flex gap-3">
                <button onClick={() => setShowPicker(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors">
                  Cancelar
                </button>
                <button onClick={saveShowcase} disabled={savingShowcase}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-black transition-all disabled:opacity-60"
                  style={{ backgroundColor: 'var(--color-accent, #00ff88)' }}>
                  {savingShowcase ? 'Salvando...' : 'Salvar Vitrine'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-4 hover:bg-zinc-800/80 transition-all shadow-lg group">
    <div className={`p-3 rounded-xl bg-zinc-800/50 ${color} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <p className="text-zinc-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${
      active ? 'text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
    }`}
  >
    {icon}
    {label}
    {active && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--color-accent, #00ff88)' }} />
    )}
  </button>
);

export default ProfilePage;
