import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Users, LogOut, ChevronDown } from 'lucide-react';

export default function UserMenu({ onNavigate }) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = (user.username || user.email || '?').substring(0, 2).toUpperCase();

  const nav = (tab) => { setIsOpen(false); if (onNavigate) onNavigate(tab); };

  const menuItems = [
    { label: 'Meu Perfil',   tab: 'profile',   icon: User },
    { label: 'Amigos',       tab: 'friends',   icon: Users },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-black text-white bg-gradient-to-br from-accent/60 to-accent/30">
              {initials}
            </div>
          )}
        </div>

        {/* Username */}
        <span className="text-sm font-semibold text-white leading-none hidden sm:block max-w-[80px] truncate">
          {user.username || user.email?.split('@')[0] || 'Conta'}
        </span>

        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 hidden sm:block ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#111114]/95 backdrop-blur-2xl border border-white/10 py-1.5 z-50 shadow-2xl shadow-black/60 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* User header */}
          <div className="px-4 py-3 border-b border-white/5 mb-1">
            <p className="text-sm font-black text-white leading-tight truncate">
              {user.username || user.email?.split('@')[0] || 'Jogador'}
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{user.email}</p>
          </div>

          {menuItems.map(({ label, tab, icon: Icon }) => (
            <button
              key={tab}
              onClick={() => nav(tab)}
              className="w-full text-left px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3 group"
            >
              <Icon className="w-4 h-4 text-zinc-600 group-hover:text-accent transition-colors" />
              {label}
            </button>
          ))}

          <div className="h-px bg-white/5 my-1.5" />

          <button
            onClick={() => { setIsOpen(false); logout(); }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors flex items-center gap-3 group rounded-b-2xl"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
