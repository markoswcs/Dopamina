import React from"react";
import { categories } from"../productsData";

export default function CategoryNav({ activeCategory, setActiveCategory }) {
 return (
 <div className="w-full overflow-x-auto scrollbar-none py-3">
 <div className="flex gap-2 min-w-max px-1">
 {/* All products tab */}
 <button
 onClick={() => setActiveCategory("all")}
 className={`shrink-0 flex items-center gap-1.5 py-2 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
 activeCategory ==="all"
 ?"bg-accent text-white border-accent"
 :"theme-card theme-border theme-text-secondary hover:border-accent/50"
 }`}
 >
 <span>🏠</span>
 <span>Todos</span>
 </button>

 {categories.map((cat) => (
 <button
 key={cat.id}
 onClick={() => setActiveCategory(cat.id)}
 className={`shrink-0 flex items-center gap-1.5 py-2 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
 activeCategory === cat.id
 ?"text-white border-transparent"
 :"theme-card theme-border theme-text-secondary hover:border-accent/50"
 }`}
 style={activeCategory === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
 >
 <span>{cat.emoji}</span>
 <span>{cat.name}</span>
 </button>
 ))}
 </div>
 </div>
 );
}
