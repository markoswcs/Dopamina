import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function RankingPage() {
 const { user } = useAuth();
 const [scope, setScope] = useState('global'); // global | friends
 const [metric, setMetric] = useState('xp'); // xp | wins | streak
 const [ranking, setRanking] = useState([]);
 
 // Mock Data
 useEffect(() => {
 setRanking([
 { id: 1, position: 1, name: 'KingDopa', avatar: 'https://i.pravatar.cc/150?u=king', rank: 'Lenda', xp: 50000, level: 99, isMe: false },
 { id: 2, position: 2, name: 'SilverFang', avatar: 'https://i.pravatar.cc/150?u=silver', rank: 'Diamante', xp: 45000, level: 85, isMe: false },
 { id: 3, position: 3, name: 'BronzeBoy', avatar: 'https://i.pravatar.cc/150?u=bronze', rank: 'Diamante', xp: 42000, level: 80, isMe: false },
 { id: 4, position: 4, name: 'You', avatar: 'https://i.pravatar.cc/150?u=me', rank: 'Ouro', xp: 38000, level: 75, isMe: true },
 { id: 5, position: 5, name: 'RandomUser', avatar: 'https://i.pravatar.cc/150?u=random', rank: 'Prata', xp: 35000, level: 70, isMe: false },
 ]);
 }, [scope, metric]);

 const getRankBadgeClass = (rank) => {
 switch (rank) {
 case 'Bronze': return 'bg-amber-900/50 text-amber-400 border-amber-500/50';
 case 'Prata': return 'bg-gray-700/50 text-gray-300 border-gray-400/50';
 case 'Ouro': return 'bg-yellow-900/50 text-yellow-400 border-yellow-500/50';
 case 'Diamante': return 'bg-blue-900/50 text-blue-300 border-blue-500/50';
 case 'Lenda': return 'bg-purple-900/50 text-purple-300 border-purple-500/50 animate-pulse';
 default: return 'bg-zinc-800 text-zinc-400 border-zinc-600';
 }
 };

 const top3 = ranking.slice(0, 3);
 const others = ranking.slice(3);

 return (
 <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
 {/* Header & Controls */}
 <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-900/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
 <div className="flex bg-zinc-950 rounded-xl p-1 border border-white/5">
 <button 
 onClick={() => setScope('global')}
 className={`px-6 py-2 rounded-lg font-bold transition-all ${scope === 'global' ? 'bg-purple-600 text-white ' : 'text-zinc-400 hover:text-white'}`}
 >
 Global
 </button>
 <button 
 onClick={() => setScope('friends')}
 className={`px-6 py-2 rounded-lg font-bold transition-all ${scope === 'friends' ? 'bg-purple-600 text-white ' : 'text-zinc-400 hover:text-white'}`}
 >
 Amigos
 </button>
 </div>
 
 <div className="flex gap-2 text-sm font-semibold">
 {['xp', 'wins', 'streak'].map(m => (
 <button 
 key={m}
 onClick={() => setMetric(m)}
 className={`px-4 py-2 rounded-lg transition-colors border ${metric === m ? 'border-purple-500 text-purple-400 bg-purple-500/10' : 'border-white/10 text-zinc-400 hover:bg-zinc-800'}`}
 >
 {m === 'xp' ? 'XP Total' : m === 'wins' ? 'Batalhas Ganhas' : 'Streak'}
 </button>
 ))}
 </div>
 </div>

 {/* Podium */}
 {top3.length === 3 && (
 <div className="flex justify-center items-end gap-2 md:gap-6 pt-10 pb-6">
 {/* 2nd Place */}
 <div className="flex flex-col items-center transform translate-y-8">
 <div className="text-4xl mb-2">🥈</div>
 <img loading="lazy"decoding="async"src={top3[1].avatar} className="w-20 h-20 rounded-full border-4 border-gray-400 shadow-[0_0_15px_rgba(156,163,175,0.5)] z-10 bg-zinc-900"alt="2nd"/>
 <div className="w-24 md:w-32 h-24 md:h-32 bg-gradient-to-t from-gray-800 to-gray-600 rounded-t-xl mt-[-10px] flex flex-col items-center justify-end pb-4 border border-gray-500">
 <span className="font-bold text-white truncate w-full text-center px-1">{top3[1].name}</span>
 <span className="text-xs text-gray-300">{top3[1].xp} XP</span>
 </div>
 </div>
 
 {/* 1st Place */}
 <div className="flex flex-col items-center z-20">
 <div className="text-5xl mb-2 animate-bounce">👑</div>
 <img loading="lazy"decoding="async"src={top3[0].avatar} className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)] z-10 bg-zinc-900"alt="1st"/>
 <div className="w-28 md:w-36 h-32 md:h-40 bg-gradient-to-t from-yellow-800 to-yellow-600 rounded-t-xl mt-[-10px] flex flex-col items-center justify-end pb-4 border border-yellow-500">
 <span className="font-bold text-white text-lg truncate w-full text-center px-1">{top3[0].name}</span>
 <span className="text-sm font-bold text-yellow-200">{top3[0].xp} XP</span>
 </div>
 </div>

 {/* 3rd Place */}
 <div className="flex flex-col items-center transform translate-y-12">
 <div className="text-3xl mb-2">🥉</div>
 <img loading="lazy"decoding="async"src={top3[2].avatar} className="w-16 h-16 rounded-full border-4 border-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.5)] z-10 bg-zinc-900"alt="3rd"/>
 <div className="w-24 md:w-32 h-20 md:h-28 bg-gradient-to-t from-amber-900 to-amber-700 rounded-t-xl mt-[-10px] flex flex-col items-center justify-end pb-4 border border-amber-600">
 <span className="font-bold text-white truncate w-full text-center px-1">{top3[2].name}</span>
 <span className="text-xs text-amber-200">{top3[2].xp} XP</span>
 </div>
 </div>
 </div>
 )}

 {/* List */}
 <div className="flex flex-col gap-3">
 {others.map(user => (
 <div 
 key={user.id} 
 className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${user.isMe ? 'bg-purple-900/30 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-zinc-900 border-white/5 hover:bg-zinc-800'}`}
 >
 <div className="w-8 text-center font-bold text-xl text-zinc-500">
 {user.position}
 </div>
 <img loading="lazy"decoding="async"src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-zinc-700"/>
 <div className="flex-1">
 <div className="font-bold text-lg text-white flex items-center gap-2">
 {user.name}
 {user.isMe && <span className="text-xs bg-purple-600 px-2 py-0.5 rounded-full">Você</span>}
 </div>
 <div className="text-sm text-zinc-400">Nível {user.level}</div>
 </div>
 <div className={`px-3 py-1 rounded-lg border text-xs font-bold uppercase ${getRankBadgeClass(user.rank)} hidden sm:block`}>
 {user.rank}
 </div>
 <div className="text-right ml-4">
 <div className="font-bold text-purple-400">{user.xp.toLocaleString()} XP</div>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}
