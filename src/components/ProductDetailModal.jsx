import React, { useState } from"react";
import { X, Star, ShoppingBag, Heart, Shield, Truck, Tag, Share2, Check } from"lucide-react";

export default function ProductDetailModal({ product, onClose, onAddToCart, onBuyNow, onToggleFavorite, isFavorited }) {
 const [copied, setCopied] = useState(false);
 if (!product) return null;
 const fmt = (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +"Dopas";

 const handleShare = () => {
 const shareText =`Dá uma olhada nisso no DopaShop: ${product.name} por ${fmt(product.price)}! (É de mentira, mas é legal) \n\nhttps://dopashop.simulador/produto/${product.id}`;
 if (navigator.share) {
 navigator.share({ title: product.name, text: shareText, url:`https://dopashop.simulador/produto/${product.id}`}).catch(console.error);
 } else {
 navigator.clipboard.writeText(shareText);
 setCopied(true);
 setTimeout(() => setCopied(false), 2500);
 }
 };

 return (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"onClick={onClose}>
 <div className="theme-card border theme-border w-full max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"onClick={e => e.stopPropagation()}>
 {/* Header */}
 <div className="flex justify-between items-center p-4 border-b theme-border theme-surface">
 <h2 className="font-display font-bold text-sm theme-text truncate pr-4">{product.name}</h2>
 <div className="flex items-center gap-3">
 <button onClick={handleShare} className="theme-muted hover:text-accent cursor-pointer flex items-center gap-1 text-[10px] font-bold">
 {copied ? <Check className="w-4 h-4 text-success"/> : <Share2 className="w-4 h-4"/>}
 <span className="hidden sm:inline">{copied ?"Link Copiado!":"Compartilhar"}</span>
 </button>
 <button onClick={onClose} className="theme-muted hover:theme-text cursor-pointer shrink-0"><X className="w-5 h-5"/></button>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto">
 {/* Image + Info */}
 <div className="md:flex">
 <div className="relative md:w-1/2">
 <img loading="lazy"decoding="async"src={product.image} alt={product.name} className="w-full h-56 md:h-72 object-cover"/>
 {product.tag && (
 <span className="absolute top-3 left-3 bg-accent text-white text-[9px] font-bold uppercase px-2.5 py-1 rounded-full">🔥 {product.tag}</span>
 )}
 <button onClick={() => onToggleFavorite(product.id)}
 className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
 <Heart className={`w-5 h-5 ${isFavorited ?"text-danger fill-danger":"text-gray-500"}`} />
 </button>
 </div>

 <div className="p-5 md:w-1/2 space-y-4">
 <div>
 <div className="text-[10px] uppercase font-bold theme-muted tracking-wider">{product.category}</div>
 <h3 className="font-display font-extrabold text-lg theme-text mt-1">{product.name}</h3>
 </div>

 <div className="flex items-center gap-2">
 <Star className="w-4 h-4 text-warning fill-warning"/>
 <span className="text-sm font-bold theme-text">{product.rating}</span>
 <span className="text-xs theme-muted">({product.salesCount.toLocaleString()} vendas)</span>
 </div>

 <p className="text-xs theme-text-secondary leading-relaxed">{product.description}</p>

 {product.specs && (
 <div className="flex flex-wrap gap-1.5">
 {product.specs.map((s, i) => (
 <span key={i} className="text-[9px] theme-surface border theme-border px-2 py-0.5 rounded-full theme-text-secondary">{s}</span>
 ))}
 </div>
 )}

 <div className="space-y-1">
 {product.oldPrice && <div className="text-xs theme-muted line-through">{fmt(product.oldPrice)}</div>}
 <div className="flex items-baseline gap-2">
 <span className="font-display font-extrabold text-2xl text-accent">{fmt(product.price)}</span>
 {product.oldPrice && <span className="text-xs font-bold text-success">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>}
 </div>
 <div className="text-[10px] theme-muted">ou 12x de {fmt(product.price / 12)} sem juros</div>
 </div>

 <div className="flex gap-2 pt-2">
 <button onClick={() => { onAddToCart(product); }} className="flex-1 py-2.5 border-2 border-accent text-accent hover:bg-accent hover:text-white font-display font-bold text-xs uppercase rounded-xl cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5">
 <ShoppingBag className="w-4 h-4"/> Carrinho
 </button>
 <button onClick={() => { onBuyNow(product); onClose(); }} className="flex-1 py-2.5 bg-accent hover:opacity-90 text-white font-display font-bold text-xs uppercase rounded-xl cursor-pointer transition-all active:scale-95">
 Comprar Agora
 </button>
 </div>

 <div className="flex gap-3 pt-1 text-[9px] theme-muted">
 <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-success"/> 0% Seguro</span>
 <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-accent"/> Frete fictício</span>
 <span className="flex items-center gap-1"><Tag className="w-3 h-3 text-warning"/> Preço irreal</span>
 </div>
 </div>
 </div>

 {/* Reviews */}
 {product.reviews && product.reviews.length > 0 && (
 <div className="p-5 border-t theme-border space-y-4">
 <h4 className="font-display font-bold text-sm theme-text flex items-center gap-2">
 ⭐ Avaliações dos Compradores <span className="text-xs theme-muted font-normal">({product.reviews.length})</span>
 </h4>
 <div className="space-y-3">
 {product.reviews.map((r, i) => (
 <div key={i} className="theme-surface border theme-border p-3 rounded-xl space-y-1.5">
 <div className="flex justify-between items-center">
 <div className="flex items-center gap-2">
 <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">{r.name[0]}</div>
 <div>
 <span className="text-xs font-semibold theme-text">{r.name}</span>
 <span className="text-[9px] theme-muted ml-2">{r.date}</span>
 </div>
 </div>
 <div className="flex gap-0.5">
 {Array.from({ length: 5 }).map((_, si) => (
 <Star key={si} className={`w-3 h-3 ${si < r.rating ?"text-warning fill-warning":"text-gray-300"}`} />
 ))}
 </div>
 </div>
 <p className="text-xs theme-text-secondary leading-relaxed">{r.comment}</p>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
