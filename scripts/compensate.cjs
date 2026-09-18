
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // Pega o id do usuario que abriu a caixa recentemente
  const { data } = await supabase.from('daily_cases').select('user_id').limit(1);
  if (!data || data.length === 0) {
    console.log("Usuário não encontrado.");
    return;
  }
  
  const userId = data[0].user_id;

  const compensationItems = [
    {
      user_id: userId,
      item_id: 'comp-1',
      item_name: '★ Butterfly Knife | Fade',
      price: 3500.00,
      count: 1,
      icon: '🔪',
      rarity_color: 'border-yellow-400 bg-yellow-900/30 text-yellow-400'
    },
    {
      user_id: userId,
      item_id: 'comp-2',
      item_name: 'AWP | Dragon Lore',
      price: 15000.00,
      count: 1,
      icon: '🔫',
      rarity_color: 'border-red-500 bg-red-900/20 text-red-400'
    }
  ];

  for (const item of compensationItems) {
    await supabase.from('inventory').insert(item);
  }
  console.log("Os dois itens lendarios foram adicionados como pedido de desculpas!");
  
  // Reseta o daily_cases para permitir abrir de novo tambem
  await supabase.from('daily_cases').delete().eq('user_id', userId);
}

main();
