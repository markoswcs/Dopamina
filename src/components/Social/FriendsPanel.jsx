import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Search, UserPlus, UserCheck, X, Swords, MessageSquare, Send, UserMinus, Clock } from 'lucide-react';

export default function FriendsPanel({ onToast, onNavigate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('friends'); // 'friends', 'requests', 'messages'
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // Messages State
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatScrollRef = useRef(null);

  const fetchFriendsData = async () => {
    if (!user) return;
    
    // Fetch all friend relationships involving this user
    const { data: allRelationships } = await supabase
      .from('friends')
      .select('*')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);
      
    if (!allRelationships) {
      setLoading(false);
      return;
    }

    const acceptedRelations = allRelationships.filter(r => r.status === 'accepted');
    const receivedRelations = allRelationships.filter(r => r.status === 'pending' && r.friend_id === user.id);
    const sentRelations = allRelationships.filter(r => r.status === 'pending' && r.user_id === user.id);

    // Extract all unique profile IDs we need to fetch
    const profileIdsToFetch = new Set();
    
    acceptedRelations.forEach(r => {
      profileIdsToFetch.add(r.user_id === user.id ? r.friend_id : r.user_id);
    });
    receivedRelations.forEach(r => profileIdsToFetch.add(r.user_id));
    sentRelations.forEach(r => profileIdsToFetch.add(r.friend_id));

    let profilesMap = {};
    if (profileIdsToFetch.size > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, level, avatar_url')
        .in('id', Array.from(profileIdsToFetch));
        
      if (profiles) {
        profiles.forEach(p => { profilesMap[p.id] = p; });
      }
    }

    // Assembly
    const uniqueFriendsMap = new Map();
    acceptedRelations.forEach(r => {
      const pId = r.user_id === user.id ? r.friend_id : r.user_id;
      uniqueFriendsMap.set(pId, { id: pId, ...profilesMap[pId] });
    });
    const uniqueFriends = Array.from(uniqueFriendsMap.values());
    
    const receivedRequests = receivedRelations.map(r => ({
      id: r.id, 
      user_id: r.user_id,
      profiles: profilesMap[r.user_id]
    })).filter(r => r.profiles); 
    
    const sentRequests = sentRelations.map(r => ({
      id: r.id, 
      friend_id: r.friend_id,
      profiles: profilesMap[r.friend_id]
    })).filter(r => r.profiles);
    
    setFriends(uniqueFriends);
    setRequests({ received: receivedRequests, sent: sentRequests });

    // Check direct_messages table existence
    const { error: dmError } = await supabase.from('direct_messages').select('id').limit(1);
    if (dmError && dmError.code === '42P01') {
      setMessagesEnabled(false);
    } else {
      setMessagesEnabled(true);
    }

    // Check unread messages
    const { data: unreadData } = await supabase
      .from('direct_messages')
      .select('id')
      .eq('receiver_id', user.id)
      .eq('read', false);
    setUnreadMessagesCount(unreadData ? unreadData.length : 0);

    setLoading(false);
  };

  // Process open_chat request from NotificationBell
  useEffect(() => {
    const chatTarget = window.localStorage.getItem('dopashop_open_chat');
    if (chatTarget && friends.length > 0) {
      const f = friends.find(fr => fr.id === chatTarget);
      if (f) {
        setSelectedFriend(f);
        setActiveTab('messages');
        window.localStorage.removeItem('dopashop_open_chat');
      }
    }
  }, [friends, activeTab]);

  useEffect(() => {
    fetchFriendsData();

    if (user) {
      const sub = supabase
        .channel('friends_updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'friends' }, () => {
          fetchFriendsData();
        })
        .subscribe();
      return () => sub.unsubscribe();
    }
  }, [user]);

  // Messages Effect
  useEffect(() => {
    let sub = null;
    if (activeTab === 'messages' && selectedFriend && messagesEnabled) {
      fetchMessages();
      sub = supabase
        .channel('messages_updates')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'direct_messages'
        }, (payload) => {
          const msg = payload.new;
          if (
            (msg.sender_id === user.id && msg.receiver_id === selectedFriend.id) ||
            (msg.sender_id === selectedFriend.id && msg.receiver_id === user.id)
          ) {
            setChatMessages(prev => {
              if (prev.find(m => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
            setTimeout(scrollToBottom, 100);
          }
        })
        .subscribe();
    }
    return () => {
      if (sub) supabase.removeChannel(sub);
    };
  }, [activeTab, selectedFriend, messagesEnabled]);

  const fetchMessages = async () => {
    if (!selectedFriend) return;
    
    // Mark messages from this friend as read
    await supabase.from('direct_messages')
      .update({ read: true })
      .eq('sender_id', selectedFriend.id)
      .eq('receiver_id', user.id)
      .eq('read', false);
      
    // Refresh unread count
    const { data: unreadData } = await supabase
      .from('direct_messages')
      .select('id')
      .eq('receiver_id', user.id)
      .eq('read', false);
    setUnreadMessagesCount(unreadData ? unreadData.length : 0);

    // Messages expire after 24 hours
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const { data } = await supabase
      .from('direct_messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedFriend.id}),and(sender_id.eq.${selectedFriend.id},receiver_id.eq.${user.id})`)
      .gte('created_at', twentyFourHoursAgo.toISOString())
      .order('created_at', { ascending: true });
    
    setChatMessages(data || []);
    setTimeout(scrollToBottom, 100);
  };

  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend) return;

    const msgText = newMessage.trim();
    setNewMessage('');

    // Atualização otimista da UI (aparece na hora)
    const tempId = 'temp-' + Date.now();
    const tempMsg = {
      id: tempId,
      sender_id: user.id,
      receiver_id: selectedFriend.id,
      message: msgText,
      created_at: new Date().toISOString(),
      read: false
    };

    setChatMessages(prev => [...prev, tempMsg]);
    setTimeout(scrollToBottom, 50);

    const { data, error } = await supabase.from('direct_messages').insert({
      sender_id: user.id,
      receiver_id: selectedFriend.id,
      message: msgText,
      read: false
    }).select().single();

    if (error && onToast) {
      onToast('Erro ao enviar mensagem.');
      setChatMessages(prev => prev.filter(m => m.id !== tempId));
    } else if (data) {
      setChatMessages(prev => prev.map(m => m.id === tempId ? data : m));
      
      // Envia notificação para o destinatário
      await supabase.from('notifications').insert({
        user_id: selectedFriend.id,
        type: 'new_message',
        message: `${user.user_metadata?.username || 'Um amigo'} enviou uma nova mensagem!`,
        action_data: { sender_id: user.id }
      });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    if (!searchTerm.includes('#')) {
      if (onToast) onToast('Formato inválido. Use NomeDeUsuário#ID');
      return;
    }

    const [username, shortId] = searchTerm.split('#');
    if (!shortId || shortId.length < 4) {
      if (onToast) onToast('ID inválido. Insira os caracteres após o #.');
      return;
    }

    const { data: candidates } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('username', username);

    if (!candidates || candidates.length === 0) {
      if (onToast) onToast('Usuário não encontrado!');
      return;
    }

    const foundUser = candidates.find(c => c.id.toLowerCase().startsWith(shortId.toLowerCase()));

    if (!foundUser) {
      if (onToast) onToast('Usuário não encontrado!');
      return;
    }

    if (foundUser.id === user.id) {
      if (onToast) onToast('Você não pode adicionar a si mesmo.');
      return;
    }

    if (friends.some(f => f.id === foundUser.id)) {
      if (onToast) onToast('Vocês já são amigos!');
      return;
    }

    if (requests.sent.some(r => r.friend_id === foundUser.id) || requests.received.some(r => r.user_id === foundUser.id)) {
      if (onToast) onToast('Já existe um pedido pendente entre vocês!');
      return;
    }

    const { error } = await supabase.from('friends').insert({
      user_id: user.id,
      friend_id: foundUser.id,
      status: 'pending'
    });

    if (error) {
      if (onToast) onToast('Erro ou pedido já enviado.');
    } else {
      // Notifica o alvo
      await supabase.from('notifications').insert({
        user_id: foundUser.id,
        type: 'friend_request',
        message: `${user.user_metadata?.username || 'Um jogador'} te enviou um pedido de amizade!`,
        action_data: { target_user_id: user.id }
      });
      if (onToast) onToast(`Pedido enviado para ${foundUser.username}`);
      setSearchTerm('');
      fetchFriendsData();
    }
  };

  const handleRespondRequest = async (id, action) => {
    if (action === 'accept') {
      await supabase.from('friends').update({ status: 'accepted' }).eq('id', id);
      if (onToast) onToast('Pedido aceito!');
    } else {
      await supabase.from('friends').delete().eq('id', id);
      if (onToast) onToast('Pedido recusado.');
    }
    fetchFriendsData();
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm('Tem certeza que deseja remover este amigo?')) return;
    
    await supabase.from('friends')
      .delete()
      .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`);
    
    if (onToast) onToast('Amigo removido.');
    fetchFriendsData();
    if (selectedFriend?.id === friendId) {
        setSelectedFriend(null);
    }
  };

  const handleCancelRequest = async (id) => {
    await supabase.from('friends').delete().eq('id', id);
    if (onToast) onToast('Pedido cancelado.');
    fetchFriendsData();
  };

  const getRankColor = (level = 1) => {
    if (level >= 100) return 'text-yellow-400';
    if (level >= 50) return 'text-accent'; 
    if (level >= 10) return 'text-blue-400';
    return 'text-zinc-400';
  };

  const getRankName = (level = 1) => {
    if (level >= 100) return 'Lendário';
    if (level >= 50) return 'Épico';
    if (level >= 10) return 'Veterano';
    return 'Iniciante';
  };

  const renderFriendsTab = () => (
    <div className="p-8 h-full overflow-y-auto no-scrollbar">
      {friends.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center py-20">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <UserMinus className="w-10 h-10 text-zinc-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhum amigo ainda</h3>
          <p className="text-zinc-400 text-sm max-w-sm">
            Vá até a aba de Solicitações para buscar e adicionar novos amigos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {friends.map(friend => (
            <div key={friend.id} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 transition-all group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-black border-2 border-white/10 group-hover:border-accent transition-colors text-white overflow-hidden">
                    {friend.avatar_url ? (
                      <img src={friend.avatar_url} alt={friend.username} className="w-full h-full object-cover" />
                    ) : (
                      friend.username?.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0F172A] bg-emerald-500"></div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold text-white truncate" title={friend.username}>{friend.username}</div>
                    <span className="text-[10px] font-mono text-zinc-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded uppercase">
                      ID: {friend.id?.substring(0, 8)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mt-1">
                    <span className={getRankColor(friend.level)}>{getRankName(friend.level)}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-accent">LVL {friend.level || 1}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    if (onNavigate) onNavigate('profile', friend.id);
                  }}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-white/10"
                >
                  <Search className="w-4 h-4 text-zinc-400" />
                  Perfil
                </button>
                <button
                  onClick={() => {
                    setSelectedFriend(friend);
                    setActiveTab('messages');
                  }}
                  className="flex-1 py-2 bg-accent/10 hover:bg-accent text-accent hover:text-black rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Mensagem
                </button>
                <button
                  onClick={() => handleRemoveFriend(friend.id)}
                  className="py-2 px-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center transition-colors"
                  title="Remover Amigo"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRequestsTab = () => (
    <div className="p-8 h-full overflow-y-auto no-scrollbar flex flex-col gap-8">
      {/* Search Bar */}
      <div className="max-w-md w-full">
        <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">
          Adicionar Amigo
        </h3>
        <form onSubmit={handleSearch} className="relative group">
          <input 
            type="text"
            placeholder="Buscar amigo por NomeDeUsuário#ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 pr-14 focus:outline-none focus:border-accent/50 transition-all text-sm font-medium text-white group-hover:border-white/20"
          />
          <button type="submit" className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center bg-accent text-white rounded-xl hover:scale-105 transition-transform shadow-lg shadow-accent/20">
            <UserPlus className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Received Requests */}
        <div>
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            Pedidos Recebidos ({requests.received.length})
          </h3>
          {requests.received.length === 0 ? (
             <p className="text-sm text-zinc-500 font-medium">Nenhum pedido recebido.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {requests.received.map(req => (
                <div key={req.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent/50 to-accent p-[2px]">
                      <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center text-sm font-black text-white">
                        {req.profiles.username?.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className="text-base font-bold text-white">{req.profiles.username}</div>
                      <div className="text-xs text-zinc-500 font-medium mt-0.5">{getRankName(req.profiles.aura)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRespondRequest(req.id, 'accept')} className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors">
                      <UserCheck className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleRespondRequest(req.id, 'reject')} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sent Requests */}
        <div>
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">
            Pedidos Enviados ({requests.sent.length})
          </h3>
          {requests.sent.length === 0 ? (
             <p className="text-sm text-zinc-500 font-medium">Nenhum pedido enviado.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {requests.sent.map(req => (
                <div key={req.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between opacity-70">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-black text-white border border-white/10">
                      {req.profiles.username?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-base font-bold text-white">{req.profiles.username}</div>
                      <div className="text-xs text-zinc-500 font-medium mt-0.5">Pendente...</div>
                    </div>
                  </div>
                  <button onClick={() => handleCancelRequest(req.id)} className="w-10 h-10 rounded-xl bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500 hover:text-white flex items-center justify-center transition-colors" title="Cancelar">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMessagesTab = () => {
    if (!messagesEnabled) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-6 text-accent">
            <Clock className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Recurso em Breve</h3>
          <p className="text-zinc-400 max-w-md">
            O chat direto com amigos estará disponível em uma atualização futura. Continue batalhando!
          </p>
        </div>
      );
    }

    return (
      <div className="h-full flex">
        {/* Left Col: Friends List */}
        <div className="w-1/3 border-r border-[var(--t-border)] flex flex-col">
          <div className="p-4 border-b border-[var(--t-border)]">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">
              Conversas
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-2">
            {friends.length === 0 ? (
              <div className="p-4 text-center text-sm text-zinc-500 mt-4">
                Você não tem amigos ainda.
              </div>
            ) : (
              friends.map(friend => (
                <button
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${
                    selectedFriend?.id === friend.id 
                      ? 'bg-accent/20 border border-accent/30' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-white border border-white/10 overflow-hidden">
                      {friend.avatar_url ? (
                        <img src={friend.avatar_url} alt={friend.username} className="w-full h-full object-cover" />
                      ) : (
                        friend.username?.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0F172A] bg-emerald-500"></div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-bold text-white truncate">{friend.username}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Chat Area */}
        <div className="w-2/3 flex flex-col bg-black/20">
          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[var(--t-border)] flex items-center gap-3 bg-[var(--t-surface)]/20">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-white border border-white/10 overflow-hidden">
                  {selectedFriend.avatar_url ? (
                    <img src={selectedFriend.avatar_url} alt={selectedFriend.username} className="w-full h-full object-cover" />
                  ) : (
                    selectedFriend.username?.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{selectedFriend.username}</div>
                  <div className="text-xs text-emerald-400">Online</div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar" ref={chatScrollRef}>
                {chatMessages.length === 0 ? (
                  <div className="m-auto text-center py-20">
                    <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <p className="text-sm text-zinc-500 font-medium">Inicie uma conversa com {selectedFriend.username}</p>
                  </div>
                ) : (
                  chatMessages.map(msg => {
                    const isMine = msg.sender_id === user.id;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                            isMine 
                              ? 'bg-accent text-white rounded-br-sm' 
                              : 'bg-zinc-800 text-white rounded-bl-sm border border-white/5'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <div className={`text-[10px] mt-1 ${isMine ? 'text-white/70' : 'text-zinc-400'} text-right font-medium`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-[var(--t-border)] bg-[var(--t-surface)]/20">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite uma mensagem..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-accent/50 transition-all text-sm text-white"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="w-12 h-12 flex items-center justify-center bg-accent text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-accent/20"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
              <MessageSquare className="w-16 h-16 text-zinc-500 mb-4" />
              <p className="text-zinc-400 font-medium text-lg">Selecione um amigo para conversar</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col p-4 md:p-8 h-full min-h-[600px] theme-text">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-3xl font-display font-black text-white flex items-center gap-3 tracking-wide">
          AMIGOS
        </h2>
      </div>

      {/* Main Container */}
      <div className="flex-1 bg-[var(--t-surface)]/60 backdrop-blur-3xl border border-[var(--t-border)] rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Tabs Navigation */}
        <div className="flex items-center gap-8 px-8 pt-6 border-b border-[var(--t-border)]">
          {[
            { id: 'friends', label: 'Meus Amigos', icon: UserCheck },
            { id: 'requests', label: 'Solicitações', icon: UserPlus },
            { id: 'messages', label: 'Mensagens', icon: MessageSquare, badge: unreadMessagesCount }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 flex items-center gap-2 font-bold text-sm transition-all relative ${
                activeTab === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1 font-black">
                  {tab.badge}
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t-full shadow-[0_0_10px_var(--color-accent)]"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {activeTab === 'friends' && renderFriendsTab()}
              {activeTab === 'requests' && renderRequestsTab()}
              {activeTab === 'messages' && renderMessagesTab()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
