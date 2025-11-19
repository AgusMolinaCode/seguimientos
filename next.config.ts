import type { NextConfig } from "next";

const nextConfig = {
  cacheComponents: true,
  serverExternalPackages: [
    "puppeteer-core",
    "@sparticuz/chromium",
  ],
  experimental: {
    outputFileTracingIncludes: {
      "/**": ["./node_modules/@sparticuz/chromium/bin/**/*"],
    },
  },
};

export default nextConfig;
