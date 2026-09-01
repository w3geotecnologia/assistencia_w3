// SPA build (TanStack Start sem SSR): a casca é prerenderizada para /index.html.
// O bundle de servidor continua sendo gerado (nitro) — é o que o preview e o
// publish da Lovable usam. O deploy Coolify/Docker usa apenas dist/client.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    spa: {
      enabled: true,
      prerender: {
        outputPath: "/index.html",
      },
    },
  },
});
