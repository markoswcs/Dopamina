import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellOff, Check, Trash2, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

// Função para formatar o tempo relativo em PT-BR
const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Agora mesmo';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `Há ${diffInMinutes}m`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Há ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Há ${diffInDays}d`;
  
  return date.toLocaleDateString('pt-BR');
};

const NotificationBell = ({ token, onNavigate, onToast }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    // Recupera o estado de mute salvo no localStorage
    return localStorage.getItem('dopamina_notifications_muted') === 'true';
  });
  const [clearing, setClearing] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Salva o estado de mute sempre que for alterado
    localStorage.setItem('dopamina_notifications_muted', isMuted);
  }, [isMuted]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (data) setNotifications(data);
    };

    fetchNotifications();

    if (!user) return;
    const subscription = supabase
      .channel('public:notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const newNotif = payload.new;
        setNotifications(prev => [newNotif, ...prev]);
        
        if (!isMuted) {
          try {
            const audio = new Audio('/sounds/notification.mp3');
            audio.play().catch(e => console.log('Audio autoplay bloqueado', e));
          } catch(e) {}
        }
        
        if (newNotif.type === 'new_message' && onToast) {
          onToast(newNotif.message);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, isMuted]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    setClearing(true);
    await supabase.from('notifications').delete().eq('user_id', user.id);
    setTimeout(() => {
      setNotifications([]);
      setClearing(false);
      setIsOpen(false);
    }, 500);
  };

  const handleReferralAction = async (notifId, targetUserId, action) => {
    if (action === 'accept') {
      const { data } = await supabase.from('friends')
        .update({ status: 'accepted' })
        .match({ user_id: targetUserId, friend_id: user.id })
        .select();
        
      if (!data || data.length === 0) {
        await supabase.from('friends').insert({
          user_id: user.id,
          friend_id: targetUserId,
          status: 'accepted'
        });
      }
      
      window.dispatchEvent(new Event('friendAdded'));
    } else {
      await supabase.from('friends')
        .delete()
        .match({ user_id: targetUserId, friend_id: user.id });
    }
    // Delete the notification so they don't click it again
    await supabase.from('notifications').delete().eq('id', notifId);
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  const getIconForType = (type) => {
    switch(type) {
      case 'friend_request': return <span style={{fontSize: '20px'}}>👥</span>;
      case 'battle_invite': return <span style={{fontSize: '20px'}}>⚔️</span>;
      case 'item_won': return <span style={{fontSize: '20px'}}>🏆</span>;
      case 'new_message': return <span style={{fontSize: '20px'}}>💬</span>;
      case 'system':
      default: return <span style={{fontSize: '20px'}}>🎁</span>;
    }
  };

  const handleNotificationClick = (notif) => {
    handleMarkAsRead(notif.id);
    if (notif.type === 'new_message' && notif.action_data?.sender_id) {
      window.localStorage.setItem('dopashop_open_chat', notif.action_data.sender_id);
      if (onNavigate) {
        onNavigate('friends');
      }
      setIsOpen(false);
    }
  };

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <style dangerouslySetInnerHTML={{__html: `
        .notification-wrapper {
          position: relative;
          font-family: 'Inter', sans-serif;
        }
        .bell-btn {
          background: transparent;
          border: none;
          color: var(--text-color, #fff);
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .bell-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .badge {
          position: absolute;
          top: 0;
          right: 0;
          background-color: var(--color-accent, #ff4757);
          color: white;
          border-radius: 50%;
          font-size: 10px;
          font-weight: bold;
          min-width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-color, #1a1a1a);
          box-shadow: 0 0 8px rgba(0,0,0,0.3);
        }
        .dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: -10px;
          width: 340px;
          background: var(--bg-surface, #242424);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.2);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px) scale(0.95);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 1000;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .dropdown.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }
        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(0,0,0,0.2);
        }
        .dropdown-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-color, #fff);
          letter-spacing: 0.3px;
        }
        .header-actions {
          display: flex;
          gap: 12px;
        }
        .action-btn {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: 50%;
          transition: all 0.2s;
        }
        .action-btn:hover {
          color: var(--color-accent, #ff4757);
          background: rgba(255,255,255,0.05);
        }
        .action-btn.muted {
          color: var(--color-accent, #ff4757);
        }
        .clear-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          color: #aaa;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .clear-btn:hover {
          color: var(--color-accent, #ff4757);
        }
        .clear-btn.clearing {
          animation: pulseFade 0.6s ease;
          pointer-events: none;
        }
        .notifications-list {
          max-height: 400px;
          overflow-y: auto;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .notifications-list::-webkit-scrollbar {
          width: 6px;
        }
        .notifications-list::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .notification-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          position: relative;
        }
        .notification-item:hover {
          background: rgba(255,255,255,0.03);
          transform: translateX(2px);
        }
        .notification-item.unread {
          background: rgba(255,255,255,0.05);
        }
        .notif-icon-wrapper {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.02);
        }
        .notif-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          justify-content: center;
        }
        .notif-title {
          font-size: 14px;
          color: var(--text-color, #e0e0e0);
          margin: 0;
          font-weight: 500;
          line-height: 1.4;
        }
        .notif-time {
          font-size: 11px;
          color: #888;
          font-weight: 400;
        }
        .item-image {
          width: 100%;
          max-width: 200px;
          border-radius: 8px;
          margin-top: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .unread-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-accent, #ff4757);
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          box-shadow: 0 0 8px var(--color-accent, #ff4757);
        }
        .empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #777;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        @keyframes pulseFade {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.95); opacity: 0.5; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}} />
      
      <button 
        className="bell-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificações"
      >
        {isMuted ? <BellOff size={24} /> : <Bell size={24} />}
        {unreadCount > 0 && (
          <span className="badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      <div className={`dropdown ${isOpen ? 'open' : ''}`}>
        <div className="dropdown-header">
          <h3>Notificações</h3>
          <div className="header-actions">
            <button 
              className={`action-btn ${isMuted ? 'muted' : ''}`}
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "Ativar som das notificações" : "Silenciar notificações"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            {notifications.length > 0 && (
              <button 
                className={`clear-btn ${clearing ? 'clearing' : ''}`}
                onClick={handleClearAll}
                title="Limpar todas as notificações"
              >
                <Trash2 size={14} />
                Limpar tudo
              </button>
            )}
          </div>
        </div>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <BellOff size={40} opacity={0.2} />
              <p>Nenhuma notificação por enquanto.</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`notification-item ${!notif.read ? 'unread' : ''} ${clearing ? 'clearing' : ''}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="notif-icon-wrapper">
                  {getIconForType(notif.type)}
                </div>
                <div className="notif-content">
                  <p className="notif-title">{notif.message}</p>
                  <span className="notif-time">{getRelativeTime(notif.created_at)}</span>
                  {notif.type === 'item_won' && notif.image_url && (
                    <img src={notif.image_url} alt="Item recebido" className="item-image" />
                  )}
                  {(notif.type === 'referral_friend' || notif.type === 'friend_request') && notif.action_data?.target_user_id && (
                    <div className="mt-3 flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleReferralAction(notif.id, notif.action_data.target_user_id, 'accept'); }}
                        className="px-3 py-1.5 bg-[var(--color-accent)] text-black text-xs font-bold rounded-md hover:bg-white transition-colors"
                      >
                        Adicionar
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleReferralAction(notif.id, notif.action_data.target_user_id, 'reject'); }}
                        className="px-3 py-1.5 bg-white/10 text-zinc-300 text-xs font-bold rounded-md hover:bg-white/20 transition-colors"
                      >
                        Recusar
                      </button>
                    </div>
                  )}
                </div>
                {!notif.read && <div className="unread-indicator" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
