const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY; 
const CS2_API_KEY = process.env.CS2_SH_API_KEY;

if (!CS2_API_KEY) {
  console.error("ERRO: Chave da API cs2.sh não encontrada! Adicione CS2_SH_API_KEY=sua_chave no arquivo .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BRL_EXCHANGE_RATE = 5.50; // Taxa de conversão fixa USD -> BRL para estabilidade no mercado do site

async function syncItems() {
  console.log("Iniciando sincronização com a API cs2.sh...");

  try {
    // 1. Fetch Schema (Catálogo de itens)
    console.log("Buscando esquema de itens (schema)...");
    const schemaRes = await fetch("https://api.cs2.sh/v1/schema", {
      headers: {
        "Authorization": `Bearer ${CS2_API_KEY}`,
        "Accept-Encoding": "gzip"
      }
    });

    if (!schemaRes.ok) {
      throw new Error(`Falha ao buscar schema: ${schemaRes.status} ${schemaRes.statusText}`);
    }
    const schema = await schemaRes.json();
    console.log(`Sucesso: ${Object.keys(schema).length} itens encontrados no schema.`);

    // 2. Fetch Prices (Preços de mercado reais)
    console.log("Buscando preços atualizados (prices/latest)...");
    const pricesRes = await fetch("https://api.cs2.sh/v1/prices/latest", {
      headers: {
        "Authorization": `Bearer ${CS2_API_KEY}`,
        "Accept-Encoding": "gzip"
      }
    });

    if (!pricesRes.ok) {
      throw new Error(`Falha ao buscar preços: ${pricesRes.status} ${pricesRes.statusText}`);
    }
    const prices = await pricesRes.json();
    console.log(`Sucesso: Preços baixados.`);

    // 3. Merging and formatting
    console.log("Cruzando dados e convertendo preços para BRL...");
    const itemsArray = [];
    
    for (const [hashName, itemData] of Object.entries(schema)) {
      // Find price
      const priceData = prices[hashName];
      let itemPrice = 0;

      if (priceData && priceData.ask) {
        itemPrice = priceData.ask * BRL_EXCHANGE_RATE;
      } else if (priceData && priceData.bid) {
        itemPrice = priceData.bid * BRL_EXCHANGE_RATE;
      }

      // Só vamos adicionar itens que tenham um preço no mercado
      if (itemPrice > 0) {
        itemsArray.push({
          id: `cs2-${Buffer.from(hashName).toString('base64').substring(0, 16)}`,
          name: hashName,
          description: itemData.description || "",
          rarity: itemData.rarity || "Base Grade",
          rarity_color: itemData.color || "#b0c3d9",
          image: itemData.image || "",
          price: parseFloat(itemPrice.toFixed(2)),
          type: itemData.type || "weapon"
        });
      }
    }

    console.log(`Total de itens válidos para o banco de dados: ${itemsArray.length}`);

    // Como o usuário deseja "trazer todos os itens", e não sabemos as permissões exatas da tabela cs2_items (se existe)
    // vamos primeiro tentar inserir no Supabase. Se falhar por RLS, avisamos, mas também geramos o arquivo local
    // que o sistema pode usar imediatamente.

    console.log("Tentando inserção no banco de dados Supabase (tabela cs2_items)...");
    const BATCH_SIZE = 500;
    let supabaseSuccess = false;
    
    // Tentar o primeiro lote para ver se a tabela existe/tem permissão
    const { error: testError } = await supabase.from('cs2_items').upsert(itemsArray.slice(0, 1), { onConflict: 'name' });
    
    if (testError) {
      console.warn("AVISO: Não foi possível escrever no Supabase. (Possível RLS ativado, tabela ausente, ou falta de permissão).");
      console.warn("Erro recebido:", testError.message);
      console.warn("O script continuará para gerar o banco de dados local...");
    } else {
      supabaseSuccess = true;
      for (let i = 0; i < itemsArray.length; i += BATCH_SIZE) {
        const batch = itemsArray.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('cs2_items').upsert(batch, { onConflict: 'name' });
        if (error) console.error(`Erro ao inserir lote ${i}:`, error.message);
      }
      console.log("Inserção no Supabase concluída!");
    }

    // 4. Salvar como arquivo de dados para que o sistema possa operar independentemente (já que foi o que o usuário exigiu "AGORA")
    const localDataPath = path.resolve(__dirname, '../src/data/cs2Items.js');
    console.log(`Sobrescrevendo o banco de dados local em ${localDataPath} com os itens e preços REAIS.`);
    
    fs.writeFileSync(
      localDataPath, 
      `export const cs2Items = ${JSON.stringify(itemsArray, null, 2)};\n`
    );

    console.log("Sincronização concluída com sucesso! Os itens reais do CS2 estão agora disponíveis na plataforma.");

  } catch (error) {
    console.error("Erro durante a sincronização:", error);
  }
}

syncItems();
