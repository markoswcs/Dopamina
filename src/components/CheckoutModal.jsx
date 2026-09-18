import React, { useState, useEffect } from"react";
import { X, ShieldCheck, Truck, CreditCard, Sparkles, CheckCircle, Tag, Loader2 } from"lucide-react";
import { coupons } from"../productsData";

const FUNNY_NAMES = [
 { name:"Juvenal da Silva Sauro", email:"juvenal.sauro@hotmail.com", cpf:"123.456.789-00", address:"Rua dos Bobos, 0 — Neverland, SP"},
 { name:"Creusa Beiçola Fernandes", email:"creusa.fernandes@yahoo.com", cpf:"987.654.321-00", address:"Av. da Confusão, 42 — Bagunçópolis, RJ"},
 { name:"Aparecido Gosmento Jr.", email:"aparecido.jr@bol.com.br", cpf:"111.222.333-44", address:"Trav. do Nunca, 99 — Lugar Nenhum, MG"},
 { name:"Dolores Fuertes de Barriga", email:"dolores.barriga@gmail.com", cpf:"555.666.777-88", address:"Rua do Sumiço, 13 — Sumidouro, BA"},
 { name:"Cleiton Rasta do Grau", email:"cleiton.grau@outlook.com", cpf:"000.111.222-33", address:"Beco do Batman, 420 — Gotham, PR"},
 { name:"Wandercleia Maravilhosa", email:"wander.maravilha@terra.com", cpf:"444.555.666-77", address:"Praça da Alegria, 7 — Felicidade, CE"},
 { name:"Aristóbulo Tucano Neto", email:"aristobulo@zipmail.com", cpf:"222.333.444-55", address:"Alameda dos Anjos, 1000 — Céuzinho, GO"},
 { name:"Gislaine Turbinada Santos", email:"gis.turbo@ig.com.br", cpf:"333.444.555-66", address:"Rua do Caos, 666 — Infernópolis, RS"},
 { name:"Deoclécio Agiota da Paz", email:"deoclecio.paz@uol.com", cpf:"777.888.999-00", address:"Viela Sem Saída, 404 — Not Found, AM"},
 { name:"Rosicleide Faísca Lima", email:"rosi.faisca@gmail.com", cpf:"888.999.000-11", address:"Rua 100% Fictícia, 2025 — Dopaminópolis, DF"},
];

