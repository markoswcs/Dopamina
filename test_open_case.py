from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    
    console_logs = []
    page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
    
    try:
        page.goto('http://localhost:5173')
        page.wait_for_load_state('networkidle')
        
        # Click on Cassino (where DiscountRoulette is)
        page.locator('text=Cassino').first.click(timeout=3000)
        page.wait_for_timeout(1000)
        
        # Click on the first case
        case = page.locator('.group.relative.bg-zinc-900\\/50').first
        case.click(timeout=3000)
        page.wait_for_timeout(1000)
        
        # Click "Abrir 1x"
        open_btn = page.locator('text=Abrir 1x')
        open_btn.click(timeout=3000)
        
        # Wait for spin to finish (around 10 seconds)
        print("Esperando o giro (10s)...")
        page.wait_for_timeout(10000)
        
        # Print logs
        print("\n--- CONSOLE LOGS ---")
        for log in console_logs:
            print(log)
            
    except Exception as e:
        print(f"Erro no teste: {e}")
        
    browser.close()
