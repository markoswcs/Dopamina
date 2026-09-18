import React, { useState, useEffect } from"react";
import { ChevronLeft, ChevronRight } from"lucide-react";

const banners = [
 { id: 1, image:"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=1200&q=80", title:"Setup Gamer dos Sonhos", subtitle:"Monte o PC perfeito com até 40% OFF", color:"#E85D3A"},
 { id: 2, image:"https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80", title:"PlayStation 5 Pro", subtitle:"A nova geração já chegou. E custa 0,00 Dopas", color:"#3B82F6"},
 { id: 3, image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80", title:"Bolsas de Luxo", subtitle:"Louis Vuitton, Chanel e mais com frete imaginário", color:"#EC4899"},
 { id: 4, image:"/gta6-banner-new.webp", title:"GTA VI já disponível!", subtitle:"Pré-venda aberta. Vice City nunca esteve tão real", color:"#EF4444"},
 { id: 5, image:"https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80", title:"Joias Finas", subtitle:"Tiffany, Cartier e Bulgari. Porque você merece", color:"#8B5CF6"},
];

export default function BannerCarousel() {
 const [current, setCurrent] = useState(0);

 useEffect(() => {
 const timer = setInterval(() => setCurrent(p => (p + 1) % banners.length), 4500);
 return () => clearInterval(timer);
 }, []);

 const goTo = (i) => setCurrent(i);
 const prev = () => setCurrent(p => (p - 1 + banners.length) % banners.length);
 const next = () => setCurrent(p => (p + 1) % banners.length);

 return (
 <div className="relative w-full rounded-2xl overflow-hidden border theme-border group">
 <div className="relative h-40 md:h-56 overflow-hidden">
 {banners.map((b, i) => (
 <div
 key={b.id}
 className="absolute inset-0 transition-all duration-700 ease-in-out"
 style={{
 opacity: i === current ? 1 : 0,
 transform: i === current ?"scale(1)":"scale(1.05)",
 zIndex: i === current ? 1 : 0,
 }}
 >
 <img loading="lazy"decoding="async"src={b.image} alt={b.title} className="w-full h-full object-cover"/>
 <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"/>
 <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-10 max-w-[70%]">
 <div className="text-[9px] uppercase font-bold tracking-widest text-white/70 mb-1">DopaShop Destaque</div>
 <h3 className="font-display font-extrabold text-lg md:text-2xl text-white leading-tight">{b.title}</h3>
 <p className="text-xs text-white/80 mt-1">{b.subtitle}</p>
 </div>
 </div>
 ))}
 </div>

 {/* Arrows */}
 <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
 <ChevronLeft className="w-4 h-4"/>
 </button>
 <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
 <ChevronRight className="w-4 h-4"/>
 </button>

 {/* Dots */}
 <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
 {banners.map((_, i) => (
 <button key={i} onClick={() => goTo(i)} className={`w-2 h-2 rounded-full cursor-pointer transition-all ${i === current ?"bg-white w-5":"bg-white/40"}`} />
 ))}
 </div>
 </div>
 );
}
