const http = require('http');

function checkSite(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, ok: res.statusCode < 400, data: data.substring(0, 200) }));
    });
    req.on('error', (e) => reject(e));
    req.setTimeout(5000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function main() {
  console.log('=== VERIFICANDO O SITE ===\n');
  
  // Verificar se o dev server está rodando
  try {
    const result = await checkSite('http://localhost:5173');
    console.log(`✅ Dev server rodando! Status: ${result.status}`);
    console.log(`Preview do HTML: ${result.data.substring(0, 100)}...`);
  } catch (e) {
    console.log(`❌ Dev server NÃO está respondendo: ${e.message}`);
    console.log('   Você precisa rodar: npm run dev');
  }
  
  // Verificar Supabase
  const https = require('https');
  console.log('\nVerificando conexão com Supabase...');
  
  const supabaseUrl = 'https://kdsqmjalvnmxgkhyngzc.supabase.co/rest/v1/inventory?select=count&limit=1';
  const req = https.get(supabaseUrl, {
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkc3FtamFsdm5teGdraHluZ3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MzYzMjEsImV4cCI6MjEwMDMxMjMyMX0.pl8ILY3WBhxR3dmOnoaivNrT4yGiT7ygz07VwwN4gdM',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkc3FtamFsdm5teGdraHluZ3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MzYzMjEsImV4cCI6MjEwMDMxMjMyMX0.pl8ILY3WBhxR3dmOnoaivNrT4yGiT7ygz07VwwN4gdM'
    }
  }, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      console.log(`Status Supabase: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log('✅ Supabase acessível!');
        console.log('   Resposta:', data);
      } else {
        console.log('⚠️ Resposta inesperada:', res.statusCode, data);
      }
    });
  });
  req.on('error', e => console.log('❌ Erro Supabase:', e.message));

  // Verificar tabela daily_cases
  setTimeout(() => {
    const req2 = https.get('https://kdsqmjalvnmxgkhyngzc.supabase.co/rest/v1/daily_cases?select=count&limit=1', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkc3FtamFsdm5teGdraHluZ3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MzYzMjEsImV4cCI6MjEwMDMxMjMyMX0.pl8ILY3WBhxR3dmOnoaivNrT4yGiT7ygz07VwwN4gdM',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkc3FtamFsdm5teGdraHluZ3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MzYzMjEsImV4cCI6MjEwMDMxMjMyMX0.pl8ILY3WBhxR3dmOnoaivNrT4yGiT7ygz07VwwN4gdM'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        console.log(`\nTabela daily_cases - Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log('✅ daily_cases acessível!');
        } else {
          console.log('❌ daily_cases NÃO existe ou erro:', data);
        }
      });
    });
    req2.on('error', e => console.log('❌ Erro:', e.message));
  }, 500);

  // Verificar user_balance  
  setTimeout(() => {
    const req3 = https.get('https://kdsqmjalvnmxgkhyngzc.supabase.co/rest/v1/user_balance?select=count&limit=1', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkc3FtamFsdm5teGdraHluZ3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MzYzMjEsImV4cCI6MjEwMDMxMjMyMX0.pl8ILY3WBhxR3dmOnoaivNrT4yGiT7ygz07VwwN4gdM',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkc3FtamFsdm5teGdraHluZ3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MzYzMjEsImV4cCI6MjEwMDMxMjMyMX0.pl8ILY3WBhxR3dmOnoaivNrT4yGiT7ygz07VwwN4gdM'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        console.log(`\nTabela user_balance - Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log('✅ user_balance acessível!');
        } else {
          console.log('❌ user_balance NÃO existe ou erro:', data);
        }
        console.log('\n=== CONCLUSÃO ===');
        if (res.statusCode !== 200) {
          console.log('⚠️  O SQL do fix_supabase.sql ainda NÃO foi executado!');
          console.log('   Execute-o no: https://supabase.com/dashboard > SQL Editor');
        } else {
          console.log('✅ Banco de dados configurado corretamente!');
        }
      });
    });
    req3.on('error', e => console.log('❌ Erro:', e.message));
  }, 1000);
}

main();
