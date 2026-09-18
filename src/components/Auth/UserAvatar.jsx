import React from 'react';

export default function UserAvatar({ user, size = 'md' }) {
  const sizeMap = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  };

  const getInitials = (username) => {
    if (!username) return '?';
    return username.substring(0, 2).toUpperCase();
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  if (user?.avatar_url) {
    return (
      <img loading="lazy" decoding="async" 
        src={user.avatar_url} 
        alt={user.username || 'Avatar'} 
        className={`${currentSize} rounded-full object-cover border border-white/10`}
      />
    );
  }

  return (
    <div className={`${currentSize} rounded-full bg-gradient-to-br from-accent/80 to-accent/40 flex items-center justify-center text-white font-semibold border border-white/10`}>
      {getInitials(user?.username)}
    </div>
  );
}
