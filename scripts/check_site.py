from playwright.sync_api import sync_playwright
import os

SCREENSHOT_DIR = r"C:\Users\mw640\.gemini\antigravity\brain\c471499b-29bf-4faf-b7e6-3693e6158aac"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    
    # Capturar logs do console
    console_errors = []
    def on_console(msg):
        if msg.type in ('error', 'warning'):
            console_errors.append(f"[{msg.type}] {msg.text}")
    page.on('console', on_console)

    try:
        page.goto('http://localhost:5173', timeout=15000)
        page.wait_for_load_state('networkidle', timeout=15000)
        
        # Screenshot da home
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, 'check_home.png'), full_page=False)
        print("Screenshot home tirada!")
        
        # Verificar se o site carregou
        title = page.title()
        print(f"Título: {title}")
        
        # Verificar se há erros de console
        if console_errors:
            print(f"\n=== ERROS NO CONSOLE ({len(console_errors)}) ===")
            for err in console_errors[:10]:
                print(err)
        else:
            print("\n✅ Nenhum erro de console!")
        
        # Tentar clicar no botão de login se existir
        try:
            login_btn = page.locator('text=Entrar').first
            if login_btn.is_visible(timeout=2000):
                print("\n✅ Botão de login encontrado - site carregou corretamente")
        except:
            pass
            
        # Verificar se o BottomNav tem o botão de Cofre
        try:
            cofre_btn = page.locator('text=Cofre').first
            if cofre_btn.is_visible(timeout=3000):
                print("✅ Botão de Cofre encontrado no BottomNav!")
                page.screenshot(path=os.path.join(SCREENSHOT_DIR, 'check_bottomnav.png'), full_page=False)
        except:
            print("⚠️ Botão de Cofre não encontrado no BottomNav (pode ser desktop)")
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, 'check_error.png'), full_page=False)
    
    browser.close()
    print("\nDone!")
