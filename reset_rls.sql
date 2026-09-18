-- ============================================================
-- SCRIPT DE EMERGÊNCIA: RESET TOTAL DE SEGURANÇA (RLS)
-- Acesse: https://supabase.com/dashboard > SQL Editor
-- Execute isto para consertar definitivamente o erro de RLS
-- ============================================================

-- 1. Garante que as colunas existem (para não dar erro de coluna faltando)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='inventory' AND column_name='image') THEN
        ALTER TABLE public.inventory ADD COLUMN image text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='inventory' AND column_name='item_name') THEN
        ALTER TABLE public.inventory ADD COLUMN item_name text NOT NULL DEFAULT 'Item';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='inventory' AND column_name='rarity_color') THEN
        ALTER TABLE public.inventory ADD COLUMN rarity_color text DEFAULT '#4b69ff';
    END IF;
END $$;

-- 2. Apaga TODAS as políticas antigas da tabela inventory (não importa o nome)
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'inventory' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.inventory', pol.policyname);
    END LOOP;
END $$;

-- 3. Habilita o RLS
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- 4. Cria as novas políticas absolutas (PERMISSIVE)
CREATE POLICY "inventory_select_all" ON public.inventory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "inventory_insert_all" ON public.inventory
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "inventory_update_all" ON public.inventory
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "inventory_delete_all" ON public.inventory
  FOR DELETE USING (auth.uid() = user_id);

-- Confirmação
SELECT 'Reset de políticas concluído com sucesso!' as status;
