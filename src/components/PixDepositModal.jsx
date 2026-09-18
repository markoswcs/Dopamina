import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Zap, Sparkles, CheckCircle2, Loader2, Copy, ArrowLeft, Clock, Check, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import DopaCoin3D from './DopaCoin3D';
import TermsModal from './TermsModal';

const PACKAGES = [
 { id: 1, coins: 500, price: 5.00, bonus: null, color: 'from-zinc-500 to-zinc-700' },
 { id: 2, coins: 1200, price: 10.00, bonus: '20% BÔNUS', color: 'from-blue-500 to-blue-600', popular: true },
 { id: 3, coins: 3000, price: 20.00, bonus: '50% BÔNUS', color: 'from-purple-500 to-purple-600' },
 { id: 4, coins: 10000, price: 50.00, bonus: 'O DOBRO!', color: 'from-amber-500 to-orange-600', max: true },
 { id: 5, coins: 25000, price: 100.00, bonus: '150% BÔNUS', color: 'from-emerald-500 to-teal-600' },
 { id: 6, coins: 75000, price: 250.00, bonus: '200% BÔNUS', color: 'from-pink-500 to-rose-600', vip: true },
];

const DopaCoinIcon = ({ className ="w-6 h-6"}) => (
 <svg viewBox="0 0 100 100"className={className}>
 <defs>
 <linearGradient id="storeDopaGradModal"x1="0%"y1="0%"x2="0%"y2="100%">
 <stop offset="0%"stopColor="#ffb03a"/>
 <stop offset="100%"stopColor="#ff6f00"/>
 </linearGradient>
 <filter id="storeDopaShadowModal"x="-20%"y="-20%"width="140%"height="140%">
 <feDropShadow dx="0"dy="2"stdDeviation="1.5"floodOpacity="0.3"/>
 </filter>
 </defs>
 <circle cx="50"cy="50"r="46"fill="url(#storeDopaGradModal)"stroke="#e65c00"strokeWidth="4"/>
 <circle cx="50"cy="50"r="38"fill="none"stroke="#d45100"strokeWidth="1.5"opacity="0.6"/>
 <path d="M 36 32 L 58 32 C 80 32 80 68 58 68 L 39 68 L 45 52 L 36 52 Z M 47 42 L 57 42 C 70 42 70 58 57 58 L 52 58 L 55 52 L 47 52 Z"fill="#fff5e6"fillRule="evenodd"filter="url(#storeDopaShadowModal)"/>
 </svg>
);

