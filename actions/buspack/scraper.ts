import type { ScraperResult, TimelineEvent } from "../types";
import type { BusPackParams } from "./types";
import { launchBrowser, BROWSER_TIMEOUTS } from "@/lib/browser/puppeteer-config";

const baseUrl = "https://netsolutions.empresar-sys.com.ar:27576/apps/gspclientes/";

export async function scrapeBusPack(
  params: BusPackParams
): Promise<ScraperResult> {
  let browser;

  try {
    browser = await launchBrowser();

    const page = await browser.newPage();

    // Construir URL con parámetros dinámicos
    const url = `${baseUrl}?idEmp=&Letra=${params.letra}&Boca=${params.boca}&Numero=${params.numero}`;

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: BROWSER_TIMEOUTS.navigation
    });


    await page.waitForSelector("#respuesta", { timeout: BROWSER_TIMEOUTS.wait });

    // Esperar un poco más para asegurar que todo cargó
    await new Promise((resolve) => setTimeout(resolve, 1000));


    // Extraer datos de la página
    const data = await page.evaluate(() => {
      // Función auxiliar para extraer texto limpio
      const getText = (element: Element | null): string => {
        return element?.textContent?.trim() || "";
      };

      // Buscar en el div#respuesta
      const respuestaDiv = document.querySelector("#respuesta");
      if (!respuestaDiv) {
        throw new Error("No se encontró el div#respuesta");
      }

      // Buscar todos los divs dentro de #respuesta
      const allDivs = Array.from(respuestaDiv.querySelectorAll("div"));

      // Extraer estado principal (primer div con font-weight: Bold)
      let currentStatus = "";
      let deliveryDate = "";
      let trackingNumber = "";
      let pieces = "";
      let pieceNumbers = "";
      let weight = "";
      let signedBy = "";
      let documentType = "";
      let destination = "";

      allDivs.forEach((div) => {
        const text = getText(div);

        if (text.startsWith("Entregado") || text.startsWith("En camino") || text.startsWith("En Agencia")) {
          if (!currentStatus) currentStatus = text;
        } else if (text.startsWith("Fecha y hora:")) {
          deliveryDate = text.replace("Fecha y hora:", "").trim();
        } else if (text.startsWith("Nro. de comprobante:")) {
          trackingNumber = text.replace("Nro. de comprobante:", "").trim();
        } else if (text.startsWith("Cantidad de piezas:")) {
          pieces = text.replace("Cantidad de piezas:", "").trim();
        } else if (text.startsWith("Número/s de Pieza/s:")) {
          pieceNumbers = text.replace("Número/s de Pieza/s:", "").trim();
        } else if (text.startsWith("Peso Total (en kg.):")) {
          weight = text.replace("Peso Total (en kg.):", "").trim() || "No especificado";
        } else if (text.startsWith("Receptor:")) {
          signedBy = text.replace("Receptor:", "").trim();
        } else if (text.startsWith("Tipo y número de Documento:")) {
          documentType = text.replace("Tipo y número de Documento:", "").trim();
        } else if (text === "CHIVILCOY (BUE)" || (text.includes("(") && text.includes(")"))) {
          if (!destination) destination = text;
        }
      });

      // Extraer historial de la tabla
      const timeline: TimelineEvent[] = [];
      const table = respuestaDiv.querySelector("table");

      if (table) {
        const rows = table.querySelectorAll("tr");
        // Saltar la primera fila (encabezado)
        for (let i = 1; i < rows.length; i++) {
          const cells = rows[i].querySelectorAll("td");
          if (cells.length >= 2) {
            const datetime = getText(cells[0]);
            const status = getText(cells[1]);

            if (datetime && status) {
              timeline.push({
                location: "", // BusPack no muestra ubicación en el historial
                datetime,
                status,
              });
            }
          }
        }
      }

      return {
        trackingNumber,
        origin: "", // BusPack no muestra origen explícitamente
        destination,
        pieces,
        weight,
        signedBy,
        service: "BusPack", // Servicio por defecto
        carrier: "BusPack", // Identificar la empresa transportista
        timeline,
        incidents: "No hay incidencias.", // BusPack no muestra incidencias
        // Datos adicionales específicos de BusPack
        currentStatus,
        deliveryDate,
        pieceNumbers,
        documentType,
      };
    });


    // Validar que se encontraron datos válidos
    if (!data.trackingNumber || data.trackingNumber.trim() === "") {
      return {
        success: false,
        error: "Número de comprobante no encontrado. Verifica los parámetros (Letra, Boca, Numero).",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error en scraper BusPack:", error);
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
