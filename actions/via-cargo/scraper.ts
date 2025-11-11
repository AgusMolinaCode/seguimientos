import puppeteer from "puppeteer";
import type { ScraperResult, TimelineEvent } from "../types";

export async function scrapeViaCargo(
  trackingNumber: string
): Promise<ScraperResult> {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const url = `https://viacargo.com.ar/seguimiento-de-envio/${trackingNumber}/`;

    console.log("Navegando a:", url);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Esperar que el iframe cargue
    console.log("Esperando iframe...");
    await page.waitForSelector("iframe", { timeout: 15000 });

    // Esperar que el contenido dentro del iframe cargue
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("Obteniendo frame...");

    // Obtener todos los frames de la página
    const frames = page.frames();
    console.log("Frames encontrados:", frames.length);

    // Buscar el frame que contiene el formulario (generalmente el segundo frame)
    let targetFrame = frames.find(frame =>
      frame.url().includes('formularios.viacargo.com.ar')
    );

    if (!targetFrame && frames.length > 1) {
      // Si no lo encontramos por URL, usar el segundo frame
      targetFrame = frames[1];
    }

    if (!targetFrame) {
      throw new Error("No se pudo encontrar el iframe con los datos");
    }

    console.log("Frame encontrado:", targetFrame.url());
    console.log("Extrayendo datos...");

    // Extraer datos del frame
    const data = await targetFrame.evaluate(() => {
      const doc = document;

      // Función auxiliar para extraer texto
      const getText = (selector: string): string => {
        const element = doc.querySelector(selector);
        return element?.textContent?.trim() || "";
      };

      // Extraer información del encabezado (lista principal)
      const mainList = doc.querySelectorAll("ul")[0];
      const listItems = mainList?.querySelectorAll("li") || [];

      let trackingNumber = "";
      let origin = "";
      let destination = "";
      let pieces = "";
      let weight = "";
      let signedBy = "";
      let service = "";

      // Extraer datos de los list items (basado en la estructura que vimos)
      listItems.forEach((item, index) => {
        const paragraphs = item.querySelectorAll("p");

        if (paragraphs.length >= 2) {
          // Items con 2 párrafos: label + value
          const label = paragraphs[0].textContent?.trim() || "";
          const value = paragraphs[1].textContent?.trim() || "";

          if (label === "Número de envío") trackingNumber = value;
          else if (label === "Cantidad de piezas") pieces = value;
          else if (label === "Peso") weight = value;
          else if (label === "Firmado por") signedBy = value;
          else if (label === "Servicio") service = value;
        } else if (paragraphs.length === 1) {
          // Items con 1 párrafo: son origen (índice 1) o destino (índice 2)
          const text = paragraphs[0].textContent?.trim() || "";
          if (index === 1) origin = text;
          else if (index === 2) destination = text;
        }
      });

      // Extraer timeline (historial de eventos)
      const timeline: TimelineEvent[] = [];
      const timelineLists = doc.querySelectorAll("ul");

      if (timelineLists.length >= 2) {
        const timelineList = timelineLists[1];
        const timelineItems = timelineList.querySelectorAll("li");

        timelineItems.forEach((item) => {
          const paragraphs = item.querySelectorAll("p");
          if (paragraphs.length >= 2) {
            timeline.push({
              location: paragraphs[0].textContent?.trim() || "",
              datetime: paragraphs[1].textContent?.split("•")[0]?.trim() || "",
              status: paragraphs[1].textContent?.split("•")[1]?.trim() || "",
            });
          }
        });
      }

      // Extraer incidencias
      const incidentsHeading = Array.from(doc.querySelectorAll("h2")).find(
        (h) => h.textContent?.includes("Incidencias")
      );
      const incidents =
        incidentsHeading?.nextElementSibling?.textContent?.trim() ||
        "No hay incidencias.";

      return {
        trackingNumber,
        origin,
        destination,
        pieces,
        weight,
        signedBy,
        service,
        timeline,
        incidents,
      };
    });

    console.log("Datos extraídos:", data);

    // Validar que se encontraron datos válidos
    if (!data.trackingNumber || data.trackingNumber.trim() === "") {
      return {
        success: false,
        error: "Número de envío no encontrado. Verifica que el número sea correcto.",
      };
    }

    // Validar que al menos tengamos algunos datos básicos
    if (!data.origin && !data.destination && !data.service) {
      return {
        success: false,
        error: "No se encontró información para este número de envío. Verifica que sea correcto.",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error en scraper:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
