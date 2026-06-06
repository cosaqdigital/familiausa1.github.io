import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://familiausa1.com",
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file"
  }
});