const PixDepositModal = ({ isOpen, onClose, onDeposit, animationsEnabled = true }) => {
 const [step, setStep] = useState('select'); // select | qr | success
 const [selectedPackage, setSelectedPackage] = useState(null);
 const [pixPayload, setPixPayload] = useState('');
 const [qrImage, setQrImage] = useState(null);
 const [paymentId, setPaymentId] = useState(null);
 const [copied, setCopied] = useState(false);
 const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer
 const [isProcessing, setIsProcessing] = useState(false);
 const [termsAccepted, setTermsAccepted] = useState(false);
 const [showTerms, setShowTerms] = useState(false);

 useEffect(() => {
 if (isOpen) {
 setStep('select');
 setSelectedPackage(null);
 setCopied(false);
 setTimeLeft(600);
 setIsProcessing(false);
 setPaymentId(null);
 setQrImage(null);
 setTermsAccepted(false);
 setShowTerms(false);
 }
 }, [isOpen]);

 // Countdown timer for PIX payment screen
 useEffect(() => {
 let timer;
 if (step === 'qr' && timeLeft > 0) {
 timer = setInterval(() => {
 setTimeLeft(prev => prev - 1);
 }, 1000);
 }
 return () => clearInterval(timer);
 }, [step, timeLeft]);

 // Auto-polling for payment status
 useEffect(() => {
 let pollInterval;
 if (step === 'qr' && paymentId) {
 pollInterval = setInterval(async () => {
 try {
 const res = await fetch(`http://localhost:3001/api/pix/status/${paymentId}`);
 const data = await res.json();
 if (data.status === 'approved') {
 handlePaymentSuccess();
 }
 } catch (e) {
 console.error("Polling error:", e);
 }
 }, 5000); // Check every 5 seconds
 }
 return () => clearInterval(pollInterval);
 }, [step, paymentId]);

 const handleSelect = async (pkg) => {
 if (!termsAccepted) {
 alert("⚠️ Você precisa aceitar os Termos de Uso e Política de Entretenimento antes de prosseguir com o depósito.");
 return;
 }

 setSelectedPackage(pkg);
 setStep('qr');
 setTimeLeft(600);
 setIsProcessing(true); // show loading state while fetching QR

 try {
 const res = await fetch('http://localhost:3001/api/pix', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 amount: pkg.price,
 description:`Pacote de ${pkg.coins} DopaCoins`
 })
 });
 const data = await res.json();

 if (data.payment_id) {
 setPaymentId(data.payment_id);
 setPixPayload(data.qr_code);
 setQrImage(`data:image/png;base64,${data.qr_code_base64}`);
 } else {
 console.warn("Erro real do MercadoPago:", data);
 alert('Erro ao gerar PIX real no MercadoPago (verifique seu token no .env do servidor). Entrando em MODO TESTE (Aprovação automática em 5s).');
 
 setPaymentId(`mock_${Date.now()}`);
 setPixPayload('00020101021126580014br.gov.bcb.pix0136mock-test520400005303986540510.005802BR5913Teste6008SP62070503***63041D3D');
 setQrImage('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg');
 
 // Auto-aprovação para Modo Teste
 setTimeout(() => {
 handlePaymentSuccess();
 }, 5000);
 }
 } catch (e) {
 console.error(e);
 alert('Erro de conexão com o servidor de pagamentos.');
 setStep('select');
 } finally {
 setIsProcessing(false);
 }
 };

 const copyPixCode = () => {
 if (navigator.clipboard && pixPayload) {
 navigator.clipboard.writeText(pixPayload);
 setCopied(true);
 setTimeout(() => setCopied(false), 3000);
 }
 };

 const handlePaymentSuccess = () => {
 setStep('success');

 try {
 confetti({
 particleCount: 120,
 spread: 80,
 origin: { y: 0.6 }
 });
 } catch (e) { }

 setTimeout(() => {
 onDeposit(selectedPackage.coins);
 onClose();
 }, 2500);
 };

 if (!isOpen) return null;

 const minutes = Math.floor(timeLeft / 60);
 const seconds = timeLeft % 60;
 const formattedTime =`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

 return (
 <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
 {/* Backdrop */}
 <div
 className="fixed inset-0 bg-black/85 backdrop-blur-md animate-fade-in"
 onClick={step === 'select' ? onClose : undefined}
 />

 {/* STEP 1: PACKAGE SELECTOR (Dark Theme inspired by Image 1 + 3D Coin Showcase) */}
 {step === 'select' && (
 <div className="relative w-full max-w-5xl bg-[#111318] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden animate-scale-up z-10 flex flex-col md:flex-row my-auto">

 {/* Left Side: 3D Coin Showcase Banner */}
 <div className="w-full md:w-1/3 bg-gradient-to-br from-amber-500/15 via-[#0d0e12] to-black p-6 md:p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"/>

 {/* 3D Interactive Coin */}
 <div className="w-full h-48 md:h-56 mb-4 relative z-10 flex items-center justify-center">
 {animationsEnabled ? (
 <DopaCoin3D active={true} />
 ) : (
 <DopaCoinIcon className="w-28 h-28 drop-shadow-[0_0_30px_rgba(245,158,11,0.4)] animate-[float_3s_ease-in-out_infinite]"/>
 )}
 </div>

 <h2 className="text-2xl md:text-3xl font-black text-white font-display uppercase tracking-tight leading-none mb-2 z-10">
 Loja de<br /><span className="text-amber-400">DopaCoins</span>
 </h2>
 <p className="text-zinc-400 text-xs font-medium mt-1 z-10 max-w-xs">
 Adicione moedas para abrir mais caixas exclusivas e dominar os upgrades!
 </p>

 <div className="mt-5 flex flex-col gap-2 items-center z-10">
 <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-300 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
 <ShieldCheck className="w-4 h-4 text-emerald-400"/> Transação 100% Segura
 </div>
 <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
 <Zap className="w-3.5 h-3.5 text-emerald-400"/> Pagamento Instantâneo via PIX
 </div>
 </div>
 </div>

 {/* Right Side: Package Grid */}
 <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-between relative">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h3 className="text-xl font-black text-white uppercase tracking-tight font-display">Escolha um Pacote</h3>
 <p className="text-xs text-zinc-400 font-medium">Selecione o plano desejado para pagamento instantâneo via PIX</p>
 </div>
 <button
 onClick={onClose}
 className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
 >
 <X className="w-5 h-5"/>
 </button>
 </div>

 {/* Package Grid (6 Packages matching Image 1) */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[60vh] md:max-h-[65vh] overflow-y-auto no-scrollbar pr-1">
 {PACKAGES.map((pkg) => (
 <div
 key={pkg.id}
 onClick={() => handleSelect(pkg)}
 className={`relative group bg-[#16181f] border rounded-3xl p-6 flex flex-col items-center justify-between transition-all duration-300 cursor-pointer overflow-hidden hover:scale-[1.02] active:scale-[0.98] ${pkg.popular
 ? 'border-orange-500/60 shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:border-orange-400'
 : pkg.vip
 ? 'border-pink-500/60 shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:border-pink-400'
 : 'border-white/10 hover:border-white/30 hover:bg-[#1c1e27]'
 }`}
 >
 {/* Top Banner (MAIS POPULAR) */}
 {pkg.popular && (
 <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest py-1 text-center">
 MAIS POPULAR
 </div>
 )}
 {pkg.vip && (
 <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest py-1 text-center">
 PACOTE VIP
 </div>
 )}

 {/* Diagonal Bonus Ribbon */}
 {pkg.bonus && (
 <div className={`absolute top-4 -right-10 rotate-45 bg-gradient-to-r ${pkg.color} text-white text-[9px] font-black uppercase tracking-wider py-1 px-10 border-b border-white/20 z-20 pointer-events-none`}>
 {pkg.bonus}
 </div>
 )}

 {/* Coin Icon */}
 <div className={`relative mt-4 mb-2 flex items-center justify-center ${pkg.popular ? 'pt-2' : ''}`}>
 <DopaCoinIcon className="w-16 h-16 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300"/>
 {pkg.max && (
 <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce"/>
 )}
 </div>

 {/* Amount */}
 <div className="flex flex-col items-center text-center my-2">
 <span className="text-3xl font-black text-white tracking-tight leading-none font-display">
 {pkg.coins.toLocaleString('pt-BR')}
 </span>
 <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
 Dopacoins
 </span>
 </div>

 {/* Price Button Box */}
 <div className="w-full mt-4 py-3 bg-[#0c0e12] rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-white group-hover:text-black transition-all duration-300">
 <span className="font-black text-base tracking-tight">
 R$ {pkg.price.toFixed(2).replace('.', ',')}
 </span>
 </div>
 </div>
 ))}
 </div>
 
 {/* Terms Checkbox */}
 <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-start gap-3">
 <input 
 type="checkbox"
 id="terms"
 checked={termsAccepted}
 onChange={(e) => setTermsAccepted(e.target.checked)}
 className="mt-1 w-5 h-5 rounded border-orange-500/50 bg-black/50 text-orange-500 focus:ring-orange-500 focus:ring-offset-zinc-900 cursor-pointer"
 />
 <label htmlFor="terms"className="text-sm font-medium text-zinc-300 leading-snug cursor-pointer">
 Declaro que li e aceito os <button onClick={(e) => { e.preventDefault(); setShowTerms(true); }} className="text-orange-500 font-bold hover:underline">Termos de Uso</button>, reconhecendo que este depósito destina-se <strong>exclusivamente</strong> à compra de moedas virtuais de entretenimento, sem valor fiduciário ou possibilidade de saque.
 </label>
 </div>
 </div>
 </div>
 )}

 {/* STEP 2: REAL PIX CHECKOUT (Dark Theme) */}
 {step === 'qr' && selectedPackage && (
 <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 text-white rounded-3xl p-6 md:p-8 animate-scale-up z-10 my-auto">

 {/* Header Bar: Back Arrow + Title */}
 <div className="flex items-center justify-between mb-6">
 <button
 onClick={() => setStep('select')}
 className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
 title="Voltar"
 >
 <ArrowLeft className="w-5 h-5"/>
 </button>
 <h2 className="text-sm font-black uppercase tracking-wider text-white">
 Pagamento via PIX
 </h2>
 <div className="w-9"/> {/* Spacer */}
 </div>

 {/* Status & Live Countdown Row */}
 <div className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 mb-5 text-xs font-bold text-zinc-300">
 <div className="flex items-center gap-2">
 <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"/>
 <span>Aguardando pagamento</span>
 </div>
 <div className="flex items-center gap-1 text-zinc-400">
 <Clock className="w-3.5 h-3.5"/>
 <span className="font-mono text-zinc-200 font-bold">{formattedTime}</span>
 </div>
 </div>

 {/* Centered QR Code Box */}
 <div className="flex flex-col items-center justify-center mb-5">
 <div className="bg-zinc-950 p-4 rounded-3xl flex items-center justify-center relative group min-w-[200px] min-h-[200px]">
 {isProcessing ? (
 <Loader2 className="w-8 h-8 animate-spin text-zinc-500"/>
 ) : qrImage ? (
 <img
 src={qrImage}
 alt="QR Code PIX"
 className="w-44 h-44 rounded-2xl bg-white p-2 object-contain"
 />
 ) : (
 <div className="text-sm text-zinc-500">Erro ao carregar</div>
 )}
 </div>
 </div>

 {/* Copy PIX Code Button */}
 <button
 onClick={copyPixCode}
 className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 active:scale-95 text-white font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-wider mb-5 cursor-pointer"
 >
 {copied ? (
 <>
 <Check className="w-4 h-4 text-emerald-400"/>
 <span className="text-emerald-400">Código Copiado!</span>
 </>
 ) : (
 <>
 <Copy className="w-4 h-4"/>
 <span>Copiar Código</span>
 </>
 )}
 </button>

 {/* Total Row */}
 <div className="flex items-center justify-between py-3 border-t border-b border-white/5 text-sm font-bold text-zinc-400 mb-4">
 <span>Total</span>
 <span className="text-lg font-black text-white">
 R$ {selectedPackage.price.toFixed(2).replace('.', ',')}
 </span>
 </div>

 {/* Footer Security Note */}
 <p className="text-[10px] text-zinc-500 text-center leading-tight mb-5">
 Seu pagamento será feito com segurança via PIX em tempo real para DopaShop.
 </p>

 {/* Waiting for payment indicator */}
 <div className="w-full bg-zinc-800 border border-zinc-700 text-zinc-400 py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2">
 <Loader2 className="w-5 h-5 animate-spin"/>
 <span>Escaneie o QR Code...</span>
 </div>
 </div>
 )}

 {/* STEP 3: SUCCESS CONFIRMATION */}
 {step === 'success' && selectedPackage && (
 <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 text-white rounded-3xl p-8 animate-scale-up text-center z-10 my-auto">
 <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
 <CheckCircle2 className="w-10 h-10 text-emerald-500"/>
 </div>

 <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2 font-display">
 Pagamento Confirmado!
 </h2>
 <p className="text-zinc-400 text-sm mb-6">
 Você adquiriu com sucesso <strong className="text-white">{selectedPackage.coins.toLocaleString('pt-BR')} DopaCoins</strong>!
 </p>

 <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
 <DopaCoinIcon className="w-6 h-6"/>
 <span className="text-sm font-black text-white uppercase tracking-wider">
 +{selectedPackage.coins.toLocaleString('pt-BR')} Dopas Adicionados
 </span>
 </div>
 </div>
 )}
 
 {/* Terms Modal Nested */}
 <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
 </div>
 );
};

export default PixDepositModal;
