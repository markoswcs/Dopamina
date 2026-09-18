-- ============================================================
-- SCRIPT DE EMERGÊNCIA: RESET DO SALDO (user_balance)
-- Acesse: https://supabase.com/dashboard > SQL Editor
-- ============================================================

-- Garante que a tabela de saldo existe
CREATE TABLE IF NOT EXISTS public.user_balance (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  coins numeric(15,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Apaga todas as regras antigas que podem estar bloqueando a leitura/gravação do saldo
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'user_balance' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_balance', pol.policyname);
    END LOOP;
END $$;

-- Habilita segurança
ALTER TABLE public.user_balance ENABLE ROW LEVEL SECURITY;

-- Cria regras 100% livres de bloqueio para o próprio usuário
CREATE POLICY "balance_select" ON public.user_balance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "balance_insert" ON public.user_balance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "balance_update" ON public.user_balance FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Confirmação
SELECT 'Reset do Saldo concluído!' as status;
