"use server";

import puppeteer from "puppeteer";
import type { ScraperResult, TrackingInfo, TimelineEvent } from "../types";

export async function scrapeOCA(
  trackingNumber: string
): Promise<ScraperResult> {
  let browser;

  try {
    // Construir URL de 17track con el tracking number y código de carrier OCA (100199)
    const url = `https://t.17track.net/es#nums=${trackingNumber}&fc=100199`;

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-features=IsolateOrigins,site-per-process",
      ],
    });

    const page = await browser.newPage();

    // Configurar user agent y viewport realistas
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });

    // Ocultar webdriver
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
    });

    // Navegar a la URL
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Esperar a que la página cargue completamente
    await new Promise(resolve => setTimeout(resolve, 3000));

    // El hash URL no dispara la búsqueda automáticamente, necesitamos hacer clic en Track
    // Usar evaluate para cerrar modales y hacer clic en el botón Track
    await page.evaluate(() => {
      // Cerrar modal de bienvenida si existe
      const closeButtons = Array.from(document.querySelectorAll('button'));
      const nextButton = closeButtons.find(btn => btn.textContent?.includes('Next'));
      if (nextButton) {
        nextButton.click();
      }
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Hacer clic en el botón Track
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const trackButton = buttons.find(btn => btn.textContent?.includes('Track'));
      if (trackButton) {
        trackButton.click();
      }
    });

    // Esperar a que se carguen los resultados
    await new Promise(resolve => setTimeout(resolve, 12000));

    // Verificar que el contenedor de resultados esté presente
    const progressElement = await page.$('#yq-tracking-progress');
    if (!progressElement) {
      throw new Error('No se encontró el contenedor de tracking después de la búsqueda');
    }

    // Extraer datos de tracking
    const trackingData = await page.evaluate(() => {
      // Función auxiliar para limpiar texto
      const cleanText = (text: string | null | undefined): string => {
        return text?.trim().replace(/\s+/g, " ") || "";
      };

      // Extraer estado actual desde #yq-tracking-progress h3
      let currentStatus = "Desconocido";
      const statusElement = document.querySelector('#yq-tracking-progress h3');
      if (statusElement) {
        currentStatus = cleanText(statusElement.textContent);
      }

      // Extraer fecha de entrega si está disponible
      let deliveryDate = "";
      const progressDiv = document.querySelector('#yq-tracking-progress');
      if (progressDiv) {
        const spans = progressDiv.querySelectorAll('span');
        spans.forEach(span => {
          const text = cleanText(span.textContent);
          // Buscar fechas en formato YYYY-MM-DD
          if (/\d{4}-\d{2}-\d{2}/.test(text)) {
            deliveryDate = text;
          }
        });
      }

      // Extraer timeline de eventos usando .yq-time
      const timeline: Array<{ location: string; datetime: string; status: string }> = [];

      // Buscar todos los elementos con clase yq-time
      const timeElements = document.querySelectorAll('.yq-time');

      timeElements.forEach(timeEl => {
        const datetime = cleanText(timeEl.textContent);

        // El status está en el siguiente span dentro del mismo contenedor padre
        const parentDiv = timeEl.parentElement;
        if (parentDiv) {
          // Buscar el span con flex-1 que contiene la descripción
          const statusSpan = parentDiv.querySelector('span.flex-1');
          if (statusSpan) {
            const status = cleanText(statusSpan.textContent);

            if (datetime && status && datetime.length > 5 && status.length > 3) {
              timeline.push({
                location: "",
                datetime,
                status,
              });
            }
          }
        }
      });

      // Extraer información del carrier (OCA)
      let carrier = "OCA";
      const carrierLink = document.querySelector('a[href*="oca.com.ar"]');
      if (carrierLink) {
        carrier = cleanText(carrierLink.textContent) || "OCA";
      }

      // Extraer hora de sincronización
      let syncTime = "";
      const syncElements = document.querySelectorAll('.text-zinc-500');
      syncElements.forEach(elem => {
        const text = cleanText(elem.textContent);
        if (text.includes('Hora Sincronizada')) {
          syncTime = text;
        }
      });

      return {
        currentStatus,
        deliveryDate,
        timeline,
        carrier,
        syncTime,
      };
    });

    // Verificar si obtuvimos datos
    if (!trackingData.currentStatus || trackingData.currentStatus === "Desconocido") {
      return {
        success: false,
        error: "No se pudo obtener información del envío. Verifica que el número de tracking sea correcto.",
      };
    }

    // Construir mensaje informativo
    let signedByMessage = trackingData.currentStatus;
    if (trackingData.deliveryDate) {
      signedByMessage = `${trackingData.currentStatus} - ${trackingData.deliveryDate}`;
    }
    if (trackingData.syncTime) {
      signedByMessage += ` (${trackingData.syncTime})`;
    }

    // Construir objeto TrackingInfo
    const trackingInfo: TrackingInfo = {
      trackingNumber,
      currentStatus: trackingData.currentStatus,
      origin: "N/A",
      destination: "N/A",
      pieces: "N/A",
      weight: "N/A",
      signedBy: signedByMessage,
      service: "OCA (via 17track)",
      carrier: trackingData.carrier,
      timeline: trackingData.timeline,
      incidents: "",
    };

    return {
      success: true,
      data: trackingInfo,
    };
  } catch (error) {
    console.error("Error en scrapeOCA:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? `Error al obtener información: ${error.message}`
          : "Error desconocido al procesar la solicitud",
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
