-- ============================================================
-- ATUALIZAÇÃO DO BANCO DE DADOS (CORREÇÃO DE COLUNAS)
-- Acesse: https://supabase.com/dashboard > SQL Editor
-- Execute este script para garantir que todas as colunas existem
-- ============================================================

-- Adiciona a coluna image caso ela não exista
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='inventory' AND column_name='image') THEN
        ALTER TABLE public.inventory ADD COLUMN image text;
    END IF;
END $$;

-- Garante que outras colunas essenciais existem e estão com os tipos certos
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='inventory' AND column_name='item_name') THEN
        ALTER TABLE public.inventory ADD COLUMN item_name text NOT NULL DEFAULT 'Item';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='inventory' AND column_name='rarity_color') THEN
        ALTER TABLE public.inventory ADD COLUMN rarity_color text DEFAULT '#4b69ff';
    END IF;
END $$;
