// SPA (client-only) com casca prerenderizada em /index.html para o Nginx,
// mantendo o bundle de servidor (nitro) usado pelo preview/publish da Lovable.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    spa: { enabled: true },
  },
});
