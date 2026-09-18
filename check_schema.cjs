const https = require('https');
const url = 'https://kdsqmjalvnmxgkhyngzc.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkc3FtamFsdm5teGdraHluZ3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MzYzMjEsImV4cCI6MjEwMDMxMjMyMX0.pl8ILY3WBhxR3dmOnoaivNrT4yGiT7ygz07VwwN4gdM';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const swagger = JSON.parse(data);
      console.log('--- DEFINITIONS KEYS ---');
      console.log(Object.keys(swagger.definitions || {}));
      
      const inv = swagger.definitions?.inventory;
      if (inv) {
         console.log('\n--- INVENTORY COLUMNS ---');
         console.log(Object.keys(inv.properties));
      } else {
         console.log('Tabela inventory NÃO ENCONTRADA no Swagger. Isso significa que RLS SELECT está bloqueando (anon não pode ler) ou a tabela não existe.');
      }
    } catch (e) {
      console.error('Erro:', e.message);
    }
  });
}).on('error', e => console.error(e));
