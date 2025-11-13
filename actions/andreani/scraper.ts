"use server";

import puppeteer from "puppeteer";
import type { ScraperResult, TrackingInfo, TimelineEvent } from "../types";

export async function scrapeAndreani(
  trackingNumber: string
): Promise<ScraperResult> {
  let browser;

  try {
    const url = `https://www.andreani.com/envio/${trackingNumber}`;

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    // Wait for the tracking state element to ensure page has loaded
    await page.waitForSelector('[data-testid="tracking-state"]', {
      timeout: 15000,
    });

    // Extract tracking data
    const trackingData = await page.evaluate(() => {
      // Get current status
      const statusElement = document.querySelector(
        '[data-testid="tracking-state"]'
      );
      const currentStatus = statusElement?.textContent?.trim() || "Desconocido";

      // Get tracking number from the page
      const trackingInfoElement = document.querySelector(
        '.TrackingState_styles__text_8v9RO'
      );
      const trackingText = trackingInfoElement?.textContent?.trim() || "";
      const numberMatch = trackingText.match(/N°\s*(\d+)/);
      const extractedNumber = numberMatch ? numberMatch[1] : "";

      // Get delivery info if available
      const deliveryInfoElement = document.querySelector(
        '.TopComponent_styles__fechaEstimada_DLMYI'
      );
      const deliveryInfo = deliveryInfoElement?.textContent?.trim() || "";

      // Extract timeline events from vertical timeline
      const timeline: TimelineEvent[] = [];
      const timelineItems = document.querySelectorAll(
        '[data-testid="vertical-timeline-item"]'
      );

      timelineItems.forEach((item) => {
        const titleElement = item.querySelector(
          '.VerticalTimelineItem_styles__title_aJdKC'
        );
        const dateElements = item.querySelectorAll(
          '.VerticalTimelineItem_styles__date_kQNcb'
        );
        const timeElements = item.querySelectorAll(
          '.VerticalTimelineItem_styles__time_A03zq'
        );
        const descElements = item.querySelectorAll(
          '.VerticalTimelineItem_styles__description__60Qj'
        );

        const status = titleElement?.textContent?.trim() || "";

        // Each item can have multiple sub-events
        dateElements.forEach((dateEl, index) => {
          const date = dateEl.textContent?.trim() || "";
          const time = timeElements[index]?.textContent?.trim() || "";
          const description = descElements[index]?.textContent?.trim() || "";

          if (status && date) {
            // Combine status title with description
            const fullStatus = description
              ? `${status} - ${description}`
              : status;

            timeline.push({
              location: "",
              datetime: `${date} ${time}`,
              status: fullStatus,
            });
          }
        });
      });

      return {
        currentStatus,
        trackingNumber: extractedNumber,
        deliveryInfo,
        timeline,
      };
    });

    if (!trackingData.trackingNumber) {
      return {
        success: false,
        error: "No se pudo encontrar información del envío",
      };
    }

    // Build TrackingInfo object
    const trackingInfo: TrackingInfo = {
      trackingNumber: trackingData.trackingNumber,
      currentStatus: trackingData.currentStatus,
      origin: "N/A",
      destination: "N/A",
      pieces: "N/A",
      weight: "N/A",
      signedBy: trackingData.deliveryInfo || trackingData.currentStatus,
      service: "Andreani",
      carrier: "Andreani",
      timeline: trackingData.timeline,
      incidents: "",
    };

    return {
      success: true,
      data: trackingInfo,
    };
  } catch (error) {
    console.error("Error en scrapeAndreani:", error);
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
