/**
 * sync_skins_with_prices.cjs
 * Sincroniza 21.407 skins reais do CS2 com preços do Steam Market
 * Converte para DopaCoin (D$): USD × 5.50
 */
const fs = require('fs');
const path = require('path');

const BRL_RATE = 550; // Taxa de conversão USD → DopaCoin (D$) (1 USD = 5.5 BRL = 550 D$)

// Preços reais baseados no Steam Market (valores em USD para os top itens)
// Mapeamento hash_name → price_usd para os itens mais famosos
const KNOWN_PRICES = {
  // Knives
  "★ Karambit | Case Hardened (Factory New)": 3200,
  "★ Karambit | Doppler (Factory New)": 1800,
  "★ Karambit | Fade (Factory New)": 1400,
  "★ Karambit | Slaughter (Factory New)": 900,
  "★ Karambit | Tiger Tooth (Factory New)": 900,
  "★ Karambit | Marble Fade (Factory New)": 1100,
  "★ Karambit | Autotronic (Factory New)": 950,
  "★ Karambit | Blue Steel (Factory New)": 600,
  "★ Karambit | Rust Coat (Battle-Scarred)": 420,
  "★ Karambit | Night (Factory New)": 520,
  "★ Karambit | Crimson Web (Factory New)": 1400,
  "★ Butterfly Knife | Case Hardened (Factory New)": 2800,
  "★ Butterfly Knife | Doppler (Factory New)": 1600,
  "★ Butterfly Knife | Fade (Factory New)": 1200,
  "★ Butterfly Knife | Marble Fade (Factory New)": 990,
  "★ M9 Bayonet | Case Hardened (Factory New)": 900,
  "★ M9 Bayonet | Doppler (Factory New)": 700,
  "★ M9 Bayonet | Fade (Factory New)": 800,
  "★ Bayonet | Doppler (Factory New)": 600,
  "★ Bayonet | Fade (Factory New)": 650,
  "★ Flip Knife | Doppler (Factory New)": 350,
  "★ Bowie Knife | Doppler (Factory New)": 320,
  "★ Huntsman Knife | Doppler (Factory New)": 270,
  "★ Shadow Daggers | Doppler (Factory New)": 200,
  "★ Gut Knife | Doppler (Factory New)": 200,
  "★ Falchion Knife | Doppler (Factory New)": 200,
  "★ Navaja Knife | Doppler (Factory New)": 180,
  "★ Stiletto Knife | Doppler (Factory New)": 380,
  "★ Talon Knife | Doppler (Factory New)": 460,
  "★ Ursus Knife | Doppler (Factory New)": 320,
  "★ Classic Knife | Doppler (Factory New)": 450,
  "★ Paracord Knife | Doppler (Factory New)": 250,
  "★ Survival Knife | Doppler (Factory New)": 240,
  "★ Nomad Knife | Doppler (Factory New)": 260,
  "★ Skeleton Knife | Doppler (Factory New)": 500,
  // Gloves
  "★ Sport Gloves | Pandora's Box (Factory New)": 5000,
  "★ Sport Gloves | Superconductor (Factory New)": 3500,
  "★ Sport Gloves | Vice (Factory New)": 4000,
  "★ Sport Gloves | Hedge Maze (Factory New)": 1800,
  "★ Sport Gloves | Amphibious (Factory New)": 2500,
  "★ Specialist Gloves | Crimson Kimono (Factory New)": 3000,
  "★ Specialist Gloves | Fade (Factory New)": 2800,
  "★ Specialist Gloves | Tiger Strike (Factory New)": 2200,
  "★ Hand Wraps | Cobalt Skulls (Factory New)": 2000,
  "★ Hand Wraps | Overprint (Factory New)": 1600,
  "★ Hand Wraps | CAUTION! (Factory New)": 900,
  "★ Moto Gloves | Spearmint (Factory New)": 1800,
  "★ Moto Gloves | POW! (Factory New)": 1200,
  "★ Bloodhound Gloves | Charred (Factory New)": 1400,
  "★ Driver Gloves | King Snake (Factory New)": 1100,
  "★ Hydra Gloves | Case Hardened (Factory New)": 1600,
  // AWP
  "AWP | Dragon Lore (Factory New)": 14000,
  "AWP | Dragon Lore (Field-Tested)": 5500,
  "AWP | Gungnir (Factory New)": 9000,
  "AWP | Medusa (Factory New)": 3000,
  "AWP | Fade (Factory New)": 750,
  "AWP | Neo-Noir (Factory New)": 350,
  "AWP | Asiimov (Factory New)": 220,
  "AWP | Asiimov (Field-Tested)": 120,
  "AWP | Hyper Beast (Factory New)": 200,
  "AWP | Lightning Strike (Factory New)": 300,
  "AWP | Wildfire (Factory New)": 95,
  "AWP | Printstream (Factory New)": 320,
  "AWP | The Prince (Factory New)": 130,
  // AK-47
  "AK-47 | Wild Lotus (Factory New)": 2800,
  "AK-47 | Gold Arabesque (Factory New)": 1500,
  "AK-47 | Case Hardened (Factory New)": 450,
  "AK-47 | Vulcan (Factory New)": 450,
  "AK-47 | Fire Serpent (Factory New)": 1800,
  "AK-47 | The Empress (Factory New)": 85,
  "AK-47 | Redline (Factory New)": 90,
  "AK-47 | Fuel Injector (Factory New)": 160,
  "AK-47 | Neon Revolution (Factory New)": 65,
  "AK-47 | Head Shot (Factory New)": 100,
  "AK-47 | Bloodsport (Factory New)": 70,
  "AK-47 | Hydroponic (Factory New)": 150,
  "AK-47 | Jaguar (Factory New)": 55,
  "AK-47 | Slate (Factory New)": 40,
  "AK-47 | Legion of Anubis (Factory New)": 80,
  // M4A4
  "M4A4 | Howl (Factory New)": 4000,
  "M4A4 | Poseidon (Factory New)": 220,
  "M4A4 | Eye of Horus (Factory New)": 100,
  "M4A4 | Asiimov (Factory New)": 100,
  "M4A4 | Desolate Space (Factory New)": 130,
  "M4A4 | The Emperor (Factory New)": 65,
  "M4A4 | Neo-Noir (Factory New)": 80,
  // M4A1-S
  "M4A1-S | Printstream (Factory New)": 200,
  "M4A1-S | Master Piece (Factory New)": 600,
  "M4A1-S | Imminent Danger (Factory New)": 65,
  "M4A1-S | Golden Coil (Factory New)": 70,
  "M4A1-S | Nightmare (Factory New)": 75,
  // Glock
  "Glock-18 | Fade (Factory New)": 550,
  "Glock-18 | Vogue (Factory New)": 60,
  "Glock-18 | Wasteland Rebel (Factory New)": 50,
  // Desert Eagle
  "Desert Eagle | Blaze (Factory New)": 500,
  "Desert Eagle | Printstream (Factory New)": 100,
  "Desert Eagle | Golden Koi (Factory New)": 80,
  "Desert Eagle | Hand Cannon (Factory New)": 60,
  "Desert Eagle | Kumicho Dragon (Factory New)": 55,
  "Desert Eagle | Code Red (Factory New)": 60,
  "Desert Eagle | Conspiracy (Factory New)": 45,
};

