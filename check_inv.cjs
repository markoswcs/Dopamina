const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://kdsqmjalvnmxgkhyngzc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkc3FtamFsdm5teGdraHluZ3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MzYzMjEsImV4cCI6MjEwMDMxMjMyMX0.pl8ILY3WBhxR3dmOnoaivNrT4yGiT7ygz07VwwN4gdM'
);

async function checkInventory() {
  console.log('Verificando itens no inventário...');
  const { data, error } = await supabase.from('inventory').select('*');
  if (error) {
    console.error('Erro:', error);
  } else {
    console.log(`Total de itens: ${data.length}`);
    if (data.length > 0) {
      console.log('Últimos 5 itens inseridos:');
      console.log(data.slice(-5).map(i => `${i.item_name} (x${i.count}) - User: ${i.user_id}`));
    }
  }
}

checkInventory();
