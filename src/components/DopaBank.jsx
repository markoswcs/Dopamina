import React, { useState, useEffect, useRef } from"react";
import { Eye, EyeOff, User, HelpCircle, Bell, ChevronRight, Smartphone, CreditCard, ArrowRightLeft, QrCode, Sparkles, AlertTriangle, ShieldCheck, Zap, PiggyBank, Briefcase, Flame, TrendingDown, TrendingUp, ChevronLeft } from"lucide-react";
import confetti from"canvas-confetti";
import { playSuccess, playFail } from"../audioManager";

export default function DopaBank({ userData, currentAura, coinBalance, onUpdateAura, onUpdateCoins }) {
 const [showBalance, setShowBalance] = useState(true);
 
 // Modals
 const [exchangeOpen, setExchangeOpen] = useState(false);
 const [transferOpen, setTransferOpen] = useState(false);
 const [caixinhaOpen, setCaixinhaOpen] = useState(false);
 const [donateOpen, setDonateOpen] = useState(false);

 // States
 const [pixStatus, setPixStatus] = useState(null);
 const [history, setHistory] = useState([]);
 const [customAura, setCustomAura] = useState(100);
 const [transferAmount, setTransferAmount] = useState(50);
 const [caixinhaInput, setCaixinhaInput] = useState(0);
 const [donateAmount, setDonateAmount] = useState(10);
 const [blackCardCooldown, setBlackCardCooldown] = useState(false);
 const [agiotaFrozen, setAgiotaFrozen] = useState(0);
 
 const segurosRef = useRef(null);

 // Persistent States
 const [caixinhaBalance, setCaixinhaBalance] = useState(() => {
 try { return JSON.parse(localStorage.getItem("dopashop_caixinha")) || 0; } catch { return 0; }
 });
 const [hasInsurance, setHasInsurance] = useState(() => {
 try { return JSON.parse(localStorage.getItem("dopashop_insurance")) || false; } catch { return false; }
 });
 const [loanAmount, setLoanAmount] = useState(() => {
 try { return JSON.parse(localStorage.getItem("dopashop_loan")) || 0; } catch { return 0; }
 });

 // Sync to localStorage
 useEffect(() => { localStorage.setItem("dopashop_caixinha", JSON.stringify(caixinhaBalance)); }, [caixinhaBalance]);
 useEffect(() => { localStorage.setItem("dopashop_insurance", JSON.stringify(hasInsurance)); }, [hasInsurance]);
 useEffect(() => { localStorage.setItem("dopashop_loan", JSON.stringify(loanAmount)); }, [loanAmount]);

 const hasBlackCard = coinBalance >= 1000000; // Desbloqueia com 1 Milhão de PIX

 const formatCurrency = (val) => {
 if (val >= 1e12) return"Dopas"+ (val / 1e12).toFixed(2) +"T";
 if (val >= 1e9) return"Dopas"+ (val / 1e9).toFixed(2) +"B";
 if (val >= 1e6) return"Dopas"+ (val / 1e6).toFixed(2) +"M";
 return val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +"Dopas";
 };

 const formatAura = (val) => {
 if (val >= 1e12) return (val / 1e12).toFixed(2) +"T ✨";
 if (val >= 1e9) return (val / 1e9).toFixed(2) +"B ✨";
 if (val >= 1e6) return (val / 1e6).toFixed(2) +"M ✨";
 return Math.floor(val).toLocaleString() +"✨";
 };

 // Audio Helper (uses global singleton)
 const playSound = (type) => {
 if (type === 'success') playSuccess();
 else if (type === 'fail') playFail();
 };

 const scrollSeguros = (dir) => {
 if (segurosRef.current) {
 segurosRef.current.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' });
 }
 };

 // Real-time Interest & Staking
 useEffect(() => {
 const interval = setInterval(() => {
 // Agiota interest: +0.5% every 5 seconds
 if (loanAmount > 0) {
 if (agiotaFrozen > 0) {
 setAgiotaFrozen(prev => prev - 1);
 } else {
 setLoanAmount(prev => prev * 1.005);
 }
 }
 // Caixinha Staking: +1% every 5 seconds (Very OP for a game)
 if (caixinhaBalance > 0) {
 setCaixinhaBalance(prev => prev * 1.01);
 }
 }, 5000);
 return () => clearInterval(interval);
 }, [loanAmount, caixinhaBalance, agiotaFrozen]);

 // Agiota Loan
 const takeLoan = () => {
 onUpdateAura(50000);
 setLoanAmount(50000);
 playSound('success');
 };
 const payLoan = () => {
 if (currentAura >= loanAmount) {
 const wasBigLoan = loanAmount >= 100000;
 onUpdateAura(-loanAmount);
 setLoanAmount(0);
 playSound('success');
 if (wasBigLoan) {
 confetti({ particleCount: 500, spread: 360, origin: { y: 0.5 }, colors: ['#10b981', '#34d399', '#ffffff'], zIndex: 9999 });
 alert("Dívida MILIONÁRIA paga! Seus joelhos estão abençoados.");
 } else {
 alert("Dívida paga! Seus joelhos estão a salvo.");
 }
 }
 };

 // Exchange (Aura -> Pix)
 const handleExchange = (rate, customAmount = null) => {
 const cost = customAmount || rate.auraCost;
 if (currentAura < cost) {
 alert("Aura insuficiente!");
 return;
 }

 onUpdateAura(-cost);
 setPixStatus('processing');

 setTimeout(() => {
 // Se tem seguro, o risco da Receita cai drasticamente (ou fica zero para câmbio normal)
 const riskModifier = hasInsurance ? 0 : rate.risk;
 const isSuccess = Math.random() >= riskModifier;

 if (isSuccess) {
 onUpdateCoins(rate.pixReward);
 setPixStatus('success');
 playSound('success');
 setHistory(prev => [{
 id: Date.now(), type: 'success', msg:`Pix de Dopas ${rate.pixReward.toFixed(2).replace('.',',')} recebido`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 }, ...prev].slice(0, 5));
 
 // Se usar o seguro para se safar de um risco alto, pode consumir o seguro
 if (hasInsurance && rate.risk > 0) {
 if (Math.random() > 0.5) {
 setHasInsurance(false); // Seguro usado!
 alert("O seu Seguro PIX cobriu a Receita Federal, mas foi consumido!");
 }
 }
 } else {
 setPixStatus('fail');
 playSound('fail');
 setHistory(prev => [{
 id: Date.now(), type: 'fail', msg: 'Interceptado pela Receita', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 }, ...prev].slice(0, 5));
 }

 setTimeout(() => setPixStatus(null), 2500);
 }, 1500);
 };

 const handleCustomExchange = () => {
 const amount = parseInt(customAura, 10);
 if (isNaN(amount) || amount <= 0) return;
 let reward = amount * 0.05;
 if (amount >= 1000 && amount < 10000) reward = amount * 0.055;
 if (amount >= 10000) reward = amount * 0.06;
 if (hasBlackCard) reward = amount * 0.10; // Taxa VIP (10% de conversão invés de 5%)

 const rate = { id: 'custom', auraCost: amount, pixReward: reward, risk: hasBlackCard ? 0 : 0.1 }; // Cartão Black isenta do risco normal
 handleExchange(rate, amount);
 };

 // Transfer (Pix -> NPC)
 const handleTransfer = () => {
 const amount = parseInt(transferAmount, 10);
 if (isNaN(amount) || amount <= 0 || coinBalance < amount) return;
 
 onUpdateCoins(-amount);
 setPixStatus('processing');

 setTimeout(() => {
 // 30% chance of the friend stealing the money
 const stolen = Math.random() < 0.3;
 
 if (!stolen) {
 // Friend doubles it!
 const reward = amount * 2;
 onUpdateCoins(reward);
 setPixStatus('success');
 playSound('success');
 setHistory(prev => [{
 id: Date.now(), type: 'success', msg:`Amigo investiu e devolveu Dopas ${reward.toFixed(2).replace('.',',')}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 }, ...prev].slice(0, 5));
 } else {
 setPixStatus('fail');
 playSound('fail');
 setHistory(prev => [{
 id: Date.now(), type: 'fail', msg: 'O amigo sumiu com seu dinheiro!', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 }, ...prev].slice(0, 5));
 }
 setTimeout(() => { setPixStatus(null); setTransferOpen(false); }, 2500);
 }, 1500);
 };

 // Caixinha
 const handleCaixinhaDeposit = () => {
 const amount = parseInt(caixinhaInput, 10);
 if (isNaN(amount) || amount <= 0 || currentAura < amount) return;
 onUpdateAura(-amount);
 setCaixinhaBalance(prev => prev + amount);
 setCaixinhaInput(0);
 };
 const handleCaixinhaWithdraw = () => {
 const amount = parseInt(caixinhaInput, 10);
 if (isNaN(amount) || amount <= 0 || caixinhaBalance < amount) return;
 setCaixinhaBalance(prev => prev - amount);
 onUpdateAura(amount);
 setCaixinhaInput(0);
 };

 const buyInsurance = () => {
 if (coinBalance >= 50 && !hasInsurance) {
 onUpdateCoins(-50);
 setHasInsurance(true);
 playSound('success');
 alert("Seguro PIX ativado! A Receita não vai interceptar seu próximo Câmbio.");
 }
 };

 const buyAgiotaInsurance = () => {
 if (coinBalance >= 200) {
 onUpdateCoins(-200);
 setAgiotaFrozen(24); // 24 ticks * 5s = 2 minutes frozen
 playSound('success');
 alert("Seguro Agiota ativado! Juros da dívida congelados por 2 minutos.");
 } else {
 alert("PIX insuficiente para o Seguro Agiota (Dopas 200).");
 }
 };

 const handleBlackCard = () => {
 if (blackCardCooldown) return;
 setBlackCardCooldown(true);
 playSound('success');
 const cashbackPix = Math.floor(Math.random() * 50) + 10;
 onUpdateCoins(cashbackPix);
 setHistory(prev => [{
 id: Date.now(), type: 'success', msg:`Cashback Ultravioleta: Dopas ${cashbackPix},00`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 }, ...prev].slice(0, 5));
 
 setTimeout(() => setBlackCardCooldown(false), 60000); // 1 minute cooldown
 };

 const handleDonate = () => {
 const amount = parseInt(donateAmount, 10);
 if (isNaN(amount) || amount <= 0 || coinBalance < amount) return;
 
 onUpdateCoins(-amount);
 playSound('fail'); // Satisfying loss
 setDonateOpen(false);
 setHistory(prev => [{
 id: Date.now(), type: 'fail', msg:`Doou ${formatCurrency(amount)} pro banco à toa`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 }, ...prev].slice(0, 5));
 };

 const RISKY_RATES = [
 { id: 4, auraCost: 500, pixReward: 50, label:"Pix Arriscado (50% Chance)", risk: 0.5, color:"from-orange-500 to-red-600"},
 { id: 5, auraCost: 5000, pixReward: 1000, label:"Roleta Russa (Alto Risco)", risk: 0.8, color:"from-red-600 to-red-900"},
 ];

 const userName = userData?.name ? userData.name.split("")[0] :"Cliente";

 return (
 <div className="w-full max-w-sm mx-auto bg-[#0A0A0B] rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(138,5,190,0.15)] border-[8px] border-[#18181B] relative font-sans select-none ring-1 ring-white/10">
 
 {/* Background Glows */}
 <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none"></div>
 <div className="absolute top-1/2 -right-32 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>

 {/* Top Notch Simulator */}
 <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
 <div className="w-1/3 h-4 bg-black rounded-b-xl border-x border-b border-white/5"></div>
 </div>

 {/* Header */}
 <div className="relative pt-10 pb-6 px-6 z-10 bg-gradient-to-b from-[#18181B] to-transparent">
 <div className="flex justify-between items-center mb-6">
 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-900/20 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.15)]">
 <User className="w-5 h-5 text-purple-300"/>
 </div>
 <div className="flex gap-4 text-zinc-400">
 <button onClick={() => setShowBalance(!showBalance)} className="hover:text-white transition-colors">
 {showBalance ? <Eye className="w-6 h-6"/> : <EyeOff className="w-6 h-6"/>}
 </button>
 <HelpCircle className="w-6 h-6 hover:text-white cursor-pointer transition-colors"/>
 <Bell className="w-6 h-6 hover:text-white cursor-pointer transition-colors"/>
 </div>
 </div>
 <h2 className="font-semibold text-lg text-zinc-200">Olá, {userName} <span className="text-purple-400 font-bold">Ultravioleta</span></h2>
 </div>

 {/* Main Content Area */}
 <div className="relative z-10 text-white min-h-[420px]">
 
 {/* Balance Display */}
 <div className="px-6 py-4 cursor-pointer group">
 <div className="flex justify-between items-center mb-2">
 <h3 className="font-semibold text-lg text-zinc-400 group-hover:text-zinc-200 transition-colors">Conta PIX</h3>
 <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors"/>
 </div>
 {showBalance ? (
 <div className="font-black text-[38px] tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500 drop-">
 {formatCurrency(coinBalance)}
 </div>
 ) : (
 <div className="font-black text-[38px] tracking-tighter text-zinc-700">Dopas ••••</div>
 )}
 </div>

 {/* Action Buttons */}
 <div className="flex gap-4 overflow-x-auto px-6 py-6 no-scrollbar">
 <button onClick={() => setExchangeOpen(true)} className="flex flex-col items-center gap-3 group shrink-0">
 <div className="w-[72px] h-[72px] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center group-hover:from-purple-900/50 group-hover:to-zinc-900 border border-zinc-800 group-hover:border-purple-500/30 transition-all relative overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
 <Sparkles className="w-7 h-7 text-purple-400 group-hover:scale-110 transition-transform duration-300"/>
 </div>
 <span className="font-semibold text-[13px] text-zinc-300">Aura ➝ PIX</span>
 </button>
 
 <button onClick={() => setTransferOpen(true)} className="flex flex-col items-center gap-3 group shrink-0">
 <div className="w-[72px] h-[72px] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:border-zinc-500/50 transition-all relative overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
 <ArrowRightLeft className="w-7 h-7 text-zinc-400 group-hover:text-white transition-colors"/>
 </div>
 <span className="font-semibold text-[13px] text-zinc-400 group-hover:text-zinc-200">Transferir</span>
 </button>

 <button onClick={() => setCaixinhaOpen(true)} className="flex flex-col items-center gap-3 group shrink-0">
 <div className="w-[72px] h-[72px] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:border-emerald-500/50 transition-all relative overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
 <PiggyBank className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition-transform"/>
 </div>
 <span className="font-semibold text-[13px] text-emerald-400">Caixinhas</span>
 </button>
 
 <button onClick={() => setDonateOpen(true)} className="flex flex-col items-center gap-3 group shrink-0">
 <div className="w-[72px] h-[72px] bg-gradient-to-br from-red-900/30 to-zinc-900 rounded-2xl flex items-center justify-center border border-red-900/50 group-hover:border-red-500/50 transition-all relative overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent"></div>
 <Flame className="w-7 h-7 text-red-500 group-hover:scale-110 transition-transform"/>
 </div>
 <span className="font-semibold text-[13px] text-red-400">Doar (Perder)</span>
 </button>
 </div>

 <div className="px-6 pb-6">
 <div onClick={handleBlackCard} className={`bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-3xl p-5 flex items-center justify-between border ${blackCardCooldown ? 'border-zinc-700/50 cursor-not-allowed opacity-70' : 'border-purple-500/30 cursor-pointer hover:border-purple-500/60 )]'} transition-all group relative overflow-hidden`}>
 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiMwMDAiPjwvcmVjdD48cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjAyIj48L3BhdGg+PC9zdmc+')] opacity-50 mix-blend-overlay pointer-events-none"></div>
 
 <div className="relative flex items-center gap-4">
 <div className="bg-zinc-800/80 p-2 rounded-lg border border-zinc-700/50">
 <CreditCard className={`w-6 h-6 ${blackCardCooldown ? 'text-zinc-500' : 'text-purple-400'}`} />
 </div>
 <div>
 <span className="font-bold text-[15px] text-zinc-200 block">Cartão Black {blackCardCooldown && <span className="text-xs text-zinc-500">(Em Espera)</span>}</span>
 <span className="text-[12px] text-zinc-500 font-semibold">{blackCardCooldown ? 'Cashback Indisponível' : 'Toque para Cashback Ultravioleta'}</span>
 </div>
 </div>
 {!blackCardCooldown && <Sparkles className="w-5 h-5 text-purple-400 animate-pulse relative group-hover:scale-110 transition-transform"/>}
 </div>
 </div>

 {/* Empréstimo Agiota */}
 <div className="px-6 py-5 border-b border-[#18181B] relative overflow-hidden group">
 {loanAmount > 0 && <div className="absolute inset-0 bg-red-900/10 animate-pulse pointer-events-none"></div>}
 <div className="flex justify-between items-center mb-1">
 <h3 className={`font-semibold text-[17px] ${loanAmount > 0 ? 'text-red-500' : 'text-zinc-200'}`}>
 {loanAmount > 0 ? 'Dívida com o Agiota' : 'Empréstimo Dopa'}
 </h3>
 </div>
 
 {loanAmount === 0 ? (
 <div className="flex items-center justify-between mt-2">
 <p className="text-[13px] text-zinc-500 font-medium">Pegue até <span className="text-zinc-300 font-semibold">50.000 Aura</span>. Juros de 0.5% a cada 5s.</p>
 <button onClick={takeLoan} className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 transition-colors">Solicitar</button>
 </div>
 ) : (
 <div className="mt-2 space-y-3">
 <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-red-900/30">
 <span className="text-xs font-bold text-red-500">Valor Atualizado:</span>
 <span className="font-black text-xl text-red-400 font-mono tracking-tight">{formatAura(loanAmount)}</span>
 </div>
 <button onClick={payLoan} className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all border ${currentAura >= loanAmount ? 'bg-emerald-900/40 hover:bg-emerald-800 text-emerald-400 border-emerald-500/30' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border-zinc-700'}`}>
 {currentAura >= loanAmount ? 'Pagar Dívida' : 'Aura Insuficiente para Pagar'}
 </button>
 </div>
 )}
 </div>

 {/* Seguros Funcionais */}
 <div className="px-6 py-5 pb-8 relative group/seguros">
 <div className="flex justify-between items-center mb-4">
 <h3 className="font-semibold text-[17px] text-zinc-200">Seguros Dopa</h3>
 <div className="flex gap-2 opacity-0 group-hover/seguros:opacity-100 transition-opacity hidden md:flex">
 <button onClick={() => scrollSeguros('left')} className="p-1 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400"><ChevronLeft className="w-5 h-5"/></button>
 <button onClick={() => scrollSeguros('right')} className="p-1 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400"><ChevronRight className="w-5 h-5"/></button>
 </div>
 </div>
 <div ref={segurosRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
 
 <div className={`min-w-[200px] snap-center rounded-2xl p-4 border transition-colors ${hasInsurance ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-[#18181B] border-white/5 hover:bg-zinc-800 cursor-pointer'}`}>
 <ShieldCheck className={`w-6 h-6 mb-3 ${hasInsurance ? 'text-emerald-400' : 'text-purple-400'}`} />
 <h4 className="font-bold text-sm text-zinc-200 mb-1">Seguro PIX</h4>
 <p className="text-[11px] text-zinc-500 font-medium mb-3">
 {hasInsurance ? 'Você está protegido contra a Receita Federal.' : 'Protege o seu próximo Câmbio contra a Receita.'}
 </p>
 {!hasInsurance && (
 <button onClick={buyInsurance} disabled={coinBalance < 50} className={`text-xs font-bold px-3 py-1.5 rounded-full ${coinBalance >= 50 ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/40' : 'bg-zinc-800 text-zinc-500'}`}>
 Comprar (Dopas 50,00)
 </button>
 )}
 </div>

 <div className="min-w-[200px] snap-center bg-[#18181B] rounded-2xl p-4 border border-white/5 hover:bg-zinc-800 transition-colors cursor-pointer">
 <Briefcase className={`w-6 h-6 mb-3 ${agiotaFrozen > 0 ? 'text-emerald-400' : 'text-blue-400'}`} />
 <h4 className="font-bold text-sm text-zinc-200 mb-1">Seguro Agiota</h4>
 <p className="text-[11px] text-zinc-500 font-medium mb-3">
 {agiotaFrozen > 0 ?`Juros congelados. Protegido por mais ${(agiotaFrozen * 5)}s.`: 'Congela os juros do empréstimo por 2 minutos.'}
 </p>
 {agiotaFrozen === 0 && (
 <button onClick={buyAgiotaInsurance} disabled={coinBalance < 200} className={`text-xs font-bold px-3 py-1.5 rounded-full ${coinBalance >= 200 ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/40' : 'bg-zinc-800 text-zinc-500'}`}>
 Comprar (Dopas 200,00)
 </button>
 )}
 </div>

 {/* Placeholder to allow scrolling space if needed */}
 <div className="min-w-[40px] opacity-0 pointer-events-none"></div>
 </div>
 </div>
 
 {/* Histórico (Extrato) */}
 <div className="px-6 py-2 pb-10">
 <h3 className="font-semibold text-[15px] text-zinc-400 mb-4">Extrato Recente</h3>
 {history.length === 0 ? (
 <p className="text-zinc-600 text-sm text-center py-4 bg-[#18181B] rounded-xl border border-white/5">Nenhuma transação recente.</p>
 ) : (
 <div className="space-y-3">
 {history.map(item => (
 <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-[#121214] border border-white/5">
 <div className="flex items-center gap-3">
 <div className={`p-2 rounded-lg ${item.type === 'success' ? 'bg-emerald-900/30' : 'bg-red-900/30'}`}>
 {item.type === 'success' ? <TrendingUp className={`w-4 h-4 text-emerald-400`} /> : <TrendingDown className={`w-4 h-4 text-red-500`} />}
 </div>
 <span className="text-sm font-semibold text-zinc-300">{item.msg}</span>
 </div>
 <span className="text-xs text-zinc-600">{item.time}</span>
 </div>
 ))}
 </div>
 )}
 </div>
 
 {/* Modals Subcomponents */}
 
 {/* STATUS OVERLAY */}
 {pixStatus && (
 <div className="absolute inset-0 bg-[#0A0A0B]/90 z-50 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md rounded-[32px]">
 {pixStatus === 'processing' && (
 <div className="animate-fade-in flex flex-col items-center">
 <div className="relative w-16 h-16 mb-6">
 <div className="absolute inset-0 border-4 border-purple-900 rounded-full"></div>
 <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
 <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-purple-400 animate-pulse"/>
 </div>
 <h3 className="font-black text-2xl text-white tracking-tight">Processando Transação...</h3>
 </div>
 )}
 {pixStatus === 'success' && (
 <div className="animate-scale-in flex flex-col items-center">
 <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
 <ShieldCheck className="w-12 h-12 text-emerald-400"/>
 </div>
 <h3 className="font-black text-3xl text-emerald-400 mb-2 tracking-tight">Sucesso!</h3>
 </div>
 )}
 {pixStatus === 'fail' && (
 <div className="animate-scale-in flex flex-col items-center">
 <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
 <AlertTriangle className="w-12 h-12 text-red-500"/>
 </div>
 <h3 className="font-black text-3xl text-red-500 mb-2 tracking-tight">Deu Ruim!</h3>
 </div>
 )}
 </div>
 )}

 {/* CÂMBIO MODAL */}
 {exchangeOpen && (
 <div className="absolute inset-0 z-30 animate-fade-in-up flex flex-col bg-[#0A0A0B]/95 backdrop-blur-xl rounded-[32px]">
 <div className="p-6 flex justify-between items-center border-b border-white/5 shrink-0">
 <h3 className="font-bold text-xl flex items-center gap-3 text-white">Câmbio PIX</h3>
 <button onClick={() => setExchangeOpen(false)} className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">✕</button>
 </div>
 <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
 <div className="bg-purple-900/20 border border-purple-500/30 rounded-full px-5 py-2.5 flex justify-center gap-3">
 <span className="text-sm font-semibold text-purple-300">Sua Aura:</span>
 <span className="font-black text-lg text-white">{currentAura.toLocaleString()} ✨</span>
 </div>
 <div className="bg-[#121214] border border-purple-500/30 rounded-[24px] p-5">
 <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase">Sacar Aura</label>
 <input type="number"value={customAura} onChange={(e) => setCustomAura(e.target.value)} className="w-full bg-black/50 border-2 border-white/10 focus:border-purple-500 rounded-2xl py-3 px-5 font-black text-2xl text-white outline-none mb-4"/>
 <input type="range"min="1"max={Math.max(1, currentAura)} value={customAura} onChange={(e) => setCustomAura(e.target.value)} className="w-full accent-purple-500 h-2 bg-black/50 rounded-lg appearance-none cursor-pointer mb-4"/>
 <div className="flex justify-between mb-4">
 <span className="text-sm text-zinc-400">Você recebe:</span>
 <span className="font-black text-xl text-emerald-400">{formatCurrency((parseInt(customAura)||0)*0.05)}</span>
 </div>
 {hasInsurance && <div className="mb-4 text-xs font-bold text-emerald-400 bg-emerald-900/20 p-2 rounded text-center">Seguro PIX Ativo! Risco 0%</div>}
 <button onClick={handleCustomExchange} disabled={currentAura < parseInt(customAura)} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold">Executar PIX</button>
 </div>
 <div>
 <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3">Apostas de Câmbio</h4>
 <div className="grid grid-cols-2 gap-3">
 {RISKY_RATES.map(rate => (
 <div key={rate.id} className="bg-[#121214] border border-red-500/20 rounded-2xl p-4 flex flex-col justify-between">
 <h4 className="font-bold text-[13px] text-red-400 mb-3">{rate.label}</h4>
 <button onClick={() => handleExchange(rate)} disabled={currentAura < rate.auraCost} className="w-full py-2 bg-red-900/50 text-red-200 rounded-xl font-bold text-xs">Apostar</button>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}

 {/* TRANSFER MODAL */}
 {transferOpen && (
 <div className="absolute inset-0 z-30 animate-fade-in-up flex flex-col bg-[#0A0A0B]/95 backdrop-blur-xl rounded-[32px]">
 <div className="p-6 flex justify-between items-center border-b border-white/5 shrink-0">
 <h3 className="font-bold text-xl text-white">Transferir para Amigo</h3>
 <button onClick={() => setTransferOpen(false)} className="w-8 h-8 bg-zinc-800 rounded-full text-zinc-400">✕</button>
 </div>
 <div className="flex-1 p-6 space-y-6">
 <p className="text-sm text-zinc-400">Transfira Pix para um amigo da rede. Se ele for confiável, ele investe e te devolve o dobro. Mas há 30% de chance dele sumir com o seu dinheiro!</p>
 <div className="bg-[#121214] border border-zinc-700 rounded-[24px] p-5">
 <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase">Valor do Pix</label>
 <input type="number"value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} className="w-full bg-black/50 border-2 border-white/10 rounded-2xl py-3 px-5 font-black text-2xl text-white outline-none mb-4"/>
 <input type="range"min="1"max={Math.max(1, coinBalance)} value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} className="w-full accent-zinc-400 h-2 bg-black/50 rounded-lg appearance-none cursor-pointer mb-4"/>
 <button onClick={handleTransfer} disabled={coinBalance < parseInt(transferAmount)} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold border border-zinc-600">Enviar Pix</button>
 </div>
 </div>
 </div>
 )}

 {/* CAIXINHAS MODAL */}
 {caixinhaOpen && (
 <div className="absolute inset-0 z-30 animate-fade-in-up flex flex-col bg-[#0A0A0B]/95 backdrop-blur-xl rounded-[32px]">
 <div className="p-6 flex justify-between items-center border-b border-white/5 shrink-0">
 <h3 className="font-bold text-xl text-white flex items-center gap-2"><PiggyBank className="text-emerald-400"/> Caixinha Dopa</h3>
 <button onClick={() => setCaixinhaOpen(false)} className="w-8 h-8 bg-zinc-800 rounded-full text-zinc-400">✕</button>
 </div>
 <div className="flex-1 p-6 space-y-6">
 <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-3xl p-6 text-center">
 <h4 className="text-sm font-bold text-emerald-400 mb-2">Saldo Guardado (Rende 1% a cada 5s)</h4>
 <div className="text-4xl font-black text-white font-mono">{Math.floor(caixinhaBalance).toLocaleString()} ✨</div>
 </div>
 <div className="bg-[#121214] border border-zinc-700 rounded-[24px] p-5">
 <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase">Aura para movimentar</label>
 <div className="relative mb-4">
 <input type="number"value={caixinhaInput} onChange={(e) => setCaixinhaInput(e.target.value)} className="w-full bg-black/50 border-2 border-white/10 rounded-2xl py-3 px-5 font-black text-2xl text-white outline-none"/>
 <button onClick={() => setCaixinhaInput(Math.floor(currentAura))} className="absolute right-3 top-3 bg-zinc-800 text-xs px-2 py-1 rounded">MAX AURA</button>
 </div>
 <input type="range"min="1"max={Math.max(1, currentAura, caixinhaBalance)} value={caixinhaInput} onChange={(e) => setCaixinhaInput(e.target.value)} className="w-full accent-emerald-500 h-2 bg-black/50 rounded-lg appearance-none cursor-pointer mb-4"/>
 <div className="flex gap-3">
 <button onClick={handleCaixinhaDeposit} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold">Guardar</button>
 <button onClick={handleCaixinhaWithdraw} className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold">Resgatar</button>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* DONATE MODAL */}
 {donateOpen && (
 <div className="absolute inset-0 z-30 animate-fade-in-up flex flex-col bg-[#0A0A0B]/95 backdrop-blur-xl rounded-[32px]">
 <div className="p-6 flex justify-between items-center border-b border-white/5 shrink-0">
 <h3 className="font-bold text-xl text-white flex items-center gap-2"><Flame className="text-red-500"/> Queimar Dinheiro</h3>
 <button onClick={() => setDonateOpen(false)} className="w-8 h-8 bg-zinc-800 rounded-full text-zinc-400">✕</button>
 </div>
 <div className="flex-1 p-6 space-y-6">
 <p className="text-sm text-zinc-400">Dê seu suado PIX de presente para o DopaBank. É 100% irreversível e você não ganha <span className="font-bold text-red-400">ABSOLUTAMENTE NADA</span> em troca. Literalmente jogar dinheiro no lixo.</p>
 <div className="bg-[#121214] border border-red-900/50 rounded-[24px] p-5">
 <label className="block text-xs font-semibold text-red-400 mb-2 uppercase">Valor a Queimar (PIX)</label>
 <div className="relative mb-4">
 <input type="number"value={donateAmount} onChange={(e) => setDonateAmount(e.target.value)} className="w-full bg-black/50 border-2 border-red-900/30 focus:border-red-500 rounded-2xl py-3 px-5 font-black text-2xl text-red-100 outline-none"/>
 </div>
 <input type="range"min="1"max={Math.max(1, coinBalance)} value={donateAmount} onChange={(e) => setDonateAmount(e.target.value)} className="w-full accent-red-500 h-2 bg-black/50 rounded-lg appearance-none cursor-pointer mb-4"/>
 <button onClick={handleDonate} disabled={coinBalance < parseInt(donateAmount)} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
 🔥 CONFIRMAR DOAÇÃO 🔥
 </button>
 </div>
 </div>
 </div>
 )}

 </div>
 </div>
 );
}