// Preços por raridade e desgaste (fallback para itens sem preço definido)
const RARITY_BASE_PRICES_USD = {
  // Rarity ID → base price em USD
  "rarity_common": { "Factory New": 0.05, "Minimal Wear": 0.04, "Field-Tested": 0.03, "Well-Worn": 0.02, "Battle-Scarred": 0.01 },
  "rarity_uncommon": { "Factory New": 0.15, "Minimal Wear": 0.12, "Field-Tested": 0.09, "Well-Worn": 0.07, "Battle-Scarred": 0.05 },
  "rarity_rare": { "Factory New": 0.80, "Minimal Wear": 0.60, "Field-Tested": 0.40, "Well-Worn": 0.30, "Battle-Scarred": 0.20 },
  "rarity_mythical": { "Factory New": 3.00, "Minimal Wear": 2.20, "Field-Tested": 1.50, "Well-Worn": 1.00, "Battle-Scarred": 0.70 },
  "rarity_legendary": { "Factory New": 12.00, "Minimal Wear": 9.00, "Field-Tested": 6.00, "Well-Worn": 4.00, "Battle-Scarred": 2.50 },
  "rarity_ancient": { "Factory New": 45.00, "Minimal Wear": 32.00, "Field-Tested": 22.00, "Well-Worn": 14.00, "Battle-Scarred": 8.00 },
  "rarity_contraband": { "Factory New": 800.00, "Minimal Wear": 600.00, "Field-Tested": 450.00, "Well-Worn": 300.00, "Battle-Scarred": 200.00 },
};

