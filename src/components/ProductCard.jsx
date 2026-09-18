import React from"react";
import { ShoppingCart, Star, Heart } from"lucide-react";

export default function ProductCard({ product, onAddToCart, onBuyNow, onToggleFavorite, isFavorited }) {
 const fmt = (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +"Dopas";
 const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

 return (
 <div 
 className="group relative h-full"
 style={{ perspective:"800px"}}
 >
 <div 
 className="theme-card border theme-border rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-500 ease-out )] )] group-hover:-translate-y-1.5 group-hover:border-accent/40 will-change-transform"
 style={{ transformStyle:"preserve-3d"}}
 >
 {/* Image */}
 <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
 <img loading="lazy"decoding="async"
 src={product.image} 
 alt={product.name} 
 loading="lazy"
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
 />

 {/* Tag */}
 {product.tag && (
 <span className="absolute top-2 left-2 bg-accent/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[8px] md:text-[9px] font-bold uppercase tracking-wider">
 {product.tag}
 </span>
 )}

 {/* Favorite */}
 <button 
 onClick={(e) => onToggleFavorite(product.id, e)}
 className="absolute top-2 right-2 p-1.5 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur-sm hover:scale-110 transition-transform cursor-pointer"
 >
 <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-accent text-accent' : 'text-gray-500 dark:text-gray-400'}`} />
 </button>

 {/* Discount badge */}
 {discount > 0 && (
 <span className="absolute bottom-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
 -{discount}%
 </span>
 )}
 </div>

 {/* Content — compact */}
 <div className="p-3 flex flex-col flex-1">
 
 {/* Rating inline */}
 <div className="flex items-center gap-1 mb-1">
 <Star className="w-3 h-3 text-amber-400 fill-amber-400"/>
 <span className="text-[10px] font-semibold theme-text">{product.rating}</span>
 <span className="text-[10px] theme-muted">({product.salesCount})</span>
 </div>

 {/* Title */}
 <h3 className="font-display font-semibold text-xs md:text-[13px] theme-text leading-snug line-clamp-2 mb-2 flex-1">
 {product.name}
 </h3>

 {/* Price */}
 <div className="mb-3">
 {product.oldPrice && (
 <span className="line-through text-[10px] theme-muted block leading-none mb-0.5">
 {fmt(product.oldPrice)}
 </span>
 )}
 <span className="font-display font-extrabold text-base md:text-lg text-accent leading-none">
 {fmt(product.price)}
 </span>
 </div>

 {/* Actions */}
 <div className="flex items-center gap-1.5 mt-auto">
 <button 
 onClick={(e) => onBuyNow(product, e)}
 className="flex-1 py-2.5 min-h-[44px] bg-accent hover:bg-accent-dark text-white rounded-xl font-display font-bold text-[11px] uppercase tracking-wider hover: hover:-translate-y-px transition-all active:scale-95 cursor-pointer touch-manipulation"
 >
 Comprar
 </button>
 <button 
 onClick={(e) => onAddToCart(product, e)}
 className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center bg-black/5 dark:bg-white/10 hover:bg-accent hover:text-white rounded-xl transition-all theme-text cursor-pointer active:scale-90 touch-manipulation"
 title="Adicionar ao Carrinho"
 >
 <ShoppingCart className="w-4 h-4"/>
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}
