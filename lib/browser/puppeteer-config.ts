import puppeteer, { type Browser } from "puppeteer";

/**
 * Detecta si está corriendo en Vercel (producción serverless)
 */
function isVercelEnvironment(): boolean {
  return process.env.VERCEL === "1" || process.env.VERCEL_ENV !== undefined;
}

/**
 * Lanza el browser con la configuración correcta según el entorno
 * - Local: usa puppeteer normal
 * - Vercel: usa @sparticuz/chromium para serverless
 */
export async function launchBrowser(): Promise<Browser> {
  const isVercel = isVercelEnvironment();

  if (isVercel) {
    // Configuración para Vercel (serverless)
    const chromium = await import("@sparticuz/chromium");

    return puppeteer.launch({
      args: [...chromium.default.args, '--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
  } else {
    // Configuración para desarrollo local
    return puppeteer.launch({
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
