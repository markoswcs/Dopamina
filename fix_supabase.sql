-- ============================================================
-- EXECUTE ESTE SQL NO SUPABASE SQL EDITOR
-- Acesse: https://supabase.com/dashboard > SQL Editor
-- ============================================================

-- 1. Criar tabela inventory (se não existir)
CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  item_id text NOT NULL DEFAULT '',
  item_name text NOT NULL DEFAULT 'Item',
  price numeric(10,2) DEFAULT 0,
  count integer DEFAULT 1,
  icon text DEFAULT '📦',
  rarity_color text DEFAULT '#4b69ff',
  image text,
  created_at timestamptz DEFAULT now()
);

-- 2. Criar tabela daily_cases (se não existir)
CREATE TABLE IF NOT EXISTS public.daily_cases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  last_opened_at timestamptz,
  current_streak integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT daily_cases_user_id_key UNIQUE (user_id)
);

-- 3. Criar tabela user_balance (se não existir)
CREATE TABLE IF NOT EXISTS public.user_balance (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  coins numeric(15,2) DEFAULT 1000,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT user_balance_user_id_key UNIQUE (user_id)
);

-- 4. Ativar RLS
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_balance ENABLE ROW LEVEL SECURITY;

-- 5. Remover políticas antigas
DROP POLICY IF EXISTS "inventory_select" ON public.inventory;
DROP POLICY IF EXISTS "inventory_insert" ON public.inventory;
DROP POLICY IF EXISTS "inventory_update" ON public.inventory;
DROP POLICY IF EXISTS "inventory_delete" ON public.inventory;
DROP POLICY IF EXISTS "Users can view own inventory" ON public.inventory;
DROP POLICY IF EXISTS "Users can insert own inventory" ON public.inventory;
DROP POLICY IF EXISTS "Users can update own inventory" ON public.inventory;
DROP POLICY IF EXISTS "Users can delete own inventory" ON public.inventory;

DROP POLICY IF EXISTS "daily_cases_select" ON public.daily_cases;
DROP POLICY IF EXISTS "daily_cases_insert" ON public.daily_cases;
DROP POLICY IF EXISTS "daily_cases_update" ON public.daily_cases;
DROP POLICY IF EXISTS "Users can view own daily_cases" ON public.daily_cases;
DROP POLICY IF EXISTS "Users can insert own daily_cases" ON public.daily_cases;
DROP POLICY IF EXISTS "Users can update own daily_cases" ON public.daily_cases;
DROP POLICY IF EXISTS "Users can upsert own daily_cases" ON public.daily_cases;

DROP POLICY IF EXISTS "balance_select" ON public.user_balance;
DROP POLICY IF EXISTS "balance_insert" ON public.user_balance;
DROP POLICY IF EXISTS "balance_update" ON public.user_balance;

-- 6. Criar políticas RLS para inventory
CREATE POLICY "inventory_select" ON public.inventory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "inventory_insert" ON public.inventory
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "inventory_update" ON public.inventory
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "inventory_delete" ON public.inventory
  FOR DELETE USING (auth.uid() = user_id);

-- 7. Criar políticas RLS para daily_cases
CREATE POLICY "daily_cases_select" ON public.daily_cases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "daily_cases_insert" ON public.daily_cases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_cases_update" ON public.daily_cases
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 8. Criar políticas RLS para user_balance
CREATE POLICY "balance_select" ON public.user_balance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "balance_insert" ON public.user_balance
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "balance_update" ON public.user_balance
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 9. Verificar resultado
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('inventory', 'daily_cases', 'user_balance')
ORDER BY tablename, policyname;
