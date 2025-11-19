import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  serverExternalPackages: [
    "puppeteer-core",
    "@sparticuz/chromium-min",
  ],
};

export default nextConfig;
