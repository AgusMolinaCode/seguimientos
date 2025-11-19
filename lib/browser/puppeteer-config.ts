/**
 * Detecta si está corriendo en Vercel (producción serverless)
 */
function isVercelEnvironment(): boolean {
  return process.env.VERCEL === "1" || process.env.VERCEL_ENV !== undefined;
}

/**
 * URLs del binario remoto de Chromium para Vercel
 * Vercel uses x64 architecture by default
 * Trying multiple mirrors for redundancy
 */
const CHROMIUM_REMOTE_URLS = [
  // Primary: GitHub releases
  "https://github.com/Sparticuz/chromium/releases/download/v138.0.2/chromium-v138.0.2-pack.x64.tar",
  // Fallback: Use undefined to let chromium-min download from default location
  undefined,
] as const;

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

    console.log("[Puppeteer] Environment: Vercel serverless");

    // Try multiple URLs with fallback
    let lastError: Error | null = null;

    for (const url of CHROMIUM_REMOTE_URLS) {
      try {
        console.log("[Puppeteer] Attempting to load Chromium from:", url || "default location");

        const execPath = await chromium.default.executablePath(url);
        console.log("[Puppeteer] ✅ Successfully resolved executable path:", execPath);

        return puppeteerCore.default.launch({
          args: chromium.default.args,
          executablePath: execPath,
          headless: true,
        });
      } catch (error) {
        lastError = error as Error;
        console.error("[Puppeteer] ❌ Failed with URL:", url, "Error:", error);
        // Continue to next URL
      }
    }

    // If all URLs failed, throw the last error
    console.error("[Puppeteer] All Chromium download attempts failed");
    throw new Error(
      `Failed to launch browser after ${CHROMIUM_REMOTE_URLS.length} attempts. Last error: ${lastError?.message || "Unknown error"}`
    );
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
