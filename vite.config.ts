import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

import { VitePWA } from "vite-plugin-pwa";

import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    vueDevTools(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Habby - 習慣記録アプリ",
        short_name: "Habby",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#42b883",
        icons: [
          {
            src: "/img/icons/favicon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/img/icons/favicon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
    // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    quasar({
      sassVariables: fileURLToPath(
        new URL("./src/quasar-variables.sass", import.meta.url)
      ),
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
