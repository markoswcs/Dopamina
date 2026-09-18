const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://kdsqmjalvnmxgkhyngzc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkc3FtamFsdm5teGdraHluZ3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MzYzMjEsImV4cCI6MjEwMDMxMjMyMX0.pl8ILY3WBhxR3dmOnoaivNrT4yGiT7ygz07VwwN4gdM'
);

async function checkRLS() {
  console.log('Testando inserção anônima...');
  const fakeUserId = '00000000-0000-0000-0000-000000000001';
  
  const { data, error } = await supabase.from('inventory').insert({
    user_id: fakeUserId,
    item_id: 'test',
    item_name: 'test',
    price: 0
  }).select();

  if (error) {
    console.log('Erro ao inserir:', error.message);
  } else {
    console.log('Inseriu com sucesso!', data);
    await supabase.from('inventory').delete().eq('id', data[0].id);
  }
}

checkRLS();
