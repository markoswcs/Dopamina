const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');

const urls = [
  "https://shopee.com.br/Massegeador-de-Pesco%C3%A7o-8-Pontos-Aquecimento-Relaxamento-Tens%C3%A3o-Ombro-M%C3%A3os-Massagem-Al%C3%ADvio-i.1362240140.58257349307",
  "https://shopee.com.br/Kit-Linha-Completa-Explos%C3%A3o-de-Azeite-de-Oliva-Umecta%C3%A7%C3%A3o-%C3%93leo-Abacate-bn.Cachos-i.1202663615.55557658511",
  "https://shopee.com.br/Pneu-Aro-14-Firestone-F-600-175-65-R14-82T-2-Unidades-i.1083800536.58259500627",
  "https://shopee.com.br/Fog%C3%A3o-5-Bocas-Atlas-Atenas-com-Mesa-de-Vidro-A-G%C3%A1s-Bivolt-i.864722805.23194964099",
  "https://shopee.com.br/Bolsa-Feminina-De-Ombro-e-Transversal-em-PU-Tend%C3%AAncia-Diagonal-Moda-i.1284795277.58255820617",
  "https://shopee.com.br/vestido-indiano-curto-tribal-Elegance-vestido-Rodadinho-ver%C3%A3o-estampa-localizadas-de-alcinha-ajust%C3%A1vel-i.777769070.58253926839",
  "https://shopee.com.br/Kit-10-Pe%C3%A7as-Roupas-Infantil-Menina-Sortido-Ver%C3%A3o-5-Camisetas-5-Shorts-Crian%C3%A7a-Feminina-i.695080340.58253321240",
  "https://shopee.com.br/Combo-Kemei-PRO-KM-1689-A-Corte-ou-1690-A-Acabamento-Kit-Profissional-Cabelo-Barba-i.1393358746.58251899819",
  "https://shopee.com.br/Depilador-El%C3%A9trico-Feminino-Recarreg%C3%A1vel-Navalha-Dupla-Removedor-de-Pelos-i.1580145778.58251846770",
  "https://shopee.com.br/Kit-5-Blusas-Femininas-T-Shirt-em-Malha-Canelada-Premium-Malha-Quentinha-i.448717403.58251837580",
  "https://shopee.com.br/Scarpin-Feminino-Duas-Fivelas-Bellamore-Salto-Grosso-Baixo-5-cm-Confort%C3%A1vel-Elegante-Casual-Social-i.301840606.58251737574",
  "https://shopee.com.br/Kit-%C3%93leos-Africanos-Reparador-de-Pontas-bn.Cachos-i.1202663615.20499298772"
];

async function scrape() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const results = [];
  
  for (const url of urls) {
    console.log("Scraping:", url);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // Wait for product title to appear
      await page.waitForSelector('span[data-testid="product-name"], div[class*="attM6y"], span[class*="WB++R"]', { timeout: 15000 }).catch(() => {});
      
      const data = await page.evaluate(() => {
        let name = document.querySelector('span[data-testid="product-name"]')?.innerText || 
                   document.querySelector('meta[property="og:title"]')?.content ||
                   document.querySelector('title')?.innerText || "Produto Desconhecido";
        
        let price = document.querySelector('div[class*="G27FPf"], div[class*="p+nJ0"], div[class*="pqTWkA"]')?.innerText ||
                    document.querySelector('meta[property="shopee:price"]')?.content || 
                    "99,90";
                    
        let image = document.querySelector('div[data-testid="product-image"] img, div.product-image img, div[class*="Ap1cK"] img')?.src ||
                    document.querySelector('meta[property="og:image"]')?.content || "";
        
        if (price.includes("R$")) price = price.split("R$")[1];
        if (price.includes("-")) price = price.split("-")[0];
        
        return {
          name: name.replace(' | Shopee Brasil', '').trim(),
          price: parseFloat(price.replace('.', '').replace(',', '.').trim()) || 99.90,
          image: image
        };
      });
      
      console.log(data);
      results.push(data);
    } catch (e) {
      console.log("Failed:", e.message);
    }
    
    await page.close();
  }
  
  await browser.close();
  fs.writeFileSync('shopee_data.json', JSON.stringify(results, null, 2));
  console.log("Done. Saved to shopee_data.json");
}

scrape();
