import React from"react";
import { Home, Gamepad2, ShoppingBag, Search, Map, Package } from"lucide-react";

export default function BottomNav({ activeTab, setActiveTab, cartCount, onSearchClick }) {
 const tabs = [
  { id:"home", icon: Home, label:"Home", action: () => setActiveTab("home") },
  { id:"search", icon: Search, label:"Busca", action: onSearchClick },
  { id:"dopagames", icon: Gamepad2, label:"Cassino", action: () => setActiveTab("dopagames") },
  { id:"inventory", icon: Package, label:"Cofre", action: () => setActiveTab("inventory") },
  { id:"cart", icon: ShoppingBag, label:"Cesta", badge: cartCount, action: () => setActiveTab("cart") },
 ];

 return (
  <div className="md:hidden fixed bottom-4 left-4 right-4 bg-[var(--t-surface)]/80 backdrop-blur-2xl border theme-border shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-40 pb-safe rounded-3xl overflow-hidden touch-manipulation">
   <div className="flex items-center justify-around px-2 py-2.5 overflow-x-auto gap-1 no-scrollbar">
    {tabs.map((tab) => {
     const Icon = tab.icon;
     const isActive = activeTab === tab.id;

     return (
      <button
       key={tab.id}
       onClick={(e) => {
        if (window.triggerDopaParticles) window.triggerDopaParticles(e.clientX, e.clientY);
        tab.action();
       }}
       className={`flex flex-col items-center justify-center w-14 h-[50px] relative transition-all cursor-pointer shrink-0 rounded-2xl active:scale-95 ${
        isActive ?"text-accent bg-accent/10":"theme-muted hover:theme-text hover:bg-black/5 dark:hover:bg-white/5"
       }`}
      >
       <div className={`relative transition-transform duration-300 ${isActive ?"-translate-y-1 scale-110":""}`}>
        <Icon className={`w-5 h-5 ${isActive ? (tab.id === 'favorites' ? 'fill-accent' : 'fill-accent/20') :""}`} />
        {tab.badge > 0 && (
         <span className="absolute -top-1.5 -right-2 bg-danger text-white text-[9px] font-bold px-1.5 min-w-[16px] h-[16px] rounded-full flex items-center justify-center animate-bounce">
          {tab.badge}
         </span>
        )}
       </div>
       <span className={`text-[9px] font-bold mt-0.5 transition-all ${isActive ?"opacity-100 translate-y-0":"opacity-0 translate-y-2 absolute"}`}>
        {tab.label}
       </span>
      </button>
     );
    })}
   </div>
  </div>
 );
}
