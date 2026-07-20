import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://familiausa1.com",
  output: "static",
  trailingSlash: "never",
  integrations: [mdx()],
  build: {
    format: "file"
  }
});
