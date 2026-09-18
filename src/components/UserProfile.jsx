import React, { useState } from"react";
import { User, MapPin, Save, CheckCircle } from"lucide-react";

export default function UserProfile({ user, onSave }) {
 const [name, setName] = useState(user?.name ||"");
 const [address, setAddress] = useState(user?.address ||"");
 const [cep, setCep] = useState(user?.cep ||"");
 const [saved, setSaved] = useState(false);

 const handleSave = (e) => {
 e.preventDefault();
 if (window.triggerDopaParticles) window.triggerDopaParticles(e.clientX, e.clientY);
 onSave({ name, address, cep });
 setSaved(true);
 setTimeout(() => setSaved(false), 2500);
 };

 return (
 <div className="max-w-md mx-auto py-8 space-y-6">
 <div className="text-center space-y-2">
 <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
 <User className="w-8 h-8 text-accent"/>
 </div>
 <h2 className="font-display font-extrabold text-xl theme-text">
 {user?.name ?`Olá, ${user.name}! 👋`:"Quem é você? 👀"}
 </h2>
 <p className="text-xs theme-text-secondary">
 Coloque seu nome e endereço para uma experiência mais personalizada!
 </p>
 </div>

 <form onSubmit={handleSave} className="theme-card border theme-border rounded-2xl p-5 space-y-4">
 <div className="space-y-1.5">
 <label className="text-[10px] font-bold theme-muted uppercase tracking-wider flex items-center gap-1">
 <User className="w-3 h-3"/> Seu Nome
 </label>
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="Como quer ser chamado(a)?"
 className="w-full theme-surface border theme-border text-sm rounded-xl p-3 theme-text"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-[10px] font-bold theme-muted uppercase tracking-wider flex items-center gap-1">
 <MapPin className="w-3 h-3"/> CEP
 </label>
 <input
 type="text"
 value={cep}
 onChange={(e) => setCep(e.target.value)}
 placeholder="00000-000"
 className="w-full theme-surface border theme-border text-sm rounded-xl p-3 theme-text"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-[10px] font-bold theme-muted uppercase tracking-wider flex items-center gap-1">
 <MapPin className="w-3 h-3"/> Endereço Fictício
 </label>
 <input
 type="text"
 value={address}
 onChange={(e) => setAddress(e.target.value)}
 placeholder="Rua da Dopamina, 42 — Cidade Feliz"
 className="w-full theme-surface border theme-border text-sm rounded-xl p-3 theme-text"
 />
 </div>

 <button
 type="submit"
 className="w-full py-3 bg-accent hover:bg-accent-dark text-white font-display font-bold text-sm rounded-xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
 >
 {saved ? <><CheckCircle className="w-4 h-4"/> Salvo com sucesso!</> : <><Save className="w-4 h-4"/> Salvar Perfil</>}
 </button>
 </form>

 {/* Referral System */}
 <div className="theme-card border border-emerald-500/30 rounded-2xl p-5 space-y-4 relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-transparent">
 <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full"></div>
 <div className="relative z-10">
 <h3 className="font-display font-black text-emerald-500 text-lg flex items-center gap-2">
 🚀 Indique e Ganhe!
 </h3>
 <p className="text-sm theme-text mt-1">
 Convide amigos e ambos ganham <strong>500 Dopas</strong> quando eles se cadastrarem!
 </p>
 
 <div className="mt-4 flex flex-col gap-2">
 <label className="text-[10px] font-bold theme-muted uppercase tracking-wider">Seu Link Exclusivo</label>
 <div className="flex gap-2">
 <input 
 type="text"
 readOnly 
 value={`https://dopashop.com/?ref=${user?.id || 'demo_user'}`} 
 className="flex-1 theme-surface border border-emerald-500/30 text-xs rounded-xl p-3 text-emerald-500 font-bold"
 />
 <button 
 onClick={() => {
 navigator.clipboard.writeText(`https://dopashop.com/?ref=${user?.id || 'demo_user'}`);
 alert('Link copiado! Mande para seus amigos!');
 }}
 className="bg-emerald-500 text-white px-4 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-600 active:scale-95 transition-all"
 >
 Copiar
 </button>
 </div>
 </div>
 </div>
 </div>

 <p className="text-[10px] theme-muted text-center">
 Seus dados ficam salvos apenas no seu navegador. Privacidade 100% garantida (de verdade dessa vez).
 </p>
 </div>
 );
}
