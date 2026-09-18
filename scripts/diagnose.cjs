const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://kdsqmjalvnmxgkhyngzc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkc3FtamFsdm5teGdraHluZ3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MzYzMjEsImV4cCI6MjEwMDMxMjMyMX0.pl8ILY3WBhxR3dmOnoaivNrT4yGiT7ygz07VwwN4gdM'
);

async function diagnose() {
  console.log('=== DIAGNÓSTICO AVANÇADO ===\n');
  const fakeUserId = '00000000-0000-0000-0000-000000000001';

  // 3. Testar inserção no inventory com UUID fake
  console.log('1. Testando INSERT no inventory...');
  const { data: insertData, error: insertErr } = await supabase.from('inventory').insert({
    user_id: fakeUserId,
    item_id: 'test-diagnose',
    item_name: 'AWP | Asiimov',
    price: 150.00,
    count: 1,
    icon: '🔫',
    rarity_color: '#eb4b4b'
  }).select();
  
  if (insertErr) {
    console.error('   ERRO INSERT:', insertErr.message);
    console.error('   Code:', insertErr.code);
    console.error('   Details:', insertErr.details);
    console.error('   Hint:', insertErr.hint);
  } else {
    console.log('   INSERT funcionou! ID:', insertData[0]?.id);
    await supabase.from('inventory').delete().eq('id', insertData[0].id);
    console.log('   Limpeza feita.');
  }

  // 4. Verificar SELECT inventory
  console.log('\n2. Verificando SELECT inventory...');
  const { data: invData, error: invErr } = await supabase.from('inventory').select('*').limit(10);
  if (invErr) {
    console.error('   ERRO SELECT inventory:', invErr.message);
  } else {
    console.log(`   SELECT ok - ${invData.length} registros visíveis`);
  }

  // 5. Testar UPSERT no daily_cases
  console.log('\n3. Testando UPSERT no daily_cases...');
  const { data: upsertData, error: upsertErr } = await supabase.from('daily_cases').upsert({
    user_id: fakeUserId,
    last_opened_at: new Date().toISOString()
  }, { onConflict: 'user_id' }).select();
  
  if (upsertErr) {
    console.error('   ERRO UPSERT daily_cases:', upsertErr.message);
    console.error('   Code:', upsertErr.code);
    console.error('   Details:', upsertErr.details);
    console.error('   Hint:', upsertErr.hint);
  } else {
    console.log('   UPSERT daily_cases OK!', JSON.stringify(upsertData));
    await supabase.from('daily_cases').delete().eq('user_id', fakeUserId);
  }

  // 6. Testar SELECT daily_cases
  console.log('\n4. SELECT daily_cases...');
  const { data: dcData, error: dcErr } = await supabase.from('daily_cases').select('*').limit(5);
  if (dcErr) {
    console.error('   ERRO SELECT daily_cases:', dcErr.message, dcErr.code);
  } else {
    console.log(`   OK - ${dcData.length} registros`);
    if (dcData.length > 0) console.log('   Colunas:', Object.keys(dcData[0]).join(', '));
  }

  console.log('\n=== FIM ===');
}

diagnose().catch(console.error);
