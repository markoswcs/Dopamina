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
  
  console.log('Tirando a segunda screenshot (DopaGames)...');
  await page.screenshot({ path: 'screenshot_aposta.png' });

  console.log('Screenshots salvas com sucesso!');
  await browser.close();
  process.exit(0);
})();
