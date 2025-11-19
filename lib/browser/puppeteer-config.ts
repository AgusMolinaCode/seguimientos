/**
 * Detecta si está corriendo en Vercel (producción serverless)
 */
function isVercelEnvironment(): boolean {
  return process.env.VERCEL === "1" || process.env.VERCEL_ENV !== undefined;
}

/**
 * URL del binario remoto de Chromium para Vercel
 * Usar chromium-min con binario remoto evita problemas de bibliotecas compartidas
 * Vercel uses x64 architecture by default
 */
const CHROMIUM_REMOTE_EXECUTABLE =
  "https://github.com/Sparticuz/chromium/releases/download/v138.0.2/chromium-v138.0.2-pack.x64.tar";

/**
 * Lanza el browser con la configuración correcta según el entorno
 * - Local: usa puppeteer con Chrome local
 * - Vercel: usa puppeteer-core con chromium-min y binario remoto
 */
export async function launchBrowser() {
  const isVercel = isVercelEnvironment();

  if (isVercel) {
    // Configuración para Vercel (serverless) usando chromium-min con binario remoto
    const puppeteerCore = await import("puppeteer-core");
    const chromium = await import("@sparticuz/chromium-min");

    return puppeteerCore.default.launch({
      args: chromium.default.args,
      executablePath: await chromium.default.executablePath(CHROMIUM_REMOTE_EXECUTABLE),
      headless: true,
    });
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
