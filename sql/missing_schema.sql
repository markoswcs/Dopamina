-- ============================================================
-- ATUALIZAÇÃO DO BANCO DE DADOS SUPABASE (RECURSOS SOCIAIS E LOCK)
-- Acesse: https://supabase.com/dashboard > SQL Editor
-- Execute este script para criar tudo o que falta para deixar o app funcional
-- ============================================================

-- 1. ADICIONAR COLUNA LOCK NO INVENTÁRIO (Se não existir)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='inventory' AND column_name='is_locked') THEN
        ALTER TABLE public.inventory ADD COLUMN is_locked boolean DEFAULT false;
    END IF;
END $$;

-- 1b. ADICIONAR COLUNAS FALTANTES NA TABELA PROFILES (Se já existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='bio') THEN
        ALTER TABLE public.profiles ADD COLUMN bio text DEFAULT 'Sem biografia.';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='wins') THEN
        ALTER TABLE public.profiles ADD COLUMN wins int DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='losses') THEN
        ALTER TABLE public.profiles ADD COLUMN losses int DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='streak') THEN
        ALTER TABLE public.profiles ADD COLUMN streak int DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='xp') THEN
        ALTER TABLE public.profiles ADD COLUMN xp int DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='level') THEN
        ALTER TABLE public.profiles ADD COLUMN level int DEFAULT 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='aura') THEN
        ALTER TABLE public.profiles ADD COLUMN aura int DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='total_spent') THEN
        ALTER TABLE public.profiles ADD COLUMN total_spent numeric DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='showcase_items') THEN
        ALTER TABLE public.profiles ADD COLUMN showcase_items uuid[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='cases_opened') THEN
        ALTER TABLE public.profiles ADD COLUMN cases_opened int DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='last_login') THEN
        ALTER TABLE public.profiles ADD COLUMN last_login date;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='action_data') THEN
        ALTER TABLE public.notifications ADD COLUMN action_data jsonb;
    END IF;
END $$;

-- 2. CRIAR TABELA DE PERFIS (PROFILES)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE,
  avatar_url text,
  bio text DEFAULT 'Sem biografia.',
  wins int DEFAULT 0,
  losses int DEFAULT 0,
  streak int DEFAULT 0,
  total_spent numeric DEFAULT 0,
  xp int DEFAULT 0,
  level int DEFAULT 1,
  aura int DEFAULT 0,
  showcase_items uuid[] DEFAULT '{}',
  cases_opened int DEFAULT 0,
  last_login date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 3. CRIAR TABELA DE BATALHAS (BATTLES)
CREATE TABLE IF NOT EXISTS public.battles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id uuid REFERENCES public.profiles(id) NOT NULL,
  guest_id uuid REFERENCES public.profiles(id),
  winner_id uuid REFERENCES public.profiles(id),
  entry_fee numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'waiting', -- waiting, active, finished
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Battles are viewable by everyone." ON public.battles;
CREATE POLICY "Battles are viewable by everyone." 
  ON public.battles FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can create battles." ON public.battles;
CREATE POLICY "Users can create battles." 
  ON public.battles FOR INSERT 
  WITH CHECK (auth.uid() = host_id);

DROP POLICY IF EXISTS "Users can update battles they are part of." ON public.battles;
CREATE POLICY "Users can update battles they are part of." 
  ON public.battles FOR UPDATE 
  USING (auth.uid() = host_id OR auth.uid() = guest_id OR guest_id IS NULL);

-- 4. CRIAR TABELA DE AMIGOS (FRIENDS)
CREATE TABLE IF NOT EXISTS public.friends (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  friend_id uuid REFERENCES public.profiles(id) NOT NULL,
  status text DEFAULT 'pending', -- pending, accepted
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their friends." ON public.friends;
CREATE POLICY "Users can view their friends." 
  ON public.friends FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

DROP POLICY IF EXISTS "Users can add friends." ON public.friends;
CREATE POLICY "Users can add friends." 
  ON public.friends FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);

DROP POLICY IF EXISTS "Users can update friend requests." ON public.friends;
CREATE POLICY "Users can update friend requests." 
  ON public.friends FOR UPDATE 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

DROP POLICY IF EXISTS "Users can remove friends." ON public.friends;
CREATE POLICY "Users can remove friends." 
  ON public.friends FOR DELETE 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- 5. CRIAR TABELA DE NOTIFICAÇÕES (NOTIFICATIONS)
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type text NOT NULL, -- item_won, battle_invite, friend_request
  message text NOT NULL,
  image_url text,
  action_data jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications." ON public.notifications;
CREATE POLICY "Users can view their own notifications." 
  ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System/Users can insert notifications." ON public.notifications;
CREATE POLICY "System/Users can insert notifications." 
  ON public.notifications FOR INSERT 
  WITH CHECK (true); -- Permitindo que clientes criem notificações

