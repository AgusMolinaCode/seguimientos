/**
 * Detecta si está corriendo en Vercel (producción serverless)
 */
function isVercelEnvironment(): boolean {
  return process.env.VERCEL === "1" || process.env.VERCEL_ENV !== undefined;
}

/**
 * URL del binario remoto de Chromium para Vercel
 * Usar chromium-min con binario remoto evita problemas de bibliotecas compartidas
 */
const CHROMIUM_REMOTE_EXECUTABLE =
  "https://github.com/Sparticuz/chromium/releases/download/v138.0.0/chromium-v138.0.0-pack.tar";

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
  navigation: isVercelEnvironment() ? 15000 : 30000, // Vercel tiene límites más estrictos
  wait: isVercelEnvironment() ? 10000 : 15000,
  overall: isVercelEnvironment() ? 25000 : 45000,
};
