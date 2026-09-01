// Dois modos de build:
// - padrão (Lovable preview/publish): SSR + bundle de servidor (nitro).
// - SPA_BUILD=1 (Coolify/Docker + Nginx): client-only, com a casca
//   prerenderizada em dist/client/index.html e sem bundle de servidor.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const spaBuild = process.env["SPA_BUILD"] === "1";

export default defineConfig(
  spaBuild
    ? {
        nitro: false,
        tanstackStart: {
          spa: { enabled: true, prerender: { outputPath: "/index.html" } },
          prerender: { enabled: true, crawlLinks: false },
        },
      }
    : {},
);
