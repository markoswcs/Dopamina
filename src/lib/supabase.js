import { createClient } from '@supabase/supabase-js';

// Usaremos variáveis de ambiente no futuro, mas por enquanto,
// para evitar que o site quebre caso você ainda não tenha o projeto Supabase criado,
// usaremos valores fictícios que não vão crashar o app.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sua-url-aqui.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua-chave-anon-aqui';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
