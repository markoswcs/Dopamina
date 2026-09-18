import React, { useState, useEffect } from "react";
import {
  Sparkles, ShoppingBag, Search, Gift, Shield, Truck, Trash2,
  Flame, RotateCw, Tag, Map, User, Heart, Package, Wand2, Box, Zap, Rocket,
  Users, Trophy, Swords, Bell, LogIn
} from "lucide-react";
import { products, categories, coupons, getPixRank, trackingStages } from "./productsData";
import ProductCard from "./components/ProductCard";
import CouponScratcher from "./components/CouponScratcher";
import DiscountRoulette from "./components/DiscountRoulette";
import CategoryNav from "./components/CategoryNav";
import BottomNav from "./components/BottomNav";
import ReviewSection from "./components/ReviewSection";
import CheckoutModal from "./components/CheckoutModal";
import ParticleEffect from "./components/ParticleEffect";
import TopMarquee from "./components/TopMarquee";
import OrderTracking from "./components/OrderTracking";
import AuraRanksModal from "./components/AuraRanksModal";
import WinPopup from "./components/WinPopup";
import CrashGame from "./components/CrashGame";
import ItemUpgrade from "./components/ItemUpgrade";
import PixDepositModal from "./components/PixDepositModal";
import DailyCaseModal from "./components/DailyCaseModal";
import ProductDetailModal from "./components/ProductDetailModal";
import Inventory from "./components/Inventory";
import { playNotificationPop } from "./audioManager";
import { supabase } from "./lib/supabase";
import { MotionConfig } from "framer-motion";
// ---- Auth Context — shared from context/AuthContext.jsx ----
const API = 'http://localhost:3001';
import { AuthProvider, useAuth } from './context/AuthContext';

// ---- Lazy-load social components ----
const AuthPage = React.lazy(() => import('./components/Auth/AuthPage'));
const UserMenu = React.lazy(() => import('./components/Auth/UserMenu'));
const ProfilePage = React.lazy(() => import('./components/Social/ProfilePage'));
const FriendsPanel = React.lazy(() => import('./components/Social/FriendsPanel'));
const RankingPage = React.lazy(() => import('./components/Social/RankingPage'));
const NotificationBell = React.lazy(() => import('./components/Social/NotificationBell'));
const BattlePage = React.lazy(() => import('./components/Social/BattlePage'));

// ---- Main App wrapped in AuthProvider ----
export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

