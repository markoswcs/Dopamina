import React, { useState, useEffect } from"react";
import { Sparkles, CheckCircle, Package, CreditCard, Truck } from"lucide-react";
import confetti from"canvas-confetti";

const loadingSteps = [
 { icon: CreditCard, label:"Processando pagamento fictício...", duration: 1200 },
 { icon: CheckCircle, label:"Pagamento de 0,00 Dopas aprovado!", duration: 1000 },
 { icon: Package, label:"Separando seus produtos imaginários...", duration: 1500 },
 { icon: Truck, label:"Preparando envio para outro universo...", duration: 1000 },
 { icon: Sparkles, label:"Liberando dopamina pura...", duration: 800 },
];

export default function SatisfyingLoader({ onComplete }) {
 const [currentStep, setCurrentStep] = useState(0);
 const [progress, setProgress] = useState(0);

 useEffect(() => {
 if (currentStep >= loadingSteps.length) {
 confetti({ particleCount: 180, spread: 90, origin: { y: 0.5 }, colors: ["#E85D3A","#F5A623","#2D9F6F","#FFFFFF"] });
 setTimeout(() => confetti({ particleCount: 120, spread: 120, origin: { y: 0.4 }, colors: ["#E85D3A","#FBBF24"] }), 300);
 setTimeout(() => { if (onComplete) onComplete(); }, 600);
 return;
 }

 const step = loadingSteps[currentStep];
 const progressPerStep = 100 / loadingSteps.length;
 const targetProgress = (currentStep + 1) * progressPerStep;

 // Animate progress bar
 const interval = setInterval(() => {
 setProgress(prev => {
 if (prev >= targetProgress) { clearInterval(interval); return targetProgress; }
 return prev + 1;
 });
 }, step.duration / progressPerStep);

 const timeout = setTimeout(() => {
 setCurrentStep(prev => prev + 1);
 if (window.triggerDopaParticles) {
 window.triggerDopaParticles(window.innerWidth / 2, window.innerHeight / 2);
 }
 }, step.duration);

 return () => { clearInterval(interval); clearTimeout(timeout); };
 }, [currentStep, onComplete]);

 const step = loadingSteps[Math.min(currentStep, loadingSteps.length - 1)];
 const StepIcon = step.icon;

 return (
 <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-6">
 <div className="theme-card border theme-border rounded-2xl p-8 max-w-sm w-full text-center space-y-6 animate-fade-in-up">
 {/* Pulsing icon */}
 <div className="w-20 h-20 mx-auto rounded-full bg-accent/10 flex items-center justify-center animate-pulse">
 <StepIcon className="w-10 h-10 text-accent"/>
 </div>

 {/* Step label */}
 <div>
 <p className="font-display font-bold text-sm theme-text">{step.label}</p>
 <p className="text-[10px] theme-muted mt-1">Etapa {Math.min(currentStep + 1, loadingSteps.length)} de {loadingSteps.length}</p>
 </div>

 {/* Progress bar */}
 <div className="w-full h-2 rounded-full theme-surface border theme-border overflow-hidden">
 <div
 className="h-full bg-gradient-to-r from-accent to-warning rounded-full transition-all duration-300"
 style={{ width:`${progress}%`}}
 />
 </div>

 <p className="text-[10px] theme-muted">Aguarde... sua dopamina está sendo preparada ⚡</p>
 </div>
 </div>
 );
}
