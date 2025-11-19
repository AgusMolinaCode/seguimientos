/**
 * Detecta si está corriendo en Vercel (producción serverless)
 */
function isVercelEnvironment(): boolean {
  return process.env.VERCEL === "1" || process.env.VERCEL_ENV !== undefined;
}

/**
 * Lanza el browser con la configuración correcta según el entorno
 * - Local: usa puppeteer con Chrome local
 * - Vercel: usa puppeteer-core con chromium-min y binario remoto
 */
export async function launchBrowser() {
  const isVercel = isVercelEnvironment();

  if (isVercel) {
    // Configuración para Vercel (serverless) usando @sparticuz/chromium-min con binario embebido
    const puppeteerCore = await import("puppeteer-core");
    const chromium = await import("@sparticuz/chromium-min");

    console.log("[Puppeteer] Environment: Vercel serverless");
    console.log("[Puppeteer] Using @sparticuz/chromium-min (embedded binary)");

    try {
      const execPath = await chromium.default.executablePath();
      console.log("[Puppeteer] ✅ Chromium executable path:", execPath);

      return puppeteerCore.default.launch({
        args: chromium.default.args,
        executablePath: execPath,
        headless: true,
      });
    } catch (error) {
      console.error("[Puppeteer] ❌ Failed to launch browser:", error);
      throw error;
    }
  } else {
    // Configuración para desarrollo local
    const puppeteer = await import("puppeteer");

    return puppeteer.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });
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