function AppInner() {
  const { user, token, loading, logout, addSpending, updateBalance } = useAuth();

  const [isDark] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [viewingProfileId, setViewingProfileId] = useState(null);
  const [activeGameTab, setActiveGameTab] = useState("roulette");
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [activeDiscount, setActiveDiscount] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productDetailOpen, setProductDetailOpen] = useState(null);
  const [auraRanksOpen, setAuraRanksOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [lastToast, setLastToast] = useState("");
  const [toastExiting, setToastExiting] = useState(false);
  const [winPrize, setWinPrize] = useState(null);
  const [ageGateOpen, setAgeGateOpen] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [pixDepositOpen, setPixDepositOpen] = useState(false);
  const [upgradePreselect, setUpgradePreselect] = useState(null);
  const [dailyCaseOpen, setDailyCaseOpen] = useState(false);
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dopashop_animations")) ?? true; } catch { return true; }
  });

  const [totalSpent, setTotalSpent] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dopashop_total_spent")) || 0; } catch { return 0; }
  });
  const [userData, setUserData] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dopashop_user")) || null; } catch { return null; }
  });
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dopashop_orders")) || []; } catch { return []; }
  });
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dopashop_favorites")) || []; } catch { return []; }
  });
  const [activeTheme, setActiveTheme] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dopashop_theme_colors")) || null; } catch { return null; }
  });

  // DopaCoins: só exibe se o usuário estiver logado
  const [dopaBalance, setDopaBalance] = useState(0);
  useEffect(() => {
    if (user) {
      setDopaBalance(user.coins || 0);
    } else {
      setDopaBalance(0);
    }
  }, [user]);

  // Capture referral code from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      localStorage.setItem("dopashop_referral", ref);
      // Clean up URL without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => { 
    localStorage.setItem("dopashop_animations", JSON.stringify(animationsEnabled)); 
    if (!animationsEnabled) {
      document.documentElement.classList.add("reduce-animations");
    } else {
      document.documentElement.classList.remove("reduce-animations");
    }
  }, [animationsEnabled]);
  useEffect(() => { localStorage.setItem("dopashop_theme", isDark ? "dark" : "light"); document.body.classList.toggle("dark", isDark); }, [isDark]);
  useEffect(() => { localStorage.setItem("dopashop_total_spent", JSON.stringify(totalSpent)); }, [totalSpent]);
  useEffect(() => { localStorage.setItem("dopashop_user", JSON.stringify(userData)); }, [userData]);
  useEffect(() => { localStorage.setItem("dopashop_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("dopashop_favorites", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => {
    if (activeTheme) {
      localStorage.setItem("dopashop_theme_colors", JSON.stringify(activeTheme));
      document.documentElement.style.setProperty('--color-accent', activeTheme.accent);
      document.documentElement.style.setProperty('--color-accent-dark', activeTheme.dark);
    } else {
      document.documentElement.style.removeProperty('--color-accent');
      document.documentElement.style.removeProperty('--color-accent-dark');
    }
  }, [activeTheme]);

  // Real-time balance updates from other windows
  useEffect(() => {
    const handleUpdateBalanceEvent = () => {
      // Fetch fresh balance when requested
      if (user) {
        supabase.from('user_balance').select('coins').eq('user_id', user.id).single()
          .then(({data}) => { if (data) { setDopaBalance(data.coins); if(updateBalance) updateBalance(data.coins); } });
      }
    };
    window.addEventListener('updateBalance', handleUpdateBalanceEvent);
    return () => window.removeEventListener('updateBalance', handleUpdateBalanceEvent);
  }, [updateBalance, user]);

  const handleNavigate = (tab, payload = null) => {
    if (tab === 'profile' && payload) {
      setViewingProfileId(payload);
    } else if (tab === 'profile') {
      setViewingProfileId(user?.id);
    }
    setActiveTab(tab);
  };

  useEffect(() => {
    setTimeout(() => { const root = document.getElementById("root"); if (root) root.style.opacity = "1"; }, 150);
  }, []);

  useEffect(() => { if (toastMessage) setLastToast(toastMessage); }, [toastMessage]);

  // Order tracking notifications
  useEffect(() => {
    if (!orders || orders.length === 0) return;
    const check = () => {
      const now = Date.now();
      let updated = false;
      const newOrders = orders.map((order, idx) => {
        if (!order.timestamp) return order;
        const elapsed = (now - order.timestamp) / 60000;
        const active = trackingStages.filter(s => elapsed >= s.minutesAfter);
        const stageIdx = Math.max(0, active.length - 1);
        const last = order.lastNotifiedStageIndex || 0;
        if (stageIdx > last) {
          const s = trackingStages[stageIdx];
          showToast({ title: "Atualização de Entrega", message: `Pedido #${String(idx + 1).padStart(4, "0")}: ${s.label}`, icon: s.emoji });
          updated = true;
          return { ...order, lastNotifiedStageIndex: stageIdx };
        }
        return order;
      });
      if (updated) setOrders(newOrders);
    };
    const id = setInterval(check, 10000);
    return () => clearInterval(id);
  }, [orders]);

  const showToast = async (toastObj) => {
    if (typeof toastObj === 'string') toastObj = { title: "Notificação", message: toastObj };
    setToastMessage(toastObj);
    setToastExiting(false);
    playNotificationPop();
    
    // Salvar notificação no Supabase se for ganho de item
    if (user && (toastObj.type === 'item_won' || toastObj.title?.toUpperCase().includes('GANHO'))) {
      try {
        await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'item_won',
          message: toastObj.message,
          image_url: toastObj.image || null,
          read: false
        });
      } catch (e) {
        console.error('Erro ao salvar notificacao', e);
      }
    }

    setTimeout(() => {
      setToastExiting(true);
      setTimeout(() => {
        setToastMessage(null);
        setToastExiting(false);
      }, 600); // duração da animação de saída
    }, 3500);
  };

  const handleAddToCart = (product, e) => { if (e) e.stopPropagation(); setCart(prev => [...prev, product]); showToast(`Adicionado ao carrinho!`); };
  const handleBuyNow = (product, e) => { if (e) e.stopPropagation(); setCart(prev => [...prev, product]); setCheckoutOpen(true); };
  const handleToggleFavorite = (productId, e) => {
    if (e) e.stopPropagation();
    setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    if (window.triggerDopaParticles && e) window.triggerDopaParticles(e.clientX, e.clientY);
  };
  const handleRemoveFromCart = (index, e) => { if (e && window.triggerDopaParticles) window.triggerDopaParticles(e.clientX, e.clientY); setCart(prev => prev.filter((_, i) => i !== index)); };
  const handleCouponReveal = (code) => {
    const found = coupons.find(c => c.code === code);
    if (found) { if (found.type !== 'aura') setActiveDiscount(found); setWinPrize(found); }
  };
  const handleOrderComplete = (orderData) => {
    setOrders(prev => [orderData, ...prev]);
    if (orderData.rawTotal) {
      handleUpdateCoins(-orderData.rawTotal);
    }
  };
  const handleCategoryChange = (catId) => {
    if (catId === 'ilicitos' && !isAgeVerified) setAgeGateOpen(true);
    else setActiveCategory(catId);
  };

  const handleUpdateCoins = async (amount) => {
    setDopaBalance(prev => {
      const newBal = prev + amount;
      if (user) {
        if (updateBalance) updateBalance(newBal);
        // Sync balance with Supabase
        supabase.from('user_balance').update({ coins: newBal }).eq('user_id', user.id).then(({ error }) => {
          if (error) console.error('[App] Erro ao sincronizar moedas:', error);
        });
      }
      return newBal;
    });
    // Track spending (only when coins are deducted)
    if (amount < 0 && user) {
      addSpending(Math.abs(amount));
    }
  };

  let filteredProducts = products;
  if (activeTab === "favorites") {
    filteredProducts = products.filter(p => favorites.includes(p.id));
  } else {
    filteredProducts = products.filter(p => {
      const matchCat = activeCategory === "all" ? p.category !== "ilicitos" : p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const fmt = (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Dopas";
  const formatBalance = (val) => {
    if (val >= 1e12) return (val / 1e12).toFixed(2) + 'T';
    if (val >= 1e9) return (val / 1e9).toFixed(2) + 'B';
    if (val >= 1e6) return (val / 1e6).toFixed(2) + 'M';
    if (val >= 1e3) return (val / 1e3).toFixed(1) + 'K';
    return val.toLocaleString('pt-BR');
  };

  const DopaCoinIcon = ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="dopaCoinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffb03a" />
          <stop offset="100%" stopColor="#ff6f00" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#dopaCoinGrad)" stroke="#e65c00" strokeWidth="4" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#d45100" strokeWidth="1.5" opacity="0.6" />
      <path d="M 36 32 L 58 32 C 80 32 80 68 58 68 L 39 68 L 45 52 L 36 52 Z M 47 42 L 57 42 C 70 42 70 58 57 58 L 52 58 L 55 52 L 47 52 Z" fill="#fff5e6" fillRule="evenodd" />
    </svg>
  );

  const currentCat = categories.find(c => c.id === activeCategory);
  const currentRank = getPixRank(totalSpent);

  // Show loading screen while verifying token
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 text-sm">Carregando DopaShop...</p>
        </div>
      </div>
    );
  }

  // Show auth page if explicitly requested
  if (showAuthPage && !user) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>}>
        <AuthPage onSuccess={() => setShowAuthPage(false)} />
      </React.Suspense>
    );
  }

  return (
    <MotionConfig reducedMotion={animationsEnabled ? "user" : "always"}>
      <div className={`min-h-screen pb-28 md:pb-6 transition-colors duration-300 ${isDark ? "dark" : ""}`}>
        {animationsEnabled && <ParticleEffect isDark={isDark} />}
        <TopMarquee />

      {/* Toast Notification */}
      <div
        className={`fixed left-1/2 z-[100] px-5 py-3 rounded-2xl shadow-lg flex items-center gap-4 backdrop-blur-xl border pointer-events-none ${
          toastMessage && !toastExiting
            ? 'top-20 opacity-100 bg-[var(--t-surface)]/80 theme-text border-[var(--t-border)] animate-toast-enter'
            : toastExiting
              ? 'top-20 bg-[var(--t-surface)]/80 theme-text border-[var(--t-border)] animate-toast-exit-to-bell'
              : 'hidden'
        }`}
        style={{ minWidth: '320px' }}
      >
        {(toastMessage || lastToast) && (
          <>
            <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              {(toastMessage || lastToast).image ? (
                <img loading="lazy" decoding="async" src={(toastMessage || lastToast).image} alt="icon" className="w-10 h-10 object-contain drop-shadow-md" />
              ) : (toastMessage || lastToast).icon ? (
                <span className="text-2xl drop-shadow-md">{(toastMessage || lastToast).icon}</span>
              ) : (
                <Sparkles className="w-5 h-5 text-accent" />
              )}
            </div>
            <div className="flex flex-col flex-1 pr-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${toastMessage ? 'text-accent' : 'text-transparent'} transition-colors duration-500`}>
                {(toastMessage || lastToast).title || 'Notificação'}
              </span>
              <span className="text-sm font-bold text-white leading-tight mt-0.5">
                {(toastMessage || lastToast).message}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-[var(--t-surface)]/80 backdrop-blur-lg border-b theme-border z-30 px-4 py-3 shadow-sm transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 shrink-0">
            <div onClick={(e) => { if (window.triggerDopaParticles) window.triggerDopaParticles(e.clientX, e.clientY); setActiveTab("home"); setActiveCategory("all"); }} className="flex items-center gap-2 cursor-pointer select-none group">
              <div className="bg-accent p-1.5 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-white fill-white group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-display font-extrabold text-base md:text-xl tracking-tight theme-text hidden sm:block">
                DOPA<span className="text-accent">SHOP</span>
              </span>
            </div>

            {user ? (
              <React.Suspense fallback={null}>
                <UserMenu onNavigate={handleNavigate} />
              </React.Suspense>
            ) : (
              <button
                onClick={() => setShowAuthPage(true)}
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:opacity-90 text-white rounded-full text-xs font-bold transition-all active:scale-95 shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:block">Entrar</span>
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md theme-surface border theme-border rounded-full px-4 py-2">
            <Search className="w-4 h-4 theme-muted mr-2" />
            <input type="text" placeholder="Pesquisar..." value={searchQuery} onChange={(e) => { setActiveTab("home"); setSearchQuery(e.target.value); }} className="bg-transparent text-xs w-full focus:outline-none theme-text" />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Notifications Bell */}
            {user && (
              <React.Suspense fallback={<Bell className="w-5 h-5 text-zinc-500" />}>
                <NotificationBell token={token} onNavigate={handleNavigate} onToast={showToast} />
              </React.Suspense>
            )}

            {/* Animations Toggle */}
            <div className="flex bg-white/5 rounded-full p-1 border theme-border">
              <button onClick={() => setAnimationsEnabled(!animationsEnabled)} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${animationsEnabled ? 'text-accent hover:bg-white/10' : 'text-zinc-500 hover:bg-white/10'}`} title={animationsEnabled ? "Desativar Animações 3D" : "Ativar Animações 3D"}>
                <Wand2 className="w-4 h-4" />
              </button>
              <button onClick={() => setAuraRanksOpen(true)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" title="Ranks">🏆</button>
            </div>

            {/* DopaCoins Balance — só visível quando logado */}
            {user && (
            <button
              onClick={() => setPixDepositOpen(true)}
              className="group flex items-center gap-2 px-2 py-1.5 pl-4 rounded-full bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-white/10 transition-all cursor-pointer active:scale-95"
            >
              <div className="flex flex-col items-start mr-1">
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-accent mb-[2px]">DopaCoins</span>
                <span className="text-xs font-black text-white leading-none">{formatBalance(dopaBalance)}</span>
              </div>
              <DopaCoinIcon className="w-7 h-7 drop-shadow-sm" />
              <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg leading-none hover:bg-accent/80 transition-colors pb-[1px]">+</div>
            </button>
            )}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {[
              { id: "home", label: "Home" },
              { id: "dopagames", label: "DopaGames", icon: null },
              { id: "tracking", label: "Rastreio", icon: Map },
              { id: "cart", label: `Carrinho (${cart.length})`, icon: ShoppingBag },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={(e) => { if (window.triggerDopaParticles) window.triggerDopaParticles(e.clientX, e.clientY); setActiveTab(tab.id); }}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${activeTab === tab.id ? "bg-accent text-white" : "theme-text-secondary hover:theme-text"}`}>
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 mt-4">

        {/* ===== HOME ===== */}
        {activeTab === "home" && (
          <div className="space-y-5">
            <CategoryNav activeCategory={activeCategory} setActiveCategory={handleCategoryChange} />
            {activeCategory !== "all" && currentCat && (
              <div className="flex items-center gap-2 border-b theme-border pb-2">
                <span className="text-xl">{currentCat.emoji}</span>
                <h2 className="font-display font-bold text-lg theme-text">{currentCat.name}</h2>
                <span className="text-xs theme-muted">({filteredProducts.length} produtos)</span>
              </div>
            )}
            <div className="md:hidden flex items-center theme-surface border theme-border rounded-full px-4 py-2">
              <Search className="w-4 h-4 theme-muted mr-2" />
              <input type="text" placeholder="Pesquisar produtos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-xs w-full focus:outline-none theme-text" />
            </div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 border border-dashed theme-border rounded-2xl theme-surface"><p className="text-sm theme-muted">Nenhum produto encontrado.</p></div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4">
                {filteredProducts.map((p) => (
                  <div key={p.id} onClick={() => setProductDetailOpen(p)} className="cursor-pointer h-full">
                    <ProductCard product={p} onAddToCart={(prod) => handleAddToCart(prod)} onBuyNow={(prod) => handleBuyNow(prod)} onToggleFavorite={(id, e) => handleToggleFavorite(id, e)} isFavorited={favorites.includes(p.id)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== FAVORITOS ===== */}
        {activeTab === "favorites" && (
          <div className="space-y-5 py-4">
            <h2 className="font-display font-bold text-lg theme-text border-b theme-border pb-2 flex items-center gap-2"><Heart className="w-5 h-5 text-accent fill-accent" /> Meus Favoritos</h2>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 border border-dashed theme-border theme-surface rounded-2xl">
                <Heart className="w-12 h-12 theme-muted mx-auto mb-3" />
                <p className="text-sm font-semibold theme-text-secondary">Você ainda não tem favoritos!</p>
                <button onClick={() => setActiveTab("home")} className="mt-4 py-2 px-5 bg-accent text-white font-bold text-xs uppercase rounded-full cursor-pointer">Explorar Produtos</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4">
                {filteredProducts.map((p) => (
                  <div key={p.id} onClick={() => setProductDetailOpen(p)} className="cursor-pointer h-full">
                    <ProductCard product={p} onAddToCart={(prod) => handleAddToCart(prod)} onBuyNow={(prod) => handleBuyNow(prod)} onToggleFavorite={(id, e) => handleToggleFavorite(id, e)} isFavorited={favorites.includes(p.id)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== DOPAGAMES ===== */}
        {activeTab === "dopagames" && (
          <div className="max-w-4xl mx-auto py-6 px-2 md:px-4">
            <div className="mb-6 w-full overflow-hidden">
              <div className="flex justify-center w-full my-4">
                <div className="inline-flex items-center gap-1.5 p-1.5 bg-[#0b0c10]/90 backdrop-blur-xl border border-white/10 rounded-2xl">
                  {[
                    { id: "roulette", label: "Caixas CS", Icon: Box, activeClass: "bg-amber-950/20 border-amber-600/50 text-amber-500", iconClass: "text-amber-500" },
                    { id: "upgrade", label: "Upgrade", Icon: Zap, activeClass: "bg-blue-950/20 border-blue-600/50 text-blue-500", iconClass: "text-blue-500" },
                    { id: "crash", label: "Foguetinho", Icon: Rocket, activeClass: "bg-orange-950/20 border-orange-600/50 text-orange-400", iconClass: "text-orange-400" },
                    { id: "battle", label: "Batalha", Icon: Swords, activeClass: "bg-red-950/20 border-red-600/50 text-red-500", iconClass: "text-red-500" },
                  ].map(game => {
                    const isActive = activeGameTab === game.id;
                    const GameIcon = game.Icon;
                    return (
                      <button key={game.id} onClick={() => setActiveGameTab(game.id)}
                        className={`group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all duration-300 border text-xs md:text-sm font-bold tracking-wider uppercase whitespace-nowrap active:scale-95 ${isActive ? game.activeClass : 'bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                        <GameIcon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? game.iconClass : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                        <span>{game.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center">
              {activeGameTab === "crash" && (
                <div className="w-full max-w-3xl">
                  <CrashGame coinBalance={dopaBalance} onUpdateCoins={handleUpdateCoins} />
                </div>
              )}
              {activeGameTab === "roulette" && (
                <div className="w-full max-w-5xl overflow-hidden md:overflow-visible">
                  <DiscountRoulette
                    coinBalance={dopaBalance}
                    onUpdateCoins={(amount) => { handleUpdateCoins(amount); if (amount < 0) setTotalSpent(prev => prev + Math.abs(amount)); }}
                    onNavigateToUpgrade={(item) => { setUpgradePreselect(item); setActiveGameTab('upgrade'); }}
                    onToast={showToast}
                  />
                </div>
              )}
              {activeGameTab === "upgrade" && (
                <div className="w-full max-w-7xl overflow-hidden md:overflow-visible">
                  <ItemUpgrade preselectedItem={upgradePreselect} onClearPreselect={() => setUpgradePreselect(null)} onToast={showToast} />
                </div>
              )}
              {activeGameTab === "battle" && (
                <div className="w-full max-w-7xl overflow-hidden md:overflow-visible">
                  <React.Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>}>
                    {user ? <BattlePage onToast={showToast} token={token} userId={user?.id} /> : (
                      <div className="text-center py-20">
                        <Swords className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Batalha de Caixas</h2>
                        <p className="text-zinc-400 mb-6">Faça login para desafiar amigos e ganhar os itens deles!</p>
                        <button onClick={() => setShowAuthPage(true)} className="px-6 py-3 bg-accent hover:opacity-80 text-white rounded-full font-bold transition-opacity">Entrar</button>
                      </div>
                    )}
                  </React.Suspense>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "tracking" && <OrderTracking orders={orders} userName={userData?.name} onUpdateOrderCep={(idx, cep, country) => setOrders(prev => prev.map((o, i) => i === idx ? { ...o, cep, country } : o))} />}

        {/* ===== PROFILE ===== */}
        {activeTab === "profile" && (
          <React.Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>}>
            {user ? <ProfilePage userId={viewingProfileId || user.id} onNavigate={handleNavigate} token={token} /> : (
              <div className="text-center py-20">
                <User className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Crie sua conta</h2>
                <p className="text-zinc-400 mb-6">Faça login para acessar seu perfil, inventário e batalhas.</p>
                <button onClick={() => setShowAuthPage(true)} className="px-6 py-3 bg-accent hover:opacity-80 text-white rounded-full font-bold transition-opacity">Entrar / Cadastrar</button>
              </div>
            )}
          </React.Suspense>
        )}

        {/* ===== INVENTÁRIO ===== */}
        {activeTab === "inventory" && (
          <div className="py-4">
            <Inventory
              onUpdateCoins={handleUpdateCoins}
              onNavigateToUpgrade={(item) => { setUpgradePreselect(item); setActiveTab('dopagames'); setTimeout(() => setActiveGameTab('upgrade'), 100); }}
              onToast={showToast}
            />
          </div>
        )}

        {/* ===== RANKING ===== */}
        {activeTab === "ranking" && (
          <React.Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>}>
            <RankingPage token={token} userId={user?.id} />
          </React.Suspense>
        )}

        {/* ===== AMIGOS ===== */}
        {activeTab === "friends" && (
          <React.Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>}>
            {user ? <FriendsPanel onToast={showToast} token={token} onNavigate={handleNavigate} /> : (
              <div className="text-center py-20">
                <Users className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Adicione amigos</h2>
                <p className="text-zinc-400 mb-6">Faça login para adicionar amigos e batalhar.</p>
                <button onClick={() => setShowAuthPage(true)} className="px-6 py-3 bg-accent hover:opacity-80 text-white rounded-full font-bold transition-opacity">Entrar</button>
              </div>
            )}
          </React.Suspense>
        )}

        {/* ===== CARRINHO ===== */}
        {activeTab === "cart" && (
          <div className="max-w-2xl mx-auto py-4 space-y-4">
            <h2 className="font-display font-bold text-lg theme-text border-b theme-border pb-2 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-accent" /> Carrinho</h2>
            {cart.length === 0 ? (
              <div className="text-center py-16 border border-dashed theme-border theme-surface rounded-2xl">
                <ShoppingBag className="w-12 h-12 theme-muted mx-auto mb-3" />
                <p className="text-sm font-semibold theme-text-secondary">Carrinho vazio!</p>
                <button onClick={() => setActiveTab("home")} className="mt-4 py-2 px-5 bg-accent text-white font-bold text-xs uppercase rounded-full cursor-pointer">Ver Produtos</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  {cart.map((item, index) => (
                    <div key={index} className="theme-card border theme-border p-3 flex items-center justify-between gap-3 rounded-xl">
                      <img loading="lazy" decoding="async" src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border theme-border" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold theme-text truncate">{item.name}</h4>
                        <span className="text-[10px] theme-muted uppercase">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-display font-bold text-accent">{fmt(item.price)}</span>
                        <button onClick={(e) => handleRemoveFromCart(index, e)} className="theme-muted hover:text-danger p-1 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="theme-surface border theme-border p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between text-xs theme-text-secondary"><span>Subtotal:</span><span className="font-semibold theme-text">{fmt(subtotal)}</span></div>
                  <div className="border-t theme-border pt-3 flex justify-between items-center">
                    <div>
                      <div className="text-[10px] theme-muted uppercase font-bold">Total Estimado</div>
                      <div className="text-lg font-display font-extrabold text-accent">{fmt(subtotal)}</div>
                    </div>
                    <button onClick={() => setCheckoutOpen(true)} className="py-2.5 px-6 bg-accent hover:bg-accent-dark text-white font-display font-bold text-xs uppercase rounded-full cursor-pointer shadow-md">Ir para Checkout</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={(tab) => {
        if (['profile', 'ranking', 'battle', 'friends'].includes(tab) && !user) { setShowAuthPage(true); return; }
        if (window.triggerDopaParticles) window.triggerDopaParticles(window.innerWidth/2, window.innerHeight-30);
        handleNavigate(tab);
      }} cartCount={cart.length} onSearchClick={() => { handleNavigate("home"); setTimeout(() => document.querySelector("input[placeholder*='Pesquisar']")?.focus(), 100); }} />

      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} cart={cart} activeDiscount={activeDiscount} onClearCart={() => setCart([])} onOrderComplete={handleOrderComplete} userName={userData?.name} userCep={userData?.cep} />

      <AuraRanksModal isOpen={auraRanksOpen} onClose={() => setAuraRanksOpen(false)} totalSpent={totalSpent} activeTheme={activeTheme} onSelectTheme={setActiveTheme} />
      <WinPopup prize={winPrize} onClose={() => setWinPrize(null)} />
      <PixDepositModal isOpen={pixDepositOpen} onClose={() => setPixDepositOpen(false)} onDeposit={(amount) => handleUpdateCoins(amount)} animationsEnabled={animationsEnabled} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={productDetailOpen}
        onClose={() => setProductDetailOpen(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleFavorite={handleToggleFavorite}
        isFavorited={productDetailOpen ? favorites.includes(productDetailOpen.id) : false}
      />

      {/* Daily Case Modal */}
      <DailyCaseModal
        isOpen={dailyCaseOpen}
        onClose={() => setDailyCaseOpen(false)}
        token={token}
        onItemWon={(item) => { showToast({ title: '🎁 Item Ganho!', message: item.name, icon: item.icon }); }}
      />

      {/* Floating Buttons Group */}
      {activeTab === "home" && (
        <div className="fixed bottom-24 md:bottom-8 right-4 z-40 flex flex-col items-end gap-3">
          {/* Caixa Diária - botão menor */}
          <button
            onClick={() => { if (!user) { showToast({ title: '🔐 Login necessário', message: 'Faça login para abrir caixas grátis!' }); setShowAuthPage(true); return; } setDailyCaseOpen(true); }}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--t-surface)]/90 backdrop-blur-md border border-[var(--t-border)] hover:border-accent hover:bg-accent/10 transition-all text-xs font-bold theme-text hover:text-accent shadow-md cursor-pointer"
            title="Caixa Diária"
          >
            <span className="text-sm group-hover:scale-110 transition-transform">🎁</span>
            <span className="hidden sm:block">Presente Diário</span>
          </button>

          {/* Botão FREE da Roleta (Principal) */}
          <button
            onClick={() => { if (!user) { setShowAuthPage(true); return; } setDailyCaseOpen(true); }}
            className="group cursor-pointer hover:scale-105 transition-transform"
            title="Caixa Diária Grátis (Roleta)"
          >
            <div className="relative w-14 h-14 md:w-16 md:h-16 bg-[#0a0a0a] rounded-full flex items-center justify-center border-2 border-accent/30 overflow-hidden shadow-lg">
              <div className="absolute inset-1 rounded-full border-2 border-dashed border-accent/40" style={{ animation: 'spin 12s linear infinite reverse' }}></div>
              <span className="text-2xl relative z-10">🎰</span>
              <div className="absolute bottom-1 bg-accent text-white text-[8px] md:text-[9px] font-black px-1.5 py-0.5 rounded-sm z-20 shadow-sm">FREE</div>
            </div>
          </button>
        </div>
      )}

      {/* Age Gate Modal */}
      {ageGateOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="theme-surface border border-danger/50 p-6 rounded-3xl max-w-sm w-full text-center space-y-5">
            <div className="w-16 h-16 bg-danger/20 rounded-full flex items-center justify-center mx-auto text-danger">
              <span className="text-3xl font-bold font-display">18+</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display font-extrabold text-danger uppercase">Acesso Restrito</h3>
              <p className="text-xs theme-text-secondary">O Mercado Ilícito contém produtos pesados. Você é maior de 18 anos?</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setAgeGateOpen(false)} className="flex-1 py-2.5 rounded-full border border-danger/30 text-danger text-xs font-bold hover:bg-danger/10 transition-colors">Não, sou menor</button>
              <button onClick={() => { setIsAgeVerified(true); setAgeGateOpen(false); setActiveCategory("ilicitos"); }} className="flex-1 py-2.5 rounded-full bg-danger text-white text-xs font-bold hover:bg-red-600 transition-colors">Sim, quero entrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </MotionConfig>
  );
}
