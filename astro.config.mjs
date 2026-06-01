import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://snoodlr.com",
  adapter: node({
    mode: "standalone"
  }),
  integrations: [react()],
});
