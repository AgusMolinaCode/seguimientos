/**
 * Detecta si está corriendo en Vercel (producción serverless)
 */
function isVercelEnvironment(): boolean {
  return process.env.VERCEL === "1" || process.env.VERCEL_ENV !== undefined;
}

/**
 * Lanza el browser con la configuración correcta según el entorno
 * - Local: usa puppeteer-extra con stealth plugin
 * - Vercel: usa puppeteer-core sin plugins para evitar problemas de bundling
 */
export async function launchBrowser() {
  const isVercel = isVercelEnvironment();

  if (isVercel) {
    // Configuración para Vercel (serverless) - SIN puppeteer-extra para evitar errores de bundling
    const puppeteerCore = await import("puppeteer-core");
    const chromium = await import("@sparticuz/chromium-min");

    console.log("[Puppeteer] Environment: Vercel serverless");
    console.log("[Puppeteer] Using @sparticuz/chromium-min (puppeteer-core only)");

    try {
      const execPath = await chromium.default.executablePath();
      console.log("[Puppeteer] ✅ Chromium executable path:", execPath);

      const browser = await puppeteerCore.default.launch({
        args: [
          ...chromium.default.args,
          // Anti-detección básica sin stealth plugin
          "--disable-blink-features=AutomationControlled",
          "--disable-features=IsolateOrigins,site-per-process",
          "--disable-web-security",
          "--disable-features=VizDisplayCompositor",
        ],
        executablePath: execPath,
        headless: true,
      });

      console.log("[Puppeteer] ✅ Browser launched successfully in Vercel");
      return browser;
    } catch (error) {
      console.error("[Puppeteer] ❌ Failed to launch browser:", error);
      throw error;
    }
  } else {
    // Configuración para desarrollo local con stealth mode
    const puppeteerExtra = await import("puppeteer-extra");
    const StealthPlugin = await import("puppeteer-extra-plugin-stealth");

    console.log("[Puppeteer] Environment: Local development with stealth mode");

    // Configurar puppeteer-extra con stealth
    puppeteerExtra.default.use(StealthPlugin.default());

    const browser = await puppeteerExtra.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--disable-blink-features=AutomationControlled",
        "--disable-features=IsolateOrigins,site-per-process",
      ],
    });

    // Configurar user agent realista en cada página nueva
    browser.on("targetcreated", async (target) => {
      const page = await target.page();
      if (page) {
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );
      }
    });

    return browser;
  }
}

/**
 * Configuración de timeouts recomendados según el entorno
 */
export const BROWSER_TIMEOUTS = {
  navigation: isVercelEnvironment() ? 25000 : 30000, // Increased for Vercel serverless (60s max duration)
  wait: isVercelEnvironment() ? 15000 : 15000,        // Increased wait timeout for dynamic content
  overall: isVercelEnvironment() ? 50000 : 45000,     // Increased overall timeout (within 60s limit)
};
