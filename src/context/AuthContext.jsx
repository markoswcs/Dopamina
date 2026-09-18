import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setToken(session?.access_token || null);
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token || null);
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (authUser) => {
    try {
      // Fetch profile data (username, avatar, etc.)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, avatar_url, bio, wins, losses, streak, xp, level, aura, total_spent, last_login')
        .eq('id', authUser.id)
        .single();

      let currentStreak = profileData?.streak || 0;
      
      if (profileData) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        
        let shouldUpdate = false;
        
        // Formato seguro YYYY-MM-DD no fuso horário local
        const localDateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        if (profileData.last_login) {
          // Extrai apenas YYYY, MM, DD com segurança para evitar o shift de -3h do Brasil
          const datePart = profileData.last_login.split('T')[0];
          const [yyyy, mm, dd] = datePart.split('-');
          const lastDay = new Date(Number(yyyy), Number(mm) - 1, Number(dd)).getTime();
          
          const diffDays = Math.round((today - lastDay) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            currentStreak += 1;
            shouldUpdate = true;
          } else if (diffDays > 1) {
            currentStreak = 1;
            shouldUpdate = true;
          } else if (diffDays < 0) {
            // Em caso de erro de fuso extremo no passado, força update
            shouldUpdate = true;
          }
        } else {
          currentStreak = 1;
          shouldUpdate = true;
        }

        if (shouldUpdate || !profileData.last_login) {
          await supabase.from('profiles').update({
            streak: currentStreak,
            last_login: localDateString // Salva exatamente o dia local
          }).eq('id', authUser.id);
        }
      }

      // Auto-create profile if it doesn't exist
      if (!profileData) {
        const defaultUsername = authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'Jogador';
        await supabase.from('profiles').insert({
          id: authUser.id,
          username: defaultUsername,
        });

        // Handle referral registration & Auto-claim
        const referralCodeRaw = authUser.user_metadata?.referral_code;
        if (referralCodeRaw) {
          let actualReferrerId = referralCodeRaw;
          
          if (referralCodeRaw.includes('-')) {
            const [uname, short] = referralCodeRaw.split('-');
            const { data: candidates } = await supabase.from('profiles').select('id').eq('username', uname);
            if (candidates && candidates.length > 0) {
              const match = candidates.find(c => c.id.toLowerCase().startsWith(short.toLowerCase()));
              if (match) actualReferrerId = match.id;
            }
          }
          
          // Attempt to insert into referrals table
          const { error: refErr } = await supabase.from('referrals').insert({
            referrer_id: actualReferrerId,
            referred_id: authUser.id,
            status: 'pending'
          });
          
          if (!refErr) {
             // Immediately auto-claim the reward so users don't have to manually do it
             await supabase.rpc('claim_referral_reward');
          }
        }
      }

      // Fetch balance
      const { data: balanceData } = await supabase
        .from('user_balance')
        .select('coins')
        .eq('user_id', authUser.id)
        .single();

      let coins = 500;
      if (balanceData) {
        coins = balanceData.coins;
      } else {
        // Create initial balance
        const { data: newBalance } = await supabase
          .from('user_balance')
          .insert({ user_id: authUser.id, coins: 500 })
          .select()
          .single();
        if (newBalance) coins = newBalance.coins;
      }

      setUser({
        ...authUser,
        username: profileData?.username || authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'Jogador',
        avatar_url: profileData?.avatar_url || null,
        bio: profileData?.bio || 'Sem biografia.',
        wins: profileData?.wins || 0,
        losses: profileData?.losses || 0,
        streak: currentStreak,
        xp: profileData?.xp || 0,
        level: profileData?.level || 1,
        aura: profileData?.aura || 0,
        total_spent: Number(profileData?.total_spent) || 0,
        coins,
      });
    } catch (e) {
      console.error('Erro ao buscar dados do usuário:', e);
      setUser({ ...authUser, coins: 500 });
    } finally {
      setLoading(false);
    }
  };

  const refreshBalance = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_balance')
      .select('coins')
      .eq('user_id', user.id)
      .single();
    if (data) setUser(prev => prev ? { ...prev, coins: data.coins } : prev);
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, message: error.message };
    return { success: true, user: data.user, token: data.session?.access_token };
  };

  const register = async (email, password, username, referralCode) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username, referral_code: referralCode } }
    });
    if (error) return { success: false, message: error.message };
    return { success: true, user: data.user, token: data.session?.access_token };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setToken(null);
  };

  const updateBalance = (newBalance) => setUser(prev => prev ? { ...prev, coins: newBalance } : prev);

  // Called whenever the user spends coins — persists total_spent on profiles
  const addSpending = async (amount) => {
    if (!amount || amount <= 0) return;
    setUser(prev => {
      if (!prev) return prev;
      const newTotal = (prev.total_spent || 0) + amount;
      supabase.from('profiles').update({ total_spent: newTotal }).eq('id', prev.id);
      return { ...prev, total_spent: newTotal };
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateBalance, refreshBalance, addSpending }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
