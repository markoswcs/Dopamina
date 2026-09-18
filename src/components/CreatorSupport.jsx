import React, { useState } from"react";
import { Heart, ExternalLink, Copy, Check } from"lucide-react";

const PIX_KEY ="00020126580014BR.GOV.BCB.PIX01369440a74b-ccce-48c6-affb-ae1a73a235d95204000053039865802BR5925Markos Winycius Cavalcant6009SAO PAULO62140510ot0ZXDayTk6304E777";
const NUBANK_LINK ="https://nubank.com.br/cobrar/a4yan/6a3d806b-b6d4-47c7-8fec-19195e30b4cb";
const INSTAGRAM ="https://www.instagram.com/markoswcs/?hl=pt-br";

export default function CreatorSupport() {
 const [copied, setCopied] = useState(false);

 const copyPix = () => {
 navigator.clipboard.writeText(PIX_KEY);
 setCopied(true);
 setTimeout(() => setCopied(false), 2500);
 };

 return (
 <div className="max-w-lg mx-auto py-8 space-y-6">
 <div className="text-center space-y-3">
 <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
 <Heart className="w-8 h-8 text-accent"/>
 </div>
 <h2 className="font-display font-extrabold text-xl theme-text">Apoie o Criador ❤️</h2>
 <p className="text-sm theme-text-secondary max-w-md mx-auto leading-relaxed">
 Esse site foi desenvolvido com muito carinho para <strong>satisfazer as pessoas</strong> e trazer momentos de pura dopamina!
 Se você curtiu a experiência e quiser ajudar o criador, contribua com qualquer quantia pelo Pix. 
 Na mensagem do Pix você também pode <strong>sugerir melhorias e novas ideias</strong>! 🚀
 </p>
 </div>

 {/* QR Code */}
 <div className="theme-card border theme-border rounded-2xl p-6 text-center space-y-4">
 <h3 className="font-display font-bold text-sm theme-text">Escaneie o QR Code para contribuir</h3>
 <div className="bg-white p-4 rounded-xl inline-block mx-auto">
 <img loading="lazy"decoding="async"src="/qr_code_do_pix.webp"alt="QR Code Pix"className="w-48 h-48 object-contain"/>
 </div>
 <div>
 <p className="text-xs theme-muted mb-1">Chave Pix — Markos Winycius</p>
 <div className="flex items-center gap-2 justify-center">
 <code className="text-[9px] theme-text-secondary theme-surface border theme-border px-2 py-1 rounded-lg max-w-[240px] truncate block">
 {PIX_KEY.slice(0, 50)}...
 </code>
 <button onClick={copyPix} className="p-1.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-all active:scale-95 cursor-pointer">
 {copied ? <Check className="w-3.5 h-3.5"/> : <Copy className="w-3.5 h-3.5"/>}
 </button>
 </div>
 {copied && <p className="text-[10px] text-success mt-1 font-semibold">Chave Pix copiada! ✓</p>}
 </div>
 </div>

 {/* Nubank Link */}
 <a href={NUBANK_LINK} target="_blank"rel="noopener noreferrer"
 className="flex items-center justify-between theme-card border theme-border rounded-2xl p-4 hover:border-accent/50 transition-all group">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-[#8B10AE]/10 flex items-center justify-center">
 <span className="text-lg">💜</span>
 </div>
 <div>
 <h4 className="font-display font-bold text-sm theme-text group-hover:text-accent transition-colors">Pagar pelo Nubank</h4>
 <p className="text-[10px] theme-muted">Transferir 0,00 Dopas ou qualquer valor</p>
 </div>
 </div>
 <ExternalLink className="w-4 h-4 theme-muted group-hover:text-accent"/>
 </a>

 {/* Instagram */}
 <a href={INSTAGRAM} target="_blank"rel="noopener noreferrer"
 className="flex items-center justify-between theme-card border theme-border rounded-2xl p-4 hover:border-accent/50 transition-all group">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center">
 <svg xmlns="http://www.w3.org/2000/svg"width="20"height="20"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round"className="text-white"><rect width="20"height="20"x="2"y="2"rx="5"ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5"x2="17.51"y1="6.5"y2="6.5"/></svg>
 </div>
 <div>
 <h4 className="font-display font-bold text-sm theme-text group-hover:text-accent transition-colors">@markoswcs</h4>
 <p className="text-[10px] theme-muted">Siga no Instagram!</p>
 </div>
 </div>
 <ExternalLink className="w-4 h-4 theme-muted group-hover:text-accent"/>
 </a>

 <p className="text-[10px] theme-muted text-center italic">
"Feito com ❤️ e muita dopamina por Markos Winycius"
 </p>
 </div>
 );
}