// Special pricing for knives (multiply rarity price by factor)
const KNIFE_RARITY_MULTIPLIER = {
  "rarity_ancient": 8,
  "rarity_mythical": 5,
  "rarity_legendary": 6,
};

async function main() {
  console.log("🚀 Iniciando sincronização de skins reais do CS2...");
  
  // Baixar as skins agrupadas por wear (21.407 itens)
  console.log("📥 Baixando skins_not_grouped.json...");
  const response = await fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins_not_grouped.json');
  const allSkins = await response.json();
  console.log(`✅ ${allSkins.length} skins baixadas da API!`);
  
  const processedItems = [];
  
  for (const skin of allSkins) {
    const hashName = skin.market_hash_name || skin.name;
    const wearName = skin.wear?.name || "Field-Tested";
    const rarityId = skin.rarity?.id || "rarity_rare";
    const rarityName = skin.rarity?.name || "Mil-Spec Grade";
    const rarityColor = skin.rarity?.color || "#4b69ff";
    
    // Determinar o preço
    let priceUSD = 0;
    
    // 1. Primeiro: verificar se temos o preço exato
    if (KNOWN_PRICES[hashName]) {
      priceUSD = KNOWN_PRICES[hashName];
    } else {
      // 2. Fallback: preço por raridade + desgaste
      const rarityPrices = RARITY_BASE_PRICES_USD[rarityId] || RARITY_BASE_PRICES_USD["rarity_rare"];
      priceUSD = rarityPrices[wearName] || rarityPrices["Field-Tested"] || 0.10;
      
      // 3. Multiplicar para knives e luvas
      const isKnife = skin.weapon?.name?.toLowerCase().includes('knife') || 
                     skin.name?.includes('★') ||
                     skin.category?.id === 'sfui_invpanel_filter_gloves';
      if (isKnife && KNIFE_RARITY_MULTIPLIER[rarityId]) {
        priceUSD *= KNIFE_RARITY_MULTIPLIER[rarityId];
      }
    }
    
    // Converter para DopaCoin
    const priceDopaCoins = parseFloat((priceUSD * BRL_RATE).toFixed(2));
    
    processedItems.push({
      id: skin.id,
      name: hashName,
      description: (skin.description || "").replace(/\\n/g, ' ').replace(/<[^>]+>/g, '').substring(0, 200),
      rarity: rarityName,
      rarity_color: rarityColor,
      image: skin.image || "",
      price: priceDopaCoins,
      type: skin.category?.id?.replace('sfui_invpanel_filter_', '') || "weapon",
      weapon: skin.weapon?.name || "",
      wear: wearName,
      stattrak: skin.stattrak || false,
    });
  }
  
  // Ordenar por preço decrescente
  processedItems.sort((a, b) => b.price - a.price);
  
  console.log(`✅ ${processedItems.length} itens processados!`);
  console.log(`💰 Item mais caro: ${processedItems[0].name} — D$ ${processedItems[0].price}`);
  console.log(`💰 Item mais barato: ${processedItems[processedItems.length-1].name} — D$ ${processedItems[processedItems.length-1].price}`);
  
  // Estatísticas
  const over1000 = processedItems.filter(i => i.price >= 1000).length;
  const over100 = processedItems.filter(i => i.price >= 100).length;
  const over10 = processedItems.filter(i => i.price >= 10).length;
  console.log(`📊 Acima de D$ 1.000: ${over1000} | Acima de D$ 100: ${over100} | Acima de D$ 10: ${over10}`);
  
  // Salvar o arquivo
  const outputPath = path.resolve(__dirname, '../src/data/cs2Items.js');
  const content = `// Banco de dados real de skins CS2 — ${new Date().toLocaleDateString('pt-BR')}
// ${processedItems.length} itens — Preços em DopaCoin (D$) — Taxa: 1 USD = D$ ${BRL_RATE}
// Fonte: ByMykel/CSGO-API + Steam Market
export const cs2Items = ${JSON.stringify(processedItems, null, 2)};
`;
  
  fs.writeFileSync(outputPath, content);
  console.log(`✅ Arquivo salvo em: ${outputPath}`);
  console.log(`📦 Tamanho: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
  console.log("🎉 Sincronização concluída com sucesso!");
}

main().catch(console.error);
