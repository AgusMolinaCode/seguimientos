# 📦 Seguimientos

> **Tu centro unificado para el rastreo de envíos en tiempo real.**

Este proyecto es una solución moderna y eficiente para centralizar el seguimiento de paquetería de múltiples empresas de logística en Argentina. Diseñado con una interfaz limpia y una arquitectura robusta, permite consultar el estado de tus envíos sin necesidad de navegar por múltiples sitios web.

---

## 🚀 Tecnologías Utilizadas


El proyecto está construido sobre un stack tecnológico de vanguardia, priorizando el rendimiento, la experiencia de usuario y la capacidad de ejecución en entornos serverless.

### 🎨 Frontend & UI
*   **Next.js 16 (App Router):** El corazón de la aplicación, aprovechando las últimas características de React Server Components para una carga veloz y SEO optimizado.
*   **React 19:** Utilizando las últimas APIs y hooks para una interactividad fluida.
*   **Tailwind CSS 4:** Para un diseño responsivo, moderno y altamente personalizable.
*   **GSAP & tw-animate-css:** Potenciando la experiencia visual con animaciones suaves y profesionales.
*   **Radix UI:** Componentes accesibles y robustos para la construcción de la interfaz.
*   **Lucide React:** Iconografía limpia y consistente.

### ⚙️ Backend & Lógica
*   **TypeScript:** Tipado estático para asegurar la robustez y mantenibilidad del código.
*   **Server Actions:** Toda la lógica de scraping se ejecuta en el servidor, manteniendo el cliente ligero y seguro.
*   **Zod & React Hook Form:** Validación de esquemas y manejo de formularios eficiente y seguro.

### 🕷️ Motor de Scraping
*   **Puppeteer Core:** Automatización de navegadores para extraer información en tiempo real de los portales de los transportistas.
*   **@sparticuz/chromium:** Versión optimizada de Chromium diseñada específicamente para ejecutarse en entornos AWS Lambda y Vercel, permitiendo que el scraping funcione en la nube sin problemas.

---

## 🚚 Empresas Soportadas

La plataforma integra consultas directas a los sistemas de seguimiento de las siguientes empresas:

| Empresa | Tipo de Servicio |
| :--- | :--- |
| **🔵 Andreani** | Logística y correo privado. |
| **🟡 Mercado Libre / Correo Arg.** | Envíos de e-commerce y correo nacional. |
| **🟣 OCA** | Logística y correo privado. |
| **🔴 Via Cargo** | Envíos de encomiendas. |
| **🟢 BusPack** | Envíos de encomiendas. |

---

## 💡 ¿Cómo Funciona?

1.  **Selección:** El usuario elige la empresa transportista desde el dashboard principal.
2.  **Consulta:** Al ingresar el número de seguimiento, la aplicación dispara una **Server Action**.
3.  **Procesamiento:** En el servidor, una instancia ligera de Chromium (vía Puppeteer) navega invisiblemente al sitio del transportista.
4.  **Extracción:** Se simula la interacción humana para obtener los datos más recientes del envío, evitando bloqueos y asegurando información fresca.
5.  **Visualización:** Los datos se normalizan y se presentan en una línea de tiempo clara y fácil de entender para el usuario.
6.  **Historial:** Las consultas recientes se guardan localmente para un acceso rápido posterior.

---

### ✨ Características Destacadas

*   **Diseño Responsive:** Funciona perfectamente en móviles, tablets y escritorio.
*   **Modo Serverless:** Optimizado para desplegarse en Vercel sin configuración de servidores complejos.
*   **Feedback Visual:** Indicadores de carga (skeletons) y estados claros para una mejor UX.
