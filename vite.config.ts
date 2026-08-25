// SPA build: TanStack Start sem SSR, com prerender da rota raiz para
// gerar um index.html estático que o Nginx pode servir com SPA fallback.
// Cloudflare plugin desabilitado — deploy é via Coolify/Docker + Nginx.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: false,
  tanstackStart: {
    spa: {
      enabled: true,
      prerender: {
        outputPath: "/index.html",
      },
    },
    prerender: {
      enabled: true,
      crawlLinks: false,
    },
  },
});
