import React, { useState } from 'react';
import { ArrowRight, Flame, X, Mail, Lock, User, Gift } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AuthPage = ({ onSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState(() => {
    try { return localStorage.getItem("dopashop_referral") || ''; } catch { return ''; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    try {
      if (email && password.length >= 6) {
        if (mode === 'register') {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username, referral_code: referralCode } }
          });
          if (signUpError) throw signUpError;
          setSuccessMsg('Conta criada com sucesso! Redirecionando...');
          setTimeout(() => onSuccess && onSuccess(), 1500);
        } else {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (signInError) throw signInError;
          setSuccessMsg('Login realizado com sucesso!');
          setTimeout(() => onSuccess && onSuccess(), 1000);
        }
      } else {
        setError('Por favor, preencha todos os campos corretamente (senha mín 6 caracteres).');
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (provider) => alert(`Login com ${provider} em breve!`);
  const toggleMode = () => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); setSuccessMsg(null); };

  // Strict native DopaShop design language (NO SHADOWS, specific glassmorphism)
  const inputClasses = "w-full bg-black/20 hover:bg-black/40 border border-white/5 hover:border-[var(--color-accent)]/50 rounded-xl pl-12 pr-4 py-3.5 text-base theme-text placeholder:theme-muted focus:outline-none focus:border-[var(--color-accent)] transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center font-sans z-50 fixed inset-0 overflow-y-auto p-4 md:p-8 theme-bg">
      
      {/* Native Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-accent)]/15 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-warning)]/15 blur-[120px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      </div>

      {/* Main Container - Native Glassmorphism, NO SHADOWS */}
      <div className="w-full max-w-[460px] p-8 md:p-10 rounded-[2rem] bg-black/40 dark:bg-white/5 backdrop-blur-2xl border border-white/10 relative z-10 animate-fade-in-up">
        
        <button 
          onClick={() => onSuccess && onSuccess()}
          className="absolute top-6 right-6 theme-muted hover:theme-text transition-colors p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Minimalist DopaShop Header */}
        <div className="flex flex-col items-center mb-8 pt-2">
          <div className="bg-[var(--color-accent)]/20 w-20 h-20 rounded-full flex items-center justify-center border border-[var(--color-accent)]/30 mb-6">
            <Flame className="w-10 h-10 text-[var(--color-accent)] fill-current" />
          </div>
          <h1 className="text-3xl font-black font-display theme-text tracking-tight mb-2 text-center">
            {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h1>
          <p className="theme-text-secondary text-sm text-center">
            {mode === 'login' 
              ? 'Acesse sua conta para continuar.'
              : 'Junte-se ao hype da DopaShop.'
            }
          </p>
        </div>

        {/* ─── BANNER DE CONVITE ─── */}
        {mode === 'register' && (
          <div className="mb-6 p-4 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer" />
            <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2 mb-1">
              <Gift size={16} className="text-[var(--color-accent)]" />
              Bônus de Novo Jogador
            </h3>
            <p className="text-xs text-zinc-300">
              Comece com <span className="font-bold text-white">500 Dopas</span>. 
              {referralCode ? (
                <span className="text-[var(--color-accent)] font-bold"> +500 bônus de convite ativado!</span>
              ) : (
                <span> Use o link de um amigo para ganhar +500!</span>
              )}
            </p>
          </div>
        )}

        {/* Form with Native Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-20">
          
          {mode === 'register' && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 theme-muted" />
              <input 
                type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                className={inputClasses}
                placeholder="Nome de usuário"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 theme-muted" />
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className={inputClasses}
              placeholder="Seu melhor e-mail"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 theme-muted" />
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className={inputClasses}
              placeholder="Sua senha segura"
            />
          </div>

          {mode === 'register' && (
            <div className="relative">
              <Gift className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 theme-muted" />
              <input 
                type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value)}
                className={inputClasses}
                placeholder="Código de Indicação (Opcional)"
              />
            </div>
          )}

          {error && <div className="text-rose-500 text-sm font-medium bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 text-center animate-shake">{error}</div>}
          {successMsg && <div className="text-emerald-500 text-sm font-medium bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-center">{successMsg}</div>}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-[var(--color-accent)] hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all duration-300 mt-4 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {mode === 'login' ? 'Entrar Agora' : 'Criar Conta'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Native Social Buttons */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button onClick={() => handleSocialClick('Google')} type="button" className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-black/20 hover:bg-black/40 border border-white/5 hover:border-[var(--color-accent)]/50 transition-all font-bold text-sm theme-text cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button onClick={() => handleSocialClick('Apple')} type="button" className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-black/20 hover:bg-black/40 border border-white/5 hover:border-[var(--color-accent)]/50 transition-all font-bold text-sm theme-text cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
              </svg>
              Apple
            </button>
          </div>

          <div className="text-center text-sm theme-text-secondary">
            {mode === 'login' ? 'Ainda não é membro?' : 'Já possui uma conta?'}
            <button type="button" onClick={toggleMode} className="ml-1.5 font-bold text-[var(--color-accent)] hover:opacity-80 transition-opacity cursor-pointer">
              {mode === 'login' ? 'Criar agora' : 'Fazer login'}
            </button>
          </div>
        </div>

      </div>
      
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default AuthPage;