DROP POLICY IF EXISTS "Users can update their notifications (e.g., mark as read)." ON public.notifications;
CREATE POLICY "Users can update their notifications (e.g., mark as read)." 
  ON public.notifications FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their notifications." ON public.notifications;
CREATE POLICY "Users can delete their notifications." 
  ON public.notifications FOR DELETE 
  USING (auth.uid() = user_id);

-- 6. CRIAR TABELA DE MENSAGENS DIRETA (DIRECT_MESSAGES)
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid REFERENCES public.profiles(id) NOT NULL,
  receiver_id uuid REFERENCES public.profiles(id) NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can see messages they sent or received." ON public.direct_messages;
CREATE POLICY "Users can see messages they sent or received."
  ON public.direct_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can insert messages." ON public.direct_messages;
CREATE POLICY "Users can insert messages."
  ON public.direct_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);


-- 7. CRIAR TABELA DE REFERRALS (SISTEMA DE CONVITES)
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id uuid REFERENCES auth.users(id) NOT NULL,
  referred_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  status text DEFAULT 'pending', -- 'pending', 'completed', 'limit_reached'
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their referrals" ON public.referrals;
CREATE POLICY "Users can view their referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

DROP POLICY IF EXISTS "Users can insert their own referral" ON public.referrals;
CREATE POLICY "Users can insert their own referral"
  ON public.referrals FOR INSERT
  WITH CHECK (auth.uid() = referred_id);

-- FUNÇÃO RPC PARA RESGATAR RECOMPENSA DE CONVITE
CREATE OR REPLACE FUNCTION public.claim_referral_reward()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_referral record;
  v_email_confirmed boolean;
  v_completed_count int;
  v_user_id uuid;
  v_referrer_username text;
  v_referred_username text;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN 'Usuário não autenticado.';
  END IF;

  SELECT * INTO v_referral
  FROM public.referrals
  WHERE referred_id = v_user_id AND status = 'pending'
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN 'Nenhum convite pendente encontrado.';
  END IF;

  SELECT (email_confirmed_at IS NOT NULL) INTO v_email_confirmed
  FROM auth.users
  WHERE id = v_user_id;

  IF NOT v_email_confirmed THEN
    RETURN 'E-mail não confirmado. Confirme seu e-mail primeiro.';
  END IF;

  SELECT count(*) INTO v_completed_count
  FROM public.referrals
  WHERE referrer_id = v_referral.referrer_id
    AND status = 'completed'
    AND created_at >= (now() - interval '7 days');

  IF v_completed_count >= 3 THEN
    UPDATE public.referrals
    SET status = 'limit_reached'
    WHERE id = v_referral.id;
    RETURN 'O usuário que te convidou já atingiu o limite semanal.';
  END IF;

  -- Fetch usernames for notifications
  SELECT username INTO v_referrer_username FROM public.profiles WHERE id = v_referral.referrer_id;
  SELECT username INTO v_referred_username FROM public.profiles WHERE id = v_user_id;

  -- Add coins for referrer
  IF EXISTS (SELECT 1 FROM public.user_balance WHERE user_id = v_referral.referrer_id) THEN
    UPDATE public.user_balance SET coins = coins + 500 WHERE user_id = v_referral.referrer_id;
  ELSE
    INSERT INTO public.user_balance (user_id, coins) VALUES (v_referral.referrer_id, 1000);
  END IF;
  
  -- Add coins for referred
  IF EXISTS (SELECT 1 FROM public.user_balance WHERE user_id = v_user_id) THEN
    UPDATE public.user_balance SET coins = coins + 500 WHERE user_id = v_user_id;
  ELSE
    INSERT INTO public.user_balance (user_id, coins) VALUES (v_user_id, 1000);
  END IF;

  UPDATE public.referrals
  SET status = 'completed'
  WHERE id = v_referral.id;

  -- Insert Notification for Referrer
  INSERT INTO public.notifications (user_id, message, type, action_data)
  VALUES (
    v_referral.referrer_id,
    v_referred_username || ' confirmou a conta e você ganhou 500 Dopas! Deseja adicionar ' || v_referred_username || ' aos amigos?',
    'referral_friend',
    jsonb_build_object('target_user_id', v_user_id, 'target_username', v_referred_username)
  );

  -- Insert Notification for Referred
  INSERT INTO public.notifications (user_id, message, type, action_data)
  VALUES (
    v_user_id,
    'Você ganhou 500 Dopas bônus por usar o convite de ' || v_referrer_username || '! Deseja adicionar ' || v_referrer_username || ' aos amigos?',
    'referral_friend',
    jsonb_build_object('target_user_id', v_referral.referrer_id, 'target_username', v_referrer_username)
  );

  RETURN 'SUCESSO';
END;
$$;
