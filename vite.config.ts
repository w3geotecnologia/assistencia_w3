// SPA build: TanStack Start sem SSR, com prerender da rota raiz para
// gerar um index.html estático que o Nginx (Coolify/Docker) pode servir.
// O bundle de servidor continua sendo gerado para o preview/publish da Lovable.
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