export default function CheckoutModal({ isOpen, onClose, cart, activeDiscount, onClearCart, onOrderComplete, userName, userCep }) {
 const [formData, setFormData] = useState({ name:"", email:"", cpf:"", zipCode:"", address:"", cardNumber:"", cardExpiry:"", cardCvv:""});
 const [manualCoupon, setManualCoupon] = useState("");
 const [appliedCoupons, setAppliedCoupons] = useState([]);
 const [couponError, setCouponError] = useState("");
 const [step, setStep] = useState("form");

 useEffect(() => {
 if (activeDiscount && !appliedCoupons.find(c => c.code === activeDiscount.code)) {
 setAppliedCoupons(prev => [...prev, activeDiscount]);
 }
 }, [activeDiscount]);

 if (!isOpen) return null;

 const handleAutoFill = (e) => {
 e.preventDefault();
 if (window.triggerDopaParticles) window.triggerDopaParticles(e.clientX, e.clientY);
 const rnd = FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)];
 setFormData({
 name: rnd.name, email: rnd.email, cpf: rnd.cpf,
 zipCode:"72100-000", address: rnd.address,
 cardNumber:"4002 8922"+ Math.floor(1000 + Math.random() * 9000) +""+ Math.floor(1000 + Math.random() * 9000),
 cardExpiry:"12/32", cardCvv: String(Math.floor(100 + Math.random() * 900))
 });
 };

 const handleInput = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

 const handleApplyCoupon = (e) => {
 e.preventDefault();
 const code = manualCoupon.trim().toUpperCase();
 if (appliedCoupons.find(c => c.code === code)) { setCouponError("Cupom já aplicado!"); return; }
 const found = coupons.find(c => c.code === code);
 if (found) {
 setAppliedCoupons(prev => [...prev, found]);
 setCouponError(""); setManualCoupon("");
 if (window.triggerDopaParticles) window.triggerDopaParticles(e.clientX, e.clientY);
 } else {
 setCouponError("Cupom inválido!");
 }
 };

 const removeCoupon = (code) => setAppliedCoupons(prev => prev.filter(c => c.code !== code));

 const subtotal = cart.reduce((a, i) => a + i.price, 0);
 let totalDiscount = 0;
 appliedCoupons.forEach(c => {
 if (c.type ==="fixed") totalDiscount += c.discount;
 else if (c.type ==="percent") totalDiscount += subtotal * c.discount;
 });
 const shipping = subtotal > 1500 ? 0 : 49.90;
 const total = Math.max(0, subtotal - totalDiscount + shipping);
 const fmt = (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +"Dopas";

 const handleSubmit = (e) => {
 e.preventDefault();
 setStep("loading");
 setTimeout(() => {
 setStep("success");
 if (onOrderComplete) onOrderComplete({ items: [...cart], total: fmt(total), rawTotal: total, cep: formData.zipCode, timestamp: Date.now() });
 }, 2000);
 };

 const handleFinish = () => { onClearCart(); setStep("form"); setAppliedCoupons([]); onClose(); };

 return (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="theme-card border theme-border w-full max-w-lg rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
 <div className="flex justify-between items-center p-4 border-b theme-border theme-surface">
 <div className="flex items-center gap-2">
 <ShieldCheck className="text-accent w-5 h-5"/>
 <h2 className="font-display font-bold text-sm theme-text">
 {step ==="success"?"Compra Concluída! 🎉": step ==="loading"?"Processando...":"Checkout"}
 </h2>
 </div>
 <button onClick={onClose} className="theme-muted hover:theme-text cursor-pointer"><X className="w-5 h-5"/></button>
 </div>

 {step ==="form"&& (
 <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
 <div className="bg-accent/5 border border-accent/20 p-3 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
 <div className="text-xs font-bold text-accent flex items-center gap-1"><Sparkles className="w-3.5 h-3.5"/> Preencher com dados aleatórios</div>
 <button onClick={handleAutoFill} className="py-1.5 px-4 bg-accent hover:bg-accent-dark text-white font-bold text-[10px] uppercase rounded-full transition-all active:scale-95 cursor-pointer">Auto Preencher</button>
 </div>

 <div className="border theme-border p-3 rounded-xl theme-surface space-y-1.5">
 <div className="text-[10px] font-bold theme-muted uppercase">Produtos ({cart.length})</div>
 {cart.map((item, i) => (<div key={i} className="flex justify-between text-xs"><span className="theme-text truncate max-w-[260px]">{item.name}</span><span className="font-bold text-accent">{fmt(item.price)}</span></div>))}
 </div>

 <div className="space-y-2">
 <h3 className="text-xs font-bold uppercase theme-muted flex items-center gap-1 border-b theme-border pb-1"><Tag className="w-3.5 h-3.5 text-accent"/> Cupons</h3>
 <div className="flex gap-2">
 <input type="text"value={manualCoupon} onChange={(e) => setManualCoupon(e.target.value)} placeholder="Digite um cupom"className="flex-1 theme-surface border theme-border text-xs rounded-lg p-2.5"/>
 <button onClick={handleApplyCoupon} className="py-2 px-4 bg-accent text-white font-bold text-[10px] uppercase rounded-lg cursor-pointer">Aplicar</button>
 </div>
 {couponError && <p className="text-[10px] text-danger">{couponError}</p>}
 {appliedCoupons.length > 0 && (
 <div className="flex flex-wrap gap-1.5 mt-1">
 {appliedCoupons.map((c, i) => (
 <span key={i} className="inline-flex items-center gap-1 py-1 px-2.5 bg-success/10 border border-success/30 rounded-full text-[10px] font-bold text-success">
 ✓ {c.code} — {c.label}
 <button onClick={() => removeCoupon(c.code)} className="hover:text-danger cursor-pointer ml-0.5">×</button>
 </span>
 ))}
 </div>
 )}
 </div>

 <div className="space-y-3">
 <h3 className="text-xs font-bold uppercase theme-muted flex items-center gap-1 border-b theme-border pb-1"><Truck className="w-3.5 h-3.5 text-accent"/> Entrega</h3>
 <div className="grid grid-cols-2 gap-3">
 <input required name="name"value={formData.name} onChange={handleInput} placeholder="Nome"className="theme-surface border theme-border text-xs rounded-lg p-2.5"/>
 <input required name="email"value={formData.email} onChange={handleInput} placeholder="E-mail"className="theme-surface border theme-border text-xs rounded-lg p-2.5"/>
 <input required name="cpf"value={formData.cpf} onChange={handleInput} placeholder="CPF"className="theme-surface border theme-border text-xs rounded-lg p-2.5"/>
 <input required name="zipCode"value={formData.zipCode} onChange={handleInput} placeholder="CEP"className="theme-surface border theme-border text-xs rounded-lg p-2.5"/>
 </div>
 <input required name="address"value={formData.address} onChange={handleInput} placeholder="Endereço"className="w-full theme-surface border theme-border text-xs rounded-lg p-2.5"/>
 </div>

 <div className="space-y-3">
 <h3 className="text-xs font-bold uppercase theme-muted flex items-center gap-1 border-b theme-border pb-1"><CreditCard className="w-3.5 h-3.5 text-accent"/> Cartão</h3>
 <div className="grid grid-cols-3 gap-3">
 <input required name="cardNumber"value={formData.cardNumber} onChange={handleInput} placeholder="Número"className="col-span-2 theme-surface border theme-border text-xs rounded-lg p-2.5"/>
 <div className="grid grid-cols-2 gap-2">
 <input required name="cardExpiry"value={formData.cardExpiry} onChange={handleInput} placeholder="Val"className="theme-surface border theme-border text-xs rounded-lg p-2.5"/>
 <input required name="cardCvv"value={formData.cardCvv} onChange={handleInput} placeholder="CVV"className="theme-surface border theme-border text-xs rounded-lg p-2.5"/>
 </div>
 </div>
 </div>

 <div className="border-t theme-border pt-4 space-y-1.5">
 <div className="flex justify-between text-xs theme-text-secondary"><span>Subtotal:</span><span>{fmt(subtotal)}</span></div>
 {totalDiscount > 0 && <div className="flex justify-between text-xs text-success font-bold"><span>Descontos ({appliedCoupons.length} cupom{appliedCoupons.length > 1 ?"s":""}):</span><span>-{fmt(totalDiscount)}</span></div>}
 <div className="flex justify-between text-xs theme-text-secondary"><span>Frete:</span><span>{shipping === 0 ?"GRÁTIS 🎉": fmt(shipping)}</span></div>
 <div className="flex justify-between text-base font-display font-extrabold text-accent border-t theme-border/40 pt-2"><span>Total:</span><span>{fmt(total)}</span></div>
 <button type="submit"className="w-full mt-3 py-3 bg-accent hover:bg-accent-dark text-white font-display font-bold text-xs uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 animate-glow">
 <Sparkles className="w-4 h-4"/> Finalizar Compra
 </button>
 </div>
 </form>
 )}

 {step ==="loading"&& (
 <div className="p-12 flex flex-col items-center text-center space-y-5">
 <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
 <Loader2 className="w-10 h-10 text-accent animate-spin"/>
 </div>
 <p className="font-display font-bold text-sm theme-text">Processando sua compra...</p>
 <div className="w-48 h-1.5 rounded-full theme-surface border theme-border overflow-hidden">
 <div className="h-full bg-gradient-to-r from-accent to-warning rounded-full animate-loading-bar"/>
 </div>
 <p className="text-[10px] theme-muted">Liberando dopamina pura ⚡</p>
 </div>
 )}

 {step ==="success"&& (
 <div className="p-8 flex flex-col items-center text-center space-y-5 animate-fade-in-up">
 <div className="w-16 h-16 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center animate-bounce">
 <CheckCircle className="w-10 h-10 text-accent"/>
 </div>
 <div>
 <h3 className="font-display font-extrabold text-xl text-accent">COMPRA CONCLUÍDA! 🧠⚡</h3>
 <p className="text-xs theme-text-secondary mt-2 max-w-sm">Acompanhe o rastreio na aba"Rastreio".</p>
 </div>
 <div className="w-full theme-surface border theme-border p-4 rounded-xl text-left text-xs space-y-2">
 <div className="theme-muted font-bold border-b theme-border/60 pb-1.5 uppercase tracking-wide">Recibo</div>
 <div className="flex justify-between"><span className="theme-muted">Para:</span><span className="theme-text">{formData.name}</span></div>
 <div className="flex justify-between"><span className="theme-muted">Total:</span><span className="text-accent font-bold">{fmt(total)}</span></div>
 <div className="flex justify-between"><span className="theme-muted">Cupons:</span><span className="text-success font-bold">{appliedCoupons.length > 0 ? appliedCoupons.map(c=>c.code).join(",") :"Nenhum"}</span></div>
 <div className="flex justify-between"><span className="theme-muted">Status:</span><span className="text-success font-bold">Aprovado ✓</span></div>
 </div>
 <button onClick={handleFinish} className="py-2.5 px-6 bg-accent hover:bg-accent-dark text-white font-display font-bold text-xs uppercase rounded-full transition-all active:scale-95 cursor-pointer">Comprar Novamente</button>
 </div>
 )}
 </div>
 </div>
 );
}
