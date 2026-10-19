import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { loadEnv } from "vite";
import { readSiteConfig } from "./config/site.mjs";

const site = readSiteConfig(
  loadEnv(process.env.NODE_ENV || "production", process.cwd(), ""),
);

export default defineConfig({
  output: "static",
  devToolbar: { enabled: false },
  redirects: {
    "/journal": { status: 302, destination: "https://www.tomljournal.com" },
  },
  integrations: [react()],
  site: site.url,
});
