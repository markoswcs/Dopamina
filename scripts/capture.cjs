const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando o navegador...');
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: {
      width: 1440,
      height: 900
    }
  });
  
  const page = await browser.newPage();
  
  // Set dark theme in local storage before loading
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('dopashop_theme', 'dark');
  });

  console.log('Navegando para o frontend...');
  // We'll wait until load
  await page.goto('http://localhost:5173', { waitUntil: 'load', timeout: 30000 });
  
  // Wait a bit extra for 3D elements, animations, and fonts to load
  await new Promise(resolve => setTimeout(resolve, 8000));
  
  console.log('Tirando a primeira screenshot (Home)...');
  await page.screenshot({ path: 'screenshot_home.png' });
  
  console.log('Navegando para aba DopaGames...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const gamesBtn = buttons.find(b => b.textContent && b.textContent.includes('DopaGames'));
    if (gamesBtn) gamesBtn.click();
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('Tirando a segunda screenshot (DopaGames - Caixas)...');
  await page.screenshot({ path: 'screenshot_aposta.png' });

  console.log('Abrindo uma caixa...');
  await page.evaluate(() => {
    // Encontrar uma caixa e clicar
    const caixas = Array.from(document.querySelectorAll('.cursor-pointer'));
    const caixa = caixas.find(c => c.textContent && c.textContent.includes('Fever Case'));
    if (caixa) caixa.click();
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar abrir a tela da caixa
  
  await page.evaluate(() => {
    // Clicar no botão "45 DOPAS" (Abrir caixa)
    const btns = Array.from(document.querySelectorAll('button'));
    const abrir = btns.find(b => b.textContent && b.textContent.includes('DOPAS'));
    if (abrir) abrir.click();
  });

  await new Promise(resolve => setTimeout(resolve, 3000)); // Esperar a roleta girar um pouco
  
  console.log('Tirando a terceira screenshot (Roleta)...');
  await page.screenshot({ path: 'screenshot_roleta.png' });

  console.log('Screenshots salvas com sucesso!');
  await browser.close();
  process.exit(0);
})();
