-- Execute este script no SQL Editor do seu painel do Supabase

CREATE TABLE IF NOT EXISTS cs2_items (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  rarity TEXT,
  rarity_color TEXT,
  image TEXT,
  price NUMERIC NOT NULL,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS
ALTER TABLE cs2_items ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública (qualquer um pode ler os itens)
CREATE POLICY "Itens são públicos para leitura"
ON cs2_items FOR SELECT
USING (true);

-- Política de inserção (apenas Service Role ou usuários autenticados específicos)
-- NOTA: O script node.js precisa da SERVICE_ROLE_KEY no .env para conseguir fazer o upsert se o RLS bloquear.
-- Alternativamente, remova o ENABLE ROW LEVEL SECURITY acima se for um projeto de testes interno.
