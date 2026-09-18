const https = require('https');
const fs = require('fs');

const API_BASE = 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en';

const endpoints = [
  { url: `${API_BASE}/skins.json`, type: 'skin' },
  { url: `${API_BASE}/stickers.json`, type: 'sticker' },
  { url: `${API_BASE}/agents.json`, type: 'agent' },
  { url: `${API_BASE}/graffiti.json`, type: 'graffiti' },
  { url: `${API_BASE}/patches.json`, type: 'patch' },
  { url: `${API_BASE}/collectibles.json`, type: 'pin' },
  { url: `${API_BASE}/music_kits.json`, type: 'music_kit' }
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return resolve(fetchJson(res.headers.location));
        }
        return reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function generatePriceByRarity(rarityName, type) {
  if (!rarityName) rarityName = 'Consumer Grade';
  const rarityLower = rarityName.toLowerCase();
  
  let basePrice = 1.0;
  
  // Custom baseline per type
  if (type === 'agent') basePrice = 15.0;
  if (type === 'sticker') basePrice = 0.5;
  if (type === 'pin') basePrice = 5.0;
  if (type === 'music_kit') basePrice = 8.0;

  if (rarityLower.includes('consumer') || rarityLower.includes('industrial') || rarityLower.includes('base grade')) {
    basePrice *= 0.5;
  } else if (rarityLower.includes('mil-spec') || rarityLower.includes('high grade')) {
    basePrice *= 2.0;
  } else if (rarityLower.includes('restricted') || rarityLower.includes('remarkable')) {
    basePrice *= 6.0;
  } else if (rarityLower.includes('classified') || rarityLower.includes('exotic')) {
    basePrice *= 25.0;
  } else if (rarityLower.includes('covert') || rarityLower.includes('extraordinary') || rarityLower.includes('master')) {
    basePrice *= 150.0;
  } else if (rarityLower.includes('contraband')) {
    basePrice *= 3000.0;
  } else if (rarityLower.includes('extraordinary')) {
    basePrice *= 500.0;
  }
  
  // Gloves and Knives are always expensive
  if (rarityLower.includes('covert') && type === 'skin') {
      basePrice *= 1.5;
  }
  
  // Add some random variation (-20% to +50%)
  const variation = 0.8 + (Math.random() * 0.7);
  return parseFloat((basePrice * variation).toFixed(2));
}

async function main() {
  let allItems = [];
  
  for (const ep of endpoints) {
    try {
      console.log(`Fetching ${ep.type}s...`);
      const data = await fetchJson(ep.url);
      console.log(`Loaded ${data.length} items from ${ep.url}`);
      
      data.forEach(item => {
        // Fallbacks for rarity since not all items have it cleanly defined
        let rarityName = 'Consumer Grade';
        let rarityColor = '#b0c3d9';
        
        if (item.rarity) {
          rarityName = item.rarity.name || rarityName;
          rarityColor = item.rarity.color || rarityColor;
        }

        // Generate dynamic price
        const price = generatePriceByRarity(rarityName, ep.type);
        
        allItems.push({
          id: item.id || `gen-${ep.type}-${Math.random().toString(36).substr(2, 9)}`,
          name: item.name,
          description: item.description,
          rarity: rarityName,
          rarity_color: rarityColor,
          image: item.image,
          price: price,
          type: ep.type
        });
      });
    } catch (e) {
      console.error(`Error with ${ep.url}`, e);
    }
  }

  // Deduplicate by name just in case
  const seen = new Set();
  const dedup = allItems.filter(i => {
    if (seen.has(i.name)) return false;
    seen.add(i.name);
    return true;
  });

  const outputContent = `export const cs2Items = ${JSON.stringify(dedup, null, 2)};\n`;
  fs.writeFileSync('src/data/cs2Items.js', outputContent, 'utf-8');
  console.log(`Done! Exported ${dedup.length} total unique items to src/data/cs2Items.js`);
}

main();
