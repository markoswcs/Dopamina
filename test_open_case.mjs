import { chromium } from 'playwright';

(async () => {
  console.log('Iniciando navegador...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    console.log(`[BROWSER] ${msg.type()}: ${msg.text()}`);
  });
  
  try {
    console.log('Navegando para o site...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    
    // Tenta clicar em "Entrar" se não estiver logado
    // Wait, playwright is anonymous, it won't be logged in!
    // I need to login first or the insert WILL fail.
    
    // Check if logged in
    const isLoginButton = await page.locator('text=Entrar').isVisible();
    if (isLoginButton) {
      console.log('Site requer login. Não podemos testar inserir sem logar.');
    } else {
      console.log('Usuário já parece estar logado?');
    }
  } catch (e) {
    console.error('Erro:', e);
  } finally {
    await browser.close();
  }
})();
